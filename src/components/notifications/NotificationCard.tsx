
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Clock, Settings, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useVoice } from '../../contexts/VoiceContext';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: Date;
  isRead: boolean;
  category: 'system' | 'task' | 'message';
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  onMarkAsRead,
  onDelete 
}) => {
  const { speak } = useVoice();
  
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'error': return <Bell className="h-5 w-5 text-red-500" />;
      case 'info': 
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'system': return <Settings className="h-5 w-5" />;
      case 'task': return <Users className="h-5 w-5" />;
      case 'message': 
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={!notification.isRead ? "border-l-4 border-l-primary" : ""}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {getNotificationIcon(notification.type)}
          <CardTitle className="text-base font-medium">{notification.title}</CardTitle>
          {!notification.isRead && (
            <Badge className="ml-2 bg-primary">New</Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          {getCategoryIcon(notification.category)}
          <span className="ml-1">{formatDate(notification.date)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{notification.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {!notification.isRead && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
          >
            Mark as read
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDelete(notification.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
