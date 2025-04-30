
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Plus, ThumbsUp, User } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

export const Feedback: React.FC = () => {
  const { speak } = useVoice();
  
  const feedbackItems = [
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
  ];
  
  const handleGiveFeedback = () => {
    speak("Creating new feedback. The continuous feedback system encourages regular recognition and constructive coaching throughout the year, not just during formal reviews.");
  };
  
  const handleRespondToFeedback = (from: string) => {
    speak(`Responding to feedback from ${from}. Your response will be shared with the feedback provider, creating a dialogue for continuous improvement.`);
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
      
      <Tabs defaultValue="received">
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
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
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
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => handleRespondToFeedback(feedback.from)}
                  >
                    <MessageSquare size={14} />
                    Respond
                  </Button>
                </div>
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
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
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
    </div>
  );
};
