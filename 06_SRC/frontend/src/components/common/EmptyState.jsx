import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-surface-border rounded-xl bg-surface-card/60 my-4">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-ink-muted mb-3">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-base font-semibold text-ink-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-muted max-w-sm mb-4">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

