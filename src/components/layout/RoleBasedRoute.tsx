import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { canAccessRoute } from '../../utils/rolePermissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  route: string;
  fallback?: React.ReactNode;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  route, 
  fallback 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return null;
  }
  
  const hasAccess = canAccessRoute(user.role, route);
  
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-destructive/10 rounded-full w-16 h-16 flex items-center justify-center">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Access Restricted</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Your current role ({user.role}) doesn't include access to this module. 
              Please contact your administrator if you need access to this area.
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return <>{children}</>;
};