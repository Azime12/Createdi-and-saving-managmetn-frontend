import { apiSlice } from "./apiSlice";

export const adminApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true, // ✅ Add this line

  endpoints: (builder) => ({
    // Get all users
    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: [{ type: "User", id: "LIST" }],
    }),

    // Get a single user by ID
    getUserById: builder.query({
      query: (id:string) => `/users/${id}`,
      providesTags: [{ type: "User", id: "LIST" }],
    }),

    // Create a new user
    createUserByAdmin: builder.mutation({
      query: (newUser) => ({
        url: "/admin/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // Update an existing user using PATCH
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

    // Delete a user
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
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserByAdminMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = adminApiSlice;
