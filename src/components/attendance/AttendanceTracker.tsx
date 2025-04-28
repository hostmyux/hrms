
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVoice } from '../../contexts/VoiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar, Clock, ArrowRightLeft, CheckCircle2, AlertCircle, CalendarDays, User } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isWeekend, isSameDay } from 'date-fns';

// Types for attendance data
type AttendanceStatus = 'present' | 'absent' | 'late' | 'halfDay' | 'weekend' | 'holiday';

type AttendanceRecord = {
  date: Date;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  notes?: string;
};

type EmployeeAttendance = {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  records: AttendanceRecord[];
};

// Mock data function
const fetchAttendance = async (month: Date, employeeId?: string): Promise<EmployeeAttendance[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  
  const employees = [
    { id: '1', name: 'John Doe', employeeId: 'EMP001', department: 'Engineering' },
    { id: '2', name: 'Jane Smith', employeeId: 'EMP002', department: 'Marketing' },
    { id: '3', name: 'Robert Johnson', employeeId: 'EMP003', department: 'HR' },
  ];
  
  // Filter by employee ID if provided
  const filteredEmployees = employeeId 
    ? employees.filter(emp => emp.employeeId === employeeId)
    : employees;
  
  return filteredEmployees.map(emp => {
    const records = days.map(day => {
      // Create random attendance data
      const isWeekendDay = isWeekend(day);
      
      if (isWeekendDay) {
        return {
          date: day,
          status: 'weekend' as AttendanceStatus,
        };
      }
      
      // Simulate fixed holidays
      if (day.getDate() === 15) {
        return {
          date: day,
          status: 'holiday' as AttendanceStatus,
          notes: 'Company Holiday'
        };
      }
      
      // Random attendance status for other days
      const statusOptions: AttendanceStatus[] = ['present', 'absent', 'late', 'halfDay'];
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      let checkIn, checkOut, workHours;
      
      if (randomStatus === 'present') {
        checkIn = '09:00 AM';
        checkOut = '06:00 PM';
        workHours = 9;
      } else if (randomStatus === 'late') {
        checkIn = '10:30 AM';
        checkOut = '06:30 PM';
        workHours = 8;
      } else if (randomStatus === 'halfDay') {
        checkIn = '09:00 AM';
        checkOut = '01:30 PM';
        workHours = 4.5;
      }
      
      return {
        date: day,
        status: randomStatus,
        checkIn,
        checkOut,
        workHours,
        notes: randomStatus === 'absent' ? 'No check-in recorded' : undefined
      };
    });
    
    return {
      ...emp,
      records
    };
  });
};

export const AttendanceTracker: React.FC = () => {
  const { toast } = useToast();
  const { speak } = useVoice();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [attendanceData, setAttendanceData] = useState<EmployeeAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('monthly');

  // Load attendance data
  useEffect(() => {
    const loadAttendance = async () => {
      setIsLoading(true);
      try {
        const employeeId = selectedEmployee !== 'all' ? selectedEmployee : undefined;
        const data = await fetchAttendance(selectedMonth, employeeId);
        setAttendanceData(data);
        speak("Attendance records loaded. You can view, track, and manage employee attendance here.");
      } catch (error) {
        toast({
          title: "Error loading attendance",
          description: "Failed to load attendance records. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAttendance();
  }, [speak, toast, selectedMonth, selectedEmployee]);

  // Get status badge
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Present
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Absent
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 mr-1" /> Late
          </span>
        );
      case 'halfDay':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ArrowRightLeft className="w-3 h-3 mr-1" /> Half Day
          </span>
        );
      case 'weekend':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Calendar className="w-3 h-3 mr-1" /> Weekend
          </span>
        );
      case 'holiday':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <CalendarDays className="w-3 h-3 mr-1" /> Holiday
          </span>
        );
    }
  };

  // Count attendance by status for selected month
  const getAttendanceSummary = (records: AttendanceRecord[]) => {
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      weekend: 0,
      holiday: 0
    };
    
    records.forEach(record => {
      summary[record.status]++;
    });
    
    return summary;
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-primary mr-2" />
            <CardTitle>Attendance Tracking</CardTitle>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="EMP001">John Doe</SelectItem>
                <SelectItem value="EMP002">Jane Smith</SelectItem>
                <SelectItem value="EMP003">Robert Johnson</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[160px] justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(selectedMonth, "MMMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={selectedMonth}
                  onSelect={(date) => date && setSelectedMonth(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <div className="inline-flex items-center rounded-md border border-input bg-background p-1">
              <Button 
                variant={viewMode === 'monthly' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('monthly')}
              >
                Monthly
              </Button>
              <Button 
                variant={viewMode === 'daily' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('daily')}
              >
                Daily
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {viewMode === 'monthly' ? (
          <div className="space-y-6">
            {/* Attendance Summary */}
            {selectedEmployee !== 'all' && attendanceData.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                {Object.entries(getAttendanceSummary(attendanceData[0].records)).map(([status, count]) => (
                  <div key={status} className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground capitalize">{status}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Monthly Attendance Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                      const currentDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
                      if (currentDate.getMonth() !== selectedMonth.getMonth()) return null;
                      
                      return (
                        <TableHead key={day} className="text-center px-1">
                          <div>{day}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(currentDate, 'EEE')}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={32} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <User size={48} strokeWidth={1.5} className="mb-2" />
                          <p>No attendance records found for the selected criteria.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendanceData.map(employee => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {employee.name}
                          <div className="text-xs text-muted-foreground">{employee.employeeId}</div>
                        </TableCell>
                        
                        {employee.records.map(record => {
                          const status = record.status;
                          let bgColor = '';
                          
                          switch (status) {
                            case 'present': bgColor = 'bg-green-100'; break;
                            case 'absent': bgColor = 'bg-red-100'; break;
                            case 'late': bgColor = 'bg-amber-100'; break;
                            case 'halfDay': bgColor = 'bg-blue-100'; break;
                            case 'weekend': bgColor = 'bg-gray-100'; break;
                            case 'holiday': bgColor = 'bg-purple-100'; break;
                          }
                          
                          return (
                            <TableCell 
                              key={record.date.toISOString()} 
                              className={`text-center p-0 ${bgColor} ${isToday(record.date) ? 'border-2 border-primary' : ''}`}
                            >
                              <div className="p-1 text-xs">
                                {status === 'present' && 'P'}
                                {status === 'absent' && 'A'}
                                {status === 'late' && 'L'}
                                {status === 'halfDay' && 'H'}
                                {status === 'weekend' && 'W'}
                                {status === 'holiday' && 'HD'}
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Legend:</h4>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 mr-1"></div>
                  <span className="text-sm">P - Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-100 mr-1"></div>
                  <span className="text-sm">A - Absent</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-amber-100 mr-1"></div>
                  <span className="text-sm">L - Late</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-100 mr-1"></div>
                  <span className="text-sm">H - Half Day</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 mr-1"></div>
                  <span className="text-sm">W - Weekend</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-100 mr-1"></div>
                  <span className="text-sm">HD - Holiday</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Daily View
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(selectedDate, "MMMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Working Hours</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <User size={48} strokeWidth={1.5} className="mb-2" />
                          <p>No attendance records found for the selected date.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendanceData.map(employee => {
                      const dayRecord = employee.records.find(record => 
                        isSameDay(record.date, selectedDate)
                      );
                      
                      if (!dayRecord) return null;
                      
                      return (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.name}
                            <div className="text-xs text-muted-foreground">{employee.department}</div>
                          </TableCell>
                          <TableCell>{getStatusBadge(dayRecord.status)}</TableCell>
                          <TableCell>{dayRecord.checkIn || '-'}</TableCell>
                          <TableCell>{dayRecord.checkOut || '-'}</TableCell>
                          <TableCell>{dayRecord.workHours?.toFixed(1) || '-'}</TableCell>
                          <TableCell>{dayRecord.notes || '-'}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
