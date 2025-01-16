// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

// In-memory "database"
let users = [];
// Structure:
// users = [
//   {
//     id: "user-id-1",
//     email: "test@example.com",
//     password: "plaintext", // In production, use bcrypt to hash passwords!
//     circuits: [...], // stored user circuits
//   },
// ];

// Middleware
app.use(cors());
app.use(express.json());

// 1. User Registration
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  // Basic validation check
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  // Check if user exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists." });
  }
  // Create new user
  const newUser = {
    id: Date.now().toString(), // or use a UUID library
    email,
    password,
    circuits: [],
  };
  users.push(newUser);
  return res.status(201).json({ message: "User registered successfully." });
});

// 2. User Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  // For simplicity, let's return user data directly.
  // In production, you'd create a JWT or session token and return that instead.
  return res.status(200).json({
    id: user.id,
    email: user.email,
    circuits: user.circuits,
    message: "Login successful.",
  });
});

// 3. Save/Update Circuits
app.post("/api/circuits", (req, res) => {
  const { userId, circuit } = req.body;
  // Find the user
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  // Add the circuit to the user's circuits
  user.circuits.push(circuit);
  return res.status(200).json({ circuits: user.circuits });
});

// 4. Retrieve Circuits
app.get("/api/circuits/:userId", (req, res) => {
  const { userId } = req.params;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  return res.status(200).json({ circuits: user.circuits });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
