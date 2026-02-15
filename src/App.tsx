/**
 * Main application component
 * 
 * @module App.tsx
 * 
 * @requires @/components/ui/toaster - Toast notification display
 * @requires @/components/ui/sonner - Alternative toast notifications
 * @requires @/components/ui/tooltip - Tooltip context provider
 * @requires @tanstack/react-query - Server state management
 * @requires react-router-dom - Routing and navigation
 * @requires @/lib/storage - Local storage utilities
 * @requires @/lib/schemas - Validation schemas
 * @requires @/hooks/use-auth - Authentication context
 * @requires ./pages/Onboarding - New user onboarding flow
 * @requires ./pages/MainApp - Main application after onboarding
 * @requires ./pages/NotFound - 404 page
 * @requires ./pages/Auth - Login/signup page
 * 
 * @description
 * Root component, sets up all global providers and routing.
 * Handles authentication flow and onboarding state.
 * 
 * Provider hierarchy (order matters):
 * 1. QueryClientProvider - React Query for API calls
 * 2. AuthProvider - User authentication state
 * 3. TooltipProvider - UI tooltips
 * 4. BrowserRouter - Client-side routing
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { onboardingCompletedSchema } from "@/lib/schemas";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Onboarding from "./pages/PR";
import MainApp from "./pages/MainApp";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

/**
 * React Query client instance
 * Manages server state caching and background updates
 */
const queryClient = new QueryClient();

/**
 * Application routes with authentication and onboarding protection
 * 
 * @component
 * 
 * @description
 * Handles all route logic:
 * - Redirects unauthenticated users to /auth
 * - Shows onboarding to new authenticated users
 * - Sends returning users directly to /app
 * - Migrates legacy localStorage keys automatically
 * 
 * @returns {JSX.Element} Routes component
 */
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

  /**
   * Sync onboarding state with storage on mount
   */
  useEffect(() => {
    const completed = getStorageItem("onboardingCompleted", onboardingCompletedSchema) ?? false;
    setOnboardingCompleted(completed);
  }, []);

  /**
   * Marks onboarding as complete and updates state
   */
  const completeOnboarding = () => {
    setStorageItem("onboardingCompleted", true, onboardingCompletedSchema);
    setOnboardingCompleted(true);
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Laddar...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root route - redirects based on auth and onboarding status */}
      <Route 
        path="/" 
        element={
          user 
            ? (onboardingCompleted ? <Navigate to="/app" replace /> : <Navigate to="/welcome" replace />)
            : <Navigate to="/auth" replace />
        } 
      />
      
      {/* Auth page - redirects to home if already logged in */}
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/" replace /> : <Auth />} 
      />
      
      {/* Onboarding - only for new authenticated users */}
      <Route 
        path="/welcome" 
        element={
          user 
            ? <Onboarding onComplete={completeOnboarding} />
            : <Navigate to="/auth" replace />
        } 
      />
      
      {/* Main app - protected route */}
      <Route 
        path="/app/*" 
        element={user ? <MainApp /> : <Navigate to="/auth" replace />} 
      />
      
      {/* 404 - catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

/**
 * Root application component
 * 
 * @component
 * @returns {JSX.Element} Wrapped application with all providers
 * 
 * @example
 * // Used in main.tsx:
 * import App from './App'
 * createRoot(rootElement).render(<App />)
 */
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