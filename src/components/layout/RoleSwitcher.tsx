import React from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, User, Users, Building2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const RoleSwitcher: React.FC = () => {
  const { user, switchRole, logout } = useAuth();

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    toast.success(`Switched to ${role} view`, {
      description: `You are now viewing as ${role}`
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Building2 className="h-4 w-4" />;
      case 'hr_manager':
        return <Users className="h-4 w-4" />;
      case 'manager':
        return <Users className="h-4 w-4" />;
      case 'employee':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive' as const;
      case 'hr_manager':
        return 'default' as const;
      case 'manager':
        return 'outline' as const;
      case 'employee':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImage} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user.name}</span>
              <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                {user.role}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{user.department}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground">ID: {user.employeeId}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleRoleSwitch('employee')}>
          <User className="mr-2 h-4 w-4" />
          <span>Employee View</span>
          {user.role === 'employee' && (
            <Badge variant="secondary" className="ml-auto text-xs">Current</Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleSwitch('manager')}>
          <Users className="mr-2 h-4 w-4" />
          <span>Department Manager</span>
          {user.role === 'manager' && (
            <Badge variant="secondary" className="ml-auto text-xs">Current</Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleSwitch('hr_manager')}>
          <Users className="mr-2 h-4 w-4" />
          <span>HR Manager</span>
          {user.role === 'hr_manager' && (
            <Badge variant="secondary" className="ml-auto text-xs">Current</Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleSwitch('admin')}>
          <Building2 className="mr-2 h-4 w-4" />
          <span>Admin View</span>
          {user.role === 'admin' && (
            <Badge variant="secondary" className="ml-auto text-xs">Current</Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;