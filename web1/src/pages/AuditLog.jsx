import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { adminApi } from "../api/adminApi";
import useAsync from "../hooks/useAsync";
import useDebounced from "../hooks/useDebounced";
import { describeAction } from "../utils/auditActions";
import { formatDateTime, formatNumber } from "../utils/format";

import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";

const AuditLog = () => {
  // /audit-log?userId=... shows the activity of one user (linked from the Users page)
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get("userId") || "";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const debouncedSearch = useDebounced(search);

  const filters = {
    search: debouncedSearch,
    category,
    status,
    from,
    to,
    userId,
  };

  const { data, loading, error, reload } = useAsync(
    () => adminApi.auditLogs({ ...filters, page, limit: 15 }),
    [debouncedSearch, category, status, from, to, userId, page],
  );

  // Optional live view: reloads every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return undefined;

    const timer = setInterval(reload, 10000);

    return () => clearInterval(timer);
  }, [autoRefresh, reload]);

  const resetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const downloadCsv = async () => {
    setExporting(true);
    setExportError("");

    try {
      const blob = await adminApi.exportAuditLogs(filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const logs = data?.logs || [];
  const summary = data?.summary;
  const hasFilters =
    debouncedSearch || category !== "all" || status !== "all" || from || to || userId;

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Audit log</h1>
          <p>A record of what users and administrators do in PrepHired.</p>
        </div>

        <div className="header-actions">
          <label className="check">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={reload}
            disabled={loading}
          >
            Refresh
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={downloadCsv}
            disabled={exporting}
          >
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </header>

      {exportError && <p className="form-error">{exportError}</p>}

      {summary && (
        <section className="stat-grid stat-grid-3">
          <StatCard
            label="Events, last 24 hours"
            value={formatNumber(summary.eventsLast24h)}
          />
          <StatCard
            label="Active users, last 24 hours"
            value={formatNumber(summary.activeUsers)}
          />
          <StatCard
            label="Failed logins, last 24 hours"
            value={formatNumber(summary.failedLogins)}
          />
        </section>
      )}

      <div className="card">
        <div className="toolbar">
          <input
            type="search"
            className="input"
            placeholder="Search by name, email, details or IP address"
            value={search}
            onChange={(e) => resetPage(setSearch)(e.target.value)}
            aria-label="Search the audit log"
          />

          <select
            className="select"
            value={category}
            onChange={(e) => resetPage(setCategory)(e.target.value)}
            aria-label="Filter by type"
          >
            <option value="all">All activity</option>
            <option value="auth">Sign-up and login</option>
            <option value="resume">Resumes</option>
            <option value="interview">Mock interviews</option>
            <option value="admin">Admin actions</option>
          </select>

          <select
            className="select"
            value={status}
            onChange={(e) => resetPage(setStatus)(e.target.value)}
            aria-label="Filter by result"
          >
            <option value="all">Any result</option>
            <option value="success">Successful</option>
            <option value="failure">Failed</option>
          </select>

          <label className="date-field">
            From
            <input
              type="date"
              className="input"
              value={from}
              max={to || undefined}
              onChange={(e) => resetPage(setFrom)(e.target.value)}
            />
          </label>

          <label className="date-field">
            To
            <input
              type="date"
              className="input"
              value={to}
              min={from || undefined}
              onChange={(e) => resetPage(setTo)(e.target.value)}
            />
          </label>
        </div>

        {userId && (
          <div className="filter-chip">
            Showing the activity of one user
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSearchParams({});
                setPage(1);
              }}
            >
              Show everyone
            </button>
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        {!data && loading && <p className="muted">Loading the audit log...</p>}

        {data && logs.length === 0 && (
          <EmptyState
            title="No activity found"
            text={
              hasFilters
                ? "Try a different search or filter."
                : "Activity appears here as soon as someone signs up, logs in, or uses the app."
            }
          />
        )}

        {logs.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Result</th>
                  <th>IP address</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => {
                  const action = describeAction(log.action);

                  return (
                    <tr key={log._id}>
                      <td className="muted nowrap">{formatDateTime(log.createdAt)}</td>

                      <td>
                        <strong>{log.userName || "Unknown user"}</strong>
                        <span className="muted block">
                          {log.userEmail || "-"}
                          {log.actorRole === "admin" ? " (admin)" : ""}
                        </span>
                      </td>

                      <td>
                        <StatusBadge tone={action.tone}>{action.label}</StatusBadge>
                      </td>

                      <td>{log.description || "-"}</td>

                      <td>
                        <StatusBadge tone={log.status === "success" ? "good" : "bad"}>
                          {log.status === "success" ? "Success" : "Failed"}
                        </StatusBadge>
                      </td>

                      <td className="muted nowrap">{log.ip || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination pagination={data?.pagination} onChange={setPage} />
      </div>
    </>
  );
};

export default AuditLog;
