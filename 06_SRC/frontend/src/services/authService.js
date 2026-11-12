import { isConfigured, supabase, getLocalDB, saveLocalDB } from '../lib/supabase';

const CURRENT_USER_SESSION_KEY = 'borrowbox_auth_session';

export const authService = {
  async getSession() {
    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    }
    const sessionStr = localStorage.getItem(CURRENT_USER_SESSION_KEY);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  },

  async getUser() {
    const session = await this.getSession();
    return session?.user || null;
  },

  async signUp({ email, password, full_name, university_uid }) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            university_uid
          }
        }
      });
      if (error) throw error;
      return data;
    }

    // Local deterministic mode
    const db = getLocalDB();
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
      email,
      full_name,
      university_uid: university_uid || null,
      role: 'student',
      is_verified: false,
      bio: '',
      created_at: new Date().toISOString()
    };

    db.users.push(newUser);
    saveLocalDB(db);

    // Save pending verification session
    const pendingSession = {
      user: newUser,
      pending_verification: true,
      otp: '123456' // Deterministic mock OTP
    };
    sessionStorage.setItem('borrowbox_pending_signup', JSON.stringify(pendingSession));

    return { user: newUser, session: null };
  },

  async verifyOtp({ email, token }) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      });
      if (error) throw error;
      return data;
    }

    // Local deterministic mode
    const pending = sessionStorage.getItem('borrowbox_pending_signup');
    if (pending) {
      const parsed = JSON.parse(pending);
      if (parsed.user.email.toLowerCase() === email.toLowerCase()) {
        if (token.trim() !== '123456' && token.trim().length !== 6) {
          throw new Error('Invalid verification code. Please enter the 6-digit code (use 123456 for demo).');
        }
        const db = getLocalDB();
        const user = db.users.find((u) => u.id === parsed.user.id);
        if (user) {
          user.is_verified = true;
          saveLocalDB(db);
        }
        const session = {
          user: user || parsed.user,
          access_token: 'local-token-' + Date.now()
        };
        localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(session));
        sessionStorage.removeItem('borrowbox_pending_signup');
        return { user: session.user, session };
      }
    }

    throw new Error('Verification session expired or email not found. Please sign up again.');
  },

  async signInWithPassword({ email, password }) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    }

    // Local deterministic mode
    const db = getLocalDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const session = {
      user,
      access_token: 'local-token-' + Date.now()
    };
    localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(session));
    return { user, session };
  },

  async signOut() {
    if (isConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    localStorage.removeItem(CURRENT_USER_SESSION_KEY);
    return true;
  },

  async resetPasswordForEmail(email) {
    if (isConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return true;
    }
    return true;
  },

  // Helper for quick demonstration switching between Student A, Student B, and Admin
  async switchDemoAccount(roleOrEmail) {
    const db = getLocalDB();
    let target = null;
    if (roleOrEmail === 'Student A' || roleOrEmail === 'owner') {
      target = db.users.find((u) => u.id === '11111111-1111-1111-1111-111111111111');
    } else if (roleOrEmail === 'Student B' || roleOrEmail === 'borrower') {
      target = db.users.find((u) => u.id === '22222222-2222-2222-2222-222222222222');
    } else if (roleOrEmail === 'Admin') {
      target = db.users.find((u) => u.role === 'admin');
    } else {
      target = db.users.find((u) => u.email.toLowerCase() === roleOrEmail.toLowerCase());
    }

    if (!target) throw new Error('Target demo account not found.');

    const session = { user: target, access_token: 'local-token-' + Date.now() };
    localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(session));
    return session;
  }
};

