import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { 
  PromotionRequest, HighPotentialEmployee, 
  PromotionStatus, ReadinessLevel, PromotionFormData 
} from './promotions/types';
import { PromotionList } from './promotions/PromotionList';
import { HighPotentialList } from './promotions/HighPotentialList';
import { PromotionDialogs } from './promotions/PromotionDialogs';

export const Promotions: React.FC = () => {
  const { speak } = useVoice();
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
    toast(`Promotion request for ${selectedPromotion.employee} has been approved.`);
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
    toast(`Promotion request for ${data.employee} has been submitted.`);
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
        <PromotionList 
          promotionRequests={promotionRequests}
          onViewPromotion={handleViewPromotion}
          onApprovePromotion={handleApprovePromotion}
          getStatusColor={getStatusColor}
        />
      </TabsContent>
      
      <TabsContent value="highpotential" className="space-y-4 mt-4">
        <HighPotentialList 
          highPotentialEmployees={highPotentialEmployees}
          onViewDevelopmentPlan={handleViewDevelopmentPlan}
          getReadinessColor={getReadinessColor}
        />
      </TabsContent>

      <PromotionDialogs 
        isCreatePromotionOpen={isCreatePromotionOpen}
        setIsCreatePromotionOpen={setIsCreatePromotionOpen}
        isViewPromotionOpen={isViewPromotionOpen}
        setIsViewPromotionOpen={setIsViewPromotionOpen}
        isViewDevelopmentPlanOpen={isViewDevelopmentPlanOpen}
        setIsViewDevelopmentPlanOpen={setIsViewDevelopmentPlanOpen}
        isApproveDialogOpen={isApproveDialogOpen}
        setIsApproveDialogOpen={setIsApproveDialogOpen}
        selectedPromotion={selectedPromotion}
        selectedEmployee={selectedEmployee}
        promotionForm={promotionForm}
        onSubmitPromotion={onSubmitPromotion}
        handleConfirmApproval={handleConfirmApproval}
        handleApprovePromotion={handleApprovePromotion}
        getStatusColor={getStatusColor}
        getReadinessColor={getReadinessColor}
      />
    </div>
  );
};
