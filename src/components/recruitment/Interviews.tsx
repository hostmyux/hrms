
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useVoice } from '../../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CalendarPlus, CheckCircle, Clock, Edit, Eye, ThumbsUp, ThumbsDown, Calendar, Users } from 'lucide-react';

interface Interview {
  id: string;
  candidate: string;
  position: string;
  date: string;
  time: string;
  interviewers: string[];
  stage: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  feedback?: string;
  rating?: number;
}

interface RescheduleFormValues {
  date: string;
  time: string;
  note: string;
  notifyCandidate: boolean;
  notifyInterviewers: boolean;
}

interface FeedbackFormValues {
  rating: string;
  strengths: string;
  weaknesses: string;
  notes: string;
  recommendation: 'hire' | 'reject' | 'consider';
}

export const Interviews: React.FC = () => {
  const { speak } = useVoice();
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      candidate: 'John Smith',
      position: 'Senior React Developer',
      date: '2025-05-18',
      time: '10:00',
      interviewers: ['Maria Rodriguez', 'David Chen'],
      stage: 'Technical Interview',
      status: 'scheduled'
    },
    {
      id: '2',
      candidate: 'Sarah Johnson',
      position: 'HR Manager',
      date: '2025-05-15',
      time: '14:30',
      interviewers: ['Robert Wilson', 'Emily Taylor'],
      stage: 'Final Interview',
      status: 'completed',
      feedback: 'Strong candidate with excellent communication skills and relevant experience.',
      rating: 4
    },
    {
      id: '3',
      candidate: 'Michael Brown',
      position: 'Marketing Specialist',
      date: '2025-05-20',
      time: '11:15',
      interviewers: ['Jessica Adams', 'Thomas Wright'],
      stage: 'Initial Screening',
      status: 'scheduled'
    }
  ]);

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  const rescheduleForm = useForm<RescheduleFormValues>({
    defaultValues: {
      date: '',
      time: '',
      note: '',
      notifyCandidate: true,
      notifyInterviewers: true
    }
  });

  const feedbackForm = useForm<FeedbackFormValues>({
    defaultValues: {
      rating: '3',
      strengths: '',
      weaknesses: '',
      notes: '',
      recommendation: 'consider'
    }
  });

  const handleReschedule = (interview: Interview) => {
    setSelectedInterview(interview);
    rescheduleForm.reset({
      date: '',
      time: '',
      note: '',
      notifyCandidate: true,
      notifyInterviewers: true
    });
    setIsRescheduleOpen(true);
    speak(`Rescheduling interview for ${interview.candidate} for the ${interview.position} position. Please select a new date and time.`);
  };

  const handleAddFeedback = (interview: Interview) => {
    setSelectedInterview(interview);
    feedbackForm.reset({
      rating: interview.rating?.toString() || '3',
      strengths: '',
      weaknesses: '',
      notes: '',
      recommendation: 'consider'
    });
    setIsFeedbackOpen(true);
    speak(`Adding feedback for ${interview.candidate}'s interview for the ${interview.position} position.`);
  };

  const onRescheduleSubmit = (data: RescheduleFormValues) => {
    if (!selectedInterview) return;
    
    const updatedInterviews = interviews.map(interview => 
      interview.id === selectedInterview.id 
        ? { 
            ...interview, 
            date: data.date,
            time: data.time,
            status: 'scheduled' as const
          } 
        : interview
    );
    
    setInterviews(updatedInterviews);
    setIsRescheduleOpen(false);
    
    toast.success(`Interview with ${selectedInterview.candidate} has been rescheduled`);
    speak(`Interview with ${selectedInterview.candidate} has been successfully rescheduled to ${new Date(data.date).toLocaleDateString()} at ${data.time}.`);
    
    if (data.notifyCandidate) {
      toast.info(`Notification sent to ${selectedInterview.candidate}`);
    }
    
    if (data.notifyInterviewers) {
      toast.info(`Notifications sent to ${selectedInterview.interviewers.join(', ')}`);
    }
  };

  const onFeedbackSubmit = (data: FeedbackFormValues) => {
    if (!selectedInterview) return;
    
    const updatedInterviews = interviews.map(interview => 
      interview.id === selectedInterview.id 
        ? { 
            ...interview, 
            status: 'completed' as const,
            feedback: `${data.strengths}\n\n${data.weaknesses}\n\n${data.notes}`,
            rating: parseInt(data.rating)
          } 
        : interview
    );
    
    setInterviews(updatedInterviews);
    setIsFeedbackOpen(false);
    
    toast.success(`Feedback for ${selectedInterview.candidate}'s interview has been recorded`);
    speak(`Feedback for ${selectedInterview.candidate}'s interview has been successfully recorded.`);
  };

  const getStatusBadge = (status: Interview['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>;
      case 'no-show':
        return <Badge variant="destructive">No Show</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Interview Schedule</h2>
          <p className="text-sm text-muted-foreground">Manage upcoming and past interviews</p>
        </div>
        <Button onClick={() => speak("Creating a new interview schedule will be implemented in a future update.")}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Recent Interviews</CardTitle>
          <CardDescription>View and manage candidate interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviews.map((interview) => (
                <TableRow key={interview.id}>
                  <TableCell className="font-medium">{interview.candidate}</TableCell>
                  <TableCell>{interview.position}</TableCell>
                  <TableCell>
                    {new Date(interview.date).toLocaleDateString()} at {interview.time}
                  </TableCell>
                  <TableCell>{interview.stage}</TableCell>
                  <TableCell>{getStatusBadge(interview.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {interview.status === 'scheduled' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleReschedule(interview)}>
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAddFeedback(interview)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {interview.status === 'completed' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => speak(`Viewing feedback for ${interview.candidate}'s interview. ${interview.feedback}`)}
                        >
                          <Eye className="h-4 w-4" />
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
      
      {/* Reschedule Interview Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Interview</DialogTitle>
            <DialogDescription>
              {selectedInterview && `Rescheduling interview with ${selectedInterview.candidate} for ${selectedInterview.position}`}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...rescheduleForm}>
            <form onSubmit={rescheduleForm.handleSubmit(onRescheduleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={rescheduleForm.control}
                  name="date"
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={rescheduleForm.control}
                  name="time"
                  rules={{ required: "Time is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={rescheduleForm.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rescheduling Note</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Reason for rescheduling..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This note will be included in notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="notifyCandidate" 
                    checked={rescheduleForm.watch('notifyCandidate')} 
                    onChange={(e) => rescheduleForm.setValue('notifyCandidate', e.target.checked)}
                    className="rounded" 
                  />
                  <label htmlFor="notifyCandidate" className="text-sm">
                    Notify candidate of the schedule change
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="notifyInterviewers" 
                    checked={rescheduleForm.watch('notifyInterviewers')} 
                    onChange={(e) => rescheduleForm.setValue('notifyInterviewers', e.target.checked)}
                    className="rounded" 
                  />
                  <label htmlFor="notifyInterviewers" className="text-sm">
                    Notify interviewers of the schedule change
                  </label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsRescheduleOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Reschedule
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add Feedback Dialog */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Interview Feedback</DialogTitle>
            <DialogDescription>
              {selectedInterview && `Record feedback for ${selectedInterview.candidate}'s interview`}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...feedbackForm}>
            <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)} className="space-y-4">
              <FormField
                control={feedbackForm.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Rating</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 - Poor</SelectItem>
                        <SelectItem value="2">2 - Below Average</SelectItem>
                        <SelectItem value="3">3 - Average</SelectItem>
                        <SelectItem value="4">4 - Good</SelectItem>
                        <SelectItem value="5">5 - Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={feedbackForm.control}
                name="strengths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strengths</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Candidate strengths..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={feedbackForm.control}
                name="weaknesses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas for Improvement</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Areas where the candidate could improve..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={feedbackForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any other observations or comments..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={feedbackForm.control}
                name="recommendation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recommendation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recommendation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hire">Recommend to Hire</SelectItem>
                        <SelectItem value="consider">Consider for Next Round</SelectItem>
                        <SelectItem value="reject">Do Not Move Forward</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsFeedbackOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Feedback
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
