import { apiSlice } from './apiSlice';

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSavingType: builder.query({
      query: () => '/saving-types',
      providesTags: [{ type: 'Saving', id: 'LIST' }],
    }),

    // Create: Add a new setting
    createSavingTypes: builder.mutation({
      query: (newSetting) => ({
        url: '/saving-types',
        method: 'POST',
        body: newSetting,
      }),
      invalidatesTags: [{ type: 'Saving', id: 'LIST' }],
    }),

    updateSavingTypes: builder.mutation({
      query: ({ id, data }) => ({  // Changed from 'payload' to 'data' to match your calling code
        url: `/saving-types/${id}`,
        method: 'PUT',
        body: data,  // Changed from 'payload' to 'data'
      }),
      invalidatesTags: [{ type: 'Saving', id: 'LIST' }],
    }),

    // Delete: Remove a setting
    deleteSavingTypes: builder.mutation({
      query: (id) => ({
        url: `/settings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Saving', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllSavingTypeQuery,
  useCreateSavingTypesMutation,
  useUpdateSavingTypesMutation,
  useDeleteSavingTypesMutation,
} = settingsApiSlice;
