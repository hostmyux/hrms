
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, CheckCircle, Target, Award } from 'lucide-react';

const Performance: React.FC = () => {
  const { speak } = useVoice();

  useEffect(() => {
    speak("Performance management module loaded. Set goals, conduct reviews, and track employee performance.");
  }, [speak]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
        <p className="text-muted-foreground">
          Manage employee performance reviews, goals, and evaluations.
        </p>
      </div>
      
      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">Goal Setting</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Setting</CardTitle>
              <CardDescription>
                Set and track employee KPIs and goals
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <Target size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Goal setting features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>
                Conduct and track employee performance reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <CheckCircle size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Performance review features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>360° Feedback</CardTitle>
              <CardDescription>
                Collect and manage comprehensive feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <BarChart size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Feedback management features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotion Management</CardTitle>
              <CardDescription>
                Track promotion recommendations and processes
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <Award size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Promotion management features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;
