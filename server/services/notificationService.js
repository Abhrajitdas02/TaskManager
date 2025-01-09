import { Server } from "socket.io";
import moment from "moment";

let io;
let notificationTimers = new Map();
let pendingNotifications = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join", async (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);

      // Send any pending notifications for this user
      const userPendingNotifications = pendingNotifications.get(userId) || [];
      for (const notification of userPendingNotifications) {
        if (moment(notification.dueTime).isAfter(moment())) {
          sendNotification(userId, notification);
        }
      }
      pendingNotifications.delete(userId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const sendNotification = (userId, notification) => {
  const userSocket = io.sockets.adapter.rooms.get(userId);

  if (userSocket) {
    io.to(userId).emit("notification", {
      ...notification,
      timestamp: new Date(),
      id: Math.random().toString(36).substr(2, 9),
    });
  } else {
    const userPendingNotifications = pendingNotifications.get(userId) || [];
    userPendingNotifications.push({
      ...notification,
      dueTime: new Date(),
    });
    pendingNotifications.set(userId, userPendingNotifications);
  }
};

export const scheduleTaskNotifications = async (task) => {
  try {
    clearTaskNotifications(task._id);

    if (!task.notificationSettings?.enabled) return;

    const dueDate = moment(task.dueDate);
    const now = moment();

    if (task.status === "completed") return;

    task.notificationSettings.reminderTimes.forEach((reminder) => {
      if (!reminder.enabled) return;

      const notificationTime = dueDate
        .clone()
        .subtract(reminder.minutes, "minutes");

      if (notificationTime.isBefore(now) && dueDate.isAfter(now)) {
        console.log(`Sending immediate notification for task: ${task.title}`);
        sendNotification(task.userId.toString(), {
          type: "deadline-approaching",
          title: `Task Due Soon`,
          message: `"${task.title}" is due ${dueDate.fromNow()}`,
          taskId: task._id,
          priority: task.priority,
          dueDate: task.dueDate,
        });
      } else if (notificationTime.isAfter(now)) {
        const delay = notificationTime.diff(now, "milliseconds");
        console.log(
          `Scheduling notification for task: ${task.title} in ${delay}ms`
        );

        const timerId = setTimeout(() => {
          sendNotification(task.userId.toString(), {
            type: "deadline-approaching",
            title: `Task Due Soon`,
            message: `"${task.title}" is due ${
              reminder.minutes === 60 ? "in 1 hour" : "in 2 hours"
            }`,
            taskId: task._id,
            priority: task.priority,
            dueDate: task.dueDate,
          });
        }, delay);

        const taskTimers = notificationTimers.get(task._id) || [];
        taskTimers.push(timerId);
        notificationTimers.set(task._id, taskTimers);
      }
    });
  } catch (error) {
    console.error("Error scheduling notifications:", error);
  }
};

export const clearTaskNotifications = (taskId) => {
  const timers = notificationTimers.get(taskId);
  if (timers) {
    timers.forEach(clearTimeout);
    notificationTimers.delete(taskId);
  }
};

export const checkOverdueTasks = async (Task) => {
  try {
    const now = moment();
    const tasks = await Task.find({
      status: "pending",
      dueDate: { $lt: now.toDate() },
      "notificationSettings.enabled": true,
    }).populate("userId");

    tasks.forEach(async (task) => {
      const lastNotified = task.lastNotified ? moment(task.lastNotified) : null;
      if (
        !lastNotified ||
        lastNotified.isBefore(now.clone().subtract(1, "hour"))
      ) {
        sendNotification(task.userId.toString(), {
          type: "task-overdue-reminder",
          title: "Task Still Overdue",
          message: `Task "${task.title}" is overdue by ${moment(
            task.dueDate
          ).fromNow(true)}`,
          taskId: task._id,
          priority: task.priority,
          dueDate: task.dueDate,
        });

        await Task.findByIdAndUpdate(task._id, {
          lastNotified: now.toDate(),
        });
      }
    });
  } catch (error) {
    console.error("Error checking overdue tasks:", error);
  }
};

export const sendDailyDigest = async (Task, User) => {
  try {
    const now = moment();
    if (now.format("HH:mm") === "09:00") {
      const users = await User.find();

      for (const user of users) {
        const [overdueTasks, upcomingTasks] = await Promise.all([
          Task.find({
            userId: user._id,
            status: "pending",
            dueDate: { $lt: now.toDate() },
          }),
          Task.find({
            userId: user._id,
            status: "pending",
            dueDate: {
              $gte: now.toDate(),
              $lte: now.clone().add(24, "hours").toDate(),
            },
          }),
        ]);

        if (overdueTasks.length > 0 || upcomingTasks.length > 0) {
          sendNotification(user._id.toString(), {
            type: "daily-digest",
            title: "Daily Task Update",
            message: `You have ${overdueTasks.length} overdue tasks and ${upcomingTasks.length} tasks due in the next 24 hours`,
            overdueTasks: overdueTasks.map((task) => ({
              title: task.title,
              dueDate: moment(task.dueDate).format("MMM D, h:mm A"),
              priority: task.priority,
            })),
            upcomingTasks: upcomingTasks.map((task) => ({
              title: task.title,
              dueDate: moment(task.dueDate).format("MMM D, h:mm A"),
              priority: task.priority,
            })),
          });
        }
      }
    }
  } catch (error) {
    console.error("Error sending daily digest:", error);
  }
};
