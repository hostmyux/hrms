
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, MapPin, Users, Network } from 'lucide-react';

const Organization: React.FC = () => {
  const { speak } = useVoice();

  useEffect(() => {
    speak("Organization management module loaded. Here you can manage company information, departments, designations, and view organization structure.");
  }, [speak]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Management</h1>
        <p className="text-muted-foreground">
          Manage your company structure, departments, and locations.
        </p>
      </div>
      
      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="designations">Designations</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="structure">Organization Chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                View and manage company details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Company information management features will be implemented here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                Create, view and manage departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <Users size={64} className="text-muted-foreground" />
              </div>
              <p className="text-center text-muted-foreground">Department management features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="designations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Designations / Job Titles</CardTitle>
              <CardDescription>
                Manage job titles and roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <Building size={64} className="text-muted-foreground" />
              </div>
              <p className="text-center text-muted-foreground">Designation management features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Office Locations</CardTitle>
              <CardDescription>
                Manage office locations and branches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <MapPin size={64} className="text-muted-foreground" />
              </div>
              <p className="text-center text-muted-foreground">Location management features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Chart</CardTitle>
              <CardDescription>
                Visual representation of organization hierarchy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <Network size={64} className="text-muted-foreground" />
              </div>
              <p className="text-center text-muted-foreground">Organization chart features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Organization;
