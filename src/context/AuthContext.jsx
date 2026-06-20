import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const isConfigured = import.meta.env.VITE_SUPABASE_URL && 
                         import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (!isConfigured) {
      // Demo mode — no Supabase configured
      setDemoMode(true);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName) => {
    if (demoMode) {
      // Demo mode signup
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email,
        user_metadata: { full_name: fullName },
      };
      setUser(demoUser);
      return { data: { user: demoUser }, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    if (demoMode) {
      // Demo mode login
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email,
        user_metadata: { full_name: email.split('@')[0] },
      };
      setUser(demoUser);
      return { data: { user: demoUser }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    if (demoMode) {
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email) => {
    if (demoMode) {
      return { data: {}, error: null };
    }
    return await supabase.auth.resetPasswordForEmail(email);
  };

  const value = {
    user,
    loading,
    demoMode,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
