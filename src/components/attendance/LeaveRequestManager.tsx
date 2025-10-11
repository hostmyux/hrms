
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'sonner';
import { Plus, Calendar, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ResponsiveDialog } from '../shared/ResponsiveDialog';

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  approvedBy?: string;
  comments?: string;
}

export const LeaveRequestManager: React.FC = () => {
  const { speak } = useVoice();
  const { addAction } = useUser();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      leaveType: 'vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-19',
      days: 5,
      reason: 'Family vacation to Hawaii',
      status: 'pending',
      submittedDate: '2024-01-28'
    },
    {
      id: '2',
      employeeName: 'Michael Chen',
      employeeId: 'EMP002',
      leaveType: 'sick',
      startDate: '2024-02-05',
      endDate: '2024-02-07',
      days: 3,
      reason: 'Flu symptoms and recovery',
      status: 'approved',
      submittedDate: '2024-02-04',
      approvedBy: 'HR Manager',
      comments: 'Approved with doctor\'s note'
    },
    {
      id: '3',
      employeeName: 'Emily Davis',
      employeeId: 'EMP003',
      leaveType: 'personal',
      startDate: '2024-02-12',
      endDate: '2024-02-12',
      days: 1,
      reason: 'Personal appointment',
      status: 'rejected',
      submittedDate: '2024-02-10',
      approvedBy: 'Department Head',
      comments: 'Insufficient notice period'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');

  useEffect(() => {
    speak("Leave request management interface loaded. You can view, approve, or reject employee leave requests. Each request shows duration, type, and current status.");
  }, [speak]);

  const handleViewRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setApprovalComments(request.comments || '');
    setIsDialogOpen(true);
    speak(`Viewing leave request from ${request.employeeName} for ${request.days} days of ${request.leaveType} leave from ${request.startDate} to ${request.endDate}.`);
  };

  const handleApproveRequest = (requestId: string) => {
    setLeaveRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' as const, approvedBy: 'Current User', comments: approvalComments }
          : req
      )
    );
    
    const request = leaveRequests.find(r => r.id === requestId);
    addAction({
      type: "approve",
      description: `Approved leave request for ${request?.employeeName}`,
      module: "Attendance"
    });
    
    speak(`Leave request for ${request?.employeeName} has been approved.`);
    toast(`Leave request approved for ${request?.employeeName}`);
    setIsDialogOpen(false);
  };

  const handleRejectRequest = (requestId: string) => {
    setLeaveRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' as const, approvedBy: 'Current User', comments: approvalComments }
          : req
      )
    );
    
    const request = leaveRequests.find(r => r.id === requestId);
    addAction({
      type: "reject",
      description: `Rejected leave request for ${request?.employeeName}`,
      module: "Attendance"
    });
    
    speak(`Leave request for ${request?.employeeName} has been rejected.`);
    toast(`Leave request rejected for ${request?.employeeName}`);
    setIsDialogOpen(false);
  };

  const handleRequestHover = (request: LeaveRequest) => {
    speak(`Leave request from ${request.employeeName}. Type: ${request.leaveType}. Duration: ${request.days} days. Status: ${request.status}. Submitted on ${request.submittedDate}.`);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending');
  const processedRequests = leaveRequests.filter(req => req.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Leave Request Management</h2>
        <div className="flex gap-4 text-sm">
          <Badge variant="outline" className="bg-yellow-50">
            {pendingRequests.length} Pending
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            {leaveRequests.filter(r => r.status === 'approved').length} Approved
          </Badge>
          <Badge variant="outline" className="bg-red-50">
            {leaveRequests.filter(r => r.status === 'rejected').length} Rejected
          </Badge>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-yellow-600">Pending Requests</h3>
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <Card 
                key={request.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-yellow-200"
                onMouseEnter={() => handleRequestHover(request)}
                onClick={() => handleViewRequest(request)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{request.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{request.employeeId}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">
                            {request.startDate} - {request.endDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.days} days • {request.leaveType}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <Badge variant={getStatusVariant(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-sm text-muted-foreground">
                    <strong>Reason:</strong> {request.reason}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {processedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Processed Requests</h3>
          <div className="grid gap-4">
            {processedRequests.map((request) => (
              <Card 
                key={request.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onMouseEnter={() => handleRequestHover(request)}
                onClick={() => handleViewRequest(request)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{request.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{request.employeeId}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">
                            {request.startDate} - {request.endDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.days} days • {request.leaveType}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <Badge variant={getStatusVariant(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <ResponsiveDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Leave Request Details"
        description="Review and process the leave request below."
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="font-medium">Employee</Label>
                <p>{selectedRequest.employeeName} ({selectedRequest.employeeId})</p>
              </div>
              <div>
                <Label className="font-medium">Leave Type</Label>
                <p className="capitalize">{selectedRequest.leaveType}</p>
              </div>
              <div>
                <Label className="font-medium">Start Date</Label>
                <p>{selectedRequest.startDate}</p>
              </div>
              <div>
                <Label className="font-medium">End Date</Label>
                <p>{selectedRequest.endDate}</p>
              </div>
              <div>
                <Label className="font-medium">Duration</Label>
                <p>{selectedRequest.days} days</p>
              </div>
              <div>
                <Label className="font-medium">Status</Label>
                <Badge variant={getStatusVariant(selectedRequest.status)}>
                  {selectedRequest.status}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label className="font-medium">Reason</Label>
              <p className="mt-1 text-sm">{selectedRequest.reason}</p>
            </div>
            
            {selectedRequest.status === 'pending' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="comments">Comments (Optional)</Label>
                  <Textarea
                    id="comments"
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                    placeholder="Add comments for approval/rejection..."
                    rows={3}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleRejectRequest(selectedRequest.id)}
                    className="w-full sm:w-auto text-destructive hover:text-destructive"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApproveRequest(selectedRequest.id)}
                    className="w-full sm:w-auto"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </div>
            )}
            
            {selectedRequest.status !== 'pending' && (
              <div>
                <Label className="font-medium">Decision</Label>
                <div className="mt-1 space-y-2">
                  <p className="text-sm">
                    <strong>Processed by:</strong> {selectedRequest.approvedBy}
                  </p>
                  {selectedRequest.comments && (
                    <p className="text-sm">
                      <strong>Comments:</strong> {selectedRequest.comments}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </ResponsiveDialog>
    </div>
  );
};
