
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarDays, Download, Eye } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { toast } from 'sonner';

export const PayrollProcessing: React.FC = () => {
  const { speak } = useVoice();
  
  const handleRunPayroll = () => {
    speak("Initiating payroll calculation process. This will compute compensation for all eligible employees based on current settings and attendance data.");
  };
  
  const payrollSchedules = [
    { id: 1, name: "Monthly Payroll", date: "April 30, 2025", status: "Pending", employees: 234 },
    { id: 2, name: "Commission Payroll", date: "April 15, 2025", status: "Completed", employees: 46 },
    { id: 3, name: "Bonus Distribution", date: "May 15, 2025", status: "Scheduled", employees: 78 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Payroll Schedule</CardTitle>
          <CardDescription>
            View and process upcoming payroll runs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of upcoming payroll schedules.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.name}</TableCell>
                  <TableCell>{schedule.date}</TableCell>
                  <TableCell>
                    <Badge variant={
                      schedule.status === "Completed" ? "default" :
                      schedule.status === "Pending" ? "secondary" :
                      "outline"
                    }>
                      {schedule.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{schedule.employees}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => speak(`Viewing details of ${schedule.name} scheduled for ${schedule.date}`)}
                      >
                        <Eye size={16} />
                      </Button>
                      {schedule.status === "Completed" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => speak(`Downloading payslips for ${schedule.name}`)}
                        >
                          <Download size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
