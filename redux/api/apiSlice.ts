// src/redux/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL, API_TAGS } from '../../constants/apiConfig';
import type { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    try {
      const result = await baseQuery(args, api, extraOptions);
      
      // Handle 401 errors more gracefully
      if (result.error?.status === 401) {
        // Only redirect if we're not already on the login page
        if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
          // Use Next.js router instead of window.location
          const router = (await import('next/router')).default;
          router.push('/auth/login?session_expired=true');
        }
      }
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  tagTypes: Object.values(API_TAGS),
  endpoints: () => ({}),
  keepUnusedDataFor: 120, // 2 minutes cache
});