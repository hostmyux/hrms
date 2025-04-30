
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { VoiceControls } from '../components/shared/VoiceControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

import { PayrollOverview } from '../components/payroll/PayrollOverview';
import { SalaryStructure } from '../components/payroll/SalaryStructure';
import { PayrollProcessing } from '../components/payroll/PayrollProcessing';
import { PayrollHistory } from '../components/payroll/PayrollHistory';

const Payroll: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = React.useState('dashboard');

  useEffect(() => {
    speak("Payroll management module loaded. This workspace streamlines compensation management with automated calculations, tax handling, and customizable reporting. The system maintains compliance with labor laws while providing detailed insights into your organization's compensation expenses.");
  }, [speak]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      'dashboard': "Payroll dashboard view. This centralized hub displays upcoming payrolls, recent transactions, and compensation metrics. The interactive charts help visualize payroll distribution across departments and time periods.",
      'salary': "Salary structure management. Configure compensation frameworks including basic pay, allowances, bonuses, and deductions. The tax simulation feature helps optimize employee take-home pay while ensuring regulatory compliance.",
      'processing': "Payroll processing center. Run payroll calculations, approve compensation, and generate payment instructions. The validation system automatically identifies anomalies for review before finalizing payments.",
      'history': "Payroll history and documentation. Access archived payroll records, tax forms, and compliance documentation. The audit trail provides complete visibility into all payroll-related transactions and approvals."
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
    toast({
      title: `${value.charAt(0).toUpperCase() + value.slice(1)} View`,
      description: tabMessages[value as keyof typeof tabMessages] || "",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">
            Manage employee compensation, salaries, and payments.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="salary">Salary Structure</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <PayrollOverview />
        </TabsContent>
        
        <TabsContent value="salary" className="space-y-4">
          <SalaryStructure />
        </TabsContent>
        
        <TabsContent value="processing" className="space-y-4">
          <PayrollProcessing />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <PayrollHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
