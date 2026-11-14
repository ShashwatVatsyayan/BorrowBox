import { isConfigured, supabase, getLocalDB, saveLocalDB } from '../lib/supabase';
import { DEFAULT_ALLOWED_DOMAINS } from '../utils/constants';

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
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error('Email address is required.');
    }

    // Backend domain verification - never trust frontend alone
    const domain = normalizedEmail.split('@')[1];
    const isDomainAllowed = DEFAULT_ALLOWED_DOMAINS.some(
      (d) => domain === d.toLowerCase() || domain?.endsWith(`.${d.toLowerCase()}`)
    );
    if (!isDomainAllowed) {
      throw new Error(`Only official university email addresses (@${DEFAULT_ALLOWED_DOMAINS[0]}) are permitted.`);
    }

    const autoUid = (university_uid || normalizedEmail.split('@')[0]).toUpperCase();

    if (isConfigured && supabase) {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name,
            university_uid: autoUid
          },
          emailRedirectTo: redirectUrl
        }
      });
      if (error) throw error;
      return data;
    }

    // Local deterministic mode (offline fallback & testing)
    const db = getLocalDB();
    const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
      email: normalizedEmail,
      full_name,
      university_uid: autoUid,
      role: 'student',
      is_verified: false,
      avatar_url: '',
      bio: '',
      created_at: new Date().toISOString()
    };

    db.users.push(newUser);
    saveLocalDB(db);

    // Save pending verification state in sessionStorage
    const pendingSession = {
      user: newUser,
      pending_verification: true
    };
    sessionStorage.setItem('borrowbox_pending_signup', JSON.stringify(pendingSession));

    return { user: newUser, session: null };
  },

  async resendConfirmationEmail(email) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error('Email address is required.');
    }

    if (isConfigured && supabase) {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: normalizedEmail,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      if (error) {
        // Respect rate limits and provide clear feedback
        if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
          throw new Error('Too many requests. Please wait a moment before requesting another confirmation email.');
        }
        throw error;
      }
      return data;
    }

    return { message: 'Confirmation link dispatched to your university email.' };
  },

  // Backward compatibility alias for legacy components
  async resendOtp(email) {
    return await this.resendConfirmationEmail(email);
  },

  async handleAuthCallback() {
    if (isConfigured && supabase) {
      if (typeof window === 'undefined') return { session: null, error: null };

      // 1. Check for PKCE 'code' query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        return data;
      }

      // 2. Check for hash errors (e.g. #error=access_denied&error_description=...)
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashError = hashParams.get('error_description') || hashParams.get('error');
        if (hashError) {
          throw new Error(hashError.replace(/\+/g, ' '));
        }
      }

      // 3. Fallback to active session check
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    }

    // Local deterministic mode callback handler
    const db = getLocalDB();
    const pending = sessionStorage.getItem('borrowbox_pending_signup');
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        const user = db.users.find((u) => u.id === parsed.user?.id);
        if (user) {
          user.is_verified = true;
          saveLocalDB(db);
          const session = {
            user,
            access_token: 'local-verified-token-' + Date.now()
          };
          localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(session));
          sessionStorage.removeItem('borrowbox_pending_signup');
          return { user, session };
        }
      } catch {
        // Ignored
      }
    }

    // If already logged in locally
    const currentSession = await this.getSession();
    if (currentSession?.user) {
      return currentSession;
    }

    return { user: null, session: null };
  },

  async signInWithPassword({ email, password }) {
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (error) {
        if (
          error.message?.toLowerCase().includes('email not confirmed') ||
          error.code === 'email_not_confirmed'
        ) {
          const customErr = new Error('Your university email has not been confirmed yet. Please verify via the link sent to your Outlook inbox.');
          customErr.code = 'email_not_confirmed';
          customErr.email = normalizedEmail;
          throw customErr;
        }
        throw error;
      }

      // Authoritative verification check on user object
      if (data?.user && !data.user.email_confirmed_at && !data.user.confirmed_at) {
        // Prevent unverified sessions from bypassing verification
        await supabase.auth.signOut().catch(() => {});
        const customErr = new Error('Your university email has not been confirmed yet. Please check your Outlook inbox.');
        customErr.code = 'email_not_confirmed';
        customErr.email = normalizedEmail;
        throw customErr;
      }

      return data;
    }

    // Local deterministic mode
    const db = getLocalDB();
    let user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      // Support demo aliases and UID matches
      if (normalizedEmail === 'aarav.sharma@cuchd.in' || normalizedEmail === '23bcs12850@cuchd.in' || normalizedEmail === '23bcs12850') {
        user = db.users.find((u) => u.id === '11111111-1111-1111-1111-111111111111');
      } else if (normalizedEmail === 'priya.verma@cuchd.in' || normalizedEmail === '24bcs12850@cuchd.in' || normalizedEmail === '24bcs12850') {
        user = db.users.find((u) => u.id === '22222222-2222-2222-2222-222222222222');
      }
    }
    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    if (user.is_verified === false) {
      const customErr = new Error('Your university email has not been confirmed yet. Please verify your email before logging in.');
      customErr.code = 'email_not_confirmed';
      customErr.email = normalizedEmail;
      throw customErr;
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
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (isConfigured && supabase) {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/reset-password`
        : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: redirectUrl
      });
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
