
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VoiceProvider } from "./contexts/VoiceContext";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";
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
      <VoiceProvider>
        <UserProvider>
          <AuthProvider>
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
                      <Organization />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/employees" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Employees />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recruitment" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Recruitment />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/attendance" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Attendance />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payroll" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Payroll />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/performance" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Performance />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/learning" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Learning />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Reports />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/helpdesk" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Helpdesk />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Notifications />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Calendar />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documents" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Documents />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user-activity" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserActionHistory />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </UserProvider>
      </VoiceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
