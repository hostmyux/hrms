import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  MapPin, 
  Wifi, 
  Calendar,
  TrendingUp,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workingHours?: number;
  status: 'present' | 'late' | 'absent' | 'wfh';
  location?: string;
}

const AttendanceWidget: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [weeklyStats, setWeeklyStats] = useState({
    totalHours: 0,
    avgHours: 0,
    onTimePercentage: 0,
    totalDays: 0
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateWeeklyStats = () => {
    // Demo stats - no persistence
    setWeeklyStats({
      totalHours: 32.5,
      avgHours: 8.1,
      onTimePercentage: 90,
      totalDays: 4
    });
  };

  // Initialize on mount
  useEffect(() => {
    calculateWeeklyStats();
  }, []);

  const handleCheckIn = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    
    const attendance: AttendanceRecord = {
      id: `att_${Date.now()}`,
      date: today,
      checkIn: time,
      status: now.getHours() > 9 ? 'late' : 'present',
      location: 'Office'
    };

    setTodayAttendance(attendance);
    setIsCheckedIn(true);
    
    toast.success('Checked in successfully!', {
      description: `Check-in time: ${time} - Status: ${attendance.status === 'late' ? 'Late' : 'On Time'}`
    });
  };

  const handleCheckOut = () => {
    if (!todayAttendance) return;
    
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    const checkInTime = new Date(`${todayAttendance.date}T${todayAttendance.checkIn}`);
    const checkOutTime = new Date(`${todayAttendance.date}T${time}`);
    const workingHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    
    const updatedAttendance = {
      ...todayAttendance,
      checkOut: time,
      workingHours: Math.round(workingHours * 100) / 100
    };

    setTodayAttendance(updatedAttendance);
    setIsCheckedIn(false);
    
    toast.success('Checked out successfully!', {
      description: `Total working hours: ${updatedAttendance.workingHours} hours`
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getWorkingProgress = () => {
    if (!todayAttendance?.checkIn || todayAttendance.checkOut) return 0;
    
    const checkInTime = new Date(`${todayAttendance.date}T${todayAttendance.checkIn}`);
    const now = new Date();
    const workedHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    const expectedHours = 8; // Standard working day
    
    return Math.min((workedHours / expectedHours) * 100, 100);
  };

  return (
    <div className="space-y-4">
      {/* Main Clock and Action Card */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Clock className="h-5 w-5" />
            Current Time
          </CardTitle>
          <div className="text-3xl font-bold text-primary">
            {formatTime(currentTime)}
          </div>
          <CardDescription>
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Button
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              className={`w-full max-w-xs ${isCheckedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              size="lg"
            >
              {isCheckedIn ? (
                <>
                  <LogOut className="mr-2 h-5 w-5" />
                  Check Out
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Check In
                </>
              )}
            </Button>
          </div>

          {/* Today's Status */}
          {todayAttendance && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Check In</div>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant={todayAttendance.status === 'late' ? 'destructive' : 'default'}>
                    {todayAttendance.checkIn}
                  </Badge>
                  {todayAttendance.status === 'late' && (
                    <span className="text-xs text-red-600">Late</span>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Check Out</div>
                <Badge variant={todayAttendance.checkOut ? 'default' : 'secondary'}>
                  {todayAttendance.checkOut || 'Not yet'}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Working Hours</div>
                <Badge variant="outline">
                  {todayAttendance.workingHours ? `${todayAttendance.workingHours}h` : 'In progress'}
                </Badge>
              </div>
            </div>
          )}

          {/* Working Progress */}
          {isCheckedIn && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Today's Progress</span>
                <span>{Math.round(getWorkingProgress())}%</span>
              </div>
              <Progress value={getWorkingProgress()} className="h-2" />
              <div className="text-xs text-muted-foreground text-center">
                Target: 8 hours
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            This Week Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalHours}h</div>
              <div className="text-xs text-muted-foreground">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{weeklyStats.avgHours}h</div>
              <div className="text-xs text-muted-foreground">Avg/Day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{weeklyStats.onTimePercentage}%</div>
              <div className="text-xs text-muted-foreground">On Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{weeklyStats.totalDays}</div>
              <div className="text-xs text-muted-foreground">Days Worked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Office Location</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">Connected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceWidget;