import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import CircuitForm from "./components/CircuitForm";
import LaserBackground from "./components/LaserBackground";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [savedCircuits, setSavedCircuits] = useState([]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const loadCircuits = () => {
    const storedCircuits = JSON.parse(localStorage.getItem("circuits")) || [];
    setSavedCircuits(storedCircuits);
    alert("Loaded previous circuits!");
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <span className="dark-mode-toggle" onClick={toggleDarkMode}>🌙</span>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <LaserBackground />
              <div className="home-container">
                <div className="glass-card">
                  <h1 className="neon-title">Rep Vault</h1>
                  <p className="subtext">Your Personal Workout Tracker</p>
                  <div className="button-container">
                    <Link to="/create-circuit" className="neon-btn">Create Circuit</Link>
                    <button className="neon-btn" onClick={loadCircuits}>Load Circuits</button>
                  </div>
                </div>
              </div>
            </>
          }
        />
        <Route path="/create-circuit" element={<CircuitForm darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="*" element={<h2 className="not-found">Page Not Found. <Link to="/">Go Home</Link></h2>} />
      </Routes>
    </div>
  );
}

export default App;
