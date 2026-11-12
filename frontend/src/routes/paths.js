
export const PATHS = {
  LOGIN: '/login',
  SIGN_UP: '/SingUp',
  ADMIN_DASHBOARD: '/admin/dashboard',
  USER_DASHBOARD: '/user/dashboard',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const normalizeRole = (role) =>
  String(role ?? '').toLowerCase() === ROLES.ADMIN
    ? ROLES.ADMIN
    : ROLES.USER;

export const getDashboardPath = (role) => {
  return normalizeRole(role) === ROLES.ADMIN
    ? PATHS.ADMIN_DASHBOARD
    : PATHS.USER_DASHBOARD;
};
