import Task from "../models/Task.js";
import {
  scheduleTaskNotifications,
  clearTaskNotifications,
} from "../services/notificationService.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    // Ensure notification settings are properly structured
    const taskData = {
      ...req.body,
      userId: req.user._id,
      notificationSettings: {
        enabled: req.body.notificationSettings?.enabled ?? true,
        reminderTimes: req.body.notificationSettings?.reminderTimes || [
          { minutes: 60, enabled: true },
        ],
        priorityLevels: req.body.notificationSettings?.priorityLevels || {
          high: true,
          medium: true,
          low: false,
        },
        channels: req.body.notificationSettings?.channels || {
          browser: true,
          email: false,
        },
      },
    };

    const task = new Task(taskData);
    await task.save();
    await scheduleTaskNotifications(task);

    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all tasks for the current user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ userId });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized",
      });
    }

    // Prepare notification settings update
    let updatedNotificationSettings = req.body.notificationSettings;
    if (updatedNotificationSettings) {
      updatedNotificationSettings = {
        enabled:
          updatedNotificationSettings.enabled ??
          task.notificationSettings.enabled,
        reminderTimes:
          updatedNotificationSettings.reminderTimes?.map((reminder) => ({
            minutes: parseInt(reminder.minutes),
            enabled: reminder.enabled ?? true,
          })) || task.notificationSettings.reminderTimes,
        priorityLevels: {
          high:
            updatedNotificationSettings.priorityLevels?.high ??
            task.notificationSettings.priorityLevels.high,
          medium:
            updatedNotificationSettings.priorityLevels?.medium ??
            task.notificationSettings.priorityLevels.medium,
          low:
            updatedNotificationSettings.priorityLevels?.low ??
            task.notificationSettings.priorityLevels.low,
        },
        channels: {
          browser:
            updatedNotificationSettings.channels?.browser ??
            task.notificationSettings.channels.browser,
          email:
            updatedNotificationSettings.channels?.email ??
            task.notificationSettings.channels.email,
        },
      };
    }

    // Prepare update data
    const updates = {
      ...req.body,
      notificationSettings:
        updatedNotificationSettings || task.notificationSettings,
    };

    // Clear existing notifications
    clearTaskNotifications(task._id);

    // Update task
    Object.assign(task, updates);
    await task.save();

    // Schedule new notifications if not completed
    if (task.status !== "completed") {
      await scheduleTaskNotifications(task);
    }

    res.json({ success: true, task });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update task",
    });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized",
      });
    }

    clearTaskNotifications(task._id);
    await task.deleteOne();

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete task",
    });
  }
};
