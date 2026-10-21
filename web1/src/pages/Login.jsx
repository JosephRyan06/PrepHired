import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { adminApi, getToken, setSession } from "../api/adminApi";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in? Skip the form.
  if (getToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await adminApi.login(email.trim(), password);

      setSession(data.token, data.admin);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* LEFT SIDE */}
        <div className="login-left">
          <div className="brand">
            <div className="brand-logo">P</div>

            <div>
              <h3>PrepHired</h3>
              <span>Career Management System</span>
            </div>
          </div>

          <div className="left-content">
            <span className="admin-label">ADMINISTRATOR ACCESS</span>

            <h1>
              Manage your
              <span> platform.</span>
            </h1>

            <p>
              Access the administration dashboard to manage users, monitor
              activity, and control your system.
            </p>
          </div>

          <div className="left-footer">
            <span>Secure Access</span>
            <span>•</span>
            <span>Administrator Only</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <div className="login-form">
            <div className="mobile-logo">
              <div className="brand-logo">A</div>
            </div>

            <div className="login-header">
              <h2>Login</h2>

              <p>Sign in with your administrator account to continue.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="password">Password</label>
                </div>

                <div className="password-input">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* LOGIN */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
