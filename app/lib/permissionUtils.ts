export function checkPermissions(ability, action, subject, conditions) {
  const actions = Array.isArray(action) ? action : [action];
  
  return actions.some(a => {
    try {
      if (conditions) {
        return ability.can(a, subject, conditions);
      }
      return ability.can(a, subject);
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  });
}

export function usePermissionCheck(action, subject, conditions) {
  const ability = useAbility();
  return checkPermissions(ability, action, subject, conditions);
}