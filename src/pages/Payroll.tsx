import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Clock, FileText, Download, Search, Calendar, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { VoiceControls } from '../components/shared/VoiceControls';
import { toast } from '@/components/ui/use-toast';

// Mock salary structure data
const mockSalaryStructures = [
  { id: 1, name: 'Junior Developer', basicSalary: 50000, hra: 10000, conveyanceAllowance: 1500, medicalAllowance: 1000 },
  { id: 2, name: 'Senior Developer', basicSalary: 80000, hra: 16000, conveyanceAllowance: 2500, medicalAllowance: 2000 },
  { id: 3, name: 'Team Lead', basicSalary: 100000, hra: 20000, conveyanceAllowance: 3000, medicalAllowance: 2500 },
  { id: 4, name: 'Project Manager', basicSalary: 120000, hra: 24000, conveyanceAllowance: 3500, medicalAllowance: 3000 },
  { id: 5, name: 'HR Associate', basicSalary: 45000, hra: 9000, conveyanceAllowance: 1500, medicalAllowance: 1000 },
];

// Mock payslips data
const mockPayslips = [
  { id: 1, employeeName: 'John Smith', month: 'April', year: 2025, salary: 61500, status: 'Paid' },
  { id: 2, employeeName: 'Sarah Johnson', month: 'April', year: 2025, salary: 98500, status: 'Paid' },
  { id: 3, employeeName: 'Michael Brown', month: 'April', year: 2025, salary: 125500, status: 'Processing' },
  { id: 4, employeeName: 'Emily Davis', month: 'April', year: 2025, salary: 149500, status: 'Pending' },
  { id: 5, employeeName: 'Robert Wilson', month: 'April', year: 2025, salary: 55500, status: 'Paid' },
];

// Mock overtime data
const mockOvertimeEntries = [
  { id: 1, employeeName: 'John Smith', date: '2025-04-15', hours: 2.5, rate: 500, amount: 1250, status: 'Approved' },
  { id: 2, employeeName: 'Sarah Johnson', date: '2025-04-16', hours: 1.5, rate: 800, amount: 1200, status: 'Pending' },
  { id: 3, employeeName: 'Michael Brown', date: '2025-04-17', hours: 3, rate: 1000, amount: 3000, status: 'Approved' },
  { id: 4, employeeName: 'Emily Davis', date: '2025-04-18', hours: 2, rate: 1200, amount: 2400, status: 'Rejected' },
];

const Payroll: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = useState('salary');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    speak("Payroll management module loaded. This is your financial command center for employee compensation. Here you can configure salary structures, process regular payments, generate payslips, and manage overtime calculations. The module ensures accurate and compliant compensation processing while maintaining a complete audit trail.");
  }, [speak]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSearchQuery('');
    
    const tabMessages = {
      'salary': "Salary structure management. Define and customize compensation components for different roles and levels. The structured approach ensures internal equity while maintaining market competitiveness. You can configure basic salary, allowances, and benefits for each position category.",
      'process': "Payroll processing workflow. Run payroll calculations for the current period, verify accuracy, and authorize payments. The multi-step approval process ensures thorough verification before disbursement. The dashboard provides real-time status of the current payroll cycle.",
      'payslips': "Payslips generation and distribution. Create detailed earnings statements for employees with complete breakdown of earnings and deductions. Automated delivery options save time and ensure confidentiality. Historical payslips are archived for future reference.",
      'overtime': "Overtime calculation and approval. Track additional hours worked, apply appropriate pay rates, and process overtime compensation. The approval workflow ensures proper authorization of overtime claims. Analytics help identify departments with consistent overtime patterns.",
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
    toast({
      title: `${value.charAt(0).toUpperCase() + value.slice(1)} Management`,
      description: tabMessages[value as keyof typeof tabMessages] || "",
      duration: 3000,
    });
  };

  // Filter salary structures based on search query
  const filteredSalaryStructures = mockSalaryStructures.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter payslips based on search query
  const filteredPayslips = mockPayslips.filter(item => 
    item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.month.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">
            Manage salary processing, compensations, and payslips.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="salary" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="salary">Salary Structure</TabsTrigger>
          <TabsTrigger value="process">Payroll Processing</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="overtime">Overtime</TabsTrigger>
        </TabsList>
        
        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Salary Structure</CardTitle>
                <CardDescription>
                  Manage employee salary structures and components
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search..." 
                    className="pl-8 w-[200px]" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Structure
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="p-2 font-medium">Position</th>
                        <th className="p-2 font-medium">Basic Salary</th>
                        <th className="p-2 font-medium">HRA</th>
                        <th className="p-2 font-medium">Conv. Allow.</th>
                        <th className="p-2 font-medium">Medical Allow.</th>
                        <th className="p-2 font-medium">Total</th>
                        <th className="p-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSalaryStructures.map((structure) => (
                        <tr key={structure.id} className="border-t">
                          <td className="p-2">{structure.name}</td>
                          <td className="p-2">${structure.basicSalary.toLocaleString()}</td>
                          <td className="p-2">${structure.hra.toLocaleString()}</td>
                          <td className="p-2">${structure.conveyanceAllowance.toLocaleString()}</td>
                          <td className="p-2">${structure.medicalAllowance.toLocaleString()}</td>
                          <td className="p-2 font-medium">
                            ${(structure.basicSalary + structure.hra + structure.conveyanceAllowance + structure.medicalAllowance).toLocaleString()}
                          </td>
                          <td className="p-2 text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                      {filteredSalaryStructures.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-muted-foreground">
                            No salary structures found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Pagination 
                totalPages={Math.ceil(filteredSalaryStructures.length / 10)} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
              />
            </CardFooter>
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
            <CardContent>
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Current Pay Period</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Period:</span>
                        <span className="font-medium">April 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span className="font-medium">April 1, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date:</span>
                        <span className="font-medium">April 30, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">In Progress</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Payroll Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Employees:</span>
                        <span className="font-medium">42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gross Pay:</span>
                        <span className="font-medium">$245,750.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deductions:</span>
                        <span className="font-medium">$56,522.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Net Pay:</span>
                        <span className="font-medium">$189,227.50</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Process Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Calculated:</span>
                        <span className="font-medium">35/42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Approved:</span>
                        <span className="font-medium">28/42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processed:</span>
                        <span className="font-medium">25/42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">59.5%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payroll Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Calculate Payroll</p>
                            <p className="text-sm text-muted-foreground">
                              Process and calculate payroll for the current period
                            </p>
                          </div>
                          <Button>Run Calculation</Button>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <div>
                            <p className="font-medium">Approve Payroll</p>
                            <p className="text-sm text-muted-foreground">
                              Review and approve calculated payroll
                            </p>
                          </div>
                          <Button variant="outline">View & Approve</Button>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <div>
                            <p className="font-medium">Process Payments</p>
                            <p className="text-sm text-muted-foreground">
                              Process approved payroll payments
                            </p>
                          </div>
                          <Button variant="secondary">Process</Button>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <div>
                            <p className="font-medium">Generate Reports</p>
                            <p className="text-sm text-muted-foreground">
                              Generate payroll summary reports
                            </p>
                          </div>
                          <Button variant="outline">Generate</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payslips" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Payslips</CardTitle>
                <CardDescription>
                  Generate and manage employee payslips
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search..." 
                    className="pl-8 w-[200px]" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Select Month
                  </Button>
                  <Button>
                    Generate All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="p-2 font-medium">Employee Name</th>
                        <th className="p-2 font-medium">Period</th>
                        <th className="p-2 font-medium">Salary</th>
                        <th className="p-2 font-medium">Status</th>
                        <th className="p-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayslips.map((payslip) => (
                        <tr key={payslip.id} className="border-t">
                          <td className="p-2">{payslip.employeeName}</td>
                          <td className="p-2">{payslip.month} {payslip.year}</td>
                          <td className="p-2">${payslip.salary.toLocaleString()}</td>
                          <td className="p-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              payslip.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                              payslip.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payslip.status}
                            </span>
                          </td>
                          <td className="p-2 text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredPayslips.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-muted-foreground">
                            No payslips found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Pagination 
                totalPages={Math.ceil(filteredPayslips.length / 10)} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
              />
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="overtime" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Overtime Management</CardTitle>
                <CardDescription>
                  Track and calculate employee overtime
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Overtime
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="p-2 font-medium">Employee Name</th>
                        <th className="p-2 font-medium">Date</th>
                        <th className="p-2 font-medium">Hours</th>
                        <th className="p-2 font-medium">Rate/Hour</th>
                        <th className="p-2 font-medium">Total Amount</th>
                        <th className="p-2 font-medium">Status</th>
                        <th className="p-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOvertimeEntries.map((entry) => (
                        <tr key={entry.id} className="border-t">
                          <td className="p-2">{entry.employeeName}</td>
                          <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
                          <td className="p-2">{entry.hours}</td>
                          <td className="p-2">${entry.rate}</td>
                          <td className="p-2">${entry.amount.toLocaleString()}</td>
                          <td className="p-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              entry.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                              entry.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {entry.status}
                            </span>
                          </td>
                          <td className="p-2 text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm">
                <span className="font-medium">Total Hours:</span> 9
                <span className="mx-4 font-medium">Total Amount:</span> $7,850
              </div>
              <Pagination 
                totalPages={1} 
                currentPage={1} 
                onPageChange={() => {}} 
              />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
