import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaLightbulb, FaClock, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { getTaskInsights, getSmartSchedulingSuggestions } from '../services/aiService';

const AIInsights = ({ tasks, onClose }) => {
  const [insights, setInsights] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');
  const [requestSent, setRequestSent] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing your tasks...');

  const updateLoadingMessage = useCallback(() => {
    const messages = [
      'Analyzing your tasks...',
      'Generating insights...',
      'Creating personalized recommendations...',
      'Almost there...',
      'Finalizing suggestions...'
    ];
    let messageIndex = 0;

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchInsights = useCallback(async () => {
    if (requestSent) return;

    try {
      setLoading(true);
      setError(null);
      setRequestSent(true);
      updateLoadingMessage();

      // Add a minimum loading time of 3 seconds
      const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 3000));

      if (!tasks || tasks.length === 0) {
        await minimumLoadingTime;
        setInsights({
          priorityRecommendations: ["Add tasks to get personalized recommendations"],
          workloadInsights: ["Start adding tasks to see workload analysis"],
          productivityTips: ["Your productivity insights will appear here"],
          timeManagement: ["Time management tips will be shown once you add tasks"]
        });
        setSchedule({
          dailySchedule: ["Add tasks to get scheduling recommendations"],
          weeklyPlan: ["Weekly planning will appear when you add tasks"],
          timeBlockingSuggestions: ["Time blocking suggestions coming soon"],
          focusTimeRecommendations: ["Focus time recommendations will be shown here"]
        });
        return;
      }

      // Wait for both API responses and minimum loading time
      const [insightData, scheduleData] = await Promise.all([
        getTaskInsights(tasks),
        getSmartSchedulingSuggestions(tasks),
        minimumLoadingTime
      ]);

      setInsights(insightData);
      setSchedule(scheduleData);
    } catch (err) {
      console.error('AI Insights Error:', err);
      setError('Unable to generate insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [tasks, requestSent, updateLoadingMessage]);

  useEffect(() => {
    if (!requestSent) {
      fetchInsights();
    }
  }, [fetchInsights, requestSent]);

  const handleRefresh = () => {
    setRequestSent(false);
    fetchInsights();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Task Insights & Recommendations
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personalized suggestions for better productivity
            </p>
          </div>
          <div className="flex gap-2">
            {/* Optional refresh button */}
            {!loading && (
              <button
                onClick={handleRefresh}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaLightbulb size={24} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-4 py-2 ${
                activeTab === 'insights'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'schedule'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('schedule')}
            >
              Smart Schedule
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-center animate-pulse">
              {loadingMessage}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              This may take a few moments...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FaExclamationTriangle className="text-amber-500 text-4xl mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-center">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[60vh]">
            {activeTab === 'insights' && insights && (
              <div className="space-y-6">
                <InsightSection
                  title="Priority Recommendations"
                  items={insights.priorityRecommendations}
                  icon={<FaExclamationTriangle className="text-amber-500" />}
                />
                <InsightSection
                  title="Workload Insights"
                  items={insights.workloadInsights}
                  icon={<FaLightbulb className="text-blue-500" />}
                />
                <InsightSection
                  title="Productivity Tips"
                  items={insights.productivityTips}
                  icon={<FaCheckCircle className="text-green-500" />}
                />
                <InsightSection
                  title="Time Management"
                  items={insights.timeManagement}
                  icon={<FaClock className="text-purple-500" />}
                />
              </div>
            )}

            {activeTab === 'schedule' && schedule && (
              <div className="space-y-6">
                <ScheduleSection
                  title="Daily Schedule"
                  items={schedule.dailySchedule}
                />
                <ScheduleSection
                  title="Weekly Plan"
                  items={schedule.weeklyPlan}
                />
                <ScheduleSection
                  title="Time Blocking Suggestions"
                  items={schedule.timeBlockingSuggestions}
                />
                <ScheduleSection
                  title="Focus Time Recommendations"
                  items={schedule.focusTimeRecommendations}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InsightSection = ({ title, items, icon }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={index}
          className="text-gray-700 dark:text-gray-300 flex items-start gap-2"
        >
          <span className="text-purple-600 mt-1">•</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const ScheduleSection = ({ title, items }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
      {title}
    </h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={index}
          className="text-gray-700 dark:text-gray-300 flex items-start gap-2"
        >
          <span className="text-purple-600 mt-1">•</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default AIInsights; 