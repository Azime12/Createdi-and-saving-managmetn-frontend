export const routePermissions: { [pathPrefix: string]: string[] } = {
  "/dashboard": [], // Public to all authenticated users
  "/users": ["view_uer"],
  "/roles": ["view_roles"],
  "/permissions": ["view_permissions"],
  "/settings": ["edit_permissions"],
  "/saving": ["view_saving"], // 🔧 Corrected key name (was missing slash before)
};
