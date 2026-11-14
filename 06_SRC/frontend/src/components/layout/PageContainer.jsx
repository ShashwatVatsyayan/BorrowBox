import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';

export const PageContainer = ({ children, maxWidth = 'max-w-4xl' }) => {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-surface-base">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-xl focus:font-semibold focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <AppHeader />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <DesktopSidebar />
        <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 md:p-8 safe-bottom md:pb-12 overflow-x-hidden flex flex-col justify-between outline-none">
          <div className={`${maxWidth} mx-auto w-full flex-1`}>
            {children}
          </div>
          <footer className="mt-12 pt-6 border-t border-surface-border text-xs text-ink-muted">
            <div className={`${maxWidth} mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-2`}>
              <div className="flex flex-col items-center sm:items-start gap-0.5">
                <p className="font-medium text-ink-primary">BorrowBox Campus Rental Marketplace</p>
                <p className="text-[11px] text-ink-light">© 2026 BorrowBox. Developed by Shashwat Vatsyayan. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <a
                  href="https://portfolio-v2-alpha-ten-71.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-brand-600 transition-colors font-medium text-ink-primary"
                >
                  <span>Developer Portfolio</span>
                  <ExternalLink size={12} />
                </a>
                <span>•</span>
                <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms</Link>
                <span>•</span>
                <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy</Link>
                <span>•</span>
                <Link to="/cookies" className="hover:text-brand-600 transition-colors">Cookies</Link>
              </div>
            </div>
          </footer>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

