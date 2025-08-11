import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SelectTemplate({
  circuits = [],
  onDuplicate = () => {},
  onDelete = () => {},
}) {
  const navigate = useNavigate();

  const start = (id) => navigate(`/edit/${id}?start=1`);
  const edit  = (id) => navigate(`/edit/${id}`);

  return (
    <div className="page-container">
      <h1 className="neon-title" style={{ textAlign: "center" }}>Select a Template</h1>

      {(!circuits || circuits.length === 0) && (
        <div className="card" style={{ marginBottom: 16 }}>
          <p className="muted">No templates yet. Create one to get started.</p>
          <div className="row gap">
            <Link to="/create-template" className="btn btn-primary">Create New</Link>
            <ImportExport />
          </div>
        </div>
      )}

      <div className="templates-grid">
        {(circuits || []).map((c) => (
          <div key={c.id} className="template-card">
            <div className="row space" style={{ marginBottom: 6 }}>
              <h3 style={{ margin: 0 }}>{c.name}</h3>
              <span className="muted">{c.exercises?.length ?? 0} exercises</span>
            </div>

            {c.notes ? <p className="muted" style={{ marginTop: 0 }}>{c.notes}</p> : null}

            <div className="card-actions">
              <button className="btn btn-primary" onClick={() => start(c.id)}>Start</button>
              <button className="btn btn-glass"   onClick={() => edit(c.id)}>Edit</button>
              <button className="btn btn-ghost"   onClick={() => onDuplicate(c.id)}>Duplicate</button>
              <button className="btn btn-danger"  onClick={() => onDelete(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {circuits.length > 0 && (
        <div className="row gap" style={{ marginTop: 16 }}>
          <Link to="/create-template" className="btn btn-primary">Create New</Link>
          <ImportExport />
        </div>
      )}
    </div>
  );
}

/* same ImportExport from before… */
function ImportExport() {
  const CIRCUITS_KEYS = ["repvault.circuits", "repvault.circuits.v1"];
  const SESSIONS_KEYS = ["repvault.sessions", "repvault.sessions.v1"];
  const readFirst = (keys) => { for (const k of keys){ try{ const v=JSON.parse(localStorage.getItem(k)||"null"); if(v) return v; }catch{} } return []; };
  const writeAll = (keys, value) => { for (const k of keys){ try{ localStorage.setItem(k, JSON.stringify(value)); }catch{} } };

  const download = () => {
    const circuits = readFirst(CIRCUITS_KEYS);
    const sessions = readFirst(SESSIONS_KEYS);
    const blob = new Blob([JSON.stringify({ circuits, sessions }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `repvault-backup-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const upload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try{
      const json = JSON.parse(reader.result);
      writeAll(CIRCUITS_KEYS, json.circuits || []);
      writeAll(SESSIONS_KEYS, json.sessions || []);
      window.location.reload();
    }catch{ alert("Invalid JSON file."); } };
    reader.readAsText(file);
  };

  return (
    <div className="row gap">
      <button className="btn btn-ghost" onClick={download}>Export</button>
      <label className="btn btn-glass" style={{ cursor: "pointer" }}>
        Import
        <input type="file" accept="application/json" onChange={upload} hidden />
      </label>
    </div>
  );
}
