import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { SupabaseAuthProvider, useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import RevisionHub from "./pages/RevisionHub";
import Messages from "./pages/Messages";
import ClassroomQA from "./pages/ClassroomQA";
import Lessons from "./pages/Lessons";
import Assignments from "./pages/Assignments";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RequireAuth: React.FC = () => {
  const { isAuthenticated, loading, profile } = useSupabaseAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Check if profile needs completion (OAuth users without subjects selected)
  const needsOnboarding = profile && (!profile.subjects || profile.subjects.length === 0);
  if (needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

const RequireOnboarding: React.FC = () => {
  const { isAuthenticated, loading, profile } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If profile is already complete (has subjects), redirect to home
  if (profile?.subjects && profile.subjects.length > 0) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />

    <Route element={<RequireOnboarding />}>
      <Route path="/onboarding" element={<Onboarding />} />
    </Route>

    <Route element={<RequireAuth />}>
      <Route path="/" element={<Index />} />
      <Route path="/revision" element={<RevisionHub />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/qa" element={<ClassroomQA />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/classes" element={<Index />} />
      <Route path="/analytics" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
