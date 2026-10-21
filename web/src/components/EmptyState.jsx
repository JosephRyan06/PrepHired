import React from "react";

const EmptyState = ({ title, text }) => (
  <div className="empty-state">
    <strong>{title}</strong>
    {text && <p>{text}</p>}
  </div>
);

export default EmptyState;
