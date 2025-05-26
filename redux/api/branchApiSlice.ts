import { apiSlice } from "./apiSlice";

export const branchApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true, // ✅ Allow overriding existing endpoint names
  endpoints: (builder) => ({
    // Branch endpoints
    getAllBranches: builder.query<Branch[], void>({
      query: () => '/branches',
    }),

    getBranchById: builder.query({
      query: (id: number | string) => `/branches/${id}`,
      providesTags: (result, error, id) => [{ type: "Branch", id }],
    }),

    createBranch: builder.mutation({
      query: (newBranch) => ({
        url: "/branches",
        method: "POST",
        body: newBranch,
      }),
      invalidatesTags: [{ type: "Branch", id: "LIST" }],
    }),

    updateBranch: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/branches/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteBranch: builder.mutation({
      query: (id: number | string) => ({
        url: `/branches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Branch", id },
        { type: "Branch", id: "LIST" },
      ],
    }),

    // User endpoints (overridable)
    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: [{ type: "User", id: "LIST" }],
    }),

    getUserById: builder.query({
      query: (id: number | string) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    createUserByAdmin: builder.mutation({
      query: (newUser) => ({
        url: "/admin/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...partialUser }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: partialUser,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation({
      query: (id: number | string) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
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
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserByAdminMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = branchApiSlice;
