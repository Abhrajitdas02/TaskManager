import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ notifications, onCloseNotification }) => {
  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => onCloseNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 