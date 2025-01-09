import React, { useState } from "react";

function WorkoutForm({ addWorkout }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    addWorkout({ name, sets: [] });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Workout Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Workout</button>
    </form>
  );
}

export default WorkoutForm;
