import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";
import { createServer } from "http";
import {
  initializeSocket,
  checkOverdueTasks,
  sendDailyDigest,
} from "./services/notificationService.js";
import Task from "./models/Task.js";
import User from "./models/User.js";

// Load environment variables first
dotenv.config();

// Verify environment variables are loaded
const { MONGODB_URI, PORT = 5000, JWT_SECRET } = process.env;
if (!MONGODB_URI) {
  console.error("MongoDB URI is not defined in environment variables");
  process.exit(1);
}

const app = express();
const server = createServer(app);

// Initialize socket.io
const io = initializeSocket(server);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Schedule notification checks
setInterval(() => {
  checkOverdueTasks(Task);
}, 60000); // Check every minute

setInterval(() => {
  sendDailyDigest(Task, User);
}, 60000); // Check every minute

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    // Start server with socket.io
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Handle errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});
