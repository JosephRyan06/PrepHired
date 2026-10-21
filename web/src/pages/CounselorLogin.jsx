import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { counselorApi, getCounselorSession } from "../api/counselorApi";

const CounselorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, counselor } = getCounselorSession();

  if (token && counselor?.role === "counselor") return <Navigate to="/counselor/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await counselorApi.login(email.trim(), password);
      counselorApi.saveSession(data.token, data.counselor);
      navigate("/counselor/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <section className="login-left"><div className="brand"><div className="brand-logo">P</div><div><h3>PrepHired</h3><span>Career Guidance</span></div></div><div className="left-content"><span className="admin-label">COUNSELOR ACCESS</span><h1>Guide the next<span> move.</span></h1><p>Review assigned students, record private notes, and help each person move toward their career goals.</p></div><div className="left-footer"><span>Assigned students only</span></div></section>
        <section className="login-right"><form className="login-form" onSubmit={handleSubmit}><div className="login-header"><h2>Counselor sign in</h2><p>Use the account created by your administrator.</p></div>{error && <div className="form-error" role="alert">{error}</div>}<div className="form-group"><label htmlFor="counselor-email">Email</label><input id="counselor-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></div><div className="form-group"><label htmlFor="counselor-password">Password</label><input id="counselor-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div><button className="login-button" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in to counselor workspace"}</button><Link className="counselor-login-link" to="/login">Administrator sign in</Link></form></section>
      </div>
    </div>
  );
};

export default CounselorLogin;