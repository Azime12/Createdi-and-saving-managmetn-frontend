// src/app/ClientLayout.tsx
'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import { Provider, useDispatch } from 'react-redux';
import store from '../redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';
import { setToken, clearToken } from '../redux/slice/authSlice';

const logDebug = (message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ClientLayout] ${message}`);
  }
};

function TokenInitializer({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    logDebug('Checking initial session...');
    if (session?.accessToken) {
      logDebug('Initial token found, updating store...');
      dispatch(setToken(session.accessToken));
    } else {
      logDebug('No initial token found');
      dispatch(clearToken());
    }
  }, [session, dispatch]);

  useEffect(() => {
    logDebug('Setting up RTK Query listeners...');
    const unsubscribe = setupListeners(store.dispatch);
    return () => {
      logDebug('Cleaning up RTK Query listeners...');
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

export default function ClientLayout({ 
  children,
  session 
}: { 
  children: React.ReactNode,
  session?: any 
}) {
  logDebug('Rendering ClientLayout...');
  
  return (
    <SessionProvider 
      session={session}
      refetchOnWindowFocus={true}
      refetchInterval={60 * 5}
    >
      <Provider store={store}>
        <TokenInitializer>
          {children}
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar
          />
        </TokenInitializer>
      </Provider>
    </SessionProvider>
  );
}