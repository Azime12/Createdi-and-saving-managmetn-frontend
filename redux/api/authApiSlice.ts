import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    sociaLogin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/social-login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    emailVerify: builder.mutation({
      query: (token) => ({
        url: `/auth/verify-email?token=${token}`, // Send token in query params
        method: "GET",
      }),
      invalidatesTags: ["Auth"],
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: "/auth/reset-password", // Adjust to your API route
        method: "POST",
        body: { token, newPassword },
      }),
    }),
    requestPasswordReset: builder.mutation({
      query: (email) => ({
        url: "/auth/request-reset", // Adjust to your API route
        method: "POST",
        body: { email },
      }),
    }),
  }),
});

export const { 
  useSociaLoginMutation, 
  useEmailVerifyMutation, 
  useLoginMutation, 
  useSignupMutation,
  useResetPasswordMutation,  // Export hook for the resetPassword mutation
  useRequestPasswordResetMutation,  // Export hook for the requestPasswordReset mutation
} = authApiSlice;
