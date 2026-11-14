import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmailVerificationCard } from '../../components/auth/EmailVerificationCard';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'student@cuchd.in';

  useEffect(() => {
    document.title = 'Verify Email | BorrowBox';
  }, []);

  return <EmailVerificationCard targetEmail={email} />;
};

export default VerifyEmailPage;
