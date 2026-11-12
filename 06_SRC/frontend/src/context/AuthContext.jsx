import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

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
      } else {
        // By default, if nothing is selected in demo mode, auto-sign in as Student A (Aarav) so the app is instantly usable
        const defaultSession = await authService.switchDemoAccount('Student A');
        setSession(defaultSession);
        setUser(defaultSession.user);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
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

  const verifyOtp = async (email, token) => {
    const data = await authService.verifyOtp({ email, token });
    setSession(data.session);
    setUser(data.user);
    return data;
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        signup,
        verifyOtp,
        logout,
        switchAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

