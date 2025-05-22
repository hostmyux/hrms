
export type PromotionStatus = 'Under Review' | 'HR Review' | 'Approved' | 'Declined';
export type ReadinessLevel = 'Ready Now' | 'Ready in 3-6 months' | 'Ready in 6-12 months';

// PromotionList component types
export type PromotionStatus2 = 'pending' | 'approved' | 'rejected' | 'in-review';

export interface PromotionRequest {
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

export interface DevelopmentAction {
  type: string;
  description: string;
  deadline: string;
}

export interface DevelopmentPlan {
  careerGoal: string;
  strengths: string[];
  developmentAreas: string[];
  actions: DevelopmentAction[];
}

export interface HighPotentialEmployee {
  id: number;
  name: string;
  position: string;
  department: string;
  readinessLevel: ReadinessLevel;
  manager: string;
  developmentPlan?: DevelopmentPlan;
}

export interface PromotionFormData {
  employee: string;
  currentPosition: string;
  proposedPosition: string;
  manager: string;
  department: string;
  justification: string;
}

// Additional types needed for PromotionList and demoData
export interface PromotionCandidate {
  id: number;
  name: string;
  employeeId: string;
  currentPosition: string;
  currentDepartment: string;
  currentSalary: number;
  proposedPosition: string;
  proposedSalary: number;
  manager: string;
  yearsInRole: number;
  performanceScore: number;
  justification: string;
  status: PromotionStatus2;
  lastReviewDate: string;
  notes: {
    date: string;
    content: string;
    author: string;
  }[];
}

export interface PromotionCycle {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  budget: number;
  status: string;
  candidates: PromotionCandidate[];
}
