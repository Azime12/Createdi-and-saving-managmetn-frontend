// src/hooks/useApiData.ts
'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';

export const useApiData = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      dispatch({
        type: 'auth/setToken',
        payload: session.accessToken,
      });
    }
  }, [session, dispatch]);

  return {
    isAuthenticated: !!session,
    token: session?.accessToken,
  };
};