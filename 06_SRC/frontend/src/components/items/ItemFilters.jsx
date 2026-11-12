import React from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES, CONDITIONS } from '../../utils/constants';

export const ItemFilters = ({ filters, onChange, onClear }) => {
  const handleSearchChange = (e) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleCategoryClick = (cat) => {
    const next = filters.category === cat ? 'All' : cat;
    onChange({ ...filters, category: next });
  };

  const handleConditionChange = (e) => {
    onChange({ ...filters, condition: e.target.value });
  };

  const hasActiveFilters = Boolean(
    (filters.search && filters.search.trim().length > 0) ||
    (filters.category && filters.category !== 'All') ||
    (filters.condition && filters.condition !== 'All')
  );

  return (
    <div className="flex flex-col gap-3.5 mb-6">
      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-3.5 text-ink-muted pointer-events-none" />
        <input
          type="text"
          value={filters.search || ''}
          onChange={handleSearchChange}
          placeholder="Search items by name, book title, calculator model..."
          className="w-full min-h-[44px] pl-10 pr-10 py-2.5 rounded-xl border border-surface-border bg-surface-card text-ink-primary placeholder:text-ink-light text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 shadow-xs"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-3 p-1 rounded-md text-ink-muted hover:text-ink-primary"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => handleCategoryClick('All')}
          className={`shrink-0 px-3 py-1.5 rounded-full font-medium transition-colors border ${
            !filters.category || filters.category === 'All'
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-50'
          }`}
        >
          All Items
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full font-medium transition-colors border ${
              filters.category === cat
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Condition & Clear Action Bar */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-2">
          <span className="text-ink-muted font-medium">Condition:</span>
          <select
            value={filters.condition || 'All'}
            onChange={handleConditionChange}
            className="min-h-[32px] px-2 py-1 rounded-md border border-surface-border bg-surface-card text-ink-primary text-xs outline-none focus:border-brand-600"
          >
            <option value="All">Any Condition</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-brand-600 font-semibold hover:text-brand-700 underline text-xs"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

