const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/auth");
const todoRoutes = require("./src/routes/todos");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/todo_app_full")
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));