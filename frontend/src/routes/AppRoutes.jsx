import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../modules/auth/pages/Auth/Login.jsx';
import SingUp from '../modules/auth/pages/Auth/SingUp.jsx';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { PATHS, ROLES } from './paths';

// TODO: adjust these two imports to where your dashboards actually live
import Dashboard from '../modules/auth/pages/admin/Dashboard.jsx';
import UserDashboard from '../modules/auth/pages/user/UserDashboard.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public (redirects to dashboard when already logged in) */}
      <Route element={<PublicRoute />}>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SingUp />} />
      </Route>

      {/* Admin only */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path='/admin/dashboard' element={<Dashboard />} />
      </Route>

      {/* Normal users only */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
        <Route path='/user/dashboard' element={<UserDashboard />} />
      </Route>

      <Route path='/' element={<Navigate to={PATHS.LOGIN} replace />} />
      <Route path='*' element={<Navigate to={PATHS.LOGIN} replace />} />
    </Routes>
  );
}
