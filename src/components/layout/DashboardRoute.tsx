import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MainLayout } from './MainLayout';
import Dashboard from '../../pages/Dashboard';
import EmployeeDashboard from '../../pages/EmployeeDashboard';

export const DashboardRoute: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'employee') {
    return (
      <MainLayout>
        <EmployeeDashboard />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};