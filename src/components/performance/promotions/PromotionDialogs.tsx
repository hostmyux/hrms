import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage, FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Award, Calendar, FileText } from 'lucide-react';
import { 
  Accordion, AccordionContent, 
  AccordionItem, AccordionTrigger 
} from '@/components/ui/accordion';
import { PromotionRequest, HighPotentialEmployee, PromotionFormData, PromotionCandidate } from './types';
import { UseFormReturn } from 'react-hook-form';

interface PromotionDialogsProps {
  isCreatePromotionOpen?: boolean;
  setIsCreatePromotionOpen?: (value: boolean) => void;
  isViewPromotionOpen?: boolean;
  setIsViewPromotionOpen?: (value: boolean) => void;
  isViewDevelopmentPlanOpen?: boolean;
  setIsViewDevelopmentPlanOpen?: (value: boolean) => void;
  isApproveDialogOpen?: boolean;
  setIsApproveDialogOpen?: (value: boolean) => void;
  selectedPromotion?: PromotionRequest | null;
  selectedEmployee?: HighPotentialEmployee | null;
  promotionForm?: UseFormReturn<PromotionFormData>;
  onSubmitPromotion?: (data: PromotionFormData) => void;
  handleConfirmApproval?: () => void;
  handleApprovePromotion?: (promotion: PromotionRequest) => void;
  getStatusColor?: (status: string) => string;
  getReadinessColor?: (readiness: string) => string;
  
  dialogType?: 'view' | 'approve' | 'reject' | null;
  candidate?: PromotionCandidate | null;
  onClose?: () => void;
  onApprove?: (reason: string) => void;
  onReject?: (reason: string) => void;
}

export const PromotionDialogs: React.FC<PromotionDialogsProps> = ({
  isCreatePromotionOpen,
  setIsCreatePromotionOpen,
  isViewPromotionOpen,
  setIsViewPromotionOpen,
  isViewDevelopmentPlanOpen,
  setIsViewDevelopmentPlanOpen,
  isApproveDialogOpen,
  setIsApproveDialogOpen,
  selectedPromotion,
  selectedEmployee,
  promotionForm,
  onSubmitPromotion,
  handleConfirmApproval,
  handleApprovePromotion,
  getStatusColor,
  getReadinessColor,
  dialogType,
  candidate,
  onClose,
  onApprove,
  onReject
}) => {
  if (dialogType !== undefined && candidate !== undefined) {
    return (
      <>
        {/* View Candidate Details Dialog */}
        <Dialog open={dialogType === 'view'} onOpenChange={() => onClose && onClose()}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Promotion Request Details</DialogTitle>
              <DialogDescription>
                Complete information about this promotion request
              </DialogDescription>
            </DialogHeader>
            
            {candidate && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">Employee</h4>
                    <p>{candidate.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Employee ID</h4>
                    <p>{candidate.employeeId}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">Current Position</h4>
                    <p>{candidate.currentPosition}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Department</h4>
                    <p>{candidate.currentDepartment}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">Proposed Position</h4>
                    <p>{candidate.proposedPosition}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Manager</h4>
                    <p>{candidate.manager}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">Current Salary</h4>
                    <p>${candidate.currentSalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Proposed Salary</h4>
                    <p>${candidate.proposedSalary.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">Years in Role</h4>
                    <p>{candidate.yearsInRole}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Performance Score</h4>
                    <p>{candidate.performanceScore} / 5.0</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold">Justification</h4>
                  <p className="text-sm whitespace-pre-line">{candidate.justification}</p>
                </div>
                
                {candidate.notes && candidate.notes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Notes</h4>
                    <div className="space-y-2">
                      {candidate.notes.map((note, idx) => (
                        <div key={idx} className="bg-muted/50 p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">{note.author}</span>
                            <span className="text-xs text-muted-foreground">{note.date}</span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onClose && onClose()}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Approve Dialog */}
        <Dialog open={dialogType === 'approve'} onOpenChange={() => onClose && onClose()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Promotion</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this promotion request?
              </DialogDescription>
            </DialogHeader>
            
            {candidate && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Employee</p>
                    <p className="font-medium">{candidate.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Current Position</p>
                    <p className="font-medium">{candidate.currentPosition}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Proposed Position</p>
                  <p className="font-medium">{candidate.proposedPosition}</p>
                </div>
              </div>
            )}
            
            <Textarea 
              placeholder="Add comments (optional)" 
              className="min-h-[100px]" 
              id="approvalReason"
            />
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onClose && onClose()}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  const reasonEl = document.getElementById('approvalReason') as HTMLTextAreaElement;
                  onApprove && onApprove(reasonEl.value || 'Promotion approved');
                }}
              >
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Reject Dialog */}
        <Dialog open={dialogType === 'reject'} onOpenChange={() => onClose && onClose()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Promotion</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this promotion request
              </DialogDescription>
            </DialogHeader>
            
            {candidate && (
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <p className="font-medium">{candidate.name} - {candidate.currentPosition} to {candidate.proposedPosition}</p>
              </div>
            )}
            
            <Textarea 
              placeholder="Reason for rejection (required)" 
              className="min-h-[100px]" 
              id="rejectionReason"
            />
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onClose && onClose()}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  const reasonEl = document.getElementById('rejectionReason') as HTMLTextAreaElement;
                  if (reasonEl.value.trim()) {
                    onReject && onReject(reasonEl.value);
                  }
                }}
              >
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      {/* Create Promotion Request Dialog */}
      <Dialog open={!!isCreatePromotionOpen} onOpenChange={setIsCreatePromotionOpen || (() => {})}>
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
      <Dialog open={!!isViewPromotionOpen} onOpenChange={setIsViewPromotionOpen || (() => {})}>
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
                    <Award className="mr-2 h-4 w-4" />
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
      <Dialog open={!!isViewDevelopmentPlanOpen} onOpenChange={setIsViewDevelopmentPlanOpen || (() => {})}>
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
      <Dialog open={!!isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen || (() => {})}>
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
    </>
  );
};
