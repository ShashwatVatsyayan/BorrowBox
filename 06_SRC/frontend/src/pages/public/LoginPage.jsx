import React, { useEffect } from 'react';
import { VersoAuthCard } from '../../components/auth/VersoAuthCard';

export const LoginPage = () => {
  useEffect(() => {
    document.title = 'Sign In | BorrowBox';
  }, []);

  return (
    <VersoAuthCard
      initialMode="signin"
      onModeChange={(nextMode) => {
        // Smoothly update browser URL without triggering route component unmount
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', nextMode === 'signup' ? '/signup' : '/login');
          document.title = nextMode === 'signup' ? 'Create Account | BorrowBox' : 'Sign In | BorrowBox';
        }
      }}
    />
  );
};

export default LoginPage;
