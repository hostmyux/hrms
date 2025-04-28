
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useVoice } from '../../contexts/VoiceContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { speak } = useVoice();
  const location = useLocation();

  // Speak when layout mounts or route changes to provide location context
  useEffect(() => {
    const pathToModuleMap: Record<string, string> = {
      '/': 'Main dashboard',
      '/organization': 'Organization management',
      '/employees': 'Employee management',
      '/recruitment': 'Recruitment',
      '/attendance': 'Attendance and leave',
      '/payroll': 'Payroll',
      '/performance': 'Performance management',
      '/learning': 'Learning and development',
      '/reports': 'Analytics and reports',
      '/helpdesk': 'HR helpdesk',
      '/settings': 'System settings',
    };

    const moduleName = pathToModuleMap[location.pathname] || 'Unknown module';
    speak(`${moduleName} loaded. Navigate using the sidebar menu for different HR modules.`);
  }, [speak, location.pathname]);

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
