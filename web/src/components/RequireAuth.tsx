// src/components/RequireAuth.js
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RequireAuth() {
  const { userId, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!userId) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated, render the child routes using Outlet
  return <Outlet />;
}

export default RequireAuth;
