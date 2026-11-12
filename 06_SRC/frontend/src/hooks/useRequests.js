import { useState, useEffect, useCallback } from 'react';
import { requestService } from '../services/requestService';
import { useAuth } from './useAuth';

export const useRequests = () => {
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllRequests = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [sent, received] = await Promise.all([
        requestService.getSentRequests(user.id),
        requestService.getReceivedRequests(user.id)
      ]);
      setSentRequests(sent);
      setReceivedRequests(received);
    } catch (err) {
      setError(err.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAllRequests();
  }, [fetchAllRequests]);

  return {
    sentRequests,
    receivedRequests,
    loading,
    error,
    refresh: fetchAllRequests
  };
};

