
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeDirectory } from '../components/employees/EmployeeDirectory';
import { VoiceControls } from '../components/shared/VoiceControls';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, FileText, Users, Briefcase, Upload, Eye, Pencil, Trash2, Check } from 'lucide-react';
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Define form schema
const employeeProfileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
  position: z.string().min(2, { message: "Position must be at least 2 characters." }),
  department: z.string().min(2, { message: "Department must be at least 2 characters." }),
  joiningDate: z.string(),
});

const onboardingPlanSchema = z.object({
  employeeName: z.string().min(2, { message: "Employee name is required" }),
  position: z.string().min(2, { message: "Position is required" }),
  department: z.string().min(2, { message: "Department is required" }),
  startDate: z.string(),
  mentor: z.string().min(2, { message: "Mentor name is required" }),
  description: z.string().optional(),
  orientation: z.boolean().default(true),
  itSetup: z.boolean().default(true),
  paperwork: z.boolean().default(true),
  training: z.boolean().default(true),
});

const documentSchema = z.object({
  documentType: z.string().min(1, { message: "Document type is required" }),
  employeeId: z.string().min(1, { message: "Employee is required" }),
  description: z.string().optional(),
});

const mockProfiles = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    position: "Software Engineer",
    department: "Engineering",
    joiningDate: "2022-05-15",
    email: "john.smith@example.com",
    phone: "123-456-7890",
    status: 'active'
  },
  {
    id: 2,
    firstName: "Sarah",
    lastName: "Johnson",
    position: "HR Manager",
    department: "Human Resources",
    joiningDate: "2021-03-10",
    email: "sarah.johnson@example.com",
    phone: "234-567-8901",
    status: 'active'
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Brown",
    position: "Product Manager",
    department: "Product",
    joiningDate: "2023-01-22",
    email: "michael.brown@example.com",
    phone: "345-678-9012",
    status: 'on-leave'
  }
];

const mockDocumentTypes = [
  "Resume/CV", 
  "ID Proof", 
  "Address Proof", 
  "Educational Certificates", 
  "Experience Certificates",
  "Offer Letter",
  "Joining Letter",
  "Performance Reviews"
];

const mockOnboardingStatus = [
  { name: "Sarah Johnson", id: 1, progress: 100, position: "HR Manager", dept: "Human Resources" },
  { name: "Michael Brown", id: 2, progress: 85, position: "Product Manager", dept: "Product" },
  { name: "Emily Davis", id: 3, progress: 70, position: "UX Designer", dept: "Design" }
];

const mockUpcomingOnboarding = [
  { name: "Robert Wilson", id: 4, date: "May 20, 2025", position: "Frontend Developer", dept: "Engineering" },
  { name: "Jennifer Lee", id: 5, date: "May 25, 2025", position: "Marketing Specialist", dept: "Marketing" }
];

const mockDocuments = [
  { id: 1, name: "john_smith_resume.pdf", employee: "John Smith", type: "Resume/CV", date: "May 12, 2023" },
  { id: 2, name: "sarah_johnson_resume.pdf", employee: "Sarah Johnson", type: "Resume/CV", date: "Mar 05, 2022" },
  { id: 3, name: "michael_brown_resume.pdf", employee: "Michael Brown", type: "Resume/CV", date: "Jan 18, 2023" },
  { id: 4, name: "john_smith_id.pdf", employee: "John Smith", type: "ID Proof", date: "May 12, 2023" },
  { id: 5, name: "sarah_johnson_performance.pdf", employee: "Sarah Johnson", type: "Performance Reviews", date: "Dec 15, 2022" },
  { id: 6, name: "michael_brown_offer.pdf", employee: "Michael Brown", type: "Offer Letter", date: "Jan 10, 2023" },
];

const Employees: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = useState('directory');
  const [employees, setEmployees] = useState(mockProfiles);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [isViewingEmployee, setIsViewingEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [isCreatingOnboardingPlan, setIsCreatingOnboardingPlan] = useState(false);
  const [viewingOnboardingDetails, setViewingOnboardingDetails] = useState<any>(null);
  const [preparingOnboarding, setPreparingOnboarding] = useState<any>(null);
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([]);
  const [mentorOptions] = useState(['Alex Miller', 'Jessica Thompson', 'Thomas Anderson', 'Maria Rodriguez']);

  const form = useForm<z.infer<typeof employeeProfileSchema>>({
    resolver: zodResolver(employeeProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      joiningDate: new Date().toISOString().split('T')[0],
    },
  });

  const editForm = useForm<z.infer<typeof employeeProfileSchema>>({
    resolver: zodResolver(employeeProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      joiningDate: "",
    },
  });

  const onboardingForm = useForm<z.infer<typeof onboardingPlanSchema>>({
    resolver: zodResolver(onboardingPlanSchema),
    defaultValues: {
      employeeName: "",
      position: "",
      department: "",
      startDate: new Date().toISOString().split('T')[0],
      mentor: "",
      description: "",
      orientation: true,
      itSetup: true,
      paperwork: true,
      training: true,
    },
  });

  const documentForm = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documentType: mockDocumentTypes[0],
      employeeId: "",
      description: "",
    },
  });

  useEffect(() => {
    speak("Employee management module loaded. Here you can manage employee profiles, view directories, and handle employee information.");
  }, [speak]);

  useEffect(() => {
    if (selectedEmployee && isEditingEmployee) {
      editForm.reset({
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        email: selectedEmployee.email,
        phone: selectedEmployee.phone,
        position: selectedEmployee.position,
        department: selectedEmployee.department,
        joiningDate: selectedEmployee.joiningDate,
      });
    }
  }, [selectedEmployee, isEditingEmployee, editForm]);

  useEffect(() => {
    if (selectedDocType) {
      const docs = mockDocuments.filter(doc => doc.type === selectedDocType);
      setFilteredDocuments(docs);
    }
  }, [selectedDocType]);

  useEffect(() => {
    if (preparingOnboarding) {
      onboardingForm.reset({
        employeeName: preparingOnboarding.name,
        position: preparingOnboarding.position,
        department: preparingOnboarding.dept,
        startDate: new Date().toISOString().split('T')[0],
        mentor: mentorOptions[0],
        description: `Onboarding plan for ${preparingOnboarding.name} joining as ${preparingOnboarding.position}`,
        orientation: true,
        itSetup: true,
        paperwork: true,
        training: true,
      });
      setIsCreatingOnboardingPlan(true);
    }
  }, [preparingOnboarding, mentorOptions, onboardingForm]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      'directory': "Employee directory. View and search for employees across your organization.",
      'profiles': "Employee profiles. View and manage detailed employee information.",
      'onboarding': "Employee onboarding. Set up new employees with all necessary resources and information.",
      'documents': "Employee documents. Manage important employee files and documentation.",
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
  };

  function onSubmitProfile(values: z.infer<typeof employeeProfileSchema>) {
    const newEmployee = {
      id: employees.length + 1,
      firstName: values.firstName,
      lastName: values.lastName,
      position: values.position,
      department: values.department,
      joiningDate: values.joiningDate,
      email: values.email,
      phone: values.phone,
      status: 'active'
    };
    
    setEmployees([...employees, newEmployee]);
    speak("New employee profile has been created successfully.");
    toast.success("Employee created successfully", {
      description: `${values.firstName} ${values.lastName} has been added to the directory.`
    });
    form.reset();
  }

  function onSubmitEditProfile(values: z.infer<typeof employeeProfileSchema>) {
    if (!selectedEmployee) return;
    
    const updatedEmployees = employees.map(emp => 
      emp.id === selectedEmployee.id 
        ? { ...emp, ...values }
        : emp
    );
    
    setEmployees(updatedEmployees);
    setIsEditingEmployee(false);
    setSelectedEmployee(null);
    speak(`${values.firstName} ${values.lastName}'s profile has been updated successfully.`);
    toast.success("Employee updated successfully", {
      description: `${values.firstName} ${values.lastName}'s information has been updated.`
    });
  }

  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsViewingEmployee(true);
  };

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEditingEmployee(true);
  };

  const handleDeleteEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsConfirmingDelete(true);
  };

  const confirmDeleteEmployee = () => {
    if (!selectedEmployee) return;
    
    const updatedEmployees = employees.filter(emp => emp.id !== selectedEmployee.id);
    setEmployees(updatedEmployees);
    setIsConfirmingDelete(false);
    setSelectedEmployee(null);
    speak(`${selectedEmployee.firstName} ${selectedEmployee.lastName}'s profile has been deleted.`);
    toast.success("Employee deleted", {
      description: `${selectedEmployee.firstName} ${selectedEmployee.lastName} has been removed from the directory.`
    });
  };

  const handleViewDocuments = (docType: string) => {
    setSelectedDocType(docType);
    speak(`Viewing ${docType} documents. Here you can see all files and upload new ones.`);
  };

  const handleUploadDocument = () => {
    setIsUploadingDocument(true);
    speak("Opening document upload interface. You can select files and assign them to specific employees.");
  };
  
  const handleCreateOnboardingPlan = () => {
    setIsCreatingOnboardingPlan(true);
    speak("Creating a new onboarding plan. You can define tasks, assign mentors, and set up training schedules for new employees.");
  };

  const handlePrepareOnboarding = (employee: any) => {
    setPreparingOnboarding(employee);
    speak(`Preparing onboarding for ${employee.name}. Setting up workstation, accounts, and orientation schedule.`);
  };

  const handleSubmitOnboardingPlan = (values: z.infer<typeof onboardingPlanSchema>) => {
    setIsCreatingOnboardingPlan(false);
    setPreparingOnboarding(null);
    toast.success("Onboarding plan created", {
      description: `Onboarding plan for ${values.employeeName} has been created successfully.`
    });
    speak(`Onboarding plan for ${values.employeeName} has been created successfully. All tasks have been scheduled.`);
    onboardingForm.reset();
  };
  
  const handleSubmitDocumentUpload = (values: z.infer<typeof documentSchema>) => {
    setIsUploadingDocument(false);
    toast.success("Document uploaded successfully", {
      description: "The document has been added to employee records."
    });
    speak("Document has been uploaded successfully and added to the employee's records.");
    documentForm.reset();
  };

  const handleViewOnboarding = (employee: any) => {
    setViewingOnboardingDetails(employee);
    speak(`Viewing onboarding details for ${employee.name}. Here you can track the progress and manage onboarding tasks.`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage employee profiles, information, and work history.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="directory" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="directory" className="space-y-4">
          <EmployeeDirectory />
        </TabsContent>
        
        <TabsContent value="profiles" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employees.map(profile => (
              <Card key={profile.id}>
                <CardHeader>
                  <CardTitle>{profile.firstName} {profile.lastName}</CardTitle>
                  <CardDescription>{profile.position}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-[80px_1fr] gap-1">
                    <span className="text-sm text-muted-foreground font-medium">Department:</span>
                    <span>{profile.department}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-1">
                    <span className="text-sm text-muted-foreground font-medium">Joined:</span>
                    <span>{formatDate(profile.joiningDate)}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-1">
                    <span className="text-sm text-muted-foreground font-medium">Email:</span>
                    <span className="truncate">{profile.email}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-1">
                    <span className="text-sm text-muted-foreground font-medium">Phone:</span>
                    <span>{profile.phone}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleViewEmployee(profile)}>
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditEmployee(profile)}>
                    <Pencil size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteEmployee(profile)} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="flex flex-col items-center justify-center p-6 border-dashed border-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New Employee
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Add New Employee</SheetTitle>
                    <SheetDescription>
                      Create a new employee profile. Fill in all required information.
                    </SheetDescription>
                  </SheetHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="123-456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input placeholder="Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input placeholder="Engineering" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="joiningDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Joining Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Create Employee</Button>
                    </form>
                  </Form>
                </SheetContent>
              </Sheet>
            </Card>
          </div>

          {/* View Employee Dialog */}
          <ResponsiveDialog
            open={isViewingEmployee}
            onOpenChange={setIsViewingEmployee}
            title="Employee Profile"
            description={selectedEmployee ? `Detailed information for ${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ""}
            footer={
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsViewingEmployee(false);
                    handleEditEmployee(selectedEmployee);
                  }}>
                  <Pencil size={16} className="mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    setIsViewingEmployee(false);
                    handleDeleteEmployee(selectedEmployee);
                  }}>
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
                <Button onClick={() => setIsViewingEmployee(false)}>Close</Button>
              </div>
            }
          >
            {selectedEmployee && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedEmployee.position}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="text-sm">{selectedEmployee.email}</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="text-sm">{selectedEmployee.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Employment Details</h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-sm text-muted-foreground">Department:</span>
                        <span className="text-sm">{selectedEmployee.department}</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-sm text-muted-foreground">Position:</span>
                        <span className="text-sm">{selectedEmployee.position}</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-sm text-muted-foreground">Joined:</span>
                        <span className="text-sm">{formatDate(selectedEmployee.joiningDate)}</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedEmployee.status === 'active' ? 'bg-green-100 text-green-800' :
                            selectedEmployee.status === 'on-leave' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {selectedEmployee.status === 'active' ? 'Active' : 
                            selectedEmployee.status === 'on-leave' ? 'On Leave' : 
                            'Inactive'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ResponsiveDialog>

          {/* Edit Employee Dialog */}
          <Dialog open={isEditingEmployee} onOpenChange={setIsEditingEmployee}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Employee</DialogTitle>
                <DialogDescription>
                  Update information for {selectedEmployee?.firstName} {selectedEmployee?.lastName}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onSubmitEditProfile)} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={editForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="123-456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Engineering" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="joiningDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Joining Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditingEmployee(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Confirm Delete Dialog */}
          <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this employee? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              {selectedEmployee && (
                <div className="py-4">
                  <p>You are about to delete:</p>
                  <p className="font-semibold">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  <p className="text-sm text-muted-foreground">{selectedEmployee.position} in {selectedEmployee.department}</p>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDeleteEmployee}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="onboarding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Onboarding</CardTitle>
              <CardDescription>
                Manage onboarding processes for new employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Onboarding Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                          <span>Send welcome email</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                          <span>Prepare workstation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                            <Check className="h-4 w-4" />
                          </Button>
                          <span>Set up email account</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                            <Check className="h-4 w-4" />
                          </Button>
                          <span>Configure access rights</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                            <Check className="h-4 w-4" />
                          </Button>
                          <span>Schedule orientation</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Recent Onboardings</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          {mockOnboardingStatus.map((employee) => (
                            <div key={employee.id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{employee.name}</p>
                                  <p className="text-xs text-muted-foreground">{employee.position} • {employee.dept}</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewOnboarding(employee)}
                                >
                                  View
                                </Button>
                              </div>
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary" 
                                  style={{ width: `${employee.progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-right text-muted-foreground">{employee.progress}% complete</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Upcoming Onboardings</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          {mockUpcomingOnboarding.map((employee) => (
                            <div key={employee.id} className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-xs text-muted-foreground">{employee.position} • {employee.dept}</p>
                                <p className="text-sm text-muted-foreground">Start date: {employee.date}</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePrepareOnboarding(employee)}
                              >
                                Prepare
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCreateOnboardingPlan}>
                Create New Onboarding Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Create Onboarding Plan Dialog */}
          <Dialog open={isCreatingOnboardingPlan} onOpenChange={setIsCreatingOnboardingPlan}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Onboarding Plan</DialogTitle>
                <DialogDescription>
                  Set up an onboarding plan for a new employee joining your organization.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...onboardingForm}>
                <form onSubmit={onboardingForm.handleSubmit(handleSubmitOnboardingPlan)} className="space-y-4 py-4">
                  <FormField
                    control={onboardingForm.control}
                    name="employeeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={onboardingForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Software Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={onboardingForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="Engineering" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={onboardingForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={onboardingForm.control}
                    name="mentor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign Mentor</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a mentor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mentorOptions.map((mentor, index) => (
                              <SelectItem key={index} value={mentor}>{mentor}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The mentor will guide the new employee through the onboarding process.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={onboardingForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add any special instructions or notes for this onboarding process..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Onboarding Tasks</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="orientation" className="h-4 w-4" defaultChecked />
                        <label htmlFor="orientation" className="text-sm">Schedule orientation session</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="itSetup" className="h-4 w-4" defaultChecked />
                        <label htmlFor="itSetup" className="text-sm">Prepare IT equipment and accounts</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="paperwork" className="h-4 w-4" defaultChecked />
                        <label htmlFor="paperwork" className="text-sm">Complete all required paperwork</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="training" className="h-4 w-4" defaultChecked />
                        <label htmlFor="training" className="text-sm">Set up initial training sessions</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="intro" className="h-4 w-4" defaultChecked />
                        <label htmlFor="intro" className="text-sm">Schedule team introduction</label>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      setIsCreatingOnboardingPlan(false);
                      setPreparingOnboarding(null);
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Plan</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* View Onboarding Details Dialog */}
          <Dialog open={!!viewingOnboardingDetails} onOpenChange={() => setViewingOnboardingDetails(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Onboarding Details</DialogTitle>
                {viewingOnboardingDetails && (
                  <DialogDescription>
                    Onboarding progress for {viewingOnboardingDetails.name}
                  </DialogDescription>
                )}
              </DialogHeader>
              
              {viewingOnboardingDetails && (
                <div className="py-4 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{viewingOnboardingDetails.name}</h3>
                      <p className="text-muted-foreground">{viewingOnboardingDetails.position} • {viewingOnboardingDetails.dept}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{viewingOnboardingDetails.progress}% Complete</div>
                      <div className="h-2 w-24 bg-muted rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${viewingOnboardingDetails.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium border-b pb-2">Onboarding Tasks</h4>
                    
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                          <span>Complete paperwork</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Completed</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                          <span>IT setup</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Completed</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                          <span>Orientation</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Completed</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {viewingOnboardingDetails.progress < 100 ? (
                            <div className="h-5 w-5 rounded-full border border-primary flex items-center justify-center"></div>
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                          )}
                          <span>Team introduction</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {viewingOnboardingDetails.progress < 100 ? "Pending" : "Completed"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {viewingOnboardingDetails.progress < 100 ? (
                            <div className="h-5 w-5 rounded-full border border-primary flex items-center justify-center"></div>
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                          )}
                          <span>First week review</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {viewingOnboardingDetails.progress < 100 ? "Scheduled" : "Completed"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium border-b pb-2">Assigned Mentor</h4>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Alex Miller</p>
                        <p className="text-xs text-muted-foreground">Senior {viewingOnboardingDetails.dept} Specialist</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewingOnboardingDetails(null)}>Close</Button>
                <Button>Update Progress</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Documents</CardTitle>
              <CardDescription>
                Manage employee documents and files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockDocumentTypes.map((docType, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{docType}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {docType === "Resume/CV" 
                            ? "Employee resumés and curriculum vitae" 
                            : `Employee ${docType.toLowerCase()}`}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleViewDocuments(docType)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Files
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                  <Card className="flex flex-col items-center justify-center h-40 border-dashed border-2">
                    <Button variant="outline" className="flex flex-col h-full w-full" onClick={handleUploadDocument}>
                      <Upload className="h-8 w-8 mb-2" />
                      <span>Upload Document</span>
                    </Button>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document View Dialog */}
          <Dialog open={!!selectedDocType} onOpenChange={() => setSelectedDocType(null)}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>{selectedDocType} Documents</DialogTitle>
                <DialogDescription>
                  View and manage employee {selectedDocType} files
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map(doc => (
                      <Card key={doc.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{doc.name}</CardTitle>
                            <Button variant="ghost" size="sm">
                              <Eye size={16} />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{doc.employee}</span>
                            <span className="text-muted-foreground">Added {doc.date}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center p-6 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                      <h4 className="text-lg font-medium mb-2">No documents found</h4>
                      <p className="text-muted-foreground">No {selectedDocType} documents have been uploaded yet.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter className="justify-between space-x-2">
                <Button variant="outline" onClick={() => handleUploadDocument()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Add Document
                </Button>
                <Button onClick={() => setSelectedDocType(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Upload Document Dialog */}
          <Dialog open={isUploadingDocument} onOpenChange={setIsUploadingDocument}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Add a new document to employee records
                </DialogDescription>
              </DialogHeader>
              
              <Form {...documentForm}>
                <form onSubmit={documentForm.handleSubmit(handleSubmitDocumentUpload)} className="space-y-4 py-4">
                  <FormField
                    control={documentForm.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockDocumentTypes.map((docType, index) => (
                              <SelectItem key={index} value={docType}>{docType}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={documentForm.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id.toString()}>
                                {emp.firstName} {emp.lastName} - {emp.position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>File</FormLabel>
                    <div className="border-2 border-dashed border-input rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-center text-muted-foreground mb-1">
                        Drag & drop your file here, or click to browse
                      </p>
                      <p className="text-xs text-center text-muted-foreground">
                        Supports PDF, DOCX, JPG, PNG (Max 10MB)
                      </p>
                      <Button type="button" variant="ghost" className="mt-2">Browse Files</Button>
                    </div>
                  </div>
                  
                  <FormField
                    control={documentForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add a brief description of the document..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsUploadingDocument(false)}>Cancel</Button>
                    <Button type="submit">Upload Document</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Employees;
