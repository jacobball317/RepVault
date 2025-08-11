import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import CircuitForm from "./components/CircuitForm";
import SelectTemplate from "./components/SelectTemplate";
import Analytics from "./pages/Analytics";
import "./App.css";

const LS_CIRCUITS = "repvault.circuits";
const LS_SESSIONS = "repvault.sessions";

function App() {
  const navigate = useNavigate();

  /* ===== Circuits ===== */
  const [circuits, setCircuits] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_CIRCUITS) || "[]");
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {}
    // seed defaults
    const seed = [
      {
        id: crypto.randomUUID(),
        name: "Push Day",
        notes: "Bench focus.",
        exercises: [
          { id: crypto.randomUUID(), name: "Bench Press", sets: 5, reps: 5, weight: 135, restSec: 120 },
          { id: crypto.randomUUID(), name: "Incline DB Press", sets: 3, reps: 10, weight: 40, restSec: 90 },
          { id: crypto.randomUUID(), name: "Triceps Pushdown", sets: 3, reps: 12, weight: 50, restSec: 60 },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: "Pull Day",
        notes: "Back + biceps.",
        exercises: [
          { id: crypto.randomUUID(), name: "Deadlift", sets: 3, reps: 5, weight: 185, restSec: 180 },
          { id: crypto.randomUUID(), name: "Lat Pulldown", sets: 3, reps: 10, weight: 90, restSec: 90 },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: "Legs Day",
        notes: "Self Explanatory",
        exercises: [
          { id: crypto.randomUUID(), name: "Squat", sets: 5, reps: 5, weight: 135, restSec: 150 },
          { id: crypto.randomUUID(), name: "Leg Press", sets: 3, reps: 12, weight: 200, restSec: 90 },
        ],
      },
    ];
    return seed;
  });
  useEffect(() => {
    localStorage.setItem(LS_CIRCUITS, JSON.stringify(circuits));
  }, [circuits]);

  const addCircuit = (c) =>
    setCircuits((prev) => [{ id: crypto.randomUUID(), ...c, createdAt: Date.now() }, ...prev]);

  const updateCircuit = (id, patch) =>
    setCircuits((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const duplicateCircuit = (id) =>
    setCircuits((prev) => {
      const src = prev.find((c) => c.id === id);
      if (!src) return prev;
      const copy = JSON.parse(JSON.stringify(src));
      copy.id = crypto.randomUUID();
      copy.name = `${copy.name} (Copy)`;
      copy.exercises = (copy.exercises || []).map((e) => ({ ...e, id: crypto.randomUUID() }));
      return [copy, ...prev];
    });

  const deleteCircuit = (id) =>
    setCircuits((prev) => prev.filter((c) => c.id !== id));

  /* ===== Sessions (for analytics) ===== */
  const [sessions, setSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_SESSIONS) || "[]"); } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem(LS_SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  const logSession = (entry) => {
    // entry: {templateId?, name, totalVolume, date, exercises}
    setSessions((prev) => [{ id: crypto.randomUUID(), ...entry }, ...prev]);
  };

  /* ===== UI ===== */
  const loadTemplates = () => navigate("/select-template");

  return (
    <div className="App">
      <div className="gradient-bg" />

      <div className="floating-nav">
        <Link to="/">Home</Link>
        <Link to="/create-template">Create</Link>
        <Link to="/select-template">Templates</Link>
        <Link to="/analytics">Analytics</Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="home-container">
              <div className="glass-card">
                <h1 className="neon-title">Rep Vault</h1>
                <p className="subtext">Track, Build, and Optimize Your Workout Routines</p>
                <div className="button-container">
                  <Link to="/create-template" className="btn btn-primary">Create Template</Link>
                  <button className="btn btn-glass" onClick={loadTemplates}>Load Templates</button>
                </div>
              </div>
            </div>
          }
        />

        <Route path="/create-template" element={<CircuitForm addCircuit={addCircuit} />} />

        <Route
          path="/edit/:id"
          element={<CircuitForm edit updateCircuit={updateCircuit} circuits={circuits} logSession={logSession} />}
        />

        <Route
          path="/select-template"
          element={
            <SelectTemplate
              circuits={circuits}
              onDuplicate={duplicateCircuit}
              onDelete={deleteCircuit}
            />
          }
        />

        <Route path="/analytics" element={<Analytics sessions={sessions} />} />

        <Route
          path="*"
          element={<div className="page-container"><h2>Page Not Found. <Link to="/">Go Home</Link></h2></div>}
        />
      </Routes>
    </div>
  );
}

export default App;
