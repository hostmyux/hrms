
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceControls } from '../components/shared/VoiceControls';
import { TicketManagement } from '../components/helpdesk/TicketManagement';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, Search } from 'lucide-react';

const Helpdesk: React.FC = () => {
  const { speak } = useVoice();

  useEffect(() => {
    speak("HR Helpdesk loaded. Submit and track support tickets for HR-related inquiries.");
  }, [speak]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Helpdesk</h1>
          <p className="text-muted-foreground">
            Submit and track HR-related support tickets.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="new">New Ticket</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tickets" className="space-y-4">
          <TicketManagement />
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground mb-4">
                You can create a new ticket directly from the My Tickets tab by clicking the "New Ticket" button.
              </p>
              
              <TicketManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search knowledge base..."
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Popular Articles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "How to apply for leave", category: "Leave Management" },
                    { title: "Understanding your payslip", category: "Payroll" },
                    { title: "Submitting health insurance claims", category: "Benefits" },
                    { title: "Employee onboarding process", category: "HR Policies" },
                    { title: "Work from home guidelines", category: "Workplace" },
                    { title: "Performance review process", category: "Performance" }
                  ].map((article, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                      <h4 className="font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {article.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{article.category}</p>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Categories</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[
                      "Leave Management",
                      "Payroll",
                      "Benefits",
                      "HR Policies",
                      "Workplace",
                      "Performance",
                      "Training",
                      "Career Development"
                    ].map((category, index) => (
                      <div key={index} className="border rounded-lg p-3 text-center hover:bg-muted/50 cursor-pointer transition-colors">
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Helpdesk;
