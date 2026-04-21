import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useAuth, getPathForRole } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to={getPathForRole(user.rol)} replace />;
  }

  return <>{children}</>;
}
