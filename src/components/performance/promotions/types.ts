
export type PromotionStatus = 'Under Review' | 'HR Review' | 'Approved' | 'Declined';
export type ReadinessLevel = 'Ready Now' | 'Ready in 3-6 months' | 'Ready in 6-12 months';

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
