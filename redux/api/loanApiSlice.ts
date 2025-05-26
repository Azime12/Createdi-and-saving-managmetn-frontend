import { apiSlice } from "./apiSlice";

export const loanApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLoan: builder.mutation({
      query: (loanData) => ({
        url: "/loans",
        method: "POST",
        body: loanData,
      }),
      invalidatesTags: ["Loan"],
    }),
    getLoans: builder.query({
      query: () => "/loans",
      providesTags: ["Loan"],
    }),
    getLoansByCustomerId: builder.query({
      query: (customerId) => `/loans/customer/${customerId}`,
      providesTags: (result, error, customerId) => [{ type: "Loan", customerId }],
    }),
    getLoanById: builder.query({
      query: (loanId) => `/loans/${loanId}`,
      providesTags: (result, error, id) => [{ type: "Loan", id }],
    }),
    updateLoanById: builder.mutation({
      query: ({ id, loanData }) => ({
        url: `/loans/${id}`,
        method: "PUT",
        body: loanData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Loan", id }],
    }),
    deleteLoanById: builder.mutation({
      query: (id) => ({
        url: `/loans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Loan", id }],
    }),
    getLoanByNumber: builder.query({
      query: (loanNumber) => `/loans/number/${loanNumber}`,
      providesTags: (result, error, loanNumber) => [{ type: "Loan", loanNumber }],
    }),
    updateLoanStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/loans/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Loan", id }],
    }),
    restoreLoan: builder.mutation({
      query: (id) => ({
        url: `/loans/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Loan", id }],
    }),
    getLoanBalance: builder.query({
      query: (id) => `/loans/${id}/balance`,
      providesTags: (result, error, id) => [{ type: "Loan", id }],
    }),
  }),
});

export const {
  useCreateLoanMutation,
  useGetLoansQuery,
  useGetLoansByCustomerIdQuery,
  useGetLoanByIdQuery,
  useUpdateLoanByIdMutation,
  useDeleteLoanByIdMutation,
  useGetLoanByNumberQuery,
  useUpdateLoanStatusMutation,
  useRestoreLoanMutation,
  useGetLoanBalanceQuery,
} = loanApiSlice;
