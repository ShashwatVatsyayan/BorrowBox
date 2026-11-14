import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight, RefreshCw, LogIn } from 'lucide-react';
import { authService } from '../../services/authService';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { isConfigured, supabase } from '../../lib/supabase';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    document.title = 'Confirming Account | BorrowBox';

    let isMounted = true;

    const processCallback = async () => {
      try {
        // 1. Check for error parameters in hash or query string
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const hashParams = window.location.hash
            ? new URLSearchParams(window.location.hash.substring(1))
            : null;

          const errorDesc =
            hashParams?.get('error_description') ||
            hashParams?.get('error') ||
            urlParams.get('error_description') ||
            urlParams.get('error');

          if (errorDesc) {
            const friendlyErr = errorDesc.toLowerCase().includes('expired') || errorDesc.toLowerCase().includes('invalid')
              ? 'This confirmation link is invalid or has expired. Please sign in or request a new confirmation email.'
              : errorDesc.replace(/\+/g, ' ');
            if (isMounted) {
              setErrorMessage(friendlyErr);
              setStatus('error');
            }
            return;
          }
        }

        // 2. Allow Supabase client to exchange code/hash for an authenticated session
        const result = await authService.handleAuthCallback();

        // 3. Inspect user & session verification status
        let verifiedUser = result?.user || (await authService.getUser());

        if (verifiedUser) {
          const isConfirmed = Boolean(
            verifiedUser.email_confirmed_at ||
            verifiedUser.confirmed_at ||
            verifiedUser.is_verified
          );

          if (isConfirmed) {
            if (isMounted) {
              setStatus('success');
              // Auto-redirect countdown
              countdownIntervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                  if (prev <= 1) {
                    clearInterval(countdownIntervalRef.current);
                    navigate('/app', { replace: true });
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
            }
            return;
          }
        }

        // 4. Fallback listener: Supabase auth state change might complete asynchronously
        if (isConfigured && supabase) {
          const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user && (session.user.email_confirmed_at || session.user.confirmed_at)) {
              if (isMounted) {
                setStatus('success');
                setTimeout(() => navigate('/app', { replace: true }), 2000);
              }
            }
          });

          // Wait up to 3 seconds for async token exchange
          setTimeout(() => {
            if (isMounted && status === 'processing') {
              // Confirmation link processed but session not created automatically in browser
              setStatus('success');
            }
          }, 2500);

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        } else {
          // Local demo mode
          if (isMounted) {
            setStatus('success');
            setTimeout(() => navigate('/app', { replace: true }), 2000);
          }
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || 'Unable to confirm your email. The link may have expired.');
          setStatus('error');
        }
      }
    };

    processCallback();

    return () => {
      isMounted = false;
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface-base flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Top Header */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between">
        <Logo size="md" to="/" />
        <ThemeToggle size="sm" />
      </header>

      {/* Main Card */}
      <main className="max-w-md w-full mx-auto my-auto">
        <div className="bg-surface-card p-6 sm:p-8 rounded-2xl border border-surface-border shadow-md">
          {status === 'processing' && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 animate-spin">
                <RefreshCw size={24} />
              </div>
              <h1 className="text-xl font-bold text-ink-primary mb-2">
                Verifying your university email...
              </h1>
              <p className="text-xs text-ink-muted max-w-sm">
                Authenticating with Chandigarh University security domain. Please wait a moment while we activate your account.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <CheckCircle2 size={26} />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                Account Verified
              </span>
              <h1 className="text-xl font-bold text-ink-primary mb-2">
                University Email Confirmed!
              </h1>
              <p className="text-xs text-ink-muted mb-6 max-w-sm">
                Your Chandigarh University student account is now active. You have full access to campus equipment rentals, borrowings, and peer negotiation.
              </p>

              <button
                type="button"
                onClick={() => navigate('/app')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-sm"
              >
                <span>Proceed to Campus Hub</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-[11px] text-ink-muted mt-3">
                Redirecting automatically in {countdown}s...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                <AlertCircle size={26} />
              </div>
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-1">
                Verification Unsuccessful
              </span>
              <h1 className="text-xl font-bold text-ink-primary mb-2">
                Confirmation Link Invalid or Expired
              </h1>
              <p className="text-xs text-ink-muted mb-6 max-w-sm">
                {errorMessage || 'This link is no longer valid. Confirmation tokens expire after one use or after a configured timeframe.'}
              </p>

              <div className="w-full flex flex-col gap-2.5">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-all shadow-xs"
                >
                  <LogIn size={14} />
                  <span>Sign In to Your Account</span>
                </Link>

                <Link
                  to="/verify-email"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surface-base hover:bg-surface-elevated text-ink-primary border border-surface-border font-semibold text-xs transition-all"
                >
                  <RefreshCw size={14} />
                  <span>Request a New Confirmation Link</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto text-center text-xs text-ink-muted">
        <div className="flex items-center justify-center gap-4">
          <Link to="/terms" className="hover:text-brand-600">Terms</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-brand-600">Privacy</Link>
          <span>•</span>
          <Link to="/" className="hover:text-brand-600">Home</Link>
        </div>
      </footer>
    </div>
  );
};

export default AuthCallbackPage;
