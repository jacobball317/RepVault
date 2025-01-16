// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CircuitForm from "./components/CircuitForm";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userId") // If userId is stored, assume they're logged in
  );

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("circuits");
    setIsLoggedIn(false);
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

        <nav style={{ margin: "10px" }}>
          {!isLoggedIn && (
            <>
              <Link to="/login" style={{ marginRight: "10px" }}>
                Login
              </Link>
              <Link to="/register">Register</Link>
            </>
          )}
          {isLoggedIn && (
            <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
              Logout
            </button>
          )}
        </nav>

        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <div className="home-container">
                <h1>Rep Vault</h1>
                <nav>
                  {isLoggedIn ? (
                    <button>
                      <Link
                        to="/create-circuit"
                        style={{ textDecoration: "none", color: "white" }}
                      >
                        Create Circuit
                      </Link>
                    </button>
                  ) : (
                    <p>Please log in or register to create/view workouts.</p>
                  )}
                </nav>
              </div>
            }
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Register Page */}
          <Route
            path="/register"
            element={<RegisterPage />}
          />

          {/* Create Circuit Page (Protected) */}
          <Route
            path="/create-circuit"
            element={
              isLoggedIn ? (
                <CircuitForm darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              ) : (
                <h2>Please <Link to="/login">log in</Link> to continue.</h2>
              )
            }
          />

          {/* Handle undefined routes */}
          <Route
            path="*"
            element={
              <h2>
                Page Not Found. <Link to="/">Go Home</Link>
              </h2>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
