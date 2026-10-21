import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { clearSession, getAdmin } from "../api/adminApi";
import { initials } from "../utils/format";
import Icon from "./Icon";

import "../styles/admin.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/users", label: "Users", icon: "users" },
  { to: "/counselors", label: "Counselors", icon: "users" },
  { to: "/resumes", label: "Resumes", icon: "resume" },
  { to: "/interviews", label: "Mock interviews", icon: "interview" },
  { to: "/audit-log", label: "Audit log", icon: "audit" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const admin = getAdmin();

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">P</div>

          <div>
            <h3>PrepHired</h3>
            <span>Admin console</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link-active" : ""}`
              }
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-chip">
            <div className="avatar">{initials(admin?.fullName)}</div>

            <div className="admin-chip-text">
              <strong>{admin?.fullName || "Administrator"}</strong>
              <span>{admin?.email}</span>
            </div>
          </div>

          <button type="button" className="nav-link logout" onClick={handleLogout}>
            <Icon name="logout" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
