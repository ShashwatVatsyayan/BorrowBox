import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Home, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export const NotFoundPage = () => {
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
        <div className="max-w-md w-full text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-surface-border text-xs font-mono font-bold text-brand-600 mb-4">
            ERROR 404
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight mb-3">
            Page Not Found
          </h1>
          
          <p className="text-sm text-ink-muted mb-8 leading-relaxed">
            The page or campus listing you requested does not exist, was deleted by its owner, or has moved to an updated address.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(user ? '/app' : '/')}
              className="w-full sm:w-auto gap-2"
            >
              <Home size={16} />
              <span>{user ? 'Return to Dashboard' : 'Back to Home'}</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => navigate(user ? '/app/explore' : '/login')}
              className="w-full sm:w-auto gap-2"
            >
              <Compass size={16} />
              <span>Explore Items</span>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-surface-border text-xs text-ink-muted">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-brand-600 font-semibold hover:underline"
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

