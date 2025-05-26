import { apiSlice } from './apiSlice';

export const groupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: () => '/groups',
      providesTags: [{ type: 'Group', id: 'LIST' }],
    }),

    createGroup: builder.mutation({
      query: (newGroup) => ({
        url: '/groups',
        method: 'POST',
        body: newGroup,
      }),
      invalidatesTags: [{ type: 'Group', id: 'LIST' }],
    }),

  }),
});

export const {
  useGetGroupsQuery,
  useCreateGroupMutation,
} = groupApiSlice;
