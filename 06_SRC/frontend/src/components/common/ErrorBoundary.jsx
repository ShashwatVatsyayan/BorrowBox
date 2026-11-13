import React, { Component } from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { Logo } from './Logo';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen min-h-[100dvh] bg-surface-base flex flex-col justify-between p-4 sm:p-8 font-sans">
          <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4">
            <Logo size="sm" to="/" />
          </header>

          <main className="max-w-md w-full mx-auto my-auto text-center py-12 px-6 rounded-2xl bg-surface-card border border-surface-border shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#D4A853]/10 dark:bg-[#D4A853]/15 text-[#D4A853] flex items-center justify-center border border-[#D4A853]/30 mx-auto mb-4">
              <AlertTriangle size={26} />
            </div>

            <div className="inline-block px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-surface-border text-[11px] font-mono font-bold text-ink-muted mb-2">
              APPLICATION NOTICE
            </div>

            <h1 className="font-serif text-2xl font-bold text-ink-primary mb-2">
              Something went off track
            </h1>

            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-6">
              {this.state.error?.message ||
                'A temporary interface error occurred while rendering this campus view. Your session and data remain safe.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0F382A] hover:bg-[#164e3b] text-[#F5F2EB] font-semibold text-xs sm:text-sm transition-all shadow-xs"
              >
                <RotateCcw size={14} />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-surface-border bg-surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-ink-primary font-semibold text-xs sm:text-sm transition-all"
              >
                <Home size={14} />
                <span>Back to Home</span>
              </button>
            </div>
          </main>

          <footer className="max-w-4xl w-full mx-auto text-center text-xs text-ink-muted py-4">
            BorrowBox Campus Lending Platform
          </footer>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
