
export const PATHS = {
  LOGIN: '/login',
  SIGN_UP: '/SingUp',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CREATE_TASK: '/admin/create-task',
  ADMIN_TEAM_MEMBERS: '/admin/team-members',
  ADMIN_MANAGE_TASK: '/admin/manage-tasks',
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
