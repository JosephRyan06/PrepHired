import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getToken } from "../api/adminApi";

const RequireAuth = () => {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
