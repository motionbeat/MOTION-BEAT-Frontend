import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const CheckAuth = () => {
  const token = sessionStorage.getItem("userToken");
  return token && token.split('.').length === 3;
};

const PrivateRoute = () => {
  const isUserAuth = CheckAuth();
  return isUserAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;