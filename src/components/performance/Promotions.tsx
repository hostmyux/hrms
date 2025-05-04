
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, CheckCircle, Eye, FileText, Plus, ThumbsUp } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type PromotionStatus = 'Under Review' | 'HR Review' | 'Approved' | 'Declined';
type ReadinessLevel = 'Ready Now' | 'Ready in 3-6 months' | 'Ready in 6-12 months';

interface PromotionRequest {
  id: number;
  employee: string;
  currentPosition: string;
  proposedPosition: string;
  manager: string;
  department?: string;
  requestDate: string;
  status: PromotionStatus;
  justification?: string;
}

interface HighPotentialEmployee {
  id: number;
  name: string;
  position: string;
  department: string;
  readinessLevel: ReadinessLevel;
  manager: string;
  developmentPlan?: DevelopmentPlan;
}

interface DevelopmentPlan {
  careerGoal: string;
  strengths: string[];
  developmentAreas: string[];
  actions: DevelopmentAction[];
}

interface DevelopmentAction {
  type: string;
  description: string;
  deadline: string;
}

interface PromotionFormData {
  employee: string;
  currentPosition: string;
  proposedPosition: string;
  manager: string;
  department: string;
  justification: string;
}

export const Promotions: React.FC = () => {
  const { speak } = useVoice();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('requests');
  const [isCreatePromotionOpen, setIsCreatePromotionOpen] = useState(false);
  const [isViewPromotionOpen, setIsViewPromotionOpen] = useState(false);
  const [isViewDevelopmentPlanOpen, setIsViewDevelopmentPlanOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionRequest | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<HighPotentialEmployee | null>(null);
  
  const [promotionRequests, setPromotionRequests] = useState<PromotionRequest[]>([
    { 
      id: 1, 
      employee: "Emily Brown", 
      currentPosition: "UI Designer", 
      proposedPosition: "Senior UI Designer", 
      manager: "David Lee",
      department: "Product Design",
      requestDate: "April 15, 2025",
      status: "Under Review",
      justification: "Emily has consistently delivered exceptional UI designs that have received positive feedback from users and stakeholders. She has taken on additional responsibilities including mentoring junior designers and contributing to the design system."
    },
    { 
      id: 2, 
      employee: "Michael Wilson", 
      currentPosition: "Product Manager", 
      proposedPosition: "Senior Product Manager", 
      manager: "Sarah Johnson",
      department: "Product Management",
      requestDate: "April 10, 2025",
      status: "Approved",
      justification: "Michael has successfully led three major product launches that exceeded revenue targets by 20%. He has demonstrated excellent cross-functional leadership and strategic planning abilities."
    },
    { 
      id: 3, 
      employee: "Alex Johnson", 
      currentPosition: "Software Developer", 
      proposedPosition: "Senior Developer", 
      manager: "John Smith",
      department: "Engineering",
      requestDate: "April 5, 2025",
      status: "HR Review",
      justification: "Alex has shown exceptional technical skills in backend development and has taken on technical leadership for two critical projects. Their code quality and documentation standards have been exemplary."
    },
    { 
      id: 4, 
      employee: "Jessica Miller", 
      currentPosition: "Marketing Specialist", 
      proposedPosition: "Marketing Manager", 
      manager: "Robert Chen",
      department: "Marketing",
      requestDate: "March 28, 2025",
      status: "Declined",
      justification: "Jessica has shown growth in campaign management but requires more experience with team leadership and strategic planning before advancing to a management role."
    }
  ]);
  
  const [highPotentialEmployees, setHighPotentialEmployees] = useState<HighPotentialEmployee[]>([
    { 
      id: 1, 
      name: "Daniel Davis", 
      position: "Customer Support Lead", 
      department: "Customer Service",
      readinessLevel: "Ready Now",
      manager: "Maria Garcia",
      developmentPlan: {
        careerGoal: "Customer Support Manager",
        strengths: [
          "Exceptional customer communication",
          "Problem solving under pressure",
          "Team mentorship"
        ],
        developmentAreas: [
          "Budget management",
          "Strategic planning",
          "Handling conflict"
        ],
        actions: [
          {
            type: "Training",
            description: "Complete Leadership Fundamentals course",
            deadline: "June 30, 2025"
          },
          {
            type: "Project",
            description: "Lead customer satisfaction improvement initiative",
            deadline: "Aug 15, 2025"
          },
          {
            type: "Mentorship",
            description: "Shadow Customer Success Manager for 2 weeks",
            deadline: "July 31, 2025"
          }
        ]
      }
    },
    { 
      id: 2, 
      name: "Sophia Martinez", 
      position: "Financial Analyst", 
      department: "Finance",
      readinessLevel: "Ready in 3-6 months",
      manager: "William Taylor",
      developmentPlan: {
        careerGoal: "Senior Financial Analyst",
        strengths: [
          "Financial modeling",
          "Data analysis",
          "Attention to detail"
        ],
        developmentAreas: [
          "Executive presentations",
          "Strategic financial planning",
          "Cross-functional collaboration"
        ],
        actions: [
          {
            type: "Training",
            description: "Advanced Financial Analysis certification",
            deadline: "Sept 15, 2025"
          },
          {
            type: "Exposure",
            description: "Present quarterly financial review to leadership",
            deadline: "July 15, 2025"
          },
          {
            type: "Project",
            description: "Lead cost optimization project for one department",
            deadline: "Aug 30, 2025"
          }
        ]
      }
    },
    { 
      id: 3, 
      name: "James Wilson", 
      position: "Software Developer", 
      department: "Engineering",
      readinessLevel: "Ready in 6-12 months",
      manager: "John Smith",
      developmentPlan: {
        careerGoal: "Senior Software Developer",
        strengths: [
          "Technical expertise",
          "Code quality",
          "Problem solving"
        ],
        developmentAreas: [
          "Mentoring junior developers",
          "Project planning",
          "System architecture"
        ],
        actions: [
          {
            type: "Training",
            description: "Advanced Architecture Patterns course",
            deadline: "Oct 15, 2025"
          },
          {
            type: "Mentorship",
            description: "Mentor two junior developers",
            deadline: "Ongoing through 2025"
          },
          {
            type: "Project",
            description: "Lead technical design for new feature",
            deadline: "Dec 31, 2025"
          }
        ]
      }
    }
  ]);
  
  const promotionForm = useForm<PromotionFormData>({
    defaultValues: {
      employee: '',
      currentPosition: '',
      proposedPosition: '',
      manager: '',
      department: '',
      justification: ''
    }
  });
  
  const handleCreatePromotion = () => {
    setIsCreatePromotionOpen(true);
    promotionForm.reset({
      employee: '',
      currentPosition: '',
      proposedPosition: '',
      manager: '',
      department: '',
      justification: ''
    });
    speak("Creating a new promotion request. This process includes performance justification, skill assessment, and proper documentation to support the proposed advancement.");
  };
  
  const handleViewPromotion = (promotion: PromotionRequest) => {
    setSelectedPromotion(promotion);
    setIsViewPromotionOpen(true);
    speak(`Viewing promotion details for ${promotion.employee}. This shows the complete promotion case including current position, proposed position, and justification for the advancement.`);
  };
  
  const handleApprovePromotion = (promotion: PromotionRequest) => {
    setSelectedPromotion(promotion);
    setIsApproveDialogOpen(true);
    speak(`Preparing to approve promotion for ${promotion.employee}. Once approved, HR will process the promotion including title change, compensation adjustment, and update to organizational charts.`);
  };
  
  const handleConfirmApproval = () => {
    if (!selectedPromotion) return;
    
    setPromotionRequests(prev => prev.map(req => {
      if (req.id === selectedPromotion.id) {
        return {
          ...req,
          status: 'Approved'
        };
      }
      return req;
    }));
    
    setIsApproveDialogOpen(false);
    toast({
      title: "Promotion Approved",
      description: `Promotion request for ${selectedPromotion.employee} has been approved.`
    });
    speak(`Promotion approved. The request for ${selectedPromotion.employee} to be promoted to ${selectedPromotion.proposedPosition} has been approved. HR will process the necessary changes.`);
  };
  
  const handleViewDevelopmentPlan = (employee: HighPotentialEmployee) => {
    setSelectedEmployee(employee);
    setIsViewDevelopmentPlanOpen(true);
    speak(`Viewing career development plan for ${employee.name}. This outlines skills to develop, training opportunities, and mentorship arrangements to prepare for future advancement.`);
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'requests') {
      speak("Viewing promotion requests. This section shows active requests for promotions that require review and approval.");
    } else {
      speak("Viewing high potential employees. This section identifies employees on accelerated development paths with targeted career advancement plans.");
    }
  };
  
  const onSubmitPromotion = (data: PromotionFormData) => {
    const newRequest: PromotionRequest = {
      id: Date.now(),
      employee: data.employee,
      currentPosition: data.currentPosition,
      proposedPosition: data.proposedPosition,
      manager: data.manager,
      department: data.department,
      requestDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Under Review',
      justification: data.justification
    };
    
    setPromotionRequests(prev => [newRequest, ...prev]);
    setIsCreatePromotionOpen(false);
    toast({
      title: "Promotion Requested",
      description: `Promotion request for ${data.employee} has been submitted.`
    });
    speak(`Promotion request successfully submitted. The request for ${data.employee} to be promoted from ${data.currentPosition} to ${data.proposedPosition} has been sent for review.`);
    promotionForm.reset();
  };

  const getStatusColor = (status: PromotionStatus) => {
    switch (status) {
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "HR Review": return "bg-blue-100 text-blue-800";
      case "Approved": return "bg-green-100 text-green-800";
      case "Declined": return "bg-red-100 text-red-800";
    }
  };

  const getReadinessColor = (readiness: ReadinessLevel) => {
    switch (readiness) {
      case "Ready Now": return "bg-green-100 text-green-800";
      case "Ready in 3-6 months": return "bg-blue-100 text-blue-800";
      case "Ready in 6-12 months": return "bg-purple-100 text-purple-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Promotion Management</h3>
          <p className="text-muted-foreground text-sm">
            Track promotion requests and high potential employees
          </p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Tabs 
            defaultValue="requests" 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="requests">Promotion Requests</TabsTrigger>
              <TabsTrigger value="highpotential">High Potential</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button onClick={handleCreatePromotion}>
            <Plus className="mr-2 h-4 w-4" />
            Request Promotion
          </Button>
        </div>
      </div>
      
      <TabsContent value="requests" className="space-y-4 mt-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Active Promotion Requests</CardTitle>
            <CardDescription>
              Track status of pending promotion recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Current promotion requests and their status.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Current Position</TableHead>
                  <TableHead>Proposed Position</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotionRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.employee}</TableCell>
                    <TableCell>{request.currentPosition}</TableCell>
                    <TableCell>{request.proposedPosition}</TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewPromotion(request)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Button>
                        {(request.status === "HR Review" || request.status === "Under Review") && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleApprovePromotion(request)}
                            title="Approve Promotion"
                          >
                            <CheckCircle size={16} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="highpotential" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>High Potential Employees</CardTitle>
            <CardDescription>
              Employees identified for accelerated development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Employees on leadership development track.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Current Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Readiness Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highPotentialEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReadinessColor(employee.readinessLevel)}`}>
                        {employee.readinessLevel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDevelopmentPlan(employee)}
                        title="View Development Plan"
                      >
                        <FileText size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Create Promotion Request Dialog */}
      <Dialog open={isCreatePromotionOpen} onOpenChange={setIsCreatePromotionOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Request Promotion</DialogTitle>
            <DialogDescription>
              Submit a promotion recommendation for an employee.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...promotionForm}>
            <form onSubmit={promotionForm.handleSubmit(onSubmitPromotion)} className="space-y-4">
              <FormField
                control={promotionForm.control}
                name="employee"
                rules={{ required: "Employee name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter employee name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={promotionForm.control}
                  name="currentPosition"
                  rules={{ required: "Current position is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Current job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={promotionForm.control}
                  name="proposedPosition"
                  rules={{ required: "Proposed position is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposed Position</FormLabel>
                      <FormControl>
                        <Input placeholder="New job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={promotionForm.control}
                  name="manager"
                  rules={{ required: "Manager name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager</FormLabel>
                      <FormControl>
                        <Input placeholder="Manager's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={promotionForm.control}
                  name="department"
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Department name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={promotionForm.control}
                name="justification"
                rules={{ required: "Justification is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Justification</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide detailed justification for this promotion"
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include specific achievements, skills, and qualifications that support this promotion
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsCreatePromotionOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Promotion Details Dialog */}
      <Dialog open={isViewPromotionOpen} onOpenChange={setIsViewPromotionOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Promotion Request Details</DialogTitle>
            <DialogDescription>
              Complete information about this promotion recommendation.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPromotion && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Employee</h4>
                  <p>{selectedPromotion.employee}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Department</h4>
                  <p>{selectedPromotion.department || "Not specified"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Current Position</h4>
                  <p>{selectedPromotion.currentPosition}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Proposed Position</h4>
                  <p>{selectedPromotion.proposedPosition}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Request Date</h4>
                  <p>{selectedPromotion.requestDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Status</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPromotion.status)}`}>
                    {selectedPromotion.status}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold">Manager</h4>
                <p>{selectedPromotion.manager}</p>
              </div>
              
              {selectedPromotion.justification && (
                <div>
                  <h4 className="text-sm font-semibold">Justification</h4>
                  <p className="text-sm whitespace-pre-line">{selectedPromotion.justification}</p>
                </div>
              )}
              
              {selectedPromotion.status === "Under Review" || selectedPromotion.status === "HR Review" ? (
                <div className="flex justify-end pt-4">
                  <Button onClick={() => {
                    setIsViewPromotionOpen(false);
                    handleApprovePromotion(selectedPromotion);
                  }}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Promotion
                  </Button>
                </div>
              ) : null}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewPromotionOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Development Plan Dialog */}
      <Dialog open={isViewDevelopmentPlanOpen} onOpenChange={setIsViewDevelopmentPlanOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Career Development Plan</DialogTitle>
            <DialogDescription>
              Development plan for {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee?.developmentPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Employee</h4>
                  <p>{selectedEmployee.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Current Position</h4>
                  <p>{selectedEmployee.position}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Department</h4>
                  <p>{selectedEmployee.department}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Readiness Level</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReadinessColor(selectedEmployee.readinessLevel)}`}>
                    {selectedEmployee.readinessLevel}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold">Career Goal</h4>
                <p>{selectedEmployee.developmentPlan.careerGoal}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Key Strengths</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedEmployee.developmentPlan.strengths.map((strength, index) => (
                      <li key={index} className="text-sm">{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Development Areas</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedEmployee.developmentPlan.developmentAreas.map((area, index) => (
                      <li key={index} className="text-sm">{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Development Actions</h4>
                <Accordion type="single" collapsible className="w-full">
                  {selectedEmployee.developmentPlan.actions.map((action, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2 text-left">
                          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">{action.type}</span>
                          <span>{action.description}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-6 py-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Deadline:</span>
                            <span className="font-medium">{action.deadline}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDevelopmentPlanOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Promotion Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Approve Promotion</DialogTitle>
            <DialogDescription>
              You are approving a promotion for {selectedPromotion?.employee}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPromotion && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Employee</p>
                  <p className="font-medium">{selectedPromotion.employee}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Position</p>
                  <p className="font-medium">{selectedPromotion.currentPosition}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Proposed Position</p>
                <p className="font-medium">{selectedPromotion.proposedPosition}</p>
              </div>
            </div>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-2">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Note:</span> Approving this promotion will trigger the formal promotion process, 
              including compensation adjustments, title changes, and system updates.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmApproval}>
              <Award className="mr-2 h-4 w-4" />
              Approve Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
