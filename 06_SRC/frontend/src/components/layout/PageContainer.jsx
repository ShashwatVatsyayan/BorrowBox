import React from 'react';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';

export const PageContainer = ({ children, maxWidth = 'max-w-4xl' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-base">
      <AppHeader />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <DesktopSidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 safe-bottom md:pb-12 overflow-x-hidden">
          <div className={`${maxWidth} mx-auto`}>
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

