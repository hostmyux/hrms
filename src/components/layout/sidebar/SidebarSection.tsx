
import React from 'react';
import { cn } from '../../../lib/utils';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ 
  title,
  children,
  isCollapsed
}) => {
  return (
    <div className="mb-4">
      <p className={cn(
        "text-xs font-medium text-foreground/50 mb-2",
        isCollapsed && "text-center"
      )}>
        {!isCollapsed ? title : ""}
      </p>
      <nav className="space-y-1">
        {children}
      </nav>
    </div>
  );
};
