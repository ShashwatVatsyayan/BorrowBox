import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VersoAuthCard } from '../../components/auth/VersoAuthCard';

export const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <VersoAuthCard
      initialMode="signup"
      onModeChange={(nextMode) => {
        if (nextMode === 'signin') {
          navigate('/login', { replace: true });
        }
      }}
    />
  );
};

export default SignupPage;
