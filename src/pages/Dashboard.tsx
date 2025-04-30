
import React from 'react';
import { Users, Clock, Calendar, FileText, UserPlus, BarChart } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { EmployeeTable } from '../components/dashboard/EmployeeTable';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { useVoice } from '../contexts/VoiceContext';
import { VoiceControls } from '../components/shared/VoiceControls';

// Mock data
const employees = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'active' as const
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    department: 'Marketing',
    position: 'Marketing Manager',
    status: 'active' as const
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '(555) 444-3333',
    department: 'Human Resources',
    position: 'HR Specialist',
    status: 'on-leave' as const
  },
  {
    id: '4',
    name: 'Bob Williams',
    email: 'bob.williams@example.com',
    phone: '(555) 222-1111',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'active' as const
  },
  {
    id: '5',
    name: 'Carol Brown',
    email: 'carol.brown@example.com',
    phone: '(555) 666-7777',
    department: 'Sales',
    position: 'Sales Representative',
    status: 'terminated' as const
  }
];

const activities = [
  {
    id: '1',
    type: 'new_employee' as const,
    title: 'New Employee Joined',
    description: 'Samantha Lee has joined the Marketing team as a Content Specialist',
    date: 'Today at 10:30 AM',
    user: {
      name: 'HR Manager',
      role: 'HR'
    }
  },
  {
    id: '2',
    type: 'leave_request' as const,
    title: 'Leave Request Approved',
    description: 'Alex Morgan\'s vacation request for July 15-22 has been approved',
    date: 'Today at 9:15 AM',
    user: {
      name: 'Department Manager',
      role: 'Manager'
    }
  },
  {
    id: '3',
    type: 'document_upload' as const,
    title: 'Policy Document Updated',
    description: 'Work from Home policy has been updated with new guidelines',
    date: 'Yesterday at 4:45 PM',
    user: {
      name: 'Policy Admin',
      role: 'Admin'
    }
  },
  {
    id: '4',
    type: 'attendance' as const,
    title: 'Attendance Report Generated',
    description: 'Monthly attendance report for June 2025 has been generated',
    date: 'Yesterday at 2:30 PM',
    user: {
      name: 'System',
      role: 'Automated'
    }
  }
];

const Dashboard: React.FC = () => {
  const { speak } = useVoice();
  
  React.useEffect(() => {
    speak("Welcome to the HRMS Dashboard. This is your central command center for human resources management. The overview cards show key metrics like employee count, leave status, open positions, and pending approvals. Below, you'll find recent employee details and activity logs. Use the voice assistant for step-by-step guidance through any HR process.");
  }, [speak]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your human resources system
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Employees" 
          value="245" 
          icon={<Users size={24} />} 
          trend={{ value: 12, isPositive: true }}
          voiceDescription="Total of 245 employees, which is a 12% increase from last month. This trend suggests healthy organizational growth. Consider reviewing departmental distribution to ensure balanced resource allocation."
        />
        <StatCard 
          title="On Leave Today" 
          value="8" 
          icon={<Calendar size={24} />} 
          description="3.2% of workforce"
          voiceDescription="8 employees are currently on leave today, representing 3.2% of the total workforce. This is within expected absence rates. You can click this card to view detailed absence distribution by department."
        />
        <StatCard 
          title="Open Positions" 
          value="12" 
          icon={<UserPlus size={24} />} 
          trend={{ value: 5, isPositive: true }}
          voiceDescription="12 open positions are currently available across departments, which is a 5% increase from last month. Consider reviewing recruitment timelines and exploring additional hiring channels to expedite the filling of critical roles."
        />
        <StatCard 
          title="Pending Approvals" 
          value="18" 
          icon={<FileText size={24} />} 
          description="Leave and expense requests"
          voiceDescription="18 pending approvals waiting for your review, including leave requests and expense approvals. Consider setting aside time to review these items to maintain operational efficiency and employee satisfaction with approval turnaround times."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <EmployeeTable 
          employees={employees} 
          voiceDescription="Recent employee listing showing key personnel information. You can click on any employee row to view their detailed profile and employment history."
        />
        <ActivityLog 
          activities={activities}
          voiceDescription="Recent HR activities across your organization. Each entry represents an important event that may require your attention or awareness."  
        />
      </div>
    </div>
  );
};

export default Dashboard;
