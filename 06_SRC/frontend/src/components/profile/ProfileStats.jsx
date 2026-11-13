import React from 'react';
import { Package, BookOpen, CheckCheck, ArrowLeftRight } from 'lucide-react';

export const ProfileStats = ({ stats }) => {
  const cards = [
    { label: 'Active Listings', value: stats?.listings || 0, icon: Package, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/40' },
    { label: 'Completed Borrows', value: stats?.borrowings || 0, icon: BookOpen, color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Completed Lendings', value: stats?.lendings || 0, icon: CheckCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Permanent Trades', value: stats?.trades || 0, icon: ArrowLeftRight, color: 'text-[#916C16] dark:text-[#E8CA7A] bg-[#D4A853]/15' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-card border border-surface-border text-center shadow-xs"
          >
            <div className={`p-2 rounded-lg ${card.color} mb-1.5`}>
              <Icon size={18} />
            </div>
            <span className="text-lg font-bold text-ink-primary">{card.value}</span>
            <span className="text-[11px] font-medium text-ink-muted leading-tight mt-0.5">{card.label}</span>
          </div>
        );
      })}
    </div>
  );
};

