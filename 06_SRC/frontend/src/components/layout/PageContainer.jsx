import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';

export const PageContainer = ({ children, maxWidth = 'max-w-4xl' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-base">
      <AppHeader />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <DesktopSidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 safe-bottom md:pb-12 overflow-x-hidden flex flex-col justify-between">
          <div className={`${maxWidth} mx-auto w-full flex-1`}>
            {children}
          </div>
          <footer className="mt-12 pt-6 border-t border-surface-border text-xs text-ink-muted">
            <div className={`${maxWidth} mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-2`}>
              <p>BorrowBox Campus Peer Lending Platform</p>
              <div className="flex items-center gap-4">
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
              </div>
            </div>
          </footer>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

