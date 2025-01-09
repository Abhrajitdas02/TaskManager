import React from 'react';

const TaskProgress = ({ tasks }) => {
  const totalTasks = Object.values(tasks).flat().length;
  const completedTasks = tasks.completed.length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Progress</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>
        <div className="text-2xl font-bold text-purple-600">{progress}%</div>
      </div>
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-purple-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default TaskProgress; 