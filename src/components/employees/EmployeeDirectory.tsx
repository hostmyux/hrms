
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVoice } from '../../contexts/VoiceContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import {
  Search,
  UserPlus,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  Check,
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Employee type definition
type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  location: string;
  joiningDate: string;
  employeeId: string;
  status: 'active' | 'inactive' | 'onLeave' | 'probation';
  imageUrl?: string;
};

// Form schema
const employeeSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
  designation: z.string().min(2, { message: "Designation must be at least 2 characters." }),
  department: z.string().min(2, { message: "Department must be at least 2 characters." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  joiningDate: z.string(),
  employeeId: z.string().min(3, { message: "Employee ID must be at least 3 characters." }),
  status: z.enum(['active', 'inactive', 'onLeave', 'probation']),
});

// Mock data fetching function (replace with actual API call)
const fetchEmployees = async (): Promise<Employee[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      designation: 'Senior Developer',
      location: 'New York',
      joiningDate: '2021-06-12',
      employeeId: 'EMP001',
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      department: 'Marketing',
      designation: 'Marketing Manager',
      location: 'San Francisco',
      joiningDate: '2020-03-15',
      employeeId: 'EMP002',
      status: 'active'
    },
    {
      id: '3',
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@example.com',
      phone: '+1 (555) 456-7890',
      department: 'HR',
      designation: 'HR Specialist',
      location: 'Chicago',
      joiningDate: '2022-01-10',
      employeeId: 'EMP003',
      status: 'onLeave'
    },
    {
      id: '4',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@example.com',
      phone: '+1 (555) 234-5678',
      department: 'Finance',
      designation: 'Financial Analyst',
      location: 'Boston',
      joiningDate: '2021-09-05',
      employeeId: 'EMP004',
      status: 'active'
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Chen',
      email: 'david.chen@example.com',
      phone: '+1 (555) 345-6789',
      department: 'Engineering',
      designation: 'Frontend Developer',
      location: 'Seattle',
      joiningDate: '2022-03-20',
      employeeId: 'EMP005',
      status: 'active'
    },
    {
      id: '6',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@example.com',
      phone: '+1 (555) 456-7891',
      department: 'Marketing',
      designation: 'Content Specialist',
      location: 'San Francisco',
      joiningDate: '2021-11-15',
      employeeId: 'EMP006',
      status: 'active'
    },
    {
      id: '7',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@example.com',
      phone: '+1 (555) 567-8901',
      department: 'Product',
      designation: 'Product Manager',
      location: 'New York',
      joiningDate: '2020-08-01',
      employeeId: 'EMP007',
      status: 'onLeave'
    },
    {
      id: '8',
      firstName: 'Jennifer',
      lastName: 'Taylor',
      email: 'jennifer.taylor@example.com',
      phone: '+1 (555) 678-9012',
      department: 'Design',
      designation: 'UI/UX Designer',
      location: 'Austin',
      joiningDate: '2022-02-10',
      employeeId: 'EMP008',
      status: 'active'
    },
    {
      id: '9',
      firstName: 'James',
      lastName: 'Miller',
      email: 'james.miller@example.com',
      phone: '+1 (555) 789-0123',
      department: 'Sales',
      designation: 'Sales Representative',
      location: 'Chicago',
      joiningDate: '2021-04-18',
      employeeId: 'EMP009',
      status: 'active'
    },
    {
      id: '10',
      firstName: 'Patricia',
      lastName: 'Wilson',
      email: 'patricia.wilson@example.com',
      phone: '+1 (555) 890-1234',
      department: 'HR',
      designation: 'Recruitment Specialist',
      location: 'Denver',
      joiningDate: '2022-06-22',
      employeeId: 'EMP010',
      status: 'probation'
    },
    {
      id: '11',
      firstName: 'Thomas',
      lastName: 'Anderson',
      email: 'thomas.anderson@example.com',
      phone: '+1 (555) 901-2345',
      department: 'Engineering',
      designation: 'Backend Developer',
      location: 'San Jose',
      joiningDate: '2021-08-14',
      employeeId: 'EMP011',
      status: 'active'
    },
    {
      id: '12',
      firstName: 'Elizabeth',
      lastName: 'Martinez',
      email: 'elizabeth.martinez@example.com',
      phone: '+1 (555) 012-3456',
      department: 'Finance',
      designation: 'Accountant',
      location: 'Miami',
      joiningDate: '2022-01-30',
      employeeId: 'EMP012',
      status: 'inactive'
    }
  ];
};

export const EmployeeDirectory: React.FC = () => {
  const { toast } = useToast();
  const { speak } = useVoice();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Employee>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewEmployeeOpen, setIsViewEmployeeOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const itemsPerPage = 10;

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      designation: "",
      department: "",
      location: "",
      joiningDate: new Date().toISOString().split('T')[0],
      employeeId: "",
      status: "active",
    },
  });

  const editForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      designation: "",
      department: "",
      location: "",
      joiningDate: "",
      employeeId: "",
      status: "active",
    },
  });

  // Load employees on component mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
        setFilteredEmployees(data);
        speak("Employee directory loaded. You can search, filter, and manage employee records here.");
      } catch (error) {
        toast({
          title: "Error loading employees",
          description: "Failed to load employee directory. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, [speak, toast]);

  // Reset form when add employee sheet opens
  useEffect(() => {
    if (isAddEmployeeOpen) {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        location: "",
        joiningDate: new Date().toISOString().split('T')[0],
        employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
        status: "active",
      });
      speak("Add new employee form is open. Fill in the employee details and submit to create a new record.");
    }
  }, [isAddEmployeeOpen, form, employees.length, speak]);

  // Populate edit form when employee is selected
  useEffect(() => {
    if (selectedEmployee && isEditEmployeeOpen) {
      editForm.reset({
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        email: selectedEmployee.email,
        phone: selectedEmployee.phone,
        designation: selectedEmployee.designation,
        department: selectedEmployee.department,
        location: selectedEmployee.location,
        joiningDate: selectedEmployee.joiningDate,
        employeeId: selectedEmployee.employeeId,
        status: selectedEmployee.status,
      });
      speak(`Editing employee ${selectedEmployee.firstName} ${selectedEmployee.lastName}. Update any fields as needed and save changes.`);
    }
  }, [selectedEmployee, isEditEmployeeOpen, editForm, speak]);

  // Filter and sort employees when search query, filters, or sort parameters change
  useEffect(() => {
    let result = [...employees];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(emp => 
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.employeeId.toLowerCase().includes(query)
      );
    }
    
    // Apply department filter
    if (deptFilter !== 'all') {
      result = result.filter(emp => emp.department === deptFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(emp => emp.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField]?.toString().toLowerCase() || '';
      const bValue = b[sortField]?.toString().toLowerCase() || '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    
    setFilteredEmployees(result);
    // Only reset page if filters/search changed, not on initial load
    if (!isLoading) {
      setCurrentPage(1);
    }
  }, [employees, searchQuery, deptFilter, statusFilter, sortField, sortDirection, isLoading]);

  // Handle sort toggle
  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get status badge style
  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" /> Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <X className="w-3 h-3 mr-1" /> Inactive
          </span>
        );
      case 'onLeave':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Calendar className="w-3 h-3 mr-1" /> On Leave
          </span>
        );
      case 'probation':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Calendar className="w-3 h-3 mr-1" /> Probation
          </span>
        );
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // View employee details
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewEmployeeOpen(true);
    speak(`Viewing profile for ${employee.firstName} ${employee.lastName}. Here you can see all their details.`);
  };

  // Edit employee
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeOpen(true);
  };

  // Delete employee
  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteConfirmOpen(true);
    speak(`Confirm deletion of ${employee.firstName} ${employee.lastName}'s profile. This action cannot be undone.`);
  };
  
  // Confirm delete employee
  const confirmDeleteEmployee = () => {
    if (!selectedEmployee) return;
    
    const updatedEmployees = employees.filter(emp => emp.id !== selectedEmployee.id);
    setEmployees(updatedEmployees);
    setIsDeleteConfirmOpen(false);
    setSelectedEmployee(null);
    toast.success("Employee deleted", {
      description: `${selectedEmployee.firstName} ${selectedEmployee.lastName} has been removed from the directory.`
    });
    speak(`${selectedEmployee.firstName} ${selectedEmployee.lastName}'s profile has been successfully deleted.`);
  };

  // Add new employee
  const onSubmitNewEmployee = (values: z.infer<typeof employeeSchema>) => {
    const newEmployee: Employee = {
      id: String(employees.length + 1),
      ...values
    };
    
    setEmployees([...employees, newEmployee]);
    setIsAddEmployeeOpen(false);
    toast.success("Employee added", {
      description: `${values.firstName} ${values.lastName} has been added to the directory.`
    });
    speak(`New employee ${values.firstName} ${values.lastName} has been successfully added to the directory.`);
  };

  // Update employee
  const onSubmitUpdateEmployee = (values: z.infer<typeof employeeSchema>) => {
    if (!selectedEmployee) return;
    
    const updatedEmployees = employees.map(emp => 
      emp.id === selectedEmployee.id ? { ...emp, ...values } : emp
    );
    
    setEmployees(updatedEmployees);
    setIsEditEmployeeOpen(false);
    setSelectedEmployee(null);
    toast.success("Employee updated", {
      description: `${values.firstName} ${values.lastName}'s information has been updated.`
    });
    speak(`${values.firstName} ${values.lastName}'s information has been successfully updated.`);
  };

  // Get unique departments for filter
  const departments = ['all', ...new Set(employees.map(emp => emp.department))];

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <User className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-medium">Employee Directory</h3>
            <div className="ml-3 flex items-center bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
              {filteredEmployees.length} employees
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="w-full sm:w-[250px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddEmployeeOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Filters:</span>
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.filter(d => d !== 'all').map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="onLeave">On Leave</SelectItem>
                <SelectItem value="probation">Probation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <button 
                    className="flex items-center hover:text-primary"
                    onClick={() => handleSort('lastName')}
                  >
                    Employee Name
                    {sortField === 'lastName' && (
                      sortDirection === 'asc' 
                        ? <ChevronDown className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
                    )}
                  </button>
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>
                  <button 
                    className="flex items-center hover:text-primary"
                    onClick={() => handleSort('department')}
                  >
                    Department
                    {sortField === 'department' && (
                      sortDirection === 'asc' 
                        ? <ChevronDown className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
                    )}
                  </button>
                </TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <User size={48} strokeWidth={1.5} className="mb-2" />
                      {searchQuery || deptFilter !== 'all' || statusFilter !== 'all' ? (
                        <p>No employees match your search criteria.</p>
                      ) : (
                        <p>No employees found. Add your first employee record.</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.location}</TableCell>
                    <TableCell>{formatDate(employee.joiningDate)}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewEmployee(employee)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteEmployee(employee)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredEmployees.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
              </span>{" "}
              of <span className="font-medium">{filteredEmployees.length}</span> employees
            </p>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Add Employee Sheet */}
        <Sheet open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Add New Employee</SheetTitle>
              <SheetDescription>
                Fill out the form below to add a new employee to the directory.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitNewEmployee)} className="space-y-4">
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
                            <Input placeholder="Doe" {...field} />
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
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
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
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input placeholder="Senior Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
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
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input placeholder="EMP001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="onLeave">On Leave</SelectItem>
                            <SelectItem value="probation">Probation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-4 flex justify-end">
                    <Button type="submit">Add Employee</Button>
                  </div>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Employee Dialog */}
        <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
          <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update employee information using the form below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onSubmitUpdateEmployee)} className="space-y-4">
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
                            <Input placeholder="Doe" {...field} />
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
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
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
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input placeholder="Senior Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={editForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
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
                  <FormField
                    control={editForm.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input placeholder="EMP001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="onLeave">On Leave</SelectItem>
                            <SelectItem value="probation">Probation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <Button variant="outline" type="button" onClick={() => setIsEditEmployeeOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Employee Dialog */}
        <Dialog open={isViewEmployeeOpen} onOpenChange={setIsViewEmployeeOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
              {selectedEmployee && (
                <DialogDescription>
                  Complete profile information for {selectedEmployee.firstName} {selectedEmployee.lastName}
                </DialogDescription>
              )}
            </DialogHeader>
            {selectedEmployee && (
              <div className="py-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                  <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
                    <User size={32} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                    <p className="text-muted-foreground">{selectedEmployee.designation}</p>
                    <div className="mt-2">{getStatusBadge(selectedEmployee.status)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedEmployee.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedEmployee.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                      <div className="mt-2">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedEmployee.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Employment Details</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedEmployee.department}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Joined on {formatDate(selectedEmployee.joiningDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>ID: {selectedEmployee.employeeId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewEmployeeOpen(false)}>Close</Button>
              {selectedEmployee && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsViewEmployeeOpen(false);
                      handleEditEmployee(selectedEmployee);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setIsViewEmployeeOpen(false);
                      handleDeleteEmployee(selectedEmployee);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this employee? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="py-4">
                <p className="font-medium">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                <p className="text-sm text-muted-foreground">{selectedEmployee.designation} • {selectedEmployee.department}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDeleteEmployee}>
                Delete Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
