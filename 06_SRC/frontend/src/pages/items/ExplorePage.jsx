import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { ItemFilters } from '../../components/items/ItemFilters';
import { ItemGrid } from '../../components/items/ItemGrid';
import { Loader } from '../../components/common/Loader';
import { SkeletonGrid } from '../../components/common/Skeleton';
import { useItems } from '../../hooks/useItems';
import { usePageTitle } from '../../hooks/usePageTitle';

export const ExplorePage = () => {
  usePageTitle('Explore Campus Gear');
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialType = searchParams.get('type') || 'all';

  const { items, loading, filters, setFilters, refresh } = useItems({
    category: initialCategory,
    search: initialSearch,
    condition: 'All',
    listingType: initialType,
    includeInactive: false
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = {};
    if (newFilters.category && newFilters.category !== 'All') params.category = newFilters.category;
    if (newFilters.search) params.search = newFilters.search;
    if (newFilters.listingType && newFilters.listingType !== 'all') params.type = newFilters.listingType;
    setSearchParams(params);
  };

  const handleClear = () => {
    setFilters({ category: 'All', search: '', condition: 'All', listingType: 'all', includeInactive: false });
    setSearchParams({});
  };

  return (
    <PageContainer>
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">Explore Campus Items</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Browse clothes, shoes, electronics, books, and hostel gear listed for borrowing or trade
        </p>
      </div>

      <ItemFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClear}
      />

      {loading ? (
        <div className="py-4">
          <SkeletonGrid count={6} />
        </div>
      ) : (
        <ItemGrid items={items} onResetFilters={handleClear} />
      )}
    </PageContainer>
  );
};
