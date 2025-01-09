import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FaEdit, FaTrash, FaClock, FaFlag } from 'react-icons/fa';

const TaskCard = ({ task, index, onEdit, onDelete, onTaskClick }) => {
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-gray-800 border-red-500';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800 border-yellow-500';
      case 'low':
        return 'bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 border-green-500';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-500';
    }
  };

  const formatDueDate = (date) => {
    const dueDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dueDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return dueDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <Draggable draggableId={task._id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={(e) => onTaskClick(task, e)}
          className={`
            p-4 mb-3 rounded-lg shadow-md
            border-l-4 ${getPriorityStyles(task.priority)}
            ${snapshot.isDragging ? 'shadow-xl scale-105' : 'hover:shadow-lg hover:-translate-y-1'}
            transform transition-all duration-200 cursor-pointer
          `}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {task.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {task.description || 'No description'}
              </p>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                title="Edit task"
              >
                <FaEdit className="text-gray-500 hover:text-purple-500" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task._id);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                title="Delete task"
              >
                <FaTrash className="text-gray-500 hover:text-red-500" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <FaClock className="mr-1" />
              {formatDueDate(task.dueDate)}
            </div>
            <div className="flex items-center">
              <FaFlag className={`mr-1 ${
                task.priority === 'high' ? 'text-red-500' :
                task.priority === 'medium' ? 'text-yellow-500' :
                'text-green-500'
              }`} />
              <span className="text-gray-600 dark:text-gray-400 capitalize">
                {task.priority}
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard; 