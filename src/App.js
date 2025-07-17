import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";
import CircuitForm from "./components/CircuitForm";  // ✅ Ensure this is correctly imported
import SelectTemplate from "./components/SelectTemplate";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect;
    if (!vantaRef.current.vantaEffect) {
      vantaEffect = NET({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        color: 0x00e5ff,
        backgroundColor: 0x0a0a0a,
      });
      vantaRef.current.vantaEffect = vantaEffect;
    }

    return () => {
      if (vantaRef.current.vantaEffect) {
        vantaRef.current.vantaEffect.destroy();
        delete vantaRef.current.vantaEffect;
      }
    };
  }, []);

  const loadTemplates = () => {
    navigate("/select-template"); // Redirect to template selection page
  };

  return (
    <div className="App">
      <div className="vanta-background" ref={vantaRef}></div>
      <div className="floating-nav">
        {/* Removed the Create and Templates links as per instructions */}
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="home-container">
                {/* New Glowing Orb */}
                <div className="glowing-orb"></div>

                <div className="glass-card">
                  <h1 className="neon-title">Rep Vault</h1>
                  <p className="subtext">Track, Build, and Optimize Your Workout Routines</p>
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
