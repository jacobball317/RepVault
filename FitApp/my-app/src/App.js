import React, { useState } from "react";
import WorkoutList from "./components/WorkoutList";
import WorkoutForm from "./components/WorkoutForm";
import "./App.css";

function App() {
  const [workouts, setWorkouts] = useState([]);

  const addWorkout = (workout) => {
    setWorkouts([...workouts, workout]);
  };

  const updateWorkout = (index, updatedWorkout) => {
    const newWorkouts = [...workouts];
    newWorkouts[index] = updatedWorkout;
    setWorkouts(newWorkouts);
  };

  return (
    <div className="App">
      <h1>Workout Tracker</h1>
      <WorkoutForm addWorkout={addWorkout} />
      <WorkoutList workouts={workouts} updateWorkout={updateWorkout} />
    </div>
  );
}

export default App;
