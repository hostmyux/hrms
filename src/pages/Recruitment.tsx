
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceControls } from '../components/shared/VoiceControls';
import { toast } from 'sonner';
import { JobPostings } from '../components/recruitment/JobPostings';
import { Applications } from '../components/recruitment/Applications';
import { Interviews } from '../components/recruitment/Interviews';
import { Offers } from '../components/recruitment/Offers';

const Recruitment: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = React.useState('jobs');

  useEffect(() => {
    speak("Recruitment module loaded. This is your hiring command center where you can manage the entire candidate journey from job posting to offer acceptance. Use the tabs below to navigate through different stages of the recruitment process.");
  }, [speak]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      'jobs': "Job Postings section. Here you can create new job listings, edit existing ones, and manage posting channels. Track application metrics and set hiring goals for each position.",
      'applications': "Applications tracking section. Review incoming applications, sort candidates by qualifications, and manage their progress through custom recruitment pipelines.",
      'interviews': "Interview scheduling section. Coordinate with hiring managers and candidates, send calendar invites, and track interview feedback from all participants.",
      'offers': "Offer management section. Create customized offer letters, track negotiations, and monitor acceptance rates. Set reminders for candidate response deadlines."
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
    toast(`${value.charAt(0).toUpperCase() + value.slice(1)}: ${tabMessages[value as keyof typeof tabMessages] || ""}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment</h1>
          <p className="text-muted-foreground">
            Manage job postings, applications, and candidate tracking.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="jobs" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="space-y-4">
          <JobPostings />
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-4">
          <Applications />
        </TabsContent>
        
        <TabsContent value="interviews" className="space-y-4">
          <Interviews />
        </TabsContent>
        
        <TabsContent value="offers" className="space-y-4">
          <Offers />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recruitment;
