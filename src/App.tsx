import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AlertProvider } from "@/context/AlertContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Suspense, useState } from "react";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import LearnMore from "./pages/LearnMore";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Protected pages
import Index from "./pages/Index";
import Dashboard from "./pages/dashboard/Dashboard";
import MachineList from "./pages/machines/MachineList";
import UserList from "./pages/users/UserList";
import CreateUserPage from "./pages/users/CreateUserPage";
import EditUserPage from "./pages/users/EditUserPage";
import UserDetailsPage from "./pages/users/UserDetailsPage";
import AlertList from "./pages/alerts/AlertList";
import MaintenanceList from "./pages/maintenance/MaintenanceList";
import ReportList from "./pages/reports/ReportList";
import PredictionDashboard from "./pages/prediction/PredictionDashboard";
import FeedbackList from "./pages/feedback/FeedbackList";
import NotificationList from "./pages/notifications/NotificationList";
import ProfilePage from "./pages/profile/ProfilePage";
import { ErrorBoundary } from "./components/ErrorBoundary";

const App = () => {
  // Create a new QueryClient instance for each component render
  // This ensures that the QueryClient is properly initialized
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      }),
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AlertProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/learn-more" element={<LearnMore />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />

                    {/* Protected routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/machines"
                      element={
                        <ProtectedRoute requiredRoles={["technician", "admin"]}>
                          <MachineList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute requiredRoles={["admin"]}>
                          <UserList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users/create"
                      element={
                        <ProtectedRoute requiredRoles={["admin"]}>
                          <CreateUserPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users/edit/:userId"
                      element={
                        <ProtectedRoute requiredRoles={["admin"]}>
                          <EditUserPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users/:userId"
                      element={
                        <ProtectedRoute requiredRoles={["admin"]}>
                          <UserDetailsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/alerts"
                      element={
                        <ProtectedRoute>
                          <AlertList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/maintenance"
                      element={
                        <ProtectedRoute requiredRoles={["technician", "admin"]}>
                          <MaintenanceList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute requiredRoles={["admin"]}>
                          <ReportList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/prediction"
                      element={
                        <ProtectedRoute requiredRoles={["technician", "admin"]}>
                          <PredictionDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/feedback"
                      element={
                        <ProtectedRoute>
                          <FeedbackList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <NotificationList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Index page for redirection */}
                    <Route path="/index" element={<Index />} />

                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </AlertProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
