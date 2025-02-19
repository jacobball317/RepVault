import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";  // ✅ Remove BrowserRouter
import CircuitForm from "./components/CircuitForm";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <span
        className={`dark-mode-toggle ${darkMode ? "active" : ""}`}
        onClick={toggleDarkMode}
      >
        🌙
      </span>

      <Routes>
        <Route
          path="/"
          element={
            <div className="home-container">
              <h1>Rep Vault</h1>
              <nav>
                <button>
                  <Link to="/create-circuit" style={{ textDecoration: "none", color: "white" }}>
                    Create Circuit
                  </Link>
                </button>
              </nav>
            </div>
          }
        />
        <Route path="/create-circuit" element={<CircuitForm darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="*" element={<h2>Page Not Found. <Link to="/">Go Home</Link></h2>} />
      </Routes>
    </div>
  );
}

export default App;
