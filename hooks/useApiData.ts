// src/hooks/useApiData.ts
'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setToken, clearToken } from '@/redux/slice/authSlice';

export const useApiData = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      dispatch(setToken(session.accessToken));
      localStorage.setItem('authToken', session.accessToken);
    } else if (status === 'unauthenticated') {
      dispatch(clearToken());
      localStorage.removeItem('authToken');
    }
  }, [session, status, dispatch]);

  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    token: session?.accessToken,
    user: session?.user,
  };
};