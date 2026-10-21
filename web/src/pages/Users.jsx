import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { adminApi } from "../api/adminApi";
import useAsync from "../hooks/useAsync";
import useDebounced from "../hooks/useDebounced";
import {
  capitalize,
  formatDate,
  formatDateTime,
  formatScore,
  initials,
} from "../utils/format";

import { describeAction } from "../utils/auditActions";

import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";

/* ------------------------- user detail drawer ------------------------ */

const UserDrawer = ({ userId, refreshKey, onClose, onToggle }) => {
  const { data, loading, error } = useAsync(
    () => adminApi.user(userId),
    [userId, refreshKey],
  );

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const user = data?.user;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="User details"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-top">
          <h2>User details</h2>

          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        {loading && !data && <p className="muted">Loading...</p>}
        {error && !data && <p className="form-error">{error}</p>}

        {user && (
          <>
            <div className="drawer-profile">
              <div className="avatar avatar-lg">{initials(user.fullName)}</div>

              <div>
                <strong>{user.fullName}</strong>
                <span className="muted">{user.email}</span>
              </div>

              <StatusBadge tone={user.isEnabled ? "good" : "bad"}>
                {user.isEnabled ? "Active" : "Disabled"}
              </StatusBadge>
            </div>

            <dl className="detail-list">
              <div>
                <dt>Joined</dt>
                <dd>{formatDateTime(user.createdAt)}</dd>
              </div>
              <div>
                <dt>Terms accepted</dt>
                <dd>{user.termsAccepted ? "Yes" : "No"}</dd>
              </div>
              <div>
                <dt>Resumes</dt>
                <dd>{data.resumes.length}</dd>
              </div>
              <div>
                <dt>Mock interviews</dt>
                <dd>{data.interviews.length}</dd>
              </div>
            </dl>

            <button
              type="button"
              className={`btn ${user.isEnabled ? "btn-danger" : "btn-primary"} btn-block`}
              onClick={() => onToggle(user)}
            >
              {user.isEnabled ? "Disable account" : "Enable account"}
            </button>

            <h3 className="drawer-heading">Resumes</h3>

            {data.resumes.length === 0 ? (
              <EmptyState title="No resumes yet" />
            ) : (
              <ul className="item-list">
                {data.resumes.map((resume) => (
                  <li key={resume._id}>
                    <div>
                      <strong>{resume.targetJob?.jobTitle || "No target job yet"}</strong>
                      <span className="muted">
                        {capitalize(resume.template)} template, updated{" "}
                        {formatDate(resume.updatedAt)}
                      </span>
                    </div>

                    <div className="item-meta">
                      {resume.aiAnalysis?.atsScore > 0 && (
                        <span className="muted">
                          ATS {formatScore(resume.aiAnalysis.atsScore)}
                        </span>
                      )}

                      <StatusBadge
                        tone={resume.status === "completed" ? "good" : "warn"}
                      >
                        {resume.status === "completed"
                          ? "Completed"
                          : `Draft, step ${resume.currentStep} of 8`}
                      </StatusBadge>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="drawer-heading">Mock interviews</h3>

            {data.interviews.length === 0 ? (
              <EmptyState title="No interviews yet" />
            ) : (
              <ul className="item-list">
                {data.interviews.map((interview) => (
                  <li key={interview._id}>
                    <div>
                      <strong>{interview.targetJob}</strong>
                      <span className="muted">
                        {interview.interviewCategory}, {interview.numberOfQuestions}{" "}
                        questions, {formatDate(interview.startedAt || interview.createdAt)}
                      </span>
                    </div>

                    <div className="item-meta">
                      {interview.status === "completed" && (
                        <span className="muted">
                          Score {formatScore(interview.overallScore)}
                        </span>
                      )}

                      <StatusBadge
                        tone={interview.status === "completed" ? "good" : "warn"}
                      >
                        {interview.status === "completed" ? "Completed" : "In progress"}
                      </StatusBadge>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="drawer-heading">Recent activity</h3>

            {data.activity.length === 0 ? (
              <EmptyState title="No activity recorded yet" />
            ) : (
              <>
                <ul className="item-list">
                  {data.activity.map((entry) => (
                    <li key={entry._id}>
                      <div>
                        <strong>{describeAction(entry.action).label}</strong>
                        <span className="muted">{entry.description || "-"}</span>
                      </div>

                      <div className="item-meta">
                        <span className="muted">{formatDateTime(entry.createdAt)}</span>

                        {entry.status === "failure" && (
                          <StatusBadge tone="bad">Failed</StatusBadge>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <Link className="drawer-link" to={`/audit-log?userId=${user._id}`}>
                  View full activity in the audit log
                </Link>
              </>
            )}
          </>
        )}
      </aside>
    </div>
  );
};

/* ------------------------------- page -------------------------------- */

const Users = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const debouncedSearch = useDebounced(search);

  const { data, loading, error, reload } = useAsync(
    () => adminApi.users({ search: debouncedSearch, status, page, limit: 10 }),
    [debouncedSearch, status, page],
  );

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(""), 3500);

    return () => clearTimeout(timer);
  }, [notice]);

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  const confirmToggle = async () => {
    setBusy(true);

    try {
      const result = await adminApi.setUserStatus(
        confirm._id,
        !confirm.isEnabled,
      );

      setNotice(`${confirm.fullName}: ${result.message.toLowerCase()}`);
      setConfirm(null);
      setRefreshKey((key) => key + 1);
      reload();
    } catch (err) {
      setNotice(err.message);
      setConfirm(null);
    } finally {
      setBusy(false);
    }
  };

  const users = data?.users || [];

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Users</h1>
          <p>Everyone who signed up in the mobile app.</p>
        </div>
      </header>

      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}

      <div className="card">
        <div className="toolbar">
          <input
            type="search"
            className="input"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => changeSearch(e.target.value)}
            aria-label="Search users"
          />

          <select
            className="select"
            value={status}
            onChange={(e) => changeStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All accounts</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {error && <p className="form-error">{error}</p>}

        {!data && loading && <p className="muted">Loading users...</p>}

        {data && users.length === 0 && (
          <EmptyState
            title="No users found"
            text={
              debouncedSearch || status !== "all"
                ? "Try a different search or filter."
                : "New accounts from the mobile app will appear here."
            }
          />
        )}

        {users.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Resumes</th>
                  <th>Interviews</th>
                  <th>Joined</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar">{initials(user.fullName)}</div>

                        <div>
                          <strong>{user.fullName}</strong>
                          <span className="muted">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <StatusBadge tone={user.isEnabled ? "good" : "bad"}>
                        {user.isEnabled ? "Active" : "Disabled"}
                      </StatusBadge>
                    </td>

                    <td>
                      {user.resumes.completed} of {user.resumes.total} completed
                    </td>

                    <td>
                      {user.interviews.completed} of {user.interviews.total} completed
                    </td>

                    <td className="muted">{formatDate(user.createdAt)}</td>

                    <td className="row-actions">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setSelectedId(user._id)}
                      >
                        View
                      </button>

                      <button
                        type="button"
                        className={`btn ${user.isEnabled ? "btn-danger-ghost" : "btn-ghost"}`}
                        onClick={() => setConfirm(user)}
                      >
                        {user.isEnabled ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination pagination={data?.pagination} onChange={setPage} />
      </div>

      {selectedId && (
        <UserDrawer
          userId={selectedId}
          refreshKey={refreshKey}
          onClose={() => setSelectedId(null)}
          onToggle={(user) => setConfirm(user)}
        />
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        danger={Boolean(confirm?.isEnabled)}
        busy={busy}
        title={confirm?.isEnabled ? "Disable this account?" : "Enable this account?"}
        message={
          confirm?.isEnabled
            ? `${confirm?.fullName} will not be able to log in to the mobile app until you enable the account again.`
            : `${confirm?.fullName} will be able to log in to the mobile app again.`
        }
        confirmLabel={confirm?.isEnabled ? "Disable account" : "Enable account"}
        onConfirm={confirmToggle}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
};

export default Users;
