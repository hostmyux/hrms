import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  Bell, 
  CheckCircle, 
  MapPin, 
  Coffee,
  TrendingUp,
  Award,
  Target,
  Users,
  FileText,
  LogOut,
  LogIn
} from 'lucide-react';
import { toast } from 'sonner';
import LeaveRequestForm from '../components/employee/LeaveRequestForm';
import AttendanceWidget from '../components/employee/AttendanceWidget';

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workingHours?: number;
  status: 'present' | 'late' | 'absent' | 'wfh';
}

interface LeaveRequest {
  id: string;
  type: 'annual' | 'sick' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  dueDate: string;
  category: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  
  // Mock data
  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'New Health Insurance Policy',
      content: 'Our new health insurance policy goes into effect next month. Please review the details.',
      date: '2024-01-15',
      priority: 'high',
      read: false
    },
    {
      id: '2',
      title: 'Team Building Event',
      content: 'Join us for our quarterly team building event this Friday at 3 PM.',
      date: '2024-01-14',
      priority: 'medium',
      read: false
    },
    {
      id: '3',
      title: 'Office Maintenance',
      content: 'The office will undergo maintenance this weekend. Remote work is encouraged.',
      date: '2024-01-13',
      priority: 'low',
      read: true
    }
  ]);

  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Cybersecurity Fundamentals',
      description: 'Learn the basics of cybersecurity and data protection',
      progress: 75,
      duration: '4 hours',
      dueDate: '2024-01-30',
      category: 'Security',
      status: 'in-progress'
    },
    {
      id: '2',
      title: 'Leadership Development',
      description: 'Develop your leadership skills and team management abilities',
      progress: 30,
      duration: '6 hours',
      dueDate: '2024-02-15',
      category: 'Leadership',
      status: 'in-progress'
    },
    {
      id: '3',
      title: 'Communication Skills',
      description: 'Improve your professional communication and presentation skills',
      progress: 100,
      duration: '3 hours',
      dueDate: '2024-01-10',
      category: 'Soft Skills',
      status: 'completed'
    }
  ]);

  const [attendanceStats] = useState({
    thisMonth: {
      workingDays: 22,
      present: 18,
      late: 2,
      absent: 1,
      wfh: 1,
      averageHours: 8.2
    },
    thisWeek: {
      workingDays: 5,
      present: 4,
      late: 1,
      absent: 0,
      wfh: 0,
      averageHours: 8.5
    }
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize on mount
  useEffect(() => {
    setIsCheckedIn(false);
    setTodayAttendance(null);
  }, []);

  const handleCheckIn = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    
    const attendance: AttendanceRecord = {
      id: `att_${Date.now()}`,
      date: today,
      checkIn: time,
      status: now.getHours() > 9 ? 'late' : 'present'
    };

    setTodayAttendance(attendance);
    setIsCheckedIn(true);
    
    toast.success('Checked in successfully!', {
      description: `Check-in time: ${time}`
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

  const formatDate = (time: Date) => {
    return time.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            {formatDate(currentTime)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="p-4">
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{formatTime(currentTime)}</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <AttendanceWidget />
        </div>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Leave Request</p>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setShowLeaveForm(true)}
              >
                Apply Leave
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Learning</p>
              <p className="text-2xl font-bold">{courses.filter(c => c.status === 'in-progress').length}</p>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <Bell className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Notifications</p>
              <p className="text-2xl font-bold">{announcements.filter(a => !a.read).length}</p>
              <p className="text-xs text-muted-foreground">Unread</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Status */}
      {todayAttendance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Check In</p>
                <div className="flex items-center gap-2">
                  <Badge variant={todayAttendance.status === 'late' ? 'destructive' : 'default'}>
                    {todayAttendance.checkIn}
                  </Badge>
                  {todayAttendance.status === 'late' && (
                    <span className="text-xs text-red-600">Late</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Check Out</p>
                <Badge variant={todayAttendance.checkOut ? 'default' : 'secondary'}>
                  {todayAttendance.checkOut || 'Not checked out'}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Working Hours</p>
                <Badge variant="outline">
                  {todayAttendance.workingHours ? `${todayAttendance.workingHours}h` : 'In progress'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attendance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  This Month Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{attendanceStats.thisMonth.present}</div>
                    <div className="text-xs text-muted-foreground">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{attendanceStats.thisMonth.late}</div>
                    <div className="text-xs text-muted-foreground">Late</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{attendanceStats.thisMonth.absent}</div>
                    <div className="text-xs text-muted-foreground">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{attendanceStats.thisMonth.wfh}</div>
                    <div className="text-xs text-muted-foreground">WFH</div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Average Hours</span>
                    <span className="font-medium">{attendanceStats.thisMonth.averageHours}h/day</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.slice(0, 2).map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{course.title}</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{course.category}</span>
                      <span>Due: {new Date(course.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  View All Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge 
                      variant={
                        course.status === 'completed' ? 'default' :
                        course.status === 'in-progress' ? 'secondary' : 'outline'
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{course.duration}</span>
                    <span>Due: {new Date(course.dueDate).toLocaleDateString()}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    variant={course.status === 'completed' ? 'outline' : 'default'}
                  >
                    {course.status === 'completed' ? 'Review' : 'Continue'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Working Days</span>
                    <span className="font-medium">{attendanceStats.thisWeek.workingDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Present</span>
                    <span className="font-medium text-green-600">{attendanceStats.thisWeek.present}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late</span>
                    <span className="font-medium text-orange-600">{attendanceStats.thisWeek.late}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Hours</span>
                    <span className="font-medium">{attendanceStats.thisWeek.averageHours}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Working Days</span>
                    <span className="font-medium">{attendanceStats.thisMonth.workingDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Present</span>
                    <span className="font-medium text-green-600">{attendanceStats.thisMonth.present}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late</span>
                    <span className="font-medium text-orange-600">{attendanceStats.thisMonth.late}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Absent</span>
                    <span className="font-medium text-red-600">{attendanceStats.thisMonth.absent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Work From Home</span>
                    <span className="font-medium text-blue-600">{attendanceStats.thisMonth.wfh}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Hours</span>
                    <span className="font-medium">{attendanceStats.thisMonth.averageHours}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className={!announcement.read ? 'border-l-4 border-l-primary' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      {announcement.title}
                      {!announcement.read && (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      )}
                    </CardTitle>
                    <Badge 
                      variant={
                        announcement.priority === 'high' ? 'destructive' :
                        announcement.priority === 'medium' ? 'default' : 'outline'
                      }
                    >
                      {announcement.priority}
                    </Badge>
                  </div>
                  <CardDescription>
                    {new Date(announcement.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {showLeaveForm && (
        <LeaveRequestForm
          onClose={() => setShowLeaveForm(false)}
          onSubmit={() => {
            // Refresh page or update data
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;