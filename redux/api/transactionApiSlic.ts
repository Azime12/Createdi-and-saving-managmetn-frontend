import { apiSlice } from './apiSlice';

export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransaction: builder.query({
      query: () => '/transactions',
      providesTags: ['Transaction','Saving'],
    }),

    getTransactionByUserId: builder.query({
      query: (userId) => `/transactions/user/${userId}`,
      providesTags: ['Transaction'],
    }),

    deposit: builder.mutation({
      query: ({ accountId, amount }) => ({
        url: '/saving-accounts/deposit',
        method: 'POST',
        body: {
          accountId,
          amount: Number(amount) // Ensure number type
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ['Transaction', 'Saving'],
    }),

    withdraw: builder.mutation({
      query: ({ accountId, amount, requestId }) => ({
        url: '/saving-accounts/withdraw',
        method: 'POST',
        body: {
          accountId,
          amount: Number(amount), // Ensure number type
          requestId
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ['Transaction', 'Saving'],
    }),
  }),
});

export const {
  useGetAllTransactionQuery,
  useGetTransactionByUserIdQuery,
  useDepositMutation,
  useWithdrawMutation,
} = transactionApiSlice;