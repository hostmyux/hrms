
import React, { useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Clock, FileText } from 'lucide-react';

const Payroll: React.FC = () => {
  const { speak } = useVoice();

  useEffect(() => {
    speak("Payroll management module loaded. Process salaries, manage compensations, and generate payslips.");
  }, [speak]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
        <p className="text-muted-foreground">
          Manage salary processing, compensations, and payslips.
        </p>
      </div>
      
      <Tabs defaultValue="salary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="salary">Salary Structure</TabsTrigger>
          <TabsTrigger value="process">Payroll Processing</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="overtime">Overtime</TabsTrigger>
        </TabsList>
        
        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salary Structure</CardTitle>
              <CardDescription>
                Manage employee salary structures and components
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <Briefcase size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Salary structure management features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="process" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Processing</CardTitle>
              <CardDescription>
                Run payroll calculations and processing
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <FileText size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Payroll processing features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payslips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payslips</CardTitle>
              <CardDescription>
                Generate and manage employee payslips
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <FileText size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Payslip generation features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overtime Management</CardTitle>
              <CardDescription>
                Track and calculate employee overtime
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div>
                <Clock size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Overtime management features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
