import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { isConfigured, supabase } from '../lib/supabase';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    setLoading(true);
    try {
      const currentSession = await authService.getSession();
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
      } else if (!isConfigured) {
        // By default in offline demo mode without Supabase, auto-sign in as Student A (Aarav)
        const defaultSession = await authService.switchDemoAccount('Student A');
        setSession(defaultSession);
        setUser(defaultSession.user);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();

    let subscription = null;
    if (isConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (newSession) {
          // If the user's email is confirmed, update state
          setSession(newSession);
          setUser(newSession.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      });
      subscription = data?.subscription;
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const data = await authService.signInWithPassword({ email, password });
    setSession(data.session);
    setUser(data.user);
    return data;
  };

  const signup = async (payload) => {
    return await authService.signUp(payload);
  };

  const resendConfirmationEmail = async (email) => {
    return await authService.resendConfirmationEmail(email);
  };

  // Legacy alias
  const resendOtp = async (email) => {
    return await authService.resendConfirmationEmail(email);
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
  };

  const switchAccount = async (target) => {
    setLoading(true);
    try {
      const newSession = await authService.switchDemoAccount(target);
      setSession(newSession);
      setUser(newSession.user);
      return newSession;
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updatedFields };
      const sessionStr = localStorage.getItem('borrowbox_auth_session');
      if (sessionStr) {
        try {
          const sess = JSON.parse(sessionStr);
          sess.user = { ...sess.user, ...updatedFields };
          localStorage.setItem('borrowbox_auth_session', JSON.stringify(sess));
        } catch {
          // Ignored
        }
      }
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        signup,
        resendConfirmationEmail,
        resendOtp,
        logout,
        switchAccount,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
