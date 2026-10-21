import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import AdminPage from "../../../thirduser/pages/AdminPage";
import CounselorPage from "../../../thirduser/pages/CounselorPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/counselor" element={<CounselorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
