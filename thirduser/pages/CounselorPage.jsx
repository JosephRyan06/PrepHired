import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, request, signOut } from "./api";
import PrepHiredLogo from "../../mobile/assets/PrepHiredLoginLogo.jpg";
import "./thirduser.css";

const formatDate = (value, options = { month: "short", day: "numeric", year: "numeric" }) =>
  value ? new Date(value).toLocaleDateString(undefined, options) : "Not recorded";

const formatDateTime = (value) => value
  ? new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
  : "Time not set";

const CounselorPage = () => {
  const navigate = useNavigate();
  const { token, user } = getSession();
  const [dashboard, setDashboard] = useState({ students: [], appointments: [], needsAttention: 0, averageReadiness: 0 });
  const [appointments, setAppointments] = useState([]);
  const [report, setReport] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [note, setNote] = useState("");
  const [task, setTask] = useState({ title: "", details: "", category: "resume" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    const [result, sessionResult] = await Promise.all([
      request("/thirduser/counselor/dashboard", token),
      request("/thirduser/counselor/appointments", token),
    ]);
    setDashboard(result);
    setAppointments(sessionResult.appointments);
    if (selectedId && result.students.some((student) => student._id === selectedId)) {
      await loadStudent(selectedId);
    }
  };

  const loadStudent = async (studentId) => {
    setSelectedId(studentId);
    setReportLoading(true);
    try {
      setReport(await request(`/thirduser/counselor/students/${studentId}`, token));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !user) return navigate("/login", { replace: true });
    if (user.role !== "counselor") return navigate("/admin", { replace: true });
    loadDashboard()
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  const submitNote = async (event) => {
    event.preventDefault();
    if (!selectedId || !note.trim()) return;
    setError("");
    try {
      await request(`/thirduser/counselor/students/${selectedId}/notes`, token, {
        method: "POST",
        body: JSON.stringify({ content: note }),
      });
      setNote("");
      setNotice("Private counseling note saved.");
      await loadStudent(selectedId);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const submitTask = async (event) => {
    event.preventDefault();
    if (!selectedId || !task.title.trim()) return;
    setError("");
    try {
      await request(`/thirduser/counselor/students/${selectedId}/recommendations`, token, {
        method: "POST",
        body: JSON.stringify(task),
      });
      setTask({ title: "", details: "", category: "resume" });
      setNotice("Progress task added to the student's plan.");
      await loadStudent(selectedId);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const updateTask = async (recommendationId, status) => {
    try {
      await request(`/thirduser/counselor/recommendations/${recommendationId}`, token, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await loadStudent(selectedId);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const updateAppointment = async (appointmentId, status) => {
    setError("");
    try {
      await request(`/thirduser/counselor/appointments/${appointmentId}`, token, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setNotice(`Appointment ${status}.`);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!token || user?.role !== "counselor") return null;

  const latestResume = report?.resumes?.[0];
  const latestInterview = report?.interviews?.[0];
  const studentName = report?.student?.fullName || "Student report";

  return (
    <main className="thirduser-shell counselor-shell">
      <aside className="thirduser-rail">
        <a className="thirduser-brand" href="/counselor" aria-label="PrepHired counselor">
          <img src={PrepHiredLogo} alt="" />
          <span>PrepHired<small>CAREER SERVICES</small></span>
        </a>
        <div className="rail-label">COUNSELOR SPACE</div>
        <a className="rail-link rail-link-active" href="#overview"><span>01</span> Overview</a>
        <a className="rail-link" href="#students"><span>02</span> My students</a>
        <a className="rail-link" href="#sessions"><span>03</span> Sessions</a>
        <div className="rail-user">
          <span className="user-avatar">{user.fullName?.slice(0, 1) || "C"}</span>
          <span>{user.fullName}<small>Career counselor</small></span>
        </div>
      </aside>

      <section className="thirduser-main">
        <header className="workspace-topbar" id="overview">
          <div><span className="eyebrow">COUNSELOR WORKSPACE</span><h1>Your students, in focus.</h1></div>
          <button className="button button-quiet" onClick={() => signOut(navigate)}>Sign out</button>
        </header>
        {error && <div className="status-message status-error" role="alert">{error}</div>}
        {notice && <div className="status-message status-success" role="status">{notice}</div>}

        <section className="metric-strip" aria-label="Student overview">
          <article className="metric-cell"><span>ASSIGNED STUDENTS</span><strong>{dashboard.students.length}</strong><small>Students in your caseload</small></article>
          <article className="metric-cell metric-highlight"><span>AVERAGE READINESS</span><strong>{dashboard.averageReadiness}<i>%</i></strong><small>Across your assigned caseload</small></article>
          <article className="metric-cell"><span>NEEDS ATTENTION</span><strong>{dashboard.needsAttention.toString().padStart(2, "0")}</strong><small>Readiness below 50%</small></article>
          <article className="metric-cell"><span>UPCOMING SESSIONS</span><strong>{appointments.filter((item) => ["requested", "confirmed"].includes(item.status) && new Date(item.startsAt) >= new Date()).length.toString().padStart(2, "0")}</strong><small>Requests and confirmed meetings</small></article>
        </section>

        <div className="counselor-grid">
          <section className="workspace-section student-section" id="students">
            <div className="section-heading"><div><span className="eyebrow">YOUR CASELOAD</span><h2>Student progress</h2></div><span className="section-count">{dashboard.students.length} STUDENTS</span></div>
            {loading ? <div className="empty-state">Loading assigned students...</div> : dashboard.students.length === 0 ? <div className="empty-state">No students have been assigned to your account yet.</div> : (
              <div className="student-table">
                {dashboard.students.map((student) => (
                  <button className={`student-row ${selectedId === student._id ? "student-row-selected" : ""}`} key={student._id} onClick={() => loadStudent(student._id)}>
                    <span className="person-avatar">{student.firstName?.slice(0, 1)}{student.lastName?.slice(0, 1)}</span>
                    <span className="student-row-name"><strong>{student.fullName}</strong><small>{student.progress.readinessLabel} · {student.progress.resume.completed + student.progress.interviews.completed} activities</small></span>
                    <span className="readiness-score">{student.progress.employmentReadiness}<small>%</small></span>
                    <span className="readiness-track"><i style={{ width: `${student.progress.employmentReadiness}%` }} /></span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="workspace-section sessions-section" id="sessions">
            <div className="section-heading"><div><span className="eyebrow">APPOINTMENTS</span><h2>Session schedule</h2></div><span className="section-mark section-mark-blue">◷</span></div>
            {appointments.length === 0 ? <div className="empty-state">No counseling sessions have been requested.</div> : (
              <div className="session-list">
                {appointments.map((appointment) => (
                  <article className="session-row" key={appointment._id}>
                    <div className="session-date"><strong>{new Date(appointment.startsAt).toLocaleDateString(undefined, { day: "2-digit" })}</strong><span>{new Date(appointment.startsAt).toLocaleDateString(undefined, { month: "short" })}</span></div>
                    <div className="session-copy"><strong>{appointment.studentId?.fullName || "Student"}</strong><span>{formatDateTime(appointment.startsAt)}</span><small>{appointment.purpose || "Career guidance session"}</small></div>
                    <div className="session-actions">
                      <span className={`status-pill status-${appointment.status}`}>{appointment.status}</span>
                      {appointment.status === "requested" && <button className="text-action" onClick={() => updateAppointment(appointment._id, "confirmed")}>Confirm</button>}
                      {appointment.status === "confirmed" && <button className="text-action" onClick={() => updateAppointment(appointment._id, "completed")}>Complete</button>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {selectedId && (
          <section className="student-report-section" aria-live="polite">
            {reportLoading || !report ? <div className="workspace-section empty-state">Loading {studentName}...</div> : <>
              <header className="report-header">
                <div><span className="eyebrow">STUDENT READINESS REPORT</span><h2>{studentName}</h2><p>{report.student.email} · Target career: {report.careerProfile?.targetJob?.jobTitle || "Not selected"}</p></div>
                <div className="report-readiness"><strong>{report.progress.employmentReadiness}%</strong><span>{report.progress.readinessLabel}</span></div>
              </header>

              <div className="report-metrics">
                <article><span>RESUME STRENGTH</span><strong>{latestResume?.atsScore || 0}<small>%</small></strong><small>{latestResume ? `Updated ${formatDate(latestResume.createdAt)}` : "No completed resume"}</small></article>
                <article><span>INTERVIEW PERFORMANCE</span><strong>{report.progress.interviews.averageScore}<small>%</small></strong><small>{report.progress.interviews.completed} completed sessions</small></article>
                <article><span>CAREER PROFILE</span><strong className="career-title">{report.careerProfile?.targetJob?.jobTitle || "Not set"}</strong><small>{report.careerProfile?.targetJob?.industry || "Target industry not set"}</small></article>
                <article><span>SKILL COVERAGE</span><strong>{report.careerProfile?.skills ? report.careerProfile.skills.split(",").filter(Boolean).length : 0}<small> listed</small></strong><small>Skills in latest resume</small></article>
              </div>

              <div className="report-grid">
                <section className="workspace-section report-panel">
                  <div className="section-heading"><div><span className="eyebrow">CAREER PROFILE REVIEW</span><h3>Readiness history</h3></div></div>
                  {report.resumes.length + report.interviews.length === 0 ? <p className="muted-copy">No preparation activity recorded yet.</p> : <div className="history-list">
                    {[...report.resumes.map((item) => ({ ...item, type: "Resume", score: item.atsScore })), ...report.interviews.map((item) => ({ ...item, type: "Mock interview", score: item.overallScore, createdAt: item.completedAt }))]
                      .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
                      .map((item) => <div className="history-row" key={`${item.type}-${item._id}`}><span className="history-dot" /><div><strong>{item.type}{item.targetJob?.jobTitle || item.targetJob ? ` · ${item.targetJob?.jobTitle || item.targetJob}` : ""}</strong><small>{formatDate(item.createdAt)}</small></div><b>{item.score || 0}%</b></div>)}
                  </div>}
                  {latestInterview?.skillBreakdown && <div className="skill-breakdown"><span className="eyebrow">LATEST INTERVIEW SKILLS</span>{Object.entries(latestInterview.skillBreakdown).map(([skill, score]) => <div className="skill-score" key={skill}><span>{skill.replace(/([A-Z])/g, " $1")}</span><div><i style={{ width: `${score}%` }} /></div><b>{score}%</b></div>)}</div>}
                </section>

                <section className="workspace-section report-panel">
                  <div className="section-heading"><div><span className="eyebrow">SKILL GAP REVIEW</span><h3>Areas to strengthen</h3></div></div>
                  {report.careerProfile?.skillGaps?.length ? <div className="gap-list">{report.careerProfile.skillGaps.map((gap) => <span key={gap}>{gap}</span>)}</div> : <p className="muted-copy">No resume skill gaps have been identified yet.</p>}
                  {latestResume?.missingKeywords?.length > 0 && <p className="gap-context">Based on the latest resume analysis for {latestResume.targetJob?.jobTitle || "the selected target"}.</p>}
                  {report.careerProfile?.resumeStrength?.recommendations?.length > 0 && <div className="analysis-recommendations"><span className="eyebrow">RESUME FEEDBACK</span>{report.careerProfile.resumeStrength.recommendations.slice(0, 3).map((item, index) => <p key={`${item}-${index}`}>{item}</p>)}</div>}
                </section>
              </div>

              <div className="report-grid followup-grid">
                <section className="workspace-section report-panel">
                  <div className="section-heading"><div><span className="eyebrow">PRIVATE CASE NOTES</span><h3>Counseling notes</h3></div><span className="private-label">ONLY YOU</span></div>
                  <form className="inline-form" onSubmit={submitNote}><textarea required maxLength={5000} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Record an observation, recommendation, or follow-up plan..." /><button className="button button-primary">Save private note</button></form>
                  <div className="notes-list">{report.notes.map((item) => <article className="note-item" key={item._id}><p>{item.content}</p><time>{formatDate(item.createdAt)}</time></article>)}{report.notes.length === 0 && <p className="muted-copy">No notes recorded for this student.</p>}</div>
                </section>

                <section className="workspace-section report-panel">
                  <div className="section-heading"><div><span className="eyebrow">STUDENT ACTION PLAN</span><h3>Progress recommendations</h3></div></div>
                  <form className="inline-form task-form" onSubmit={submitTask}>
                    <input required maxLength={160} value={task.title} onChange={(event) => setTask({ ...task, title: event.target.value })} placeholder="Add a task, e.g. strengthen project descriptions" />
                    <select value={task.category} onChange={(event) => setTask({ ...task, category: event.target.value })}><option value="resume">Resume</option><option value="skill">Skill</option><option value="interview">Interview</option><option value="career">Career planning</option><option value="other">Other</option></select>
                    <textarea maxLength={2000} value={task.details} onChange={(event) => setTask({ ...task, details: event.target.value })} placeholder="Optional details for the student" />
                    <button className="button button-primary">Add to action plan</button>
                  </form>
                  <div className="recommendation-list">{report.recommendations.map((item) => <article className="recommendation-row" key={item._id}><label><input type="checkbox" checked={item.status === "completed"} onChange={(event) => updateTask(item._id, event.target.checked ? "completed" : "open")} /><span><strong>{item.title}</strong><small>{item.category} · Added {formatDate(item.createdAt)}</small>{item.details && <p>{item.details}</p>}</span></label><span className={`status-pill status-${item.status}`}>{item.status}</span></article>)}{report.recommendations.length === 0 && <p className="muted-copy">No preparation tasks assigned yet.</p>}</div>
                </section>
              </div>
            </>}
          </section>
        )}
      </section>
    </main>
  );
};

export default CounselorPage;