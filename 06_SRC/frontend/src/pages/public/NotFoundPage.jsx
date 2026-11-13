import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Home, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';

export const NotFoundPage = () => {
  usePageTitle('Page Not Found');
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-base flex flex-col">
      {/* Header */}
      <header className="w-full bg-surface-card border-b border-surface-border sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Logo size="sm" to={user ? "/app" : "/"} />
          <ThemeToggle size="sm" />
        </div>
      </header>

      {/* Main Error Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center p-8 sm:p-10 rounded-2xl bg-surface-card border border-surface-border shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F382A] dark:text-[#D4A853] flex items-center justify-center border border-emerald-200/80 dark:border-emerald-800/50 mx-auto mb-4 shadow-xs">
            <Compass size={28} strokeWidth={1.8} />
          </div>

          <div className="inline-block px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-surface-border text-[11px] font-mono font-bold text-[#0F382A] dark:text-[#D4A853] mb-3">
            ERROR 404
          </div>
          
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight mb-2">
            Page Not Found
          </h1>
          
          <p className="text-xs sm:text-sm text-ink-muted mb-7 leading-relaxed">
            The campus listing or page you requested does not exist, was removed by its owner, or has moved to an updated address.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate(user ? '/app' : '/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0F382A] hover:bg-[#164e3b] text-[#F5F2EB] font-semibold text-xs sm:text-sm transition-all shadow-xs hover:-translate-y-0.5"
            >
              <Home size={15} />
              <span>{user ? 'Return to Dashboard' : 'Back to Home'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(user ? '/app/explore' : '/login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-surface-border bg-surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-ink-primary font-semibold text-xs sm:text-sm transition-all"
            >
              <Compass size={15} />
              <span>Explore Items</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-surface-border text-xs text-ink-muted">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-semibold hover:underline"
            >
              <ArrowLeft size={14} />
              <span>Go back to previous page</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-surface-border text-center text-xs text-ink-muted bg-surface-card">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>BorrowBox - Campus Peer Borrowing Platform</p>
          <div className="flex items-center gap-4">
            <a
              href="https://portfolio-v2-alpha-ten-71.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-brand-600 transition-colors font-medium"
            >
              <span>Portfolio</span>
              <ExternalLink size={12} />
            </a>
            <span>•</span>
            <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;

