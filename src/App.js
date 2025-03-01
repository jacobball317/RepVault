import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import CircuitForm from "./components/CircuitForm";  // ✅ Ensure this is correctly imported
import SelectTemplate from "./components/SelectTemplate";
import LaserBackground from "./components/LaserBackground";
import "./App.css";

function App() {
  const navigate = useNavigate();

  const loadTemplates = () => {
    navigate("/select-template"); // Redirect to template selection page
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
                {/* New Glowing Orb */}
                <div className="glowing-orb"></div>

                <div className="glass-card">
                  <h1 className="neon-title">Rep Vault</h1>
                  <p className="subtext">Your Personal Workout Tracker</p>
                  <div className="button-container">
                    <Link to="/create-template" className="neon-btn">Create Template</Link>
                    <button className="neon-btn" onClick={loadTemplates}>Load Templates</button>
                  </div>
                </div>
              </div>
            </>
          }
        />
        <Route path="/create-template" element={<CircuitForm />} />  {/* ✅ Add this */}
        <Route path="/select-template" element={<SelectTemplate />} />  {/* ✅ Route to SelectTemplate */}
        <Route path="*" element={<h2 className="not-found">Page Not Found. <Link to="/">Go Home</Link></h2>} />
      </Routes>
    </div>
  );
}

export default App;
