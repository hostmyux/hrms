
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar, Download, FileText, Eye, Filter } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PayrollHistory: React.FC = () => {
  const { speak } = useVoice();
  
  const handleViewPayroll = (period: string) => {
    speak(`Viewing detailed payroll information for ${period}`);
  };
  
  const payrollHistory = [
    { 
      id: 1, 
      period: "March 2025", 
      date: "March 31, 2025", 
      employees: 234, 
      totalAmount: "$126,500.00",
      status: "Completed"
    },
    { 
      id: 2, 
      period: "February 2025", 
      date: "February 28, 2025", 
      employees: 232, 
      totalAmount: "$124,780.00",
      status: "Completed"
    },
    { 
      id: 3, 
      period: "January 2025", 
      date: "January 31, 2025", 
      employees: 230, 
      totalAmount: "$122,450.00",
      status: "Completed"
    },
    { 
      id: 4, 
      period: "December 2024", 
      date: "December 31, 2024", 
      employees: 228, 
      totalAmount: "$120,200.00",
      status: "Completed"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <div>
          <h3 className="text-lg font-medium">Payroll History</h3>
          <p className="text-muted-foreground text-sm">
            View and access past payroll records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Payroll Records</CardTitle>
          <CardDescription>
            View and download past payroll records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A history of payroll processing.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.period}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.employees}</TableCell>
                  <TableCell>{item.totalAmount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Completed" ? "bg-green-100 text-green-800" :
                      item.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewPayroll(item.period)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => speak(`Downloading payslips for ${item.period}`)}
                      >
                        <Download size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => speak(`Viewing detailed report for ${item.period}`)}
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
    </div>
  );
};
