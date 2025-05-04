
import React from 'react';
import { Users, Calendar, UserPlus, FileText } from 'lucide-react';
import { StatCard } from './StatCard';

interface DashboardStatsProps {
  isLoading: boolean;
  dashboardData: {
    employees: number;
    onLeave: number;
    openPositions: number;
    pendingApprovals: number;
  };
  onCardClick: (destination: string, message: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  isLoading,
  dashboardData,
  onCardClick
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div 
        onClick={() => onCardClick("employees", "Navigating to employees directory where you can manage all employee records and profiles.")} 
        className="cursor-pointer"
      >
        <StatCard 
          title="Total Employees" 
          value={isLoading ? "Loading..." : dashboardData.employees.toString()} 
          icon={<Users size={24} />} 
          trend={{ value: 12, isPositive: true }}
          voiceDescription="Total of 245 employees, which is a 12% increase from last month. This trend suggests healthy organizational growth. Consider reviewing departmental distribution to ensure balanced resource allocation."
        />
      </div>
      
      <div 
        onClick={() => onCardClick("attendance", "Navigating to attendance section where you can view employee leave status and manage time-off requests.")} 
        className="cursor-pointer"
      >
        <StatCard 
          title="On Leave Today" 
          value={isLoading ? "Loading..." : dashboardData.onLeave.toString()} 
          icon={<Calendar size={24} />} 
          description="3.2% of workforce"
          voiceDescription="8 employees are currently on leave today, representing 3.2% of the total workforce. This is within expected absence rates. You can click this card to view detailed absence distribution by department."
        />
      </div>
      
      <div 
        onClick={() => onCardClick("recruitment", "Navigating to recruitment section where you can manage job postings and view candidates.")} 
        className="cursor-pointer"
      >
        <StatCard 
          title="Open Positions" 
          value={isLoading ? "Loading..." : dashboardData.openPositions.toString()} 
          icon={<UserPlus size={24} />} 
          trend={{ value: 5, isPositive: true }}
          voiceDescription="12 open positions are currently available across departments, which is a 5% increase from last month. Consider reviewing recruitment timelines and exploring additional hiring channels to expedite the filling of critical roles."
        />
      </div>
      
      <div 
        onClick={() => onCardClick("notifications", "Navigating to notifications center where you can review and approve pending requests.")} 
        className="cursor-pointer"
      >
        <StatCard 
          title="Pending Approvals" 
          value={isLoading ? "Loading..." : dashboardData.pendingApprovals.toString()} 
          icon={<FileText size={24} />} 
          description="Leave and expense requests"
          voiceDescription="18 pending approvals waiting for your review, including leave requests and expense approvals. Consider setting aside time to review these items to maintain operational efficiency and employee satisfaction with approval turnaround times."
        />
      </div>
    </div>
  );
};
