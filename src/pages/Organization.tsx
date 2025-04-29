
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyInfoForm } from '../components/organization/CompanyInfoForm';
import { DepartmentManagement } from '../components/organization/DepartmentManagement';
import { DesignationManagement } from '../components/organization/DesignationManagement';
import { LocationManagement } from '../components/organization/LocationManagement';
import { OrganizationChart } from '../components/organization/OrganizationChart';
import { VoiceControls } from '../components/shared/VoiceControls';
import { toast } from '@/components/ui/use-toast';

const Organization: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = React.useState('company');

  useEffect(() => {
    speak("Organization management module loaded. Here you can manage company information, departments, designations, and view organization structure.");
  }, [speak]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      'company': "Company information management. Update your organization details and branding.",
      'departments': "Department management. Create, update, and manage your organization's departments.",
      'designations': "Designation management. Manage job titles and positions across your organization.",
      'locations': "Location management. Add and manage office locations and facilities.",
      'structure': "Organization chart. View and navigate your organization's hierarchical structure."
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
    toast({
      title: "Tab changed",
      description: `You are now viewing the ${value} tab`,
      duration: 2000,
    });
  };

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
      
      <Tabs defaultValue="company" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
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
