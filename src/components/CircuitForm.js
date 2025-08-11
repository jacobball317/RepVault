import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CircuitForm.css";

/* tiny helpers */
const epley1RM = (w, r) => Math.round((Number(w) || 0) * (1 + (Number(r) || 0) / 30));
const brzycki1RM = (w, r) => Math.round((Number(w) || 0) * (36 / (37 - (Number(r) || 0) || 1)));
function getPlatePlan(target, bar=45, plates=[45,35,25,10,5,2.5]){ let perSide=(Number(target)-bar)/2; const plan=[]; for(const p of plates){ const c=Math.floor(perSide/p); if(c>0){ plan.push([p,c]); perSide-=p*c; } } return plan; }
function planToString(plan){ return !plan?.length ? "—" : plan.map(([p,c])=>`${c}×${p}`).join(" · "); }

export default function CircuitForm({ addCircuit, edit, updateCircuit, circuits = [], logSession }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const startNow = new URLSearchParams(location.search).get("start") === "1";

  const base = useMemo(() => circuits.find(c => c.id === id), [circuits, id]);
  const [name, setName] = useState(base?.name || "New Template");
  const [notes, setNotes] = useState(base?.notes || "");
  const [exercises, setExercises] = useState(() =>
    base?.exercises?.map(e => ({ ...e, progression: undefined, targetRPE: undefined })) || [
      { id: crypto.randomUUID(), name: "Exercise", sets: 3, reps: 8, weight: 0, restSec: 90 }
    ]
  );

  const [isSession, setIsSession] = useState(Boolean(startNow));
  const [activeTimers, setActiveTimers] = useState({});

  useEffect(() => {
    if (!isSession) return;
    const t = setInterval(() => {
      setActiveTimers(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => next[k] = Math.max(0, next[k] - 1));
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isSession]);

  const totalVolume = useMemo(
    () => exercises.reduce((sum, ex) => sum + (ex.sets||0) * (ex.reps||0) * (Number(ex.weight)||0), 0),
    [exercises]
  );

  function addExerciseRow(){
    setExercises(prev => [...prev, { id: crypto.randomUUID(), name: "New Exercise", sets: 3, reps: 10, weight: 0, restSec: 90 }]);
  }
  const removeExercise = (exId) => setExercises(prev => prev.filter(e => e.id !== exId));
  const updateExercise = (exId, patch) => setExercises(prev => prev.map(e => e.id === exId ? { ...e, ...patch } : e));

  function onSaveTemplate(){
    const payload = { name, notes, exercises: exercises.map(({progression,targetRPE, ...rest}) => rest) };
    if (edit && base) updateCircuit?.(base.id, payload);
    else addCircuit?.(payload);
    navigate("/select-template");
  }
  function onStartSession(){ setIsSession(true); }
  function onEndSession(){
    logSession?.({
      templateId: base?.id,
      name: name || base?.name,
      totalVolume,
      date: new Date().toISOString(),
      exercises
    });
    navigate("/analytics");
  }

  function move(idx, dir){
    setExercises(prev => {
      const next = [...prev], ni = idx + dir;
      if (ni < 0 || ni >= next.length) return prev;
      [next[idx], next[ni]] = [next[ni], next[idx]];
      return next;
    });
  }

  return (
    <div className="page-container">
      <h1 className="neon-title" style={{ textAlign: "center" }}>
        {isSession ? "Workout Session" : edit ? "Edit Template" : "Create Template"}
      </h1>

      <div className="card">
        <label>Template Name</label>
        <input className="neon-input" value={name} onChange={e => setName(e.target.value)} />

        <label>Notes</label>
        <textarea className="neon-input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />

        {!isSession && (
          <div className="row gap" style={{ marginTop: 10 }}>
            <button className="btn btn-primary" onClick={onSaveTemplate}>{edit ? "Save Changes" : "Save Template"}</button>
            {base && <button className="btn btn-glass" onClick={onStartSession}>Start Session</button>}
          </div>
        )}

        {isSession && (
          <div className="row gap" style={{ marginTop: 10 }}>
            <button className="btn btn-primary" onClick={onEndSession}>Finish &amp; Log</button>
          </div>
        )}
      </div>

      <div className="exercises">
        {exercises.map((ex, idx) => (
          <div className="template-card exercise" key={ex.id}>
            <div className="row space">
              <strong>#{idx + 1}</strong>
              <div className="row gap">
                <button className="btn btn-ghost" onClick={() => move(idx, -1)}>↑</button>
                <button className="btn btn-ghost" onClick={() => move(idx, 1)}>↓</button>
                <button className="btn btn-danger" onClick={() => removeExercise(ex.id)}>Delete</button>
              </div>
            </div>

            <div className="grid-2" style={{ marginTop: 8 }}>
              <div>
                <label>Name</label>
                <input className="neon-input" value={ex.name} onChange={e => updateExercise(ex.id, { name: e.target.value })} />
              </div>
            </div>

            <div className="grid-4">
              <div>
                <label>Sets</label>
                <input className="neon-input" type="number" min="1" value={ex.sets}
                  onChange={e => updateExercise(ex.id, { sets: +e.target.value })} />
              </div>
              <div>
                <label>Reps</label>
                <input className="neon-input" type="number" min="1" value={ex.reps}
                  onChange={e => updateExercise(ex.id, { reps: +e.target.value })} />
              </div>
              <div>
                <label>Weight (lb)</label>
                <input className="neon-input" type="number" step="2.5" value={ex.weight}
                  onChange={e => updateExercise(ex.id, { weight: +e.target.value })} />
              </div>
              <div>
                <label>Rest (s)</label>
                <input className="neon-input" type="number" min="0" value={ex.restSec || 90}
                  onChange={e => updateExercise(ex.id, { restSec: +e.target.value })} />
              </div>
            </div>

            <div className="row wrap gap" style={{ marginTop: 8 }}>
              <SmallPlatePlanner weight={Number(ex.weight) || 0} />
              <Small1RM weight={Number(ex.weight) || 0} reps={Number(ex.reps) || 0} />
              {isSession && (
                <TimerWidget
                  seconds={activeTimers[ex.id] ?? 0}
                  onStart={() => setActiveTimers(p => ({ ...p, [ex.id]: ex.restSec || 90 }))}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="row gap" style={{ marginTop: 12 }}>
        <button className="btn btn-ghost" onClick={addExerciseRow}>+ Add Exercise</button>
        <div className="muted">Total Volume: <strong>{totalVolume}</strong> lb</div>
      </div>
    </div>
  );
}

/* widgets */
function SmallPlatePlanner({ weight }){
  const plan = getPlatePlan(weight);
  return (
    <div className="mini-card">
      <div className="muted">Plates/side for {weight} lb</div>
      <div>{planToString(plan)}</div>
    </div>
  );
}
function Small1RM({ weight, reps }){
  if (!weight || !reps) return null;
  const e = epley1RM(weight, reps), b = brzycki1RM(weight, reps);
  return (
    <div className="mini-card">
      <div className="muted">Est. 1RM</div>
      <div>{Math.round((e + b) / 2)} lb</div>
    </div>
  );
}
function TimerWidget({ seconds, onStart }){
  return (
    <div className="mini-card row gap">
      <button className="btn btn-glass" onClick={onStart}>Rest</button>
      <span>{seconds > 0 ? seconds + "s" : "Ready"}</span>
    </div>
  );
}
