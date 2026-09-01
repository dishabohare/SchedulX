import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { LoadingSpinner } from '../ui-states/LoadingSpinner';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const getRoleDashboard = (role: UserRole | null): string => {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'DOCTOR':
      return '/doctor/dashboard';
    case 'STAFF':
      return '/staff/dashboard';
    case 'PATIENT':
      return '/patient/dashboard';
    default:
      return '/login';
  }
};

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, role, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Checking portal access permissions..." />
      </div>
    );
  }

  if (!isAuthenticated || !user || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Redirect unauthorized user back to their role's authorized dashboard
    const defaultTarget = getRoleDashboard(role);
    return <Navigate to={defaultTarget} replace />;
  }

  return <>{children}</>;
};
