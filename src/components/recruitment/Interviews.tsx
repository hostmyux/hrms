
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, CheckCircle, Clock, Plus, Video } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

export const Interviews: React.FC = () => {
  const { speak } = useVoice();
  
  const interviews = [
    { 
      id: 1, 
      candidate: "Jane Smith", 
      position: "HR Manager", 
      date: "April 30, 2025", 
      time: "10:00 AM", 
      type: "Video", 
      interviewers: ["Michael Scott", "Holly Flax"],
      status: "Scheduled" 
    },
    { 
      id: 2, 
      candidate: "Alex Johnson", 
      position: "UX Designer", 
      date: "April 30, 2025", 
      time: "2:30 PM", 
      type: "In-person", 
      interviewers: ["David Wallace"],
      status: "Scheduled" 
    },
    { 
      id: 3, 
      candidate: "John Doe", 
      position: "Senior React Developer", 
      date: "April 29, 2025", 
      time: "11:00 AM", 
      type: "Phone", 
      interviewers: ["Jim Halpert", "Pam Beesly"],
      status: "Completed" 
    },
    { 
      id: 4, 
      candidate: "Robert Chen", 
      position: "Senior React Developer", 
      date: "April 28, 2025", 
      time: "3:00 PM", 
      type: "Video", 
      interviewers: ["Andy Bernard"],
      status: "Completed" 
    },
    { 
      id: 5, 
      candidate: "Maria Garcia", 
      position: "UX Designer", 
      date: "April 27, 2025", 
      time: "1:15 PM", 
      type: "Video", 
      interviewers: ["Angela Martin", "Oscar Martinez"],
      status: "No Show" 
    }
  ];
  
  const handleSchedule = () => {
    speak("Opening interview scheduler. Here you can coordinate with candidates and interviewers, select interview type, and send calendar invites.");
  };
  
  const handleJoinMeeting = (candidate: string) => {
    speak(`Joining video interview with ${candidate}. Make sure your camera and microphone are working properly.`);
  };
  
  const handleReschedule = (candidate: string) => {
    speak(`Rescheduling interview with ${candidate}. You'll need to select a new date and time and notify all participants.`);
  };
  
  const handleFeedback = (candidate: string) => {
    speak(`Opening feedback form for ${candidate}'s interview. Here you can rate the candidate's responses and provide detailed comments.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "No Show": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
        <CardContent>
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
                          onClick={() => handleJoinMeeting(interview.candidate)}
                        >
                          <Video size={16} />
                        </Button>
                      )}
                      {interview.status === "Scheduled" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReschedule(interview.candidate)}
                        >
                          <Calendar size={16} />
                        </Button>
                      )}
                      {interview.status === "Completed" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleFeedback(interview.candidate)}
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
    </div>
  );
};
