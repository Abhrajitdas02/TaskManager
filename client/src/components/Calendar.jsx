import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FaTimes, FaExclamationTriangle, FaClock, FaFlag, FaCalendarAlt } from 'react-icons/fa';

const Calendar = ({ tasks, onClose, onTaskClick }) => {
  const getEventStyles = (task) => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const isUpcoming = dueDate > today;
    const isToday = dueDate.toDateString() === today.toDateString();

    let styles = {
      backgroundColor: '#6B7280', // default gray
      borderColor: '#4B5563',
      textColor: '#ffffff',
      className: ''
    };

    // First check status, then check if it's upcoming
    if (task.status === 'overdue') {
      styles = {
        backgroundColor: '#EF4444', // red
        borderColor: '#DC2626',
        textColor: '#ffffff',
        className: 'overdue-task'
      };
    } else if (task.status === 'completed') {
      styles = {
        backgroundColor: '#10B981', // green
        borderColor: '#059669',
        textColor: '#ffffff',
        className: 'completed-task'
      };
    } else if (task.priority === 'high') {
      styles = {
        backgroundColor: '#F59E0B', // amber
        borderColor: '#D97706',
        textColor: '#ffffff',
        className: 'high-priority-task'
      };
    } else if (isUpcoming) {
      styles = {
        backgroundColor: '#8B5CF6', // purple
        borderColor: '#7C3AED',
        textColor: '#ffffff',
        className: 'upcoming-task'
      };
    }

    // Add animation for important tasks
    if (task.status === 'overdue' || task.priority === 'high' || isToday) {
      styles.className += ' animate-pulse';
    }

    return styles;
  };

  const formatTaskDetails = (task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const isOverdue = task.status === 'overdue';
    const isHighPriority = task.priority === 'high';
    const isUpcoming = dueDate > today;
    const isToday = dueDate.toDateString() === today.toDateString();

    // Calculate days until due
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    let timeStatus = '';
    if (daysUntilDue > 0) {
      timeStatus = `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`;
    } else if (daysUntilDue === 0) {
      timeStatus = 'Due today';
    } else {
      timeStatus = `${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) === 1 ? '' : 's'} overdue`;
    }

    return {
      id: task._id,
      title: task.title,
      start: task.dueDate,
      allDay: true,
      ...getEventStyles(task),
      extendedProps: {
        task,
        isOverdue,
        isHighPriority,
        isUpcoming,
        isToday,
        timeStatus,
        formattedDate: dueDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }
    };
  };

  // Flatten and format all tasks including upcoming
  const events = tasks.flat().map(task => formatTaskDetails(task));

  const handleEventClick = (info) => {
    onTaskClick(info.event.extendedProps.task);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full h-[90vh] max-w-6xl mx-4 overflow-y-auto">
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Task Calendar
              </h2>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-gray-600 dark:text-gray-400">Overdue</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                  <span className="text-gray-600 dark:text-gray-400">High Priority</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  <span className="text-gray-600 dark:text-gray-400">Due Today</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                  <span className="text-gray-600 dark:text-gray-400">Upcoming</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="p-6">
          <div className="calendar-container dark:bg-gray-800 dark:text-white">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              height="auto"
              eventContent={(eventInfo) => {
                const { task, isOverdue, isHighPriority, isToday, timeStatus } = eventInfo.event.extendedProps;
                return (
                  <div className={`
                    p-1 rounded-sm w-full
                    ${(isOverdue || isHighPriority || isToday) ? 'animate-pulse' : ''}
                  `}>
                    <div className="flex items-center gap-1">
                      {isOverdue && <FaExclamationTriangle className="text-white" size={12} />}
                      {isHighPriority && <FaFlag className="text-white" size={12} />}
                      {isToday && <FaCalendarAlt className="text-white" size={12} />}
                      <span className="font-semibold truncate">{task.title}</span>
                    </div>
                    <div className="flex items-center text-xs gap-1 mt-1">
                      <FaClock size={10} />
                      <span>{timeStatus}</span>
                    </div>
                  </div>
                );
              }}
              eventDidMount={(info) => {
                const { task, formattedDate, timeStatus } = info.event.extendedProps;
                info.el.title = `
                  ${task.title}
                  ${timeStatus}
                  Due: ${formattedDate}
                  Priority: ${task.priority}
                  Status: ${task.status}
                  ${task.description ? `\nDescription: ${task.description}` : ''}
                `.trim();
              }}
              dayMaxEvents={3}
              moreLinkContent={(args) => `+${args.num} more`}
              moreLinkClick="popover"
              themeSystem="standard"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar; 