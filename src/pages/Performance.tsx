
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceControls } from '../components/shared/VoiceControls';
import { toast } from '@/components/ui/use-toast';
import { GoalSetting } from '../components/performance/GoalSetting';
import { Reviews } from '../components/performance/Reviews';
import { Feedback } from '../components/performance/Feedback';
import { Promotions } from '../components/performance/Promotions';

const Performance: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = React.useState('goals');

  useEffect(() => {
    speak("Performance management module loaded. This workspace helps you foster employee growth through structured assessment processes. You can set goals, conduct reviews, gather feedback, and track career development. The module is designed to align individual objectives with organizational success.");
  }, [speak]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      'goals': "Goal setting section. Here you can create SMART objectives for employees, align individual goals with department and company targets, and track progress over time. Regular goal check-ins help ensure continuous advancement toward desired outcomes.",
      'reviews': "Performance reviews section. Conduct structured evaluations, use customizable assessment templates, and track performance trends over multiple review cycles. The 360-degree feedback option provides comprehensive insights from multiple perspectives.",
      'feedback': "Feedback management section. Implement continuous feedback practices, encourage peer recognition, and document coaching conversations. The sentiment analysis helps identify organizational mood and engagement levels.",
      'promotions': "Career progression section. Track promotion readiness, identify high-potential employees, and manage succession planning. The career pathway visualization helps employees understand growth opportunities within the organization."
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
    toast({
      title: `${value.charAt(0).toUpperCase() + value.slice(1)}`,
      description: tabMessages[value as keyof typeof tabMessages] || "",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
          <p className="text-muted-foreground">
            Manage employee performance reviews, goals, and evaluations.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="goals" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">Goal Setting</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals" className="space-y-4">
          <GoalSetting />
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <Reviews />
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <Feedback />
        </TabsContent>
        
        <TabsContent value="promotions" className="space-y-4">
          <Promotions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;
