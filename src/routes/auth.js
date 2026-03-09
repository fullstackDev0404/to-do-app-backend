const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;


  try {
    // Make sure User.findOne is being called correctly
    const user = await User.findOne({ email });  // This should work if the model is correct
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate the JWT token
    const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1d" });

    // Send the token to the client
    res.json({ token, email: user.email });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
});

// Register Route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password before saving (password hashing done here)
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Create new user with hashed password
    const user = new User({
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Save user to the database
    await user.save();
    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during registration: ", err); // Log any errors for debugging
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;