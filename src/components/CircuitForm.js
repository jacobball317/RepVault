import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CircuitForm.css";

function CircuitForm({ addCircuit, darkMode, toggleDarkMode }) {
  const [circuitName, setCircuitName] = useState("Workout1");
  const [workouts, setWorkouts] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [restTime, setRestTime] = useState(1);
  const [timer, setTimer] = useState(null);

  // Add a new workout with an initial set
  const addWorkout = () => {
    setWorkouts([
      ...workouts,
      { name: "New Workout", sets: [{ reps: 10, weight: 50, done: false }] },
    ]);
  };

  // Add a new set to an existing workout
  const addSetToWorkout = (workoutIndex) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[workoutIndex].sets.push({
      reps: 10,
      weight: 50,
      done: false,
    });
    setWorkouts(updatedWorkouts);
  };

  // Update a specific set in a workout
  const updateSet = (workoutIndex, setIndex, field, value) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[workoutIndex].sets[setIndex][field] = value;
    setWorkouts(updatedWorkouts);
  };

  // Toggle set completion with animation
  const toggleSetDone = (workoutIndex, setIndex) => {
    const updatedWorkouts = [...workouts];
    const set = updatedWorkouts[workoutIndex].sets[setIndex];
    set.done = !set.done;
    setWorkouts(updatedWorkouts);

    if (set.done) {
      startRestTimer();
    }
  };

  // Start the rest timer
  const startRestTimer = () => {
    setTimer(restTime * 60);
  };

  // Countdown effect for the rest timer
  useEffect(() => {
    if (timer === null || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Save the workout circuit
  const saveCircuit = () => {
    addCircuit({ name: circuitName, workouts, restTime });
    setCircuitName("Workout1");
    setWorkouts([]);
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="workout-container">
      <span className="dark-mode-toggle" onClick={toggleDarkMode}>
        🌙
      </span>

      <Link to="/" className="home-btn">
        🏠 Home
      </Link>

      <h2 className="neon-title" onClick={() => setIsEditingName(true)}>
        {isEditingName ? (
          <input
            type="text"
            value={circuitName}
            onChange={(e) => setCircuitName(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            autoFocus
            className="neon-input"
          />
        ) : (
          circuitName
        )}
      </h2>

      {/* Rest Timer UI */}
      <div className="timer-section">
        <p className="rest-timer-text">
          Rest Timer: <strong>{timer !== null && timer > 0 ? formatTime(timer) : "Ready"}</strong>
        </p>
        <select
          className="dropdown"
          value={restTime}
          onChange={(e) => setRestTime(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((time) => (
            <option key={time} value={time}>
              {time} min
            </option>
          ))}
        </select>
      </div>

      {/* Progress Bar for Rest Timer */}
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${(timer / (restTime * 60)) * 100}%` }}
        ></div>
      </div>

      {/* Workout Section */}
      {workouts.map((workout, workoutIndex) => (
        <div key={workoutIndex} className="workout-card">
          <h3 className="workout-title">{workout.name}</h3>
          <div className="set-header">
            <p>Set</p>
            <p>Weight (lbs)</p>
            <p>Reps</p>
            <p>Done</p>
          </div>
          {workout.sets.map((set, setIndex) => (
            <div key={setIndex} className="set-item">
              <p className="set-number">{setIndex + 1}</p>
              <input
                type="number"
                value={set.weight}
                onChange={(e) => updateSet(workoutIndex, setIndex, "weight", e.target.value)}
                className="neon-input"
              />
              <input
                type="number"
                value={set.reps}
                onChange={(e) => updateSet(workoutIndex, setIndex, "reps", e.target.value)}
                className="neon-input"
              />
              <button
                className={`checkmark-btn ${set.done ? "completed" : ""}`}
                onClick={() => toggleSetDone(workoutIndex, setIndex)}
              >
                ✓
              </button>
            </div>
          ))}
          <button className="neon-btn" onClick={() => addSetToWorkout(workoutIndex)}>
            + Add Set
          </button>
        </div>
      ))}

      <div className="button-container">
        <button className="neon-btn" onClick={addWorkout}>
          + Add Workout
        </button>
        <button className="neon-btn" onClick={saveCircuit}>
          Save Circuit
        </button>
      </div>
    </div>
  );
}

export default CircuitForm;
