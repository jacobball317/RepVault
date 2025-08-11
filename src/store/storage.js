const CIRCUITS_KEY = "repvault.circuits.v1";
const SESSIONS_KEY = "repvault.sessions.v1";

export function loadCircuits() {
  try { return JSON.parse(localStorage.getItem(CIRCUITS_KEY)) || []; } catch { return []; }
}
export function saveCircuits(circuits) {
  localStorage.setItem(CIRCUITS_KEY, JSON.stringify(circuits));
}

export function loadSessions() {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || []; } catch { return []; }
}
export function saveSessions(sessions) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function importAll(json) {
  const { circuits = [], sessions = [] } = json || {};
  saveCircuits(circuits); saveSessions(sessions);
}
export function exportAll() {
  return {
    circuits: loadCircuits(),
    sessions: loadSessions(),
    exportedAt: new Date().toISOString(),
    version: 1,
  };
}