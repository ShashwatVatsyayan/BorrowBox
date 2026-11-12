import { useState, useEffect, useCallback } from 'react';
import { itemService } from '../services/itemService';

export const useItems = (initialFilters = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await itemService.getItems(filters);
      setItems(data);
    } catch (err) {
      setError(err.message || 'Failed to load items.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchItems
  };
};

