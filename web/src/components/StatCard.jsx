import React from "react";

const StatCard = ({ label, value, note }) => (
  <div className="stat-card">
    <span className="stat-label">{label}</span>
    <strong className="stat-value">{value}</strong>
    {note && <span className="stat-note">{note}</span>}
  </div>
);

export default StatCard;
