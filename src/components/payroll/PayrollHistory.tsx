
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar, Download, FileText } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

export const PayrollHistory: React.FC = () => {
  const { speak } = useVoice();
  
  const payrollHistory = [
    { id: 1, period: "March 2025", processDate: "March 31, 2025", totalAmount: "$126,500", employees: 234, taxFiled: true },
    { id: 2, period: "February 2025", processDate: "February 28, 2025", totalAmount: "$124,850", employees: 232, taxFiled: true },
    { id: 3, period: "January 2025", processDate: "January 31, 2025", totalAmount: "$123,700", employees: 230, taxFiled: true },
    { id: 4, period: "December 2024", processDate: "December 31, 2024", totalAmount: "$145,200", employees: 235, taxFiled: true },
    { id: 5, period: "November 2024", processDate: "November 30, 2024", totalAmount: "$123,100", employees: 228, taxFiled: true },
  ];
  
  const handleDownload = (period: string) => {
    speak(`Downloading payroll report for ${period}`);
  };
  
  const handleViewTaxDocuments = (period: string) => {
    speak(`Viewing tax documents for ${period} payroll`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
          <CardDescription>
            View past payroll records and download reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A history of processed payrolls.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Process Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Tax Filed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.period}</TableCell>
                  <TableCell>{item.processDate}</TableCell>
                  <TableCell>{item.totalAmount}</TableCell>
                  <TableCell>{item.employees}</TableCell>
                  <TableCell>
                    {item.taxFiled ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Filed
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDownload(item.period)}
                      >
                        <Download size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewTaxDocuments(item.period)}
                      >
                        <FileText size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          onClick={() => speak("Generating comprehensive annual payroll report with detailed breakdown by department and employee type.")}
        >
          Generate Annual Report
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => speak("Opening tax filing calendar. This view shows all critical tax deadlines and filing responsibilities.")}
        >
          <Calendar size={16} />
          Tax Calendar
        </Button>
      </div>
    </div>
  );
};
