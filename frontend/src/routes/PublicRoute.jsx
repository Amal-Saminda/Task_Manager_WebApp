import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getDashboardPath } from './paths';

// Login / sign-up are hidden from users who are already signed in.
export default function PublicRoute() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) return <Navigate to={getDashboardPath(user?.role)} replace />;

  return <Outlet />;
}
