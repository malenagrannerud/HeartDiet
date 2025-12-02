import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

   // Show loading state while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Laddar...</div>;
  }
  
  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Render protected content if authenticated
  return <>{children}</>;
}
