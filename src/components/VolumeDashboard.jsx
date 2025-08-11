import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function aggregateWeeklyVolume(sessions) {
  const byWeek = new Map();
  for (const s of sessions) {
    const d = new Date(s.date || s.createdAt || Date.now());
    // ISO week key yyyy-ww
    const year = d.getUTCFullYear();
    const firstThursday = new Date(Date.UTC(year,0,4));
    const week = Math.ceil((((d - firstThursday)/86400000) + firstThursday.getUTCDay()+1)/7);
    const key = `${year}-W${String(week).padStart(2,'0')}`;
    const prev = byWeek.get(key) || 0;
    byWeek.set(key, prev + (s.totalVolume || 0));
  }
  return Array.from(byWeek.entries()).map(([week, volume]) => ({ week, volume })).sort((a,b)=>a.week.localeCompare(b.week));
}

export default function VolumeDashboard({ sessions }) {
  const data = useMemo(() => aggregateWeeklyVolume(sessions), [sessions]);
  return (
    <div className="page-container">
      <h1 className="neon-title center">Training Analytics</h1>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="volume" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}