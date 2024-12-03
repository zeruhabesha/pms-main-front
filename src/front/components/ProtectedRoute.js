import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element: Component }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem('token'); // Ensure token is checked

  // Check if authenticated either by Redux state or token
  return isAuthenticated || token ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
