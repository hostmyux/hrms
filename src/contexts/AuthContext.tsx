import React, { createContext, useContext, useState, useMemo } from 'react';

export type UserRole = 'admin' | 'employee' | 'manager' | 'hr_manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeId: string;
  joinDate: string;
  phone?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isManager: boolean;
  isHRManager: boolean;
}

const defaultUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@company.com',
    role: 'admin',
    department: 'IT',
    employeeId: 'EMP001',
    joinDate: '2023-01-15',
    phone: '+1-555-0101'
  },
  {
    id: '2',
    name: 'Jane Employee',
    email: 'jane@company.com',
    role: 'employee',
    department: 'Marketing',
    employeeId: 'EMP002',
    joinDate: '2023-03-20',
    phone: '+1-555-0102'
  },
  {
    id: '3',
    name: 'Mike Manager',
    email: 'mike@company.com',
    role: 'manager',
    department: 'Sales',
    employeeId: 'EMP003',
    joinDate: '2023-02-10',
    phone: '+1-555-0103'
  },
  {
    id: '4',
    name: 'Sarah HR Manager',
    email: 'sarah@company.com',
    role: 'hr_manager',
    department: 'Human Resources',
    employeeId: 'EMP004',
    joinDate: '2023-01-20',
    phone: '+1-555-0104'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    const demoUser = defaultUsers.find(u => u.role === role);
    if (demoUser) {
      setUser(demoUser);
    }
  };

  const value = useMemo(() => ({
    user,
    login,
    logout,
    switchRole,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
    isManager: user?.role === 'manager',
    isHRManager: user?.role === 'hr_manager'
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};