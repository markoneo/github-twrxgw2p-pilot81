import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setCurrentUser(session?.user ?? null);
      } catch (err) {
        console.error('Error checking session:', err);
        
        // Handle specific refresh token errors by clearing all auth data
        if (err instanceof Error && err.message.includes('Refresh Token Not Found')) {
          console.log('Clearing corrupted auth session data...');
          // Clear all Supabase auth data from localStorage
          for (const key of Object.keys(localStorage)) {
            if (key.startsWith('supabase.auth.')) {
              localStorage.removeItem(key);
            }
          }
          // Also clear the main auth token key
          localStorage.removeItem('sb:token');
        } else {
          // Clear any potentially corrupted session data
          localStorage.removeItem('supabase.auth.token');
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setCurrentUser(session?.user ?? null);
      if (event === 'SIGNED_IN') {
        console.log("User signed in, refreshing page data");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signup(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      // First, clear current user state to update UI immediately
      setCurrentUser(null);
      
      // Then perform the actual signout
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear localStorage auth data to ensure clean logout
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
        }
      }
      
      // Force redirect to home page to ensure a clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}