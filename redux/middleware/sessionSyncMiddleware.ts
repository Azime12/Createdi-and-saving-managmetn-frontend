// src/redux/middleware/sessionSync.ts
import { Middleware } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';

export const sessionSyncMiddleware: Middleware = 
  ({ dispatch }) => 
  (next) => 
  async (action) => {
    // Sync session on specific actions
    if (action.type.endsWith('/executeQuery') || action.type === 'auth/checkSession') {
      try {
        const session = await getSession();
        if (session?.accessToken) {
          dispatch({
            type: 'auth/setToken',
            payload: session.accessToken,
          });
        }
      } catch (error) {
        console.error('Session sync failed:', error);
      }
    }
    return next(action);
  };