import { apiSlice } from './apiSlice';

export const accountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ EXISTING ENDPOINTS (minimal changes)
    getAccountsByUserId: builder.query({
      query: (userId) => `/saving-accounts/user/${userId}`,
      providesTags: [{ type: "Saving", id: "LIST" }],
    }),

    createAccout: builder.mutation({
      query: (newAccount) => ({
        url: "/saving-accounts",
        method: "POST",
        body: newAccount,
      }),
      invalidatesTags: [{ type: "Saving", id: "LIST" }],
    }),

    getAccountNumberByUserId: builder.query({
      query: (userId: string) => `/account-numbers/user/${userId}`,
      providesTags: [{ type: "Saving", id: "LIST" }],
    }),

    getAccountNumberByAccountId: builder.query({
      query: (accountId: string) => `/account-numbers/${accountId}`,
      providesTags: [{ type: "Saving", id: "LIST" }],
    }),

    createAccountNumber: builder.mutation({
      query: (newAccountNumber: any) => ({
        url: "/account-numbers",
        method: "POST",
        body: newAccountNumber,
      }),
      invalidatesTags: [{ type: "Saving", id: "LIST" }],
    }),

    deleteAccountNumber: builder.mutation({
      query: (accountId: string) => ({
        url: `/account-numbers/${accountId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Saving", id: "LIST" }],
    }),

    depositToAccount: builder.mutation({
      query: ({ accountId, amount,userId }) => ({
        url: `/saving-accounts/deposit`,
        method: "POST",
        body: { accountId, amount,userId },
      }),
      invalidatesTags: [{ type: "Saving", id: "LIST" }],
    }),

    widthdrawFromAccount: builder.mutation({
      query: ({ accountId, amount,userId }) => ({
        url: `/saving-accounts/withdraw`,
        method: "POST",
        body: { accountId, amount,userId },
      }),
      invalidatesTags: [{ type: "Saving", id: "LIST" }],
    }),

    // ✅ NEWLY ADDED ENDPOINTS

    // Get ALL accounts (admin use)
    getAllAccounts: builder.query({
      query: () => `/saving-accounts`,
      providesTags: [{ type: "Saving", id: "LIST" }],
    }),

    // Get a specific account by ID
    getAccountDetails: builder.query({
      query: (accountId: string) => `/saving-accounts/${accountId}`,
      providesTags: (result, error, id) => [{ type: "Saving", id }],
    }),

    // Update account status
    updateAccountStatus: builder.mutation({
      query: (data) => ({
        url: "/saving-accounts/status",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Saving", id: "LIST" }],
    }),

    // Transfer between accounts
    transferBetweenAccounts: builder.mutation({
      query: ({ fromAccountId, toAccountId, amount }) => ({
        url: "/saving-accounts/transfer",
        method: "POST",
        body: { fromAccountId, toAccountId, amount },
      }),
      invalidatesTags: [{ type: "Saving", id: "LIST" }],
    }),

    // Get balance of account
    getAccountBalance: builder.query({
      query: (accountId: string) => `/saving-accounts/${accountId}/balance`,
      providesTags: (result, error, id) => [{ type: "Saving", id }],
    }),

    // Get transactions of account
    getAccountTransactions: builder.query({
      query: (accountId: string) => `/saving-accounts/${accountId}/transactions`,
      providesTags: (result, error, id) => [{ type: "Saving", id }],
    }),

    // Admin: calculate interest
    calculateInterest: builder.mutation({
      query: (accountId: string) => ({
        url: `/saving-accounts/${accountId}/calculate-interest`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Saving", id: "LIST" }],
    }),
  }),
});

// ✅ Export hooks
export const {
  useCreateAccountNumberMutation,
  useWidthdrawFromAccountMutation,
  useDepositToAccountMutation,
  useGetAccountNumberByAccountIdQuery,
  useDeleteAccountNumberMutation,
  useGetAccountNumberByUserIdQuery,
  useCreateAccoutMutation,
  useGetAccountsByUserIdQuery,

  // New ones
  useGetAllAccountsQuery,
  useGetAccountDetailsQuery,
  useUpdateAccountStatusMutation,
  useTransferBetweenAccountsMutation,
  useGetAccountBalanceQuery,
  useGetAccountTransactionsQuery,
  useCalculateInterestMutation,
} = accountApiSlice;
