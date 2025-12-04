import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { role, token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
