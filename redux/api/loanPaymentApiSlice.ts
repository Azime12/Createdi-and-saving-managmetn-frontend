import { apiSlice } from './apiSlice';

export const loanPaymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET: All payments
    getAllLoanPayments:  builder.query({
  query: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return {
      url: `/payments?${queryString}`,
      method: 'GET',
    };
  },
  providesTags: (result) =>
    result?.rows
      ? [
          ...result.rows.map((payment) => ({
            type: 'LoanPayment',
            id: payment.id,
          })),
          { type: 'LoanPayment', id: 'LIST' },
        ]
      : [{ type: 'LoanPayment', id: 'LIST' }],
}),

    
    // POST: Create new payment
    createLoanPayment: builder.mutation({
      query: (newPayment) => ({
        url: '/payments',
        method: 'POST',
        body: newPayment,
      }),
      invalidatesTags: [{ type: 'LoanPayment', id: 'LIST' }],
    }),

    // PUT: Update existing payment
    updateLoanPayment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/payments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'LoanPayment', id: 'LIST' }],
    }),


    // DELETE: Remove payment
    deleteLoanPayment: builder.mutation({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'LoanPayment', id: 'LIST' }],
    }),

    // PATCH: Reverse a payment
    reverseLoanPayment: builder.mutation({
      query: (id) => ({
        url: `/payments/${id}/reverse`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'LoanPayment', id: 'LIST' }],
    }),
verifyLoanPayment: builder.mutation({
  query: ({ paymentId, action, reason }) => ({
    url: `/payments/${paymentId}/verify`,
    method: 'PATCH',
    body: {
      action,
      ...(reason && { reason }), // Include reason only if present
    },
  }),
  invalidatesTags: (result, error, { paymentId }) => [
    { type: 'LoanPayment', id: paymentId },
    { type: 'LoanPayment', id: 'LIST' },
  ],
}),


  }),
});


export const {
  useGetAllLoanPaymentsQuery,
  useCreateLoanPaymentMutation,
  useUpdateLoanPaymentMutation,
  useDeleteLoanPaymentMutation,
  useReverseLoanPaymentMutation,
  useVerifyLoanPaymentMutation,
} = loanPaymentApiSlice;
