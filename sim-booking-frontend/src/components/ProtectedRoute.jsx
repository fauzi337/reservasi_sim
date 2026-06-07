import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
  }

  // If not logged in, redirect to login page
  if (!token || !user) {
    // Clear any corrupted data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if the user's role matches one of the allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is admin, send them to admin home, otherwise to customer home
    if (user.role === 'admin') {
      return <Navigate to="/viewer-landing" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
