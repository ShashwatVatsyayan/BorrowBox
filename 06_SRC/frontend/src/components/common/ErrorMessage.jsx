import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-state-danger text-sm">
      <AlertCircle size={18} className="shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-semibold underline hover:no-underline text-red-800"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

