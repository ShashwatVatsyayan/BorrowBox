import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { isConfigured, supabase } from '../lib/supabase';
import { enrichUserData } from '../utils/userEnricher';

export const AuthContext = createContext(null);
export { enrichUserData };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    setLoading(true);
    try {
      const currentSession = await authService.getSession();
      if (currentSession?.user) {
        const enriched = enrichUserData(currentSession.user);
        setSession(currentSession);
        setUser(enriched);

        // Async profile sync from profile table (if configured)
        if (isConfigured && supabase && currentSession.user.id) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single()
            .then(({ data: prof, error }) => {
              if (!error && prof) {
                setUser((prev) => (prev ? {
                  ...prev,
                  full_name: prof.full_name || prev.full_name,
                  university_uid: prof.university_uid || prev.university_uid,
                  avatar_url: prof.avatar_url || prev.avatar_url,
                  bio: prof.bio || prev.bio,
                  department: prof.department || prev.department,
                  hostel_room: prof.hostel_room || prev.hostel_room
                } : prev));
              }
            })
            .catch(() => {});
        }
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();

    let subscription = null;
    if (isConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (newSession?.user) {
          const enriched = enrichUserData(newSession.user);
          setSession(newSession);
          setUser(enriched);
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
    const enriched = enrichUserData(data.user);
    setSession(data.session);
    setUser(enriched);
    return data;
  };

  const signup = async (payload) => {
    return await authService.signUp(payload);
  };

  const resendConfirmationEmail = async (email) => {
    return await authService.resendConfirmationEmail(email);
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
  };

  const updateUserData = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updatedFields };

      if (typeof localStorage !== 'undefined') {
        const sessionStr = localStorage.getItem('borrowbox_auth_session');
        if (sessionStr) {
          try {
            const sess = JSON.parse(sessionStr);
            sess.user = { ...sess.user, ...updatedFields };
            localStorage.setItem('borrowbox_auth_session', JSON.stringify(sess));
          } catch {}
        }

        try {
          const dbStr = localStorage.getItem('borrowbox_prod_v1');
          if (dbStr) {
            const db = JSON.parse(dbStr);
            const uIdx = (db.users || []).findIndex((u) => u.id === next.id || u.email === next.email);
            if (uIdx !== -1) {
              Object.assign(db.users[uIdx], updatedFields);
              localStorage.setItem('borrowbox_prod_v1', JSON.stringify(db));
            }
          }
        } catch {}
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
        logout,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
