import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';
import { canAccessRoute } from '../../utils/rolePermissions';
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
  const { user } = useAuth();
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
          className="fixed inset-0 bg-black/50 z-50"
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
          "flex flex-col h-full bg-card border-r border-border transition-all duration-300 relative",
          isCollapsed ? "w-[70px]" : "w-64",
          isMobile ? (isMobileOpen ? "fixed inset-y-0 left-0 z-40 w-64" : "hidden") : "flex"
        )}
      >
        <div className="flex items-center px-4 py-5 border-b border-border">
          {!isCollapsed ? (
            <h1 className="text-xl font-bold text-primary">HRMS Nexus</h1>
          ) : (
            <h1 className="text-lg font-bold text-primary mx-auto">HN</h1>
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

          {user && (canAccessRoute(user.role, '/organization') || user.role === 'hr_manager') && (
            <SidebarSection title="Organization" isCollapsed={isCollapsed}>
              <SidebarItem 
                icon={<Building size={18} />} 
                label="Organization" 
                href="/organization" 
                isActive={location.pathname.startsWith('/organization')}
                onClick={() => handleNavigation("/organization", "Organization")}
              />
              {(canAccessRoute(user.role, '/employees') || user.role === 'hr_manager') && (
                <SidebarItem 
                  icon={<Users size={18} />} 
                  label="Employees" 
                  href="/employees" 
                  isActive={location.pathname.startsWith('/employees')}
                  onClick={() => handleNavigation("/employees", "Employees")}
                />
              )}
            </SidebarSection>
          )}

          {user && (canAccessRoute(user.role, '/recruitment') || canAccessRoute(user.role, '/attendance') || canAccessRoute(user.role, '/performance') || canAccessRoute(user.role, '/payroll') || canAccessRoute(user.role, '/learning') || user.role === 'hr_manager') && (
            <SidebarSection title="HR Processes" isCollapsed={isCollapsed}>
              {(canAccessRoute(user.role, '/recruitment') || user.role === 'hr_manager') && (
                <SidebarItem 
                  icon={<UserPlus size={18} />} 
                  label="Recruitment" 
                  href="/recruitment" 
                  isActive={location.pathname.startsWith('/recruitment')}
                  onClick={() => handleNavigation("/recruitment", "Recruitment")}
                />
              )}
              {canAccessRoute(user.role, '/attendance') && (
                <SidebarItem 
                  icon={<Clock size={18} />} 
                  label="Attendance" 
                  href="/attendance" 
                  isActive={location.pathname.startsWith('/attendance')}
                  onClick={() => handleNavigation("/attendance", "Attendance")}
                />
              )}
              {canAccessRoute(user.role, '/performance') && (
                <SidebarItem 
                  icon={<BarChart size={18} />} 
                  label="Performance" 
                  href="/performance" 
                  isActive={location.pathname.startsWith('/performance')}
                  onClick={() => handleNavigation("/performance", "Performance")}
                />
              )}
              {(canAccessRoute(user.role, '/payroll') || user.role === 'hr_manager') && (
                <SidebarItem 
                  icon={<Briefcase size={18} />} 
                  label="Payroll" 
                  href="/payroll" 
                  isActive={location.pathname.startsWith('/payroll')}
                  onClick={() => handleNavigation("/payroll", "Payroll")}
                />
              )}
              {canAccessRoute(user.role, '/learning') && (
                <SidebarItem 
                  icon={<Book size={18} />} 
                  label="Learning" 
                  href="/learning" 
                  isActive={location.pathname.startsWith('/learning')}
                  onClick={() => handleNavigation("/learning", "Learning")}
                />
              )}
            </SidebarSection>
          )}

          <SidebarSection title="Tools" isCollapsed={isCollapsed}>
            {canAccessRoute(user.role, '/helpdesk') && (
              <SidebarItem 
                icon={<MessageSquare size={18} />} 
                label="HR Helpdesk" 
                href="/helpdesk" 
                isActive={location.pathname.startsWith('/helpdesk')}
                onClick={() => handleNavigation("/helpdesk", "Helpdesk")}
              />
            )}
            {canAccessRoute(user.role, '/notifications') && (
              <SidebarItem 
                icon={<Bell size={18} />} 
                label="Notifications" 
                href="/notifications" 
                isActive={location.pathname.startsWith('/notifications')}
                onClick={() => handleNavigation("/notifications", "Notifications")}
              />
            )}
            {canAccessRoute(user.role, '/calendar') && (
              <SidebarItem 
                icon={<Calendar size={18} />} 
                label="Calendar" 
                href="/calendar" 
                isActive={location.pathname.startsWith('/calendar')}
                onClick={() => handleNavigation("/calendar", "Calendar")}
              />
            )}
            {canAccessRoute(user.role, '/documents') && (
              <SidebarItem 
                icon={<Folder size={18} />} 
                label="Documents" 
                href="/documents" 
                isActive={location.pathname.startsWith('/documents')}
                onClick={() => handleNavigation("/documents", "Documents")}
              />
            )}
            {canAccessRoute(user.role, '/reports') && (
              <SidebarItem 
                icon={<BarChart size={18} />} 
                label="Reports" 
                href="/reports" 
                isActive={location.pathname.startsWith('/reports')}
                onClick={() => handleNavigation("/reports", "Reports")}
              />
            )}
            {canAccessRoute(user.role, '/user-activity') && (
              <SidebarItem 
                icon={<History size={18} />} 
                label="User Activity" 
                href="/user-activity" 
                isActive={location.pathname.startsWith('/user-activity')}
                onClick={() => handleNavigation("/user-activity", "User Activity")}
              />
            )}
            {canAccessRoute(user.role, '/settings') && (
              <SidebarItem 
                icon={<Settings size={18} />} 
                label="Settings" 
                href="/settings" 
                isActive={location.pathname.startsWith('/settings')}
                onClick={() => handleNavigation("/settings", "Settings")}
              />
            )}
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
