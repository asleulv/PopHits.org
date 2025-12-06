"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceArea,
  Label,
} from "recharts";

function formatDateLabel(value) {
  return value.slice(0, 4);
}
function formatTooltipLabel(value) {
  return value;
}

export default function SongTimeline({ timeline }) {
  const [showChart, setShowChart] = useState(true);

  if (!timeline || timeline.length === 0) {
    return (
      <p className="text-slate-700">
        No chart timeline available for this song.
      </p>
    );
  }

  const CHART_BOTTOM = 100;
  const sorted = [...timeline].sort(
    (a, b) => new Date(a.chart_date) - new Date(b.chart_date)
  );

  const peak = sorted.reduce(
    (best, d) => (d.rank < best.rank ? d : best),
    sorted[0]
  );

  const numberOnes = sorted.filter((d) => d.rank === 1);
  const firstNumberOne = numberOnes.length ? numberOnes[0] : null;

  // Insert off-chart breaks (>13 days)
  const dataWithBreaks = [];
  for (let i = 0; i < sorted.length; i++) {
    dataWithBreaks.push(sorted[i]);

    if (i < sorted.length - 1) {
      const curr = new Date(sorted[i].chart_date);
      const next = new Date(sorted[i + 1].chart_date);
      const diffDays = (next - curr) / (1000 * 60 * 60 * 24);

      if (diffDays > 13) {
        dataWithBreaks.push({
          chart_date: sorted[i].chart_date + "_drop",
          rank: CHART_BOTTOM,
          isBreak: true,
        });
        dataWithBreaks.push({
          chart_date: sorted[i + 1].chart_date + "_rise",
          rank: sorted[i + 1].rank,
          isRise: true, // mark as rise, not break
        });
      }
    }
  }

  // Detect sleeping gaps (>1 year)
  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].chart_date);
    const curr = new Date(sorted[i].chart_date);
    const years = (curr - prev) / (1000 * 60 * 60 * 24 * 365);

    if (years > 1) {
      gaps.push({
        from: sorted[i - 1].chart_date,
        to: sorted[i].chart_date,
        years,
      });
    }
  }

  const longestGap = gaps.length
    ? gaps.reduce((a, b) => (a.years > b.years ? a : b))
    : null;

  const firstDate = sorted[0].chart_date;
  const lastDate = sorted[sorted.length - 1].chart_date;

  return (
    <div className="w-full bg-white rounded-lg border-2 border-black p-4">
      {/* Toggle button */}
      <div className="mb-2">
        <button
          onClick={() => setShowChart(!showChart)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showChart ? "Show as Text" : "Show Chart"}
        </button>
      </div>

      {/* Top info */}
      <div className="mb-1 text-sm text-slate-600">
        Peak: <span className="font-semibold">#{peak.rank}</span> on{" "}
        {peak.chart_date}
      </div>
      <div className="mb-3 text-xs text-slate-500">
        First chart entry: <span className="font-semibold">{firstDate}</span> •
        Last: <span className="font-semibold">{lastDate}</span>
      </div>

      {/* Chart */}
      {showChart ? (
  <div className="overflow-x-auto" style={{ height: 220 }}>
    {/* Dynamic width: 40px per datapoint, minimum 600px */}
    <div
      style={{
        width: Math.max(dataWithBreaks.length * 40, 600),
        height: "100%",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={dataWithBreaks}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          {/* Background rank zones */}
          <ReferenceArea
            y1={1}
            y2={10}
            x1={firstDate}
            x2={lastDate}
            fill="#dcfce7"
            fillOpacity={0.5}
          />
          <ReferenceArea
            y1={11}
            y2={20}
            x1={firstDate}
            x2={lastDate}
            fill="#dbeafe"
            fillOpacity={0.5}
          />
          <ReferenceArea
            y1={21}
            y2={40}
            x1={firstDate}
            x2={lastDate}
            fill="#ede9fe"
            fillOpacity={0.5}
          />

          {/* Sleeping gaps */}
          {gaps.map((gap, index) => (
            <ReferenceArea
              key={index}
              x1={gap.from}
              x2={gap.to}
              y1={1}
              y2={CHART_BOTTOM}
              fill="#fef9c3"
              fillOpacity={0.6}
              stroke="#facc15"
              strokeOpacity={0.9}
            >
              <Label value="💤" position="insideMiddle" offset={0} />
            </ReferenceArea>
          ))}

          {/* Axes */}
          <XAxis
            dataKey="chart_date"
            tickFormatter={formatDateLabel}
            type="category"
            minTickGap={50}
            tick={{ fontSize: 12, fill: "#475569" }}
            axisLine={{ stroke: "#0f172a" }}
            tickLine={{ stroke: "#0f172a" }}
          />

          <YAxis
            dataKey="rank"
            domain={[1, CHART_BOTTOM]}
            reversed={true}
            tick={{ fontSize: 12, fill: "#475569" }}
            tickFormatter={(v) => `#${v}`}
            axisLine={{ stroke: "#0f172a" }}
            tickLine={{ stroke: "#0f172a" }}
            ticks={[1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          />

          {/* Tooltip */}
          <Tooltip
            labelFormatter={formatTooltipLabel}
            formatter={(value, name, props) => {
              if (props.payload.isBreak) return ["Off the chart", "Rank"];
              return [`#${value}`, "Rank"];
            }}
            contentStyle={{ fontSize: 12, borderRadius: 6 }}
          />

          {/* Main line */}
          <Line
            type="monotone"
            dataKey="rank"
            stroke="#0f172a"
            strokeWidth={2}
            dot={{
              r: 4,
              stroke: "#0f172a",
              strokeWidth: 1,
              fill: "#f97316",
            }}
            activeDot={{ r: 6 }}
          />

          {/* First #1 */}
          {firstNumberOne && (
            <ReferenceDot
              x={firstNumberOne.chart_date}
              y={1}
              r={8}
              fill="#fef08a"
              stroke="#ca8a04"
              strokeWidth={3}
              ifOverflow="visible"
            />
          )}

          {/* All #1 points */}
          {numberOnes.map((d, i) => (
            <ReferenceDot
              key={i}
              x={d.chart_date}
              y={1}
              r={5}
              fill="#22c55e"
              stroke="#15803d"
              strokeWidth={2}
              ifOverflow="visible"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
) : (
  /* your text table view stays unchanged */

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1">Date</th>
                <th className="border border-gray-300 px-2 py-1">Rank</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => (
                <tr
                  key={i}
                  className={`odd:bg-white even:bg-gray-50 ${
                    d.rank === 1 ? "bg-green-100 font-bold" : ""
                  }`}
                >
                  <td className="border border-gray-300 px-2 py-1">
                    {d.chart_date}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {d.rank === 1 ? `#${d.rank} 🏆` : `#${d.rank}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom info */}
      <div className="mt-2 text-xs text-slate-500">
        {longestGap && (
          <>
            Longest break:{" "}
            <span className="font-semibold">
              {longestGap.years.toFixed(1)} years
            </span>{" "}
            between {longestGap.from} and {longestGap.to}
            <br />
          </>
        )}
        {gaps.length > 0 && (
          <span className="text-amber-700">
            Yellow areas with 💤 indicate sleeping periods where the song
            was out of the charts for over 1 year.
          </span>
        )}
      </div>
    </div>
  );
}
