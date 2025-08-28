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
    { module: 'attendance', actions: ['view', 'team-manage'] }, // Only manage team attendance
    { module: 'performance', actions: ['view', 'team-review'] }, // Only review team performance
    { module: 'learning', actions: ['view', 'team-assign'] }, // Only assign learning to team
    { module: 'reports', actions: ['view', 'team-export'] }, // Only team reports
    { module: 'helpdesk', actions: ['view', 'create'] },
    { module: 'notifications', actions: ['view'] },
    { module: 'calendar', actions: ['view', 'create', 'edit'] },
    { module: 'documents', actions: ['view', 'create'] }
  ],
  hr_manager: [
    { module: 'dashboard', actions: ['view'] },
    { module: 'organization', actions: ['view', 'edit'] }, // HR can view/edit org structure
    { module: 'employees', actions: ['view', 'create', 'edit'] }, // HR manages employees
    { module: 'recruitment', actions: ['view', 'create', 'edit', 'delete'] }, // Full recruitment access
    { module: 'attendance', actions: ['view', 'manage'] }, // Full attendance management
    { module: 'payroll', actions: ['view', 'process'] }, // HR processes payroll
    { module: 'performance', actions: ['view', 'create', 'edit'] }, // HR manages performance
    { module: 'learning', actions: ['view', 'create', 'assign'] }, // HR manages learning
    { module: 'reports', actions: ['view', 'create', 'export'] }, // Full reporting access
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
  '/attendance',
  '/performance',
  '/learning',
  '/reports',
  '/helpdesk',
  '/notifications',
  '/calendar',
  '/documents'
];

export const hrManagerAccessibleRoutes = [
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
  '/user-activity',
  '/admin'
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
    case 'hr_manager':
      return hrManagerAccessibleRoutes.includes(route);
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
    case 'hr_manager':
      return hrManagerAccessibleRoutes;
    case 'manager':
      return managerAccessibleRoutes;
    case 'employee':
      return employeeAccessibleRoutes;
    default:
      return [];
  }
};