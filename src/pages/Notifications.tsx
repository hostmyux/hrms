import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Clock, Users, Calendar, FileText, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { VoiceControls } from '../components/shared/VoiceControls';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: Date;
  isRead: boolean;
  category: 'system' | 'task' | 'message';
}

const Notifications: React.FC = () => {
  const { speak } = useVoice();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Sample notification data
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Leave Request Approved',
        description: 'Your leave request for June 15-20 has been approved by your manager.',
        type: 'success',
        date: new Date(2023, 5, 10, 9, 30),
        isRead: false,
        category: 'task'
      },
      {
        id: '2',
        title: 'New Performance Review',
        description: 'You have a new performance review scheduled for next week.',
        type: 'info',
        date: new Date(2023, 5, 9, 14, 15),
        isRead: true,
        category: 'task'
      },
      {
        id: '3',
        title: 'System Maintenance',
        description: 'The system will undergo maintenance on Sunday, June 12 from 2-4 AM.',
        type: 'warning',
        date: new Date(2023, 5, 8, 11, 0),
        isRead: false,
        category: 'system'
      },
      {
        id: '4',
        title: 'New Document Shared',
        description: 'HR has shared a new document: "Updated Employee Handbook"',
        type: 'info',
        date: new Date(2023, 5, 7, 16, 45),
        isRead: false,
        category: 'message'
      },
      {
        id: '5',
        title: 'Payslip Generated',
        description: 'Your payslip for May 2023 has been generated and is available for download.',
        type: 'success',
        date: new Date(2023, 5, 5, 10, 0),
        isRead: true,
        category: 'system'
      }
    ];

    setNotifications(sampleNotifications);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    speak(`Notifications center loaded. You have ${unreadCount} unread notifications. This hub centralizes all system alerts, task reminders, and important updates. Use the category filters to focus on specific notification types, and mark items as read once you've addressed them.`);
  }, [speak]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      'all': "All notifications view. This comprehensive list shows every notification across all categories, ordered by date. Use this view when you want to see the complete activity history.",
      'system': "System notifications. These are automated alerts about platform updates, maintenance windows, and important system events. Pay special attention to warnings that may affect system functionality.",
      'task': "Task notifications. These alerts relate to workflows, approvals, and action items requiring your attention. Timely response to these notifications ensures smooth business processes.",
      'message': "Message notifications. These include communications, document shares, and collaboration updates. These notifications facilitate effective information exchange across your organization."
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
    toast.success("Notification marked as read");
    speak("Notification marked as read. This will remove it from your unread count.");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    toast.success("All notifications marked as read");
    speak("All notifications have been marked as read. Your notification center is now clear.");
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast.success("Notification deleted");
    speak("Notification deleted. This action cannot be undone.");
  };

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

  const getFilteredNotifications = (category: string) => {
    return category === 'all' 
      ? notifications 
      : notifications.filter(notification => notification.category === category);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            View and manage your system notifications.
          </p>
        </div>
        <VoiceControls />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm font-medium">
            {notifications.filter(n => !n.isRead).length} Unread
          </Badge>
        </div>
        <Button 
          variant="outline" 
          onClick={markAllAsRead} 
          disabled={notifications.every(n => n.isRead)}
        >
          Mark all as read
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="task">Tasks</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
        </TabsList>
        
        {['all', 'system', 'task', 'message'].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {getFilteredNotifications(category).length > 0 ? (
              getFilteredNotifications(category).map((notification) => (
                <Card key={notification.id} className={!notification.isRead ? "border-l-4 border-l-primary" : ""}>
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
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-xl font-medium text-center">No notifications</p>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    You don't have any {category !== 'all' ? category : ''} notifications at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Notifications;
