import React, { useState, useEffect } from "react";

function CircuitForm({ addCircuit, totalCircuits, darkMode, toggleDarkMode }) {
  const [circuitName, setCircuitName] = useState(""); // Circuit name
  const [cards, setCards] = useState([]); // Cards containing workouts
  const [isEditingName, setIsEditingName] = useState(false); // Editing circuit name state
  const [restTime, setRestTime] = useState(1); // Rest time in minutes
  const [timer, setTimer] = useState(null); // Timer for rest countdown

  // Add a new workout to a new card
  const addWorkout = () => {
    setCards([...cards, [{ name: "Abs", reps: 10, weight: 50, done: false }]]);
  };

  // Update a specific workout in a specific card
  const updateWorkout = (cardIndex, workoutIndex, field, value) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex][workoutIndex][field] = value;
    setCards(updatedCards);
  };

  // Toggle workout completion and start the rest timer
  const toggleWorkoutDone = (cardIndex, workoutIndex) => {
    const updatedCards = [...cards];
    const workout = updatedCards[cardIndex][workoutIndex];

    workout.done = !workout.done; // Toggle done status
    setCards(updatedCards);

    if (workout.done) {
      startRestTimer();

      // Duplicate the workout
      const duplicatedWorkout = { ...workout, done: false };
      updatedCards[cardIndex].push(duplicatedWorkout);
      setCards(updatedCards);
    }
  };

  // Start the rest timer
  const startRestTimer = () => {
    setTimer(restTime * 60); // Convert minutes to seconds
  };

  // Add one minute to the timer
  const addOneMinute = () => {
    setTimer((prevTimer) =>
      prevTimer !== null ? prevTimer + 60 : restTime * 60 + 60
    );
  };

  // Countdown effect for the rest timer
  useEffect(() => {
    if (timer === null || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [timer]);

  // Save the circuit name automatically when editing ends
  const handleNameBlur = () => {
    if (circuitName.trim() === "") {
      setCircuitName("name"); // Default back to "name" only on blur if input is empty
    }
    setIsEditingName(false);
  };

  // Save the circuit when user finishes adding workouts
  const saveCircuit = () => {
    addCircuit({ name: circuitName || "name", cards, restTime });
    setCircuitName("");
    setCards([]);
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="centered-content">
      {/* Dark Mode Toggle */}
      <span
        className={`dark-mode-toggle ${darkMode ? "active" : ""}`}
        onClick={toggleDarkMode}
      >
        🌙
      </span>

      {/* Editable Circuit Name */}
      <h2
        onClick={() => setIsEditingName(true)}
        style={{
          cursor: "pointer",
          marginBottom: "10px",
          color: circuitName ? (darkMode ? "white" : "#333") : "#aaa",
        }}
      >
        {isEditingName ? (
          <input
            type="text"
            value={circuitName}
            onChange={(e) => setCircuitName(e.target.value)}
            onBlur={handleNameBlur}
            autoFocus
            className="circuit-name-input"
          />
        ) : (
          circuitName || "name"
        )}
      </h2>

      {/* Rest Timer */}
      <div className="timer-section">
        Rest Timer: {timer !== null && timer > 0 ? formatTime(timer) : "Ready"}
        <select
          value={restTime}
          onChange={(e) => setRestTime(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((time) => (
            <option key={time} value={time}>
              {time} min
            </option>
          ))}
        </select>
        <button onClick={addOneMinute}>+1 min</button>
      </div>

      {/* Workout Cards */}
      {cards.map((workouts, cardIndex) => (
        <div
          key={cardIndex}
          className="workout-card"
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            backgroundColor: darkMode ? "#444" : "#f9f9f9",
          }}
        >
          {workouts.map((workout, index) => (
            <div key={index} className="workout-item">
              <input
                type="text"
                placeholder="Workout Name"
                value={workout.name}
                onChange={(e) =>
                  updateWorkout(cardIndex, index, "name", e.target.value)
                }
                style={{ flex: 2 }}
              />
              <div className="input-label-group">
                <input
                  type="number"
                  placeholder="Reps"
                  value={workout.reps}
                  onChange={(e) =>
                    updateWorkout(cardIndex, index, "reps", e.target.value)
                  }
                />
                <span className="field-label">Reps</span>
              </div>
              <div className="input-label-group">
                <input
                  type="number"
                  placeholder="Weight"
                  value={workout.weight}
                  onChange={(e) =>
                    updateWorkout(cardIndex, index, "weight", e.target.value)
                  }
                />
                <span className="field-label">Lbs</span>
              </div>
              <button
                onClick={() => toggleWorkoutDone(cardIndex, index)}
                style={{
                  backgroundColor: workout.done ? "#28a745" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "10px",
                }}
              >
                ✓
              </button>
            </div>
          ))}
        </div>
      ))}

      {/* Buttons at the Bottom */}
      <div className="bottom-buttons">
        <button onClick={addWorkout}>Add Workout</button>
        <button onClick={saveCircuit}>Save Circuit</button>
      </div>
    </div>
  );
}

export default CircuitForm;
