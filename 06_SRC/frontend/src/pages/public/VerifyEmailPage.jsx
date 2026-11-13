import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { VersoOtpCard } from '../../components/auth/VersoOtpCard';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '23bcs12850@cuchd.in';

  return <VersoOtpCard targetEmail={email} />;
};

export default VerifyEmailPage;
