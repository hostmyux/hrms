
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { Calendar, Plus, Clock, Eye, Check, X, FileText, User } from 'lucide-react';
import { format, differenceInCalendarDays } from 'date-fns';
import { useForm } from 'react-hook-form';

// Types
type LeaveType = 'annual' | 'sick' | 'personal' | 'bereavement' | 'maternity' | 'paternity' | 'unpaid';
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
    }
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
  const { toast } = useToast();
  const { speak } = useVoice();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const form = useForm<LeaveFormData>({
    defaultValues: {
      type: 'annual',
      startDate: undefined,
      endDate: undefined,
      reason: ''
    }
  });

  // Load leave data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [requests, balance] = await Promise.all([
          fetchLeaveRequests(),
          fetchLeaveBalance()
        ]);
        setLeaveRequests(requests);
        setLeaveBalance(balance);
        speak("Leave management loaded. You can request and manage leave applications here.");
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
            
            <Button onClick={() => setIsAddLeaveOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Request Leave
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
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
                    <TableCell>{getLeaveTypeDisplay(leave.type)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(leave.startDate, "MMM d, yyyy")} - {format(leave.endDate, "MMM d, yyyy")}
                      <div className="text-xs text-muted-foreground">{leave.duration} day{leave.duration > 1 ? 's' : ''}</div>
                    </TableCell>
                    <TableCell>{format(leave.dateRequested, "MMM d, yyyy")}</TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleViewLeave(leave)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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
                <p>{getLeaveTypeDisplay(selectedLeave.type)}</p>
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
                    <h4 className="text-sm font-semibold">Approved By</h4>
                    <p>{selectedLeave.approvedBy}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Approval Date</h4>
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
