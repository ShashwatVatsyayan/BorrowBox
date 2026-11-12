import React from 'react';
import { ItemCard } from './ItemCard';
import { EmptyState } from '../common/EmptyState';
import { Package } from 'lucide-react';

export const ItemGrid = ({ items = [], emptyMessage = 'No items found matching your criteria.', onResetFilters }) => {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No Items Found"
        description={emptyMessage}
        actionLabel={onResetFilters ? 'Clear All Filters' : null}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

