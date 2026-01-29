import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has one of them
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on user's role
    if (user.role === 'owner') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/pos" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;