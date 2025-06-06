
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import { VoiceControls } from '../shared/VoiceControls';
import { useResponsive } from '../../hooks/useResponsive';
import { toast } from 'sonner';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { speak } = useVoice();
  const { addAction } = useUser();
  const { isMobile } = useResponsive();
  const location = useLocation();

  // Get the current path without any query parameters
  const currentPath = location.pathname;

  // Enhanced voice guidance based on route
  useEffect(() => {
    const pathToModuleMap: Record<string, { name: string, description: string }> = {
      '/': {
        name: 'Main dashboard',
        description: 'Welcome to your HR command center. Here you can view key organizational metrics, track employee activities, and access all HR modules.'
      },
      '/organization': {
        name: 'Organization management',
        description: 'This module helps you structure your company effectively. You can update company information, manage departments and job positions.'
      },
      '/employees': {
        name: 'Employee management',
        description: 'Your central hub for all employee data. Here you can view employee profiles, track work history, and manage documents.'
      },
      '/recruitment': {
        name: 'Recruitment and hiring',
        description: 'Streamline your talent acquisition process with this module. Post job openings, track applications, and schedule interviews.'
      },
      '/attendance': {
        name: 'Attendance and leave',
        description: 'Track employee attendance, manage leave requests, and monitor work from home arrangements.'
      },
      '/payroll': {
        name: 'Payroll processing',
        description: 'Handle all compensation-related tasks efficiently. Process salaries, calculate deductions, and generate payslips.'
      },
      '/performance': {
        name: 'Performance management',
        description: 'Foster employee growth with structured performance tracking. Set goals, conduct reviews, and gather feedback.'
      },
      '/learning': {
        name: 'Learning and development',
        description: 'Invest in your employees growth with comprehensive training programs. Create learning paths and track progress.'
      },
      '/reports': {
        name: 'Analytics and reports',
        description: 'Make data-driven HR decisions with powerful analytics. Generate custom reports and visualize key metrics.'
      },
      '/helpdesk': {
        name: 'HR helpdesk',
        description: 'Provide responsive support to employee inquiries. Track tickets, manage HR cases, and access knowledge base articles.'
      },
      '/notifications': {
        name: 'Notification center',
        description: 'Stay updated with all important HR activities and alerts. View system notifications and task reminders.'
      },
      '/calendar': {
        name: 'HR Calendar',
        description: 'Coordinate HR activities with a centralized calendar view. Track company events, holidays, and important deadlines.'
      },
      '/documents': {
        name: 'Document management',
        description: 'Securely store and organize all HR-related documents. Manage templates and collect e-signatures.'
      },
      '/settings': {
        name: 'System settings',
        description: 'Configure the HRMS platform to align with your organizations needs. Customize workflows and set up user roles.'
      },
      '/user-activity': {
        name: 'User Activity History',
        description: 'Track all your actions and interactions with the HRMS system. View a chronological log of your activities.'
      }
    };

    const moduleInfo = pathToModuleMap[currentPath] || { 
      name: 'Unknown module', 
      description: 'Navigate using the sidebar menu to access different HR modules.' 
    };
    
    // Only speak if voice is enabled and speak function is available
    if (speak && typeof speak === 'function') {
      try {
        speak(`${moduleInfo.name} loaded. ${moduleInfo.description}`);
      } catch (error) {
        console.error('Voice synthesis error:', error);
      }
    }
    
    // Record page navigation in user actions
    if (addAction && typeof addAction === 'function') {
      addAction({
        type: "navigation",
        description: `Visited ${moduleInfo.name}`,
        module: moduleInfo.name
      });
    }
  }, [speak, currentPath, addAction]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
