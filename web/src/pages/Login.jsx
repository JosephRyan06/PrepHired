import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginThirdUser } from "../../../thirduser/pages/api";
import PrepHiredLogo from "../../../mobile/assets/PrepHiredLoginLogo.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginThirdUser(email, password);
      localStorage.setItem("thirduser.token", data.token);
      localStorage.setItem("thirduser.user", JSON.stringify(data.user));
      navigate(data.user.role === "admin" ? "/admin" : "/counselor");
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in. Check your connection and try again.");
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
            <img className="brand-logo-image" src={PrepHiredLogo} alt="PrepHired" />

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
              <img className="brand-logo-image" src={PrepHiredLogo} alt="PrepHired" />
            </div>

            <div className="login-header">
              <h2>Login</h2>

              <p>Sign in with your administrator account to continue.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                    onChange={(event) => setPassword(event.target.value)}
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
              {error && <p className="login-error" role="alert">{error}</p>}
              <div className="forgotPassword">
                <a className="forgotPasswordText" href="/forgot-password">
                  Forgot password?
                </a>
              </div>

              {/* LOGIN */}
              <button type="submit" className="login-button" disabled={loading}>
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
