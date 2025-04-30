
import React from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { UserPlus, FileText, Clock, Calendar } from 'lucide-react';

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
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ 
  activities, 
  title = "Recent Activities",
  voiceDescription 
}) => {
  const { speak } = useVoice();

  React.useEffect(() => {
    if (voiceDescription) {
      // Register this component with voice assistant when mounted
      // This could be expanded to support more complex voice interactions
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
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">Recent HR activities</p>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity) => (
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
        ))}
      </div>
    </div>
  );
};
