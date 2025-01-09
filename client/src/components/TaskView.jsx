import React from 'react';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const TaskView = ({ task, onClose, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Task Details
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="text-purple-600 hover:text-purple-700"
              title="Edit task"
            >
              <FaEdit size={20} />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-red-600 hover:text-red-700"
              title="Delete task"
            >
              <FaTrash size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-700"
              title="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {task.description || 'No description provided'}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Due Date: </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Status: </span>
              <span className={`font-medium ${
                task.status === 'completed' 
                  ? 'text-green-600' 
                  : task.status === 'overdue' 
                  ? 'text-red-600' 
                  : 'text-yellow-600'
              }`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Priority: </span>
            <span className={`font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskView; 