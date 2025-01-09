const express = require("express");
const http = require("http");
const {
  initializeSocket,
  checkOverdueTasks,
  sendDailyDigest,
} = require("./services/notificationService");
const Task = require("./models/Task");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

// Check for overdue tasks every minute
setInterval(() => {
  checkOverdueTasks(Task);
}, 60000);

// Send daily digest
setInterval(() => {
  sendDailyDigest(Task, User);
}, 60000);

// Re-schedule notifications for existing tasks on server start
const initializeNotifications = async () => {
  try {
    const tasks = await Task.find({
      status: { $ne: "completed" },
      "notificationSettings.enabled": true,
    }).populate("userId");

    for (const task of tasks) {
      await scheduleTaskNotifications(task);
    }
    console.log("Notifications re-initialized for existing tasks");
  } catch (error) {
    console.error("Error initializing notifications:", error);
  }
};

initializeNotifications();
