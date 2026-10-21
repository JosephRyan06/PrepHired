
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import RequireAuth from "../auth/RequireAuth";
import AdminLayout from "../components/AdminLayout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Resumes from "../pages/Resumes";
import Interviews from "../pages/Interviews";
import AuditLog from "../pages/AuditLog";
import CounselorManagement from "../pages/CounselorManagement";
import CounselorLogin from "../pages/CounselorLogin";
import CounselorWorkspace from "../pages/CounselorWorkspace";
import RequireCounselor from "../auth/RequireCounselor";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/counselors" element={<CounselorManagement />} />
            <Route path="/resumes" element={<Resumes />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/audit-log" element={<AuditLog />} />
          </Route>
        </Route>

        <Route path="/counselor/login" element={<CounselorLogin />} />
        <Route element={<RequireCounselor />}>
          <Route path="/counselor/dashboard" element={<CounselorWorkspace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
