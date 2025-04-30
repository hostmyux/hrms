
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, MessageSquare, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

export const Applications: React.FC = () => {
  const { speak } = useVoice();
  
  const applications = [
    { id: 1, name: "John Doe", position: "Senior React Developer", date: "Apr 28, 2025", stage: "Screening", rating: 4 },
    { id: 2, name: "Jane Smith", position: "HR Manager", date: "Apr 26, 2025", stage: "Interview", rating: 5 },
    { id: 3, name: "Alex Johnson", position: "UX Designer", date: "Apr 25, 2025", stage: "Technical Test", rating: 3 },
    { id: 4, name: "Emma Wilson", position: "UX Designer", date: "Apr 24, 2025", stage: "Offer", rating: 5 },
    { id: 5, name: "Michael Brown", position: "Senior React Developer", date: "Apr 22, 2025", stage: "Rejected", rating: 2 },
    { id: 6, name: "Sarah Davis", position: "Data Analyst", date: "Apr 20, 2025", stage: "New", rating: 0 },
  ];
  
  const handleViewProfile = (name: string) => {
    speak(`Viewing ${name}'s candidate profile. You can see their resume, application details, and assessment results.`);
  };
  
  const handleContact = (name: string) => {
    speak(`Opening messaging interface to contact ${name}. You can send emails, schedule interviews, or request additional information.`);
  };
  
  const handleApprove = (name: string) => {
    speak(`Approving ${name}'s application to move to the next stage. This will trigger the appropriate workflow and notifications.`);
  };
  
  const handleReject = (name: string) => {
    speak(`Rejecting ${name}'s application. This will initiate the rejection workflow and send appropriate notifications.`);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Screening": return "bg-purple-100 text-purple-800";
      case "Interview": return "bg-yellow-100 text-yellow-800";
      case "Technical Test": return "bg-orange-100 text-orange-800";
      case "Offer": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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
        <CardContent>
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
                        onClick={() => handleViewProfile(application.name)}
                      >
                        <User size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleContact(application.name)}
                      >
                        <MessageSquare size={16} />
                      </Button>
                      {application.stage !== "Offer" && application.stage !== "Rejected" && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleApprove(application.name)}
                          >
                            <ThumbsUp size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleReject(application.name)}
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
    </div>
  );
};
