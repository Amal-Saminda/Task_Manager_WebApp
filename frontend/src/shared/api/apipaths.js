export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER : "/api/auth/register", //register new user (Admin Or User)
    LOGIN: "/api/auth/login", //Authenti. user & return JWT token
    GET_PROFILE: "api/auth/profile" //get logged user details
  },

  USERS: {
    GET_ALL_USERS: "/api/user", //admin only
    GET_USER_BY_IDS: (userId) => `/api/users/${userId}`,
    CREATE_USER: "/api/users", //create new users(Admin only)
    UPDATE_USER: (userId) => `/api/users/${userId}`,
    DELETE_USER : (userId) => `/api/users/${userId}`

  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-date",
    GET_ALL_TASKS: "/api/tasks",
    GET_TASKS_BY_ID: (taskId) => `/api/tasks/${taskId}`,
    CREATE_TASK: "/api/tasks",
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,

    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`,
  },

  REPORTS: {
    EXPORT_TASKS: "api/reports/export/tasks",
    EXPORT_USERS: "api/reports/export/users",
  },

  IMAGE: {
    UPLOAD_IMAGE: "api/auth/upload-image",
  }
}