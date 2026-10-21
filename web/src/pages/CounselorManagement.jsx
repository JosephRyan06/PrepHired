import { useState } from "react";
import { adminApi } from "../api/adminApi";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import useAsync from "../hooks/useAsync";

const emptyForm = { firstName: "", lastName: "", email: "", password: "" };

const CounselorManagement = () => {
  const [form, setForm] = useState(emptyForm);
  const [assignments, setAssignments] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { data, loading, error: loadError, reload } = useAsync(() => adminApi.counselors());
  const counselorData = data || { counselors: [], students: [] };

  const createCounselor = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    try {
      await adminApi.createCounselor(form);
      setForm(emptyForm);
      setNotice("Counselor account created. Share the temporary password securely.");
      reload();
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
      const counselor = counselorData.counselors.find((item) => item._id === counselorId);
      const studentIds = assignments[counselorId] || counselor?.assignedStudentIds.map(String) || [];
      await adminApi.assignCounselorStudents(counselorId, studentIds);
      setNotice("Student assignments updated.");
      setAssignments((current) => {
        const next = { ...current };
        delete next[counselorId];
        return next;
      });
      reload();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const toggleStudent = (counselorId, studentId) => {
    setAssignments((current) => {
      const counselor = counselorData.counselors.find((item) => item._id === counselorId);
      const selected = current[counselorId] || counselor?.assignedStudentIds.map(String) || [];
      return {
        ...current,
        [counselorId]: selected.includes(studentId)
          ? selected.filter((id) => id !== studentId)
          : [...selected, studentId],
      };
    });
  };

  return (
    <>
      <header className="page-header"><div><h1>Counselors</h1><p>Create career counselor accounts and assign their student caseloads.</p></div></header>
      {(error || loadError) && <div className="form-error" role="alert">{error || loadError}</div>}
      {notice && <div className="toast" role="status">{notice}</div>}

      <section className="card counselor-admin-card">
        <div className="card-head"><h2>Register a Career Guidance Counselor</h2><span>Accounts are created by an administrator and can only access assigned students.</span></div>
        <form className="counselor-create-form" onSubmit={createCounselor}>
          <label>First name<input required value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} /></label>
          <label>Last name<input required value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} /></label>
          <label>Email<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label className="counselor-password-field">Temporary password<input required type="password" minLength={12} maxLength={72} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><small>12 to 72 characters. Share it through a separate secure channel.</small></label>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Creating..." : "Create counselor account"}</button>
        </form>
      </section>

      <section className="card counselor-assignment-card">
        <div className="card-head"><h2>Student assignments</h2><span>Only active student accounts can be assigned.</span></div>
        {loading ? <p className="muted">Loading counselor accounts...</p> : counselorData.counselors.length === 0 ? <EmptyState title="No counselors yet" text="Create a counselor account above to begin assigning students." /> : (
          <div className="counselor-assignment-list">
            {counselorData.counselors.map((counselor) => (
              <article className="counselor-assignment" key={counselor._id}>
                <div className="counselor-assignment-head"><div><strong>{counselor.fullName}</strong><span className="muted">{counselor.email}</span></div><StatusBadge tone={counselor.isEnabled ? "good" : "bad"}>{counselor.isEnabled ? "Active" : "Disabled"}</StatusBadge></div>
                {counselorData.students.length === 0 ? <p className="muted">No active students are available.</p> : <div className="counselor-student-list">{counselorData.students.map((student) => <label key={student._id}><input type="checkbox" checked={(assignments[counselor._id] || counselor.assignedStudentIds.map(String)).includes(student._id)} onChange={() => toggleStudent(counselor._id, student._id)} /><span>{student.fullName}<small>{student.email}</small></span></label>)}</div>}
                <button type="button" className="btn btn-ghost" onClick={() => saveAssignments(counselor._id)}>Save assignments <span>({assignments[counselor._id]?.length ?? counselor.assignedStudentIds.length})</span></button>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default CounselorManagement;