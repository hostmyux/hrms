
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoice } from '../../contexts/VoiceContext';

interface EmptyNotificationsProps {
  category: string;
}

export const EmptyNotifications: React.FC<EmptyNotificationsProps> = ({ category }) => {
  const { speak } = useVoice();
  
  const getCategorySpecificMessage = () => {
    switch(category) {
      case 'system':
        return {
          title: 'No system notifications',
          message: 'You don\'t have any system alerts at the moment. System notifications will appear here when there are platform updates or important announcements.'
        };
      case 'task':
        return {
          title: 'No task notifications',
          message: 'There are no pending task notifications. When you have approvals, reviews, or action items requiring attention, they will appear here.'
        };
      case 'message':
        return {
          title: 'No message notifications',
          message: 'Your message inbox is empty. When colleagues share documents or send you messages, notifications will appear here.'
        };
      default:
        return {
          title: 'No notifications',
          message: 'You don\'t have any notifications at the moment. Notifications about tasks, messages, and system alerts will appear here.'
        };
    }
  };
  
  const categoryMessage = getCategorySpecificMessage();
  
  const handleExploreFeatures = () => {
    speak("The notification system tracks important events across the HR platform. You'll receive alerts for approvals, document shares, system changes, and deadlines. You can filter by category or mark items as read to keep your workspace organized.");
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-xl font-medium text-center">{categoryMessage.title}</p>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-md">
          {categoryMessage.message}
        </p>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={handleExploreFeatures}
        >
          Learn about notifications
        </Button>
      </CardContent>
    </Card>
  );
};
