import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileText, MessageSquare, ThumbsDown, ThumbsUp, User, X, Check, Eye, Mail, Phone } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { toast } from 'sonner';

type Application = {
  id: number;
  name: string;
  position: string;
  date: string;
  stage: string;
  rating: number;
  email: string;
  phone: string;
  experience: string;
  education: string;
  resume: string;
  coverLetter: string;
};

export const Applications: React.FC = () => {
  const { speak } = useVoice();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [dialogType, setDialogType] = useState<'profile' | 'message' | 'approve' | 'reject' | null>(null);
  const [message, setMessage] = useState('');
  
  const applications = [
    { 
      id: 1, 
      name: "John Doe", 
      position: "Senior React Developer", 
      date: "Apr 28, 2025", 
      stage: "Screening", 
      rating: 4,
      email: "john.doe@example.com",
      phone: "555-123-4567",
      experience: "8 years",
      education: "BS Computer Science",
      resume: "resume_johndoe.pdf",
      coverLetter: "I am interested in this position because..."
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      position: "HR Manager", 
      date: "Apr 26, 2025", 
      stage: "Interview", 
      rating: 5,
      email: "jane.smith@example.com",
      phone: "555-987-6543",
      experience: "10 years",
      education: "MBA Human Resources",
      resume: "resume_janesmith.pdf",
      coverLetter: "With my extensive experience in HR management..."
    },
    { 
      id: 3, 
      name: "Alex Johnson", 
      position: "UX Designer", 
      date: "Apr 25, 2025", 
      stage: "Technical Test", 
      rating: 3,
      email: "alex.johnson@example.com",
      phone: "555-456-7890",
      experience: "5 years",
      education: "BFA Design",
      resume: "resume_alexjohnson.pdf",
      coverLetter: "I believe my portfolio demonstrates my ability..."
    },
    { 
      id: 4, 
      name: "Emma Wilson", 
      position: "UX Designer", 
      date: "Apr 24, 2025", 
      stage: "Offer", 
      rating: 5,
      email: "emma.wilson@example.com",
      phone: "555-321-7654",
      experience: "7 years",
      education: "MS Human-Computer Interaction",
      resume: "resume_emmawilson.pdf",
      coverLetter: "Having worked with major tech companies..."
    },
    { 
      id: 5, 
      name: "Michael Brown", 
      position: "Senior React Developer", 
      date: "Apr 22, 2025", 
      stage: "Rejected", 
      rating: 2,
      email: "michael.brown@example.com",
      phone: "555-789-0123",
      experience: "4 years",
      education: "BS Software Engineering",
      resume: "resume_michaelbrown.pdf",
      coverLetter: "I am passionate about front-end development..."
    },
    { 
      id: 6, 
      name: "Sarah Davis", 
      position: "Data Analyst", 
      date: "Apr 20, 2025", 
      stage: "New", 
      rating: 0,
      email: "sarah.davis@example.com",
      phone: "555-234-5678",
      experience: "3 years",
      education: "MS Data Science",
      resume: "resume_sarahdavis.pdf",
      coverLetter: "With my analytical skills and technical background..."
    },
  ];
  
  const handleViewProfile = (application: Application) => {
    setSelectedApplication(application);
    setDialogType('profile');
    speak(`Viewing ${application.name}'s candidate profile. You can see their resume, application details, and assessment results.`);
  };
  
  const handleContact = (application: Application) => {
    setSelectedApplication(application);
    setDialogType('message');
    speak(`Opening messaging interface to contact ${application.name}. You can send emails, schedule interviews, or request additional information.`);
  };
  
  const handleApprove = (application: Application) => {
    setSelectedApplication(application);
    setDialogType('approve');
    speak(`Approving ${application.name}'s application to move to the next stage. This will trigger the appropriate workflow and notifications.`);
  };
  
  const handleReject = (application: Application) => {
    setSelectedApplication(application);
    setDialogType('reject');
    speak(`Rejecting ${application.name}'s application. This will initiate the rejection workflow and send appropriate notifications.`);
  };

  const handleConfirmAction = () => {
    if (!selectedApplication) return;

    switch(dialogType) {
      case 'approve':
        toast.success(`${selectedApplication.name}'s application has been approved to move to the next stage.`);
        break;
      case 'reject':
        toast.success(`${selectedApplication.name}'s application has been rejected. Notification will be sent.`);
        break;
      case 'message':
        toast.success(`Message sent to ${selectedApplication.name}`);
        setMessage('');
        break;
    }

    setDialogType(null);
    setSelectedApplication(null);
  };

  const handleCloseDialog = () => {
    setDialogType(null);
    setSelectedApplication(null);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "New": return "bg-badge-info text-badge-info-foreground";
      case "Screening": return "bg-badge-pending text-badge-pending-foreground";
      case "Interview": return "bg-badge-warning text-badge-warning-foreground";
      case "Technical Test": return "bg-secondary text-secondary-foreground";
      case "Offer": return "bg-badge-success text-badge-success-foreground";
      case "Rejected": return "bg-badge-destructive text-badge-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            Track and manage job applications
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableCaption>Recent job applications.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.name}</TableCell>
                  <TableCell>{application.position}</TableCell>
                  <TableCell>{application.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(application.stage)}`}>
                      {application.stage}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < application.rating ? "text-yellow-500" : "text-gray-300"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewProfile(application)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleContact(application)}
                      >
                        <MessageSquare size={16} />
                      </Button>
                      {application.stage !== "Offer" && application.stage !== "Rejected" && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleApprove(application)}
                          >
                            <ThumbsUp size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleReject(application)}
                          >
                            <ThumbsDown size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Profile Dialog */}
      <Dialog open={dialogType === 'profile'} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidate Profile</DialogTitle>
            <DialogDescription>
              Review candidate details and application materials
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedApplication.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedApplication.position}</p>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Contact Information</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail size={14} />
                      <span>{selectedApplication.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone size={14} />
                      <span>{selectedApplication.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Application Details</p>
                    <div className="grid grid-cols-[100px_1fr] items-center text-sm">
                      <span className="text-muted-foreground">Applied:</span>
                      <span>{selectedApplication.date}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] items-center text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex w-fit ${getStageColor(selectedApplication.stage)}`}>
                        {selectedApplication.stage}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Background</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-[100px_1fr] items-center text-sm">
                      <span className="text-muted-foreground">Experience:</span>
                      <span>{selectedApplication.experience}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] items-center text-sm">
                      <span className="text-muted-foreground">Education:</span>
                      <span>{selectedApplication.education}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Application Materials</p>
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="flex justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                    </Button>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Cover Letter</p>
                      <div className="bg-muted p-3 rounded-md text-sm">
                        {selectedApplication.coverLetter}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleContact(selectedApplication!)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact
              </Button>
              {selectedApplication?.stage !== "Offer" && selectedApplication?.stage !== "Rejected" && (
                <>
                  <Button variant="outline" onClick={() => handleApprove(selectedApplication!)}>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button variant="outline" onClick={() => handleReject(selectedApplication!)}>
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
            </div>
            <Button variant="default" onClick={handleCloseDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={dialogType === 'message'} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Candidate</DialogTitle>
            <DialogDescription>
              Send a message to {selectedApplication?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid w-full gap-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <input 
                id="subject" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                placeholder="RE: Your application for Senior React Developer"
              />
            </div>
            
            <div className="grid w-full gap-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleConfirmAction} disabled={!message.trim()}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={dialogType === 'approve'} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Move {selectedApplication?.name}'s application to the next stage
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to approve this application and move it to the next stage?</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This will notify the hiring team and schedule the appropriate next steps for this candidate.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleConfirmAction} className="bg-green-600 hover:bg-green-700">
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={dialogType === 'reject'} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Reject {selectedApplication?.name}'s application
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to reject this application?</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This will send a rejection notification to the candidate and update their status in the system.
            </p>
            <div className="grid w-full gap-2 mt-4">
              <label htmlFor="reason" className="text-sm font-medium">Reason for rejection (optional)</label>
              <textarea 
                id="reason" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                placeholder="Provide a reason for rejecting this application..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmAction}>
              <X className="mr-2 h-4 w-4" />
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
