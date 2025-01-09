import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaCalendar, FaLightbulb } from 'react-icons/fa';
import TaskForm from '../components/TaskForm';
import TaskView from '../components/TaskView';
import TaskProgress from '../components/TaskProgress';
import TaskStats from '../components/TaskStats';
import TaskCard from '../components/TaskCard';
import Calendar from '../components/Calendar';
import AIInsights from '../components/AIInsights';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState({
    dueToday: [],
    completed: [],
    overdue: []
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [showAIInsights, setShowAIInsights] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }

      if (data.success) {
        organizeTasks(data.tasks);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching tasks:', error);
    }
  };

  const organizeTasks = (allTasks) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const organized = {
      dueToday: [],
      completed: [],
      overdue: []
    };

    // Separate array for upcoming tasks (for calendar view)
    const upcomingTasks = [];

    allTasks?.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      
      if (task.status === 'completed') {
        organized.completed.push(task);
      } else if (taskDate < today) {
        organized.overdue.push(task);
      } else if (taskDate.getTime() === today.getTime()) {
        organized.dueToday.push(task);
      } else if (taskDate > today) {
        // Store upcoming tasks separately
        upcomingTasks.push(task);
      }
    });

    setTasks(organized);
    setUpcomingTasks(upcomingTasks); // Store upcoming tasks in separate state
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update task status');
      }

      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Get new status based on destination
    let newStatus;
    switch (destination.droppableId) {
      case 'completed':
        newStatus = 'completed';
        break;
      case 'overdue':
        newStatus = 'overdue';
        break;
      case 'dueToday':
        newStatus = 'pending';
        break;
      default:
        return;
    }

    // Update task in backend
    const success = await updateTaskStatus(draggableId, newStatus);
    
    if (success) {
      // Update local state
      const sourceList = Array.from(tasks[source.droppableId]);
      const destList = Array.from(tasks[destination.droppableId]);
      
      // Remove from source list
      const [movedTask] = sourceList.splice(source.index, 1);
      
      // Update task status
      movedTask.status = newStatus;
      
      // Add to destination list
      destList.splice(destination.index, 0, movedTask);

      // Update state
      setTasks({
        ...tasks,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destList
      });
    } else {
      // Refresh tasks if update failed
      fetchTasks();
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete task');
      }

      // Remove task from local state
      const updatedTasks = {
        dueToday: tasks.dueToday.filter(task => task._id !== taskId),
        completed: tasks.completed.filter(task => task._id !== taskId),
        overdue: tasks.overdue.filter(task => task._id !== taskId)
      };
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleTaskClick = (task, e) => {
    if (e.target.closest('button')) return;
    setViewingTask(task);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Task Dashboard
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAIInsights(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                transform hover:scale-105 transition-all duration-200 
                flex items-center shadow-lg"
            >
              <FaLightbulb className="mr-2" /> AI Insights
            </button>
            <button
              onClick={() => setShowCalendar(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                transform hover:scale-105 transition-all duration-200 
                flex items-center shadow-lg"
            >
              <FaCalendar className="mr-2" /> Calendar View
            </button>
            <button
              onClick={() => setShowTaskForm(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                transform hover:scale-105 transition-all duration-200 
                flex items-center shadow-lg"
            >
              <FaPlus className="mr-2" /> New Task
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg animate-fade-in">
            {error}
          </div>
        )}

        <TaskProgress tasks={tasks} />
        <TaskStats tasks={tasks} />

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <Droppable droppableId="dueToday">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="p-4 rounded-lg shadow-lg min-h-[400px] bg-blue-50 dark:bg-blue-900/20"
                  >
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      Due Today
                    </h2>
                    {tasks.dueToday.map((task, index) => (
                      <TaskCard 
                        key={task._id} 
                        task={task} 
                        index={index}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onTaskClick={handleTaskClick}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="col-span-1">
              <Droppable droppableId="completed">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="p-4 rounded-lg shadow-lg min-h-[400px] bg-green-50 dark:bg-green-900/20"
                  >
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      Completed
                    </h2>
                    {tasks.completed.map((task, index) => (
                      <TaskCard 
                        key={task._id} 
                        task={task} 
                        index={index}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onTaskClick={handleTaskClick}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="col-span-1">
              <Droppable droppableId="overdue">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="p-4 rounded-lg shadow-lg min-h-[400px] bg-red-50 dark:bg-red-900/20"
                  >
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      Overdue
                    </h2>
                    {tasks.overdue.map((task, index) => (
                      <TaskCard 
                        key={task._id} 
                        task={task} 
                        index={index}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onTaskClick={handleTaskClick}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>

        {showTaskForm && (
          <TaskForm 
            onClose={() => setShowTaskForm(false)} 
            onTaskAdded={fetchTasks}
          />
        )}

        {editingTask && (
          <TaskForm
            initialTask={editingTask}
            onClose={() => setEditingTask(null)}
            onTaskAdded={fetchTasks}
          />
        )}

        {viewingTask && (
          <TaskView
            task={viewingTask}
            onClose={() => setViewingTask(null)}
            onEdit={() => {
              setEditingTask(viewingTask);
              setViewingTask(null);
            }}
            onDelete={handleDeleteTask}
          />
        )}

        {showCalendar && (
          <Calendar
            tasks={[...Object.values(tasks), upcomingTasks]}
            onClose={() => setShowCalendar(false)}
            onTaskClick={(task) => {
              setViewingTask(task);
              setShowCalendar(false);
            }}
          />
        )}

        {showAIInsights && (
          <AIInsights
            tasks={[...Object.values(tasks).flat(), ...upcomingTasks]}
            onClose={() => setShowAIInsights(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard; 