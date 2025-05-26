'use client'

import { SidebarProvider } from '@/context/SidebarContext'
import { TopBar } from '@/app/ui/topbar/TopBar'
import SideBarMain from '@/app/ui/sidebar/SideBarMain'
import { AbilityProvider } from '@/context/AbilityContext'
import { Permission, Action, AppSubject } from '../lib/ability'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const DEFAULT_PERMISSIONS: Permission[] = [
  { action: 'view', subject: 'dashboard' },
  { action: 'view', subject: 'profile' }

]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [permissions, setPermissions] = useState<Permission[]>([])

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userPermissions: Permission[] = []
      const uniquePermissions = new Set<string>()
      
      // Process all roles and their permissions
      session.user.roles?.forEach(role => {
        role.permissions?.forEach(permissionString => {
          const permission = convertBackendPermission(permissionString)
          const permissionKey = `${permission.action}_${permission.subject}`
          
          if (!uniquePermissions.has(permissionKey)) {
            uniquePermissions.add(permissionKey)
            userPermissions.push(permission)
          }
        })
      })

      // Add default permissions only if they don't exist
      DEFAULT_PERMISSIONS.forEach(defaultPerm => {
        const defaultKey = `${defaultPerm.action}_${defaultPerm.subject}`
        if (!uniquePermissions.has(defaultKey)) {
          userPermissions.push(defaultPerm)
        }
      })

      setPermissions(userPermissions)
    }
  }, [status, session])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider >
      <AbilityProvider permissions={permissions}>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          <SideBarMain />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-y-auto pt-8 pb-4 px-4 bg-gray-100 dark:bg-gray-800">
              {children}
            </main>
          </div>
        </div>
      </AbilityProvider>
    </SidebarProvider>
  )
}

// Conversion function for backend permissions to CASL format
function convertBackendPermission(permissionString: string): Permission {
  // First map the backend permissions to standard actions
  const actionMap: Record<string, Action> = {
    add: 'create',
    create: 'create',
    edit: 'update',
    update: 'update',
    delete: 'delete',
    remove: 'delete',
    view: 'view',
    assign: 'manage',
    detail: 'view' // Mapping 'detail' to 'view' action
  }

  // Then map to standard subjects
  const subjectMap: Record<string, AppSubject> = {
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
  }

  // Special cases that need conditions
  const conditionalPermissions: Record<string, any> = {
    assign_roles_to_users: { canAssignRoles: true },
    assign_permission_to_roles: { canManagePermissions: true }
  }

  const parts = permissionString.split('_')
  let actionPart = parts[0]
  let subjectPart = parts[parts.length - 1]

  // Special handling for multi-part permissions
  if (permissionString === 'remove_permission') {
    actionPart = 'delete'
    subjectPart = 'permissions'
  }

  const action = actionMap[actionPart] || 'view'
  const subject = subjectMap[subjectPart] || subjectPart
  const conditions = conditionalPermissions[permissionString]

  return conditions 
    ? { action, subject, conditions } 
    : { action, subject }
}