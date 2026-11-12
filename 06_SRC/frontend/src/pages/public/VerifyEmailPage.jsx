import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { maskEmail } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'student@cuchd.in';
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || token.trim().length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(email, token);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setResendStatus('A new 6-digit code has been dispatched. (Demo code: 123456)');
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col justify-center py-10 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mx-auto mb-3">
            <Mail size={24} />
          </div>
          <h2 className="text-2xl font-bold text-ink-primary">Verify University Mailbox</h2>
          <p className="text-xs text-ink-muted mt-1">
            We sent a 6-digit confirmation code to{' '}
            <strong className="text-ink-primary font-semibold">{maskEmail(email)}</strong>
          </p>
        </div>

        <div className="bg-surface-card p-6 rounded-2xl border border-surface-border shadow-xs">
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} />
            </div>
          )}

          {resendStatus && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{resendStatus}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-center">
              <label htmlFor="token" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                6-Digit OTP Code
              </label>
              <input
                id="token"
                type="text"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold py-3 rounded-xl border border-surface-border bg-slate-50 focus:bg-white focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition-colors"
                autoFocus
              />
              <p className="text-[11px] text-ink-muted mt-1">
                For offline demonstration mode, enter <span className="font-mono font-bold text-ink-primary">123456</span>
              </p>
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
              Verify and Enter Dashboard
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-surface-border flex items-center justify-between text-xs text-ink-muted">
            <button
              onClick={handleResend}
              type="button"
              className="text-brand-600 font-semibold hover:underline"
            >
              Resend Code
            </button>
            <Link to="/signup" className="hover:underline">
              Change Email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

