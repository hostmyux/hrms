
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyInfoForm } from '../components/organization/CompanyInfoForm';
import { DepartmentManagement } from '../components/organization/DepartmentManagement';
import { DesignationManagement } from '../components/organization/DesignationManagement';
import { LocationManagement } from '../components/organization/LocationManagement';
import { OrganizationChart } from '../components/organization/OrganizationChart';
import { VoiceControls } from '../components/shared/VoiceControls';

const Organization: React.FC = () => {
  const { speak } = useVoice();

  useEffect(() => {
    speak("Organization management module loaded. Here you can manage company information, departments, designations, and view organization structure.");
  }, [speak]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Management</h1>
          <p className="text-muted-foreground">
            Manage your company structure, departments, and locations.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="designations">Designations</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="structure">Organization Chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="space-y-4">
          <CompanyInfoForm />
        </TabsContent>
        
        <TabsContent value="departments" className="space-y-4">
          <DepartmentManagement />
        </TabsContent>
        
        <TabsContent value="designations" className="space-y-4">
          <DesignationManagement />
        </TabsContent>
        
        <TabsContent value="locations" className="space-y-4">
          <LocationManagement />
        </TabsContent>
        
        <TabsContent value="structure" className="space-y-4">
          <OrganizationChart />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Organization;
