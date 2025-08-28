import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, User, Calendar, FileText } from 'lucide-react';
import { ResponsiveDialog } from './ResponsiveDialog';
import { useVoice } from '../../contexts/VoiceContext';
import { toast } from 'sonner';

interface ApprovalItem {
  id: string;
  type: 'leave' | 'expense' | 'promotion' | 'training' | 'recruitment';
  title: string;
  submittedBy: string;
  submittedDate: string;
  amount?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  approver?: string;
  approvalDate?: string;
}

const mockApprovals: ApprovalItem[] = [
  {
    id: '1',
    type: 'leave',
    title: 'Annual Leave Request',
    submittedBy: 'Sarah Johnson',
    submittedDate: '2025-01-28',
    priority: 'medium',
    status: 'pending',
    description: 'Requesting 5 days annual leave from Feb 15-19 for family vacation'
  },
  {
    id: '2',
    type: 'expense',
    title: 'Conference Attendance',
    submittedBy: 'Mike Chen',
    submittedDate: '2025-01-27',
    amount: '$2,450',
    priority: 'high',
    status: 'pending',
    description: 'Travel and accommodation for Tech Conference 2025'
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Senior Developer Promotion',
    submittedBy: 'Emily Davis',
    submittedDate: '2025-01-25',
    priority: 'high',
    status: 'approved',
    description: 'Promotion from Mid-level to Senior Developer position',
    approver: 'John Manager',
    approvalDate: '2025-01-26'
  },
  {
    id: '4',
    type: 'training',
    title: 'AWS Certification Training',
    submittedBy: 'Alex Rodriguez',
    submittedDate: '2025-01-24',
    amount: '$1,200',
    priority: 'medium',
    status: 'rejected',
    description: 'Request for AWS Solutions Architect certification course',
    approver: 'Jane Smith',
    approvalDate: '2025-01-25'
  }
];

export const WorkflowApprovals: React.FC = () => {
  const { speak } = useVoice();
  const [approvals, setApprovals] = useState<ApprovalItem[]>(mockApprovals);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredApprovals = approvals.filter(approval => 
    filter === 'all' || approval.status === filter
  );

  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  const handleApprove = (approvalId: string) => {
    setApprovals(prev => prev.map(approval => 
      approval.id === approvalId 
        ? { 
            ...approval, 
            status: 'approved' as const,
            approver: 'Current User',
            approvalDate: new Date().toISOString().split('T')[0]
          }
        : approval
    ));
    
    const approval = approvals.find(a => a.id === approvalId);
    toast.success('Request approved', {
      description: `${approval?.title} has been approved`
    });
    
    speak(`Request approved. ${approval?.title} from ${approval?.submittedBy} has been approved and they will be notified automatically.`);
  };

  const handleReject = (approvalId: string) => {
    setApprovals(prev => prev.map(approval => 
      approval.id === approvalId 
        ? { 
            ...approval, 
            status: 'rejected' as const,
            approver: 'Current User',
            approvalDate: new Date().toISOString().split('T')[0]
          }
        : approval
    ));
    
    const approval = approvals.find(a => a.id === approvalId);
    toast.success('Request rejected', {
      description: `${approval?.title} has been rejected`
    });
    
    speak(`Request rejected. ${approval?.title} from ${approval?.submittedBy} has been rejected. The submitter will be notified.`);
  };

  const handleViewDetails = (approval: ApprovalItem) => {
    setSelectedApproval(approval);
    setIsDetailsOpen(true);
    speak(`Viewing details for ${approval.title} submitted by ${approval.submittedBy}. Review the complete request information before making your decision.`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'leave': return <Calendar className="h-4 w-4" />;
      case 'expense': return <FileText className="h-4 w-4" />;
      case 'promotion': return <User className="h-4 w-4" />;
      case 'training': return <FileText className="h-4 w-4" />;
      case 'recruitment': return <User className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Workflow Approvals</span>
            {pendingCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {pendingCount} pending
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Review and approve pending requests across all HR processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({approvals.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Request</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(approval.type)}
                            <span className="capitalize">{approval.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{approval.title}</TableCell>
                        <TableCell>{approval.submittedBy}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(approval.submittedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {approval.amount && (
                            <Badge variant="outline">{approval.amount}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(approval.priority)}>
                            {approval.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(approval.status)}>
                            {approval.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(approval)}
                            >
                              View
                            </Button>
                            {approval.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleApprove(approval.id)}
                                  className="text-green-600 hover:bg-green-50"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleReject(approval.id)}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredApprovals.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No {filter === 'all' ? '' : filter} approvals found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ResponsiveDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title="Approval Details"
        description="Review complete request information"
        footer={
          selectedApproval?.status === 'pending' ? (
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                onClick={() => {
                  handleReject(selectedApproval.id);
                  setIsDetailsOpen(false);
                }}
                className="flex-1 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                onClick={() => {
                  handleApprove(selectedApproval.id);
                  setIsDetailsOpen(false);
                }}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsDetailsOpen(false)} className="w-full">
              Close
            </Button>
          )
        }
      >
        {selectedApproval && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Request Type</label>
                <div className="flex items-center gap-2 mt-1">
                  {getTypeIcon(selectedApproval.type)}
                  <span className="capitalize">{selectedApproval.type}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                <div className="mt-1">
                  <Badge className={getPriorityColor(selectedApproval.priority)}>
                    {selectedApproval.priority}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Submitted By</label>
              <p className="mt-1">{selectedApproval.submittedBy}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Submission Date</label>
              <p className="mt-1">{new Date(selectedApproval.submittedDate).toLocaleDateString()}</p>
            </div>

            {selectedApproval.amount && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <p className="mt-1 text-lg font-semibold">{selectedApproval.amount}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="mt-1 text-sm">{selectedApproval.description}</p>
            </div>

            {selectedApproval.status !== 'pending' && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Decision</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedApproval.status)}>
                        {selectedApproval.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Decision Date</label>
                    <p className="mt-1">{selectedApproval.approvalDate && new Date(selectedApproval.approvalDate).toLocaleDateString()}</p>
                  </div>
                </div>
                {selectedApproval.approver && (
                  <div className="mt-2">
                    <label className="text-sm font-medium text-muted-foreground">Approved By</label>
                    <p className="mt-1">{selectedApproval.approver}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </ResponsiveDialog>
    </>
  );
};