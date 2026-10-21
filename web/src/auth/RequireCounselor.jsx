import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCounselorSession } from "../api/counselorApi";

const RequireCounselor = () => {
  const { token, counselor } = getCounselorSession();
  // Counselor tokens stay separate from the upstream administrator session.
  return token && counselor?.role === "counselor"
    ? <Outlet />
    : <Navigate to="/counselor/login" replace />;
};

export default RequireCounselor;