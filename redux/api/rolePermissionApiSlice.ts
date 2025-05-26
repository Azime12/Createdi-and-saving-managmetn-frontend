import { apiSlice } from "./apiSlice";

export const rolePermissionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Role Endpoints
    getAllRole: builder.query({
      query: () => "/admin/roles",
      providesTags: ["RoleList"],
    }),

    getRoleById: builder.query({
      query: (id: number | string) => `/admin/roles/${id}`,
      providesTags: ["RoleList"],
    }),

    createRole: builder.mutation({
      query: (newRole) => ({
        url: "/admin/roles",
        method: "POST",
        body: newRole,
      }),
      invalidatesTags: ["RoleList"],
    }),

    updateRole: builder.mutation({
      query: ({ id, name }) => ({
        url: `/admin/roles/${id}`,
        method: "PUT",
        body: {name},
      }),
      // Cache invalidation for the RoleList to trigger a re-fetch after the role is updated
      invalidatesTags: [{ type: "Role", id: "LIST" }], // If you're storing roles with tags
    }),
    

    deleteRole: builder.mutation({
      query: (id: number | string) => ({
        url: `/admin/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RoleList"],
    }),

    // 🔹 Permission Endpoints
    getAllPermission: builder.query({
      query: () => "/admin/permissions",
      providesTags: [{ type: "Permission", id: "LIST" }],
    }),

    getPermissionById: builder.query({
      query: (id: number | string) => `/admin/permissions/${id}`,
    }),

    createPermission: builder.mutation({
      query: (newPermission) => ({
        url: "/admin/permissions",
        method: "POST",
        body: newPermission,
      }),
      invalidatesTags: [{ type: "Permission", id: "LIST" }],
    }),

    updatePermission: builder.mutation({
      query: ({ id, ...partialPermission }) => ({
        url: `/admin/permissions/${id}`,
        method: "PATCH",
        body: partialPermission,
      }),
      invalidatesTags: [{ type: "Permission", id: "LIST" }],
    }),

    deletePermission: builder.mutation({
      query: (id: number | string) => ({
        url: `/admin/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Permission", id: "LIST" }],
    }),

    // 🔹 Role-Permission Assignment Endpoints
    getRolePermissions: builder.query({
      query: (roleId: number | string) => `/admin/roles/${roleId}/permissions`,
    }),

    assignPermissionToRole: builder.mutation({
      query: ({ roleId, permissionId }) => ({
        url: `/admin/assign-permission`,
        method: "POST",
        body: { roleId,permissionId},
      }),
    }),

    removePermissionFromRole: builder.mutation({
      query: ({ roleId, permissionId }) => ({
        url: `/admin/roles/${roleId}/permissions/${permissionId}`,
        method: "DELETE",
      }),
    }),

    getAllPermissions: builder.query({
      query: () => "/admin/permissions",
    }),
  }),
});

export const {
  // Role hooks
  useGetAllRoleQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,

  // Permission hooks
  useGetAllPermissionQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,

  // Role-permission hooks
  useGetRolePermissionsQuery,
  useAssignPermissionToRoleMutation,
  useRemovePermissionFromRoleMutation,
  useGetAllPermissionsQuery,
} = rolePermissionApiSlice;
