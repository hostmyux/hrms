
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { VoiceControls } from '../components/shared/VoiceControls';
import { NotificationCard } from '../components/notifications/NotificationCard';
import { EmptyNotifications } from '../components/notifications/EmptyNotifications';

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
      { id: '1', title: 'Leave Request Approved', description: 'Your leave request for June 15-20 has been approved by your manager.', type: 'success', date: new Date(2025, 5, 10, 9, 30), isRead: false, category: 'task' },
      { id: '2', title: 'New Performance Review', description: 'You have a new performance review scheduled for next week.', type: 'info', date: new Date(2025, 5, 9, 14, 15), isRead: true, category: 'task' },
      { id: '3', title: 'System Maintenance', description: 'The system will undergo maintenance on Sunday from 2-4 AM.', type: 'warning', date: new Date(2025, 5, 8, 11, 0), isRead: false, category: 'system' },
      { id: '4', title: 'New Document Shared', description: 'HR has shared a new document: "Updated Employee Handbook"', type: 'info', date: new Date(2025, 5, 7, 16, 45), isRead: false, category: 'message' },
      { id: '5', title: 'Payslip Generated', description: 'Your payslip for May 2025 has been generated.', type: 'success', date: new Date(2025, 5, 5, 10, 0), isRead: true, category: 'system' },
      { id: '6', title: 'Training Enrollment Confirmed', description: 'You are enrolled in "Effective Leadership Workshop" on May 15.', type: 'success', date: new Date(2025, 5, 4, 8, 0), isRead: false, category: 'task' },
      { id: '7', title: 'Team Meeting Reminder', description: 'Weekly standup meeting starts in 30 minutes.', type: 'info', date: new Date(2025, 5, 3, 9, 30), isRead: true, category: 'task' },
      { id: '8', title: 'Password Expiry Warning', description: 'Your password will expire in 7 days. Please update it.', type: 'warning', date: new Date(2025, 5, 2, 7, 0), isRead: false, category: 'system' },
      { id: '9', title: 'New Job Opening', description: 'A new position for Senior DevOps Engineer is available.', type: 'info', date: new Date(2025, 5, 1, 12, 0), isRead: true, category: 'message' },
      { id: '10', title: 'Expense Report Approved', description: 'Your travel expense report of $1,250 has been approved.', type: 'success', date: new Date(2025, 4, 30, 15, 0), isRead: false, category: 'task' },
      { id: '11', title: 'Holiday Calendar Updated', description: 'Company holiday calendar for 2025 has been updated with new dates.', type: 'info', date: new Date(2025, 4, 28, 10, 0), isRead: true, category: 'system' },
      { id: '12', title: 'Benefits Enrollment Open', description: 'Open enrollment for health benefits starts today.', type: 'warning', date: new Date(2025, 4, 27, 8, 30), isRead: false, category: 'system' },
      { id: '13', title: 'New Policy Published', description: 'Updated Work From Home policy has been published.', type: 'info', date: new Date(2025, 4, 25, 11, 0), isRead: true, category: 'message' },
      { id: '14', title: 'Leave Balance Alert', description: 'You have 3 unused leave days expiring this month.', type: 'warning', date: new Date(2025, 4, 24, 9, 0), isRead: false, category: 'task' },
      { id: '15', title: 'Onboarding Task Complete', description: 'New employee orientation session has been completed.', type: 'success', date: new Date(2025, 4, 23, 16, 0), isRead: true, category: 'task' },
      { id: '16', title: 'IT Ticket Resolved', description: 'Your VPN access issue (TKT-005) has been resolved.', type: 'success', date: new Date(2025, 4, 22, 14, 30), isRead: false, category: 'system' },
      { id: '17', title: 'Feedback Received', description: 'Your manager has submitted feedback on your Q1 performance.', type: 'info', date: new Date(2025, 4, 20, 10, 0), isRead: true, category: 'message' },
      { id: '18', title: 'Server Upgrade Notice', description: 'HR portal will be upgraded this weekend with new features.', type: 'info', date: new Date(2025, 4, 18, 8, 0), isRead: true, category: 'system' },
      { id: '19', title: 'Promotion Announcement', description: 'Congratulations! You have been promoted to Senior Associate.', type: 'success', date: new Date(2025, 4, 15, 9, 0), isRead: false, category: 'message' },
      { id: '20', title: 'Tax Documents Available', description: 'Your W-2 tax documents for 2024 are now available for download.', type: 'info', date: new Date(2025, 4, 10, 11, 0), isRead: true, category: 'system' },
    ];

    setNotifications(sampleNotifications);
    const unreadCount = sampleNotifications.filter(n => !n.isRead).length;
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

  const getFilteredNotifications = (category: string) => {
    return category === 'all' 
      ? notifications 
      : notifications.filter(notification => notification.category === category);
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
                <NotificationCard 
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
            ) : (
              <EmptyNotifications category={category} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Notifications;
