
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Clock, Calendar, FileText, UserPlus, BarChart } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { EmployeeTable } from '../components/dashboard/EmployeeTable';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { useVoice } from '../contexts/VoiceContext';
import { VoiceControls } from '../components/shared/VoiceControls';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

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
  const navigate = useNavigate();
  const { speak } = useVoice();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    employees: 245,
    onLeave: 8,
    openPositions: 12,
    pendingApprovals: 18
  });
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    speak("Welcome to the HRMS Dashboard. This is your central command center for human resources management. The overview cards show key metrics like employee count, leave status, open positions, and pending approvals. Below, you'll find recent employee details and activity logs. Use the voice assistant for step-by-step guidance through any HR process.");
    
    return () => clearTimeout(timer);
  }, [speak]);

  const handleAddEmployeeClick = () => {
    toast.info("Navigating to add employee form");
    speak("Opening employee creation form where you can add a new team member.");
    navigate("/employees");
  };

  const handleViewAllEmployees = () => {
    toast.info("Navigating to employees section");
    speak("Navigating to the full employee directory where you can view and manage all staff records.");
    navigate("/employees");
  };

  const handleViewAllActivities = () => {
    toast.info("Navigating to notifications center");
    speak("Opening the notifications center where you can review all recent system activities.");
    navigate("/notifications");
  };

  const handleCardClick = (destination: string, message: string) => {
    toast.info(`Navigating to ${destination}`);
    speak(message);
    navigate(`/${destination}`);
  };

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
        <div onClick={() => handleCardClick("employees", "Navigating to employees directory where you can manage all employee records and profiles.")} className="cursor-pointer">
          <StatCard 
            title="Total Employees" 
            value={isLoading ? "Loading..." : dashboardData.employees.toString()} 
            icon={<Users size={24} />} 
            trend={{ value: 12, isPositive: true }}
            voiceDescription="Total of 245 employees, which is a 12% increase from last month. This trend suggests healthy organizational growth. Consider reviewing departmental distribution to ensure balanced resource allocation."
          />
        </div>
        
        <div onClick={() => handleCardClick("attendance", "Navigating to attendance section where you can view employee leave status and manage time-off requests.")} className="cursor-pointer">
          <StatCard 
            title="On Leave Today" 
            value={isLoading ? "Loading..." : dashboardData.onLeave.toString()} 
            icon={<Calendar size={24} />} 
            description="3.2% of workforce"
            voiceDescription="8 employees are currently on leave today, representing 3.2% of the total workforce. This is within expected absence rates. You can click this card to view detailed absence distribution by department."
          />
        </div>
        
        <div onClick={() => handleCardClick("recruitment", "Navigating to recruitment section where you can manage job postings and view candidates.")} className="cursor-pointer">
          <StatCard 
            title="Open Positions" 
            value={isLoading ? "Loading..." : dashboardData.openPositions.toString()} 
            icon={<UserPlus size={24} />} 
            trend={{ value: 5, isPositive: true }}
            voiceDescription="12 open positions are currently available across departments, which is a 5% increase from last month. Consider reviewing recruitment timelines and exploring additional hiring channels to expedite the filling of critical roles."
          />
        </div>
        
        <div onClick={() => handleCardClick("notifications", "Navigating to notifications center where you can review and approve pending requests.")} className="cursor-pointer">
          <StatCard 
            title="Pending Approvals" 
            value={isLoading ? "Loading..." : dashboardData.pendingApprovals.toString()} 
            icon={<FileText size={24} />} 
            description="Leave and expense requests"
            voiceDescription="18 pending approvals waiting for your review, including leave requests and expense approvals. Consider setting aside time to review these items to maintain operational efficiency and employee satisfaction with approval turnaround times."
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Employees</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleAddEmployeeClick}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
              <Button size="sm" variant="ghost" onClick={handleViewAllEmployees}>
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
            <Button size="sm" variant="ghost" onClick={handleViewAllActivities}>
              View All
            </Button>
          </div>
          <ActivityLog 
            activities={activities}
            voiceDescription="Recent HR activities across your organization. Each entry represents an important event that may require your attention or awareness."  
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
