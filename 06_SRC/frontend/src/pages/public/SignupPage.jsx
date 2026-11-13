import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { validateEmail, validatePassword } from '../../utils/validators';
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
      await signup({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        university_uid: formData.uid
      });
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setGeneralError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col justify-between py-6 px-4 sm:px-6">
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
              placeholder="e.g. yourname@cuchd.in"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
              helperText="Only verified university mailboxes can participate"
            />

            <Input
              label="University UID / Student ID (Optional)"
              id="uid"
              placeholder="e.g. 21BCS1001"
              value={formData.uid}
              onChange={(e) => handleChange('uid', e.target.value)}
              helperText="Private identifier, never displayed publicly"
            />

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

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
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

