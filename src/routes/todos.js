const express = require("express");
const Todo = require("../models/Todo");
const verifyToken = require("../middleware/authMiddleware");  // Import the verifyToken middleware
const router = express.Router();

// POST: Create a new todo
router.post("/create", verifyToken, async (req, res) => {
  const { title, description } = req.body;

  try {
    // Check if user is authenticated
    const userId = req.user.id;  // Extract the user ID from the request

    console.log(userId);
    if (!userId) {
      return res.status(400).json({ error: "User ID not found" });
    }

    const newTodo = new Todo({
      title,
      description,
      userId: userId,  // Store user ID in the todo
    });

    await newTodo.save();

    res.status(201).json(newTodo);  // Return the created todo
  } catch (err) {
    console.error("Error creating todo: ", err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET: Fetch all todos for the authenticated user
router.get("/get", verifyToken, async (req, res) => {
  try {
    // Get the user ID from the request object (from the verified token)
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found" });
    }

    // Fetch all todos belonging to the user
    const todos = await Todo.find({ userId });

    if (!todos || todos.length === 0) {
      return res.status(404).json({ error: "No todos found" });
    }

    // Return the list of todos
    res.status(200).json(todos);
  } catch (err) {
    console.error("Error fetching todos: ", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE: Delete a todo by ID
router.delete("/todos/:id", verifyToken, async (req, res) => {
  const { id } = req.params;  // Get the ID of the todo to delete

  try {
    // Get the user ID from the verified token
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found" });
    }

    // Find the todo by ID and ensure it belongs to the authenticated user
    const todo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found or you don't have permission" });
    }

    // Return success response
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo: ", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;