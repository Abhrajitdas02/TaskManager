import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// Sign Up Controller
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sign In Controller
export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    console.log("Attempting login for:", username);

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create token with user ID
    const token = jwt.sign(
      { id: user._id }, // Simplified payload
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("Generated token:", token);
    const { password: pass, ...userWithoutPassword } = user._doc;

    // Send response with token and user data
    res.status(200).json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sign Out Controller
export const signout = async (req, res) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ success: true, message: "Signed out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error signing out" });
  }
};

// Check Auth Status
export const checkAuth = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.json({ user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.json({ user: null });

    const { password, ...rest } = user._doc;
    res.json({ user: rest });
  } catch (error) {
    res.json({ user: null });
  }
};
