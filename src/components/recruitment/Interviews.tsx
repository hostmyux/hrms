
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, CheckCircle, Clock, Plus, Video, Calendar as CalendarIcon, User, ChevronLeft, ChevronRight, Check, X, Star } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { toast } from 'sonner';

type Interview = {
  id: number;
  candidate: string;
  position: string;
  date: string;
  time: string;
  type: string;
  interviewers: string[];
  status: string;
  candidateEmail?: string;
  candidatePhone?: string;
};

type Feedback = {
  id: number;
  interviewId: number;
  interviewer: string;
  rating: number;
  strengths: string;
  weaknesses: string;
  notes: string;
  recommendation: string;
  submitted: string;
};

export const Interviews: React.FC = () => {
  const { speak } = useVoice();
  const [isScheduleSheetOpen, setIsScheduleSheetOpen] = useState(false);
  const [isJoiningMeeting, setIsJoiningMeeting] = useState(false);
  const [isViewingFeedback, setIsViewingFeedback] = useState(false);
  const [isAddingFeedback, setIsAddingFeedback] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const interviews = [
    { 
      id: 1, 
      candidate: "Jane Smith", 
      position: "HR Manager", 
      date: "April 30, 2025", 
      time: "10:00 AM", 
      type: "Video", 
      interviewers: ["Michael Scott", "Holly Flax"],
      status: "Scheduled",
      candidateEmail: "jane.smith@example.com",
      candidatePhone: "555-123-4567"
    },
    { 
      id: 2, 
      candidate: "Alex Johnson", 
      position: "UX Designer", 
      date: "April 30, 2025", 
      time: "2:30 PM", 
      type: "In-person", 
      interviewers: ["David Wallace"],
      status: "Scheduled",
      candidateEmail: "alex.johnson@example.com",
      candidatePhone: "555-234-5678"
    },
    { 
      id: 3, 
      candidate: "John Doe", 
      position: "Senior React Developer", 
      date: "April 29, 2025", 
      time: "11:00 AM", 
      type: "Phone", 
      interviewers: ["Jim Halpert", "Pam Beesly"],
      status: "Completed",
      candidateEmail: "john.doe@example.com",
      candidatePhone: "555-345-6789"
    },
    { 
      id: 4, 
      candidate: "Robert Chen", 
      position: "Senior React Developer", 
      date: "April 28, 2025", 
      time: "3:00 PM", 
      type: "Video", 
      interviewers: ["Andy Bernard"],
      status: "Completed",
      candidateEmail: "robert.chen@example.com",
      candidatePhone: "555-456-7890"
    },
    { 
      id: 5, 
      candidate: "Maria Garcia", 
      position: "UX Designer", 
      date: "April 27, 2025", 
      time: "1:15 PM", 
      type: "Video", 
      interviewers: ["Angela Martin", "Oscar Martinez"],
      status: "No Show",
      candidateEmail: "maria.garcia@example.com",
      candidatePhone: "555-567-8901"
    }
  ];

  const feedbacks: Feedback[] = [
    {
      id: 1,
      interviewId: 3,
      interviewer: "Jim Halpert",
      rating: 4,
      strengths: "Strong technical skills, good problem-solving approach",
      weaknesses: "Could improve communication skills",
      notes: "Candidate was well-prepared and demonstrated good knowledge of React ecosystem",
      recommendation: "Move to next round",
      submitted: "April 29, 2025"
    },
    {
      id: 2,
      interviewId: 3,
      interviewer: "Pam Beesly",
      rating: 3,
      strengths: "Good cultural fit, collaborative approach",
      weaknesses: "Technical depth could be better in some areas",
      notes: "Seemed enthusiastic about the role and company mission",
      recommendation: "Consider for next round",
      submitted: "April 29, 2025"
    },
    {
      id: 3,
      interviewId: 4,
      interviewer: "Andy Bernard",
      rating: 5,
      strengths: "Exceptional technical knowledge, great communication",
      weaknesses: "None significant",
      notes: "One of the best candidates we've interviewed. Has experience with all our tech stack.",
      recommendation: "Strongly recommend for hire",
      submitted: "April 28, 2025"
    }
  ];
  
  const handleSchedule = () => {
    speak("Opening interview scheduler. Here you can coordinate with candidates and interviewers, select interview type, and send calendar invites.");
    setIsScheduleSheetOpen(true);
  };
  
  const handleJoinMeeting = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsJoiningMeeting(true);
    speak(`Joining video interview with ${interview.candidate}. Make sure your camera and microphone are working properly.`);
  };
  
  const handleReschedule = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsScheduleSheetOpen(true);
    speak(`Rescheduling interview with ${interview.candidate}. You'll need to select a new date and time and notify all participants.`);
  };
  
  const handleFeedback = (interview: Interview) => {
    setSelectedInterview(interview);
    
    // Check if feedback already exists for this interview
    const existingFeedback = feedbacks.filter(f => f.interviewId === interview.id);
    
    if (existingFeedback.length > 0) {
      setIsViewingFeedback(true);
      speak(`Opening feedback for ${interview.candidate}'s interview. Here you can review assessments from all interviewers.`);
    } else {
      setIsAddingFeedback(true);
      speak(`Opening feedback form for ${interview.candidate}'s interview. Here you can rate the candidate's responses and provide detailed comments.`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "No Show": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCloseSheet = () => {
    setIsScheduleSheetOpen(false);
  };

  const handleScheduleSubmit = () => {
    toast.success(selectedInterview ? 
      `Interview with ${selectedInterview.candidate} has been rescheduled` : 
      "New interview has been scheduled");
    setIsScheduleSheetOpen(false);
    setSelectedInterview(null);
  };

  const handleJoinSubmit = () => {
    toast.success(`Joining video interview with ${selectedInterview?.candidate}`);
    setIsJoiningMeeting(false);
    setSelectedInterview(null);
  };

  const handleFeedbackSubmit = () => {
    toast.success(`Feedback for ${selectedInterview?.candidate}'s interview has been saved`);
    setIsAddingFeedback(false);
    setSelectedInterview(null);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate days for the calendar
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const calendarDays = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
  }
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isSelected = date.toDateString() === selectedDate.toDateString();
    const hasInterview = false; // In a real app, check if there are interviews on this day
    
    calendarDays.push(
      <button
        key={day}
        className={`h-10 w-10 rounded-full flex items-center justify-center ${
          isSelected ? 'bg-primary text-primary-foreground' : 
          hasInterview ? 'bg-primary/10 text-primary-foreground' : 
          'hover:bg-muted'
        }`}
        onClick={() => setSelectedDate(date)}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Interview Schedule</h3>
          <p className="text-muted-foreground text-sm">
            Manage upcoming and past interviews
          </p>
        </div>
        <Button onClick={handleSchedule}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Interviews</CardTitle>
          <CardDescription>
            View and manage candidate interviews
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableCaption>A list of upcoming and recent interviews.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Interviewers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviews.map((interview) => (
                <TableRow key={interview.id}>
                  <TableCell className="font-medium">{interview.candidate}</TableCell>
                  <TableCell>{interview.position}</TableCell>
                  <TableCell>{interview.date}</TableCell>
                  <TableCell>{interview.time}</TableCell>
                  <TableCell>{interview.type}</TableCell>
                  <TableCell>{interview.interviewers.join(", ")}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {interview.status === "Scheduled" && interview.type === "Video" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleJoinMeeting(interview)}
                        >
                          <Video size={16} />
                        </Button>
                      )}
                      {interview.status === "Scheduled" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReschedule(interview)}
                        >
                          <Calendar size={16} />
                        </Button>
                      )}
                      {interview.status === "Completed" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleFeedback(interview)}
                        >
                          <CheckCircle size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Schedule Interview Sheet */}
      <Sheet open={isScheduleSheetOpen} onOpenChange={setIsScheduleSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedInterview ? "Reschedule Interview" : "Schedule New Interview"}</SheetTitle>
            <SheetDescription>
              {selectedInterview ? 
                `Reschedule interview with ${selectedInterview.candidate} for ${selectedInterview.position}` : 
                "Set up a new interview with a candidate"}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {!selectedInterview && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="candidate" className="text-sm font-medium">Candidate</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      id="candidate" 
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm"
                      placeholder="Search or select candidate..."
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium">Position</label>
                  <select 
                    id="position"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select a position...</option>
                    <option value="Senior React Developer">Senior React Developer</option>
                    <option value="UX Designer">UX Designer</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Data Analyst">Data Analyst</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Date</p>
                <Card>
                  <CardContent className="p-3">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <p className="font-medium">
                          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>
                        <Button variant="outline" size="sm" onClick={handleNextMonth}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 text-center">
                        <div className="text-xs font-medium">Su</div>
                        <div className="text-xs font-medium">Mo</div>
                        <div className="text-xs font-medium">Tu</div>
                        <div className="text-xs font-medium">We</div>
                        <div className="text-xs font-medium">Th</div>
                        <div className="text-xs font-medium">Fr</div>
                        <div className="text-xs font-medium">Sa</div>
                        {calendarDays}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">Time</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select 
                      id="time"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select time...</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="9:30 AM">9:30 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="1:30 PM">1:30 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="2:30 PM">2:30 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="3:30 PM">3:30 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="4:30 PM">4:30 PM</option>
                    </select>
                  </div>
                  <div>
                    <select 
                      id="duration"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Interview Type</label>
                <select 
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Video">Video</option>
                  <option value="Phone">Phone</option>
                  <option value="In-person">In-person</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="interviewers" className="text-sm font-medium">Interviewers</label>
                <input 
                  id="interviewers"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Search and select interviewers..."
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes (optional)</label>
                <textarea 
                  id="notes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Add any notes for the interviewers..."
                />
              </div>
            </div>
          </div>
          
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={handleCloseSheet}>Cancel</Button>
            <Button onClick={handleScheduleSubmit}>
              {selectedInterview ? "Reschedule" : "Schedule"} Interview
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Join Meeting Dialog */}
      <Dialog open={isJoiningMeeting} onOpenChange={setIsJoiningMeeting}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Join Video Interview</DialogTitle>
            <DialogDescription>
              Interview with {selectedInterview?.candidate} for {selectedInterview?.position}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-6 bg-muted rounded-md flex flex-col items-center justify-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={32} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">{selectedInterview?.candidate}</p>
                <p className="text-sm text-muted-foreground">{selectedInterview?.position}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center space-y-1 p-3 border rounded-md">
                <Clock size={24} />
                <p className="text-sm font-medium">{selectedInterview?.time}</p>
                <p className="text-xs text-muted-foreground">Duration: 45 min</p>
              </div>
              <div className="flex flex-col items-center space-y-1 p-3 border rounded-md">
                <Video size={24} />
                <p className="text-sm font-medium">Video Meeting</p>
                <p className="text-xs text-muted-foreground">Ready to join</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="font-medium">Interview Details</p>
              <div className="grid grid-cols-[80px_1fr] gap-1">
                <span className="text-muted-foreground">Date:</span>
                <span>{selectedInterview?.date}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-1">
                <span className="text-muted-foreground">Time:</span>
                <span>{selectedInterview?.time}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-1">
                <span className="text-muted-foreground">With:</span>
                <span>{selectedInterview?.interviewers.join(", ")}</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Please ensure your camera and microphone are working before joining the interview.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJoiningMeeting(false)}>Cancel</Button>
            <Button onClick={handleJoinSubmit}>Join Interview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Feedback Dialog */}
      <Dialog open={isViewingFeedback} onOpenChange={setIsViewingFeedback}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Feedback</DialogTitle>
            <DialogDescription>
              {selectedInterview?.candidate}'s interview feedback for {selectedInterview?.position}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {selectedInterview && feedbacks
              .filter(feedback => feedback.interviewId === selectedInterview.id)
              .map(feedback => (
                <Card key={feedback.id} className="mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{feedback.interviewer}</CardTitle>
                    <CardDescription>Submitted on {feedback.submitted}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Overall Rating</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < feedback.rating ? "text-yellow-500" : "text-gray-300"}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm font-medium">Recommendation</p>
                      <p className="text-sm p-2 bg-muted rounded-md">{feedback.recommendation}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Strengths</p>
                        <p className="text-sm p-2 bg-muted rounded-md">{feedback.strengths}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Areas for Improvement</p>
                        <p className="text-sm p-2 bg-muted rounded-md">{feedback.weaknesses}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Additional Notes</p>
                      <p className="text-sm p-2 bg-muted rounded-md">{feedback.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsViewingFeedback(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Feedback Dialog */}
      <Dialog open={isAddingFeedback} onOpenChange={setIsAddingFeedback}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Interview Feedback</DialogTitle>
            <DialogDescription>
              Provide feedback for {selectedInterview?.candidate}'s interview
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Overall Rating</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <button key={i} className="text-2xl text-gray-300 hover:text-yellow-500">
                    <Star size={24} />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="strengths" className="text-sm font-medium">Strengths</label>
                <textarea 
                  id="strengths"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Candidate's strengths..."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="weaknesses" className="text-sm font-medium">Areas for Improvement</label>
                <textarea 
                  id="weaknesses"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Areas where candidate can improve..."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Additional Notes</label>
              <textarea 
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Any additional observations..."
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="recommendation" className="text-sm font-medium">Recommendation</label>
              <select 
                id="recommendation"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select recommendation...</option>
                <option value="Strongly recommend for hire">Strongly recommend for hire</option>
                <option value="Recommend for hire">Recommend for hire</option>
                <option value="Move to next round">Move to next round</option>
                <option value="Consider for next round">Consider for next round</option>
                <option value="Do not recommend">Do not recommend</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingFeedback(false)}>Cancel</Button>
            <Button onClick={handleFeedbackSubmit}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
