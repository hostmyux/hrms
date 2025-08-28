import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Search, Filter, Download } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { toast } from 'sonner';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
}

const mockAuditData: AuditEntry[] = [
  {
    id: '1',
    timestamp: '2025-01-28T10:30:00Z',
    user: 'admin@company.com',
    action: 'Employee Data Modified',
    module: 'Employee Management',
    details: 'Updated salary information for John Doe',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/91.0.4472.124',
    status: 'success'
  },
  {
    id: '2',
    timestamp: '2025-01-28T09:15:00Z',
    user: 'hr.manager@company.com',
    action: 'Failed Login Attempt',
    module: 'Authentication',
    details: 'Invalid credentials provided',
    ipAddress: '192.168.1.105',
    userAgent: 'Firefox/89.0',
    status: 'failed'
  },
  {
    id: '3',
    timestamp: '2025-01-28T08:45:00Z',
    user: 'payroll@company.com',
    action: 'Payroll Data Export',
    module: 'Payroll',
    details: 'Exported payroll data for December 2024',
    ipAddress: '192.168.1.102',
    userAgent: 'Chrome/91.0.4472.124',
    status: 'success'
  },
  {
    id: '4',  
    timestamp: '2025-01-27T16:20:00Z',
    user: 'manager@company.com',
    action: 'Policy Update',
    module: 'Compliance',
    details: 'Modified remote work policy requirements',
    ipAddress: '192.168.1.108',
    userAgent: 'Safari/14.1.1',
    status: 'warning'
  }
];

export const AuditTrail: React.FC = () => {
  const { speak } = useVoice();
  const [auditData, setAuditData] = useState<AuditEntry[]>(mockAuditData);
  const [filteredData, setFilteredData] = useState<AuditEntry[]>(mockAuditData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  useEffect(() => {
    let filtered = auditData;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    if (moduleFilter !== 'all') {
      filtered = filtered.filter(entry => entry.module === moduleFilter);
    }

    setFilteredData(filtered);
  }, [auditData, searchTerm, statusFilter, moduleFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportAuditLog = () => {
    speak('Exporting audit trail data. This includes all security events and user activities for compliance purposes.');
    toast.success('Audit log exported successfully', {
      description: 'Download will begin shortly'
    });
  };

  const modules = ['all', 'Employee Management', 'Authentication', 'Payroll', 'Compliance'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit Trail
        </CardTitle>
        <CardDescription>
          Monitor all system activities and security events for compliance and security analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>

          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              {modules.map(module => (
                <SelectItem key={module} value={module}>
                  {module === 'all' ? 'All Modules' : module}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportAuditLog}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                <TableHead className="hidden xl:table-cell">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-xs">
                    {new Date(entry.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {entry.user}
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.action}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.module}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs">
                    {entry.ipAddress}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell max-w-[200px] truncate">
                    {entry.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No audit entries match your search criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};