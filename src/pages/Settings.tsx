
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceControls } from '../components/shared/VoiceControls';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string({
    required_error: "Please select a role.",
  }),
  bio: z.string().max(160).optional(),
});

const Settings: React.FC = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = useState('profile');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Profile form
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      bio: "HR System Administrator with 5+ years of experience",
    },
  });

  useEffect(() => {
    speak("Settings module loaded. Here you can customize your account, notifications, and system preferences.");
  }, [speak]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      'profile': "Profile settings. Update your personal information and account details.",
      'notifications': "Notification settings. Configure how and when you receive alerts and updates.",
      'appearance': "Appearance settings. Customize the look and feel of your interface.",
      'security': "Security settings. Manage your password and security preferences."
    };
    
    speak(tabMessages[value as keyof typeof tabMessages] || "");
  };

  const handleToggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    
    if (!isVoiceEnabled) {
      speak("Voice assistant enabled");
      toast.success("Voice assistant enabled");
    } else {
      speak("Voice assistant disabled");
      toast.success("Voice assistant disabled");
    }
  };

  const handleToggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
    toast.success(`Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}`);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`Dark mode ${!darkMode ? 'enabled' : 'disabled'}`);
  };

  function onSubmitProfile(values: z.infer<typeof profileFormSchema>) {
    console.log(values);
    speak("Profile information has been updated successfully");
    toast.success("Profile updated successfully");
  }

  const handleChangePassword = () => {
    speak("Password changed successfully. Make sure to use a strong password that includes uppercase letters, lowercase letters, numbers, and special characters for maximum security.");
    toast.success("Password changed successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <VoiceControls />
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="hr_manager">HR Manager</SelectItem>
                            <SelectItem value="department_head">Department Head</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <textarea
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="A brief description about yourself"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Brief description for your profile. URLs are hyperlinked.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit">Update profile</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={handleToggleEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Voice Assistant</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable voice feedback for navigation and actions
                    </p>
                  </div>
                  <Switch 
                    checked={isVoiceEnabled} 
                    onCheckedChange={handleToggleVoice}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Browser Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when browser is in background
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Categories</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="approval-notifications" className="flex flex-col">
                      <span>Approval Requests</span>
                      <span className="text-xs text-muted-foreground">
                        Leave approvals, expense approvals, etc.
                      </span>
                    </Label>
                    <Switch id="approval-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-notifications" className="flex flex-col">
                      <span>System Notifications</span>
                      <span className="text-xs text-muted-foreground">
                        Updates, maintenance, outages, etc.
                      </span>
                    </Label>
                    <Switch id="system-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="task-notifications" className="flex flex-col">
                      <span>Task Reminders</span>
                      <span className="text-xs text-muted-foreground">
                        Deadlines, assignments, to-dos, etc.
                      </span>
                    </Label>
                    <Switch id="task-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message-notifications" className="flex flex-col">
                      <span>Messages</span>
                      <span className="text-xs text-muted-foreground">
                        Direct messages, mentions, comments, etc.
                      </span>
                    </Label>
                    <Switch id="message-notifications" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Save preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Dark Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={handleToggleDarkMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Text Size</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">A</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg">A</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Color Theme</h4>
                <div className="grid grid-cols-5 gap-2">
                  {["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-gray-500"].map((color, index) => (
                    <div key={index} className={`h-10 rounded-md cursor-pointer ${color}`} />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Dashboard Layout</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border rounded-md p-2 cursor-pointer hover:bg-accent">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-16 bg-muted rounded"></div>
                        <div className="h-16 bg-muted rounded"></div>
                      </div>
                      <div className="h-12 bg-muted rounded"></div>
                    </div>
                    <p className="text-xs text-center mt-2">Compact</p>
                  </div>
                  <div className="border rounded-md p-2 cursor-pointer hover:bg-accent">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-16 bg-muted rounded"></div>
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                    <p className="text-xs text-center mt-2">Expanded</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Save appearance</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password Settings</CardTitle>
              <CardDescription>
                Update your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when logging in
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Save security settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
