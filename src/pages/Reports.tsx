
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, Clock, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { VoiceControls } from '../components/shared/VoiceControls';

// Mock HR Dashboard data
const employeesByDepartment = [
  { name: 'Engineering', value: 42 },
  { name: 'Marketing', value: 18 },
  { name: 'Sales', value: 24 },
  { name: 'HR', value: 12 },
  { name: 'Finance', value: 16 },
  { name: 'Operations', value: 22 },
];

const employeeJoiningData = [
  { name: 'Jan', count: 4 },
  { name: 'Feb', count: 6 },
  { name: 'Mar', count: 8 },
  { name: 'Apr', count: 12 },
  { name: 'May', count: 6 },
  { name: 'Jun', count: 9 },
  { name: 'Jul', count: 7 },
  { name: 'Aug', count: 5 },
  { name: 'Sep', count: 8 },
  { name: 'Oct', count: 10 },
  { name: 'Nov', count: 6 },
  { name: 'Dec', count: 4 },
];

const employeeTypeData = [
  { name: 'Full-time', value: 85 },
  { name: 'Part-time', value: 15 },
  { name: 'Contract', value: 24 },
  { name: 'Intern', value: 10 },
];

// Mock Recruitment data
const recruitmentFunnelData = [
  { name: 'Applications', count: 250 },
  { name: 'Screening', count: 180 },
  { name: 'Interview', count: 120 },
  { name: 'Technical', count: 80 },
  { name: 'Offer', count: 40 },
  { name: 'Hired', count: 28 },
];

const timeToHireData = [
  { position: 'Developer', days: 45 },
  { position: 'Designer', days: 38 },
  { position: 'Manager', days: 60 },
  { position: 'HR', days: 32 },
  { position: 'Sales', days: 25 },
];

// Mock Attendance data
const attendanceData = [
  { month: 'Jan', present: 92, absent: 5, leave: 3 },
  { month: 'Feb', present: 94, absent: 4, leave: 2 },
  { month: 'Mar', present: 90, absent: 6, leave: 4 },
  { month: 'Apr', present: 88, absent: 7, leave: 5 },
  { month: 'May', present: 91, absent: 5, leave: 4 },
  { month: 'Jun', present: 89, absent: 6, leave: 5 },
];

const leaveTypeData = [
  { name: 'Annual', value: 45 },
  { name: 'Sick', value: 28 },
  { name: 'Casual', value: 15 },
  { name: 'Unpaid', value: 8 },
  { name: 'Other', value: 4 },
];

// Mock Payroll data
const payrollExpenseData = [
  { month: 'Jan', amount: 245000 },
  { month: 'Feb', amount: 256000 },
  { month: 'Mar', amount: 262000 },
  { month: 'Apr', amount: 275000 },
  { month: 'May', amount: 290000 },
  { month: 'Jun', amount: 285000 },
];

const departmentExpenseData = [
  { name: 'Engineering', value: 145000 },
  { name: 'Marketing', value: 65000 },
  { name: 'Sales', value: 85000 },
  { name: 'HR', value: 42000 },
  { name: 'Finance', value: 58000 },
  { name: 'Operations', value: 75000 },
];

// COLORS for charts
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#AAAAAA'];

const Reports: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    speak("Analytics and Reports module loaded. Access HR dashboards, metrics, and generate various reports.");
  }, [speak]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      'dashboard': "HR dashboard with key metrics and KPIs for your organization.",
      'recruitment': "Recruitment analytics showing application funnel and hiring metrics.",
      'attendance': "Attendance reports with employee presence and leave analysis.",
      'payroll': "Payroll reports with salary distribution and expense analysis.",
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            View dashboards, generate reports, and analyze HR data.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">HR Dashboard</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Employees</CardTitle>
                <CardDescription>Current headcount across all locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">134</div>
                <p className="text-sm text-green-600 font-medium mt-1">↑ 12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Projects</CardTitle>
                <CardDescription>Current ongoing projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">28</div>
                <p className="text-sm text-green-600 font-medium mt-1">↑ 3 new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Retention Rate</CardTitle>
                <CardDescription>Employee retention year-to-date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">92.4%</div>
                <p className="text-sm text-green-600 font-medium mt-1">↑ 1.5% from last year</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Employees by Department</CardTitle>
                <CardDescription>Distribution of staff across departments</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={employeesByDepartment}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {employeesByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t pt-2">
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">New Hires Trend</CardTitle>
                <CardDescription>Monthly new employee onboarding</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={employeeJoiningData}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="New Employees" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t pt-2">
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Type Distribution</CardTitle>
              <CardDescription>Distribution by employment type</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={employeeTypeData}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Employees" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="border-t pt-2">
              <Button variant="ghost" size="sm" className="ml-auto">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="recruitment" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Recruitment Analytics</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Select Period
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Open Positions</CardTitle>
                <CardDescription>Currently active job openings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">16</div>
                <p className="text-sm text-green-600 font-medium mt-1">↑ 4 new positions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Applications</CardTitle>
                <CardDescription>Total applications received</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">250</div>
                <p className="text-sm text-green-600 font-medium mt-1">↑ 15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Conversion Rate</CardTitle>
                <CardDescription>Application to hire ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">11.2%</div>
                <p className="text-sm text-green-600 font-medium mt-1">↑ 2.4% improvement</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recruitment Funnel</CardTitle>
                <CardDescription>Candidate progression through stages</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={recruitmentFunnelData}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Candidates" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t pt-2">
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Time to Hire</CardTitle>
                <CardDescription>Average days to fill positions by department</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeToHireData}
                    layout="vertical"
                    margin={{
                      top: 5, right: 30, left: 80, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="position" />
                    <Tooltip />
                    <Bar dataKey="days" name="Days to Hire" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t pt-2">
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Attendance Reports</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Select Period
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Attendance</CardTitle>
                <CardDescription>Monthly attendance rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">91.4%</div>
                <p className="text-sm text-amber-600 font-medium mt-1">↓ 1.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Leave Utilization</CardTitle>
                <CardDescription>Total leave days used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">356 <span className="text-lg">days</span></div>
                <p className="text-sm text-green-600 font-medium mt-1">32% of annual quota</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Absenteeism Rate</CardTitle>
                <CardDescription>Unplanned absence rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5.6%</div>
                <p className="text-sm text-amber-600 font-medium mt-1">↑ 0.8% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Attendance Trend</CardTitle>
                <CardDescription>Attendance patterns over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendanceData}
                    margin={{
                      top: 20, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" name="Present" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="absent" name="Absent" stackId="a" fill="#ff8042" />
                    <Bar dataKey="leave" name="Leave" stackId="a" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t pt-2">
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leave Type Distribution</CardTitle>
                <CardDescription>Breakdown by leave category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leaveTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t pt-2">
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="payroll" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Payroll Reports</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Select Period
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Payroll Expenditure</CardTitle>
                <CardDescription>Total salary expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$285,000</div>
                <p className="text-sm text-amber-600 font-medium mt-1">↑ 5.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Salary</CardTitle>
                <CardDescription>Mean employee salary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$72,500</div>
                <p className="text-sm text-green-600 font-medium mt-1">Above industry average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Bonus Payout</CardTitle>
                <CardDescription>Total bonuses distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$42,800</div>
                <p className="text-sm text-green-600 font-medium mt-1">15% of total payroll</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Payroll Trend</CardTitle>
                <CardDescription>Payroll expenses over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={payrollExpenseData}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" name="Payroll" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t pt-2">
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Departmental Expenses</CardTitle>
                <CardDescription>Payroll distribution by department</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentExpenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentExpenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t pt-2">
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
