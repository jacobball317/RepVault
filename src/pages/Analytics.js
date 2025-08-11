import React, { useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";

export default function Analytics({ sessions = [] }) {
  const stats = useMemo(() => computeStats(sessions), [sessions]);

  if (!sessions?.length) {
    return (
      <div className="page-container">
        <h1 className="neon-title" style={{ textAlign: "center" }}>Analytics</h1>
        <div className="card">
          <p className="muted">No sessions yet. Start a session from a template and hit “Finish &amp; Log” to see charts here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="neon-title" style={{ textAlign: "center" }}>Analytics</h1>

      {/* Quick stats */}
      <div className="templates-grid" style={{ marginBottom: 16 }}>
        <div className="template-card">
          <h3 style={{ marginTop: 0 }}>7-day Volume</h3>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.last7dVolume.toLocaleString()} lb</div>
          <div className="muted">Sum of (sets × reps × weight)</div>
        </div>
        <div className="template-card">
          <h3 style={{ marginTop: 0 }}>Sessions</h3>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{sessions.length}</div>
          <div className="muted">All time</div>
        </div>
        <div className="template-card">
          <h3 style={{ marginTop: 0 }}>Streak</h3>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.streak} days</div>
          <div className="muted">Consecutive days w/ a session</div>
        </div>
      </div>

      {/* Weekly volume trend */}
      <div className="card chart-wrap" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Weekly Volume Trend</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={stats.weeklyVolume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="volume" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top exercises by volume (30 days) */}
      <div className="card chart-wrap">
        <h3 style={{ marginTop: 0 }}>Top Exercises (Last 30 Days)</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={stats.topExercises}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="volume" name="Volume (lb)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */
function sessionVolume(s) {
  // If already computed, use it. Otherwise compute from exercises.
  if (typeof s.totalVolume === "number") return s.totalVolume;
  return (s.exercises || []).reduce(
    (sum, ex) => sum + (ex.sets || 0) * (ex.reps || 0) * (Number(ex.weight) || 0),
    0
  );
}
function yyyymmdd(d) {
  const dt = new Date(d);
  dt.setHours(0,0,0,0);
  return dt.toISOString().slice(0,10);
}
function mondayOfWeek(d) {
  const dt = new Date(d);
  const day = dt.getDay(); // 0 Sun..6 Sat
  const diff = dt.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const m = new Date(dt.setDate(diff));
  m.setHours(0,0,0,0);
  return m.toISOString().slice(0,10);
}
function computeStats(sessions) {
  if (!Array.isArray(sessions)) sessions = [];

  // weekly volume
  const weeklyMap = new Map();
  sessions.forEach(s => {
    const key = mondayOfWeek(s.date || Date.now());
    weeklyMap.set(key, (weeklyMap.get(key) || 0) + sessionVolume(s));
  });
  const weeklyVolume = [...weeklyMap.entries()]
    .map(([week, volume]) => ({ week, volume }))
    .sort((a,b) => a.week.localeCompare(b.week));

  // last 7d volume
  const now = new Date();
  const cutoff = new Date(); cutoff.setDate(now.getDate() - 7);
  const last7dVolume = sessions
    .filter(s => new Date(s.date) >= cutoff)
    .reduce((sum, s) => sum + sessionVolume(s), 0);

  // top exercises in last 30 days (by volume)
  const cutoff30 = new Date(); cutoff30.setDate(now.getDate() - 30);
  const volByExercise = new Map();
  sessions.forEach(s => {
    const when = new Date(s.date);
    if (when < cutoff30) return;
    (s.exercises || []).forEach(ex => {
      const vol = (ex.sets || 0) * (ex.reps || 0) * (Number(ex.weight) || 0);
      if (!vol) return;
      volByExercise.set(ex.name || "Exercise", (volByExercise.get(ex.name || "Exercise") || 0) + vol);
    });
  });
  const topExercises = [...volByExercise.entries()]
    .map(([name, volume]) => ({ name, volume }))
    .sort((a,b) => b.volume - a.volume)
    .slice(0, 8);

  // streak (days with at least one session)
  const daySet = new Set(sessions.map(s => yyyymmdd(s.date)));
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    if (daySet.has(yyyymmdd(d))) streak++;
    else break;
  }

  return { weeklyVolume, last7dVolume, topExercises, streak };
}
