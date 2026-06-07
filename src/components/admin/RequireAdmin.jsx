import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

/**
 * Protege rutas admin. Si no hay sesión, redirige al login (/admin).
 */
export function RequireAdmin({ children }) {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <Navigate to="/admin" replace />;
  return children;
}
