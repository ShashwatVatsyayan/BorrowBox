import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Check, Sparkles, ExternalLink } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, getPasswordCriteria } from '../../utils/validators';
import { AuthTunnelTransition } from '../common/AuthTunnelTransition';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import './VersoAuthCard.css';

const BLADE_COPY = {
  signin: {
    tag: 'Campus Exchange',
    title: 'Start the first page.',
    desc: 'Join thousands of verified university peers sharing textbooks, lab equipment, calculators, and hostel gear.',
    btn: 'Create an account'
  },
  signup: {
    tag: 'Welcome Back',
    title: 'Welcome back.',
    desc: 'Access your campus listings, active borrowings, and peer barter proposals in one unified hub.',
    btn: 'Sign In'
  }
};

export const VersoAuthCard = ({ initialMode = 'signin', onModeChange }) => {
  const { login, signup, switchAccount } = useAuth();
  const navigate = useNavigate();

  // Mode state: 'signin' | 'signup'
  const [mode, setMode] = useState(initialMode);
  const [isSweeping, setIsSweeping] = useState(false);
  const isAnimatingRef = useRef(false);

  // Transition Warp Tunnel State
  const [transitioning, setTransitioning] = useState(false);
  const [transitionMeta, setTransitionMeta] = useState({
    title: 'Entering Campus Network...',
    subtitle: 'Connecting to Chandigarh University Student Hub',
    target: '/app'
  });

  // Sign-In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState(null);
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign-Up Form State
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [derivedUid, setDerivedUid] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpErrors, setSignUpErrors] = useState({});
  const [signUpGeneralError, setSignUpGeneralError] = useState(null);
  const [signUpLoading, setSignUpLoading] = useState(false);

  // Synchronize initialMode if prop changes
  useEffect(() => {
    if (initialMode && initialMode !== mode && !isAnimatingRef.current) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // Handle email changes to automatically compute student UID
  const handleSignUpEmailChange = (val) => {
    setSignUpData((prev) => ({ ...prev, email: val }));
    const trimmed = val.trim();
    if (trimmed.includes('@')) {
      setDerivedUid(trimmed.split('@')[0].toUpperCase());
    } else {
      setDerivedUid(trimmed.toUpperCase());
    }
    if (signUpErrors.email) {
      setSignUpErrors((prev) => ({ ...prev, email: null }));
    }
  };

  /**
   * Verso Skewed Blade Transition Engine
   * Total duration: 750ms, Midpoint swap: 350ms
   */
  const handleToggleMode = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const nextMode = mode === 'signin' ? 'signup' : 'signin';

    // Phase 1: Trigger blade expansion sweep across the card
    setIsSweeping(true);

    // Phase 2: Exact Midpoint (350ms) - forms swapped while 100% covered by dark blade
    setTimeout(() => {
      setMode(nextMode);
      if (typeof onModeChange === 'function') {
        onModeChange(nextMode);
      }
    }, 350);

    // Phase 3: Complete transition (750ms) - blade settles into destination resting half
    setTimeout(() => {
      setIsSweeping(false);
      isAnimatingRef.current = false;
    }, 750);
  };

  // Sign-In Form Submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSignInError(null);

    if (!signInEmail || !signInPassword) {
      setSignInError('Please provide both university email and password.');
      return;
    }

    const passCheck = validatePassword(signInPassword);
    if (!passCheck.valid) {
      setSignInError(passCheck.error);
      return;
    }

    setSignInLoading(true);
    try {
      await login(signInEmail, signInPassword);
      setTransitionMeta({
        title: 'Entering Campus Network...',
        subtitle: `Authenticated as ${signInEmail}. Welcome back to BorrowBox.`,
        target: '/app'
      });
      setTransitioning(true);
    } catch (err) {
      setSignInError(err.message || 'Invalid email or password.');
      setSignInLoading(false);
    }
  };

  // One-Click Evaluator Demo Profile
  const handleQuickDemo = async (roleName) => {
    setSignInLoading(true);
    setSignInError(null);
    try {
      await switchAccount(roleName);
      setTransitionMeta({
        title: `Welcome, ${roleName}!`,
        subtitle: 'Launching campus dashboard & inventory feed...',
        target: '/app'
      });
      setTransitioning(true);
    } catch (err) {
      setSignInError(err.message || 'Quick login failed.');
      setSignInLoading(false);
    }
  };

  // Sign-Up Form Submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSignUpGeneralError(null);
    const newErrors = {};

    if (!signUpData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    const emailCheck = validateEmail(signUpData.email);
    if (!emailCheck.valid) {
      newErrors.email = emailCheck.error;
    }

    const passCheck = validatePassword(signUpData.password);
    if (!passCheck.valid) {
      newErrors.password = passCheck.error;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!signUpData.agreeTerms) {
      newErrors.agreeTerms = 'You must acknowledge the terms to register.';
    }

    if (Object.keys(newErrors).length > 0) {
      setSignUpErrors(newErrors);
      return;
    }

    setSignUpLoading(true);
    try {
      const autoUid = signUpData.email.split('@')[0].toUpperCase();
      await signup({
        email: signUpData.email,
        password: signUpData.password,
        full_name: signUpData.fullName,
        university_uid: autoUid
      });
      setTransitionMeta({
        title: 'Welcome to BorrowBox!',
        subtitle: `Registered ${signUpData.fullName}. Preparing your campus verification...`,
        target: `/verify-email?email=${encodeURIComponent(signUpData.email)}`
      });
      setTransitioning(true);
    } catch (err) {
      setSignUpGeneralError(err.message || 'Registration failed. Please try again.');
      setSignUpLoading(false);
    }
  };

  const currentBladeCopy = BLADE_COPY[mode];
  const passwordCriteria = getPasswordCriteria(signUpData.password);

  return (
    <div className="verso-page-container">
      {/* LightTunnel Warp Transition Overlay */}
      <AuthTunnelTransition
        isActive={transitioning}
        title={transitionMeta.title}
        subtitle={transitionMeta.subtitle}
        duration={1500}
        onComplete={() => navigate(transitionMeta.target)}
      />

      {/* Top Header Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 px-2 z-20">
        <Logo size="md" to="/" />
        <ThemeToggle size="sm" />
      </header>

      {/* Main Verso Skewed Blade Authentication Card */}
      <div className="verso-card-wrapper my-auto">
        <div className="verso-ambient-glow" aria-hidden="true" />

        <div
          className={`verso-card is-${mode} ${isSweeping ? 'is-sweeping' : ''}`}
          role="region"
          aria-label="Student Authentication Portal"
        >
          {/* ================================================================
              Left Pane: Sign-In Form
              ================================================================ */}
          <section
            className="verso-pane verso-pane--signin"
            id="versoSignInPane"
            aria-label="Sign In"
            inert={mode !== 'signin' ? '' : undefined}
          >
            <div className="verso-pane-header">
              <span className="verso-pane-eyebrow">Campus Verification</span>
              <h1 className="verso-pane-title">Sign In</h1>
              <p className="verso-pane-subtitle">
                Access your equipment rentals, borrowings, and campus listings.
              </p>
            </div>

            {signInError && (
              <div className="mb-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {signInError}
              </div>
            )}

            <form onSubmit={handleSignInSubmit} className="flex flex-col">
              <div className="verso-input-group">
                <label className="verso-input-label" htmlFor="verso-signin-email">
                  University Email
                </label>
                <input
                  id="verso-signin-email"
                  type="email"
                  className="verso-input"
                  placeholder="e.g. aarav.sharma@cuchd.in"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="verso-input-group">
                <label className="verso-input-label" htmlFor="verso-signin-password">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="verso-signin-password"
                    type={showSignInPassword ? 'text' : 'password'}
                    className="verso-input pr-10"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-1 text-xs font-semibold text-neutral-500 hover:text-neutral-800 p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end my-1">
                <Link to="/forgot-password" className="text-xs font-semibold text-emerald-900 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={signInLoading || transitioning}
                className="verso-btn-submit"
              >
                <span>{signInLoading ? 'Authenticating...' : 'Log In to Campus'}</span>
              </button>

              {/* One-Click Demo Profiles for Evaluators */}
              <div className="verso-demo-presets">
                <p className="verso-demo-title">One-Click Demo Evaluator Profiles</p>
                <div className="verso-demo-grid">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('Student A')}
                    className="verso-demo-btn"
                  >
                    <p className="verso-demo-name">Student A (Owner)</p>
                    <p className="verso-demo-sub">Aarav (Calculator, Lab Coat)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('Student B')}
                    className="verso-demo-btn"
                  >
                    <p className="verso-demo-name">Student B (Borrower)</p>
                    <p className="verso-demo-sub">Priya (Requests & Rackets)</p>
                  </button>
                </div>
              </div>

              <p className="verso-mobile-switch">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="verso-mobile-switch-btn"
                >
                  Create account
                </button>
              </p>
            </form>
          </section>

          {/* ================================================================
              Right Pane: Sign-Up Form
              ================================================================ */}
          <section
            className="verso-pane verso-pane--signup"
            id="versoSignUpPane"
            aria-label="Create Account"
            inert={mode !== 'signup' ? '' : undefined}
          >
            <div className="verso-pane-header">
              <span className="verso-pane-eyebrow">Student Registration</span>
              <h2 className="verso-pane-title">Create Account</h2>
              <p className="verso-pane-subtitle">
                Join the peer network with your official university credentials.
              </p>
            </div>

            {signUpGeneralError && (
              <div className="mb-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {signUpGeneralError}
              </div>
            )}

            <form onSubmit={handleSignUpSubmit} className="flex flex-col">
              <div className="verso-input-group">
                <label className="verso-input-label" htmlFor="verso-signup-name">
                  Full Name
                </label>
                <input
                  id="verso-signup-name"
                  type="text"
                  className="verso-input"
                  placeholder="e.g. Aarav Sharma"
                  value={signUpData.fullName}
                  onChange={(e) => {
                    setSignUpData((prev) => ({ ...prev, fullName: e.target.value }));
                    if (signUpErrors.fullName) setSignUpErrors((p) => ({ ...p, fullName: null }));
                  }}
                  autoComplete="name"
                  required
                />
                {signUpErrors.fullName && (
                  <span className="text-[11px] text-red-600 mt-1 font-medium">{signUpErrors.fullName}</span>
                )}
              </div>

              <div className="verso-input-group">
                <label className="verso-input-label" htmlFor="verso-signup-email">
                  University Email
                </label>
                <input
                  id="verso-signup-email"
                  type="email"
                  className="verso-input"
                  placeholder="e.g. 23bcs12850@cuchd.in"
                  value={signUpData.email}
                  onChange={(e) => handleSignUpEmailChange(e.target.value)}
                  autoComplete="email"
                  required
                />
                {signUpErrors.email && (
                  <span className="text-[11px] text-red-600 mt-1 font-medium">{signUpErrors.email}</span>
                )}
              </div>

              <div className="verso-input-group">
                <label className="verso-input-label" htmlFor="verso-signup-uid">
                  Student UID (Derived from Email)
                </label>
                <input
                  id="verso-signup-uid"
                  type="text"
                  className="verso-input"
                  value={derivedUid}
                  placeholder="e.g. 23BCS12850"
                  readOnly
                  tabIndex={-1}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="verso-input-group">
                  <label className="verso-input-label" htmlFor="verso-signup-password">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="verso-signup-password"
                      type={showSignUpPassword ? 'text' : 'password'}
                      className="verso-input pr-10"
                      placeholder="••••••••"
                      value={signUpData.password}
                      onChange={(e) => {
                        setSignUpData((prev) => ({ ...prev, password: e.target.value }));
                        if (signUpErrors.password) setSignUpErrors((p) => ({ ...p, password: null }));
                      }}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-1 text-xs font-semibold text-neutral-500 hover:text-neutral-800 p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {signUpErrors.password && (
                    <span className="text-[11px] text-red-600 mt-1 font-medium">{signUpErrors.password}</span>
                  )}
                </div>

                <div className="verso-input-group">
                  <label className="verso-input-label" htmlFor="verso-signup-confirm">
                    Confirm Password
                  </label>
                  <input
                    id="verso-signup-confirm"
                    type="password"
                    className="verso-input"
                    placeholder="••••••••"
                    value={signUpData.confirmPassword}
                    onChange={(e) => {
                      setSignUpData((prev) => ({ ...prev, confirmPassword: e.target.value }));
                      if (signUpErrors.confirmPassword) setSignUpErrors((p) => ({ ...p, confirmPassword: null }));
                    }}
                    autoComplete="new-password"
                    required
                  />
                  {signUpErrors.confirmPassword && (
                    <span className="text-[11px] text-red-600 mt-1 font-medium">{signUpErrors.confirmPassword}</span>
                  )}
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="p-2.5 rounded-xl bg-emerald-950/5 border border-emerald-900/15 mb-3 text-xs">
                <p className="font-semibold text-[10px] uppercase tracking-wider text-emerald-900 mb-1.5">
                  Security Requirements
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-[11px]">
                  <div className={`flex items-center gap-1 ${passwordCriteria.minLength ? 'text-emerald-800 font-semibold' : 'text-neutral-500'}`}>
                    <Check size={11} className={passwordCriteria.minLength ? 'opacity-100' : 'opacity-25'} />
                    <span>8+ letters long</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.hasUpper ? 'text-emerald-800 font-semibold' : 'text-neutral-500'}`}>
                    <Check size={11} className={passwordCriteria.hasUpper ? 'opacity-100' : 'opacity-25'} />
                    <span>1 capital letter</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.hasLower ? 'text-emerald-800 font-semibold' : 'text-neutral-500'}`}>
                    <Check size={11} className={passwordCriteria.hasLower ? 'opacity-100' : 'opacity-25'} />
                    <span>1 small letter</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.hasNumber ? 'text-emerald-800 font-semibold' : 'text-neutral-500'}`}>
                    <Check size={11} className={passwordCriteria.hasNumber ? 'opacity-100' : 'opacity-25'} />
                    <span>1 number</span>
                  </div>
                  <div className={`flex items-center gap-1 sm:col-span-2 ${passwordCriteria.hasSpecial ? 'text-emerald-800 font-semibold' : 'text-neutral-500'}`}>
                    <Check size={11} className={passwordCriteria.hasSpecial ? 'opacity-100' : 'opacity-25'} />
                    <span>1 special character</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 mb-2">
                <input
                  type="checkbox"
                  id="verso-terms"
                  checked={signUpData.agreeTerms}
                  onChange={(e) => {
                    setSignUpData((prev) => ({ ...prev, agreeTerms: e.target.checked }));
                    if (signUpErrors.agreeTerms) setSignUpErrors((p) => ({ ...p, agreeTerms: null }));
                  }}
                  className="mt-1 h-3.5 w-3.5 rounded border-neutral-400 text-emerald-900 focus:ring-emerald-800"
                />
                <label htmlFor="verso-terms" className="text-[11px] text-neutral-600 leading-tight">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-emerald-900 font-semibold underline">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" className="text-emerald-900 font-semibold underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {signUpErrors.agreeTerms && (
                <span className="text-[11px] text-red-600 mb-2 font-medium">{signUpErrors.agreeTerms}</span>
              )}

              <button
                type="submit"
                disabled={signUpLoading || transitioning}
                className="verso-btn-submit"
              >
                <span>{signUpLoading ? 'Creating Account...' : 'Register Account'}</span>
              </button>

              <p className="verso-mobile-switch">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="verso-mobile-switch-btn"
                >
                  Sign In
                </button>
              </p>
            </form>
          </section>

          {/* ================================================================
              The Skewed Blade (Verso Overlying Band)
              ================================================================ */}
          <aside className="auth_band" aria-label="Account Switcher">
            {/* Inverse Transform Wrapper cancels skew so copy remains upright */}
            <div className="band_inner">
              <span className="band_tag">{currentBladeCopy.tag}</span>
              <h2 className="band_title">{currentBladeCopy.title}</h2>
              <p className="band_desc">{currentBladeCopy.desc}</p>
              <button
                type="button"
                onClick={handleToggleMode}
                className="band_btn"
              >
                <span>{currentBladeCopy.btn}</span>
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer Navigation Links */}
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

export default VersoAuthCard;
