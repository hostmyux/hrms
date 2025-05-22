
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { VoiceControls } from '../components/shared/VoiceControls';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { QuickAccessCards } from '../components/dashboard/QuickAccessCards';
import { RecentContent } from '../components/dashboard/RecentContent';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { localStorageService } from '../services/localStorageService';
import { useResponsive } from '../hooks/useResponsive';
import { Calendar, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { speak } = useVoice();
  const { addAction } = useUser();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  
  // Demo data
  const [dashboardData, setDashboardData] = useState({
    employees: 245,
    onLeave: 8,
    openPositions: 12,
    pendingApprovals: 18,
    lastVisit: localStorageService.getItem<string>('last_dashboard_visit', ''),
  });
  
  // Additional demo data
  const demoEmployees = [
    { id: 'e1', name: 'Jane Cooper', title: 'Regional Manager', department: 'Marketing', status: 'Active', image: '/assets/users/user-1.jpg' },
    { id: 'e2', name: 'Cody Fisher', title: 'Product Designer', department: 'Design', status: 'Active', image: '/assets/users/user-2.jpg' },
    { id: 'e3', name: 'Esther Howard', title: 'Senior Developer', department: 'Engineering', status: 'On Leave', image: '/assets/users/user-3.jpg' },
    { id: 'e4', name: 'Jenny Wilson', title: 'Marketing Coordinator', department: 'Marketing', status: 'Active', image: '/assets/users/user-4.jpg' },
    { id: 'e5', name: 'Kristin Watson', title: 'HR Manager', department: 'Human Resources', status: 'Active', image: '/assets/users/user-5.jpg' }
  ];
  
  const demoActivities = [
    { id: 'a1', type: 'new_employee', title: 'New Employee', description: 'Michael Brown joined as UI Designer', date: 'Today at 10:30 AM', user: { name: 'HR Manager', role: 'Administrator' } },
    { id: 'a2', type: 'leave_request', title: 'Leave Request', description: 'Sarah Johnson requested annual leave', date: 'Today at 9:15 AM', user: { name: 'Sarah Johnson', role: 'Employee' } },
    { id: 'a3', type: 'document_upload', title: 'Document Uploaded', description: 'Q2 Employee Handbook updated', date: 'Yesterday at 4:45 PM', user: { name: 'Admin', role: 'System' } },
    { id: 'a4', type: 'attendance', title: 'Late Arrival', description: 'Team meeting attendance report', date: 'Yesterday at 11:30 AM', user: { name: 'System', role: 'Automated' } },
    { id: 'a5', type: 'leave_request', title: 'Leave Approved', description: 'Robert Smith\'s sick leave approved', date: '2 days ago', user: { name: 'Department Head', role: 'Manager' } },
  ];

  // Store last visit time
  useEffect(() => {
    const now = new Date().toISOString();
    
    // Log page visit
    addAction({
      type: "view",
      description: "Viewed dashboard home page",
      module: "Dashboard"
    });
    
    // Store last visit in local storage
    localStorageService.setItem('last_dashboard_visit', now);
    
    // Update state with the previous last visit time
    setDashboardData(prev => ({
      ...prev,
      lastVisit: localStorageService.getItem<string>('last_dashboard_visit', now)
    }));
  }, [addAction]);

  const handleCardNavigation = (destination: string, message: string) => {
    speak(message);
    navigate(`/${destination}`);
    
    // Log navigation action
    addAction({
      type: "navigation",
      description: `Navigated to ${destination} from dashboard`,
      module: "Dashboard"
    });
    
    toast("Navigating to " + destination.charAt(0).toUpperCase() + destination.slice(1), {
      description: message,
      duration: 3000,
    });
  };

  const handleAddEmployeeClick = () => {
    speak("Opening the new employee form where you can enter details to add a new employee to your organization.");
    navigate('/employees');
    
    // Log action
    addAction({
      type: "create",
      description: "Initiated adding a new employee",
      module: "Employees"
    });
    
    toast("Add Employee", {
      description: "Opening the employee creation form.",
      duration: 3000,
    });
  };

  const handleViewAllEmployees = () => {
    navigate('/employees');
    
    // Log action
    addAction({
      type: "navigation",
      description: "Viewed all employees",
      module: "Employees"
    });
  };

  const handleViewAllActivities = () => {
    navigate('/user-activity');
    
    // Log action
    addAction({
      type: "navigation",
      description: "Viewed all activities",
      module: "User Activity"
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to HRMS Nexus - Your HR Command Center
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <VoiceControls />
          {!isMobile && (
            <Button variant="outline" onClick={() => {
              addAction({
                type: "export",
                description: "Exported dashboard data",
                module: "Dashboard"
              });
              toast("Success", {
                description: "Dashboard data exported successfully",
              });
            }}>
              Export Data
            </Button>
          )}
        </div>
      </div>

      {dashboardData.lastVisit && (
        <Alert className="bg-muted/50 border-muted">
          <Clock className="h-4 w-4" />
          <AlertTitle>Welcome back!</AlertTitle>
          <AlertDescription>
            Your last visit was {new Date(dashboardData.lastVisit).toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      <DashboardStats 
        isLoading={false} 
        dashboardData={dashboardData} 
        onCardClick={handleCardNavigation}
      />
      
      <QuickAccessCards onCardClick={handleCardNavigation} />
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your scheduled meetings and important dates</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {[
            { title: "Performance Reviews", date: "May 25, 2025", type: "Meeting", description: "Quarterly performance evaluations" },
            { title: "Team Building", date: "May 28, 2025", type: "Event", description: "Annual team building workshop" },
            { title: "Payroll Processing", date: "May 30, 2025", type: "Task", description: "Monthly payroll approval deadline" },
            { title: "New Hire Onboarding", date: "June 2, 2025", type: "Orientation", description: "Welcome session for new employees" }
          ].map((event, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors" 
              onClick={() => {
                addAction({
                  type: "view",
                  description: `Viewed event details: ${event.title}`,
                  module: "Calendar"
                });
                toast("Event Details", {
                  description: `Viewing details for ${event.title}`,
                });
              }}>
              <div className="bg-primary/10 p-2 rounded-md">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{event.title}</h4>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded">{event.type}</span>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <p className="text-xs text-muted-foreground">{event.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="ghost" onClick={() => navigate('/calendar')}>View Calendar</Button>
        </CardFooter>
      </Card>
      
      <RecentContent 
        employees={demoEmployees}
        activities={demoActivities}
        onAddEmployeeClick={handleAddEmployeeClick}
        onViewAllEmployees={handleViewAllEmployees}
        onViewAllActivities={handleViewAllActivities}
      />
    </div>
  );
};

export default Dashboard;
