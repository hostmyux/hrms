
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useVoice } from '../../contexts/VoiceContext';
import { 
  Users, Building, Briefcase, Clock, PieChart, BarChart, 
  Shield, Bell, Calendar, Folder, MessageSquare, 
  User, Settings, UserPlus
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, label, href, isActive = false, onClick 
}) => {
  const { speak } = useVoice();
  
  const handleClick = () => {
    speak(`Navigating to ${label} module`);
    if (onClick) onClick();
  };

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground font-medium" : "text-foreground/70"
      )}
      onClick={handleClick}
    >
      <span className="flex items-center justify-center w-5 h-5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { speak, isVoiceEnabled, toggleVoice } = useVoice();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    speak(isCollapsed ? "Sidebar expanded" : "Sidebar collapsed");
  };

  const handleToggleVoice = () => {
    toggleVoice();
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className="flex items-center px-4 py-5 border-b border-border">
        {!isCollapsed ? (
          <h1 className="text-xl font-bold text-hrms-primary">HRMS Nexus</h1>
        ) : (
          <h1 className="text-lg font-bold text-hrms-primary mx-auto">HN</h1>
        )}
        <button 
          className="ml-auto text-foreground/70 hover:text-foreground"
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
        <div className="mb-4">
          <p className={cn(
            "text-xs font-medium text-foreground/50 mb-2",
            isCollapsed && "text-center"
          )}>
            {!isCollapsed ? "Main" : ""}
          </p>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<PieChart size={18} />} 
              label="Dashboard" 
              href="/" 
              isActive={location.pathname === '/'}
            />
          </nav>
        </div>

        <div className="mb-4">
          <p className={cn(
            "text-xs font-medium text-foreground/50 mb-2",
            isCollapsed && "text-center"
          )}>
            {!isCollapsed ? "Organization" : ""}
          </p>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<Building size={18} />} 
              label="Organization" 
              href="/organization" 
              isActive={location.pathname.startsWith('/organization')}
            />
            <SidebarItem 
              icon={<Users size={18} />} 
              label="Employees" 
              href="/employees" 
              isActive={location.pathname.startsWith('/employees')}
            />
          </nav>
        </div>

        <div className="mb-4">
          <p className={cn(
            "text-xs font-medium text-foreground/50 mb-2",
            isCollapsed && "text-center"
          )}>
            {!isCollapsed ? "HR Processes" : ""}
          </p>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<UserPlus size={18} />} 
              label="Recruitment" 
              href="/recruitment" 
              isActive={location.pathname.startsWith('/recruitment')}
            />
            <SidebarItem 
              icon={<Clock size={18} />} 
              label="Attendance" 
              href="/attendance" 
              isActive={location.pathname.startsWith('/attendance')}
            />
            <SidebarItem 
              icon={<BarChart size={18} />} 
              label="Performance" 
              href="/performance" 
              isActive={location.pathname.startsWith('/performance')}
            />
            <SidebarItem 
              icon={<Briefcase size={18} />} 
              label="Payroll" 
              href="/payroll" 
              isActive={location.pathname.startsWith('/payroll')}
            />
          </nav>
        </div>

        <div className="mb-4">
          <p className={cn(
            "text-xs font-medium text-foreground/50 mb-2",
            isCollapsed && "text-center"
          )}>
            {!isCollapsed ? "Tools" : ""}
          </p>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<MessageSquare size={18} />} 
              label="HR Helpdesk" 
              href="/helpdesk" 
              isActive={location.pathname.startsWith('/helpdesk')}
            />
            <SidebarItem 
              icon={<Bell size={18} />} 
              label="Notifications" 
              href="/notifications" 
              isActive={location.pathname.startsWith('/notifications')}
            />
            <SidebarItem 
              icon={<Calendar size={18} />} 
              label="Calendar" 
              href="/calendar" 
              isActive={location.pathname.startsWith('/calendar')}
            />
            <SidebarItem 
              icon={<Folder size={18} />} 
              label="Documents" 
              href="/documents" 
              isActive={location.pathname.startsWith('/documents')}
            />
          </nav>
        </div>
      </div>

      <div className="mt-auto border-t border-border p-3">
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <>
              <div className="w-8 h-8 rounded-full bg-hrms-primary/20 flex items-center justify-center text-hrms-primary">
                <User size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-foreground/70 truncate">admin@hrmsnexus.com</p>
              </div>
            </>
          )}
          <button 
            className={cn(
              "ml-auto w-8 h-8 rounded-full flex items-center justify-center",
              isVoiceEnabled ? "bg-hrms-primary text-white" : "bg-muted text-muted-foreground"
            )}
            onClick={handleToggleVoice}
            title={isVoiceEnabled ? "Disable voice guidance" : "Enable voice guidance"}
          >
            <MicIcon className="h-4 w-4" />
          </button>
          {isCollapsed && (
            <button 
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              title="Settings"
            >
              <Settings size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple icons for the sidebar
const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);
