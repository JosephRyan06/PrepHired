import React, { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Admin login submitted");
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
              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
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
              <div className="forgotPassword">
                <a className="forgotPasswordText" href="/forgot-password">
                  Forgot password?
                </a>
              </div>

              {/* LOGIN */}
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
