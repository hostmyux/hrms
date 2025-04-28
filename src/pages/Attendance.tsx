
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Home } from 'lucide-react';

const Attendance: React.FC = () => {
  const { speak } = useVoice();

  useEffect(() => {
    speak("Attendance and Leave management module loaded. Track employee attendance, manage leave requests and view reports.");
  }, [speak]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance & Leave</h1>
        <p className="text-muted-foreground">
          Track time, manage leaves, and monitor attendance.
        </p>
      </div>
      
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
          <TabsTrigger value="wfh">Work From Home</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Tracking</CardTitle>
              <CardDescription>
                Track daily employee attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <Clock size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Attendance tracking features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Management</CardTitle>
              <CardDescription>
                Request and approve leave applications
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <Calendar size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Leave management features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wfh" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work From Home</CardTitle>
              <CardDescription>
                Track work from home requests and status
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <Home size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Work from home tracking features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="holidays" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Holiday Calendar</CardTitle>
              <CardDescription>
                View and manage company holidays
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <Calendar size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Holiday management features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
