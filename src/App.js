import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import CircuitForm from "./components/CircuitForm";  // ✅ Ensure this is correctly imported
import LaserBackground from "./components/LaserBackground";
import "./App.css";

function App() {
  const [savedCircuits, setSavedCircuits] = useState([]);

  const loadCircuits = () => {
    const storedCircuits = JSON.parse(localStorage.getItem("circuits")) || [];
    setSavedCircuits(storedCircuits);
    alert("Loaded previous circuits!");
  };

  return (
    <div className="App">  {/* ✅ Wrap with a div to avoid fragment issues */}
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
                    <Link to="/create-circuit" className="neon-btn">Create Circuit</Link> {/* ✅ Correct Routing */}
                    <button className="neon-btn" onClick={loadCircuits}>Load Circuits</button>
                  </div>
                </div>
              </div>
            </>
          }
        />
        <Route path="/create-circuit" element={<CircuitForm />} />  {/* ✅ Add this */}
        <Route path="*" element={<h2 className="not-found">Page Not Found. <Link to="/">Go Home</Link></h2>} />
      </Routes>
    </div>
  );
}

export default App;
