import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataExportManager } from '../components/admin/DataExportManager';
import { AuditTrail } from '../components/admin/AuditTrail';
import { UserManagement } from '../components/admin/UserManagement';
import { VoiceControls } from '../components/shared/VoiceControls';
import { useVoice } from '../contexts/VoiceContext';
import { Shield, Users, Download, Settings, BarChart3, Database } from 'lucide-react';

export const Admin: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const tabDescriptions = {
      overview: 'System overview with key metrics and administrative insights',
      users: 'User account management, roles, and permissions administration',
      audit: 'Security audit trail and compliance monitoring',
      export: 'Data export tools for reporting and backup purposes'
    };
    
    speak(`${tabDescriptions[tab as keyof typeof tabDescriptions] || 'Administrative section loaded'}`);
  };

  const systemStats = [
    { title: 'Total Users', value: '247', icon: Users, description: 'Active system users' },
    { title: 'Data Exports', value: '12', icon: Download, description: 'This month' },
    { title: 'Security Events', value: '3', icon: Shield, description: 'Requiring attention' },
    { title: 'System Uptime', value: '99.9%', icon: BarChart3, description: 'Last 30 days' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-muted-foreground">
            Manage users, monitor system security, and configure organizational settings
          </p>
        </div>
        <VoiceControls />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="export">Data Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common administrative tasks and system operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <h4 className="font-medium">Backup System Data</h4>
                  <p className="text-sm text-muted-foreground">Create a complete system backup</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <h4 className="font-medium">System Health Check</h4>
                  <p className="text-sm text-muted-foreground">Run comprehensive system diagnostics</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <h4 className="font-medium">Clear System Cache</h4>
                  <p className="text-sm text-muted-foreground">Optimize system performance</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Information
                </CardTitle>
                <CardDescription>
                  Current system status and configuration details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Database Size</span>
                  <span className="text-sm font-medium">2.4 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Backup</span>
                  <span className="text-sm font-medium">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">System Version</span>
                  <span className="text-sm font-medium">v2.1.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">License Status</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="audit">
          <AuditTrail />
        </TabsContent>

        <TabsContent value="export">
          <DataExportManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;