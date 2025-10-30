"use client";
import { useState } from "react";

// --- CONFIG ---
const POINT_X_SPACING = 65;
const GAP_X_EXTRA = 80;
const GAP_THRESHOLD_DAYS = 365;
const CHART_HEIGHT = 120;
const LEFT_PAD = 70;
const AXIS_Y = CHART_HEIGHT + 48;
const MIN_YEAR_LABEL_SPACING = 60;
const YEAR_STEP = 1;

// Color bands for ranks, 10 shades
const bandColors = [
  "#ff6fce", 
  "#f371dd", 
  "#e567bb", 
  "#d14faa", 
  "#b63d93", 
  "#a03682", 
  "#88336e", 
  "#6f2862",
  "#5c2556", 
  "#4c194a"  // Almost black purple
];

function getRankColor(rank) {
  let idx = Math.floor((Math.min(rank, 100) - 1) / 10);
  return bandColors[idx];
}

// Date helpers
function parseDate(str) { return new Date(str); }
function getGapInfo(date1, date2) {
  if (!date1 || !date2) return null;
  const d1 = parseDate(date1), d2 = parseDate(date2);
  const days = Math.round(Math.abs((d2 - d1) / (1000 * 60 * 60 * 24)));
  if (days <= 7) return null;
  const weeks = Math.round(days / 7);
  if (weeks < 52) return `${weeks} week${weeks > 1 ? "s" : ""}`;
  const years = (weeks / 52).toFixed(1);
  return `${years} year${years >= 2 ? "s" : ""}`;
}
function getY(rank, minRank, maxRank, height = 80) {
  return 20 + ((rank - minRank) / (maxRank - minRank)) * height;
}

// Axis segment splitter
function axisSegments(points, gaps) {
  let segments = [];
  let startIdx = 0;
  for (let i = 0; i < points.length - 1; i++) {
    if (gaps.find((g) => g.idx === i + 1)) {
      segments.push([points[startIdx].x, points[i].x]);
      startIdx = i + 1;
    }
  }
  segments.push([points[startIdx].x, points[points.length - 1].x]);
  return segments;
}

export default function SongTimeline({ timeline }) {
  const [activeGapIdx, setActiveGapIdx] = useState(null);
  const [activeDotIdx, setActiveDotIdx] = useState(null);

  if (!timeline || timeline.length === 0)
    return <p>No chart timeline available for this song.</p>;

  const minRank = Math.min(...timeline.map(e => e.rank));
  const maxRank = Math.max(...timeline.map(e => e.rank));

  let x = LEFT_PAD;
  let points = [];
  let gaps = [];
  for (let i = 0; i < timeline.length; i++) {
    const entry = timeline[i];
    const prev = timeline[i - 1];
    const y = getY(entry.rank, minRank, maxRank, CHART_HEIGHT);

    if (prev) {
      const gapDays = Math.abs(
        (parseDate(entry.chart_date) - parseDate(prev.chart_date)) / (1000 * 60 * 60 * 24)
      );
      if (gapDays > GAP_THRESHOLD_DAYS) {
        const rightX = x + GAP_X_EXTRA;
        const leftX = points[points.length - 1].x;
        gaps.push({
          x: (leftX + rightX) / 2,
          label: getGapInfo(prev.chart_date, entry.chart_date),
          idx: i,
        });
        x = rightX;
      }
    }
    points.push({
      x,
      y,
      ...entry,
      idx: i,
    });
    x += POINT_X_SPACING;
  }
  const svgWidth = x + LEFT_PAD;
  const svgHeight = AXIS_Y + 80;

  function smoothPath(points) {
    if (points.length < 2) return "";
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i], next = points[i + 1];
      const cpx = (curr.x + next.x) / 2;
      d += ` Q ${cpx},${curr.y} ${next.x},${next.y}`;
    }
    return d;
  }

  let yearLabels = [];
  let usedYears = new Set();
  for (let i = 0; i < points.length; i++) {
    const year = points[i].chart_date.slice(0, 4);
    if (!usedYears.has(year)) {
      yearLabels.push({ x: points[i].x, year });
      usedYears.add(year);
    }
  }

  const axisSegs = axisSegments(points, gaps);

  return (
    <div className="w-full overflow-x-auto py-6">
      <svg width={svgWidth} height={svgHeight} style={{ minWidth: "600px" }}>
        {/* --- Performance bands --- */}
        <rect x="0" y={getY(10, minRank, maxRank, CHART_HEIGHT) - 10} width={svgWidth}
          height={getY(minRank, minRank, maxRank, CHART_HEIGHT) - getY(10, minRank, maxRank, CHART_HEIGHT) + 20}
          fill="#fffbe5" opacity="0.0" />
        <rect x="0" y={getY(40, minRank, maxRank, CHART_HEIGHT) - 10} width={svgWidth}
          height={getY(10, minRank, maxRank, CHART_HEIGHT) - getY(40, minRank, maxRank, CHART_HEIGHT)}
          fill="#ffe5f2" opacity="0.5" />
        <rect x="0" y={getY(maxRank, minRank, maxRank, CHART_HEIGHT) - 10} width={svgWidth}
          height={getY(40, minRank, maxRank, CHART_HEIGHT) - getY(maxRank, minRank, maxRank, CHART_HEIGHT) + 20}
          fill="#efebff" opacity="0.4" />

        {/* --- Chart line --- */}
        <path d={smoothPath(points)} stroke="#888" strokeWidth={2} fill="none" opacity="0.55" />

        {/* --- Chart dots with mouseover tooltip --- */}
        {points.map((p, idx) => (
          <g key={p.chart_date}>
            <circle
              cx={p.x}
              cy={p.y}
              r={18}
              fill={getRankColor(p.rank)}
              stroke="#fff"
              strokeWidth={3}
              style={{ cursor: "pointer" }}
              onMouseOver={() => setActiveDotIdx(idx)}
              onMouseOut={() => setActiveDotIdx(null)}
            />
            <text
              x={p.x}
              y={p.y + 6}
              textAnchor="middle"
              fontWeight="bold"
              fontSize="16"
              fill={p.rank <= 10 ? "#fffdfd" : "#ffffff"}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {p.rank}
            </text>
            {activeDotIdx === idx && (
              <>
                <text
                  x={p.x}
                  y={p.y + 34}
                  textAnchor="middle"
                  fontWeight="bold"
                  fontSize="14"
                  fill="#e75480"
                  
                >
                  {p.chart_date}
                </text>
              </>
            )}
            {p.rank === minRank && (
              <text
                x={p.x}
                y={p.y - 26}
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
                fill="#fd76a1"
                stroke="#fde066"
                strokeWidth={0.6}
              >
                ★ Peak #{p.rank}
              </text>
            )}
          </g>
        ))}

        {/* --- Axis as segmented lines (gaps for breaks) --- */}
        {axisSegs.map(([x1, x2], i) => (
          <line
            key={`axis-seg-${i}`}
            x1={x1}
            y1={AXIS_Y}
            x2={x2}
            y2={AXIS_Y}
            stroke="#000"
            strokeWidth={1}
          />
        ))}

        {/* --- Sleep emoji and break info on hover --- */}
        {gaps.map((b, i) => (
          <g key={`gap-mark-${i}`}>
            <text
              x={b.x}
              y={AXIS_Y + 8}
              fontSize="28"
              textAnchor="middle"
              style={{ cursor: "pointer", userSelect: "none" }}
              onMouseOver={() => setActiveGapIdx(i)}
              onMouseOut={() => setActiveGapIdx(null)}
            >
              😴
            </text>
            {activeGapIdx === i && (
              <text
                x={b.x}
                y={AXIS_Y + 38}
                textAnchor="middle"
                fontSize="15"
                fill="#e75480"
                fontWeight="bold"
                opacity="0.88"
                style={{ userSelect: "none" }}
              >
                {b.label}
              </text>
            )}
          </g>
        ))}

        {/* --- Year ticks and labels --- */}
        {yearLabels.map((label, i) => (
          <g key={label.x + "-" + label.year}>
            <line
              x1={label.x}
              x2={label.x}
              y1={AXIS_Y}
              y2={AXIS_Y - 18}
              stroke="#000"
              strokeWidth={1}
              strokeLinecap="round"
            />
            <text
              x={label.x}
              y={AXIS_Y + 30}
              textAnchor="middle"
              fontSize="18"
              fill="#e75480"
              fontWeight="bold"
              opacity="0.7"
              style={{ fontFamily: "inherit, sans-serif" }}
            >
              {label.year}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
