import { apiSlice } from './apiSlice';

export const loanApplicationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoanApplicationByUserId: builder.query({
      query: (userId) => `/loan-applications/user/${userId}`,
      providesTags: (result, error, id) => [{ type: 'LoanApplication', id}],
    }),

    getLoanApplicationById: builder.query({
      query: (id) => `/loan-applications/${id}`,
      providesTags: (result, error, id) => [{ type: 'LoanApplication', id }],
    }),

    getAllLoanApplications: builder.query({
      query: () => ({
        url: '/loan-applications',
      }),
      providesTags: (result, error,) => [{ type: 'LoanApplication', id: 'ALL' }],
    }),

    createLoanApplication: builder.mutation({
      query: (newApplication) => ({
        url: '/loan-applications',
        method: 'POST',
        body: newApplication,
      }),
      invalidatesTags: [{ type: 'LoanApplication', id: 'ALL' }],
    }),

    updateLoanApplication: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/loan-applications/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LoanApplication', id }],
    }),

    updateLoanApplicationStatus: builder.mutation({
      query: ({ id, status, updatedBy, notes }) => ({
        url: `/loan-applications/${id}/status`,
        method: 'PATCH',
        body: { status, updatedBy, notes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LoanApplication', id }],
    }),

    deleteLoanApplication: builder.mutation({
      query: (id) => ({
        url: `/loan-applications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'LoanApplication', id }],
    }),

    getLoanApplicationStats: builder.query({
      query: () => '/loan-applications/stats',
      providesTags: (result, error) => [{ type: 'LoanApplication', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetAllLoanApplicationsQuery,
  useGetLoanApplicationByUserIdQuery,
  useGetLoanApplicationByIdQuery,
  useCreateLoanApplicationMutation,
  useUpdateLoanApplicationMutation,
  useUpdateLoanApplicationStatusMutation,
  useDeleteLoanApplicationMutation,
  useGetLoanApplicationStatsQuery,
} = loanApplicationApiSlice;
