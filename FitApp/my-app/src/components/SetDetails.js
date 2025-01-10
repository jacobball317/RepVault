import React, { useState } from "react";
import RestTimer from "./RestTimer";

function SetDetails({ sets, updateSets }) {
  const [restTimer, setRestTimer] = useState(false);

  const handleInputChange = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    updateSets(newSets);
  };

  const markSetDone = (index) => {
    const newSets = [...sets];
    newSets[index].done = true;
    updateSets(newSets);
    setRestTimer(true); // Start rest timer
  };

  const duplicateSet = (index) => {
    const newSets = [...sets];
    newSets.splice(index, 0, { ...sets[index] });
    updateSets(newSets);
  };

  return (
    <div>
      {sets.map((set, index) => (
        <div key={index} className="set-item">
          <label>
            Reps:
            <input
              type="number"
              value={set.reps}
              onChange={(e) =>
                handleInputChange(index, "reps", parseInt(e.target.value, 10) || 0)
              }
            />
          </label>
          <label>
            Weight:
            <input
              type="number"
              value={set.weight}
              onChange={(e) =>
                handleInputChange(index, "weight", parseInt(e.target.value, 10) || 0)
              }
            />
          </label>
          <button
            className="checkmark-button"
            onClick={() => markSetDone(index)}
            disabled={set.done}
          >
            ✔
          </button>
          <button className="duplicate-button" onClick={() => duplicateSet(index)}>
            Duplicate
          </button>
        </div>
      ))}
      {restTimer && <RestTimer onFinish={() => setRestTimer(false)} />}
    </div>
  );
}

export default SetDetails;
