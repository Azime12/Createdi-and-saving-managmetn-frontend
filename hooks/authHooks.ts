// src/hooks/authHooks.ts
'use client';
import { useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Permission } from '@/app/lib/ability';

const DEFAULT_PERMISSIONS: Permission[] = [
  { action: 'view', subject: 'dashboard' },
  { action: 'view', subject: 'profile' }
];

// 1. Hook for authentication status and redirect
export const useAuthRedirect = (requiredAuth = true) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (requiredAuth && status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, requiredAuth, router]);

  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    session
  };
};

// 2. Hook for permission management
export const usePermissions = () => {
  const { data: session } = useSession();

  const permissions = useMemo(() => {
    if (session?.user) {
      const userPermissions: Permission[] = [];
      const uniquePermissions = new Set<string>();
      
      session.user.roles?.forEach(role => {
        role.permissions?.forEach(permissionString => {
          const permission = convertBackendPermission(permissionString);
          const permissionKey = `${permission.action}_${permission.subject}`;
          
          if (!uniquePermissions.has(permissionKey)) {
            uniquePermissions.add(permissionKey);
            userPermissions.push(permission);
          }
        });
      });

      DEFAULT_PERMISSIONS.forEach(defaultPerm => {
        const defaultKey = `${defaultPerm.action}_${defaultPerm.subject}`;
        if (!uniquePermissions.has(defaultKey)) {
          userPermissions.push(defaultPerm);
        }
      });

      return userPermissions;
    }
    return DEFAULT_PERMISSIONS;
  }, [session]);

  const hasPermission = (action: string, subject: string) => {
    return permissions.some(p => p.action === action && p.subject === subject);
  };

  return { permissions, hasPermission };
};

// 3. Hook for user data
export const useUserData = () => {
  const { data: session } = useSession();
  
  return {
    user: session?.user,
    roles: session?.user?.roles || [],
    isLoading: !session
  };
};

// 4. Specialized hook for common permission checks
export const useCommonPermissions = () => {
  const { hasPermission } = usePermissions();
  
  return {
    canViewDashboard: hasPermission('view', 'dashboard'),
    canManageUsers: hasPermission('manage', 'users'),
    canManageRoles: hasPermission('manage', 'roles'),
    canViewSettings: hasPermission('view', 'settings')
  };
};

// Maintain your existing permission conversion function
function convertBackendPermission(permissionString: string): Permission {
  const actionMap: Record<string, string> = {
    add: 'create',
    create: 'create',
    edit: 'update',
    update: 'update',
    delete: 'delete',
    remove: 'delete',
    view: 'view',
    assign: 'manage',
    detail: 'view'
  };

  const subjectMap: Record<string, string> = {
    user: 'user',
    role: 'roles',
    permission: 'permissions',
    notification: 'notifications',
    saving: 'saving',
    loan: 'loans',
    branch: 'branches',
    dashboard: 'dashboard',
    setting: 'settings',
    invoice: 'invoices'
  };

  const conditionalPermissions: Record<string, any> = {
    assign_roles_to_users: { canAssignRoles: true },
    assign_permission_to_roles: { canManagePermissions: true }
  };

  const parts = permissionString.split('_');
  let actionPart = parts[0];
  let subjectPart = parts[parts.length - 1];

  if (permissionString === 'remove_permission') {
    actionPart = 'delete';
    subjectPart = 'permissions';
  }

  const action = actionMap[actionPart] || 'view';
  const subject = subjectMap[subjectPart] || subjectPart;
  const conditions = conditionalPermissions[permissionString];

  return conditions 
    ? { action, subject, conditions } 
    : { action, subject };
}