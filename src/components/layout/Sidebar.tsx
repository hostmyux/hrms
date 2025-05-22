
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import { useResponsive } from '../../hooks/useResponsive';
import { 
  Users, Building, Briefcase, Clock, PieChart, BarChart, 
  Shield, Bell, Calendar, Folder, MessageSquare, 
  Settings, UserPlus, Book, History, Menu, X
} from 'lucide-react';
import { SidebarItem } from './sidebar/SidebarItem';
import { SidebarSection } from './sidebar/SidebarSection';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { ChevronLeftIcon, ChevronRightIcon } from './sidebar/SidebarIcons';

export const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { speak } = useVoice();
  const { addAction, preferences, updatePreferences } = useUser();
  const { isMobile } = useResponsive();

  // Set collapsed state based on user preferences
  useEffect(() => {
    if (preferences?.sidebarCollapsed !== undefined) {
      setIsCollapsed(isMobile ? true : preferences.sidebarCollapsed);
    }
  }, [preferences, isMobile]);

  useEffect(() => {
    // Auto-collapse on mobile
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  // Handle route change on mobile - close sidebar when navigating
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    updatePreferences({ sidebarCollapsed: newCollapsedState });
    speak(newCollapsedState ? "Sidebar collapsed" : "Sidebar expanded");
    
    // Log user action
    addAction({
      type: "update",
      description: `${newCollapsedState ? "Collapsed" : "Expanded"} sidebar`,
      module: "Navigation"
    });
  };

  const handleToggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavigation = (path: string, label: string) => {
    // Log navigation actions
    addAction({
      type: "navigation",
      description: `Navigated to ${label}`,
      module: label
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile toggle button */}
      {isMobile && (
        <button 
          className="fixed top-4 left-4 z-50 p-2 bg-card rounded-md shadow-md"
          onClick={handleToggleMobile}
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "flex flex-col h-screen bg-card border-r border-border transition-all duration-300 fixed lg:relative z-40",
          isCollapsed ? "w-[70px]" : "w-64",
          isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex items-center px-4 py-5 border-b border-border">
          {!isCollapsed ? (
            <h1 className="text-xl font-bold text-hrms-primary">HRMS Nexus</h1>
          ) : (
            <h1 className="text-lg font-bold text-hrms-primary mx-auto">HN</h1>
          )}
          <button 
            className={cn(
              "ml-auto text-foreground/70 hover:text-foreground",
              isMobile && "hidden"
            )}
            onClick={handleToggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto py-4 px-3">
          <SidebarSection title="Main" isCollapsed={isCollapsed}>
            <SidebarItem 
              icon={<PieChart size={18} />} 
              label="Dashboard" 
              href="/" 
              isActive={location.pathname === '/'}
              onClick={() => handleNavigation("/", "Dashboard")}
            />
          </SidebarSection>

          <SidebarSection title="Organization" isCollapsed={isCollapsed}>
            <SidebarItem 
              icon={<Building size={18} />} 
              label="Organization" 
              href="/organization" 
              isActive={location.pathname.startsWith('/organization')}
              onClick={() => handleNavigation("/organization", "Organization")}
            />
            <SidebarItem 
              icon={<Users size={18} />} 
              label="Employees" 
              href="/employees" 
              isActive={location.pathname.startsWith('/employees')}
              onClick={() => handleNavigation("/employees", "Employees")}
            />
          </SidebarSection>

          <SidebarSection title="HR Processes" isCollapsed={isCollapsed}>
            <SidebarItem 
              icon={<UserPlus size={18} />} 
              label="Recruitment" 
              href="/recruitment" 
              isActive={location.pathname.startsWith('/recruitment')}
              onClick={() => handleNavigation("/recruitment", "Recruitment")}
            />
            <SidebarItem 
              icon={<Clock size={18} />} 
              label="Attendance" 
              href="/attendance" 
              isActive={location.pathname.startsWith('/attendance')}
              onClick={() => handleNavigation("/attendance", "Attendance")}
            />
            <SidebarItem 
              icon={<BarChart size={18} />} 
              label="Performance" 
              href="/performance" 
              isActive={location.pathname.startsWith('/performance')}
              onClick={() => handleNavigation("/performance", "Performance")}
            />
            <SidebarItem 
              icon={<Briefcase size={18} />} 
              label="Payroll" 
              href="/payroll" 
              isActive={location.pathname.startsWith('/payroll')}
              onClick={() => handleNavigation("/payroll", "Payroll")}
            />
            <SidebarItem 
              icon={<Book size={18} />} 
              label="Learning" 
              href="/learning" 
              isActive={location.pathname.startsWith('/learning')}
              onClick={() => handleNavigation("/learning", "Learning")}
            />
          </SidebarSection>

          <SidebarSection title="Tools" isCollapsed={isCollapsed}>
            <SidebarItem 
              icon={<MessageSquare size={18} />} 
              label="HR Helpdesk" 
              href="/helpdesk" 
              isActive={location.pathname.startsWith('/helpdesk')}
              onClick={() => handleNavigation("/helpdesk", "Helpdesk")}
            />
            <SidebarItem 
              icon={<Bell size={18} />} 
              label="Notifications" 
              href="/notifications" 
              isActive={location.pathname.startsWith('/notifications')}
              onClick={() => handleNavigation("/notifications", "Notifications")}
            />
            <SidebarItem 
              icon={<Calendar size={18} />} 
              label="Calendar" 
              href="/calendar" 
              isActive={location.pathname.startsWith('/calendar')}
              onClick={() => handleNavigation("/calendar", "Calendar")}
            />
            <SidebarItem 
              icon={<Folder size={18} />} 
              label="Documents" 
              href="/documents" 
              isActive={location.pathname.startsWith('/documents')}
              onClick={() => handleNavigation("/documents", "Documents")}
            />
            <SidebarItem 
              icon={<History size={18} />} 
              label="User Activity" 
              href="/user-activity" 
              isActive={location.pathname.startsWith('/user-activity')}
              onClick={() => handleNavigation("/user-activity", "User Activity")}
            />
            <SidebarItem 
              icon={<Settings size={18} />} 
              label="Settings" 
              href="/settings" 
              isActive={location.pathname.startsWith('/settings')}
              onClick={() => handleNavigation("/settings", "Settings")}
            />
          </SidebarSection>
        </div>

        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
      
      {/* Spacer for fixed sidebar on mobile */}
      {isMobile && (
        <div className="w-0 lg:w-[70px]"></div>
      )}
    </>
  );
};
