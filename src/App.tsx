import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { onboardingCompletedSchema } from "@/lib/schemas";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Onboarding from "./pages/Onboarding";
import MainApp from "./pages/MainApp";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";


// Main application wrapper that provides global context providers and routing
// - React Query for server state management and caching
// - Tooltip context for UI components
// - Toast notification systems (both Toaster and Sonner)
// - Router setup with protected routes
// - Onboarding flow: new users see welcome screen, returning users go directly to app
// - Automatically migrates old localStorage keys for backward compatibility

// Keep QueryClient for dependency compatibility
const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    // Migrate old key if exists
    const oldKey = localStorage.getItem("hasSeenOnboarding");
    if (oldKey === "true") {
      setStorageItem("onboardingCompleted", true, onboardingCompletedSchema);
      localStorage.removeItem("hasSeenOnboarding");
      return true;
    }
    return getStorageItem("onboardingCompleted", onboardingCompletedSchema) ?? false;
  });

  useEffect(() => {
    const completed = getStorageItem("onboardingCompleted", onboardingCompletedSchema) ?? false;
    setOnboardingCompleted(completed);
  }, []);

  const completeOnboarding = () => {
    setStorageItem("onboardingCompleted", true, onboardingCompletedSchema);
    setOnboardingCompleted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Laddar...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user 
            ? (onboardingCompleted ? <Navigate to="/app" replace /> : <Navigate to="/welcome" replace />)
            : <Navigate to="/auth" replace />
        } 
      />
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/" replace /> : <Auth />} 
      />
      <Route 
        path="/welcome" 
        element={
          user 
            ? <Onboarding onComplete={completeOnboarding} />
            : <Navigate to="/auth" replace />
        } 
      />
      <Route 
        path="/app/*" 
        element={user ? <MainApp /> : <Navigate to="/auth" replace />} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
