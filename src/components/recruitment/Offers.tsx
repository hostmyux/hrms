
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Mail, Plus, User, Clock } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

export const Offers: React.FC = () => {
  const { speak } = useVoice();
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isNegotiateOpen, setIsNegotiateOpen] = useState(false);
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  
  const offers = [
    { 
      id: 1, 
      candidate: "Emma Wilson", 
      position: "UX Designer", 
      offerDate: "April 25, 2025", 
      deadline: "May 2, 2025", 
      salary: "$95,000", 
      status: "Pending Response",
      details: {
        email: "emma.wilson@example.com",
        benefits: "Health insurance, 401(k), 20 days PTO",
        startDate: "May 15, 2025",
        notes: "Emma showed strong interest during the interview process."
      }
    },
    { 
      id: 2, 
      candidate: "David Lee", 
      position: "Senior React Developer", 
      offerDate: "April 22, 2025", 
      deadline: "April 29, 2025", 
      salary: "$135,000", 
      status: "Accepted",
      details: {
        email: "david.lee@example.com",
        benefits: "Health insurance, 401(k), 25 days PTO, Remote work",
        startDate: "May 10, 2025",
        notes: "David accepted the offer quickly and is excited to join."
      }
    },
    { 
      id: 3, 
      candidate: "Sarah Johnson", 
      position: "Product Manager", 
      offerDate: "April 18, 2025", 
      deadline: "April 25, 2025", 
      salary: "$120,000", 
      status: "Declined",
      details: {
        email: "sarah.johnson@example.com",
        benefits: "Health insurance, 401(k), 22 days PTO",
        startDate: "May 1, 2025",
        notes: "Sarah declined due to another offer with higher compensation."
      }
    },
    { 
      id: 4, 
      candidate: "James Williams", 
      position: "Data Analyst", 
      offerDate: "April 15, 2025", 
      deadline: "April 22, 2025", 
      salary: "$85,000", 
      status: "Negotiation",
      details: {
        email: "james.williams@example.com",
        benefits: "Health insurance, 401(k), 18 days PTO",
        startDate: "May 8, 2025",
        notes: "James is requesting a higher salary of $92,000."
      }
    }
  ];
  
  const handleCreateOffer = () => {
    speak("Creating a new job offer. Here you can specify compensation package, benefits, start date, and other terms of employment.");
    setIsCreateOfferOpen(true);
  };
  
  const handleViewOffer = (offer: any) => {
    setSelectedOffer(offer);
    setIsViewDetailsOpen(true);
    speak(`Viewing offer details for ${offer.candidate}. This includes the complete offer package with compensation, benefits, and contract terms.`);
  };
  
  const handleReminderEmail = (offer: any) => {
    setSelectedOffer(offer);
    setIsReminderOpen(true);
    speak(`Sending a friendly reminder email to ${offer.candidate} regarding their pending job offer.`);
  };
  
  const handleNegotiate = (offer: any) => {
    setSelectedOffer(offer);
    setIsNegotiateOpen(true);
    speak(`Opening negotiation workflow for ${offer.candidate}'s offer. Here you can adjust terms and communicate with the candidate.`);
  };

  const handleSendReminder = () => {
    toast.success(`Reminder email sent to ${selectedOffer.candidate}`);
    setIsReminderOpen(false);
  };

  const handleCompleteNegotiation = () => {
    toast.success(`Negotiation updates saved for ${selectedOffer.candidate}'s offer`);
    setIsNegotiateOpen(false);
  };

  const handleSaveNewOffer = () => {
    toast.success('New job offer has been created');
    setIsCreateOfferOpen(false);
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
                        onClick={() => handleViewOffer(offer)}
                      >
                        <FileText size={16} />
                      </Button>
                      {offer.status === "Pending Response" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReminderEmail(offer)}
                        >
                          <Mail size={16} />
                        </Button>
                      )}
                      {offer.status === "Negotiation" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleNegotiate(offer)}
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
      
      {/* View Offer Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Offer Details</DialogTitle>
            <DialogDescription>
              {selectedOffer?.candidate}'s offer for {selectedOffer?.position}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOffer && (
            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedOffer.candidate}</h3>
                  <p className="text-sm text-muted-foreground">{selectedOffer.position}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Offer Date</p>
                  <p className="text-sm">{selectedOffer.offerDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Response Deadline</p>
                  <p className="text-sm">{selectedOffer.deadline}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOffer.status)}`}>
                    {selectedOffer.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{selectedOffer.details.email}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Compensation</p>
                <p className="text-sm">{selectedOffer.salary}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Benefits</p>
                <p className="text-sm">{selectedOffer.details.benefits}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Expected Start Date</p>
                <p className="text-sm">{selectedOffer.details.startDate}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Notes</p>
                <p className="text-sm">{selectedOffer.details.notes}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Send Reminder Dialog */}
      <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Reminder Email</DialogTitle>
            <DialogDescription>
              Send a reminder to {selectedOffer?.candidate} about their pending offer
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <input 
                id="subject"
                className="w-full p-2 border rounded-md"
                defaultValue={`Reminder: Your ${selectedOffer?.position} Offer from Our Company`}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea
                id="message"
                className="w-full p-2 border rounded-md h-32"
                defaultValue={`Dear ${selectedOffer?.candidate},\n\nThis is a friendly reminder that your job offer for the ${selectedOffer?.position} position is still pending. The offer will expire on ${selectedOffer?.deadline}.\n\nPlease let us know if you have any questions.\n\nBest regards,\nHR Team`}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReminderOpen(false)}>Cancel</Button>
            <Button onClick={handleSendReminder}>Send Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Negotiation Dialog */}
      <Dialog open={isNegotiateOpen} onOpenChange={setIsNegotiateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Negotiate Offer</DialogTitle>
            <DialogDescription>
              Update terms for {selectedOffer?.candidate}'s offer
            </DialogDescription>
          </DialogHeader>
          
          {selectedOffer && (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentSalary" className="text-sm font-medium">Current Salary Offer</label>
                <input
                  id="currentSalary"
                  className="w-full p-2 border rounded-md bg-muted"
                  value={selectedOffer.salary}
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="newSalary" className="text-sm font-medium">New Salary Offer</label>
                <input
                  id="newSalary"
                  className="w-full p-2 border rounded-md"
                  defaultValue={selectedOffer.status === "Negotiation" ? "$92,000" : selectedOffer.salary}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="currentBenefits" className="text-sm font-medium">Current Benefits</label>
                <textarea
                  id="currentBenefits"
                  className="w-full p-2 border rounded-md h-20 bg-muted"
                  value={selectedOffer.details.benefits}
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="newBenefits" className="text-sm font-medium">New Benefits</label>
                <textarea
                  id="newBenefits"
                  className="w-full p-2 border rounded-md h-20"
                  defaultValue={selectedOffer.details.benefits}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Negotiation Notes</label>
                <textarea
                  id="notes"
                  className="w-full p-2 border rounded-md h-20"
                  defaultValue={selectedOffer.status === "Negotiation" ? selectedOffer.details.notes : ""}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNegotiateOpen(false)}>Cancel</Button>
            <Button onClick={handleCompleteNegotiation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Offer Dialog */}
      <Dialog open={isCreateOfferOpen} onOpenChange={setIsCreateOfferOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Offer</DialogTitle>
            <DialogDescription>
              Generate a job offer for a candidate
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="candidate" className="text-sm font-medium">Candidate Name</label>
              <input
                id="candidate"
                className="w-full p-2 border rounded-md"
                placeholder="Full name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Candidate Email</label>
              <input
                id="email"
                className="w-full p-2 border rounded-md"
                placeholder="email@example.com"
                type="email"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">Position</label>
                <select
                  id="position"
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select position...</option>
                  <option value="UX Designer">UX Designer</option>
                  <option value="Senior React Developer">Senior React Developer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="salary" className="text-sm font-medium">Salary Offer</label>
                <input
                  id="salary"
                  className="w-full p-2 border rounded-md"
                  placeholder="$80,000"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="offerDate" className="text-sm font-medium">Offer Date</label>
                <input
                  id="offerDate"
                  className="w-full p-2 border rounded-md"
                  type="date"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="deadline" className="text-sm font-medium">Response Deadline</label>
                <input
                  id="deadline"
                  className="w-full p-2 border rounded-md"
                  type="date"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="benefits" className="text-sm font-medium">Benefits</label>
              <textarea
                id="benefits"
                className="w-full p-2 border rounded-md h-20"
                placeholder="Health insurance, 401(k), PTO, etc."
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">Expected Start Date</label>
              <input
                id="startDate"
                className="w-full p-2 border rounded-md"
                type="date"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Additional Notes</label>
              <textarea
                id="notes"
                className="w-full p-2 border rounded-md h-20"
                placeholder="Any additional details about the offer..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOfferOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewOffer}>Create Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
