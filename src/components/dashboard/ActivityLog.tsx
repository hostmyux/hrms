import React, { useEffect, useState } from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { UserPlus, FileText, Clock, Calendar, RefreshCw } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ActivityItem {
  id: string;
  type: 'new_employee' | 'leave_request' | 'document_upload' | 'attendance';
  title: string;
  description: string;
  date: string;
  user: {
    name: string;
    role: string;
  };
}

interface ActivityLogProps {
  activities: ActivityItem[];
  title?: string;
  voiceDescription?: string;
  limit?: number;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ 
  activities: initialActivities, 
  title = "Recent Activities",
  voiceDescription,
  limit = 10  // Default limit to 10
}) => {
  const { speak } = useVoice();
  const { actions } = useUser();
  const [activities, setActivities] = useState<ActivityItem[]>(
    initialActivities.slice(0, limit)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Effect to sync with user actions from context
  useEffect(() => {
    const transformRecentActions = () => {
      // Only get actions from the last 24 hours
      const recentActions = actions
        .filter(action => {
          const actionDate = new Date(action.timestamp);
          const now = new Date();
          const diff = now.getTime() - actionDate.getTime();
          return diff < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        })
        .slice(0, 3); // Get the 3 most recent actions
      
      // Transform actions to activity format
      const newActivities = recentActions.map(action => {
        let type: 'new_employee' | 'leave_request' | 'document_upload' | 'attendance' = 'document_upload';
        
        if (action.module === 'Employees' && action.type === 'create') {
          type = 'new_employee';
        } else if (action.module === 'Attendance') {
          type = 'leave_request';
        } else if (action.type === 'view' || action.type === 'navigation') {
          type = 'attendance';
        }
        
        return {
          id: `action-${action.id}`, // Use a unique prefix to avoid key conflicts
          type,
          title: action.module,
          description: action.description,
          date: new Date(action.timestamp).toLocaleString(),
          user: {
            name: 'Current User',
            role: 'User'
          }
        };
      });
      
      // Only update if there are new actions
      if (newActivities.length > 0) {
        // Merge with existing activities but avoid duplicates
        setActivities(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const filteredNew = newActivities.filter(a => !existingIds.has(a.id));
          // Return the most recent activities first, respecting the limit
          return [...filteredNew, ...prev].slice(0, limit);
        });
      }
    };
    
    transformRecentActions();
  }, [actions, limit]);

  // Set up polling for real-time updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      // This simulates polling for new activities
      setLastUpdated(new Date());
      
      // Simulate occasional new activities (random chance to add a new activity)
      if (Math.random() > 0.7) {
        const mockActivity: ActivityItem = {
          id: `auto-${Date.now()}`, // Ensure unique ID
          type: Math.random() > 0.5 ? 'document_upload' : 'attendance',
          title: 'System Update',
          description: 'Automated system activity detected',
          date: new Date().toLocaleString(),
          user: {
            name: 'System',
            role: 'Automated'
          }
        };
        
        setActivities(prev => [mockActivity, ...prev.slice(0, limit - 1)]);
        
        // Show toast notification for new activity
        toast("New activity detected", {
          description: "System has detected a new activity in the background"
        });
      }
    }, 60000); // Poll every minute
    
    return () => clearInterval(intervalId);
  }, [limit]);

  const refreshActivities = () => {
    setIsLoading(true);
    
    // Simulate an API call with a timeout
    setTimeout(() => {
      // Simulate getting a new activity
      const newActivity: ActivityItem = {
        id: `refresh-${Date.now()}`, // Use timestamp for unique ID
        type: 'leave_request',
        title: 'Fresh Activity',
        description: 'New activity after manual refresh',
        date: new Date().toLocaleString(),
        user: {
          name: 'System',
          role: 'Refresh'
        }
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, limit - 1)]);
      
      // Update last updated time
      setLastUpdated(new Date());
      setIsLoading(false);
      toast("Activities refreshed", {
        description: "New activity loaded"
      });
    }, 800);
  };

  React.useEffect(() => {
    if (voiceDescription) {
      // Register this component with voice assistant when mounted
    }
  }, [voiceDescription]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_employee':
        return <UserPlus className="w-5 h-5" />;
      case 'leave_request':
        return <Calendar className="w-5 h-5" />;
      case 'document_upload':
        return <FileText className="w-5 h-5" />;
      case 'attendance':
        return <Clock className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'new_employee':
        return 'bg-green-100 text-green-600';
      case 'leave_request':
        return 'bg-amber-100 text-amber-600';
      case 'document_upload':
        return 'bg-blue-100 text-blue-600';
      case 'attendance':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getDetailedActivityDescription = (activity: ActivityItem) => {
    let detailedDescription = `${activity.title}: ${activity.description}`;
    
    switch (activity.type) {
      case 'new_employee':
        detailedDescription += `. This represents an addition to your workforce. Consider checking if all onboarding steps have been completed.`;
        break;
      case 'leave_request':
        detailedDescription += `. Ensure team coverage during this absence and verify that the leave balance is accurate.`;
        break;
      case 'document_upload':
        detailedDescription += `. Make sure to review the document for compliance with company policies.`;
        break;
      case 'attendance':
        detailedDescription += `. Check for any anomalies or patterns that may require attention.`;
        break;
    }
    
    detailedDescription += ` Action taken by ${activity.user.name}, ${activity.user.role} on ${activity.date}`;
    return detailedDescription;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Recent HR activities • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={refreshActivities} 
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      <div className="divide-y divide-border">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className="p-4 hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => speak(getDetailedActivityDescription(activity))}
              aria-label={`Activity: ${activity.title}`}
            >
              <div className="flex items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span>{activity.user.name} • {activity.user.role}</span>
                    <span className="mx-1">•</span>
                    <span>{activity.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No recent activities found</p>
          </div>
        )}
      </div>
    </div>
  );
};
