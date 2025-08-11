// Three prebuilt templates: Push, Pull, Legs
export default [
  {
    id: crypto.randomUUID(),
    name: "Push Day",
    notes: "Chest/Shoulders/Tris",
    exercises: [
      { id: crypto.randomUUID(), name: "Bench Press", sets: 4, reps: 6, weight: 135, restSec: 120, progression: "linear" },
      { id: crypto.randomUUID(), name: "Incline DB Press", sets: 3, reps: 10, weight: 45, restSec: 90, progression: "double" },
      { id: crypto.randomUUID(), name: "Overhead Press", sets: 3, reps: 8, weight: 95, restSec: 120, progression: "rpe", targetRPE: 8 },
      { id: crypto.randomUUID(), name: "Cable Fly", sets: 3, reps: 12, weight: 35, restSec: 60 },
    ],
    createdAt: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    name: "Pull Day",
    notes: "Back/Bis",
    exercises: [
      { id: crypto.randomUUID(), name: "Deadlift", sets: 3, reps: 5, weight: 225, restSec: 180, progression: "linear" },
      { id: crypto.randomUUID(), name: "Lat Pulldown", sets: 3, reps: 10, weight: 120, restSec: 90 },
      { id: crypto.randomUUID(), name: "Barbell Row", sets: 3, reps: 8, weight: 135, restSec: 120 },
      { id: crypto.randomUUID(), name: "DB Curl", sets: 3, reps: 12, weight: 30, restSec: 60 },
    ],
    createdAt: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    name: "Legs Day",
    notes: "Quads/Hams/Calves",
    exercises: [
      { id: crypto.randomUUID(), name: "Back Squat", sets: 4, reps: 6, weight: 185, restSec: 150, progression: "double" },
      { id: crypto.randomUUID(), name: "RDL", sets: 3, reps: 8, weight: 185, restSec: 120 },
      { id: crypto.randomUUID(), name: "Leg Press", sets: 3, reps: 12, weight: 4, restSec: 90, unit: "plates/side" },
      { id: crypto.randomUUID(), name: "Standing Calf Raise", sets: 4, reps: 12, weight: 90, restSec: 60 },
    ],
    createdAt: Date.now(),
  },
];