import React from 'react';
import { Package } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Package,
  title = 'No items found',
  description = 'There are no records matching your current selection.',
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 sm:py-16 px-6 sm:px-8 rounded-2xl bg-[#FBF9F4] dark:bg-zinc-900/40 border border-[#0F382A]/10 dark:border-emerald-500/15 shadow-xs my-4 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F382A] dark:text-[#D4A853] flex items-center justify-center border border-emerald-200/80 dark:border-emerald-800/50 mb-4 shadow-xs">
        <Icon size={26} strokeWidth={1.8} />
      </div>

      <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-primary mb-1.5 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed mb-5">
          {description}
        </p>
      )}

      {(actionLabel || secondaryLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0F382A] hover:bg-[#164e3b] text-[#F5F2EB] font-semibold text-xs sm:text-sm transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{actionLabel}</span>
            </button>
          )}
          {secondaryLabel && onSecondary && (
            <button
              type="button"
              onClick={onSecondary}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-surface-border bg-surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-ink-primary font-semibold text-xs sm:text-sm transition-all"
            >
              <span>{secondaryLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
