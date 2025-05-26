'use client'

import { usePageAccess } from '@/hooks/usePageAccess'

export default function UsersPage() {
  const { canAccess, loading } = usePageAccess('view', 'ksj')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300">Checking permissions...</div>
      </div>
    )
  }

  if (!canAccess) return null // Will redirect automatically

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">User Management</h1>
      <div>{/* Your Users Table or Content */}</div>
    </div>
  )
}
