// api/routes/users.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../database/user.model"); // Your User Model

const JWT_SECRET = process.env.JWT_SECRET; // 🚨 Use the same secret as in auth.js

// Utility function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" });
};

// --- 1. SIGN UP (POST /api/users/signup) ---
router.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body; // Role should typically be 'user' by default

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user", // Default to 'user' if not specified
    });

    res.status(201).json({
      id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid user data", error: error.message });
  }
});

// --- 2. LOGIN (POST /api/users/login) ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
});

module.exports = router;
