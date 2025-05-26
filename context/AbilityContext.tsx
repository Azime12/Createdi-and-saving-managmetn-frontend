'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { Action, AppAbility, checkPermissions, defineAbilityFor, Permission } from '@/app/lib/ability'
import { Subject } from '@casl/ability'

interface AbilityContextType {
  ability: AppAbility
  can: (action: Action | Action[], subject: Subject) => boolean
}

const AbilityContext = createContext<AbilityContextType | null>(null)

export const AbilityProvider = ({
  children,
  permissions,
}: {
  children: React.ReactNode
  permissions: Permission[]
}) => {
  const ability = useMemo(() => defineAbilityFor(permissions), [permissions])
  
  const can = (action: Action | Action[], subject: Subject) => {
    return checkPermissions(ability, action, subject)
  }

  const value = useMemo(() => ({ ability, can }), [ability])

  return <AbilityContext.Provider value={value}>{children}</AbilityContext.Provider>
}

export const useAbility = () => {
  const context = useContext(AbilityContext)
  if (!context) throw new Error('useAbility must be used inside AbilityProvider')
  return context
}
