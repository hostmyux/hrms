
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Book, BookOpen, CheckCircle, Award, Video, Clock, Calendar, Search, Plus, User, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  instructorAvatar?: string;
  duration: string;
  enrolled: number;
  rating: number;
  thumbnail?: string;
  topics: string[];
  schedule?: string;
  isEnrolled?: boolean;
  progress?: number;
  completedModules?: number;
  totalModules?: number;
}

interface Certificate {
  id: string;
  title: string;
  issuedDate: string;
  expiryDate?: string;
  provider: string;
  credentialId: string;
}

const Learning: React.FC = () => {
  const { speak } = useVoice();
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isCourseCreationDialogOpen, setIsCourseCreationDialogOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');

  useEffect(() => {
    // Sample course data
    const sampleCourses: Course[] = [
      {
        id: '1',
        title: 'HR Compliance Training',
        description: 'Learn essential HR laws and compliance regulations for your organization.',
        category: 'HR',
        instructor: 'Sarah Johnson',
        instructorAvatar: 'https://randomuser.me/api/portraits/women/67.jpg',
        duration: '8 hours',
        enrolled: 124,
        rating: 4.7,
        topics: ['Discrimination Laws', 'Workplace Safety', 'Privacy Regulations'],
        schedule: 'Self-paced',
        isEnrolled: true,
        progress: 65,
        completedModules: 5,
        totalModules: 8
      },
      {
        id: '2',
        title: 'Leadership and Management',
        description: 'Develop essential leadership skills to manage teams effectively.',
        category: 'Management',
        instructor: 'Robert Chen',
        instructorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        duration: '12 hours',
        enrolled: 78,
        rating: 4.9,
        topics: ['Team Leadership', 'Conflict Resolution', 'Performance Management'],
        schedule: 'Tuesdays and Thursdays, 3-4 PM',
        isEnrolled: true,
        progress: 25,
        completedModules: 2,
        totalModules: 8
      },
      {
        id: '3',
        title: 'Effective Communication',
        description: 'Improve workplace communication for better collaboration.',
        category: 'Soft Skills',
        instructor: 'Emma Davis',
        instructorAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        duration: '6 hours',
        enrolled: 203,
        rating: 4.5,
        topics: ['Active Listening', 'Nonverbal Communication', 'Presentation Skills'],
        schedule: 'Self-paced'
      },
      {
        id: '4',
        title: 'Project Management Fundamentals',
        description: 'Learn the basics of project management methodologies and tools.',
        category: 'Management',
        instructor: 'Michael Brown',
        instructorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        duration: '10 hours',
        enrolled: 156,
        rating: 4.6,
        topics: ['Project Planning', 'Risk Management', 'Agile Methodologies'],
        schedule: 'Mondays, 2-4 PM'
      },
      {
        id: '5',
        title: 'Data Privacy and Security',
        description: 'Understand data protection principles and security best practices.',
        category: 'IT',
        instructor: 'Jennifer Smith',
        instructorAvatar: 'https://randomuser.me/api/portraits/women/17.jpg',
        duration: '5 hours',
        enrolled: 89,
        rating: 4.4,
        topics: ['GDPR', 'Data Protection', 'Security Protocols'],
        schedule: 'Self-paced',
        isEnrolled: false
      }
    ];
    setCourses(sampleCourses);

    // Sample certificate data
    const sampleCertificates: Certificate[] = [
      {
        id: '1',
        title: 'HR Compliance Professional',
        issuedDate: 'March 15, 2023',
        provider: 'HR Certification Institute',
        credentialId: 'HRC-12345'
      },
      {
        id: '2',
        title: 'Team Leadership Excellence',
        issuedDate: 'January 22, 2023',
        expiryDate: 'January 22, 2025',
        provider: 'Leadership Academy',
        credentialId: 'TLE-78901'
      }
    ];
    setCertificates(sampleCertificates);

    speak("Learning and Development module loaded. Browse training courses, track enrollments, and manage your certificates.");
  }, [speak]);

  const enrollInCourse = (courseId: string) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, isEnrolled: true, progress: 0, completedModules: 0, totalModules: Math.floor(Math.random() * 10) + 5 } 
        : course
    ));
    setIsEnrollDialogOpen(false);
    toast.success("Successfully enrolled in course");
  };

  const unenrollFromCourse = (courseId: string) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, isEnrolled: false, progress: undefined, completedModules: undefined, totalModules: undefined } 
        : course
    ));
    setSelectedCourse(null);
    toast.success("Successfully unenrolled from course");
  };

  const createNewCourse = () => {
    const newCourse: Course = {
      id: (courses.length + 1).toString(),
      title: newCourseTitle,
      description: newCourseDescription,
      category: 'Custom',
      instructor: 'Admin User',
      instructorAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      duration: 'TBD',
      enrolled: 0,
      rating: 0,
      topics: ['New Course'],
      schedule: 'Self-paced'
    };
    
    setCourses([newCourse, ...courses]);
    setNewCourseTitle('');
    setNewCourseDescription('');
    setIsCourseCreationDialogOpen(false);
    toast.success("New course created successfully");
  };

  const getFilteredCourses = (filter: string) => {
    switch(filter) {
      case 'enrolled':
        return courses.filter(course => course.isEnrolled).filter(course => 
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'all':
      default:
        return courses.filter(course => 
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning & Development</h1>
        <p className="text-muted-foreground">
          Manage training programs, courses, and employee development.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsCourseCreationDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>
      
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Course Catalog</TabsTrigger>
          <TabsTrigger value="enrollment">My Enrollments</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredCourses('all').length > 0 ? (
              getFilteredCourses('all').map((course) => (
                <Card key={course.id} className="flex flex-col h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {course.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          {course.instructorAvatar && <AvatarImage src={course.instructorAvatar} alt={course.instructor} />}
                          <AvatarFallback>{course.instructor[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{course.instructor}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{course.enrolled} enrolled</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">★</span>
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {course.topics.slice(0, 2).map((topic, index) => (
                          <Badge key={index} variant="outline">{topic}</Badge>
                        ))}
                        {course.topics.length > 2 && (
                          <Badge variant="outline">+{course.topics.length - 2}</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    {course.isEnrolled ? (
                      <Button 
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <BookOpen className="h-4 w-4" />
                        Continue Learning
                      </Button>
                    ) : (
                      <Button 
                        className="w-full flex items-center gap-2"
                        onClick={() => {
                          setSelectedCourse(course);
                          setIsEnrollDialogOpen(true);
                        }}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        Enroll Now
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-12">
                <Book className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No courses found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? 'Try a different search term' : 'Create a new course to get started'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="enrollment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredCourses('enrolled').length > 0 ? (
              getFilteredCourses('enrolled').map((course) => (
                <Card key={course.id} className="flex flex-col h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {course.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          {course.instructorAvatar && <AvatarImage src={course.instructorAvatar} alt={course.instructor} />}
                          <AvatarFallback>{course.instructor[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{course.instructor}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{course.completedModules}/{course.totalModules} modules</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => unenrollFromCourse(course.id)}
                    >
                      Unenroll
                    </Button>
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => setSelectedCourse(course)}
                    >
                      Continue
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No enrolled courses</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? 'Try a different search term' : 'Enroll in courses to start learning'}
                </p>
                <Button className="mt-4" onClick={() => document.querySelector('[data-value="courses"]')?.click()}>
                  Browse Courses
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Track your progress across all enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getFilteredCourses('enrolled').length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-5xl font-bold">{getFilteredCourses('enrolled').length}</div>
                          <p className="text-sm text-muted-foreground mt-1">Active Courses</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-5xl font-bold">
                            {Math.round(getFilteredCourses('enrolled').reduce((acc, course) => acc + (course.progress || 0), 0) / 
                              getFilteredCourses('enrolled').length)}%
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Average Completion</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-5xl font-bold">
                            {getFilteredCourses('enrolled').reduce((acc, course) => acc + (course.completedModules || 0), 0)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Modules Completed</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Course Progress</h3>
                    <div className="space-y-4">
                      {getFilteredCourses('enrolled').map((course) => (
                        <div key={course.id} className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <Book className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{course.title}</span>
                              <span className="text-sm">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <div className="space-y-4">
                      {getFilteredCourses('enrolled').slice(0, 3).map((course, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                            <Video className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Completed Module {course.completedModules} of {course.totalModules}
                            </p>
                          </div>
                          <div className="ml-auto text-sm text-muted-foreground">
                            {index === 0 ? 'Today' : index === 1 ? 'Yesterday' : '3 days ago'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-xl font-medium text-center">No progress data available</p>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Enroll in courses to track your learning progress
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="certificates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{certificate.title}</CardTitle>
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription>
                    Issued by {certificate.provider}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Issue Date</p>
                      <p className="font-medium">{certificate.issuedDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expires</p>
                      <p className="font-medium">{certificate.expiryDate || 'No Expiration'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Credential ID</p>
                      <p className="font-medium">{certificate.credentialId}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">View Certificate</Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="flex flex-col justify-center items-center py-8 border-dashed">
              <Award className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Add New Certificate</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center px-6">
                Upload your certificates to keep track of your qualifications
              </p>
              <Button>Upload Certificate</Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Course Detail Dialog */}
      <Dialog open={!!selectedCourse && !isEnrollDialogOpen} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title}</DialogTitle>
            <DialogDescription>
              {selectedCourse?.category} • {selectedCourse?.duration}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar>
                {selectedCourse?.instructorAvatar && <AvatarImage src={selectedCourse?.instructorAvatar} alt={selectedCourse?.instructor} />}
                <AvatarFallback>{selectedCourse?.instructor[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{selectedCourse?.instructor}</p>
                <p className="text-xs text-muted-foreground">Course Instructor</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm">{selectedCourse?.description}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Topics Covered</p>
              <div className="flex flex-wrap gap-2">
                {selectedCourse?.topics.map((topic, index) => (
                  <Badge key={index} variant="outline">{topic}</Badge>
                ))}
              </div>
            </div>

            {selectedCourse?.isEnrolled && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Your Progress</span>
                  <span>{selectedCourse?.progress}%</span>
                </div>
                <Progress value={selectedCourse?.progress} />
                <p className="text-xs text-muted-foreground">
                  {selectedCourse?.completedModules} of {selectedCourse?.totalModules} modules completed
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium">Schedule</p>
              <p className="text-sm">{selectedCourse?.schedule}</p>
            </div>
          </div>
          <DialogFooter>
            {selectedCourse?.isEnrolled ? (
              <div className="flex w-full justify-between gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => unenrollFromCourse(selectedCourse.id)}
                >
                  Unenroll
                </Button>
                <Button className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Continue Learning
                </Button>
              </div>
            ) : (
              <Button 
                className="flex items-center gap-2"
                onClick={() => {
                  if (selectedCourse) {
                    enrollInCourse(selectedCourse.id);
                    setSelectedCourse(null);
                  }
                }}
              >
                <ArrowUpRight className="h-4 w-4" />
                Enroll Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enrollment Confirmation Dialog */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll in Course</DialogTitle>
            <DialogDescription>
              You are about to enroll in "{selectedCourse?.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Course details:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li>Instructor: {selectedCourse?.instructor}</li>
              <li>Duration: {selectedCourse?.duration}</li>
              <li>Schedule: {selectedCourse?.schedule}</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                if (selectedCourse) {
                  enrollInCourse(selectedCourse.id);
                }
              }}
            >
              Confirm Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Creation Dialog */}
      <Dialog open={isCourseCreationDialogOpen} onOpenChange={setIsCourseCreationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Fill in the course details to create a new training course.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Course Title</label>
              <Input 
                id="title" 
                placeholder="Enter course title" 
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                placeholder="Enter course description" 
                value={newCourseDescription}
                onChange={(e) => setNewCourseDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCourseCreationDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={createNewCourse}
              disabled={!newCourseTitle || !newCourseDescription}
            >
              Create Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Learning;
