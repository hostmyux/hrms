
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Mail, 
  Puzzle, 
  Lock,
  Clock,
  ChevronsUpDown,
  Plus,
  X,
  Check
} from 'lucide-react';

// Schema for general settings form
const generalSettingsSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  systemEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  defaultLanguage: z.string(),
  timeZone: z.string(),
  dateFormat: z.string(),
  enableVoiceAssistant: z.boolean().default(true),
});

// Schema for notification settings form
const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  leaveRequests: z.boolean().default(true),
  newEmployees: z.boolean().default(true),
  attendanceAlerts: z.boolean().default(true),
  performanceReviews: z.boolean().default(true),
});

// Role management types
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  name: string;
  module: string;
  actions: string[];
}

// Integration types
interface Integration {
  id: string;
  name: string;
  description: string;
  isConnected: boolean;
  icon: React.ReactNode;
}

const Settings: React.FC = () => {
  const { speak } = useVoice();
  
  // General settings form
  const generalSettingsForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: "HRMS Nexus Inc.",
      systemEmail: "system@hrmsnexus.com",
      defaultLanguage: "english",
      timeZone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
      enableVoiceAssistant: true,
    },
  });

  // Notification settings form
  const notificationSettingsForm = useForm<z.infer<typeof notificationSettingsSchema>>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      leaveRequests: true,
      newEmployees: true,
      attendanceAlerts: true,
      performanceReviews: true,
    },
  });

  // Role management state
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Administrator",
      description: "Full system access with all permissions",
      permissions: [
        { id: "1", name: "View", module: "Employees", actions: ["view"] },
        { id: "2", name: "Edit", module: "Employees", actions: ["create", "update", "delete"] },
        { id: "3", name: "View", module: "Payroll", actions: ["view"] },
        { id: "4", name: "Manage", module: "Payroll", actions: ["create", "update", "delete"] },
        { id: "5", name: "View", module: "Settings", actions: ["view"] },
        { id: "6", name: "Manage", module: "Settings", actions: ["update"] },
      ]
    },
    {
      id: "2",
      name: "HR Manager",
      description: "Access to HR functions and limited settings",
      permissions: [
        { id: "1", name: "View", module: "Employees", actions: ["view"] },
        { id: "2", name: "Edit", module: "Employees", actions: ["create", "update", "delete"] },
        { id: "5", name: "View", module: "Settings", actions: ["view"] },
      ]
    },
    {
      id: "3",
      name: "Employee",
      description: "Basic access to self-service features",
      permissions: [
        { id: "1", name: "View", module: "Employees", actions: ["view"] },
      ]
    }
  ]);
  
  // Selected role for editing
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // Available modules for permissions
  const availableModules = [
    "Employees", "Payroll", "Attendance", "Performance", 
    "Learning", "Reports", "Settings", "Organization"
  ];
  
  // Integration state
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "Google Workspace",
      description: "Connect with Google Calendar, Gmail and Drive",
      isConnected: true,
      icon: <Globe className="h-8 w-8 text-blue-500" />
    },
    {
      id: "2",
      name: "Slack",
      description: "Send notifications and updates to Slack channels",
      isConnected: false,
      icon: <Bell className="h-8 w-8 text-purple-500" />
    },
    {
      id: "3",
      name: "Microsoft 365",
      description: "Integrate with Outlook, Teams and SharePoint",
      isConnected: false,
      icon: <Mail className="h-8 w-8 text-blue-600" />
    },
    {
      id: "4",
      name: "Zapier",
      description: "Connect with thousands of apps through Zapier",
      isConnected: false,
      icon: <Puzzle className="h-8 w-8 text-orange-500" />
    }
  ]);

  useEffect(() => {
    speak("Settings module loaded. Configure system settings, user roles, and notification preferences.");
  }, [speak]);

  const onSubmitGeneralSettings = (data: z.infer<typeof generalSettingsSchema>) => {
    console.log("General settings updated:", data);
    toast.success("General settings updated successfully");
  };

  const onSubmitNotificationSettings = (data: z.infer<typeof notificationSettingsSchema>) => {
    console.log("Notification settings updated:", data);
    toast.success("Notification settings updated successfully");
  };
  
  const toggleIntegrationConnection = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, isConnected: !integration.isConnected } 
        : integration
    ));
    
    const integration = integrations.find(i => i.id === id);
    if (integration) {
      if (!integration.isConnected) {
        toast.success(`Connected to ${integration.name}`);
      } else {
        toast.success(`Disconnected from ${integration.name}`);
      }
    }
  };
  
  const addRolePermission = (roleId: string, module: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const newPermissionId = Math.random().toString(36).substr(2, 9);
        return {
          ...role,
          permissions: [
            ...role.permissions,
            { 
              id: newPermissionId, 
              name: "View", 
              module, 
              actions: ["view"] 
            }
          ]
        };
      }
      return role;
    }));
  };
  
  const removeRolePermission = (roleId: string, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: role.permissions.filter(p => p.id !== permissionId)
        };
      }
      return role;
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure application settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalSettingsForm}>
                <form onSubmit={generalSettingsForm.handleSubmit(onSubmitGeneralSettings)} className="space-y-6">
                  <FormField
                    control={generalSettingsForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be displayed throughout the application.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalSettingsForm.control}
                    name="systemEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          Used for sending system notifications and alerts.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalSettingsForm.control}
                      name="defaultLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="spanish">Spanish</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                              <SelectItem value="german">German</SelectItem>
                              <SelectItem value="chinese">Chinese</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalSettingsForm.control}
                      name="timeZone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Zone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time zone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UTC-12">UTC-12</SelectItem>
                              <SelectItem value="UTC-8">UTC-8 (PST)</SelectItem>
                              <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                              <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                              <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                              <SelectItem value="UTC+5:30">UTC+5:30 (IST)</SelectItem>
                              <SelectItem value="UTC+8">UTC+8 (CST)</SelectItem>
                              <SelectItem value="UTC+9">UTC+9 (JST)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={generalSettingsForm.control}
                    name="dateFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            <SelectItem value="MMM D, YYYY">MMM D, YYYY</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalSettingsForm.control}
                    name="enableVoiceAssistant"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Voice Assistant</FormLabel>
                          <FormDescription>
                            Enable or disable the voice guidance assistant.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage system users and access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">System Users</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Role</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-3">Admin User</td>
                        <td className="p-3">admin@hrmsnexus.com</td>
                        <td className="p-3">Administrator</td>
                        <td className="p-3">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">John Smith</td>
                        <td className="p-3">john.smith@hrmsnexus.com</td>
                        <td className="p-3">HR Manager</td>
                        <td className="p-3">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">Sarah Johnson</td>
                        <td className="p-3">sarah.johnson@hrmsnexus.com</td>
                        <td className="p-3">Employee</td>
                        <td className="p-3">
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Inactive</Badge>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">Edit</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Roles</CardTitle>
                  <CardDescription>
                    Available user roles
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {roles.map((role) => (
                      <div 
                        key={role.id}
                        className={`p-4 cursor-pointer hover:bg-muted transition-colors ${selectedRole?.id === role.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedRole(role)}
                      >
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm text-muted-foreground">{role.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="px-4 py-3 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Role
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              {selectedRole ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedRole.name}</CardTitle>
                        <CardDescription>
                          {selectedRole.description}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">Edit Role</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Permissions</h3>
                      <div className="space-y-3">
                        {selectedRole.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                            <div>
                              <span className="font-medium">{permission.module}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({permission.actions.join(", ")})
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeRolePermission(selectedRole.id, permission.id)}
                            >
                              <X className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Add Permission</h3>
                      <div className="flex gap-2">
                        <Select onValueChange={(module) => addRolePermission(selectedRole.id, module)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a module" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableModules
                              .filter(module => !selectedRole.permissions.some(p => p.module === module))
                              .map((module) => (
                                <SelectItem key={module} value={module}>{module}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        <Button type="submit">Add</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between">
                    <Button variant="destructive" size="sm">Delete Role</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <Shield size={64} className="mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No Role Selected</h3>
                    <p className="text-muted-foreground mt-2">
                      Select a role from the list to view and edit its permissions
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure system notification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationSettingsForm}>
                <form onSubmit={notificationSettingsForm.handleSubmit(onSubmitNotificationSettings)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={notificationSettingsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive system notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationSettingsForm.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Push Notifications</FormLabel>
                            <FormDescription>
                              Receive push notifications in browser
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <h3 className="text-lg font-medium">Notification Events</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={notificationSettingsForm.control}
                      name="leaveRequests"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Leave Requests</FormLabel>
                            <FormDescription>
                              New and updated leave requests
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationSettingsForm.control}
                      name="newEmployees"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>New Employees</FormLabel>
                            <FormDescription>
                              Employee onboarding notifications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationSettingsForm.control}
                      name="attendanceAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Attendance Alerts</FormLabel>
                            <FormDescription>
                              Late arrivals and absences
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationSettingsForm.control}
                      name="performanceReviews"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Performance Reviews</FormLabel>
                            <FormDescription>
                              Review due dates and completions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save Notification Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect with external services and applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-start justify-between border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex gap-4">
                      {integration.icon}
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                        <div className="mt-2">
                          {integration.isConnected ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <Check className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Connected</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={integration.isConnected ? "outline" : "default"}
                      onClick={() => toggleIntegrationConnection(integration.id)}
                    >
                      {integration.isConnected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage API keys and access to HRMS Nexus API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="font-medium">API Key</div>
                  <div className="flex items-center mt-2">
                    <Input type="password" value="••••••••••••••••••••••••••••••" readOnly className="font-mono" />
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Lock className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Last used: April 28, 2025 at 3:24 PM
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    Regenerate Key
                  </Button>
                  <Button>
                    View API Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
