
import React from 'react';
import { cn } from '../../../lib/utils';
import { User, Settings } from 'lucide-react';
import { useVoice } from '../../../contexts/VoiceContext';
import { MicIcon } from './SidebarIcons';

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ isCollapsed }) => {
  const { isVoiceEnabled, toggleVoice } = useVoice();

  const handleToggleVoice = () => {
    toggleVoice();
  };

  return (
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
  );
};
