import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../common/Loader';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <Loader label="Authenticating session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Never allow an unverified user to bypass confirmation by navigating directly to a protected route
  const isEmailConfirmed = Boolean(
    user.email_confirmed_at || user.confirmed_at || user.is_verified === true
  );
  if (!isEmailConfirmed) {
    return (
      <Navigate
        to={`/verify-email?email=${encodeURIComponent(user.email || '')}`}
        replace
      />
    );
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/app" replace />;
  }

  return children;
};

export default ProtectedRoute;
