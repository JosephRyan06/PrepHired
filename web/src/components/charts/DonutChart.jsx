import React from "react";

import EmptyState from "../EmptyState";

const SIZE = 180;
const CENTER = SIZE / 2;
const RADIUS = 66;
const STROKE = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// data: [{ label, value, color }]
const DonutChart = ({ data, centerLabel = "Total", emptyTitle, emptyText }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!total) {
    return <EmptyState title={emptyTitle || "No data yet"} text={emptyText} />;
  }

  const gap = data.length > 1 ? 2 : 0;
  let offset = 0;

  const segments = data.map((item) => {
    const length = (item.value / total) * CIRCUMFERENCE;
    const visible = Math.max(length - gap, 0);

    const segment = (
      <circle
        key={item.label}
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke={item.color}
        strokeWidth={STROKE}
        strokeDasharray={`${visible} ${CIRCUMFERENCE - visible}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${CENTER} ${CENTER})`}
      >
        <title>{`${item.label}: ${item.value}`}</title>
      </circle>
    );

    offset += length;

    return segment;
  });

  return (
    <div className="donut">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="donut-svg"
        role="img"
        aria-label={centerLabel}
      >
        {segments}

        <text x={CENTER} y={CENTER + 2} textAnchor="middle" className="donut-total">
          {total}
        </text>
        <text x={CENTER} y={CENTER + 20} textAnchor="middle" className="donut-label">
          {centerLabel}
        </text>
      </svg>

      <ul className="donut-legend">
        {data.map((item) => (
          <li key={item.label}>
            <span className="legend-swatch" style={{ background: item.color }} />
            <span className="donut-legend-name">{item.label}</span>
            <strong>{item.value}</strong>
            <span className="donut-legend-percent">
              {Math.round((item.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonutChart;
