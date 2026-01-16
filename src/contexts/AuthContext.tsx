import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  demoMode: boolean;
  enableDemoMode: (role: 'patient' | 'admin') => void;
  disableDemoMode: () => void;
  refreshAdminStatus: () => Promise<void>;
}

// Demo credentials are handled via real authentication
// admin@smilecare.com / admin123
// demo.patient@smilecare.com / patient123

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo mode in localStorage first
    const storedDemoMode = localStorage.getItem('demoMode');
    const storedDemoRole = localStorage.getItem('demoRole');

    if (storedDemoMode === 'true' && storedDemoRole) {
      setDemoMode(true);
    }

    // Check active sessions
    supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: any } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminStatus(session?.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      // Reset state properly when signing out
      if (_event === 'SIGNED_OUT') {
        setDemoMode(false);
        setIsAdmin(false);
        setUser(null);
        localStorage.removeItem('demoMode');
        localStorage.removeItem('demoRole');
      } else {
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkAdminStatus(session?.user);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      // Check if user is admin (you can customize this logic)
      const { data } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setIsAdmin(!!data);
    } catch (error) {
      console.log('Admin check skipped - admin_users table may not exist yet');
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Update user and check admin status after successful sign in
      if (data.user) {
        setUser(data.user);
        await checkAdminStatus(data.user);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setDemoMode(false);
      setIsAdmin(false);
      setUser(null);
      localStorage.removeItem('demoMode');
      localStorage.removeItem('demoRole');
    }
  };

  const refreshAdminStatus = async () => {
    if (user) {
      await checkAdminStatus(user);
    }
  };

  const enableDemoMode = async (role: 'patient' | 'admin') => {
    setLoading(true);
    try {
      const email = role === 'admin' ? 'admin@smilecare.com' : 'demo.patient@smilecare.com';
      const password = role === 'admin' ? 'admin123' : 'patient123';

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Demo login failed:', error);
        // Fallback: try to sign up if it's a dev environment issue, 
        // but typically we expect these users to exist.
        alert(`Could not sign in as demo ${role}. Please ensure the user ${email} exists with the correct password.`);
        throw error;
      }

      setDemoMode(true);
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoRole', role);
      // user state will be updated by onAuthStateChange
    } catch (error) {
      console.error('Error enabling demo mode:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disableDemoMode = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error disabling demo mode:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut, demoMode, enableDemoMode, disableDemoMode, refreshAdminStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
