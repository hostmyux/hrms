
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { useVoice } from '../../../contexts/VoiceContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, label, href, isActive = false, onClick 
}) => {
  const { speak } = useVoice();
  const location = useLocation();
  
  // Check if current path matches this item's href
  const isCurrentPath = location.pathname === href;
  
  // Use either passed isActive prop or determine from current path
  const active = isActive || isCurrentPath;
  
  const handleClick = () => {
    speak(`Navigating to ${label} module`);
    if (onClick) onClick();
  };

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
        active ? "bg-accent text-accent-foreground font-medium" : "text-foreground/70"
      )}
      onClick={handleClick}
    >
      <span className="flex items-center justify-center w-5 h-5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};
