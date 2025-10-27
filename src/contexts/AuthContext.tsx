// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, authService } from '../services/supabase';
import { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    authService.getCurrentUser().then(setUser);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user profile with role
        const { data: profileData } = await supabase
          .from('profiles')
          .select(`
            *,
            user_roles(role)
          `)
          .eq('id', session.user.id)
          .single();
          
        if (profileData) {
          setProfile({
            ...profileData,
            role: profileData.user_roles[0].role
          });
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUpWrapper = async (email: string, password: string, userData: any) => {
    await authService.signUp(email, password, userData);
  };

  const signInWrapper = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signOutWrapper = async () => {
    await authService.signOut();
  };

  const value = {
    user,
    profile,
    loading,
    signUp: signUpWrapper,
    signIn: signInWrapper,
    signOut: signOutWrapper,
  };

  return (
    <AuthContext.Provider value={value}>
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