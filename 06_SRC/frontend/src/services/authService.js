import { isConfigured, supabase, getLocalDB, saveLocalDB } from '../lib/supabase';
import { DEFAULT_ALLOWED_DOMAINS } from '../utils/constants';
import { rateLimiter } from '../utils/rateLimiter';

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

    // Rate limiting: max 5 signup/auth attempts per minute
    rateLimiter.consume('auth', normalizedEmail);

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

    // Rate limiting: max 2 resends per minute
    rateLimiter.consume('resend', normalizedEmail);

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
        if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
          throw new Error('Too many requests. Please wait a moment before requesting another confirmation email.');
        }
        throw error;
      }
      return data;
    }

    return { message: 'Confirmation link dispatched to your university email.' };
  },

  async handleAuthCallback() {
    if (isConfigured && supabase) {
      if (typeof window === 'undefined') return { session: null, error: null };

      const urlParams = new URLSearchParams(window.location.search);

      // 1. Check for explicit error parameters in query string
      const queryError = urlParams.get('error_description') || urlParams.get('error');
      if (queryError) {
        throw new Error(queryError.replace(/\+/g, ' '));
      }

      // 2. Check for hash errors and tokens (e.g. #access_token=... or #error=access_denied)
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashError = hashParams.get('error_description') || hashParams.get('error');
        if (hashError) {
          throw new Error(hashError.replace(/\+/g, ' '));
        }

        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        if (accessToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          if (error) throw error;
          return data;
        }
      }

      // 3. Check for token_hash (used by Supabase Auth email confirmation links: {{ .ConfirmationURL }})
      const tokenHash = urlParams.get('token_hash');
      const otpType = urlParams.get('type') || 'signup';
      if (tokenHash) {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType
        });
        if (error) throw error;
        return data;
      }

      // 4. Check for PKCE 'code' query parameter
      const code = urlParams.get('code');
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        return data;
      }

      // 5. Fallback to active session check
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

    const currentSession = await this.getSession();
    if (currentSession?.user) {
      return currentSession;
    }

    return { user: null, session: null };
  },

  async signInWithPassword({ email, password }) {
    const normalizedEmail = (email || '').trim().toLowerCase();

    // 1. Special Authorized Admin Superuser Login: BorrowBoxAdmin@cuchd.in with Admin@321
    // Does not require email confirmation
    if (
      normalizedEmail === 'borrowboxadmin@cuchd.in' &&
      password === 'Admin@321'
    ) {
      const adminUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'BorrowBoxAdmin@cuchd.in',
        full_name: 'BorrowBox Administrator',
        university_uid: 'ADMIN-CU',
        role: 'admin',
        is_verified: true,
        email_confirmed_at: '2026-11-14T00:00:00.000Z'
      };
      const session = {
        user: adminUser,
        access_token: 'admin-superuser-token-' + Date.now()
      };
      localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(session));
      return { user: adminUser, session };
    }

    // Rate limiting: max 5 login attempts per minute per email
    rateLimiter.consume('auth', normalizedEmail);

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
      if (data?.user && !data.user.email_confirmed_at && !data.user.confirmed_at && data.user.role !== 'admin') {
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
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    if (user.is_verified === false && user.role !== 'admin') {
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
  }
};
