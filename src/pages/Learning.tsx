
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceControls } from '../components/shared/VoiceControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Play, CheckCircle, Book, Search, Filter, ArrowRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

interface Course {
  id: number;
  title: string;
  category: string;
  duration: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface TrainingEvent {
  id: number;
  title: string;
  date: string;
  type: 'webinar' | 'workshop' | 'conference';
  duration: string;
  enrollmentStatus: 'open' | 'closed' | 'full';
}

const Learning: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "HR Compliance Fundamentals",
      category: "Compliance",
      duration: "2 hours",
      progress: 100,
      status: 'completed'
    },
    {
      id: 2,
      title: "Diversity & Inclusion Basics",
      category: "Culture",
      duration: "3 hours",
      progress: 45,
      status: 'in-progress'
    },
    {
      id: 3,
      title: "Performance Management Essentials",
      category: "Management",
      duration: "4 hours",
      progress: 0,
      status: 'not-started'
    },
    {
      id: 4,
      title: "Recruitment Best Practices",
      category: "Recruitment",
      duration: "2.5 hours",
      progress: 75,
      status: 'in-progress'
    },
    {
      id: 5,
      title: "Employee Onboarding 101",
      category: "Onboarding",
      duration: "1.5 hours",
      progress: 0,
      status: 'not-started'
    }
  ]);

  const [trainings, setTrainings] = useState<TrainingEvent[]>([
    {
      id: 1,
      title: "Effective Leadership Workshop",
      date: "May 15, 2025",
      type: "workshop",
      duration: "Full day",
      enrollmentStatus: "open"
    },
    {
      id: 2,
      title: "HR Tech Innovation Webinar",
      date: "May 20, 2025",
      type: "webinar",
      duration: "2 hours",
      enrollmentStatus: "open"
    },
    {
      id: 3,
      title: "Annual HR Conference 2025",
      date: "June 10-12, 2025",
      type: "conference",
      duration: "3 days",
      enrollmentStatus: "open"
    },
    {
      id: 4,
      title: "Conflict Resolution Strategies",
      date: "May 25, 2025",
      type: "workshop",
      duration: "Half day",
      enrollmentStatus: "full"
    },
    {
      id: 5,
      title: "Payroll Management Deep Dive",
      date: "April 29, 2025",
      type: "webinar",
      duration: "1.5 hours",
      enrollmentStatus: "closed"
    }
  ]);

  useEffect(() => {
    speak("Learning and development module loaded. Here you can manage employee training, courses, and development programs.");
  }, [speak]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      'courses': "Courses section. Browse and manage employee learning courses and track progress.",
      'trainings': "Training events section. View upcoming workshops, webinars, and training sessions.",
      'reports': "Learning reports section. Access analytics and insights on learning activities across the organization."
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
  };

  const startCourse = (courseId: number, courseName: string) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, status: 'in-progress' as const, progress: course.progress > 0 ? course.progress : 5 } 
        : course
    ));
    speak(`Starting the ${courseName} course. Your progress will be tracked automatically.`);
    toast.success(`Started: ${courseName}`);
  };

  const continueCourse = (courseId: number, courseName: string) => {
    speak(`Resuming the ${courseName} course. You'll continue from where you left off.`);
    toast.success(`Continuing: ${courseName}`);
  };

  const enrollTraining = (trainingId: number, trainingName: string) => {
    speak(`You've successfully enrolled in the ${trainingName}. You'll receive further details via email.`);
    toast.success(`Enrolled: ${trainingName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning & Development</h1>
          <p className="text-muted-foreground">
            Manage employee learning, courses, and development programs.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="courses" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="trainings">Training Events</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant={
                      course.status === 'completed' ? 'default' : 
                      course.status === 'in-progress' ? 'secondary' : 'outline'
                    }>
                      {course.status === 'completed' ? 'Completed' :
                       course.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                    </Badge>
                    <Badge variant="outline">{course.category}</Badge>
                  </div>
                  <CardTitle className="mt-2">{course.title}</CardTitle>
                  <CardDescription>{course.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  {course.status === 'not-started' ? (
                    <Button 
                      className="w-full" 
                      onClick={() => startCourse(course.id, course.title)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Course
                    </Button>
                  ) : course.status === 'in-progress' ? (
                    <Button 
                      className="w-full" 
                      onClick={() => continueCourse(course.id, course.title)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-full">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Certificate
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 h-[250px]">
              <Book className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Discover Courses</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Browse our catalog for more learning opportunities
              </p>
              <Button>
                Explore Catalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trainings" className="space-y-4">
          <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search training events..."
                className="pl-9"
              />
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Training Events</CardTitle>
              <CardDescription>
                Workshops, webinars, and training sessions scheduled in the coming months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.title}</TableCell>
                      <TableCell>{training.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {training.type.charAt(0).toUpperCase() + training.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{training.duration}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          training.enrollmentStatus === "open" ? "bg-green-100 text-green-800" :
                          training.enrollmentStatus === "full" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {training.enrollmentStatus.charAt(0).toUpperCase() + training.enrollmentStatus.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant={training.enrollmentStatus === "open" ? "default" : "secondary"} 
                          size="sm"
                          disabled={training.enrollmentStatus !== "open"}
                          onClick={() => enrollTraining(training.id, training.title)}
                        >
                          {training.enrollmentStatus === "open" ? "Enroll" : training.enrollmentStatus === "full" ? "Waitlist" : "Closed"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Analytics</CardTitle>
              <CardDescription>
                Track learning progress and effectiveness across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">76%</div>
                    <p className="text-xs text-muted-foreground">Average completion rate</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">184</div>
                    <p className="text-xs text-muted-foreground">Currently enrolled users</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">342</div>
                    <p className="text-xs text-muted-foreground">Year to date</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Department Participation</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Engineering</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Marketing</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Sales</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Human Resources</span>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Finance</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Download Full Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Learning;
