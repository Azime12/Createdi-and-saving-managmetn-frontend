import { apiSlice } from "./apiSlice";

export const loanTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all loan types
    getAllLoanTypes: builder.query<LoanType[], void>({
      query: () => "/loan-types",
      providesTags: [{ type: "LoanType", id: "LIST" }],
    }),

    // Get a single loan type by ID
    getLoanTypeById: builder.query<LoanType, string | number>({
      query: (id) => `/loan-types/${id}`,
      providesTags: (result, error, id) => [{ type: "LoanType", id }],
    }),

    // Create a new loan type
    createLoanType: builder.mutation<LoanType, Partial<LoanType>>({
      query: (newLoanType) => ({
        url: "/loan-types",
        method: "POST",
        body: newLoanType,
      }),
      invalidatesTags: [{ type: "LoanType", id: "LIST" }],
    }),

    // Update an existing loan type
    updateLoanType: builder.mutation<LoanType, { id: string | number; data: Partial<LoanType> }>({
      query: ({ id, data }) => ({
        url: `/loan-types/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "LoanType", id },
        { type: "LoanType", id: "LIST" },
      ],
    }),

    // Delete a loan type
    deleteLoanType: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/loan-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "LoanType", id },
        { type: "LoanType", id: "LIST" },
      ],
    }),

    // Restore a deleted loan type
    restoreLoanType: builder.mutation<LoanType, string | number>({
      query: (id) => ({
        url: `/loan-types/${id}/restore`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "LoanType", id },
        { type: "LoanType", id: "LIST" },
      ],
    }),

    // Get loan type statistics
    getLoanTypeStats: builder.query<LoanTypeStats[], void>({
      query: () => "/loan-types/stats",
      providesTags: [{ type: "LoanType", id: "STATS" }],
    }),
  }),
});

export const {
  useGetAllLoanTypesQuery,
  useGetLoanTypeByIdQuery,
  useCreateLoanTypeMutation,
  useUpdateLoanTypeMutation,
  useDeleteLoanTypeMutation,
  useRestoreLoanTypeMutation,
  useGetLoanTypeStatsQuery,
} = loanTypeApiSlice;

interface LoanTypeStats {
  status: string;
  count: number;
  avgInterestRate: number;
}