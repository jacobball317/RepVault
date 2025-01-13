import React from "react";

function CircuitList({ circuits, darkMode }) {
  return (
    <div
      className="circuit-list-container"
      style={{
        backgroundColor: darkMode ? "#333" : "#fff",
        color: darkMode ? "#fff" : "#000",
        padding: "20px",
        borderRadius: "8px",
        minHeight: "100vh",
      }}
    >
      <h2>Circuit List</h2>

      {/* Render list of circuits */}
      {circuits.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {circuits.map((circuit, index) => (
            <li
              key={index}
              style={{
                margin: "10px 0",
                padding: "10px",
                border: `1px solid ${darkMode ? "#555" : "#ddd"}`,
                borderRadius: "8px",
                backgroundColor: darkMode ? "#444" : "#f9f9f9",
              }}
            >
              <h3>{circuit.name || `Circuit ${index + 1}`}</h3>
              <p>Rest Time: {circuit.restTime} minutes</p>
              <p>Total Workouts: {circuit.cards.length}</p>

              {/* List workouts */}
              {circuit.cards.length > 0 && (
                <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                  {circuit.cards.map((workouts, cardIndex) => (
                    <li key={cardIndex} style={{ marginBottom: "5px" }}>
                      <strong>Workout {cardIndex + 1}:</strong>
                      <ul>
                        {workouts.map((workout, workoutIndex) => (
                          <li key={workoutIndex}>
                            {workout.name} - {workout.reps} reps @ {workout.weight} lbs
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No circuits available. Go back and create some circuits!</p>
      )}
    </div>
  );
}

export default CircuitList;
