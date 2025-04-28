
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
    // Add more mock employees as needed
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
  const itemsPerPage = 10;

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
    setCurrentPage(1); // Reset to first page when filters change
  }, [employees, searchQuery, deptFilter, statusFilter, sortField, sortDirection]);

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
    speak(`Viewing profile for ${employee.firstName} ${employee.lastName}`);
    // Will be implemented later with router navigation
    toast({
      title: "View Employee",
      description: `Viewing profile for ${employee.firstName} ${employee.lastName}`,
    });
  };

  // Edit employee
  const handleEditEmployee = (employee: Employee) => {
    speak(`Editing profile for ${employee.firstName} ${employee.lastName}`);
    // Will be implemented later with modal or navigation
    toast({
      title: "Edit Employee",
      description: `Editing profile for ${employee.firstName} ${employee.lastName}`,
    });
  };

  // Delete employee
  const handleDeleteEmployee = (employee: Employee) => {
    speak(`Deleting profile for ${employee.firstName} ${employee.lastName}`);
    // Will be implemented later with confirmation dialog
    toast({
      title: "Delete Employee",
      description: `Deleting profile for ${employee.firstName} ${employee.lastName}`,
    });
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
            <Button>
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
      </CardContent>
    </Card>
  );
};
