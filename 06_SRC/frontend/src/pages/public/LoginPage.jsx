import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VersoAuthCard } from '../../components/auth/VersoAuthCard';

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <VersoAuthCard
      initialMode="signin"
      onModeChange={(nextMode) => {
        if (nextMode === 'signup') {
          navigate('/signup', { replace: true });
        }
      }}
    />
  );
};

export default LoginPage;
