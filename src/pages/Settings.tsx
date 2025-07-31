import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { localStorageService } from '../services/localStorageService';
import { toast } from 'sonner';
import { 
  User, 
  Shield, 
  Bell, 
  Volume2, 
  Download,
  Save,
  AlertTriangle,
  Trash2
} from 'lucide-react';

interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    leaveApprovals: boolean;
    attendanceReminders: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'team' | 'private';
    contactVisibility: boolean;
    activityTracking: boolean;
  };
  accessibility: {
    voiceGuidance: boolean;
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
  };
}

const Settings: React.FC = () => {
  const { speak } = useVoice();
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: '',
      department: user?.department || '',
      position: '',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      leaveApprovals: true,
      attendanceReminders: true,
      systemUpdates: false,
    },
    privacy: {
      profileVisibility: 'team',
      contactVisibility: true,
      activityTracking: true,
    },
    accessibility: {
      voiceGuidance: true,
      highContrast: false,
      largeText: false,
      reducedMotion: false,
    },
  });

  useEffect(() => {
    const savedSettings = localStorageService.getItem<UserSettings>('user_settings', settings);
    setSettings(savedSettings);
    speak("Settings page loaded. Configure your profile, notifications, privacy, and accessibility preferences.");
  }, [speak]);

  const handleSaveSettings = () => {
    localStorageService.setItem('user_settings', settings);
    toast.success("Settings saved successfully");
    speak("Your settings have been saved successfully");
  };

  const handleExportData = () => {
    const userData = {
      profile: settings.profile,
      settings: settings,
      exportDate: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully");
    speak("Your user data has been exported successfully");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      localStorageService.clear();
      logout();
      toast.success("Account deleted successfully");
      speak("Your account has been deleted successfully");
    }
  };

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Accessibility
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.profile.firstName}
                    onChange={(e) => updateSettings('profile', 'firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.profile.lastName}
                    onChange={(e) => updateSettings('profile', 'lastName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.profile.phone}
                    onChange={(e) => updateSettings('profile', 'phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={settings.profile.department}
                    onChange={(e) => updateSettings('profile', 'department', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={settings.profile.position}
                    onChange={(e) => updateSettings('profile', 'position', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => updateSettings('notifications', 'emailNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => updateSettings('notifications', 'pushNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Leave Approvals</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about leave request updates
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.leaveApprovals}
                  onCheckedChange={(checked) => updateSettings('notifications', 'leaveApprovals', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Attendance Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders for check-in/check-out
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.attendanceReminders}
                  onCheckedChange={(checked) => updateSettings('notifications', 'attendanceReminders', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about system maintenance and updates
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.systemUpdates}
                  onCheckedChange={(checked) => updateSettings('notifications', 'systemUpdates', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Who can see your profile information
                </p>
                <div className="flex gap-2">
                  {['public', 'team', 'private'].map((option) => (
                    <Button
                      key={option}
                      variant={settings.privacy.profileVisibility === option ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSettings('privacy', 'profileVisibility', option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Contact Information Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to see your contact information
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.contactVisibility}
                  onCheckedChange={(checked) => updateSettings('privacy', 'contactVisibility', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activity Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the system to track your activity for analytics
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.activityTracking}
                  onCheckedChange={(checked) => updateSettings('privacy', 'activityTracking', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Options</CardTitle>
              <CardDescription>
                Configure accessibility features to improve your experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Voice Guidance</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable comprehensive voice assistance
                  </p>
                </div>
                <Switch
                  checked={settings.accessibility.voiceGuidance}
                  onCheckedChange={(checked) => updateSettings('accessibility', 'voiceGuidance', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch
                  checked={settings.accessibility.highContrast}
                  onCheckedChange={(checked) => updateSettings('accessibility', 'highContrast', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Large Text</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase text size for better readability
                  </p>
                </div>
                <Switch
                  checked={settings.accessibility.largeText}
                  onCheckedChange={(checked) => updateSettings('accessibility', 'largeText', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  checked={settings.accessibility.reducedMotion}
                  onCheckedChange={(checked) => updateSettings('accessibility', 'reducedMotion', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={handleExportData} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <Alert className="border-destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex justify-between items-center">
            <span>Delete your account and all associated data permanently.</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Settings;