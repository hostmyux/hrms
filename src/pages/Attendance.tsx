
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceTracker } from '../components/attendance/AttendanceTracker';
import { LeaveManagement } from '../components/attendance/LeaveManagement';
import { VoiceControls } from '../components/shared/VoiceControls';
import { Card, CardContent } from '@/components/ui/card';
import { Home, CalendarDays } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Attendance: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = React.useState('attendance');

  useEffect(() => {
    speak("Attendance and Leave management module loaded. This workspace helps you track employee presence, manage time-off requests, and monitor attendance patterns. Comprehensive analytics provide insights into attendance trends and help identify potential issues before they affect productivity.");
  }, [speak]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      'attendance': "Attendance tracking section. Monitor real-time clock-ins and clock-outs, view daily attendance reports, and analyze attendance patterns. The biometric integration ensures accurate time recording while the anomaly detection helps identify irregular patterns.",
      'leave': "Leave management section. Process time-off requests, track leave balances, and manage approval workflows. The calendar visualization helps team managers plan for staff availability while ensuring adequate coverage.",
      'wfh': "Work from home management. Track remote work arrangements, monitor productivity metrics, and ensure policy compliance. The distributed team dashboard helps maintain visibility across geographically dispersed teams.",
      'holidays': "Holiday calendar management. Configure company holidays, regional observances, and customize working day calendars for different locations. The multi-location support ensures accurate attendance calculation across global operations."
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
    toast({
      title: `${value.charAt(0).toUpperCase() + value.slice(1)} Management`,
      description: tabMessages[value as keyof typeof tabMessages] || "",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance & Leave</h1>
          <p className="text-muted-foreground">
            Track time, manage leaves, and monitor attendance.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="attendance" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
          <TabsTrigger value="wfh">Work From Home</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="space-y-4">
          <AttendanceTracker />
        </TabsContent>
        
        <TabsContent value="leave" className="space-y-4">
          <LeaveManagement />
        </TabsContent>
        
        <TabsContent value="wfh" className="space-y-4">
          <Card>
            <CardContent className="pt-6 flex items-center justify-center p-8 text-center min-h-[300px]">
              <div>
                <Home size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Work From Home</h3>
                <p className="text-muted-foreground">
                  Track and manage work from home requests. Set policies, approve requests, and monitor remote work schedules.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="holidays" className="space-y-4">
          <Card>
            <CardContent className="pt-6 flex items-center justify-center p-8 text-center min-h-[300px]">
              <div>
                <CalendarDays size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Holiday Calendar</h3>
                <p className="text-muted-foreground">
                  Manage company-wide holidays, regional holidays, and configure working days for different office locations.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
