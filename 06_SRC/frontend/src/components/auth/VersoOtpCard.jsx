import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Key, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthTunnelTransition } from '../common/AuthTunnelTransition';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import './VersoOtpCard.css';

const HEX_RADIUS = 64;
const HEX_ANGLES = [0, 60, 120, 180, 240, 300];

export const VersoOtpCard = ({ targetEmail = 'student@cuchd.in' }) => {
  const { verifyOtp, resendOtp, user } = useAuth();
  const navigate = useNavigate();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [stageState, setStageState] = useState('input'); // 'input' | 'orbiting' | 'collapsing' | 'verified'
  const [error, setError] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [resendActive, setResendActive] = useState(false);

  // Transition Tunnel Overlay
  const [transitioning, setTransitioning] = useState(false);

  const inputRefs = useRef([]);
  const stageRef = useRef(null);
  const scrambleIntervalRef = useRef(null);
  const countdownTimerRef = useRef(null);

  // Auto-detect when student clicks the Supabase confirmation link in their email
  useEffect(() => {
    if (user && user.email?.toLowerCase() === targetEmail.toLowerCase() && stageState !== 'verified' && !isVerifying) {
      executeKineticVerification('LINK');
    }
  }, [user, targetEmail, stageState, isVerifying]);

  // Calculate row offsets and hexagon geometry
  useEffect(() => {
    const updateGeometry = () => {
      const isMobile = window.innerWidth < 768;
      const boxWidth = isMobile ? 44 : 48;
      const gap = isMobile ? 8 : 10;
      const step = boxWidth + gap;

      inputRefs.current.forEach((el, index) => {
        if (!el) return;
        const rowX = (index - 2.5) * step;
        el.style.setProperty('--row-x', `${rowX}px`);

        const rad = (HEX_ANGLES[index] * Math.PI) / 180;
        const hexX = Math.round(HEX_RADIUS * Math.cos(rad));
        const hexY = Math.round(HEX_RADIUS * Math.sin(rad));
        el.style.setProperty('--hex-x', `${hexX}px`);
        el.style.setProperty('--hex-y', `${hexY}px`);

        if (stageState === 'input') {
          el.style.transform = `translate(${rowX}px, 0)`;
        }
      });
    };

    updateGeometry();
    window.addEventListener('resize', updateGeometry);
    return () => window.removeEventListener('resize', updateGeometry);
  }, [stageState]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Resend Countdown Timer
  useEffect(() => {
    countdownTimerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          setResendActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
    };
  }, []);

  const handleResend = async () => {
    setSecondsLeft(45);
    setResendActive(false);
    setError(null);
    setInfoMsg('Sending new verification email...');

    try {
      if (resendOtp) {
        await resendOtp(targetEmail);
      }
      setInfoMsg('New verification email dispatched! Check your inbox or spam folder.');
    } catch (err) {
      setError(err.message || 'Failed to resend verification email.');
    }

    countdownTimerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          setResendActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Handle Single Digit Entry & Auto-Advance
   */
  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    const newChar = cleaned ? cleaned[cleaned.length - 1] : '';

    const nextDigits = [...digits];
    nextDigits[index] = newChar;
    setDigits(nextDigits);

    if (newChar && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    if (nextDigits.every((d) => d !== '')) {
      executeKineticVerification(nextDigits.join(''));
    }
  };

  /**
   * Handle Backspace & Arrow Navigation
   */
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0 && inputRefs.current[index - 1]) {
        const nextDigits = [...digits];
        nextDigits[index - 1] = '';
        setDigits(nextDigits);
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  /**
   * Handle 6-Digit Clipboard Paste
   */
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const cleaned = pasted.replace(/\D/g, '').slice(0, 6);
    if (!cleaned) return;

    const nextDigits = [...digits];
    cleaned.split('').forEach((char, idx) => {
      if (idx < 6) nextDigits[idx] = char;
    });
    setDigits(nextDigits);

    const nextFocus = Math.min(cleaned.length, 5);
    if (inputRefs.current[nextFocus]) {
      inputRefs.current[nextFocus].focus();
    }

    if (nextDigits.every((d) => d !== '')) {
      executeKineticVerification(nextDigits.join(''));
    }
  };

  /**
   * Kinetic 4-Stage Verification Sequence
   */
  const executeKineticVerification = async (code) => {
    if (isVerifying) return;
    setIsVerifying(true);
    setError(null);
    setInfoMsg(null);

    // Stage 2A: Animate boxes from row into 6-point Hexagon Ring
    inputRefs.current.forEach((el) => {
      if (!el) return;
      const hexX = el.style.getPropertyValue('--hex-x');
      const hexY = el.style.getPropertyValue('--hex-y');
      el.style.transform = `translate(${hexX}, ${hexY})`;
      el.blur();
    });

    // Stage 2B: Rotate parent stage 360deg & scramble digits every 85ms
    setTimeout(() => {
      setStageState('orbiting');

      scrambleIntervalRef.current = setInterval(() => {
        setDigits(Array.from({ length: 6 }, () => String(Math.floor(Math.random() * 10))));
      }, 85);
    }, 400);

    // Call verifyOtp concurrently
    try {
      if (code !== 'LINK') {
        await verifyOtp(targetEmail, code);
      }
    } catch (err) {
      if (code !== '123456') {
        if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
        setIsVerifying(false);
        setStageState('input');

        const isMobile = window.innerWidth < 768;
        const boxWidth = isMobile ? 44 : 48;
        const gap = isMobile ? 8 : 10;
        const step = boxWidth + gap;
        inputRefs.current.forEach((el, index) => {
          if (!el) return;
          const rowX = (index - 2.5) * step;
          el.style.transform = `translate(${rowX}px, 0)`;
        });

        setError(err.message || 'Verification failed. Please check your code or click the confirmation link in your email.');
        return;
      }
    }

    // Stage 3: Magnetic Collapse & Expanding Pulse Shockwave (t = 1800ms)
    setTimeout(() => {
      if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
      setStageState('collapsing');
    }, 1800);

    // Stage 4: Verified Badge Morph & Checkmark (t = 2300ms)
    setTimeout(() => {
      setStageState('verified');

      // After celebrating checkmark, navigate into campus workspace
      setTimeout(() => {
        setTransitioning(true);
      }, 1200);
    }, 2300);
  };

  return (
    <div className="verso-otp-page">
      {/* LightTunnel Warp Transition Overlay into Campus Hub */}
      <AuthTunnelTransition
        isActive={transitioning}
        title="Access Granted"
        subtitle={`Authenticated as ${targetEmail}. Launching campus dashboard...`}
        duration={1500}
        onComplete={() => navigate('/app')}
      />

      {/* Header Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 px-2 z-20">
        <Logo size="md" to="/" />
        <ThemeToggle size="sm" />
      </header>

      {/* Main OTP Verification Card */}
      <div className="verso-otp-wrapper my-auto">
        <div className="verso-otp-ambient-glow" aria-hidden="true" />

        <main className="verso-otp-card" role="region" aria-label="Two-Factor Verification Portal">
          {/* Emerald Skewed Blade (Left on Desktop, Top on Mobile) */}
          <aside className="verso-otp-band" aria-label="Security Status">
            <div className="verso-otp-band-inner">
              <div
                className={`verso-otp-badge-icon ${stageState === 'verified' ? 'verified' : ''}`}
                aria-hidden="true"
              >
                {stageState === 'verified' ? (
                  <Check size={24} />
                ) : (
                  <Key size={22} />
                )}
              </div>

              <h2 className="verso-otp-band-title">
                {stageState === 'verified' ? 'Identity Verified' : 'Two-Factor Security'}
              </h2>
              <p className="verso-otp-band-desc">
                {stageState === 'verified'
                  ? 'Two-factor cryptographic challenge solved. University student access unlocked.'
                  : 'Enter the 6-digit cryptographic verification key dispatched to your university mailbox.'}
              </p>
            </div>
          </aside>

          {/* Right Pane: Kinetic OTP Verification Stage */}
          <section className="verso-otp-pane" aria-live="polite">
            <header className="verso-otp-header">
              <span className="verso-otp-eyebrow">Identity Gate</span>
              <h1 className="verso-otp-title">
                {stageState === 'verified' ? 'Verified Successfully' : 'Verify Email'}
              </h1>
              <div className="verso-otp-subtitle">
                {stageState === 'verified' ? (
                  <span>Authenticated. Redirecting to your campus workspace...</span>
                ) : (
                  <>
                    <p className="text-xs text-ink-primary font-medium">
                      Verification sent to <span className="verso-otp-email">{targetEmail}</span>
                    </p>
                    <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">
                      Enter the 6-digit code, or click <strong>Confirm Email</strong> in the email from Supabase to activate immediately.
                    </p>
                  </>
                )}
              </div>
            </header>

            {infoMsg && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 text-center">
                {infoMsg}
              </div>
            )}

            {error && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-medium border border-red-200 dark:border-red-800 text-center">
                {error}
              </div>
            )}

            {/* Kinetic Hexagon Stage */}
            <div className="verso-stage-container">
              {/* Circular Jade Emerald Pulse Shockwave */}
              <div
                className={`verso-shockwave ${stageState === 'collapsing' || stageState === 'verified' ? 'is-trigger' : ''}`}
              />

              {/* Central Verified Badge with Animated SVG Checkmark */}
              <div
                className={`verso-verified-badge ${stageState === 'verified' ? 'is-visible' : ''}`}
                aria-label="Verified Successfully"
              >
                <svg className="verso-check-svg" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              {/* Rotating Stage Hosting the 6 Input Boxes */}
              <div
                ref={stageRef}
                className={`verso-stage ${stageState === 'orbiting' ? 'is-orbiting' : ''} ${stageState === 'collapsing' ? 'is-collapsing' : ''}`}
              >
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="verso-box"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    disabled={isVerifying}
                    style={{
                      display: stageState === 'verified' ? 'none' : 'flex'
                    }}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    aria-label={`OTP Digit ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              disabled={isVerifying}
              onClick={() => executeKineticVerification(digits.join(''))}
              className={`verso-btn-verify ${isVerifying && stageState !== 'verified' ? 'is-verifying' : ''} ${stageState === 'verified' ? 'is-verified' : ''}`}
            >
              {stageState === 'verified' ? (
                <span>Verified &amp; Secured</span>
              ) : isVerifying ? (
                <>
                  <div className="verso-spinner" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Verify Passcode</span>
              )}
            </button>

            {/* Footer Links & Resend Counter */}
            <div className="verso-otp-footer">
              <div>
                {!resendActive ? (
                  <span>
                    Resend email in <span className="verso-countdown-text">{secondsLeft}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="verso-resend-btn"
                  >
                    Resend Verification Email
                  </button>
                )}
              </div>
              <Link to="/signup" className="verso-change-link">
                Change Email
              </Link>
            </div>

            <div className="mt-3 text-center text-[11px] text-ink-muted select-none">
              Campus demo bypass code: <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">123456</span>
            </div>
          </section>
        </main>
      </div>

      {/* Footer Meta */}
      <footer className="max-w-md w-full mx-auto py-3 text-center text-xs text-neutral-500 z-20">
        <div className="flex items-center justify-center gap-4">
          <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
          <span>•</span>
          <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
        </div>
      </footer>
    </div>
  );
};

export default VersoOtpCard;

