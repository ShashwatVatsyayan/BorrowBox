import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { authService } from '../../services/authService';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authService.resetPasswordForEmail(email);
      setSubmitted(true);
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
        <div className="flex justify-center mb-5">
          <Logo size="lg" to="/" />
        </div>
        <div className="bg-surface-card p-6 rounded-2xl border border-surface-border shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
            <Mail size={20} />
          </div>
          <h2 className="text-xl font-bold text-ink-primary">Reset Password</h2>
          <p className="text-xs text-ink-muted mt-1 mb-5">
            Enter your university email to receive a password reset link.
          </p>

          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
              <div className="flex items-center gap-2 font-bold mb-1">
                <CheckCircle2 size={16} />
                <span>Reset Instructions Dispatched</span>
              </div>
              <p>Check your university inbox for the reset link.</p>
              <div className="mt-4">
                <Link to="/login" className="text-brand-600 font-semibold hover:underline">
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="University Email"
                id="email"
                type="email"
                placeholder="e.g. aarav.sharma@cuchd.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Send Reset Link
              </Button>
              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-ink-muted hover:text-ink-primary">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
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

export default ForgotPasswordPage;
