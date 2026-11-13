import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
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
            <KeyRound size={20} />
          </div>
          <h2 className="text-xl font-bold text-ink-primary">Set New Password</h2>
          <p className="text-xs text-ink-muted mt-1 mb-5">
            Choose a secure password for your account.
          </p>

          {success ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
              Password updated successfully. Redirecting to login...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <p className="text-xs text-state-danger font-medium">{error}</p>}
              <Input
                label="New Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" className="w-full">
                Update Password
              </Button>
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

export default ResetPasswordPage;
