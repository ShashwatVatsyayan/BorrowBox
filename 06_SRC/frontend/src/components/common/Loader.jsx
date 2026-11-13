import React from 'react';

export const Loader = ({ label = 'Loading campus network...', fullPage = false, className = '' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center px-4 gap-4 ${
        fullPage ? 'min-h-[55dvh] w-full py-16' : 'py-12'
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Kinetic Emerald & Gold Pulse Stage */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-emerald-500/15 animate-ping duration-1000" />
        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0F382A] to-[#061F17] border border-[#D4A853]/40 flex items-center justify-center shadow-xs">
          <div className="w-4 h-4 rounded-full border-2 border-[#D4A853] border-t-transparent animate-spin" />
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-1.5">
        <p className="text-xs sm:text-sm font-semibold text-ink-primary tracking-tight">
          {label}
        </p>
        <div className="w-32 h-1 bg-surface-border rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-600 via-[#D4A853] to-emerald-500 rounded-full w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
