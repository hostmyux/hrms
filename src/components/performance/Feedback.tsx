
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Plus, ThumbsUp, User, Send } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { toast } from '../../utils/toastHelpers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type FeedbackType = 'Recognition' | 'Coaching';

interface FeedbackItem {
  id: number;
  from: string;
  to: string;
  date: string;
  type: FeedbackType;
  message: string;
  responded?: boolean;
  response?: string;
  responseDate?: string;
}

interface FeedbackFormData {
  to: string;
  type: FeedbackType;
  message: string;
}

interface ResponseFormData {
  response: string;
}

export const Feedback: React.FC = () => {
  const { speak } = useVoice();
  // Using toast from sonner import
  const [activeFeedbackTab, setActiveFeedbackTab] = useState('received');
  const [isAddFeedbackOpen, setIsAddFeedbackOpen] = useState(false);
  const [isRespondOpen, setIsRespondOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([
    {
      id: 1,
      from: "Sarah Johnson",
      to: "John Smith",
      date: "April 29, 2025",
      type: "Recognition",
      message: "Excellent work on the client presentation. Your deep preparation and clear explanation of technical concepts to non-technical stakeholders was impressive."
    },
    {
      id: 2,
      from: "David Lee",
      to: "Emily Brown",
      date: "April 28, 2025",
      type: "Coaching",
      message: "I noticed your design work is exceptional, but could benefit from more documentation. Let's discuss some strategies to improve this aspect while maintaining your creative flow."
    },
    {
      id: 3,
      from: "John Smith",
      to: "Daniel Davis",
      date: "April 27, 2025",
      type: "Recognition",
      message: "Thank you for stepping in to help with the urgent customer issue yesterday. Your quick response prevented a potential escalation."
    },
    {
      id: 4,
      from: "Maria Garcia",
      to: "Michael Wilson",
      date: "April 26, 2025",
      type: "Coaching",
      message: "Your project management skills are strong, but I noticed meetings sometimes run over time. Let's work together on agenda management and timeboxing techniques."
    }
  ]);
  
  const feedbackForm = useForm<FeedbackFormData>({
    defaultValues: {
      to: '',
      type: 'Recognition',
      message: ''
    }
  });
  
  const responseForm = useForm<ResponseFormData>({
    defaultValues: {
      response: ''
    }
  });
  
  const handleGiveFeedback = () => {
    setIsAddFeedbackOpen(true);
    feedbackForm.reset({
      to: '',
      type: 'Recognition',
      message: ''
    });
    speak("Creating new feedback. The continuous feedback system encourages regular recognition and constructive coaching throughout the year, not just during formal reviews.");
  };
  
  const handleRespondToFeedback = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setIsRespondOpen(true);
    responseForm.reset({
      response: ''
    });
    speak(`Responding to feedback from ${feedback.from}. Your response will be shared with the feedback provider, creating a dialogue for continuous improvement.`);
  };
  
  const handleTabChange = (tab: string) => {
    setActiveFeedbackTab(tab);
    if (tab === 'received') {
      speak("Viewing feedback you've received from colleagues. This section shows recognition and coaching feedback provided to you.");
    } else {
      speak("Viewing feedback you've given to others. This section shows all recognition and coaching feedback you've provided to colleagues.");
    }
  };
  
  const onSubmitFeedback = (data: FeedbackFormData) => {
    const newFeedback: FeedbackItem = {
      id: Date.now(),
      from: "John Smith", // Current user
      to: data.to,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      type: data.type,
      message: data.message
    };
    
    setFeedbackItems(prev => [newFeedback, ...prev]);
    setIsAddFeedbackOpen(false);
    toast({
      title: "Feedback Shared",
      description: `Your ${data.type.toLowerCase()} feedback has been shared with ${data.to}.`
    });
    speak(`Feedback successfully shared. Your ${data.type.toLowerCase()} feedback has been sent to ${data.to} and they will receive a notification.`);
    feedbackForm.reset();
  };
  
  const onSubmitResponse = (data: ResponseFormData) => {
    if (!selectedFeedback) return;
    
    setFeedbackItems(prev => prev.map(feedback => {
      if (feedback.id === selectedFeedback.id) {
        return {
          ...feedback,
          responded: true,
          response: data.response,
          responseDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };
      }
      return feedback;
    }));
    
    setIsRespondOpen(false);
    toast({
      title: "Response Sent",
      description: `Your response to ${selectedFeedback.from}'s feedback has been sent.`
    });
    speak(`Response successfully sent. Your reply to ${selectedFeedback.from}'s feedback has been delivered.`);
    responseForm.reset();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">360° Feedback</h3>
          <p className="text-muted-foreground text-sm">
            Give and receive continuous feedback
          </p>
        </div>
        <Button onClick={handleGiveFeedback}>
          <Plus className="mr-2 h-4 w-4" />
          Give Feedback
        </Button>
      </div>
      
      <Tabs defaultValue="received" value={activeFeedbackTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">Feedback Received</TabsTrigger>
          <TabsTrigger value="given">Feedback Given</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="space-y-4 mt-4">
          {feedbackItems.filter(item => item.to === "John Smith").map(feedback => (
            <Card key={feedback.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>{getInitials(feedback.from)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm font-medium">{feedback.from}</CardTitle>
                      <CardDescription className="text-xs">{feedback.date}</CardDescription>
                    </div>
                  </div>
                  <span className={`px-2 py-1 h-fit text-xs font-medium rounded-full ${
                    feedback.type === "Recognition" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {feedback.type}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{feedback.message}</p>
                
                {feedback.responded && feedback.response && (
                  <div className="mt-4 pt-4 border-t border-muted">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">Your Response</p>
                        <p className="text-xs text-muted-foreground">{feedback.responseDate}</p>
                      </div>
                    </div>
                    <p className="text-sm">{feedback.response}</p>
                  </div>
                )}
                
                {!feedback.responded && (
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => handleRespondToFeedback(feedback)}
                    >
                      <MessageSquare size={14} />
                      Respond
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {feedbackItems.filter(item => item.to === "John Smith").length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <ThumbsUp className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No feedback yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  You haven't received any feedback yet. Feedback will appear here once colleagues share their insights.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="given" className="space-y-4 mt-4">
          {feedbackItems.filter(item => item.from === "John Smith").map(feedback => (
            <Card key={feedback.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>{getInitials(feedback.to)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm font-medium">To: {feedback.to}</CardTitle>
                      <CardDescription className="text-xs">{feedback.date}</CardDescription>
                    </div>
                  </div>
                  <span className={`px-2 py-1 h-fit text-xs font-medium rounded-full ${
                    feedback.type === "Recognition" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {feedback.type}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{feedback.message}</p>
                
                {feedback.responded && feedback.response && (
                  <div className="mt-4 pt-4 border-t border-muted">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{getInitials(feedback.to)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">Their Response</p>
                        <p className="text-xs text-muted-foreground">{feedback.responseDate}</p>
                      </div>
                    </div>
                    <p className="text-sm">{feedback.response}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {feedbackItems.filter(item => item.from === "John Smith").length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No feedback given</p>
                <p className="text-sm text-muted-foreground mt-2">
                  You haven't given any feedback yet. Use the "Give Feedback" button to recognize colleagues or provide coaching.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Give Feedback Dialog */}
      <Dialog open={isAddFeedbackOpen} onOpenChange={setIsAddFeedbackOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Give Feedback</DialogTitle>
            <DialogDescription>
              Share recognition or coaching feedback with a colleague.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...feedbackForm}>
            <form onSubmit={feedbackForm.handleSubmit(onSubmitFeedback)} className="space-y-4">
              <FormField
                control={feedbackForm.control}
                name="to"
                rules={{ required: "Recipient name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter recipient's name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The person who will receive your feedback
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={feedbackForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Recognition">Recognition</SelectItem>
                        <SelectItem value="Coaching">Coaching</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Recognition is for praising good work, coaching is for constructive feedback
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={feedbackForm.control}
                name="message"
                rules={{ required: "Feedback message is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your feedback message"
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {feedbackForm.watch("type") === "Recognition" 
                        ? "Specifically describe what they did well and the impact it had" 
                        : "Focus on specific behaviors and provide constructive guidance"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddFeedbackOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Send Feedback
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Respond to Feedback Dialog */}
      <Dialog open={isRespondOpen} onOpenChange={setIsRespondOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Respond to Feedback</DialogTitle>
            <DialogDescription>
              Share your thoughts on the feedback you received.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <>
              <div className="bg-muted/50 p-4 rounded-md mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{getInitials(selectedFeedback.from)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{selectedFeedback.from}</p>
                    <p className="text-xs text-muted-foreground">{selectedFeedback.date}</p>
                  </div>
                  <span className={`ml-auto px-2 py-1 h-fit text-xs font-medium rounded-full ${
                    selectedFeedback.type === "Recognition" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {selectedFeedback.type}
                  </span>
                </div>
                <p className="text-sm">{selectedFeedback.message}</p>
              </div>
              
              <Form {...responseForm}>
                <form onSubmit={responseForm.handleSubmit(onSubmitResponse)} className="space-y-4">
                  <FormField
                    control={responseForm.control}
                    name="response"
                    rules={{ required: "Response message is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Response</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your response..."
                            className="resize-none min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsRespondOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Send className="mr-2 h-4 w-4" />
                      Send Response
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
