export const staffPermissions = {
  viewDashboard: 'DASHBOARD_VIEW',
  manageStaffAccounts: 'ROLE_MANAGE_ROLES',
};

export function getRoleNames(user) {
  return (user?.roles || []).map((role) => typeof role === 'string' ? role : role?.name).filter(Boolean);
}

export function hasRole(user, roleName) {
  return getRoleNames(user).includes(roleName);
}

export function getPermissionCodes(user) {
  return (user?.roles || []).flatMap((role) => {
    if (typeof role === 'string') return [];
    return (role?.permissions || []).map((permission) => permission?.code).filter(Boolean);
  });
}

export function hasPermission(user, permissionCode) {
  return getPermissionCodes(user).includes(permissionCode);
}
