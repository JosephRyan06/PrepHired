import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, request, signOut } from "./api";
import PrepHiredLogo from "../../mobile/assets/PrepHiredLoginLogo.jpg";
import "./thirduser.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const { token, user } = getSession();
  const [data, setData] = useState({ counselors: [], students: [] });
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    const result = await request("/thirduser/admin/users", token);
    setData(result);
    setAssignments(Object.fromEntries(result.counselors.map((item) => [
      item._id,
      item.assignedStudentIds.map((id) => String(id)),
    ])));
  };

  useEffect(() => {
    if (!token || !user) return navigate("/login", { replace: true });
    if (user.role !== "admin") return navigate("/counselor", { replace: true });
    loadUsers()
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  const createCounselor = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    try {
      await request("/thirduser/admin/counselors", token, {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      setNotice("Counselor account created. Share the temporary password securely.");
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const saveAssignments = async (counselorId) => {
    setError("");
    setNotice("");
    try {
      await request(`/thirduser/admin/counselors/${counselorId}/assignments`, token, {
        method: "PUT",
        body: JSON.stringify({ studentIds: assignments[counselorId] || [] }),
      });
      setNotice("Student assignments updated.");
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const toggleStudent = (counselorId, studentId) => {
    setAssignments((current) => {
      const selected = current[counselorId] || [];
      const next = selected.includes(studentId)
        ? selected.filter((id) => id !== studentId)
        : [...selected, studentId];
      return { ...current, [counselorId]: next };
    });
  };

  if (!token || user?.role !== "admin") return null;

  return (
    <main className="thirduser-shell">
      <aside className="thirduser-rail">
        <a className="thirduser-brand" href="/admin" aria-label="PrepHired admin">
          <img src={PrepHiredLogo} alt="" />
          <span>PrepHired<small>CAREER SERVICES</small></span>
        </a>
        <div className="rail-label">WORKSPACE</div>
        <a className="rail-link rail-link-active" href="/admin"><span>01</span> Counselors</a>
        <div className="rail-user">
          <span className="user-avatar">{user.fullName?.slice(0, 1) || "A"}</span>
          <span>{user.fullName}<small>Administrator</small></span>
        </div>
      </aside>

      <section className="thirduser-main">
        <header className="workspace-topbar">
          <div><span className="eyebrow">ADMINISTRATION / TEAM ACCESS</span><h1>Counselor management</h1></div>
          <button className="button button-quiet" onClick={() => signOut(navigate)}>Sign out</button>
        </header>

        <section className="workspace-intro">
          <div>
            <div className="eyebrow">THIRD USER ROLE</div>
            <h2>Bring career guidance into the loop.</h2>
            <p>Create counselor accounts and explicitly assign students before reports or appointments become visible.</p>
          </div>
          <div className="intro-stat"><strong>{data.counselors.length}</strong><span>ACTIVE COUNSELORS</span></div>
          <div className="intro-stat"><strong>{data.students.length}</strong><span>STUDENT ACCOUNTS</span></div>
        </section>

        {error && <div className="status-message status-error" role="alert">{error}</div>}
        {notice && <div className="status-message status-success" role="status">{notice}</div>}

        <div className="admin-grid">
          <section className="workspace-section create-section">
            <div className="section-heading"><div><span className="eyebrow">NEW ACCOUNT</span><h2>Register a counselor</h2></div><span className="section-mark">+</span></div>
            <form className="workspace-form" onSubmit={createCounselor}>
              <div className="form-row">
                <label>First name<input required value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} /></label>
                <label>Last name<input required value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} /></label>
              </div>
              <label>Work email<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
              <label>Temporary password<input required type="password" minLength={12} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><small>At least 12 characters. Send it to the counselor through a separate secure channel.</small></label>
              <button className="button button-primary" disabled={saving}>{saving ? "Creating account..." : "Create counselor account"}</button>
            </form>
          </section>

          <section className="workspace-section assignment-section">
            <div className="section-heading"><div><span className="eyebrow">ACCESS CONTROL</span><h2>Assign students</h2></div><span className="section-mark section-mark-blue">↗</span></div>
            {loading ? <div className="empty-state">Loading accounts...</div> : data.counselors.length === 0 ? <div className="empty-state">Create a counselor account to begin assigning students.</div> : (
              <div className="assignment-list">
                {data.counselors.map((counselor) => (
                  <article className="assignment-row" key={counselor._id}>
                    <div className="assignment-person"><span className="person-avatar">{counselor.firstName?.slice(0, 1)}{counselor.lastName?.slice(0, 1)}</span><div><strong>{counselor.fullName}</strong><small>{counselor.email}</small></div><span className="assignment-count">{assignments[counselor._id]?.length || 0} assigned</span></div>
                    <div className="student-checks">
                      {data.students.length === 0 ? <span className="muted-copy">No student accounts yet.</span> : data.students.map((student) => (
                        <label className="student-check" key={student._id}>
                          <input type="checkbox" checked={(assignments[counselor._id] || []).includes(student._id)} onChange={() => toggleStudent(counselor._id, student._id)} />
                          <span>{student.fullName}<small>{student.email}</small></span>
                        </label>
                      ))}
                    </div>
                    <button className="button button-secondary" onClick={() => saveAssignments(counselor._id)}>Save assignments</button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default AdminPage;