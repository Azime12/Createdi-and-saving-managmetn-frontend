// src/redux/api/branchApiSlice.ts
import { apiSlice } from './apiSlice';
import { API_TAGS } from '../../constants/apiConfig';

export const branchApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Branch endpoints with optimized caching
getAllBranches:  builder.query({
      query: () => `/branches/`,
      providesTags: (result, error, id) => [{ type: API_TAGS.Branch, id }],
    }),

    getBranchById: builder.query({
      query: (id) => `/branches/${id}`,
      providesTags: (result, error, id) => [{ type: API_TAGS.Branch, id }],
    }),

    createBranch: builder.mutation({
      query: (newBranch) => ({
        url: '/branches',
        method: 'POST',
        body: newBranch,
      }),
      invalidatesTags: [{ type: API_TAGS.Branch, id: 'LIST' }],
      extraOptions: { maxRetries: 0 }, // Prevent duplicate submissions
    }),

    updateBranch: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/branches/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.Branch, id },
        { type: API_TAGS.Branch, id: 'LIST' },
      ],
    }),

    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `/branches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: API_TAGS.Branch, id },
        { type: API_TAGS.Branch, id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllBranchesQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApiSlice;