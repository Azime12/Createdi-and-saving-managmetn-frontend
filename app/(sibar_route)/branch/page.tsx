'use client'

import React from 'react'
import BranchManagement from '@/app/ui/branches/manageBranch'
import { usePageAccess } from '@/hooks/usePageAccess'

export default function BranchPage() {
  const { canAccess, loading } = usePageAccess('view', 'branches')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 dark:text-gray-300 text-lg">Checking access...</p>
      </div>
    )
  }

  if (!canAccess) return null // Redirect handled inside hook

  return (
    <div>
      <BranchManagement />
    </div>
  )
}
