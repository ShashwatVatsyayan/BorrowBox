import React from 'react';

export const Loader = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 gap-3">
      <div className="w-8 h-8 border-3 border-brand-600/30 border-t-brand-600 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-ink-muted">{label}</p>
    </div>
  );
};

