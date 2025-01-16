import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CircuitForm from "./components/CircuitForm";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

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
                </nav>
              </div>
            }
          />

          {/* Create Circuit Page */}
          <Route
            path="/create-circuit"
            element={
              <CircuitForm
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />
          {/* Handle undefined routes */}
          <Route
            path="*"
            element={<h2>Page Not Found. <Link to="/">Go Home</Link></h2>}
          />
        </Routes>
      </div>
    </Router>
  );
}

if (module.hot) {
  module.hot.accept();
}

console.log("Home Screen Rendered");

export default App;
