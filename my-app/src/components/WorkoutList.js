import React from "react";
import SetDetails from "./SetDetails";

function WorkoutList({ workouts, updateWorkout }) {
  const addSet = (index) => {
    const newSet = { reps: 0, weight: 0, done: false };
    const updatedWorkout = { ...workouts[index] };
    updatedWorkout.sets.push(newSet);
    updateWorkout(index, updatedWorkout);
  };

  return (
    <div>
      {workouts.map((workout, index) => (
        <div key={index}>
          <h2>{workout.name}</h2>
          <button onClick={() => addSet(index)}>Add Set</button>
          <SetDetails
            sets={workout.sets}
            updateSets={(newSets) => {
              const updatedWorkout = { ...workouts[index], sets: newSets };
              updateWorkout(index, updatedWorkout);
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default WorkoutList;
