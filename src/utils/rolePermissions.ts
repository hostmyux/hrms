import { UserRole } from '../contexts/AuthContext';

export interface Permission {
  module: string;
  actions: string[];
}

export interface RolePermissions {
  [key: string]: Permission[];
}

// Define what each role can access
export const rolePermissions: RolePermissions = {
  admin: [
    { module: 'dashboard', actions: ['view', 'manage'] },
    { module: 'organization', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'employees', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'recruitment', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'attendance', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    { module: 'payroll', actions: ['view', 'create', 'edit', 'delete', 'process'] },
    { module: 'performance', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'learning', actions: ['view', 'create', 'edit', 'delete', 'assign'] },
    { module: 'reports', actions: ['view', 'create', 'export'] },
    { module: 'helpdesk', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'settings', actions: ['view', 'edit'] },
    { module: 'notifications', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'calendar', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'documents', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'user-activity', actions: ['view'] }
  ],
  manager: [
    { module: 'dashboard', actions: ['view'] },
    { module: 'employees', actions: ['view'] },
    { module: 'recruitment', actions: ['view', 'create', 'edit'] },
    { module: 'attendance', actions: ['view', 'manage'] },
    { module: 'payroll', actions: ['view'] },
    { module: 'performance', actions: ['view', 'create', 'edit'] },
    { module: 'learning', actions: ['view', 'assign'] },
    { module: 'reports', actions: ['view', 'export'] },
    { module: 'helpdesk', actions: ['view', 'create'] },
    { module: 'notifications', actions: ['view'] },
    { module: 'calendar', actions: ['view', 'create', 'edit'] },
    { module: 'documents', actions: ['view', 'create'] }
  ],
  employee: [
    { module: 'dashboard', actions: ['view'] },
    { module: 'attendance', actions: ['view', 'self-manage'] },
    { module: 'learning', actions: ['view', 'self-enroll'] },
    { module: 'helpdesk', actions: ['view', 'create'] },
    { module: 'notifications', actions: ['view'] },
    { module: 'calendar', actions: ['view'] },
    { module: 'documents', actions: ['view'] },
    { module: 'profile', actions: ['view', 'edit'] }
  ]
};

// Employee-specific modules and features
export const employeeAccessibleRoutes = [
  '/',
  '/attendance',
  '/learning', 
  '/helpdesk',
  '/notifications',
  '/calendar',
  '/documents',
  '/profile'
];

export const managerAccessibleRoutes = [
  '/',
  '/employees',
  '/recruitment',
  '/attendance',
  '/payroll',
  '/performance',
  '/learning',
  '/reports',
  '/helpdesk',
  '/notifications',
  '/calendar',
  '/documents'
];

export const adminAccessibleRoutes = [
  '/',
  '/organization',
  '/employees',
  '/recruitment',
  '/attendance',
  '/payroll',
  '/performance',
  '/learning',
  '/reports',
  '/helpdesk',
  '/settings',
  '/notifications',
  '/calendar',
  '/documents',
  '/user-activity'
];

export const hasPermission = (
  userRole: UserRole,
  module: string,
  action: string
): boolean => {
  const permissions = rolePermissions[userRole];
  if (!permissions) return false;
  
  const modulePermission = permissions.find(p => p.module === module);
  if (!modulePermission) return false;
  
  return modulePermission.actions.includes(action);
};

export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  switch (userRole) {
    case 'admin':
      return adminAccessibleRoutes.includes(route);
    case 'manager':
      return managerAccessibleRoutes.includes(route);
    case 'employee':
      return employeeAccessibleRoutes.includes(route);
    default:
      return false;
  }
};

export const getAccessibleRoutes = (userRole: UserRole): string[] => {
  switch (userRole) {
    case 'admin':
      return adminAccessibleRoutes;
    case 'manager':
      return managerAccessibleRoutes;
    case 'employee':
      return employeeAccessibleRoutes;
    default:
      return [];
  }
};