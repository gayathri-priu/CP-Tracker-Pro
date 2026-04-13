import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { PLATFORMS } from "../../utils/helpers";
import "./DashCharts.css";

const TooltipStyle = {
  background: "white", border: "1px solid #e4e7f0",
  borderRadius: 8, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

function RatingChart({ platforms }) {
  // Merge all platform rating histories onto a single timeline
  const allData = {};
  Object.entries(platforms).forEach(([key, p]) => {
    if (!p?.isConnected || !p?.ratingHistory?.length) return;
    p.ratingHistory.forEach((r) => {
      const dateKey = new Date(r.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (!allData[dateKey]) allData[dateKey] = { date: dateKey };
      allData[dateKey][key] = r.rating;
    });
  });

  const chartData = Object.values(allData).slice(-15);
  const connectedWithHistory = Object.entries(platforms).filter(([, p]) => p?.isConnected && p?.ratingHistory?.length);

  if (!chartData.length) return <div className="chart-empty">No rating history available yet</div>;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f9" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {connectedWithHistory.map(([key]) => (
          <Area key={key} type="monotone" dataKey={key} name={PLATFORMS[key].name}
            stroke={PLATFORMS[key].color} fill={PLATFORMS[key].bg}
            strokeWidth={2} dot={false} connectNulls />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SolvedChart({ platforms }) {
  const data = Object.entries(platforms)
    .filter(([, p]) => p?.isConnected && p?.totalSolved > 0)
    .map(([key, p]) => ({ name: PLATFORMS[key].name, solved: p.totalSolved, fill: PLATFORMS[key].color }));

  if (!data.length) return <div className="chart-empty">Connect platforms to see solved stats</div>;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f9" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TooltipStyle} />
        <Bar dataKey="solved" name="Problems Solved" radius={[5, 5, 0, 0]}>
          {data.map((entry, i) => (
            <rect key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const TABS = [
  { id: "rating", label: "Rating History" },
  { id: "solved", label: "Problems Solved" },
];

function DashCharts({ platforms }) {
  const [tab, setTab] = useState("rating");

  return (
    <div className="dash-charts card">
      <div className="dc-header">
        <h3 className="dc-title">Performance Analytics</h3>
        <div className="dc-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`dc-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="dc-body">
        {tab === "rating" && <RatingChart platforms={platforms} />}
        {tab === "solved" && <SolvedChart platforms={platforms} />}
      </div>
    </div>
  );
}

export default DashCharts;
