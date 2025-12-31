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
}

// Demo user objects for testing without credentials
const DEMO_PATIENT_USER = {
  id: 'demo-patient-123',
  email: 'demo.patient@test.com',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: { full_name: 'Demo Patient', user_type: 'patient' },
} as User;

const DEMO_ADMIN_USER = {
  id: 'demo-admin-123',
  email: 'demo.admin@test.com',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: { full_name: 'Demo Admin', user_type: 'admin' },
} as User;

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
      // Restore demo mode session
      setDemoMode(true);
      if (storedDemoRole === 'admin') {
        setUser(DEMO_ADMIN_USER);
        setIsAdmin(true);
      } else {
        setUser(DEMO_PATIENT_USER);
        setIsAdmin(false);
      }
      setLoading(false);
      return;
    }

    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user ?? null);
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (demoMode) {
      // Demo mode logout
      setDemoMode(false);
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('demoMode');
      localStorage.removeItem('demoRole');
    } else {
      // Real logout
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAdmin(false);
    }
  };

  const enableDemoMode = (role: 'patient' | 'admin') => {
    setDemoMode(true);
    setLoading(false);
    
    if (role === 'admin') {
      setUser(DEMO_ADMIN_USER);
      setIsAdmin(true);
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoRole', 'admin');
    } else {
      setUser(DEMO_PATIENT_USER);
      setIsAdmin(false);
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoRole', 'patient');
    }
  };

  const disableDemoMode = () => {
    setDemoMode(false);
    setUser(null);
    setIsAdmin(false);
    setLoading(true);
    localStorage.removeItem('demoMode');
    localStorage.removeItem('demoRole');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut, demoMode, enableDemoMode, disableDemoMode }}>
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
