
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useVoice } from '../../contexts/VoiceContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageSquare, Search, Plus, Eye, Check, Clock, X, AlertCircle, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

// Types
type TicketCategory = 'payroll' | 'benefits' | 'leave' | 'documentation' | 'onboarding' | 'technical' | 'other';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
type TicketStatus = 'open' | 'inProgress' | 'resolved' | 'closed';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt?: Date;
  resolvedAt?: Date;
  messages: {
    id: string;
    sender: string;
    message: string;
    timestamp: Date;
    isStaff: boolean;
  }[];
}

interface NewTicketFormData {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

const today = new Date();

const initialTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Payslip discrepancy',
    description: 'There seems to be an error in my latest payslip. The overtime hours are not reflecting correctly.',
    category: 'payroll',
    priority: 'high',
    status: 'open',
    createdBy: 'John Doe',
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
    messages: [{ id: 'msg-001', sender: 'John Doe', message: 'There seems to be an error in my latest payslip. The overtime hours are not reflecting correctly.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2), isStaff: false }]
  },
  {
    id: 'TKT-002',
    subject: 'Health insurance claim issue',
    description: "I submitted a health insurance claim last month but haven't received any updates.",
    category: 'benefits',
    priority: 'medium',
    status: 'inProgress',
    createdBy: 'Jane Smith',
    assignedTo: 'HR Benefits Specialist',
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
    updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
    messages: [
      { id: 'msg-002', sender: 'Jane Smith', message: "I submitted a health insurance claim last month but haven't received any updates.", timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5), isStaff: false },
      { id: 'msg-003', sender: 'HR Benefits Specialist', message: 'We are looking into this issue. We have reached out to the insurance provider and will get back to you soon.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), isStaff: true }
    ]
  },
  {
    id: 'TKT-003',
    subject: 'Employment verification letter',
    description: 'I need an employment verification letter for my mortgage application.',
    category: 'documentation',
    priority: 'medium',
    status: 'resolved',
    createdBy: 'Robert Johnson',
    assignedTo: 'HR Documentation Team',
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
    resolvedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
    messages: [
      { id: 'msg-004', sender: 'Robert Johnson', message: 'I need an employment verification letter for my mortgage application.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10), isStaff: false },
      { id: 'msg-005', sender: 'HR Documentation Team', message: 'We have processed your request. The letter has been sent to your email address.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), isStaff: true }
    ]
  },
  { id: 'TKT-004', subject: 'Leave balance incorrect', description: 'My leave balance shows 5 days but I should have 12 remaining.', category: 'leave', priority: 'high', status: 'open', createdBy: 'Alice Martinez', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), messages: [{ id: 'msg-006', sender: 'Alice Martinez', message: 'My leave balance shows 5 days but I should have 12 remaining.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), isStaff: false }] },
  { id: 'TKT-005', subject: 'VPN access not working', description: 'Cannot connect to company VPN from home office.', category: 'technical', priority: 'urgent', status: 'inProgress', createdBy: 'David Chen', assignedTo: 'IT Support', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), messages: [{ id: 'msg-007', sender: 'David Chen', message: 'Cannot connect to company VPN from home office.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), isStaff: false }] },
  { id: 'TKT-006', subject: 'Onboarding checklist missing', description: 'I joined last week and never received the onboarding checklist.', category: 'onboarding', priority: 'medium', status: 'open', createdBy: 'Emily Davis', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), messages: [{ id: 'msg-008', sender: 'Emily Davis', message: 'I joined last week and never received the onboarding checklist.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), isStaff: false }] },
  { id: 'TKT-007', subject: 'Tax form W-2 request', description: 'Need a copy of my W-2 from last year for tax filing.', category: 'payroll', priority: 'low', status: 'resolved', createdBy: 'Frank Wilson', assignedTo: 'Payroll Team', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15), resolvedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12), messages: [{ id: 'msg-009', sender: 'Frank Wilson', message: 'Need a copy of my W-2 from last year for tax filing.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15), isStaff: false }] },
  { id: 'TKT-008', subject: 'Dental benefits enrollment', description: 'How do I enroll in the dental benefits plan?', category: 'benefits', priority: 'low', status: 'resolved', createdBy: 'Grace Lee', assignedTo: 'HR Benefits', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 20), resolvedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 18), messages: [{ id: 'msg-010', sender: 'Grace Lee', message: 'How do I enroll in the dental benefits plan?', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 20), isStaff: false }] },
  { id: 'TKT-009', subject: 'Parking pass request', description: 'Need a parking pass for the downtown office starting next month.', category: 'other', priority: 'low', status: 'open', createdBy: 'Henry Park', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4), messages: [{ id: 'msg-011', sender: 'Henry Park', message: 'Need a parking pass for the downtown office starting next month.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4), isStaff: false }] },
  { id: 'TKT-010', subject: 'Laptop replacement needed', description: 'My laptop battery is failing and cannot hold charge for more than 30 minutes.', category: 'technical', priority: 'high', status: 'inProgress', createdBy: 'Isabella Torres', assignedTo: 'IT Assets', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6), messages: [{ id: 'msg-012', sender: 'Isabella Torres', message: 'My laptop battery is failing and cannot hold charge for more than 30 minutes.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6), isStaff: false }] },
  { id: 'TKT-011', subject: 'Salary certificate for visa', description: 'I need a salary certificate for my visa application to the UK.', category: 'documentation', priority: 'high', status: 'open', createdBy: 'James Kumar', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2), messages: [{ id: 'msg-013', sender: 'James Kumar', message: 'I need a salary certificate for my visa application to the UK.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2), isStaff: false }] },
  { id: 'TKT-012', subject: 'Maternity leave policy', description: 'Can you clarify the maternity leave policy and benefits?', category: 'leave', priority: 'medium', status: 'resolved', createdBy: 'Karen White', assignedTo: 'HR Policy', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12), resolvedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10), messages: [{ id: 'msg-014', sender: 'Karen White', message: 'Can you clarify the maternity leave policy and benefits?', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12), isStaff: false }] },
  { id: 'TKT-013', subject: 'Performance review access', description: 'Cannot access my performance review document in the portal.', category: 'technical', priority: 'medium', status: 'open', createdBy: 'Leo Nguyen', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), messages: [{ id: 'msg-015', sender: 'Leo Nguyen', message: 'Cannot access my performance review document in the portal.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), isStaff: false }] },
  { id: 'TKT-014', subject: 'Reimbursement delay', description: 'My travel reimbursement from 2 months ago has not been processed.', category: 'payroll', priority: 'high', status: 'inProgress', createdBy: 'Maria Garcia', assignedTo: 'Finance Team', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8), messages: [{ id: 'msg-016', sender: 'Maria Garcia', message: 'My travel reimbursement from 2 months ago has not been processed.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8), isStaff: false }] },
  { id: 'TKT-015', subject: 'Company ID card lost', description: 'I lost my company ID card and need a replacement.', category: 'other', priority: 'medium', status: 'open', createdBy: 'Nathan Brown', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), messages: [{ id: 'msg-017', sender: 'Nathan Brown', message: 'I lost my company ID card and need a replacement.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), isStaff: false }] },
  { id: 'TKT-016', subject: 'Training budget approval', description: 'Requesting approval for AWS certification training ($500).', category: 'other', priority: 'low', status: 'inProgress', createdBy: 'Olivia Taylor', assignedTo: 'L&D Team', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), messages: [{ id: 'msg-018', sender: 'Olivia Taylor', message: 'Requesting approval for AWS certification training ($500).', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), isStaff: false }] },
  { id: 'TKT-017', subject: 'Flexible work hours request', description: 'Would like to shift my work hours to 7AM-4PM for childcare reasons.', category: 'leave', priority: 'medium', status: 'open', createdBy: 'Peter Adams', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5), messages: [{ id: 'msg-019', sender: 'Peter Adams', message: 'Would like to shift my work hours to 7AM-4PM for childcare reasons.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5), isStaff: false }] },
  { id: 'TKT-018', subject: '401k contribution change', description: 'How can I increase my 401k contribution from 6% to 10%?', category: 'benefits', priority: 'low', status: 'resolved', createdBy: 'Quinn Roberts', assignedTo: 'Benefits Admin', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14), resolvedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 11), messages: [{ id: 'msg-020', sender: 'Quinn Roberts', message: 'How can I increase my 401k contribution from 6% to 10%?', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14), isStaff: false }] },
  { id: 'TKT-019', subject: 'Office relocation query', description: 'When is the planned office move to the new building happening?', category: 'other', priority: 'low', status: 'closed', createdBy: 'Rachel Kim', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 25), resolvedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 22), messages: [{ id: 'msg-021', sender: 'Rachel Kim', message: 'When is the planned office move to the new building happening?', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 25), isStaff: false }] },
  { id: 'TKT-020', subject: 'Emergency contact update', description: 'Need to update my emergency contact information in the system.', category: 'documentation', priority: 'low', status: 'open', createdBy: 'Sam Mitchell', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), messages: [{ id: 'msg-022', sender: 'Sam Mitchell', message: 'Need to update my emergency contact information in the system.', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), isStaff: false }] },
];

export const TicketManagement: React.FC = () => {
  const { speak } = useVoice();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(initialTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isViewTicketOpen, setIsViewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const form = useForm<NewTicketFormData>({
    defaultValues: {
      subject: '',
      description: '',
      category: 'other',
      priority: 'medium'
    }
  });

  useEffect(() => {
    speak("Support tickets loaded. You can view, create, and track your HR support requests here.");
  }, [speak]);

  // Filter tickets when search query or status filter changes
  useEffect(() => {
    let result = [...tickets];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ticket => 
        ticket.subject.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.id.toLowerCase().includes(query)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }
    setFilteredTickets(result);
  }, [tickets, searchQuery, statusFilter]);

  const handleCreateTicket = (data: NewTicketFormData) => {
    const newTicket: Ticket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: data.subject,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'open',
      createdBy: 'Current User',
      createdAt: new Date(),
      messages: [{ id: `msg-${Date.now()}`, sender: 'Current User', message: data.description, timestamp: new Date(), isStaff: false }]
    };
    setTickets(prev => [newTicket, ...prev]);
    setIsNewTicketOpen(false);
    toast.success(`Ticket ${newTicket.id} has been created successfully.`);
    speak(`Ticket ${newTicket.id} has been created successfully and is now open.`);
    form.reset();
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsViewTicketOpen(true);
  };

  const handleSubmitReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    const newMessage = { id: `msg-${Date.now()}`, sender: 'Current User', message: replyMessage, timestamp: new Date(), isStaff: false };
    const updatedTicket = { ...selectedTicket, messages: [...selectedTicket.messages, newMessage], updatedAt: new Date() };
    setTickets(prev => prev.map(ticket => ticket.id === updatedTicket.id ? updatedTicket : ticket));
    setSelectedTicket(updatedTicket);
    setReplyMessage('');
    toast.success("Your message has been sent successfully.");
  };

  const getCategoryDisplay = (category: TicketCategory) => {
    const map: Record<TicketCategory, string> = { payroll: 'Payroll', benefits: 'Benefits', leave: 'Leave', documentation: 'Documentation', onboarding: 'Onboarding', technical: 'Technical', other: 'Other' };
    return map[category];
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    const styles: Record<TicketPriority, string> = {
      low: 'bg-blue-100 text-blue-800', medium: 'bg-green-100 text-green-800',
      high: 'bg-amber-100 text-amber-800', urgent: 'bg-red-100 text-red-800'
    };
    return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>;
  };

  const getStatusBadge = (status: TicketStatus) => {
    const config: Record<TicketStatus, { style: string; icon: React.ReactNode; label: string }> = {
      open: { style: 'bg-blue-100 text-blue-800', icon: <AlertCircle className="w-3 h-3 mr-1" />, label: 'Open' },
      inProgress: { style: 'bg-amber-100 text-amber-800', icon: <Clock className="w-3 h-3 mr-1" />, label: 'In Progress' },
      resolved: { style: 'bg-green-100 text-green-800', icon: <Check className="w-3 h-3 mr-1" />, label: 'Resolved' },
      closed: { style: 'bg-gray-100 text-gray-800', icon: <X className="w-3 h-3 mr-1" />, label: 'Closed' },
    };
    const c = config[status];
    return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.style}`}>{c.icon} {c.label}</span>;
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-medium">Support Tickets</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search tickets..." className="w-full sm:w-[250px] pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsNewTicketOpen(true)}><Plus className="mr-2 h-4 w-4" />New Ticket</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead className="w-[300px]">Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <MessageSquare size={48} strokeWidth={1.5} className="mb-2" />
                      {searchQuery || statusFilter !== 'all' ? <p>No tickets match your search criteria.</p> : <p>No support tickets found. Click "New Ticket" to create your first request.</p>}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell className="truncate max-w-[300px]" title={ticket.subject}>{ticket.subject}</TableCell>
                    <TableCell>{getCategoryDisplay(ticket.category)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{format(ticket.createdAt, "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewTicket(ticket)}><Eye className="mr-2 h-4 w-4" />View Ticket</DropdownMenuItem>
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
      </CardContent>

      {/* New Ticket Dialog */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Support Ticket</DialogTitle>
            <DialogDescription>Submit a new HR support request.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateTicket)} className="space-y-4">
              <FormField control={form.control} name="subject" render={({ field }) => (<FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="Brief summary of your issue" {...field} /></FormControl></FormItem>)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl><SelectContent><SelectItem value="payroll">Payroll</SelectItem><SelectItem value="benefits">Benefits</SelectItem><SelectItem value="leave">Leave</SelectItem><SelectItem value="documentation">Documentation</SelectItem><SelectItem value="onboarding">Onboarding</SelectItem><SelectItem value="technical">Technical</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></FormItem>)} />
                <FormField control={form.control} name="priority" render={({ field }) => (<FormItem><FormLabel>Priority</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></FormItem>)} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Please provide details of your issue or request" className="resize-none min-h-[150px]" {...field} /></FormControl><FormDescription>Include as much detail as possible.</FormDescription></FormItem>)} />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsNewTicketOpen(false)}>Cancel</Button>
                <Button type="submit">Submit Ticket</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* View Ticket Dialog */}
      <Dialog open={isViewTicketOpen} onOpenChange={setIsViewTicketOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket Details - {selectedTicket?.id}</DialogTitle>
            <DialogDescription>View ticket details and conversation history.</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedTicket.subject}</h3>
                  <p className="text-sm text-muted-foreground">Created by {selectedTicket.createdBy} on {format(selectedTicket.createdAt, "MMMM d, yyyy 'at' h:mm a")}</p>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-2">{getPriorityBadge(selectedTicket.priority)}{getStatusBadge(selectedTicket.status)}</div>
                  <p className="text-sm text-muted-foreground">Category: {getCategoryDisplay(selectedTicket.category)}</p>
                </div>
              </div>
              <div className="border rounded-lg p-4 bg-muted/50"><p className="whitespace-pre-wrap">{selectedTicket.description}</p></div>
              <div>
                <h4 className="text-sm font-semibold mb-4">Conversation</h4>
                <div className="space-y-4">
                  {selectedTicket.messages.map(message => (
                    <div key={message.id} className={`flex flex-col ${message.isStaff ? 'items-start' : 'items-end'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${message.isStaff ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                        <p className="whitespace-pre-wrap">{message.message}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{message.sender} - {format(message.timestamp, "MMM d, yyyy 'at' h:mm a")}</div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedTicket.status !== 'closed' && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Reply</h4>
                  <div className="flex flex-col gap-2">
                    <Textarea placeholder="Type your response here..." className="resize-none" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} />
                    <div className="flex justify-end"><Button onClick={handleSubmitReply} disabled={!replyMessage.trim()}>Send Reply</Button></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
