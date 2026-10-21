import React, { useState } from "react";

import { adminApi } from "../api/adminApi";
import useAsync from "../hooks/useAsync";
import useDebounced from "../hooks/useDebounced";
import { capitalize, formatDate, formatScore } from "../utils/format";

import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";

const Resumes = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [template, setTemplate] = useState("all");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounced(search);

  const { data, loading, error } = useAsync(
    () =>
      adminApi.resumes({
        search: debouncedSearch,
        status,
        template,
        page,
        limit: 10,
      }),
    [debouncedSearch, status, template, page],
  );

  const resumes = data?.resumes || [];

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Resumes</h1>
          <p>Every resume created in the mobile app.</p>
        </div>
      </header>

      <div className="card">
        <div className="toolbar">
          <input
            type="search"
            className="input"
            placeholder="Search by name, email or job title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search resumes"
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
            <option value="draft">Draft</option>
          </select>

          <select
            className="select"
            value={template}
            onChange={(e) => {
              setTemplate(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by template"
          >
            <option value="all">All templates</option>
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="professional">Professional</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>

        {error && <p className="form-error">{error}</p>}

        {!data && loading && <p className="muted">Loading resumes...</p>}

        {data && resumes.length === 0 && (
          <EmptyState
            title="No resumes found"
            text={
              debouncedSearch || status !== "all" || template !== "all"
                ? "Try a different search or filter."
                : "Resumes will appear here once users start creating them."
            }
          />
        )}

        {resumes.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Resume</th>
                  <th>Account</th>
                  <th>Template</th>
                  <th>Status</th>
                  <th>ATS score</th>
                  <th>Updated</th>
                </tr>
              </thead>

              <tbody>
                {resumes.map((resume) => (
                  <tr key={resume._id}>
                    <td>
                      <strong>{resume.basicInfo?.fullName || "Untitled resume"}</strong>
                      <span className="muted block">
                        {resume.targetJob?.jobTitle || "No target job yet"}
                      </span>
                    </td>

                    <td>
                      {resume.userId ? (
                        <>
                          {resume.userId.fullName}
                          <span className="muted block">{resume.userId.email}</span>
                        </>
                      ) : (
                        <span className="muted">Deleted account</span>
                      )}
                    </td>

                    <td>{capitalize(resume.template)}</td>

                    <td>
                      <StatusBadge
                        tone={resume.status === "completed" ? "good" : "warn"}
                      >
                        {resume.status === "completed"
                          ? "Completed"
                          : `Draft, step ${resume.currentStep} of 8`}
                      </StatusBadge>
                    </td>

                    <td>{formatScore(resume.aiAnalysis?.atsScore)}</td>

                    <td className="muted">{formatDate(resume.updatedAt)}</td>
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

export default Resumes;
