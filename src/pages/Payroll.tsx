
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { VoiceControls } from '../components/shared/VoiceControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Download, FileText, Eye, Play, Calendar, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PayrollOverview } from '../components/payroll/PayrollOverview';
import { SalaryStructure } from '../components/payroll/SalaryStructure';
import { PayrollProcessing } from '../components/payroll/PayrollProcessing';
import { PayrollHistory } from '../components/payroll/PayrollHistory';

interface SalaryComponentFormData {
  name: string;
  type: 'earnings' | 'deductions' | 'benefits';
  amount: string;
  description: string;
  taxable: 'yes' | 'no';
}

interface RunPayrollFormData {
  period: string;
  startDate: string;
  endDate: string;
  paymentDate: string;
}

const Payroll: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);
  const [isRunPayrollOpen, setIsRunPayrollOpen] = useState(false);
  const [isViewPayrollOpen, setIsViewPayrollOpen] = useState(false);
  const [selectedPayrollId, setSelectedPayrollId] = useState<number | null>(null);
  
  const componentForm = useForm<SalaryComponentFormData>({
    defaultValues: {
      name: '',
      type: 'earnings',
      amount: '',
      description: '',
      taxable: 'yes'
    }
  });
  
  const payrollForm = useForm<RunPayrollFormData>({
    defaultValues: {
      period: 'May 2025',
      startDate: '2025-05-01',
      endDate: '2025-05-31',
      paymentDate: '2025-06-05'
    }
  });

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
  
  const handleAddSalaryComponent = () => {
    setIsAddComponentOpen(true);
    componentForm.reset();
    speak("Creating a new salary component. This will be added to the compensation structure and can be applied to employee salary calculations.");
  };
  
  const handleRunPayroll = () => {
    setIsRunPayrollOpen(true);
    payrollForm.reset();
    speak("Preparing to run payroll process. This will calculate compensation for all employees for the specified period, including all earnings, deductions and benefits.");
  };
  
  const handleViewPayrollDetail = (payrollId: number) => {
    setSelectedPayrollId(payrollId);
    setIsViewPayrollOpen(true);
    speak("Viewing detailed payroll report. This shows the complete breakdown of all compensation components, tax calculations, and payment details for the selected payroll period.");
  };
  
  const onSubmitSalaryComponent = (data: SalaryComponentFormData) => {
    setIsAddComponentOpen(false);
    toast({
      title: "Component Added",
      description: `${data.name} has been added to the salary structure.`
    });
    speak(`Salary component successfully added. The new ${data.type} component "${data.name}" has been added to the compensation structure.`);
  };
  
  const onSubmitRunPayroll = (data: RunPayrollFormData) => {
    setIsRunPayrollOpen(false);
    toast({
      title: "Payroll Process Started",
      description: `Payroll calculation for ${data.period} has been initiated.`
    });
    speak(`Payroll process has started. The system is now calculating compensation for all employees for the ${data.period} period. You will be notified when the process is complete and ready for review.`);
    
    // Simulate payroll processing completion after 3 seconds
    setTimeout(() => {
      toast({
        title: "Payroll Ready for Review",
        description: `${data.perio} payroll calculations are complete and ready for review.`
      });
    }, 3000);
  };
  
  const handleDownloadPayrollPdf = () => {
    toast({
      title: "PDF Generated",
      description: "Payroll report has been downloaded as PDF."
    });
    speak("Payroll PDF generated. The comprehensive payroll report has been downloaded to your device and contains detailed compensation information for all employees.");
    
    if (isViewPayrollOpen) {
      setIsViewPayrollOpen(false);
    }
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
          <div className="flex justify-end">
            <Button onClick={handleRunPayroll}>
              <Play className="mr-2 h-4 w-4" />
              Run Payroll
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="salary" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Salary Components</h2>
            <Button onClick={handleAddSalaryComponent}>
              <Plus className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </div>
          <SalaryStructure />
        </TabsContent>
        
        <TabsContent value="processing" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Payroll Processing</h2>
            <Button onClick={handleRunPayroll}>
              <Play className="mr-2 h-4 w-4" />
              Run Payroll
            </Button>
          </div>
          <PayrollProcessing />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Recent Payrolls</CardTitle>
                <CardDescription>
                  Access past payroll records and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, period: "April 2025", date: "May 5, 2025", employees: 245, total: "$864,320.45" },
                    { id: 2, period: "March 2025", date: "April 5, 2025", employees: 243, total: "$860,182.23" },
                    { id: 3, period: "February 2025", date: "March 5, 2025", employees: 240, total: "$852,918.76" },
                  ].map((payroll) => (
                    <div key={payroll.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{payroll.period} Payroll</h3>
                        <p className="text-sm text-muted-foreground">
                          Processed on {payroll.date} • {payroll.employees} employees • {payroll.total}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPayrollDetail(payroll.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadPayrollPdf}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <PayrollHistory />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Salary Component Dialog */}
      <Dialog open={isAddComponentOpen} onOpenChange={setIsAddComponentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Salary Component</DialogTitle>
            <DialogDescription>
              Create a new component for the salary structure.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...componentForm}>
            <form onSubmit={componentForm.handleSubmit(onSubmitSalaryComponent)} className="space-y-4">
              <FormField
                control={componentForm.control}
                name="name"
                rules={{ required: "Component name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Basic Salary, Housing Allowance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={componentForm.control}
                  name="type"
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select component type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="earnings">Earnings</SelectItem>
                          <SelectItem value="deductions">Deductions</SelectItem>
                          <SelectItem value="benefits">Benefits</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={componentForm.control}
                  name="amount"
                  rules={{ required: "Amount is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount / Percentage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5000, 15%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={componentForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of this component" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={componentForm.control}
                name="taxable"
                rules={{ required: "Taxable status is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxable</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select taxable status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Whether this component is subject to income tax
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddComponentOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Component</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Run Payroll Dialog */}
      <Dialog open={isRunPayrollOpen} onOpenChange={setIsRunPayrollOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Run Payroll Process</DialogTitle>
            <DialogDescription>
              Process payroll for the current period.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...payrollForm}>
            <form onSubmit={payrollForm.handleSubmit(onSubmitRunPayroll)} className="space-y-4">
              <FormField
                control={payrollForm.control}
                name="period"
                rules={{ required: "Pay period is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pay Period</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., May 2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={payrollForm.control}
                  name="startDate"
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={payrollForm.control}
                  name="endDate"
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={payrollForm.control}
                name="paymentDate"
                rules={{ required: "Payment date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Date when salaries will be disbursed to employees
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mt-4">
                <p className="text-sm text-yellow-800">
                  Running payroll will calculate compensation for all active employees based on their
                  current salary structures, attendance records, and applicable tax rules.
                </p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsRunPayrollOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Run Payroll</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* View Payroll Detail Dialog */}
      <Dialog open={isViewPayrollOpen} onOpenChange={setIsViewPayrollOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              Payroll Details
              {selectedPayrollId === 1 && " - April 2025"}
              {selectedPayrollId === 2 && " - March 2025"}
              {selectedPayrollId === 3 && " - February 2025"}
            </DialogTitle>
            <DialogDescription>
              Complete payroll report with detailed breakdown.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium text-muted-foreground">Total Employees</h3>
                <p className="text-2xl font-semibold">
                  {selectedPayrollId === 1 && "245"}
                  {selectedPayrollId === 2 && "243"}
                  {selectedPayrollId === 3 && "240"}
                </p>
              </div>
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium text-muted-foreground">Total Payroll</h3>
                <p className="text-2xl font-semibold">
                  {selectedPayrollId === 1 && "$864,320.45"}
                  {selectedPayrollId === 2 && "$860,182.23"}
                  {selectedPayrollId === 3 && "$852,918.76"}
                </p>
              </div>
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium text-muted-foreground">Payment Date</h3>
                <p className="text-2xl font-semibold">
                  {selectedPayrollId === 1 && "May 5, 2025"}
                  {selectedPayrollId === 2 && "Apr 5, 2025"}
                  {selectedPayrollId === 3 && "Mar 5, 2025"}
                </p>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Summary Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Total Basic Salary:</span>
                  <span>
                    {selectedPayrollId === 1 && "$620,450.00"}
                    {selectedPayrollId === 2 && "$618,320.00"}
                    {selectedPayrollId === 3 && "$612,650.00"}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Total Allowances:</span>
                  <span>
                    {selectedPayrollId === 1 && "$246,120.45"}
                    {selectedPayrollId === 2 && "$244,112.23"}
                    {selectedPayrollId === 3 && "$242,268.76"}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Total Deductions:</span>
                  <span>
                    {selectedPayrollId === 1 && "$124,215.32"}
                    {selectedPayrollId === 2 && "$123,490.15"}
                    {selectedPayrollId === 3 && "$122,850.42"}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Total Tax:</span>
                  <span>
                    {selectedPayrollId === 1 && "$98,753.21"}
                    {selectedPayrollId === 2 && "$98,342.60"}
                    {selectedPayrollId === 3 && "$97,865.80"}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Total Benefits:</span>
                  <span>
                    {selectedPayrollId === 1 && "$72,432.10"}
                    {selectedPayrollId === 2 && "$72,286.45"}
                    {selectedPayrollId === 3 && "$71,945.23"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-md">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {selectedPayrollId === 1 && "Period: April 1, 2025 - April 30, 2025"}
                  {selectedPayrollId === 2 && "Period: March 1, 2025 - March 31, 2025"}
                  {selectedPayrollId === 3 && "Period: February 1, 2025 - February 28, 2025"}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-2" />
                <span>Prepared by: HR Manager • Approved by: Finance Director</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsViewPayrollOpen(false)}>
              Close
            </Button>
            <Button onClick={handleDownloadPayrollPdf}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payroll;
