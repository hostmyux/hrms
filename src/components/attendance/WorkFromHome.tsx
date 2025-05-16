
import React, { useState } from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarPlus, Check, X, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface WfhRequest {
  id: number;
  employeeName: string;
  department: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

interface WfhRequestFormValues {
  startDate: string;
  endDate: string;
  reason: string;
}

export const WorkFromHome: React.FC = () => {
  const { speak } = useVoice();
  const [requests, setRequests] = useState<WfhRequest[]>([
    {
      id: 1,
      employeeName: "John Smith",
      department: "Engineering",
      startDate: "2025-05-20",
      endDate: "2025-05-25",
      reason: "Need to focus on completing the new API integration project with minimal interruptions.",
      status: "pending"
    },
    {
      id: 2,
      employeeName: "Sarah Johnson",
      department: "Marketing",
      startDate: "2025-05-18",
      endDate: "2025-05-19",
      reason: "Working on the quarterly marketing report that requires concentrated effort.",
      status: "approved",
      feedback: "Approved based on good past performance and project requirements."
    },
    {
      id: 3,
      employeeName: "David Chen",
      department: "Finance",
      startDate: "2025-05-22",
      endDate: "2025-05-22",
      reason: "Need to complete year-end financial projections.",
      status: "rejected",
      feedback: "Request denied due to scheduled department meeting that requires in-person attendance."
    },
    {
      id: 4,
      employeeName: "Lisa Garcia",
      department: "Sales",
      startDate: "2025-05-26",
      endDate: "2025-05-28",
      reason: "Preparing sales proposals for major clients that require focused work environment.",
      status: "pending"
    }
  ]);
  
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [viewRequest, setViewRequest] = useState<WfhRequest | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  const form = useForm<WfhRequestFormValues>({
    defaultValues: {
      startDate: "",
      endDate: "",
      reason: ""
    }
  });
  
  const handleNewRequest = () => {
    setIsRequestOpen(true);
    form.reset();
    speak("Creating a new work from home request. Please fill in the required details including dates and reason for your request.");
  };
  
  const handleViewRequest = (request: WfhRequest) => {
    setViewRequest(request);
    setIsViewOpen(true);
    speak(`Viewing work from home request from ${request.employeeName} for dates ${request.startDate} to ${request.endDate}. Status is ${request.status}.`);
  };
  
  const handleApproveRequest = (id: number) => {
    setRequests(requests.map(req => 
      req.id === id 
        ? { ...req, status: 'approved', feedback: "Approved based on department capacity and project requirements." } 
        : req
    ));
    toast.success("Work from home request approved");
    speak("Request approved. The employee will be notified of this decision.");
  };
  
  const handleRejectRequest = (id: number) => {
    setRequests(requests.map(req => 
      req.id === id 
        ? { ...req, status: 'rejected', feedback: "Request denied due to team scheduling conflicts." } 
        : req
    ));
    toast.success("Work from home request rejected");
    speak("Request rejected. The employee will be notified of this decision.");
  };
  
  const onSubmitRequest = (data: WfhRequestFormValues) => {
    const newRequest: WfhRequest = {
      id: requests.length + 1,
      employeeName: "Current User", // In a real app, this would be the current user
      department: "Engineering", // In a real app, this would be from user profile
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: "pending"
    };
    
    setRequests([...requests, newRequest]);
    setIsRequestOpen(false);
    toast.success("Work from home request submitted successfully");
    speak("Your work from home request has been submitted successfully. You will be notified when it is reviewed.");
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Work From Home Requests</h2>
          <p className="text-sm text-muted-foreground">
            Submit and manage work from home requests
          </p>
        </div>
        <Button onClick={handleNewRequest}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Work From Home Management</CardTitle>
          <CardDescription>
            Review and manage work from home requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.employeeName}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewRequest(request)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      {request.status === "pending" && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-green-600"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* New Request Dialog */}
      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Work From Home Request</DialogTitle>
            <DialogDescription>
              Submit a request to work from home
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitRequest)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  rules={{ required: "Start date is required" }}
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
                  control={form.control}
                  name="endDate"
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="reason"
                rules={{ required: "Reason is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain why you need to work from home..."
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a clear justification for your work from home request
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsRequestOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Request
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* View Request Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Work From Home Request Details</DialogTitle>
            <DialogDescription>
              Review the details of this request
            </DialogDescription>
          </DialogHeader>
          
          {viewRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Employee</h4>
                  <p>{viewRequest.employeeName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Department</h4>
                  <p>{viewRequest.department}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Start Date</h4>
                  <p>{new Date(viewRequest.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">End Date</h4>
                  <p>{new Date(viewRequest.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Reason</h4>
                <p className="text-sm mt-1">{viewRequest.reason}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-medium">Status:</h4>
                {getStatusBadge(viewRequest.status)}
              </div>
              
              {viewRequest.feedback && (
                <div>
                  <h4 className="text-sm font-medium">Feedback</h4>
                  <p className="text-sm mt-1">{viewRequest.feedback}</p>
                </div>
              )}
              
              {viewRequest.status === "pending" && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleRejectRequest(viewRequest.id)}
                    className="text-red-600"
                  >
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApproveRequest(viewRequest.id)}
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
