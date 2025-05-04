import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Plus, Search, Eye, UserPlus } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { toast } from 'sonner';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  location: string;
  joiningDate: string;
  employeeId: string;
  status: 'active' | 'onLeave' | 'inactive' | 'probation';
}

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  location: string;
  joiningDate: string;
  employeeId: string;
  status: 'active' | 'onLeave' | 'inactive' | 'probation';
}

const filterEmployees = (employees: Employee[], query: string): Employee[] => {
  const lowerCaseQuery = query.toLowerCase();
  return employees.filter(employee =>
    employee.firstName.toLowerCase().includes(lowerCaseQuery) ||
    employee.lastName.toLowerCase().includes(lowerCaseQuery) ||
    employee.email.toLowerCase().includes(lowerCaseQuery) ||
    employee.designation.toLowerCase().includes(lowerCaseQuery) ||
    employee.department.toLowerCase().includes(lowerCaseQuery)
  );
};

const itemsPerPage = 5;

export const EmployeeDirectory: React.FC = () => {
  const { speak } = useVoice();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      designation: 'Software Engineer',
      department: 'Engineering',
      location: 'New York',
      joiningDate: '2022-01-01',
      employeeId: 'E001',
      status: 'active',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '987-654-3210',
      designation: 'Marketing Manager',
      department: 'Marketing',
      location: 'Los Angeles',
      joiningDate: '2022-02-15',
      employeeId: 'E002',
      status: 'active',
    },
    {
      id: '3',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      phone: '555-123-4567',
      designation: 'HR Specialist',
      department: 'Human Resources',
      location: 'Chicago',
      joiningDate: '2022-03-10',
      employeeId: 'E003',
      status: 'onLeave',
    },
    {
      id: '4',
      firstName: 'Bob',
      lastName: 'Williams',
      email: 'bob.williams@example.com',
      phone: '777-888-9999',
      designation: 'Financial Analyst',
      department: 'Finance',
      location: 'Houston',
      joiningDate: '2022-04-01',
      employeeId: 'E004',
      status: 'active',
    },
    {
      id: '5',
      firstName: 'Emily',
      lastName: 'Brown',
      email: 'emily.brown@example.com',
      phone: '111-222-3333',
      designation: 'Sales Representative',
      department: 'Sales',
      location: 'Miami',
      joiningDate: '2022-05-05',
      employeeId: 'E005',
      status: 'inactive',
    },
    {
      id: '6',
      firstName: 'David',
      lastName: 'Lee',
      email: 'david.lee@example.com',
      phone: '444-555-6666',
      designation: 'Project Manager',
      department: 'Project Management',
      location: 'San Francisco',
      joiningDate: '2022-06-20',
      employeeId: 'E006',
      status: 'probation',
    },
    {
      id: '7',
      firstName: 'Olivia',
      lastName: 'Garcia',
      email: 'olivia.garcia@example.com',
      phone: '222-333-4444',
      designation: 'Data Scientist',
      department: 'Data Science',
      location: 'Seattle',
      joiningDate: '2022-07-12',
      employeeId: 'E007',
      status: 'active',
    },
    {
      id: '8',
      firstName: 'Liam',
      lastName: 'Martinez',
      email: 'liam.martinez@example.com',
      phone: '666-777-8888',
      designation: 'UX Designer',
      department: 'Design',
      location: 'Austin',
      joiningDate: '2022-08-01',
      employeeId: 'E008',
      status: 'active',
    },
    {
      id: '9',
      firstName: 'Sophia',
      lastName: 'Anderson',
      email: 'sophia.anderson@example.com',
      phone: '888-999-0000',
      designation: 'Business Analyst',
      department: 'Analytics',
      location: 'Boston',
      joiningDate: '2022-09-15',
      employeeId: 'E009',
      status: 'active',
    },
    {
      id: '10',
      firstName: 'Noah',
      lastName: 'Thomas',
      email: 'noah.thomas@example.com',
      phone: '333-444-5555',
      designation: 'IT Support Specialist',
      department: 'IT',
      location: 'Denver',
      joiningDate: '2022-10-10',
      employeeId: 'E010',
      status: 'active',
    }
  ]);

  const filteredEmployees = filterEmployees(employees, searchQuery);
  const pageCount = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const form = useForm<Employee>({
    defaultValues: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      designation: '',
      department: '',
      location: '',
      joiningDate: '',
      employeeId: '',
      status: 'active',
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleAddEmployee = () => {
    setIsAddDialogOpen(true);
    form.reset({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      designation: '',
      department: '',
      location: '',
      joiningDate: '',
      employeeId: '',
      status: 'active',
    });
    speak("Opening the add employee form. Please fill out all required fields to create a new employee record. You'll need to provide personal details, contact information, and job-related information.");
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
    form.reset(employee);
    speak(`Editing employee record for ${employee.firstName} ${employee.lastName}. You can update any of the fields and save changes when ready.`);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
    speak(`Confirming deletion of employee record for ${employee.firstName} ${employee.lastName}. This action cannot be undone.`);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
    speak(`Viewing detailed employee information for ${employee.firstName} ${employee.lastName}, ${employee.designation} in the ${employee.department} department.`);
  };

  const onSubmitAdd = (data: Employee) => {
    const newEmployee = {
      ...data,
      id: Date.now().toString(),
    };
    setEmployees(prev => [...prev, newEmployee]);
    setIsAddDialogOpen(false);
    toast(`Employee ${data.firstName} ${data.lastName} has been added successfully.`);
    speak(`Employee ${data.firstName} ${data.lastName} has been added successfully to the system.`);
  };

  const onSubmitEdit = (data: Employee) => {
    if (!selectedEmployee) return;
    
    const updatedEmployee: Employee = {
      ...data,
      id: selectedEmployee.id,
    };
    
    setEmployees(prev => prev.map(emp => emp.id === selectedEmployee.id ? updatedEmployee : emp));
    setIsEditDialogOpen(false);
    toast(`Employee ${data.firstName} ${data.lastName}'s information has been updated.`);
    speak(`Employee ${data.firstName} ${data.lastName}'s information has been successfully updated.`);
  };

  const onConfirmDelete = () => {
    if (!selectedEmployee) return;
    
    setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));
    setIsDeleteDialogOpen(false);
    toast(`Employee ${selectedEmployee.firstName} ${selectedEmployee.lastName} has been removed.`);
    speak(`Employee ${selectedEmployee.firstName} ${selectedEmployee.lastName} has been successfully removed from the system.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Employee Directory</h2>
        <Button onClick={handleAddEmployee}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <Search className="h-5 w-5 text-gray-500" />
      </div>

      <Table>
        <TableCaption>A list of your employees.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Employee ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Joining Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEmployees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.employeeId}</TableCell>
              <TableCell>{employee.firstName}</TableCell>
              <TableCell>{employee.lastName}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell>{employee.designation}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.location}</TableCell>
              <TableCell>{employee.joiningDate}</TableCell>
              <TableCell>{employee.status}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleViewEmployee(employee)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditEmployee(employee)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(employee)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === pageCount || pageCount === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>
              Create a new employee record.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: 'First name is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.firstName?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ required: 'Last name is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.lastName?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: 'Email is required.',
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Invalid email format.',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{ required: 'Phone number is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="designation"
                  rules={{ required: 'Designation is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input placeholder="Designation" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.designation?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  rules={{ required: 'Department is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Department" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.department?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  rules={{ required: 'Location is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.location?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="joiningDate"
                  rules={{ required: 'Joining date is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Joining Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.joiningDate?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employeeId"
                  rules={{ required: 'Employee ID is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Employee ID" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.employeeId?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  rules={{ required: 'Status is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="onLeave">On Leave</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="probation">Probation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage>{form.formState.errors.status?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Employee</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Edit employee record.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: 'First name is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.firstName?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ required: 'Last name is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.lastName?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: 'Email is required.',
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Invalid email format.',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{ required: 'Phone number is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="designation"
                  rules={{ required: 'Designation is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input placeholder="Designation" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.designation?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  rules={{ required: 'Department is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Department" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.department?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  rules={{ required: 'Location is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.location?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="joiningDate"
                  rules={{ required: 'Joining date is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Joining Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.joiningDate?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employeeId"
                  rules={{ required: 'Employee ID is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Employee ID" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.employeeId?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  rules={{ required: 'Status is required.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="onLeave">On Leave</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="probation">Probation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage>{form.formState.errors.status?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Employee</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Employee Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEmployee?.firstName} {selectedEmployee?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" onClick={onConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Employee Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              View employee record.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{selectedEmployee?.firstName} {selectedEmployee?.lastName}</h3>
              <p className="text-sm text-muted-foreground">{selectedEmployee?.designation} - {selectedEmployee?.department}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Contact Information</h4>
              <p className="text-sm">Email: {selectedEmployee?.email}</p>
              <p className="text-sm">Phone: {selectedEmployee?.phone}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Employment Details</h4>
              <p className="text-sm">Employee ID: {selectedEmployee?.employeeId}</p>
              <p className="text-sm">Joining Date: {selectedEmployee?.joiningDate}</p>
              <p className="text-sm">Location: {selectedEmployee?.location}</p>
              <p className="text-sm">Status: {selectedEmployee?.status}</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
