import React, { useEffect } from 'react';
import { VersoAuthCard } from '../../components/auth/VersoAuthCard';

export const SignupPage = () => {
  useEffect(() => {
    document.title = 'Create Account | BorrowBox';
  }, []);

  return (
    <VersoAuthCard
      initialMode="signup"
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

export default SignupPage;
