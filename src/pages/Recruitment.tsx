
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Calendar, FileText, UserPlus } from 'lucide-react';

const Recruitment: React.FC = () => {
  const { speak } = useVoice();

  useEffect(() => {
    speak("Recruitment module loaded. Here you can manage job postings, applications, interviews and hiring processes.");
  }, [speak]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recruitment</h1>
        <p className="text-muted-foreground">
          Manage job postings, applications, and candidate tracking.
        </p>
      </div>
      
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Postings</CardTitle>
              <CardDescription>
                Create and manage job postings
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <Briefcase size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Job posting management features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>
                Track and manage job applications
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <FileText size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Application tracking features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interview Scheduling</CardTitle>
              <CardDescription>
                Schedule and track candidate interviews
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <Calendar size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Interview scheduling features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Offer Management</CardTitle>
              <CardDescription>
                Create and track job offers
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <UserPlus size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Offer management features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recruitment;
