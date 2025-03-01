import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function SelectTemplate() {
  const navigate = useNavigate();

  const templates = [
    { name: "Push Day", workouts: ["Bench Press", "Shoulder Press", "Tricep Dips"] },
    { name: "Pull Day", workouts: ["Deadlifts", "Pull-ups", "Bicep Curls"] },
    { name: "Legs Day", workouts: ["Squats", "Leg Press", "Calf Raises"] },
  ];

  return (
    <div className="home-container fade-in">
      <div className="title-container center-title">
        <h2 className="neon-title glow-text">Select a Template</h2>
        <p className="subtext">Choose a workout template to get started</p>
      </div>
      <div className="template-grid-container">
        <div className="template-grid">
          {templates.map((template, index) => (
            <div 
              key={index} 
              className="glass-card hover-glow" 
              onClick={() => navigate("/create-template", { state: template })}
            >
              <h3>{template.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelectTemplate;