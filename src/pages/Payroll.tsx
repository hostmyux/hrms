
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { VoiceControls } from '../components/shared/VoiceControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, DollarSign, CalendarDays, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

import { PayrollOverview } from '../components/payroll/PayrollOverview';
import { SalaryStructure } from '../components/payroll/SalaryStructure';

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
          <Card>
            <CardHeader>
              <CardTitle>Payroll Processing</CardTitle>
              <CardDescription>
                Run payroll calculations and generate payment instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center min-h-[300px]">
              <div>
                <CalendarDays size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Payroll Processing Center</h3>
                <p className="text-muted-foreground">
                  This feature is coming soon. You'll be able to calculate payroll, manage approvals,
                  and process payments for all employees.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>
                Access historical payroll records and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center min-h-[300px]">
              <div>
                <FileText size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Historical Records</h3>
                <p className="text-muted-foreground">
                  This feature is coming soon. You'll be able to access past payrolls,
                  tax documents, and generate comprehensive reports.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
