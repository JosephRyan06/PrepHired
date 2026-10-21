import React from "react";

import EmptyState from "../EmptyState";

// items: [{ label, value }]
const BarList = ({
  items,
  max,
  format = (value) => value,
  color = "#3b82f6",
  emptyTitle,
  emptyText,
}) => {
  const hasData = items.some((item) => item.value > 0);

  if (!hasData) {
    return <EmptyState title={emptyTitle || "No data yet"} text={emptyText} />;
  }

  const ceiling = max || Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className="bar-list">
      {items.map((item) => (
        <li key={item.label}>
          <div className="bar-list-head">
            <span>{item.label}</span>
            <strong>{format(item.value)}</strong>
          </div>

          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${Math.min((item.value / ceiling) * 100, 100)}%`,
                background: color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BarList;
