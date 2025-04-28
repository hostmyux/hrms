
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useVoice } from '../../contexts/VoiceContext';
import { VoiceControls } from '../shared/VoiceControls';

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
        description: 'View key metrics and activities across your organization.'
      },
      '/organization': {
        name: 'Organization management',
        description: 'Manage company information, departments, job titles, and office locations.'
      },
      '/employees': {
        name: 'Employee management',
        description: 'Manage employee profiles, documents, and work history.'
      },
      '/recruitment': {
        name: 'Recruitment',
        description: 'Post jobs, track applications, and manage candidate interviews.'
      },
      '/attendance': {
        name: 'Attendance and leave',
        description: 'Track attendance, manage leave applications and approvals.'
      },
      '/payroll': {
        name: 'Payroll',
        description: 'Process salaries, manage tax deductions, and generate payslips.'
      },
      '/performance': {
        name: 'Performance management',
        description: 'Set goals, conduct reviews, and manage feedback.'
      },
      '/learning': {
        name: 'Learning and development',
        description: 'Manage training programs and track employee skill development.'
      },
      '/reports': {
        name: 'Analytics and reports',
        description: 'Generate custom reports and analyze HR metrics.'
      },
      '/helpdesk': {
        name: 'HR helpdesk',
        description: 'Submit and track HR support tickets and access knowledge base.'
      },
      '/settings': {
        name: 'System settings',
        description: 'Configure system preferences and permissions.'
      },
    };

    const moduleInfo = pathToModuleMap[currentPath] || { 
      name: 'Unknown module', 
      description: 'Navigate using the sidebar menu for different HR modules.' 
    };
    
    // Speak the module name and brief description
    speak(`${moduleInfo.name} loaded. ${moduleInfo.description}`);
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
