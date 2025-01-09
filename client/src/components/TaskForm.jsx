import React, { useState } from 'react';
import { FaTimes, FaBell, FaClock } from 'react-icons/fa';
import moment from 'moment';

const TaskForm = ({ onClose, onTaskAdded, initialTask = null }) => {
  const [formData, setFormData] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    dueDate: initialTask?.dueDate 
      ? moment(initialTask.dueDate).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD'),
    dueTime: initialTask?.dueDate 
      ? moment(initialTask.dueDate).format('HH:mm')
      : moment().add(1, 'hour').format('HH:mm'),
    priority: initialTask?.priority || 'medium',
    status: initialTask?.status || 'pending',
    notificationSettings: {
      enabled: initialTask?.notificationSettings?.enabled ?? true,
      reminderTimes: initialTask?.notificationSettings?.reminderTimes || [
        { minutes: 60, enabled: true }
      ],
      priorityLevels: initialTask?.notificationSettings?.priorityLevels || {
        high: true,
        medium: true,
        low: true
      },
      channels: {
        browser: true,
        email: false
      }
    }
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Limit reminder options to 1 and 2 hours only
  const reminderOptions = [
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' }
  ];

  const handleAddReminder = (minutes) => {
    if (!formData.notificationSettings.reminderTimes.some(r => r.minutes === minutes)) {
      setFormData({
        ...formData,
        notificationSettings: {
          ...formData.notificationSettings,
          reminderTimes: [
            ...formData.notificationSettings.reminderTimes,
            { minutes, enabled: true }
          ].sort((a, b) => b.minutes - a.minutes)
        }
      });
    }
  };

  const handleRemoveReminder = (index) => {
    const newTimes = [...formData.notificationSettings.reminderTimes];
    newTimes.splice(index, 1);
    setFormData({
      ...formData,
      notificationSettings: {
        ...formData.notificationSettings,
        reminderTimes: newTimes
      }
    });
  };

  const handleToggleReminder = (index, enabled) => {
    const newTimes = [...formData.notificationSettings.reminderTimes];
    newTimes[index] = { ...newTimes[index], enabled };
    setFormData({
      ...formData,
      notificationSettings: {
        ...formData.notificationSettings,
        reminderTimes: newTimes
      }
    });
  };

  const formatReminderTime = (minutes) => {
    if (minutes >= 10080) return `${minutes / 10080} week(s)`;
    if (minutes >= 1440) return `${minutes / 1440} day(s)`;
    if (minutes >= 60) return `${minutes / 60} hour(s)`;
    return `${minutes} minute(s)`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate notification settings
      if (formData.notificationSettings.enabled && 
          formData.notificationSettings.reminderTimes.length === 0) {
        throw new Error('Please add at least one reminder time when notifications are enabled');
      }

      const combinedDateTime = moment(
        `${formData.dueDate} ${formData.dueTime}`,
        'YYYY-MM-DD HH:mm'
      ).toISOString();

      // Clean and validate notification settings
      const cleanedNotificationSettings = {
        enabled: Boolean(formData.notificationSettings.enabled),
        reminderTimes: formData.notificationSettings.reminderTimes.map(reminder => ({
          minutes: Number(reminder.minutes),
          enabled: Boolean(reminder.enabled)
        })),
        priorityLevels: {
          high: Boolean(formData.notificationSettings.priorityLevels.high),
          medium: Boolean(formData.notificationSettings.priorityLevels.medium),
          low: Boolean(formData.notificationSettings.priorityLevels.low)
        },
        channels: {
          browser: Boolean(formData.notificationSettings.channels.browser),
          email: Boolean(formData.notificationSettings.channels.email)
        }
      };

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: combinedDateTime,
        priority: formData.priority,
        status: formData.status,
        notificationSettings: cleanedNotificationSettings
      };

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please sign in again');

      const url = initialTask 
        ? `http://localhost:5000/api/tasks/${initialTask._id}`
        : 'http://localhost:5000/api/tasks';

      const res = await fetch(url, {
        method: initialTask ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save task');

      // Request notification permission if browser notifications are enabled
      if (taskData.notificationSettings.channels.browser) {
        await requestNotificationPermission();
      }

      onTaskAdded();
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to request notification permission
  const requestNotificationPermission = async () => {
    try {
      if (!("Notification" in window)) {
        throw new Error("This browser does not support desktop notifications");
      }

      if (Notification.permission === "granted") {
        return true;
      }

      if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
      }

      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto py-4 z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-lg z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {initialTask ? 'Edit Task' : 'New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Wrap everything in a form */}
        <form onSubmit={handleSubmit}>
          {/* Form Content - Scrollable */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              {/* Basic Task Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    rows="3"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Due Time</label>
                  <input
                    type="time"
                    name="dueTime"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {initialTask && (
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Notification Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notification Settings
                  </h3>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notificationSettings.enabled}
                      onChange={(e) => setFormData({
                        ...formData,
                        notificationSettings: {
                          ...formData.notificationSettings,
                          enabled: e.target.checked
                        }
                      })}
                      className="sr-only"
                    />
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${
                      formData.notificationSettings.enabled ? 'bg-purple-600' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform transform ${
                        formData.notificationSettings.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </div>
                  </label>
                </div>

                {formData.notificationSettings.enabled && (
                  <div className="space-y-4 pl-4">
                    {/* Priority Levels */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notify for Priority Levels:
                      </label>
                      <div className="mt-2 space-x-4">
                        {['high', 'medium', 'low'].map(priority => (
                          <label key={priority} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.notificationSettings.priorityLevels[priority]}
                              onChange={(e) => setFormData({
                                ...formData,
                                notificationSettings: {
                                  ...formData.notificationSettings,
                                  priorityLevels: {
                                    ...formData.notificationSettings.priorityLevels,
                                    [priority]: e.target.checked
                                  }
                                }
                              })}
                              className="rounded border-gray-300 text-purple-600"
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {priority}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Reminder Times */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reminder Times
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {reminderOptions.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleAddReminder(option.value)}
                            className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 
                              text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 
                              dark:hover:bg-purple-900/50 transition-colors"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {formData.notificationSettings.reminderTimes.map((reminder, index) => (
                          <div key={index} 
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={reminder.enabled}
                                onChange={(e) => handleToggleReminder(index, e.target.checked)}
                                className="rounded border-gray-300 text-purple-600"
                              />
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                {formatReminderTime(reminder.minutes)} before due time
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveReminder(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notification Channels */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notification Channels:
                      </label>
                      <div className="mt-2 space-y-2">
                        {Object.entries(formData.notificationSettings.channels).map(([channel, enabled]) => (
                          <label key={channel} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => setFormData({
                                ...formData,
                                notificationSettings: {
                                  ...formData.notificationSettings,
                                  channels: {
                                    ...formData.notificationSettings.channels,
                                    [channel]: e.target.checked
                                  }
                                }
                              })}
                              className="rounded border-gray-300 text-purple-600"
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {channel}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : (initialTask ? 'Save Changes' : 'Add Task')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm; 