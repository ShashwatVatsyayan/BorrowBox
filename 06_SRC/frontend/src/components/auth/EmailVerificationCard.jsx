import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  ExternalLink,
  RefreshCw,
  ArrowLeft,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Inbox
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import './EmailVerificationCard.css';

export const EmailVerificationCard = ({ targetEmail = 'student@cuchd.in' }) => {
  const { resendConfirmationEmail, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const timerRef = useRef(null);

  // Background reactive listener and polling for session confirmation
  useEffect(() => {
    let pollTimer = null;

    const checkStatus = async () => {
      try {
        const session = await authService.getSession();
        const activeUser = session?.user || user;
        if (activeUser && (activeUser.email_confirmed_at || activeUser.confirmed_at || activeUser.is_verified)) {
          navigate('/auth/callback', { replace: true });
        }
      } catch {
        // Non-blocking background poll
      }
    };

    checkStatus();
    pollTimer = setInterval(checkStatus, 3000);

    return () => {
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [user, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleResend = async () => {
    if (!canResend || loading) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await resendConfirmationEmail(targetEmail);
      setSuccessMsg('A new confirmation email has been sent. Please check your Outlook inbox.');
      setCanResend(false);
      setCooldown(60);

      timerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      if (err.message?.toLowerCase().includes('rate limit') || err.resetInSeconds) {
        setErrorMsg('Rate limit reached. Please wait a moment before requesting another confirmation email.');
      } else {
        setErrorMsg(err.message || 'Failed to resend confirmation email. Please try again shortly.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOutlook = () => {
    window.open('https://outlook.office.com/mail/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="email-verify-page">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-3 px-4 z-20">
        <Logo size="md" to="/" />
        <ThemeToggle size="sm" />
      </header>

      {/* Main Two-Column Authentication Card */}
      <div className="email-verify-wrapper my-auto">
        <div className="email-verify-glow" aria-hidden="true" />

        <main className="email-verify-card" role="region" aria-label="Email Verification Portal">
          {/* =========================================================================
              LEFT PANEL: Deep Forest Green Brand Identity
              ========================================================================= */}
          <aside className="email-verify-blade" aria-label="Verification Status">
            <div className="email-verify-blade-inner">
              <div className="email-verify-blade-brand">
                <img
                  src="/logo-dark.svg"
                  alt="BorrowBox"
                  className="h-9 w-auto max-w-[180px] object-contain drop-shadow"
                  draggable={false}
                />
              </div>

              <div className="email-verify-blade-icon-wrap">
                <Shield size={32} className="text-teal-400" />
              </div>

              <h2 className="email-verify-blade-title">One Last Step</h2>
              <p className="email-verify-blade-desc">
                Verify your university email to activate your BorrowBox account.
              </p>

              <div className="email-verify-domain-tag">
                <span className="domain-dot" />
                <span>Authorized Domain: @cuchd.in</span>
              </div>
            </div>
          </aside>

          {/* =========================================================================
              RIGHT PANEL: Outlook Confirmation Instructions & Actions
              ========================================================================= */}
          <section className="email-verify-pane" aria-live="polite">
            <header className="email-verify-header">
              <div className="email-verify-icon-wrapper">
                <Mail size={24} className="text-[#0D9488]" />
              </div>
              <span className="email-verify-eyebrow">ACCOUNT ACTIVATION</span>
              <h1 className="email-verify-title">Check your Outlook</h1>
              <p className="email-verify-desc">
                We've sent a confirmation link to your Chandigarh University email address. Open Outlook and confirm your email to activate your account.
              </p>
            </header>

            {/* Registered Email Prominent Address Box */}
            <div className="email-verify-address-box">
              <Inbox size={16} className="text-[#64748B] flex-shrink-0" />
              <span className="email-verify-address-text" title={targetEmail}>
                {targetEmail}
              </span>
            </div>

            {/* Subtle Waiting State Indicator (Non-aggressive) */}
            <div className="email-verify-waiting-badge">
              <span className="waiting-pulse-dot" />
              <span className="waiting-text">Waiting for email confirmation...</span>
            </div>

            {/* Status Feedback Messages */}
            {successMsg && (
              <div className="email-verify-alert is-success" role="alert">
                <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="email-verify-alert is-error" role="alert">
                <AlertCircle size={16} className="flex-shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Primary Action Button: Open Outlook */}
            <div className="email-verify-action-block">
              <button
                type="button"
                onClick={handleOpenOutlook}
                className="email-verify-btn-primary"
              >
                <span>Open Outlook</span>
                <ExternalLink size={16} />
              </button>

              <p className="email-verify-instruction">
                Open the email from BorrowBox and click <strong>Confirm your email</strong>.
              </p>
            </div>

            {/* Secondary Controls: Resend, Change Email, Back to Sign In */}
            <div className="email-verify-controls">
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || loading}
                className="email-verify-btn-resend"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                <span>
                  {loading
                    ? 'Resending...'
                    : canResend
                    ? 'Resend confirmation email'
                    : `Resend available in ${cooldown}s`}
                </span>
              </button>

              <div className="email-verify-links-row">
                <Link to="/signup" className="email-verify-link">
                  Change email address
                </Link>
                <span className="link-divider">•</span>
                <Link to="/login" className="email-verify-link">
                  Back to Sign In
                </Link>
              </div>
            </div>

            {/* Expandable Help Accordion */}
            <div className="email-verify-help-section">
              <button
                type="button"
                onClick={() => setShowHelp((prev) => !prev)}
                className="email-verify-help-toggle"
                aria-expanded={showHelp}
              >
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={14} />
                  <span>Didn't receive the email?</span>
                </div>
                {showHelp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showHelp && (
                <div className="email-verify-help-content">
                  <ul className="email-verify-help-list">
                    <li>
                      <strong>Check Junk or Spam:</strong> Institutional Outlook mail filters may occasionally route automated verification emails into your Junk Email folder.
                    </li>
                    <li>
                      <strong>Check the 'Other' Tab:</strong> In Outlook Web, toggle between the Focused and Other tab at the top of your inbox.
                    </li>
                    <li>
                      <strong>Check Address Spelling:</strong> Verify that your entered student email ({targetEmail}) has no typos. Use the "Change email address" link above if needed.
                    </li>
                    <li>
                      <strong>Campus Network Latency:</strong> University mail relays can take 1-2 minutes during peak hours to process external security links.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Back Link */}
            <footer className="email-verify-footer">
              <Link to="/login" className="email-verify-back-btn">
                <ArrowLeft size={14} />
                <span>Back to Sign In</span>
              </Link>
            </footer>
          </section>
        </main>
      </div>

      {/* Page Footer */}
      <footer className="max-w-md w-full mx-auto py-3 text-center text-xs text-[#64748B] z-20">
        <div className="flex items-center justify-center gap-4">
          <Link to="/terms" className="hover:text-[#0D9488] transition-colors">Terms</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-[#0D9488] transition-colors">Privacy</Link>
          <span>•</span>
          <Link to="/" className="hover:text-[#0D9488] transition-colors">Home</Link>
        </div>
      </footer>
    </div>
  );
};

export default EmailVerificationCard;
