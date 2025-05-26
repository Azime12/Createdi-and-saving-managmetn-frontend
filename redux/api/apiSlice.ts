import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';
import { BASE_URL, API_TAGS } from '../../constants/apiConfig';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    // Use getSession to access token from NextAuth
    const session = await getSession();
    const token = session?.accessToken || session?.user?.accessToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: Object.values(API_TAGS),
  endpoints: (builder) => ({}),
});
