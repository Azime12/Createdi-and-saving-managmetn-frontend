import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: [{ type: 'User', id: 'LIST' }],
    }),

    searchUsers: builder.query({
      query: ({ field, value }) => ({
        url: '/users/search',
        params: { field, value }, // This properly formats the query parameters
      }),
      providesTags: (result, error, { field, value }) => [
        { type: 'User', id: 'SEARCH' },
        { type: 'User', id: `SEARCH-${field}-${value}` },
      ],
    }),
  assignRoleTouser: builder.mutation({
      query: (roleData) => ({
        url: '/users/assign-rolt-to-user',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useAssignRoleTouserMutation,
  useGetUsersQuery,
  useSearchUsersQuery,
  useCreateUserMutation,
} = usersApiSlice;