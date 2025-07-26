
import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/toastHelpers';
import { useVoice } from '../../contexts/VoiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar, Plus, Clock, Eye, Check, X, FileText, User, Home, Briefcase } from 'lucide-react';
import { format, differenceInCalendarDays } from 'date-fns';
import { useForm } from 'react-hook-form';

// Types
type LeaveType = 'annual' | 'sick' | 'personal' | 'bereavement' | 'maternity' | 'paternity' | 'unpaid' | 'work-from-home';
type LeaveStatus = 'pending' | 'approved' | 'rejected';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  duration: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedDate?: Date;
  notes?: string;
  dateRequested: Date;
}

interface LeaveBalance {
  annual: number;
  sick: number;
  personal: number;
  other: number;
}

interface LeaveFormData {
  type: LeaveType;
  startDate: Date | undefined;
  endDate: Date | undefined;
  reason: string;
}

interface ApprovalFormData {
  notes: string;
}

// Mock data functions
const fetchLeaveRequests = async (): Promise<LeaveRequest[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const today = new Date();
  
  return [
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      department: 'Engineering',
      type: 'annual',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
      duration: 6,
      reason: 'Family vacation',
      status: 'pending',
      dateRequested: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      department: 'Marketing',
      type: 'sick',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
      duration: 3,
      reason: 'Fever and cold',
      status: 'approved',
      approvedBy: 'HR Manager',
      approvedDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
      dateRequested: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8)
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Robert Johnson',
      department: 'HR',
      type: 'personal',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      duration: 1,
      reason: 'Personal appointment',
      status: 'rejected',
      notes: 'Critical team meeting on this day',
      approvedBy: 'HR Manager',
      approvedDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      dateRequested: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)
    },
    {
      id: '4',
      employeeId: 'EMP004',
      employeeName: 'Sarah Johnson',
      department: 'Finance',
      type: 'work-from-home',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      duration: 1,
      reason: 'Plumber coming for home repairs',
      status: 'pending',
      dateRequested: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
    }
  ];
};

const fetchHolidays = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const currentYear = new Date().getFullYear();
  
  return [
    { name: "New Year's Day", date: new Date(currentYear, 0, 1) },
    { name: "Memorial Day", date: new Date(currentYear, 4, 30) },
    { name: "Independence Day", date: new Date(currentYear, 6, 4) },
    { name: "Labor Day", date: new Date(currentYear, 8, 4) },
    { name: "Thanksgiving Day", date: new Date(currentYear, 10, 25) },
    { name: "Day after Thanksgiving", date: new Date(currentYear, 10, 26) },
    { name: "Christmas Eve", date: new Date(currentYear, 11, 24) },
    { name: "Christmas Day", date: new Date(currentYear, 11, 25) }
  ];
};

const fetchLeaveBalance = async (): Promise<LeaveBalance> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    annual: 15,
    sick: 10,
    personal: 5,
    other: 3
  };
};

export const LeaveManagement: React.FC = () => {
  // Using toast from sonner import
  const { speak } = useVoice();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [holidays, setHolidays] = useState<{name: string, date: Date}[]>([]);
  const [isHolidaysDialogOpen, setIsHolidaysDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('leaves');

  const form = useForm<LeaveFormData>({
    defaultValues: {
      type: 'annual',
      startDate: undefined,
      endDate: undefined,
      reason: ''
    }
  });

  const approvalForm = useForm<ApprovalFormData>({
    defaultValues: {
      notes: ''
    }
  });

  // Load leave data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [requests, balance, holidaysList] = await Promise.all([
          fetchLeaveRequests(),
          fetchLeaveBalance(),
          fetchHolidays()
        ]);
        setLeaveRequests(requests);
        setLeaveBalance(balance);
        setHolidays(holidaysList);
        speak("Leave management loaded. HR managers and supervisors can approve or reject leave requests, manage work from home requests, and view company holidays.");
      } catch (error) {
        toast({
          title: "Error loading leave data",
          description: "Failed to load leave information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [speak, toast]);

  // Filter leave requests by status
  const filteredLeaveRequests = statusFilter === 'all'
    ? leaveRequests
    : leaveRequests.filter(req => req.status === statusFilter);

  // Handle new leave request
  const handleSubmitLeave = (data: LeaveFormData) => {
    if (!data.startDate || !data.endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates for your leave request.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate duration
    const duration = differenceInCalendarDays(data.endDate, data.startDate) + 1;
    
    // Create new leave request
    const newLeave: LeaveRequest = {
      id: `tmp-${Date.now()}`,
      employeeId: 'EMP001', // Current user
      employeeName: 'John Doe', // Current user
      department: 'Engineering', // Current user's department
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      duration,
      reason: data.reason,
      status: 'pending',
      dateRequested: new Date()
    };
    
    // Add to state (would be an API call in real implementation)
    setLeaveRequests(prev => [newLeave, ...prev]);
    
    // Close dialog
    setIsAddLeaveOpen(false);
    
    // Show success message
    toast({
      title: "Leave request submitted",
      description: `Your ${data.type} leave request has been submitted successfully.`,
    });
    
    speak(`Your ${data.type} leave request has been submitted successfully and is pending approval.`);
    
    // Reset form
    form.reset();
  };

  // Handle view leave details
  const handleViewLeave = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setIsViewDetailsOpen(true);
  };

  // Handle approval dialog
  const handleOpenApprovalDialog = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setIsApprovalDialogOpen(true);
    speak(`Preparing to approve leave request for ${leave.employeeName}. You can add optional approval notes before confirming.`);
  };

  // Handle rejection dialog
  const handleOpenRejectionDialog = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setIsRejectionDialogOpen(true);
    speak(`Preparing to reject leave request for ${leave.employeeName}. Please provide a reason for rejection before confirming.`);
  };

  // Handle approval submission
  const handleApproveLeave = (data: ApprovalFormData) => {
    if (!selectedLeave) return;
    
    // Update leave request
    const updatedRequests = leaveRequests.map(req => {
      if (req.id === selectedLeave.id) {
        return {
          ...req,
          status: 'approved' as LeaveStatus,
          approvedBy: 'HR Manager', // Current user
          approvedDate: new Date(),
          notes: data.notes || 'Approved'
        };
      }
      return req;
    });
    
    // Update state
    setLeaveRequests(updatedRequests);
    
    // Close dialog
    setIsApprovalDialogOpen(false);
    
    // Show success message
    toast({
      title: "Leave request approved",
      description: `You have approved ${selectedLeave.employeeName}'s leave request.`,
    });
    
    speak(`Leave request for ${selectedLeave.employeeName} has been approved. An email notification will be sent to the employee.`);
    
    // Reset form
    approvalForm.reset();
  };

  // Handle rejection submission
  const handleRejectLeave = (data: ApprovalFormData) => {
    if (!selectedLeave) return;
    
    // Update leave request
    const updatedRequests = leaveRequests.map(req => {
      if (req.id === selectedLeave.id) {
        return {
          ...req,
          status: 'rejected' as LeaveStatus,
          approvedBy: 'HR Manager', // Current user
          approvedDate: new Date(),
          notes: data.notes || 'Rejected'
        };
      }
      return req;
    });
    
    // Update state
    setLeaveRequests(updatedRequests);
    
    // Close dialog
    setIsRejectionDialogOpen(false);
    
    // Show success message
    toast({
      title: "Leave request rejected",
      description: `You have rejected ${selectedLeave.employeeName}'s leave request.`,
    });
    
    speak(`Leave request for ${selectedLeave.employeeName} has been rejected. An email notification will be sent to the employee with the provided reason.`);
    
    // Reset form
    approvalForm.reset();
  };

  // Get leave type display name
  const getLeaveTypeDisplay = (type: LeaveType) => {
    switch (type) {
      case 'annual': return 'Annual Leave';
      case 'sick': return 'Sick Leave';
      case 'personal': return 'Personal Leave';
      case 'bereavement': return 'Bereavement Leave';
      case 'maternity': return 'Maternity Leave';
      case 'paternity': return 'Paternity Leave';
      case 'unpaid': return 'Unpaid Leave';
      case 'work-from-home': return 'Work From Home';
    }
  };

  // Get leave type icon
  const getLeaveTypeIcon = (type: LeaveType) => {
    switch (type) {
      case 'work-from-home': return <Home size={16} className="mr-1" />;
      default: return <Briefcase size={16} className="mr-1" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" /> Rejected
          </span>
        );
    }
  };

  // Toggle between leaves and holidays tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'holidays') {
      speak("Company holiday calendar. These are the official holidays when the organization will be closed. You can view the complete list of holidays for the year.");
    } else {
      speak("Leave requests management. Here you can view, approve or reject employee time-off requests.");
    }
  };

  // View all holidays
  const handleViewHolidays = () => {
    setIsHolidaysDialogOpen(true);
    speak("Viewing all company holidays for the current year. This shows the complete list of official holidays and observances.");
  };

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
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary mr-2" />
            <CardTitle>Leave Management</CardTitle>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <div className="flex bg-muted rounded-md p-1">
              <button
                onClick={() => handleTabChange('leaves')}
                className={`px-3 py-1 text-sm font-medium rounded-sm ${activeTab === 'leaves' ? 'bg-background shadow' : ''}`}
              >
                Leave Requests
              </button>
              <button
                onClick={() => handleTabChange('holidays')}
                className={`px-3 py-1 text-sm font-medium rounded-sm ${activeTab === 'holidays' ? 'bg-background shadow' : ''}`}
              >
                Holidays
              </button>
            </div>
            
            <Button onClick={() => setIsAddLeaveOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Request Leave
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {activeTab === 'leaves' ? (
          <>
            {/* Leave Balance Cards */}
            {leaveBalance && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Annual Leave</h4>
                  <p className="text-2xl font-bold">{leaveBalance.annual} days</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Sick Leave</h4>
                  <p className="text-2xl font-bold">{leaveBalance.sick} days</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Personal Leave</h4>
                  <p className="text-2xl font-bold">{leaveBalance.personal} days</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Other Leave</h4>
                  <p className="text-2xl font-bold">{leaveBalance.other} days</p>
                </div>
              </div>
            )}
            
            {/* Leave Request Filters */}
            <div className="flex justify-end mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Leave Requests Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaveRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Calendar size={48} strokeWidth={1.5} className="mb-2" />
                          <p>No leave requests found with the selected filter.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeaveRequests.map(leave => (
                      <TableRow key={leave.id}>
                        <TableCell className="font-medium">
                          {leave.employeeName}
                          <div className="text-xs text-muted-foreground">{leave.department}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getLeaveTypeIcon(leave.type)}
                            {getLeaveTypeDisplay(leave.type)}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(leave.startDate, "MMM d, yyyy")} - {format(leave.endDate, "MMM d, yyyy")}
                          <div className="text-xs text-muted-foreground">{leave.duration} day{leave.duration > 1 ? 's' : ''}</div>
                        </TableCell>
                        <TableCell>{format(leave.dateRequested, "MMM d, yyyy")}</TableCell>
                        <TableCell>{getStatusBadge(leave.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {leave.status === 'pending' && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => handleOpenApprovalDialog(leave)} title="Approve">
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleOpenRejectionDialog(leave)} title="Reject">
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handleViewLeave(leave)} title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          // Holidays tab content
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Company Holidays</h3>
              <Button variant="outline" onClick={handleViewHolidays}>
                View All Holidays
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {holidays.slice(0, 6).map((holiday, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium">{holiday.name}</h4>
                  <p className="text-muted-foreground">{format(holiday.date, "MMMM d, yyyy")}</p>
                  <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-flex items-center ${
                    new Date() > holiday.date ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-700"
                  }`}>
                    {new Date() > holiday.date ? "Observed" : "Upcoming"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
      
      {/* Add Leave Dialog */}
      <Dialog open={isAddLeaveOpen} onOpenChange={setIsAddLeaveOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
            <DialogDescription>
              Submit a new leave request. Your request will be sent to your manager for approval.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitLeave)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="annual">Annual Leave</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="personal">Personal Leave</SelectItem>
                        <SelectItem value="bereavement">Bereavement Leave</SelectItem>
                        <SelectItem value="maternity">Maternity Leave</SelectItem>
                        <SelectItem value="paternity">Paternity Leave</SelectItem>
                        <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                        <SelectItem value="work-from-home">Work From Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-muted-foreground">Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-muted-foreground">Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Leave</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide a reason for your leave request"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This information will be visible to HR and your manager.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddLeaveOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>
              You are approving the leave request for {selectedLeave?.employeeName}.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...approvalForm}>
            <form onSubmit={approvalForm.handleSubmit(handleApproveLeave)} className="space-y-4">
              {selectedLeave && (
                <div className="border rounded-md p-4 bg-muted/50 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Employee</p>
                      <p className="text-sm">{selectedLeave.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm">{selectedLeave.department}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Leave Type</p>
                    <p className="text-sm">{getLeaveTypeDisplay(selectedLeave.type)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm">{format(selectedLeave.startDate, "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm">{format(selectedLeave.endDate, "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reason</p>
                    <p className="text-sm">{selectedLeave.reason}</p>
                  </div>
                </div>
              )}
              
              <FormField
                control={approvalForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approval Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any notes for this approval"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsApprovalDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">Approve</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Rejection Dialog */}
      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              You are rejecting the leave request for {selectedLeave?.employeeName}. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...approvalForm}>
            <form onSubmit={approvalForm.handleSubmit(handleRejectLeave)} className="space-y-4">
              {selectedLeave && (
                <div className="border rounded-md p-4 bg-muted/50 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Employee</p>
                      <p className="text-sm">{selectedLeave.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm">{selectedLeave.department}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Leave Type</p>
                    <p className="text-sm">{getLeaveTypeDisplay(selectedLeave.type)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm">{format(selectedLeave.startDate, "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm">{format(selectedLeave.endDate, "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reason</p>
                    <p className="text-sm">{selectedLeave.reason}</p>
                  </div>
                </div>
              )}
              
              <FormField
                control={approvalForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Rejection*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain why this leave request is being rejected"
                        className="resize-none"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This information will be shared with the employee.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsRejectionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="destructive">Reject</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* View All Holidays Dialog */}
      <Dialog open={isHolidaysDialogOpen} onOpenChange={setIsHolidaysDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Company Holidays</DialogTitle>
            <DialogDescription>
              Official company holidays for {new Date().getFullYear()}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Holiday</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holidays.map((holiday, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{holiday.name}</TableCell>
                    <TableCell>{format(holiday.date, "MMMM d, yyyy")}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        new Date() > holiday.date ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-700"
                      }`}>
                        {new Date() > holiday.date ? "Observed" : "Upcoming"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsHolidaysDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Leave Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              View detailed information about this leave request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLeave && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Employee</h4>
                  <p>{selectedLeave.employeeName}</p>
                  <p className="text-sm text-muted-foreground">{selectedLeave.department}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Status</h4>
                  <div>{getStatusBadge(selectedLeave.status)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold">Leave Type</h4>
                <div className="flex items-center">
                  {getLeaveTypeIcon(selectedLeave.type)}
                  {getLeaveTypeDisplay(selectedLeave.type)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Start Date</h4>
                  <p>{format(selectedLeave.startDate, "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">End Date</h4>
                  <p>{format(selectedLeave.endDate, "MMMM d, yyyy")}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold">Duration</h4>
                <p>{selectedLeave.duration} day{selectedLeave.duration > 1 ? 's' : ''}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold">Reason</h4>
                <p>{selectedLeave.reason}</p>
              </div>
              
              {selectedLeave.approvedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">Approved/Rejected By</h4>
                    <p>{selectedLeave.approvedBy}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Decision Date</h4>
                    <p>{selectedLeave.approvedDate ? format(selectedLeave.approvedDate, "MMMM d, yyyy") : 'N/A'}</p>
                  </div>
                </div>
              )}
              
              {selectedLeave.notes && (
                <div>
                  <h4 className="text-sm font-semibold">Notes</h4>
                  <p>{selectedLeave.notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
