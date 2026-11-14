import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight, RefreshCw, LogIn, Sparkles } from 'lucide-react';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { isConfigured, supabase } from '../../lib/supabase';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [destination, setDestination] = useState('/app');
  const [destinationLabel, setDestinationLabel] = useState('Campus Hub');
  const [countdown, setCountdown] = useState(2);
  const isProcessedRef = useRef(false);

  useEffect(() => {
    document.title = 'Confirming Account | BorrowBox';

    let isMounted = true;

    const processCallback = async () => {
      if (isProcessedRef.current) return;
      isProcessedRef.current = true;

      try {
        // 1. Check for error parameters in query or hash
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
            const friendlyErr =
              errorDesc.toLowerCase().includes('expired') || errorDesc.toLowerCase().includes('invalid')
                ? 'This confirmation link is invalid or has expired. Please sign in or request a new confirmation email.'
                : errorDesc.replace(/\+/g, ' ');
            if (isMounted) {
              setErrorMessage(friendlyErr);
              setStatus('error');
            }
            return;
          }
        }

        // 2. Execute authoritative token exchange / verification via Supabase API
        const result = await authService.handleAuthCallback();

        // 3. Retrieve verified user
        let verifiedUser = result?.user || (await authService.getUser());

        // Fallback polling for session establishment (up to 3 attempts)
        if (!verifiedUser && isConfigured && supabase) {
          for (let i = 0; i < 3; i++) {
            await new Promise((res) => setTimeout(res, 800));
            verifiedUser = await authService.getUser();
            if (verifiedUser) break;
          }
        }

        if (verifiedUser) {
          const isConfirmed = Boolean(
            verifiedUser.email_confirmed_at ||
            verifiedUser.confirmed_at ||
            verifiedUser.is_verified
          );

          if (isConfirmed) {
            // 4. Restore pending registration data (full_name, etc.) if preserved in sessionStorage
            if (typeof window !== 'undefined') {
              try {
                const pendingRegStr = sessionStorage.getItem('borrowbox_pending_reg');
                if (pendingRegStr) {
                  const pending = JSON.parse(pendingRegStr);
                  if (pending.fullName && verifiedUser.id) {
                    await profileService.updateProfile(verifiedUser.id, {
                      full_name: pending.fullName,
                      university_uid: pending.universityUid || verifiedUser.email.split('@')[0].toUpperCase()
                    }).catch(() => {});
                  }
                  sessionStorage.removeItem('borrowbox_pending_reg');
                }
              } catch {
                // Ignore storage parsing issues
              }
            }

            // 5. Determine whether onboarding is incomplete
            let nextTarget = '/app';
            let label = 'Campus Hub';
            try {
              const profile = await profileService.getProfile(verifiedUser.id).catch(() => null);
              const isProfileIncomplete = !profile?.department || !profile?.hostel_room || !profile?.bio;
              if (isProfileIncomplete) {
                nextTarget = '/app/profile/edit?onboarding=true';
                label = 'Student Profile Setup';
              }
            } catch {
              nextTarget = '/app';
            }

            if (isMounted) {
              setDestination(nextTarget);
              setDestinationLabel(label);
              setStatus('success');

              // Auto-navigate countdown
              const timer = setInterval(() => {
                setCountdown((prev) => {
                  if (prev <= 1) {
                    clearInterval(timer);
                    navigate(nextTarget, { replace: true });
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
            }
            return;
          }
        }

        // 6. Local deterministic fallback (offline demo)
        if (!isConfigured) {
          if (isMounted) {
            setDestination('/app/profile/edit?onboarding=true');
            setDestinationLabel('Student Profile Setup');
            setStatus('success');
            setTimeout(() => navigate('/app/profile/edit?onboarding=true', { replace: true }), 1500);
          }
          return;
        }

        throw new Error('Verification token could not be validated. The link may have already been used.');
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
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface-base flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Top Header */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between">
        <Logo size="md" to="/" />
        <ThemeToggle size="sm" />
      </header>

      {/* Main Authentication Confirmation Card */}
      <main className="max-w-md w-full mx-auto my-auto">
        <div className="bg-surface-card p-6 sm:p-8 rounded-2xl border border-surface-border shadow-md">
          {status === 'processing' && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-[#0D9488] mb-4">
                <RefreshCw size={24} className="animate-spin" />
              </div>
              <h1 className="text-xl font-bold text-ink-primary mb-2">
                Verifying your university email...
              </h1>
              <p className="text-xs text-ink-muted max-w-sm">
                Authenticating with Chandigarh University security domain. Please wait while we activate your student credentials.
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
                Your Chandigarh University student account is active. Continuing to {destinationLabel}...
              </p>

              <button
                type="button"
                onClick={() => navigate(destination, { replace: true })}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold text-sm transition-all shadow-sm"
              >
                <span>Continue to {destinationLabel}</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-[11px] text-ink-muted mt-3">
                Opening in {countdown}s...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
                <AlertCircle size={26} />
              </div>
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">
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
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold text-xs transition-all shadow-xs"
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
          <Link to="/terms" className="hover:text-[#0D9488]">Terms</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-[#0D9488]">Privacy</Link>
          <span>•</span>
          <Link to="/" className="hover:text-[#0D9488]">Home</Link>
        </div>
      </footer>
    </div>
  );
};

export default AuthCallbackPage;
