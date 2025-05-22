
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VoiceProvider } from "./contexts/VoiceContext";
import { UserProvider } from "./contexts/UserContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VoiceProvider>
        <UserProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                } 
              />
              <Route 
                path="/organization" 
                element={
                  <MainLayout>
                    <Organization />
                  </MainLayout>
                } 
              />
              <Route 
                path="/employees" 
                element={
                  <MainLayout>
                    <Employees />
                  </MainLayout>
                } 
              />
              <Route 
                path="/recruitment" 
                element={
                  <MainLayout>
                    <Recruitment />
                  </MainLayout>
                } 
              />
              <Route 
                path="/attendance" 
                element={
                  <MainLayout>
                    <Attendance />
                  </MainLayout>
                } 
              />
              <Route 
                path="/payroll" 
                element={
                  <MainLayout>
                    <Payroll />
                  </MainLayout>
                } 
              />
              <Route 
                path="/performance" 
                element={
                  <MainLayout>
                    <Performance />
                  </MainLayout>
                } 
              />
              <Route 
                path="/learning" 
                element={
                  <MainLayout>
                    <Learning />
                  </MainLayout>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                } 
              />
              <Route 
                path="/helpdesk" 
                element={
                  <MainLayout>
                    <Helpdesk />
                  </MainLayout>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <MainLayout>
                    <Notifications />
                  </MainLayout>
                } 
              />
              <Route 
                path="/calendar" 
                element={
                  <MainLayout>
                    <Calendar />
                  </MainLayout>
                } 
              />
              <Route 
                path="/documents" 
                element={
                  <MainLayout>
                    <Documents />
                  </MainLayout>
                } 
              />
              <Route 
                path="/user-activity" 
                element={
                  <MainLayout>
                    <UserActionHistory />
                  </MainLayout>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </VoiceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
