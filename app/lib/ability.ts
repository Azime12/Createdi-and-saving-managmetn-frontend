import { AbilityBuilder, createMongoAbility, MongoAbility, Subject } from '@casl/ability'

// Define all possible actions and subjects
export const actions = ['view', 'create', 'update', 'delete', 'manage', 'detail'] as const
export const subjects = [
  'dashboard',
  'invoices',
  'customers',
  'user',
  'branches',
  'saving',
  'loans',
  'settings',
  'roles',
  'permissions',
  'security',
  'notifications',
  'password',
  '2fa',
  'all'
] as const

export type Action = typeof actions[number]
export type AppSubject = typeof subjects[number] | string

// Strongly typed conditions
export interface Conditions {
  [key: string]: any
}

export interface Permission {
  action: Action | Action[]
  subject: AppSubject
  conditions?: Conditions
  fields?: string[]
}

export type AppAbility = MongoAbility<[Action, AppSubject]>

// Properly typed ability creation
export const defineAbilityFor = (permissions: Permission[]): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  permissions.forEach(permission => {
    const actions = Array.isArray(permission.action) ? permission.action : [permission.action]
    
    actions.forEach(action => {
      if (permission.conditions && permission.fields) {
        can(action, permission.subject, permission.fields, permission.conditions)
      } else if (permission.conditions) {
        can(action, permission.subject, permission.conditions)
      } else if (permission.fields) {
        can(action, permission.subject, permission.fields)
      } else {
        can(action, permission.subject)
      }
    })
  })

  return build()
}

// Properly typed permission check
export const checkPermissions = (
  ability: AppAbility,
  action: Action | Action[],
  subject: AppSubject,
  conditions?: Conditions
): boolean => {
  const actions = Array.isArray(action) ? action : [action]
  
  return actions.some(a => {
    try {
      // Handle both field-level and regular permissions
      if (conditions) {
        return ability.can(a, subject, conditions)
      }
      return ability.can(a, subject)
    } catch (error) {
      console.error('Permission check error:', error)
      return false
    }
  })
}