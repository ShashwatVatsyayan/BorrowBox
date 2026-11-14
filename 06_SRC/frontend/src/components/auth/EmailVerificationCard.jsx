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
  ShieldCheck,
  Inbox
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
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

  // If user becomes verified in session (e.g. from background onAuthStateChange), navigate to app
  useEffect(() => {
    if (user && (user.email_confirmed_at || user.confirmed_at || user.is_verified)) {
      navigate('/app', { replace: true });
    }
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
      setSuccessMsg('Confirmation link resent successfully. Please check your Outlook inbox.');
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
      setErrorMsg(err.message || 'Failed to resend confirmation email. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOutlook = () => {
    window.open('https://outlook.office.com/mail/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="email-verify-page">
      {/* Top Navigation */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 px-4 z-20">
        <Logo size="md" to="/" />
        <ThemeToggle size="sm" />
      </header>

      {/* Main Card Container */}
      <div className="email-verify-wrapper my-auto">
        <div className="email-verify-glow" aria-hidden="true" />

        <main className="email-verify-card" role="region" aria-label="Email Verification Portal">
          {/* Left Decorative Blade (Verso Brand Accent) */}
          <aside className="email-verify-blade" aria-label="Security Status">
            <div className="email-verify-blade-inner">
              <div className="email-verify-badge-icon">
                <ShieldCheck size={28} />
              </div>
              <h2 className="email-verify-blade-title">Identity Verification</h2>
              <p className="email-verify-blade-desc">
                Chandigarh University student domain protection ensures trusted, campus-exclusive equipment rentals.
              </p>
              <div className="email-verify-domain-tag">
                <span className="domain-dot" />
                <span>Authorized Domain: @cuchd.in</span>
              </div>
            </div>
          </aside>

          {/* Right Content Pane */}
          <section className="email-verify-pane" aria-live="polite">
            <header className="email-verify-header">
              <div className="email-verify-icon-wrapper">
                <Mail size={24} className="text-brand-600 dark:text-brand-400" />
              </div>
              <span className="email-verify-eyebrow">Account Activation</span>
              <h1 className="email-verify-title">Verify your university email</h1>
              <p className="email-verify-desc">
                We've sent a confirmation link to your Chandigarh University email address.
              </p>
            </header>

            {/* Email Address Pill Display */}
            <div className="email-verify-address-box">
              <Inbox size={16} className="text-ink-muted flex-shrink-0" />
              <span className="email-verify-address-text" title={targetEmail}>
                {targetEmail}
              </span>
            </div>

            {/* Status Messages */}
            {successMsg && (
              <div className="email-verify-alert is-success" role="alert">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="email-verify-alert is-error" role="alert">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Primary Action: Open Outlook */}
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
                Open the email from BorrowBox and click <strong>Confirm your email</strong> to activate your account.
              </p>
            </div>

            {/* Secondary Actions Row */}
            <div className="email-verify-controls">
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || loading}
                className="email-verify-btn-resend"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
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
                  Back to login
                </Link>
              </div>
            </div>

            {/* Help Section */}
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
                      <strong>Check Junk or Spam:</strong> Institutional mail servers occasionally route automated confirmations into the Junk Email folder.
                    </li>
                    <li>
                      <strong>Check the 'Other' Tab:</strong> In Outlook Web, toggle between the Focused and Other tab.
                    </li>
                    <li>
                      <strong>Verify Address Spelling:</strong> Ensure your registered email matches your exact student UID handle.
                    </li>
                    <li>
                      <strong>Delivery Latency:</strong> Campus email filters may take 1-2 minutes to deliver external verification tokens.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Back Link */}
            <footer className="email-verify-footer">
              <Link to="/login" className="email-verify-back-btn">
                <ArrowLeft size={14} />
                <span>Return to Sign In</span>
              </Link>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmailVerificationCard;

