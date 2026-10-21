import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { adminApi, getToken, setSession } from "../api/adminApi";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (getToken()) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await adminApi.login(email.trim(), password);
      setSession(data.token, data.admin);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <section className="login-left">
          <div className="brand"><div className="brand-logo">P</div><div><h3>PrepHired</h3><span>Career Management System</span></div></div>
          <div className="left-content"><span className="admin-label">ADMINISTRATOR ACCESS</span><h1>Manage your<span> platform.</span></h1><p>Access the administration dashboard to manage users, monitor activity, and control your system.</p></div>
          <div className="left-footer"><span>Secure Access</span><span>·</span><span>Administrator Only</span></div>
        </section>
        <section className="login-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-header"><h2>Login</h2><p>Sign in with your administrator account to continue.</p></div>
            {error && <div className="form-error" role="alert">{error}</div>}
            <div className="form-group"><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></div>
            <div className="form-group"><div className="password-header"><label htmlFor="password">Password</label></div><div className="password-input"><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? "Hide" : "Show"}</button></div></div>
            <button type="submit" className="login-button" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
            <Link className="counselor-login-link" to="/counselor/login">Career counselor sign in</Link>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;