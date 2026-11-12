export const staffPermissions = {
  viewDashboard: 'DASHBOARD_VIEW',
  manageStaffAccounts: 'ROLE_MANAGE_ROLES',
  manageAmenities: 'ROLE_MANAGE_ROLES',
};

export function getRoleNames(user) {
  return (user?.roles || []).map((role) => typeof role === 'string' ? role : role?.name).filter(Boolean);
}

export function hasRole(user, roleName) {
  return getRoleNames(user).includes(roleName);
}

export function getPermissionCodes(user) {
  const directPermissions = (user?.permissions || []).map((permission) => (
    typeof permission === 'string' ? permission : permission?.code
  )).filter(Boolean);
  const rolePermissions = (user?.roles || []).flatMap((role) => {
    if (typeof role === 'string') return [];
    return (role?.permissions || []).map((permission) => permission?.code).filter(Boolean);
  });
  return [...new Set([...directPermissions, ...rolePermissions])];
}

export function hasPermission(user, permissionCode) {
  return getPermissionCodes(user).includes(permissionCode);
}
