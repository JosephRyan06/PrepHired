import React from "react";

const WIDTH = 640;
const HEIGHT = 260;
const PAD = { top: 16, right: 16, bottom: 32, left: 36 };

// labels: ["Oct 1", "Oct 2", ...]
// series: [{ name, color, values: [number, ...] }]
const LineChart = ({ labels, series }) => {
  const peak = Math.max(0, ...series.flatMap((item) => item.values));
  const step = Math.max(1, Math.ceil(peak / 4));
  const yMax = step * 4;

  const innerWidth = WIDTH - PAD.left - PAD.right;
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;
  const count = labels.length;

  const x = (index) =>
    PAD.left + (count === 1 ? innerWidth / 2 : (index / (count - 1)) * innerWidth);
  const y = (value) => PAD.top + innerHeight - (value / yMax) * innerHeight;

  const ticks = [0, 1, 2, 3, 4].map((index) => index * step);

  // Show about 7 labels, always including the most recent day
  const labelEvery = Math.max(1, Math.ceil(count / 7));

  return (
    <div className="line-chart">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Activity over time"
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              className="chart-gridline"
            />
            <text
              x={PAD.left - 8}
              y={y(tick) + 4}
              textAnchor="end"
              className="chart-axis"
            >
              {tick}
            </text>
          </g>
        ))}

        {labels.map((label, index) =>
          (count - 1 - index) % labelEvery === 0 ? (
            <text
              key={label + index}
              x={x(index)}
              y={HEIGHT - 10}
              textAnchor="middle"
              className="chart-axis"
            >
              {label}
            </text>
          ) : null,
        )}

        {series.map((item) => (
          <g key={item.name}>
            <path
              d={item.values
                .map((value, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(value)}`)
                .join(" ")}
              fill="none"
              stroke={item.color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {item.values.map((value, index) => (
              <circle
                key={index}
                cx={x(index)}
                cy={y(value)}
                r="3.5"
                fill={item.color}
              >
                <title>{`${labels[index]}: ${value} ${item.name.toLowerCase()}`}</title>
              </circle>
            ))}
          </g>
        ))}
      </svg>

      <ul className="chart-legend">
        {series.map((item) => (
          <li key={item.name}>
            <span className="legend-swatch" style={{ background: item.color }} />
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LineChart;
