import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import BrowserNotificationService from '../services/browserNotificationService';
import io from 'socket.io-client';
import ToastContainer from '../components/ToastContainer';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check and send notifications for upcoming tasks
  const checkUpcomingTasks = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        const now = new Date();
        const pendingTasks = data.tasks.filter(task => {
          if (task.status !== 'pending' || !task.notificationSettings?.enabled) return false;
          
          const dueDate = new Date(task.dueDate);
          const timeDiff = dueDate - now;
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          return hoursDiff > 0 && hoursDiff <= 2; // Due within next 2 hours
        });

        console.log('Found pending tasks:', pendingTasks);

        pendingTasks.forEach(task => {
          const dueDate = new Date(task.dueDate);
          const timeDiff = dueDate - now;
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));

          let message;
          if (minutesDiff <= 0) {
            message = `Task "${task.title}" is due now!`;
          } else if (minutesDiff < 60) {
            message = `Task "${task.title}" is due in ${minutesDiff} minutes`;
          } else {
            const hours = Math.floor(minutesDiff / 60);
            const mins = minutesDiff % 60;
            message = `Task "${task.title}" is due in ${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` and ${mins} minutes` : ''}`;
          }

          // Show both toast and browser notification
          const notificationData = {
            type: 'deadline-approaching',
            title: 'Upcoming Task',
            message,
            taskId: task._id,
            priority: task.priority,
            dueDate: task.dueDate,
          };

          addNotification(notificationData);

          // Show browser notification
          BrowserNotificationService.showNotification('Upcoming Task', {
            body: message,
            tag: task._id,
            requireInteraction: true,
            icon: '/logo192.png'
          });
        });
      }
    } catch (error) {
      console.error('Error checking upcoming tasks:', error);
    }
  };

  // Send welcome notifications when user logs in
  const sendWelcomeNotifications = async () => {
    // Welcome notification
    const welcomeNotification = {
      type: 'info',
      title: 'Welcome Back!',
      message: `Welcome back ${user.name || 'User'}! You have pending tasks to complete.`,
      priority: 'medium',
      dueDate: new Date(),
    };
    addNotification(welcomeNotification);
    await BrowserNotificationService.showNotification(
      welcomeNotification.title,
      { body: welcomeNotification.message }
    );

    // Fake pending tasks notifications
    const fakeNotifications = [
      {
        type: 'reminder',
        title: 'Work Pending',
        message: 'You have 3 high priority tasks pending for today',
        priority: 'high',
        dueDate: new Date(),
      },
      {
        type: 'deadline',
        title: 'Upcoming Deadline',
        message: 'Project submission deadline in 2 hours',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
      {
        type: 'reminder',
        title: 'Daily Update',
        message: 'Remember to update your daily progress report',
        priority: 'medium',
        dueDate: new Date(Date.now() + 30 * 60 * 1000),
      }
    ];

    // Send fake notifications with delays
    fakeNotifications.forEach((notification, index) => {
      setTimeout(async () => {
        addNotification(notification);
        await BrowserNotificationService.showNotification(
          notification.title,
          { 
            body: notification.message,
            tag: `fake-${index}`,
            requireInteraction: true
          }
        );
      }, (index + 1) * 2000); // Send each notification 2 seconds apart
    });
  };

  // Initialize notifications and socket
  useEffect(() => {
    if (!user) return;

    const initializeNotifications = async () => {
      try {
        // Request notification permission first
        const permissionGranted = await BrowserNotificationService.requestPermission();
        console.log('Notification permission granted:', permissionGranted);

        // Send welcome notifications
        await sendWelcomeNotifications();

        // Check for actual tasks
        await checkUpcomingTasks();

        // Set up periodic checks every minute
        const checkInterval = setInterval(checkUpcomingTasks, 60000);

        // Initialize socket connection
        const newSocket = io('http://localhost:5000', {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
          console.log('Socket connected');
          newSocket.emit('join', user._id);
          
          // Show connection notification
          const connectionNotification = {
            type: 'info',
            title: 'Connected',
            message: 'Task notification service is active',
            priority: 'low',
            dueDate: new Date(),
          };
          
          addNotification(connectionNotification);
          BrowserNotificationService.showNotification(
            connectionNotification.title,
            { body: connectionNotification.message }
          );
        });

        newSocket.on('notification', (notification) => {
          console.log('Received socket notification:', notification);
          addNotification(notification);
          
          BrowserNotificationService.showNotification(
            notification.title,
            {
              body: notification.message,
              tag: notification.taskId,
              requireInteraction: true,
              icon: '/logo192.png'
            }
          );
        });

        setSocket(newSocket);

        // Set up periodic fake reminders
        const reminderInterval = setInterval(() => {
          const randomReminders = [
            'Remember to take a break and stretch!',
            'Time to review your task progress',
            'Don\'t forget to update your task status',
            'Check your upcoming deadlines',
            'Time for a quick progress check'
          ];
          
          const reminder = {
            type: 'reminder',
            title: 'Quick Reminder',
            message: randomReminders[Math.floor(Math.random() * randomReminders.length)],
            priority: 'low',
            dueDate: new Date(),
          };

          addNotification(reminder);
          BrowserNotificationService.showNotification(
            reminder.title,
            { body: reminder.message }
          );
        }, 30 * 60 * 1000); // Send a random reminder every 30 minutes

        return () => {
          newSocket.disconnect();
          clearInterval(checkInterval);
          clearInterval(reminderInterval);
        };
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, [user]);

  const addNotification = (notification) => {
    console.log('Adding notification:', notification);
    setNotifications(prev => [
      {
        ...notification,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      },
      ...prev
    ].slice(0, 5)); // Keep only last 5 notifications
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <ToastContainer 
        notifications={notifications}
        onCloseNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext); 