import { Navigate, Route, Routes } from 'react-router-dom';
import { Login, SingUp } from '../modules/auth';
import { Dashboard } from '../modules/admin';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { PATHS, ROLES } from './paths';

// TODO: adjust this import to where your user dashboard actually lives
// import UserDashboard from '../pages/user/UserDashboard';

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
      </Route>

      {/* Normal users only */}
      {/* <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
        <Route path='/user/dashboard' element={<UserDashboard />} />
      </Route> */}

      <Route path='/' element={<Navigate to={PATHS.LOGIN} replace />} />
      <Route path='*' element={<Navigate to={PATHS.LOGIN} replace />} />
    </Routes>
  );
}
