import { Navigate, Route, Routes } from 'react-router-dom';
import { Login, SingUp } from '../modules/auth';
import { Dashboard , CreateTask , TeamMembers , ManageTask } from '../modules/admin';
import { UserDashboard, MyTasks, TaskDetails } from '../modules/user';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { PATHS, ROLES } from './paths';

export default function AppRoutes() {

  return (
    <Routes>
      {/* Public (redirects to dashboard when already logged in) */}
      <Route element={<PublicRoute />}>
        <Route path='/login' element={<Login />} />
        <Route path='/SingUp' element={<SingUp />} />
      </Route>

      {/* Admin only */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/admin/create-task' element={<CreateTask />} />
        <Route path='/admin/team-members' element={<TeamMembers />} />
        <Route path='/admin/manage-tasks' element={<ManageTask />} />
      </Route>

      {/* Normal users only */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
        <Route path='/user/dashboard' element={<UserDashboard />} />
        <Route path='/user/my-tasks' element={<MyTasks />} />
        <Route path={PATHS.USER_TASK_DETAILS} element={<TaskDetails />} />
      </Route>

      <Route path='/' element={<Navigate to={PATHS.LOGIN} replace />} />
      <Route path='*' element={<Navigate to={PATHS.LOGIN} replace />} />
    </Routes>
  );
}
