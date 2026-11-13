import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const ErrorMessage = ({
  title = 'Notice',
  message,
  onRetry,
  className = ''
}) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-3.5 p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/90 dark:border-red-900/50 text-red-900 dark:text-red-200 text-xs sm:text-sm shadow-xs ${className}`}
      role="alert"
    >
      <div className="p-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 shrink-0 mt-0.5">
        <AlertCircle size={16} />
      </div>
      <div className="flex-1 min-w-0">
        {title && <p className="font-bold text-xs uppercase tracking-wider mb-0.5 text-red-800 dark:text-red-300">{title}</p>}
        <p className="font-medium text-ink-primary leading-relaxed text-xs sm:text-sm">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
