
import { PromotionCycle, PromotionCandidate, PromotionStatus } from './types';

export const promotionCycles: PromotionCycle[] = [
  {
    id: 1,
    name: "Q2 2025 Promotion Cycle",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    description: "Second quarter promotion review cycle for all eligible employees",
    budget: 250000,
    status: "active",
    candidates: [
      {
        id: 101,
        name: "Emily Johnson",
        employeeId: "EMP-1023",
        currentPosition: "Software Engineer II",
        currentDepartment: "Engineering",
        currentSalary: 85000,
        proposedPosition: "Senior Software Engineer",
        proposedSalary: 110000,
        manager: "Michael Chen",
        yearsInRole: 2.5,
        performanceScore: 4.8,
        justification: "Emily has consistently exceeded expectations, leading critical projects and mentoring junior engineers. Her technical expertise and communication skills make her an ideal candidate for a senior role.",
        status: "approved",
        lastReviewDate: "2025-03-15",
        notes: [
          {
            date: "2025-03-20",
            content: "Emily's promotion is strongly supported by the entire leadership team.",
            author: "Michael Chen"
          },
          {
            date: "2025-04-05",
            content: "Approved - Emily has demonstrated all competencies required for a senior role.",
            author: "HR Manager"
          }
        ]
      },
      {
        id: 102,
        name: "David Rodriguez",
        employeeId: "EMP-0892",
        currentPosition: "Marketing Specialist",
        currentDepartment: "Marketing",
        currentSalary: 65000,
        proposedPosition: "Marketing Manager",
        proposedSalary: 85000,
        manager: "Sarah Williams",
        yearsInRole: 3,
        performanceScore: 4.5,
        justification: "David has successfully led multiple campaigns that increased customer acquisition by 30%. He has demonstrated leadership skills by coordinating cross-functional teams and developing innovative marketing strategies.",
        status: "in-review",
        lastReviewDate: "2025-03-10",
        notes: [
          {
            date: "2025-03-16",
            content: "David is ready for more responsibility and has been informally leading the team for months.",
            author: "Sarah Williams"
          }
        ]
      },
      {
        id: 103,
        name: "Priya Patel",
        employeeId: "EMP-1145",
        currentPosition: "Financial Analyst",
        currentDepartment: "Finance",
        currentSalary: 70000,
        proposedPosition: "Senior Financial Analyst",
        proposedSalary: 90000,
        manager: "Robert Thompson",
        yearsInRole: 2,
        performanceScore: 4.6,
        justification: "Priya's financial models have improved forecasting accuracy by 25%. She has demonstrated exceptional analytical skills and has taken on responsibilities beyond her current role.",
        status: "pending",
        lastReviewDate: "2025-03-22",
        notes: [
          {
            date: "2025-03-25",
            content: "Priya has been crucial in our budgeting process and deserves recognition for her contributions.",
            author: "Robert Thompson"
          }
        ]
      },
      {
        id: 104,
        name: "James Wilson",
        employeeId: "EMP-0953",
        currentPosition: "Sales Representative",
        currentDepartment: "Sales",
        currentSalary: 60000,
        proposedPosition: "Senior Sales Representative",
        proposedSalary: 75000,
        manager: "Lisa Garcia",
        yearsInRole: 1.5,
        performanceScore: 4.2,
        justification: "James has consistently exceeded sales targets by an average of 20%. He has developed strong relationships with key clients and has helped onboard new sales representatives.",
        status: "in-review",
        lastReviewDate: "2025-03-18",
        notes: [
          {
            date: "2025-03-20",
            content: "James is our top performer in terms of sales metrics and customer satisfaction.",
            author: "Lisa Garcia"
          }
        ]
      },
      {
        id: 105,
        name: "Aisha Rahman",
        employeeId: "EMP-1102",
        currentPosition: "HR Specialist",
        currentDepartment: "Human Resources",
        currentSalary: 62000,
        proposedPosition: "HR Manager",
        proposedSalary: 82000,
        manager: "Daniel Taylor",
        yearsInRole: 3.5,
        performanceScore: 4.4,
        justification: "Aisha has successfully implemented new employee onboarding processes that improved retention by 15%. She has demonstrated leadership in training initiatives and policy development.",
        status: "rejected",
        lastReviewDate: "2025-03-05",
        notes: [
          {
            date: "2025-03-10",
            content: "Aisha is an excellent candidate, but needs more experience managing people before moving to a manager role.",
            author: "Daniel Taylor"
          },
          {
            date: "2025-04-02",
            content: "Recommend revisiting in 6 months after Aisha has had the opportunity to lead the new diversity initiative.",
            author: "HR Director"
          }
        ]
      },
      {
        id: 106,
        name: "Marcus Johnson",
        employeeId: "EMP-0876",
        currentPosition: "UX Designer",
        currentDepartment: "Engineering",
        currentSalary: 75000,
        proposedPosition: "Senior UX Designer",
        proposedSalary: 95000,
        manager: "Michael Chen",
        yearsInRole: 2,
        performanceScore: 4.7,
        justification: "Marcus has led the redesign of our core products, resulting in a 40% improvement in user satisfaction scores. His design systems have been adopted across all product lines.",
        status: "pending",
        lastReviewDate: "2025-03-25",
        notes: [
          {
            date: "2025-03-28",
            content: "Marcus has become our UX thought leader and deserves recognition for transforming our design approach.",
            author: "Michael Chen"
          }
        ]
      },
      {
        id: 107,
        name: "Sophia Lee",
        employeeId: "EMP-1056",
        currentPosition: "Customer Success Manager",
        currentDepartment: "Sales",
        currentSalary: 72000,
        proposedPosition: "Senior Customer Success Manager",
        proposedSalary: 90000,
        manager: "Lisa Garcia",
        yearsInRole: 2.5,
        performanceScore: 4.3,
        justification: "Sophia has maintained a 95% client retention rate, the highest in the department. She has developed new account management strategies that have been adopted by the entire team.",
        status: "pending",
        lastReviewDate: "2025-03-20",
        notes: [
          {
            date: "2025-03-22",
            content: "Sophia consistently receives positive feedback from our most demanding enterprise clients.",
            author: "Lisa Garcia"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Q1 2025 Promotion Cycle",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    description: "First quarter promotion review cycle for all eligible employees",
    budget: 200000,
    status: "completed",
    candidates: [
      {
        id: 201,
        name: "Thomas Wright",
        employeeId: "EMP-0912",
        currentPosition: "Project Manager",
        currentDepartment: "Engineering",
        currentSalary: 88000,
        proposedPosition: "Senior Project Manager",
        proposedSalary: 110000,
        manager: "Michael Chen",
        yearsInRole: 3,
        performanceScore: 4.6,
        justification: "Thomas has successfully delivered several complex projects ahead of schedule and under budget. His leadership has been instrumental in implementing new project management methodologies across the department.",
        status: "approved",
        lastReviewDate: "2025-01-15",
        notes: [
          {
            date: "2025-01-20",
            content: "Thomas consistently demonstrates exceptional project management skills and leadership abilities.",
            author: "Michael Chen"
          },
          {
            date: "2025-02-10",
            content: "Promotion approved - Thomas meets all criteria for the senior role.",
            author: "HR Manager"
          }
        ]
      },
      {
        id: 202,
        name: "Olivia Martinez",
        employeeId: "EMP-1034",
        currentPosition: "Content Strategist",
        currentDepartment: "Marketing",
        currentSalary: 68000,
        proposedPosition: "Senior Content Strategist",
        proposedSalary: 85000,
        manager: "Sarah Williams",
        yearsInRole: 2.5,
        performanceScore: 4.4,
        justification: "Olivia has developed our content strategy that increased engagement by 45%. Her leadership in content planning and creation has significantly improved our brand visibility.",
        status: "approved",
        lastReviewDate: "2025-01-18",
        notes: [
          {
            date: "2025-01-25",
            content: "Olivia has transformed our content approach and deserves this promotion.",
            author: "Sarah Williams"
          },
          {
            date: "2025-02-15",
            content: "Approved - Olivia's content initiatives have directly contributed to business growth.",
            author: "HR Manager"
          }
        ]
      },
      {
        id: 203,
        name: "Benjamin Taylor",
        employeeId: "EMP-0965",
        currentPosition: "Data Analyst",
        currentDepartment: "Finance",
        currentSalary: 70000,
        proposedPosition: "Data Scientist",
        proposedSalary: 90000,
        manager: "Robert Thompson",
        yearsInRole: 2,
        performanceScore: 4.5,
        justification: "Benjamin has implemented predictive models that improved our financial forecasting accuracy by 30%. His technical expertise and business acumen make him ideal for a more advanced role.",
        status: "rejected",
        lastReviewDate: "2025-01-20",
        notes: [
          {
            date: "2025-01-28",
            content: "Benjamin shows great promise but needs additional training in machine learning techniques required for the data scientist role.",
            author: "Robert Thompson"
          },
          {
            date: "2025-02-15",
            content: "Recommend revisiting in 6-12 months after Benjamin completes the ML certification course.",
            author: "HR Manager"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Mid-Year 2025 Promotion Cycle",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    description: "Mid-year promotion review cycle for high-potential employees",
    budget: 180000,
    status: "upcoming",
    candidates: []
  }
];
