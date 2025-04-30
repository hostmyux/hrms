
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';

interface EmptyNotificationsProps {
  category: string;
}

export const EmptyNotifications: React.FC<EmptyNotificationsProps> = ({ category }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-xl font-medium text-center">No notifications</p>
        <p className="text-sm text-muted-foreground text-center mt-2">
          You don't have any {category !== 'all' ? category : ''} notifications at the moment.
        </p>
      </CardContent>
    </Card>
  );
};
