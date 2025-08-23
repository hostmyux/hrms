
import React from 'react';
import { cn } from '../../lib/utils';
import { useVoice } from '../../contexts/VoiceContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  voiceDescription?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
  voiceDescription
}) => {
  const { speak } = useVoice();

  const handleClick = () => {
    speak(voiceDescription || `${title}: ${value}. ${description || ''}`);
  };

  return (
    <div 
      className={cn(
        "bg-card rounded-lg border border-border p-6 hover:shadow-md transition-all cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-4">
          <span className={cn(
            "text-xs font-medium mr-1",
            trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">from last month</span>
        </div>
      )}
    </div>
  );
};
