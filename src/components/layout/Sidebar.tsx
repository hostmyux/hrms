
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useVoice } from '../../contexts/VoiceContext';
import { 
  Users, Building, Briefcase, Clock, PieChart, BarChart, 
  Shield, Bell, Calendar, Folder, MessageSquare, 
  Settings, UserPlus, Book
} from 'lucide-react';
import { SidebarItem } from './sidebar/SidebarItem';
import { SidebarSection } from './sidebar/SidebarSection';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { ChevronLeftIcon, ChevronRightIcon } from './sidebar/SidebarIcons';

export const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { speak } = useVoice();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    speak(isCollapsed ? "Sidebar expanded" : "Sidebar collapsed");
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
        <SidebarSection title="Main" isCollapsed={isCollapsed}>
          <SidebarItem 
            icon={<PieChart size={18} />} 
            label="Dashboard" 
            href="/" 
            isActive={location.pathname === '/'}
          />
        </SidebarSection>

        <SidebarSection title="Organization" isCollapsed={isCollapsed}>
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
        </SidebarSection>

        <SidebarSection title="HR Processes" isCollapsed={isCollapsed}>
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
          <SidebarItem 
            icon={<Book size={18} />} 
            label="Learning" 
            href="/learning" 
            isActive={location.pathname.startsWith('/learning')}
          />
        </SidebarSection>

        <SidebarSection title="Tools" isCollapsed={isCollapsed}>
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
          <SidebarItem 
            icon={<Settings size={18} />} 
            label="Settings" 
            href="/settings" 
            isActive={location.pathname.startsWith('/settings')}
          />
        </SidebarSection>
      </div>

      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
};
