// hooks/usePageAccess.ts
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAbility } from '@/context/AbilityContext'

export function usePageAccess(action: string, subject: string) {
  const ability = useAbility()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [canAccess, setCanAccess] = useState(false)

  useEffect(() => {
    const allowed = ability.can(action, subject)
    setCanAccess(allowed)
    setLoading(false)

    if (!allowed) {
      router.replace('/403')
    }
  }, [ability, action, subject, router])

  return { canAccess, loading }
}
