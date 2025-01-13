import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CircuitForm from "./components/CircuitForm";
import CircuitList from "./components/CircuitList";
import "./App.css";

function App() {
  const [circuits, setCircuits] = useState([]); // List of circuits
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  // Add a new circuit
  const addCircuit = (newCircuit) => {
    setCircuits([...circuits, newCircuit]);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        {/* Dark Mode Toggle */}
        <span
          className={`dark-mode-toggle ${darkMode ? "active" : ""}`}
          onClick={toggleDarkMode}
        >
          🌙
        </span>

        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <div className="home-container">
                <h1>Rep Vault</h1>
                <nav>
                  <button>
                    <Link
                      to="/create-circuit"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      Create Circuit
                    </Link>
                  </button>
                  <button>
                    <Link
                      to="/view-circuits"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      View Circuits
                    </Link>
                  </button>
                </nav>
              </div>
            }
          />

          {/* Create Circuit Page */}
          <Route
            path="/create-circuit"
            element={
              <CircuitForm
                addCircuit={addCircuit}
                totalCircuits={circuits.length}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />

          {/* View Circuits Page */}
          <Route
            path="/view-circuits"
            element={
              <CircuitList circuits={circuits} darkMode={darkMode} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
