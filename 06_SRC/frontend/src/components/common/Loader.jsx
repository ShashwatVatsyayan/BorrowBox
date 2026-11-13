import React from 'react';

export const Loader = ({ label = 'Loading...', fullPage = false, className = '' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center px-4 gap-3 ${
        fullPage ? 'min-h-[60dvh] w-full py-16' : 'py-12'
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="w-8 h-8 border-3 border-brand-600/30 border-t-brand-600 rounded-full animate-spin" />
      <p className="text-sm font-medium text-ink-muted">{label}</p>
    </div>
  );
};

export default Loader;

