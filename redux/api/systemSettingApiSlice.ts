import { apiSlice } from "./apiSlice";
import { SystemSetting } from "../types/systemSettingTypes";

export const systemSettingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // System Settings endpoints
    getSystemSettings: builder.query<SystemSetting, void>({
      query: () => '/system-settings',
      providesTags: ['SystemSettings'],
    }),

    updateSystemSettings: builder.mutation<SystemSetting, Partial<SystemSetting>>({
      query: (settings) => ({
        url: '/system-settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['SystemSettings'],
    }),

    // Loan Type endpoints
    getLoanTypes: builder.query({
      query: () => '/loan-types',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({ type: 'LoanType', id }) as const,
              { type: 'LoanType', id: 'LIST' },
            ]
          : [{ type: 'LoanType', id: 'LIST' }],
    }),

    createLoanType: builder.mutation({
      query: (newLoanType) => ({
        url: '/loan-types',
        method: 'POST',
        body: newLoanType,
      }),
      invalidatesTags: [{ type: 'LoanType', id: 'LIST' }],
    }),

    updateLoanType: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/loan-types/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LoanType', id }],
    }),

    deleteLoanType: builder.mutation({
      query: (id) => ({
        url: `/loan-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'LoanType', id }],
    }),

    // Savings Type endpoints
    getSavingsTypes: builder.query({
      query: () => '/savings-types',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({ type: 'SavingsType', id }) as const,
              { type: 'SavingsType', id: 'LIST' },
            ]
          : [{ type: 'SavingsType', id: 'LIST' }],
    }),

    createSavingsType: builder.mutation({
      query: (newSavingsType) => ({
        url: '/savings-types',
        method: 'POST',
        body: newSavingsType,
      }),
      invalidatesTags: [{ type: 'SavingsType', id: 'LIST' }],
    }),

    updateSavingsType: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/savings-types/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SavingsType', id }],
    }),

    deleteSavingsType: builder.mutation({
      query: (id) => ({
        url: `/savings-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'SavingsType', id }],
    }),

    // System Parameters endpoints
    getSystemParameters: builder.query({
      query: () => '/system-parameters',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({ type: 'SystemParameter', id }) as const),
              { type: 'SystemParameter', id: 'LIST' },
            ]
          : [{ type: 'SystemParameter', id: 'LIST' }],
    }),

    updateSystemParameter: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/system-parameters/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SystemParameter', id }],
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useGetLoanTypesQuery,
  useCreateLoanTypeMutation,
  useUpdateLoanTypeMutation,
  useDeleteLoanTypeMutation,
  useGetSavingsTypesQuery,
  useCreateSavingsTypeMutation,
  useUpdateSavingsTypeMutation,
  useDeleteSavingsTypeMutation,
  useGetSystemParametersQuery,
  useUpdateSystemParameterMutation,
} = systemSettingApiSlice;