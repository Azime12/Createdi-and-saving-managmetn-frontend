// hooks/authHooks.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  const login = async (responseData: any) => {
    try {
      localStorage.setItem('auth', JSON.stringify({
        token: responseData.token,
        user: responseData.user,
      }));
    } catch (error) {
      console.error('Failed to store auth data', error);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth');
      await signOut({ callbackUrl: '/auth/login' });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return {
    authData: session ? {
      token: session.accessToken,
      user: session.user,
    } : null,
    user: session?.user || null,
    token: session?.accessToken || null,
    isAuthenticated: status === 'authenticated',
    loading: loading || status === 'loading',
    login,
    logout,
  };
};