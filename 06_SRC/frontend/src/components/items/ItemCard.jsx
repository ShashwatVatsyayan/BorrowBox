import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User } from 'lucide-react';

export const ItemCard = ({ item }) => {
  const imageUrl = item.images && item.images.length > 0
    ? item.images[0]
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  return (
    <Link
      to={`/app/items/${item.id}`}
      className="group flex flex-col bg-surface-card rounded-xl border border-surface-border overflow-hidden hover:shadow-md transition-all duration-200"
    >
      {/* Item Image with Fixed Ratio */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-surface-card/90 backdrop-blur-sm text-ink-primary border border-surface-border shadow-xs">
            {item.condition}
          </span>
        </div>
        {!item.is_active && (
          <div className="absolute inset-0 bg-ink-primary/60 flex items-center justify-center">
            <span className="px-3 py-1 rounded bg-surface-card text-ink-primary font-bold text-xs uppercase tracking-wider">
              Inactive
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <span className="text-[11px] font-medium text-brand-600 mb-1 line-clamp-1">
          {item.category}
        </span>
        <h3 className="text-sm font-semibold text-ink-primary group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-2">
          {item.title}
        </h3>

        <div className="mt-auto pt-2 border-t border-surface-border flex flex-col gap-1 text-[11px] text-ink-muted">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">{item.location_label}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <User size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">{item.owner?.full_name || 'Verified Student'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

