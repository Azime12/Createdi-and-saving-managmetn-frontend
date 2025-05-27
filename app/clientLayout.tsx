// src/app/ClientLayout.tsx
'use client';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';

// Setup listeners for refetch behaviors
setupListeners(store.dispatch);

export default function ClientLayout({ 
  children,
  session // Make sure to pass session from page props
}: { 
  children: React.ReactNode,
  session?: any 
}) {
  useEffect(() => {
    // Add any initialization logic here
    return () => {
      // Cleanup logic if necessary
    };
  }, []);

  return (
    <SessionProvider 
      session={session}
      refetchOnWindowFocus={true}
      refetchInterval={60 * 5} // 5 minutes
    >
      <Provider store={store}>
        {children}
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar
        />
      </Provider>
    </SessionProvider>
  );
}