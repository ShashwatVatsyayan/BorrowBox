import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage = () => {
  const { login, switchAccount } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both university email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleName) => {
    setLoading(true);
    try {
      await switchAccount(roleName);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col justify-center py-10 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Logo size="lg" to="/" />
          </div>
          <h2 className="text-2xl font-bold text-ink-primary">Sign In to BorrowBox</h2>
          <p className="text-xs text-ink-muted mt-1">
            Access your campus listings, borrowings, and requests
          </p>
        </div>

        <div className="bg-surface-card p-6 rounded-2xl border border-surface-border shadow-xs">
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} />
            </div>
          )}

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

            <div className="relative">
              <Input
                label="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-ink-muted hover:text-ink-primary p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-xs text-brand-600 font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full">
              Log In
            </Button>
          </form>

          {/* Quick Demo Login Presets */}
          <div className="mt-6 pt-5 border-t border-surface-border">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted text-center mb-3">
              One-Click Demo Evaluator Profiles
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('Student A')}
                className="p-2.5 rounded-lg border border-surface-border bg-slate-50 hover:bg-brand-50 hover:border-brand-200 text-left transition-colors"
              >
                <p className="text-xs font-bold text-ink-primary">Student A (Owner)</p>
                <p className="text-[10px] text-ink-muted truncate">Aarav (Calculator, Lab Coat)</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Student B')}
                className="p-2.5 rounded-lg border border-surface-border bg-slate-50 hover:bg-brand-50 hover:border-brand-200 text-left transition-colors"
              >
                <p className="text-xs font-bold text-ink-primary">Student B (Borrower)</p>
                <p className="text-[10px] text-ink-muted truncate">Priya (Requests & Rackets)</p>
              </button>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-surface-border text-center text-xs text-ink-muted">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-brand-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

