
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeDirectory } from '../components/employees/EmployeeDirectory';
import { VoiceControls } from '../components/shared/VoiceControls';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, FileText, Users, Briefcase, Upload } from 'lucide-react';

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

const mockProfiles = [
  {
    id: 1,
    name: "John Smith",
    position: "Software Engineer",
    department: "Engineering",
    joiningDate: "2022-05-15",
    email: "john.smith@example.com",
    phone: "123-456-7890"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "HR Manager",
    department: "Human Resources",
    joiningDate: "2021-03-10",
    email: "sarah.johnson@example.com",
    phone: "234-567-8901"
  },
  {
    id: 3,
    name: "Michael Brown",
    position: "Product Manager",
    department: "Product",
    joiningDate: "2023-01-22",
    email: "michael.brown@example.com",
    phone: "345-678-9012"
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

const Employees: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = useState('directory');

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

  useEffect(() => {
    speak("Employee management module loaded. Here you can manage employee profiles, view directories, and handle employee information.");
  }, [speak]);

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
    console.log(values);
    speak("New employee profile has been created successfully.");
    form.reset();
  }

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
            {mockProfiles.map(profile => (
              <Card key={profile.id}>
                <CardHeader>
                  <CardTitle>{profile.name}</CardTitle>
                  <CardDescription>{profile.position}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-[80px_1fr] gap-1">
                    <span className="text-sm text-muted-foreground font-medium">Department:</span>
                    <span>{profile.department}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-1">
                    <span className="text-sm text-muted-foreground font-medium">Joined:</span>
                    <span>{new Date(profile.joiningDate).toLocaleDateString()}</span>
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
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">View Full Profile</Button>
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
              <div className="space-y-4">
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
                          <div className="h-6 w-6 rounded-full border border-gray-300"></div>
                          <span>Set up email account</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full border border-gray-300"></div>
                          <span>Configure access rights</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full border border-gray-300"></div>
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
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Sarah Johnson</span>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Michael Brown</span>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Emily Davis</span>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Upcoming Onboardings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <p>Robert Wilson</p>
                              <p className="text-sm text-muted-foreground">May 20, 2025</p>
                            </div>
                            <Button variant="outline" size="sm">Prepare</Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p>Jennifer Lee</p>
                              <p className="text-sm text-muted-foreground">May 25, 2025</p>
                            </div>
                            <Button variant="outline" size="sm">Prepare</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Create New Onboarding Plan</Button>
            </CardFooter>
          </Card>
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
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="mr-2 h-4 w-4" />
                          View Files
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                  <Card className="flex flex-col items-center justify-center h-40 border-dashed border-2">
                    <Button variant="outline" className="flex flex-col h-full w-full">
                      <Upload className="h-8 w-8 mb-2" />
                      <span>Upload Document</span>
                    </Button>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Employees;
