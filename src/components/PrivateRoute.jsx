import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { API_ENDPOINTS, axiosInstance } from '../service/APIConfig';

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/me', { withCredentials: true })
      .then(() => setAuth(true))
      .catch(() => setAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // or loading spinner

  return auth ? children : <Navigate to="/dashboard/login" replace />;
  // return children ;
};

export default PrivateRoute;