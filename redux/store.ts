// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import userReducer from './slice/userSlice';
import authReducer from './slice/authSlice';

// Initialize store only once
const initializeStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      user: userReducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['auth/setToken'],
          ignoredPaths: ['payload.headers'],
        },
      }).concat(apiSlice.middleware),
  });
};

// Create and export the store instance
const store = initializeStore();

export default store;

// Export the types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;