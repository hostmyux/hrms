
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VoiceProvider } from "./contexts/VoiceContext";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";
import { RoleBasedRoute } from "./components/layout/RoleBasedRoute";
import Dashboard from "./pages/Dashboard";
import Organization from "./pages/Organization";
import Employees from "./pages/Employees";
import Recruitment from "./pages/Recruitment";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Performance from "./pages/Performance";
import Learning from "./pages/Learning";
import Reports from "./pages/Reports";
import Helpdesk from "./pages/Helpdesk";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import Calendar from "./pages/Calendar";
import Documents from "./pages/Documents";
import UserActionHistory from "./pages/UserActionHistory";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <>{children}</>;
};

// Dashboard Route Component
const DashboardRoute: React.FC = () => {
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <VoiceProvider>
          <UserProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <DashboardRoute />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/organization" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/organization">
                        <Organization />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/employees" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/employees">
                        <Employees />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recruitment" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/recruitment">
                        <Recruitment />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/attendance" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/attendance">
                        <Attendance />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payroll" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/payroll">
                        <Payroll />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/performance" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/performance">
                        <Performance />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/learning" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/learning">
                        <Learning />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/reports">
                        <Reports />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/helpdesk" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/helpdesk">
                        <Helpdesk />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/settings">
                        <Settings />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/notifications">
                        <Notifications />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/calendar">
                        <Calendar />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documents" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/documents">
                        <Documents />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user-activity" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoleBasedRoute route="/user-activity">
                        <UserActionHistory />
                      </RoleBasedRoute>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </VoiceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
