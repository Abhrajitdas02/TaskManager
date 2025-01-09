import React, { useEffect } from 'react';
import { FaBell, FaClock, FaTimes } from 'react-icons/fa';

const Toast = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000); // Auto close after 10 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`
      flex items-start p-4 mb-3 rounded-lg shadow-lg
      bg-white dark:bg-gray-800 border-l-4 ${getPriorityColor(notification.priority)}
      animate-slide-in
    `}>
      <div className="flex-shrink-0 mr-3">
        <FaBell className="text-gray-400 dark:text-gray-500" size={20} />
      </div>
      <div className="flex-1 mr-2">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {notification.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {notification.message}
        </p>
        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
          <FaClock className="mr-1" />
          <span>Due {new Date(notification.dueDate).toLocaleString()}</span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <FaTimes size={16} />
      </button>
    </div>
  );
};

export default Toast; 