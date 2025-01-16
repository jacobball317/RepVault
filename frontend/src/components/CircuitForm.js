import React, { useState, useEffect } from "react";

function CircuitForm({ addCircuit, darkMode, toggleDarkMode }) {
  const [circuitName, setCircuitName] = useState(""); // Circuit name
  const [cards, setCards] = useState([]); // Cards containing workouts
  const [isEditingName, setIsEditingName] = useState(false); // Editing circuit name state
  const [restTime, setRestTime] = useState(1); // Rest time in minutes
  const [timer, setTimer] = useState(null); // Timer for rest countdown

  const userId = localStorage.getItem("userId"); // Logged-in user's ID

  // Fetch circuits on component mount
  useEffect(() => {
    const fetchCircuits = async () => {
      if (!userId) return; // Ensure user is logged in
      try {
        const response = await fetch(`http://localhost:5000/api/circuits/${userId}`);
        const data = await response.json();
        if (response.ok) {
          // If there are circuits, load the first one
          if (data.circuits && data.circuits.length > 0) {
            const lastCircuit = data.circuits[data.circuits.length - 1];
            setCircuitName(lastCircuit.name || "name");
            setCards(lastCircuit.cards || []);
            setRestTime(lastCircuit.restTime || 1);
          }
        } else {
          console.error(data.message || "Failed to fetch circuits");
        }
      } catch (error) {
        console.error("Error fetching circuits:", error);
      }
    };

    fetchCircuits();
  }, [userId]);

  // Add a new card with an initial workout
  const addCard = () => {
    setCards([...cards, [{ name: "New Workout", reps: 10, weight: 50, done: false }]]);
  };

  // Add a new workout to an existing card
  const addWorkoutToCard = (cardIndex) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].push({ name: "New Workout", reps: 10, weight: 50, done: false });
    setCards(updatedCards);
  };

  // Update a specific workout in a specific card
  const updateWorkout = (cardIndex, workoutIndex, field, value) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex][workoutIndex][field] = value;
    setCards(updatedCards);
  };

  // Toggle workout completion without adding a duplicate
  const toggleWorkoutDone = (cardIndex, workoutIndex) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex][workoutIndex].done = !updatedCards[cardIndex][workoutIndex].done;
    setCards(updatedCards);
    if (updatedCards[cardIndex][workoutIndex].done) {
      startRestTimer();
    }
  };

  // Start the rest timer
  const startRestTimer = () => {
    setTimer(restTime * 60); // Convert minutes to seconds
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

  // Save the circuit when the user finishes adding workouts
  const saveCircuit = async () => {
    const newCircuit = { name: circuitName || "name", cards, restTime };

    // Post to backend
    try {
      const response = await fetch("http://localhost:5000/api/circuits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, circuit: newCircuit }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Circuit saved successfully!");
        setCircuitName("");
        setCards([]);
      } else {
        alert(data.message || "Error saving circuit");
      }
    } catch (error) {
      console.error("Error saving circuit:", error);
    }
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
          <button
            onClick={() => addWorkoutToCard(cardIndex)}
            style={{
              marginTop: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            + Add Workout
          </button>
        </div>
      ))}

      {/* Buttons at the Bottom */}
      <div className="bottom-buttons">
        <button onClick={addCard}>Add Card</button>
        <button onClick={saveCircuit}>Save Circuit</button>
      </div>
    </div>
  );
}

export default CircuitForm;
