import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth'; // Provides authentication state
import App from './App';
import './index.css';

// This is the entry point of the React application
// The app is now structured with essential providers that enable backend functionality:
//
// QUERY CLIENT:
// - Manages server state (data fetching, caching, synchronization)
// - Config: Data stays "fresh" for 5 minutes before background refetch
// - Config: Failed requests automatically retry once
// - This replaces manual fetch calls and useEffect patterns
//
// AUTH PROVIDER:
// - Makes user authentication state available throughout the app
// - Handles login, logout, and session persistence
// - Ensures only authenticated users can access their data
//
// These providers wrap the entire application, enabling:
// 1. User account creation and login
// 2. Secure saving/loading of health data to a database
// 3. Automatic cache management and error handling

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
      retry: 1, // Automatically retry failed requests once
    },
  },
});

// Render the application with all necessary providers
// This structure enables the full-stack features for your health app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
