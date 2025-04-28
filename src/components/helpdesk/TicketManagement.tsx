
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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

// Mock data function
const fetchTickets = async (): Promise<Ticket[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const today = new Date();
  
  return [
    {
      id: 'TKT-001',
      subject: 'Payslip discrepancy',
      description: 'There seems to be an error in my latest payslip. The overtime hours are not reflecting correctly.',
      category: 'payroll',
      priority: 'high',
      status: 'open',
      createdBy: 'John Doe',
      createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      messages: [
        {
          id: 'msg-001',
          sender: 'John Doe',
          message: 'There seems to be an error in my latest payslip. The overtime hours are not reflecting correctly.',
          timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          isStaff: false
        }
      ]
    },
    {
      id: 'TKT-002',
      subject: 'Health insurance claim issue',
      description: 'I submitted a health insurance claim last month but haven\'t received any updates.',
      category: 'benefits',
      priority: 'medium',
      status: 'inProgress',
      createdBy: 'Jane Smith',
      assignedTo: 'HR Benefits Specialist',
      createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
      updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
      messages: [
        {
          id: 'msg-002',
          sender: 'Jane Smith',
          message: 'I submitted a health insurance claim last month but haven\'t received any updates.',
          timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
          isStaff: false
        },
        {
          id: 'msg-003',
          sender: 'HR Benefits Specialist',
          message: 'We are looking into this issue. We have reached out to the insurance provider and will get back to you soon.',
          timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
          isStaff: true
        }
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
      updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
      resolvedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
      messages: [
        {
          id: 'msg-004',
          sender: 'Robert Johnson',
          message: 'I need an employment verification letter for my mortgage application.',
          timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
          isStaff: false
        },
        {
          id: 'msg-005',
          sender: 'HR Documentation Team',
          message: 'We have processed your request. The letter has been sent to your email address.',
          timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
          isStaff: true
        },
        {
          id: 'msg-006',
          sender: 'Robert Johnson',
          message: 'Got the letter. Thank you!',
          timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
          isStaff: false
        }
      ]
    }
  ];
};

export const TicketManagement: React.FC = () => {
  const { toast } = useToast();
  const { speak } = useVoice();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Load tickets
  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTickets();
        setTickets(data);
        setFilteredTickets(data);
        speak("Support tickets loaded. You can view, create, and track your HR support requests here.");
      } catch (error) {
        toast({
          title: "Error loading tickets",
          description: "Failed to load support tickets. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTickets();
  }, [speak, toast]);

  // Filter tickets when search query or status filter changes
  useEffect(() => {
    let result = [...tickets];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ticket => 
        ticket.subject.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.id.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }
    
    setFilteredTickets(result);
  }, [tickets, searchQuery, statusFilter]);

  // Handle creating a new ticket
  const handleCreateTicket = (data: NewTicketFormData) => {
    const newTicket: Ticket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: data.subject,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'open',
      createdBy: 'Current User', // In real app, this would be the current user
      createdAt: new Date(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'Current User',
          message: data.description,
          timestamp: new Date(),
          isStaff: false
        }
      ]
    };
    
    // Add to state (would be an API call in real implementation)
    setTickets(prev => [newTicket, ...prev]);
    
    // Close dialog
    setIsNewTicketOpen(false);
    
    // Show success message
    toast({
      title: "Ticket created",
      description: `Ticket ${newTicket.id} has been created successfully.`,
    });
    
    speak(`Ticket ${newTicket.id} has been created successfully and is now open.`);
    
    // Reset form
    form.reset();
  };

  // Handle viewing a ticket
  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsViewTicketOpen(true);
  };

  // Handle submitting a reply
  const handleSubmitReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Current User',
      message: replyMessage,
      timestamp: new Date(),
      isStaff: false
    };
    
    // Update ticket with new message
    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      updatedAt: new Date()
    };
    
    // Update tickets state
    setTickets(prev => 
      prev.map(ticket => ticket.id === updatedTicket.id ? updatedTicket : ticket)
    );
    
    // Update selected ticket
    setSelectedTicket(updatedTicket);
    
    // Clear reply input
    setReplyMessage('');
    
    // Show success message
    toast({
      title: "Reply sent",
      description: "Your message has been sent successfully.",
    });
  };

  // Get category display name
  const getCategoryDisplay = (category: TicketCategory) => {
    switch (category) {
      case 'payroll': return 'Payroll';
      case 'benefits': return 'Benefits';
      case 'leave': return 'Leave';
      case 'documentation': return 'Documentation';
      case 'onboarding': return 'Onboarding';
      case 'technical': return 'Technical';
      case 'other': return 'Other';
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Low
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Medium
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            High
          </span>
        );
      case 'urgent':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Urgent
          </span>
        );
    }
  };

  // Get status badge
  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Open
          </span>
        );
      case 'inProgress':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 mr-1" /> In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" /> Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <X className="w-3 h-3 mr-1" /> Closed
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
      <CardContent className="pt-6 space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-medium">Support Tickets</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tickets..."
                  className="w-full sm:w-[250px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsNewTicketOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </div>
        </div>

        {/* Tickets Table */}
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
                      {searchQuery || statusFilter !== 'all' ? (
                        <p>No tickets match your search criteria.</p>
                      ) : (
                        <p>No support tickets found. Click "New Ticket" to create your first request.</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell className="truncate max-w-[300px]" title={ticket.subject}>
                      {ticket.subject}
                    </TableCell>
                    <TableCell>{getCategoryDisplay(ticket.category)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>
                      {format(ticket.createdAt, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewTicket(ticket)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Ticket
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
      </CardContent>

      {/* New Ticket Dialog */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Support Ticket</DialogTitle>
            <DialogDescription>
              Submit a new HR support request. Our team will respond to your inquiry as soon as possible.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateTicket)} className="space-y-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief summary of your issue" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="payroll">Payroll</SelectItem>
                          <SelectItem value="benefits">Benefits</SelectItem>
                          <SelectItem value="leave">Leave</SelectItem>
                          <SelectItem value="documentation">Documentation</SelectItem>
                          <SelectItem value="onboarding">Onboarding</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide details of your issue or request"
                        className="resize-none min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include as much detail as possible to help us address your request efficiently.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsNewTicketOpen(false)}>
                  Cancel
                </Button>
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
            <DialogDescription>
              View ticket details and conversation history.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedTicket.subject}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created by {selectedTicket.createdBy} on {format(selectedTicket.createdAt, "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(selectedTicket.priority)}
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Category: {getCategoryDisplay(selectedTicket.category)}
                  </p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-4">Conversation</h4>
                
                <div className="space-y-4">
                  {selectedTicket.messages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex flex-col ${message.isStaff ? 'items-start' : 'items-end'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.isStaff ? 'bg-muted' : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.message}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {message.sender} - {format(message.timestamp, "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedTicket.status !== 'closed' && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Reply</h4>
                  <div className="flex flex-col gap-2">
                    <Textarea
                      placeholder="Type your response here..."
                      className="resize-none"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSubmitReply} disabled={!replyMessage.trim()}>
                        Send Reply
                      </Button>
                    </div>
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
