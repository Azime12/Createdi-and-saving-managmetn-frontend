export const PERMISSIONS = {
    // Dashboard
    VIEW_DASHBOARD: "view_dashboard",
    
    // User Management
    VIEW_USERS: "view_users",
    CREATE_USERS: "create_users",
    EDIT_USERS: "edit_users",
    DELETE_USERS: "delete_users",
    
    // Branch Management
    VIEW_BRANCHES: "view_branches",
    MANAGE_BRANCHES: "manage_branches",
    
    // Financial
    VIEW_SAVINGS: "view_savings",
    MANAGE_SAVINGS: "manage_savings",
    VIEW_LOANS: "view_loans",
    MANAGE_LOANS: "manage_loans",
    
    // System
    VIEW_SETTINGS: "view_settings",
    MANAGE_ROLES: "manage_roles",
    MANAGE_PERMISSIONS: "manage_permissions",
    
    // Security
    VIEW_SECURITY: "view_security",
    CHANGE_PASSWORD: "change_password",
    MANAGE_2FA: "manage_2fa",
    
    // Notifications
    VIEW_NOTIFICATIONS: "view_notifications",
    
    // Admin (special permission)
    ADMIN: "admin"
  } as const;
  
  export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];