
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useVoice } from '../../contexts/VoiceContext';
import { VoiceControls } from '../shared/VoiceControls';
import { toast } from '@/components/ui/use-toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { speak } = useVoice();
  const location = useLocation();

  // Get the current path without any query parameters
  const currentPath = location.pathname;

  // Enhanced voice guidance based on route
  useEffect(() => {
    const pathToModuleMap: Record<string, { name: string, description: string }> = {
      '/': {
        name: 'Main dashboard',
        description: 'Welcome to your HR command center. Here you can view key organizational metrics, track employee activities, and access all HR modules. Use the sidebar navigation to explore specific functions or the quick stats cards for an overview of your organization\'s current status.'
      },
      '/organization': {
        name: 'Organization management',
        description: 'This module helps you structure your company effectively. You can update company information, manage departments and job positions, track office locations, and visualize your organization\'s hierarchy. Use the tabs below to navigate between different organization management functions.'
      },
      '/employees': {
        name: 'Employee management',
        description: 'Your central hub for all employee data. Here you can view employee profiles, track work history, manage documents, and handle employee lifecycle events from onboarding to offboarding. Use the search function to quickly find specific employees.'
      },
      '/recruitment': {
        name: 'Recruitment and hiring',
        description: 'Streamline your talent acquisition process with this module. Post job openings, track applications, schedule interviews, and manage candidate communications all in one place. The pipeline view will help you visualize where candidates are in the hiring process.'
      },
      '/attendance': {
        name: 'Attendance and leave',
        description: 'Track employee attendance, manage leave requests, and monitor work from home arrangements. The calendar view gives you a comprehensive overview of team availability, while the approval workflow ensures proper management of time-off requests.'
      },
      '/payroll': {
        name: 'Payroll processing',
        description: 'Handle all compensation-related tasks efficiently. Process salaries, calculate deductions, generate payslips, and maintain compliance with tax regulations. The payroll dashboard shows you the current processing status and key metrics at a glance.'
      },
      '/performance': {
        name: 'Performance management',
        description: 'Foster employee growth with structured performance tracking. Set goals, conduct reviews, gather feedback, and identify high performers. The performance cycle tools help ensure regular and meaningful performance discussions.'
      },
      '/learning': {
        name: 'Learning and development',
        description: 'Invest in your employees\' growth with comprehensive training programs. Create learning paths, assign courses, track progress, and measure skill development. The learning analytics help you identify training needs and evaluate program effectiveness.'
      },
      '/reports': {
        name: 'Analytics and reports',
        description: 'Make data-driven HR decisions with powerful analytics. Generate custom reports, visualize key metrics, and track HR KPIs over time. The interactive dashboards help you spot trends and identify areas needing attention.'
      },
      '/helpdesk': {
        name: 'HR helpdesk',
        description: 'Provide responsive support to employee inquiries. Track tickets, manage HR cases, access knowledge base articles, and analyze common questions. The self-service portal empowers employees to find information independently.'
      },
      '/notifications': {
        name: 'Notification center',
        description: 'Stay updated with all important HR activities and alerts. View system notifications, task reminders, and employee updates. You can filter notifications by type and mark them as read when addressed.'
      },
      '/calendar': {
        name: 'HR Calendar',
        description: 'Coordinate HR activities with a centralized calendar view. Track company events, holidays, reviews, and important deadlines. The integrated scheduling tools help you plan and manage time-sensitive HR processes.'
      },
      '/documents': {
        name: 'Document management',
        description: 'Securely store and organize all HR-related documents. Manage templates, collect e-signatures, set access permissions, and track document versions. The document categories help maintain a structured repository of HR materials.'
      },
      '/settings': {
        name: 'System settings',
        description: 'Configure the HRMS platform to align with your organization\'s needs. Customize workflows, set up user roles, define approval chains, and manage system integrations. Regular review of settings ensures optimal system performance.'
      },
    };

    const moduleInfo = pathToModuleMap[currentPath] || { 
      name: 'Unknown module', 
      description: 'Navigate using the sidebar menu to access different HR modules. Each module is designed to streamline specific aspects of human resources management. If you need guidance, the voice assistant can explain each feature in detail.' 
    };
    
    // Speak the module name and brief description
    speak(`${moduleInfo.name} loaded. ${moduleInfo.description}`);
    
    // Show toast notification for module change
    toast({
      title: moduleInfo.name,
      description: moduleInfo.description,
      duration: 5000,
    });
  }, [speak, currentPath]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
