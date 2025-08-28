import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useVoice } from '../../contexts/VoiceContext';
import { Download, FileSpreadsheet, FileText, Database } from 'lucide-react';
import { ResponsiveDialog } from '../shared/ResponsiveDialog';

interface ExportConfig {
  module: string;
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  dateRange: '7days' | '30days' | '90days' | 'all';
  includeFields: string[];
}

const exportModules = [
  { value: 'employees', label: 'Employee Data', icon: Database },
  { value: 'attendance', label: 'Attendance Records', icon: FileSpreadsheet },
  { value: 'payroll', label: 'Payroll Data', icon: FileText },
  { value: 'performance', label: 'Performance Reviews', icon: FileSpreadsheet },
  { value: 'recruitment', label: 'Recruitment Data', icon: Database },
];

const employeeFields = [
  'name', 'email', 'phone', 'department', 'position', 'salary', 'hireDate', 'status'
];

export const DataExportManager: React.FC = () => {
  const { speak } = useVoice();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    module: 'employees',
    format: 'csv',
    dateRange: '30days',
    includeFields: []
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    speak(`Exporting ${exportConfig.module} data in ${exportConfig.format} format. This may take a few moments.`);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would make an API call to generate and download the file
      const filename = `${exportConfig.module}_export_${new Date().toISOString().split('T')[0]}.${exportConfig.format}`;
      
      toast.success(`Export completed: ${filename}`, {
        description: 'File download will begin shortly'
      });
      
      speak(`Export completed successfully. The ${exportConfig.module} data has been exported as ${filename}.`);
      setIsExportOpen(false);
    } catch (error) {
      toast.error('Export failed', {
        description: 'Please try again or contact support'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const toggleField = (field: string) => {
    setExportConfig(prev => ({
      ...prev,
      includeFields: prev.includeFields.includes(field)
        ? prev.includeFields.filter(f => f !== field)
        : [...prev.includeFields, field]
    }));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
          <CardDescription>
            Export HR data for reporting, compliance, or backup purposes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exportModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Card key={module.value} className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{module.label}</h4>
                          <p className="text-xs text-muted-foreground">Export available</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setExportConfig(prev => ({ ...prev, module: module.value }));
                          setIsExportOpen(true);
                          speak(`Configuring export for ${module.label}. Choose your preferred format and date range.`);
                        }}
                      >
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ResponsiveDialog
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        title="Configure Data Export"
        description="Select export format, date range, and specific fields to include"
        footer={
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button variant="outline" onClick={() => setIsExportOpen(false)} className="sm:w-auto w-full">
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting || exportConfig.includeFields.length === 0}
              className="sm:w-auto w-full"
            >
              {isExporting ? 'Exporting...' : 'Start Export'}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select 
                value={exportConfig.format} 
                onValueChange={(value) => setExportConfig(prev => ({ ...prev, format: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select 
                value={exportConfig.dateRange} 
                onValueChange={(value) => setExportConfig(prev => ({ ...prev, dateRange: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Include Fields</label>
            <div className="grid grid-cols-2 gap-2">
              {employeeFields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={exportConfig.includeFields.includes(field)}
                    onCheckedChange={() => toggleField(field)}
                  />
                  <label htmlFor={field} className="text-sm capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ResponsiveDialog>
    </>
  );
};