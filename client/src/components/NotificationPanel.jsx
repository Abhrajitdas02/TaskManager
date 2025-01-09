import React from 'react';

const NotificationPanel = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            Close
          </button>
        </div>
        <p className="text-gray-700 dark:text-gray-300">Customize your notification preferences here.</p>
        {/* Add form elements for notification settings */}
      </div>
    </div>
  );
};

export default NotificationPanel; 