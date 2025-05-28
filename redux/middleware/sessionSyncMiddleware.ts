// src/redux/middleware/sessionSync.ts
import { Middleware } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';
import type { RootState } from '../store';

export const sessionSyncMiddleware: Middleware = 
  ({ dispatch, getState }) => 
  (next) => 
  async (action) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[sessionSyncMiddleware] Processing action:', action.type);
    }

    const result = next(action);
    
    if (action.type.endsWith('/executeQuery') || action.type === 'auth/checkSession') {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('[sessionSyncMiddleware] Checking session for token...');
        }

        const session = await getSession();
        const currentToken = (getState() as RootState).auth.token;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[sessionSyncMiddleware] Current token in store:', currentToken ? 'exists' : 'null');
          console.log('[sessionSyncMiddleware] Session token:', session?.accessToken ? 'exists' : 'null');
        }

        if (session?.accessToken && session.accessToken !== currentToken) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[sessionSyncMiddleware] Updating token in store...');
          }
          dispatch({
            type: 'auth/setToken',
            payload: session.accessToken,
          });
        }
      } catch (error) {
        console.error('[sessionSyncMiddleware] Session sync failed:', error);
      }
    }
    
    return result;
  };// src/redux/middleware/sessionSync.ts
import { Middleware } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';
import type { RootState } from '../store';

export const sessionSyncMiddleware: Middleware = 
  ({ dispatch, getState }) => 
  (next) => 
  async (action) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[sessionSyncMiddleware] Processing action:', action.type);
    }

    const result = next(action);
    
    if (action.type.endsWith('/executeQuery') || action.type === 'auth/checkSession') {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('[sessionSyncMiddleware] Checking session for token...');
        }

        const session = await getSession();
        const currentToken = (getState() as RootState).auth.token;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[sessionSyncMiddleware] Current token in store:', currentToken ? 'exists' : 'null');
          console.log('[sessionSyncMiddleware] Session token:', session?.accessToken ? 'exists' : 'null');
        }

        if (session?.accessToken && session.accessToken !== currentToken) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[sessionSyncMiddleware] Updating token in store...');
          }
          dispatch({
            type: 'auth/setToken',
            payload: session.accessToken,
          });
        }
      } catch (error) {
        console.error('[sessionSyncMiddleware] Session sync failed:', error);
      }
    }
    
    return result;
  };