import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { AuthTunnelTransition } from '../../components/common/AuthTunnelTransition';
import { validateEmail, validatePassword, getPasswordCriteria } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';

export const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    uid: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionMeta, setTransitionMeta] = useState({
    title: 'Registering Student Account...',
    subtitle: 'Preparing Chandigarh University peer access...',
    target: '/app'
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.valid) {
      newErrors.email = emailCheck.error;
    }

    const passCheck = validatePassword(formData.password);
    if (!passCheck.valid) {
      newErrors.password = passCheck.error;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must acknowledge the terms to register.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const derivedUid = formData.email.split('@')[0].toUpperCase();
      await signup({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        university_uid: derivedUid
      });
      setTransitionMeta({
        title: 'Welcome to BorrowBox!',
        subtitle: `Registered ${formData.fullName}. Preparing your campus verification...`,
        target: `/verify-email?email=${encodeURIComponent(formData.email)}`
      });
      setTransitioning(true);
    } catch (err) {
      setGeneralError(err.message || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* LightTunnel Hyperspace Warp Transition */}
      <AuthTunnelTransition
        isActive={transitioning}
        title={transitionMeta.title}
        subtitle={transitionMeta.subtitle}
        duration={1500}
        onComplete={() => navigate(transitionMeta.target)}
      />

      <div className="max-w-md w-full mx-auto flex items-center justify-end">
        <ThemeToggle size="sm" />
      </div>

      <div className="max-w-md w-full mx-auto my-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Logo size="lg" to="/" />
          </div>
          <h2 className="text-2xl font-bold text-ink-primary">Create Student Account</h2>
          <p className="text-xs text-ink-muted mt-1">
            Access peer equipment and textbooks with university email verification
          </p>
        </div>

        <div className="bg-surface-card p-6 rounded-2xl border border-surface-border shadow-xs">
          {generalError && (
            <div className="mb-4">
              <ErrorMessage message={generalError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              id="fullName"
              placeholder="e.g. Aarav Sharma"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              error={errors.fullName}
              required
            />

            <Input
              label="University Email"
              id="email"
              type="email"
              placeholder="e.g. 23bcs12850@cuchd.in"
              value={formData.email}
              onChange={(e) => {
                const mail = e.target.value;
                const autoUid = mail.includes('@') ? mail.split('@')[0].toUpperCase() : mail.toUpperCase();
                setFormData((prev) => ({ ...prev, email: mail, uid: autoUid }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              error={errors.email}
              required
              helperText="Only verified university mailboxes can participate"
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="uid" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Student UID (Auto-derived from email username)
              </label>
              <input
                id="uid"
                type="text"
                value={formData.email ? (formData.email.split('@')[0] || '').toUpperCase() : ''}
                readOnly
                disabled
                placeholder="e.g. 23BCS12850 (matches your email)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-slate-100 dark:bg-slate-900 text-ink-muted font-mono font-bold text-xs cursor-not-allowed select-all"
              />
              <p className="text-[11px] text-ink-muted">
                Student UID is immutable and automatically assigned to match your email prefix (e.g. 23bcs12850 for 23bcs12850@cuchd.in).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                required
              />
              <Input
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
              />
            </div>

            {/* Live Password Complexity Checklist */}
            {(() => {
              const criteria = getPasswordCriteria(formData.password);
              return (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-surface-border text-xs space-y-1.5">
                  <p className="font-semibold text-[11px] text-ink-muted uppercase tracking-wider">
                    Password Security Requirements
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                    <div className={`flex items-center gap-1.5 transition-colors ${criteria.minLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-ink-muted'}`}>
                      <Check size={12} className={criteria.minLength ? 'text-emerald-600 opacity-100' : 'opacity-30'} />
                      <span>8+ letters long</span>
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${criteria.hasUpper ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-ink-muted'}`}>
                      <Check size={12} className={criteria.hasUpper ? 'text-emerald-600 opacity-100' : 'opacity-30'} />
                      <span>1 capital letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${criteria.hasLower ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-ink-muted'}`}>
                      <Check size={12} className={criteria.hasLower ? 'text-emerald-600 opacity-100' : 'opacity-30'} />
                      <span>1 small letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${criteria.hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-ink-muted'}`}>
                      <Check size={12} className={criteria.hasNumber ? 'text-emerald-600 opacity-100' : 'opacity-30'} />
                      <span>1 number</span>
                    </div>
                    <div className={`flex items-center gap-1.5 sm:col-span-2 transition-colors ${criteria.hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-ink-muted'}`}>
                      <Check size={12} className={criteria.hasSpecial ? 'text-emerald-600 opacity-100' : 'opacity-30'} />
                      <span>1 special character</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
              />
              <label htmlFor="terms" className="text-xs text-ink-muted leading-tight">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="text-brand-600 font-semibold underline">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" target="_blank" className="text-brand-600 font-semibold underline">
                  Privacy Policy
                </Link>
                , and acknowledge that I will return borrowed items on time and in good condition.
              </label>
            </div>
            {errors.agreeTerms && <span className="text-xs text-state-danger font-medium">{errors.agreeTerms}</span>}

            <Button type="submit" variant="primary" loading={loading && !transitioning} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-surface-border text-center text-xs text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto pt-6 text-center text-xs text-ink-muted">
        <div className="flex items-center justify-center gap-4">
          <Link to="/terms" className="hover:text-brand-600">Terms</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-brand-600">Privacy</Link>
          <span>•</span>
          <Link to="/" className="hover:text-brand-600">Home</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
