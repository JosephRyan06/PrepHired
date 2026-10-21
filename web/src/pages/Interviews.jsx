import React, { useState } from "react";

import { adminApi } from "../api/adminApi";
import useAsync from "../hooks/useAsync";
import useDebounced from "../hooks/useDebounced";
import { formatDate, formatScore } from "../utils/format";

import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";

const Interviews = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounced(search);

  const { data, loading, error } = useAsync(
    () =>
      adminApi.interviews({
        search: debouncedSearch,
        status,
        category,
        page,
        limit: 10,
      }),
    [debouncedSearch, status, category, page],
  );

  const interviews = data?.interviews || [];

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Mock interviews</h1>
          <p>Practice sessions run by your users.</p>
        </div>
      </header>

      <div className="card">
        <div className="toolbar">
          <input
            type="search"
            className="input"
            placeholder="Search by name, email or job role"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search interviews"
          />

          <select
            className="select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In progress</option>
          </select>

          <select
            className="select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Technical">Technical</option>
            <option value="HR Screening">HR Screening</option>
            <option value="All">Mixed</option>
          </select>
        </div>

        {error && <p className="form-error">{error}</p>}

        {!data && loading && <p className="muted">Loading interviews...</p>}

        {data && interviews.length === 0 && (
          <EmptyState
            title="No mock interviews found"
            text={
              debouncedSearch || status !== "all" || category !== "all"
                ? "Try a different search or filter."
                : "Sessions will appear here once users start practicing."
            }
          />
        )}

        {interviews.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Job role</th>
                  <th>Account</th>
                  <th>Category</th>
                  <th>Mode</th>
                  <th>Questions</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Started</th>
                </tr>
              </thead>

              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview._id}>
                    <td>
                      <strong>{interview.targetJob}</strong>
                    </td>

                    <td>
                      {interview.userId ? (
                        <>
                          {interview.userId.fullName}
                          <span className="muted block">{interview.userId.email}</span>
                        </>
                      ) : (
                        <span className="muted">Deleted account</span>
                      )}
                    </td>

                    <td>
                      {interview.interviewCategory === "All"
                        ? "Mixed"
                        : interview.interviewCategory}
                    </td>

                    <td>{interview.responseMode}</td>

                    <td>{interview.numberOfQuestions}</td>

                    <td>
                      <StatusBadge
                        tone={interview.status === "completed" ? "good" : "warn"}
                      >
                        {interview.status === "completed" ? "Completed" : "In progress"}
                      </StatusBadge>
                    </td>

                    <td>
                      {interview.status === "completed"
                        ? formatScore(interview.overallScore)
                        : "-"}
                    </td>

                    <td className="muted">
                      {formatDate(interview.startedAt || interview.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination pagination={data?.pagination} onChange={setPage} />
      </div>
    </>
  );
};

export default Interviews;
