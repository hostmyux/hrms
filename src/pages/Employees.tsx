
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeDirectory } from '../components/employees/EmployeeDirectory';
import { VoiceControls } from '../components/shared/VoiceControls';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, FileText, Users, Briefcase } from 'lucide-react';

const Employees: React.FC = () => {
  const { speak } = useVoice();

  useEffect(() => {
    speak("Employee management module loaded. Here you can manage employee profiles, view directories, and handle employee information.");
  }, [speak]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage employee profiles, information, and work history.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="directory" className="space-y-4">
          <EmployeeDirectory />
        </TabsContent>
        
        <TabsContent value="profiles" className="space-y-4">
          <Card>
            <CardContent className="pt-6 flex items-center justify-center p-8 text-center min-h-[300px]">
              <div>
                <Users size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Employee Profiles</h3>
                <p className="text-muted-foreground">
                  View and manage comprehensive employee profiles with personal details, work history, skills, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="onboarding" className="space-y-4">
          <Card>
            <CardContent className="pt-6 flex items-center justify-center p-8 text-center min-h-[300px]">
              <div>
                <UserPlus size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Employee Onboarding</h3>
                <p className="text-muted-foreground">
                  Streamline the onboarding process for new employees with customizable workflows, automated tasks, and progress tracking.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardContent className="pt-6 flex items-center justify-center p-8 text-center min-h-[300px]">
              <div>
                <FileText size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Employee Documents</h3>
                <p className="text-muted-foreground">
                  Securely store and manage employee documents including contracts, certificates, ID proofs, and other important files.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Employees;
