import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { ItemFilters } from '../../components/items/ItemFilters';
import { ItemGrid } from '../../components/items/ItemGrid';
import { Loader } from '../../components/common/Loader';
import { useItems } from '../../hooks/useItems';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const { items, loading, filters, setFilters, refresh } = useItems({
    category: initialCategory,
    search: initialSearch,
    condition: 'All',
    includeInactive: false
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = {};
    if (newFilters.category && newFilters.category !== 'All') params.category = newFilters.category;
    if (newFilters.search) params.search = newFilters.search;
    setSearchParams(params);
  };

  const handleClear = () => {
    setFilters({ category: 'All', search: '', condition: 'All', includeInactive: false });
    setSearchParams({});
  };

  return (
    <PageContainer>
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">Explore Campus Items</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Browse items listed by verified students across campus
        </p>
      </div>

      <ItemFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClear}
      />

      {loading ? (
        <Loader label="Searching listings..." />
      ) : (
        <ItemGrid items={items} onResetFilters={handleClear} />
      )}
    </PageContainer>
  );
};

