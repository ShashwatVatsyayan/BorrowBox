import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          {label} {required && <span className="text-state-danger">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border bg-surface-card text-ink-primary placeholder:text-ink-light text-sm transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none ${
          error ? 'border-state-danger focus:border-state-danger focus:ring-state-danger' : 'border-surface-border'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-state-danger font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-ink-muted">{helperText}</span>}
    </div>
  );
};

