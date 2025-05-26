'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAbility } from '@/context/AbilityContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAction: Action | Action[];
  subject: Subject | Subject[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredAction, subject }) => {
  const { can, ability } = useAbility();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (!ability) return;

    const result = can(requiredAction, subject);
    if (!result) {
      router.push('/403');
      console.error("push error  403")
    } else {
      setIsAllowed(true);
    }

    setIsChecking(false);
  }, [ability, can, requiredAction, subject, router]);

  if (isChecking) return null; // Optionally show a loading spinner

  return isAllowed ? <>{children}</> : null;
};

export default ProtectedRoute;
