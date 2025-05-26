import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API slice
export const apiSlice = createApi({
  reducerPath: 'api', // Unique name for the slice in the Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api', // Set your base URL here
  }),
  endpoints: (builder) => ({
    // Define the endpoint for creating a new user
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users', // Assuming the endpoint for creating a user is `/users`
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

// Export hooks for using in components
export const { useCreateUserMutation } = apiSlice;
