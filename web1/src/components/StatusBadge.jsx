import React from "react";

// tone: "good" | "warn" | "bad" | "muted" | "info"
const StatusBadge = ({ tone = "muted", children }) => (
  <span className={`badge badge-${tone}`}>{children}</span>
);

export default StatusBadge;
