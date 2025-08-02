import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Building2, Users } from 'lucide-react';

const Login: React.FC = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee' | 'manager' | 'hr_manager'>('employee');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login - just switch role and navigate
    switchRole(selectedRole);
    toast.success(`Logged in as ${selectedRole}`, {
      description: `Welcome to HRMS Nexus!`
    });
    navigate('/');
  };

  const quickLogin = (role: 'admin' | 'employee' | 'manager' | 'hr_manager') => {
    switchRole(role);
    toast.success(`Quick login as ${role}`, {
      description: `Welcome to HRMS Nexus!`
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">HRMS Nexus</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Demo Login</CardTitle>
            <CardDescription>Choose a role to explore the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Login as</Label>
                <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Department Manager</SelectItem>
                    <SelectItem value="hr_manager">HR Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or quick login
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                onClick={() => quickLogin('employee')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Employee Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => quickLogin('manager')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Department Manager
              </Button>
              <Button 
                variant="outline" 
                onClick={() => quickLogin('hr_manager')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                HR Manager
              </Button>
              <Button 
                variant="outline" 
                onClick={() => quickLogin('admin')}
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Admin Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;