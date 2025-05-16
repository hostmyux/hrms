
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { VoiceControls } from '../components/shared/VoiceControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { AttendanceTracker } from '../components/attendance/AttendanceTracker';
import { LeaveManagement } from '../components/attendance/LeaveManagement';
import { WorkFromHome } from '../components/attendance/WorkFromHome';
import { HolidayManagement } from '../components/attendance/HolidayManagement';

const Attendance: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = useState('attendance');

  useEffect(() => {
    speak("Attendance module loaded. This module helps track employee presence, manage time off, work from home arrangements, and company holidays. Use the tabs below to navigate to specific attendance management functions.");
  }, [speak]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      'attendance': "Attendance tracking view. Monitor employee time and attendance, view clock-in and clock-out times, and analyze attendance patterns.",
      'leave': "Leave management section. Process leave requests, check balances, and manage different types of leave like vacation, sick days, and personal time.",
      'wfh': "Work from home management. Review and approve remote work requests, set policies, and track remote working patterns.",
      'holidays': "Holiday calendar management. Set up company holidays, manage regional observances, and update the company-wide holiday schedule.",
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
    toast(tabMessages[value as keyof typeof tabMessages] || "");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track employee time, manage leaves, and maintain attendance records.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="attendance" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
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
          <WorkFromHome />
        </TabsContent>
        
        <TabsContent value="holidays" className="space-y-4">
          <HolidayManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
