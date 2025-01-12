import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig"; // Firebase configuration
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // Track authenticated user
  const [workouts, setWorkouts] = useState([]); // Track workout data
  const [loading, setLoading] = useState(true); // Loading state for data fetch

  // Handle Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch saved workouts from Firestore
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (user) {
        try {
          const workoutCollection = collection(db, "workouts");
          const workoutSnapshot = await getDocs(workoutCollection);
          const userWorkouts = workoutSnapshot.docs
            .filter((doc) => doc.data().uid === user.uid) // Filter by logged-in user
            .map((doc) => doc.data().workouts);

          setWorkouts(userWorkouts.length > 0 ? userWorkouts[0] : []);
        } catch (error) {
          console.error("Error fetching workouts: ", error);
        }
      }
    };

    fetchWorkouts();
  }, [user]);

  // Save workouts to Firestore
  const saveWorkout = async () => {
    if (!user) {
      alert("Please log in to save your workouts.");
      return;
    }

    try {
      const workoutData = {
        uid: user.uid,
        workouts,
        timestamp: new Date(),
      };
      await addDoc(collection(db, "workouts"), workoutData);
      alert("Workout saved successfully!");
    } catch (error) {
      console.error("Error saving workout: ", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setWorkouts([]);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  // Main app UI
  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="App">
        <Login onLogin={() => setWorkouts([])} />
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Workout Tracker</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <WorkoutForm
        addWorkout={(workout) => setWorkouts([...workouts, workout])}
      />
      <WorkoutList
        workouts={workouts}
        updateWorkout={(index, updatedWorkout) => {
          const newWorkouts = [...workouts];
          newWorkouts[index] = updatedWorkout;
          setWorkouts(newWorkouts);
        }}
      />
      <button className="save-button" onClick={saveWorkout}>
        Save Workout
      </button>
    </div>
  );
}

export default App;
