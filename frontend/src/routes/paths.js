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

export const getDashboardPath = (role) =>
  role === ROLES.ADMIN ? PATHS.ADMIN_DASHBOARD : PATHS.USER_DASHBOARD;
