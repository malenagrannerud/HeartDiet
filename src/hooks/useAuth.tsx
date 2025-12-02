/**
 * ==========================================
 * AUTHENTICATION HOOK
 * ==========================================
 * 
 * Manages user authentication state and operations
 * Uses Supabase Auth with proper session handling
 * 
 * USAGE:
 * const { user, session, signUp, signIn, signOut, loading } = useAuth();
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Wrap your app with this to provide auth context
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST (critical for session persistence)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        }
        
        if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: 'Återställ lösenord',
            description: 'Följ länken i mejlet för att återställa ditt lösenord.',
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  /**
   * Sign up new user with email and password
   */
  const signUp = async (
    email: string, 
    password: string, 
    fullName?: string
  ): Promise<{ error: AuthError | null }> => {
    try {
      const redirectUrl = `${window.location.origin}/app/today`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || email.split('@')[0],
          },
        },
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Registrering misslyckades',
          description: error.message,
        });
        return { error };
      }

      toast({
        title: 'Kontot skapat!',
        description: 'Välkommen till Hälsoappen. Du kan nu börja spåra din hälsa.',
      });

      return { error: null };
    } catch (err) {
      const error = err as AuthError;
      return { error };
    }
  };

  /**
   * Sign in existing user
   */
  const signIn = async (
    email: string, 
    password: string
  ): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Inloggning misslyckades',
          description: error.message === 'Invalid login credentials' 
            ? 'Felaktig e-post eller lösenord'
            : error.message,
        });
        return { error };
      }

      toast({
        title: 'Välkommen tillbaka!',
        description: 'Du är nu inloggad.',
      });

      return { error: null };
    } catch (err) {
      const error = err as AuthError;
      return { error };
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Utloggning misslyckades',
        description: error.message,
      });
      return;
    }

    toast({
      title: 'Utloggad',
      description: 'Du har loggats ut från Hälsoappen.',
    });
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Återställning misslyckades',
        description: error.message,
      });
      return { error };
    }

    toast({
      title: 'E-post skickat',
      description: 'Kolla din inkorg för återställningslänk.',
    });

    return { error: null };
  };

  /**
   * Update user password (after reset or in settings)
   */
  const updatePassword = async (newPassword: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Lösenordsuppdatering misslyckades',
        description: error.message,
      });
      return { error };
    }

    toast({
      title: 'Lösenord uppdaterat',
      description: 'Ditt nya lösenord har sparats.',
    });

    return { error: null };
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
