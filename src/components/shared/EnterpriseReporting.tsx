import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { useVoice } from '../../contexts/VoiceContext';

const sampleData = {
  headcount: [
    { month: 'Jan', employees: 240, hires: 12, departures: 3 },
    { month: 'Feb', employees: 248, hires: 10, departures: 2 },
    { month: 'Mar', employees: 255, hires: 9, departures: 2 },
    { month: 'Apr', employees: 260, hires: 8, departures: 3 },
    { month: 'May', employees: 265, hires: 7, departures: 2 }
  ],
  payrollTrends: [
    { month: 'Jan', amount: 485000, benefits: 125000 },
    { month: 'Feb', amount: 490000, benefits: 127000 },
    { month: 'Mar', amount: 505000, benefits: 130000 },
    { month: 'Apr', amount: 515000, benefits: 135000 },
    { month: 'May', amount: 520000, benefits: 138000 }
  ],
  departmentDistribution: [
    { name: 'Engineering', value: 85, color: '#0088FE' },
    { name: 'Sales', value: 65, color: '#00C49F' },
    { name: 'Marketing', value: 45, color: '#FFBB28' },
    { name: 'Support', value: 35, color: '#FF8042' },
    { name: 'HR', value: 25, color: '#8884D8' },
    { name: 'Finance', value: 15, color: '#82CA9D' }
  ]
};

interface EnterpriseReportingProps {
  className?: string;
}

export const EnterpriseReporting: React.FC<EnterpriseReportingProps> = ({ className }) => {
  const { speak } = useVoice();
  const [selectedPeriod, setSelectedPeriod] = useState('quarterly');
  const [selectedReport, setSelectedReport] = useState('overview');

  const handleExportReport = (reportType: string) => {
    speak(`Exporting ${reportType} report. This comprehensive report includes all key metrics and analytics for executive review.`);
    
    toast.success(`${reportType} report exported`, {
      description: 'Download will begin shortly'
    });
  };

  const handleScheduleReport = () => {
    speak('Scheduling automated report delivery. This will send regular reports to stakeholders based on your configured schedule.');
    
    toast.success('Report scheduled', {
      description: 'Weekly executive summary will be sent to configured recipients'
    });
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Enterprise Analytics</h3>
          <p className="text-muted-foreground text-sm">
            Comprehensive workforce analytics and business intelligence
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleScheduleReport}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          
          <Button onClick={() => handleExportReport('Executive Summary')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Workforce', value: '265', change: '+3.8%', icon: Users, trend: 'up' },
          { title: 'Monthly Payroll', value: '$658K', change: '+2.1%', icon: DollarSign, trend: 'up' },
          { title: 'Turnover Rate', value: '4.2%', change: '-0.8%', icon: TrendingUp, trend: 'down' },
          { title: 'Avg. Tenure', value: '3.2 yrs', change: '+0.3%', icon: BarChart3, trend: 'up' }
        ].map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <div className="flex items-center mt-1">
                      <Badge 
                        variant={kpi.trend === 'up' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          kpi.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {kpi.change}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-md">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Workforce Growth</CardTitle>
            <CardDescription>Employee headcount and hiring trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleData.headcount}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employees" fill="hsl(var(--primary))" />
                  <Bar dataKey="hires" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Workforce allocation across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sampleData.departmentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sampleData.departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Compensation Analytics</CardTitle>
          <CardDescription>Payroll costs and benefits trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleData.payrollTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Base Salary"
                />
                <Line 
                  type="monotone" 
                  dataKey="benefits" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="Benefits"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Reporting</CardTitle>
          <CardDescription>Generate detailed reports for compliance and analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Diversity & Inclusion Report', description: 'Workforce diversity metrics and compliance data' },
              { name: 'Compensation Analysis', description: 'Pay equity and market comparison analysis' },
              { name: 'Performance Insights', description: 'Employee performance trends and correlations' },
              { name: 'Compliance Dashboard', description: 'Regulatory compliance status and audit trails' },
              { name: 'Retention Analysis', description: 'Employee turnover patterns and risk factors' },
              { name: 'Skills Gap Analysis', description: 'Workforce capabilities vs. business requirements' }
            ].map((report, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <h4 className="font-medium text-sm mb-2">{report.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">{report.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleExportReport(report.name)}
                >
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};