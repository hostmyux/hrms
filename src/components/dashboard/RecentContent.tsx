
import React from 'react';
import { Button } from '@/components/ui/button';
import { EmployeeTable } from './EmployeeTable';
import { ActivityLog } from './ActivityLog';
import { UserPlus } from 'lucide-react';

interface RecentContentProps {
  employees: any[];
  activities: any[];
  onAddEmployeeClick: () => void;
  onViewAllEmployees: () => void;
  onViewAllActivities: () => void;
}

export const RecentContent: React.FC<RecentContentProps> = ({ 
  employees, 
  activities, 
  onAddEmployeeClick, 
  onViewAllEmployees, 
  onViewAllActivities 
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Employees</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onAddEmployeeClick}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
            <Button size="sm" variant="ghost" onClick={onViewAllEmployees}>
              View All
            </Button>
          </div>
        </div>
        <EmployeeTable 
          employees={employees} 
          voiceDescription="Recent employee listing showing key personnel information. You can click on any employee row to view their detailed profile and employment history."
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Activities</h2>
          <Button size="sm" variant="ghost" onClick={onViewAllActivities}>
            View All
          </Button>
        </div>
        <ActivityLog 
          activities={activities}
          limit={10}
          voiceDescription="Recent HR activities across your organization. Each entry represents an important event that may require your attention or awareness."  
        />
      </div>
    </div>
  );
};
