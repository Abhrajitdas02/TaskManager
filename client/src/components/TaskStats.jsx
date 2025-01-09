import React from 'react';
import { FaClock, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const StatCard = ({ title, count, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} mr-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{count}</h3>
      </div>
    </div>
  </div>
);

const TaskStats = ({ tasks }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <StatCard
      title="Due Today"
      count={tasks.dueToday.length}
      icon={FaClock}
      color="bg-blue-500"
    />
    <StatCard
      title="Completed"
      count={tasks.completed.length}
      icon={FaCheck}
      color="bg-green-500"
    />
    <StatCard
      title="Overdue"
      count={tasks.overdue.length}
      icon={FaExclamationTriangle}
      color="bg-red-500"
    />
  </div>
);

export default TaskStats; 