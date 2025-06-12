import { Navigate, Outlet } from 'react-router';

import { useAuthToken } from '@/states/Auth.state';

export function ProtectedRoute() {
  const token = useAuthToken();

  return token
    ? <Outlet />
    : <Navigate to="/" replace />;
}