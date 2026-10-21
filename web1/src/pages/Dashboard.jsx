import React from "react";

import { adminApi } from "../api/adminApi";
import useAsync from "../hooks/useAsync";
import { capitalize, formatDate, formatDayLabel, formatNumber } from "../utils/format";

import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import LineChart from "../components/charts/LineChart";
import DonutChart from "../components/charts/DonutChart";
import BarList from "../components/charts/BarList";

const TEMPLATE_COLORS = {
  classic: "#3b82f6",
  modern: "#14b8a6",
  professional: "#a78bfa",
  minimal: "#f59e0b",
};

const CATEGORY_COLORS = {
  Behavioral: "#3b82f6",
  Technical: "#14b8a6",
  "HR Screening": "#f59e0b",
  All: "#a78bfa",
};

const Dashboard = () => {
  const { data, loading, error, reload } = useAsync(() => adminApi.dashboard());

  if (loading && !data) {
    return <div className="page-state">Loading dashboard...</div>;
  }

  if (error && !data) {
    return (
      <div className="page-state">
        <p>{error}</p>
        <button type="button" className="btn btn-primary" onClick={reload}>
          Try again
        </button>
      </div>
    );
  }

  const { totals, activity } = data;

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>How people are using PrepHired.</p>
        </div>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={reload}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <section className="stat-grid">
        <StatCard
          label="Total users"
          value={formatNumber(totals.users)}
          note={`${formatNumber(totals.newUsersThisWeek)} joined in the last 7 days`}
        />
        <StatCard
          label="Active accounts"
          value={formatNumber(totals.activeUsers)}
          note={`${formatNumber(totals.disabledUsers)} disabled`}
        />
        <StatCard
          label="Resumes"
          value={formatNumber(totals.resumes)}
          note={`${formatNumber(totals.completedResumes)} completed, ${formatNumber(totals.draftResumes)} drafts`}
        />
        <StatCard
          label="Mock interviews"
          value={formatNumber(totals.interviews)}
          note={`${formatNumber(totals.completedInterviews)} completed`}
        />
        <StatCard
          label="Average interview score"
          value={totals.averageInterviewScore ? `${totals.averageInterviewScore}` : "-"}
          note="Completed interviews, out of 100"
        />
        <StatCard
          label="Average ATS score"
          value={totals.averageAtsScore ? `${totals.averageAtsScore}` : "-"}
          note="Analyzed resumes, out of 100"
        />
      </section>

      <section className="chart-grid">
        <div className="card card-wide">
          <div className="card-head">
            <h2>Activity, last 14 days</h2>
            <span>Sign-ups, resumes created and interviews started per day</span>
          </div>

          <LineChart
            labels={activity.days.map(formatDayLabel)}
            series={[
              { name: "New users", color: "#3b82f6", values: activity.newUsers },
              { name: "Resumes created", color: "#14b8a6", values: activity.resumes },
              { name: "Interviews started", color: "#f59e0b", values: activity.interviews },
            ]}
          />
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Completed resumes by template</h2>
          </div>

          <DonutChart
            centerLabel="Resumes"
            emptyTitle="No completed resumes yet"
            emptyText="Finished resumes will show up here."
            data={data.resumesByTemplate.map((item) => ({
              label: capitalize(item.label),
              value: item.value,
              color: TEMPLATE_COLORS[item.label] || "#64748b",
            }))}
          />
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Interviews by category</h2>
          </div>

          <DonutChart
            centerLabel="Interviews"
            emptyTitle="No interviews yet"
            emptyText="Practice sessions will show up here."
            data={data.interviewsByCategory.map((item) => ({
              label: item.label,
              value: item.value,
              color: CATEGORY_COLORS[item.label] || "#64748b",
            }))}
          />
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Average interview skills</h2>
            <span>Across completed interviews, out of 100</span>
          </div>

          <BarList
            items={data.skillAverages}
            max={100}
            format={(value) => `${value}`}
            emptyTitle="No completed interviews yet"
            emptyText="Skill averages appear after the first completed interview."
          />
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Most practiced job roles</h2>
            <span>Top 5 by mock interviews</span>
          </div>

          <BarList
            items={data.topJobs}
            color="#14b8a6"
            emptyTitle="No interviews yet"
            emptyText="Job roles appear once users start practicing."
          />
        </div>

        <div className="card card-wide">
          <div className="card-head">
            <h2>Newest sign-ups</h2>
          </div>

          {data.recentUsers.length === 0 ? (
            <EmptyState
              title="No users yet"
              text="New accounts from the mobile app will appear here."
            />
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>

                <tbody>
                  {data.recentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.fullName}</td>
                      <td className="muted">{user.email}</td>
                      <td>
                        <StatusBadge tone={user.isEnabled ? "good" : "bad"}>
                          {user.isEnabled ? "Active" : "Disabled"}
                        </StatusBadge>
                      </td>
                      <td className="muted">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
