import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Check } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { validatePassword, getPasswordCriteria } from '../../utils/validators';

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const passCheck = validatePassword(password);
    if (!passCheck.valid) {
      setError(passCheck.error);
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

              {/* Live Password Complexity Checklist */}
              {(() => {
                const criteria = getPasswordCriteria(password);
                return (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-surface-border text-xs space-y-1.5">
                    <p className="font-semibold text-[11px] text-ink-muted uppercase tracking-wider">
                      Security Requirements
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
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
                      <div className={`flex items-center gap-1.5 col-span-2 transition-colors ${criteria.hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-ink-muted'}`}>
                        <Check size={12} className={criteria.hasSpecial ? 'text-emerald-600 opacity-100' : 'opacity-30'} />
                        <span>1 special character (!@#$%^&*...)</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
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
