
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Mail, Plus, User, Clock } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

export const Offers: React.FC = () => {
  const { speak } = useVoice();
  
  const offers = [
    { 
      id: 1, 
      candidate: "Emma Wilson", 
      position: "UX Designer", 
      offerDate: "April 25, 2025", 
      deadline: "May 2, 2025", 
      salary: "$95,000", 
      status: "Pending Response" 
    },
    { 
      id: 2, 
      candidate: "David Lee", 
      position: "Senior React Developer", 
      offerDate: "April 22, 2025", 
      deadline: "April 29, 2025", 
      salary: "$135,000", 
      status: "Accepted" 
    },
    { 
      id: 3, 
      candidate: "Sarah Johnson", 
      position: "Product Manager", 
      offerDate: "April 18, 2025", 
      deadline: "April 25, 2025", 
      salary: "$120,000", 
      status: "Declined" 
    },
    { 
      id: 4, 
      candidate: "James Williams", 
      position: "Data Analyst", 
      offerDate: "April 15, 2025", 
      deadline: "April 22, 2025", 
      salary: "$85,000", 
      status: "Negotiation" 
    }
  ];
  
  const handleCreateOffer = () => {
    speak("Creating a new job offer. Here you can specify compensation package, benefits, start date, and other terms of employment.");
  };
  
  const handleViewOffer = (candidate: string) => {
    speak(`Viewing offer details for ${candidate}. This includes the complete offer package with compensation, benefits, and contract terms.`);
  };
  
  const handleReminderEmail = (candidate: string) => {
    speak(`Sending a friendly reminder email to ${candidate} regarding their pending job offer.`);
  };
  
  const handleNegotiate = (candidate: string) => {
    speak(`Opening negotiation workflow for ${candidate}'s offer. Here you can adjust terms and communicate with the candidate.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Response": return "bg-yellow-100 text-yellow-800";
      case "Accepted": return "bg-green-100 text-green-800";
      case "Declined": return "bg-red-100 text-red-800";
      case "Negotiation": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Offer Management</h3>
          <p className="text-muted-foreground text-sm">
            Create and track job offers
          </p>
        </div>
        <Button onClick={handleCreateOffer}>
          <Plus className="mr-2 h-4 w-4" />
          Create Offer
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Job Offers</CardTitle>
          <CardDescription>
            Track offer status and manage communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Recent job offers and their status.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Offer Date</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">{offer.candidate}</TableCell>
                  <TableCell>{offer.position}</TableCell>
                  <TableCell>{offer.offerDate}</TableCell>
                  <TableCell>{offer.deadline}</TableCell>
                  <TableCell>{offer.salary}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                      {offer.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewOffer(offer.candidate)}
                      >
                        <FileText size={16} />
                      </Button>
                      {offer.status === "Pending Response" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReminderEmail(offer.candidate)}
                        >
                          <Mail size={16} />
                        </Button>
                      )}
                      {offer.status === "Negotiation" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleNegotiate(offer.candidate)}
                        >
                          <Clock size={16} />
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
