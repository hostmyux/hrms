import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Dashboard from '../../pages/Dashboard';
import EmployeeDashboard from '../../pages/EmployeeDashboard';

export const DashboardRoute: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'employee') {
    return <EmployeeDashboard />;
  }

  return <Dashboard />;
};