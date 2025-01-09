// Collection of predefined suggestions for different categories
export const fallbackSuggestions = {
  priorityRecommendations: [
    "Focus on high-priority tasks first thing in the morning",
    "Schedule urgent deadlines for your peak productivity hours",
    "Break down complex high-priority tasks into smaller steps",
    "Allocate buffer time for unexpected high-priority tasks",
    "Review and adjust task priorities at the start of each day",
    "Group similar priority tasks together for better focus",
    "Set clear deadlines for all high-priority items",
    "Delegate low-priority tasks when possible",
    "Use the Eisenhower Matrix for priority management",
    "Schedule regular priority review sessions",
  ],

  workloadInsights: [
    "Distribute tasks evenly throughout the week",
    "Avoid scheduling more than 3 major tasks per day",
    "Leave buffer time between tasks for transitions",
    "Group similar tasks together for better efficiency",
    "Schedule breaks between high-intensity tasks",
    "Balance creative and administrative work",
    "Use time-blocking for better workload management",
    "Plan for unexpected tasks in your schedule",
    "Maintain a consistent daily workload",
    "Alternate between complex and simple tasks",
  ],

  productivityTips: [
    "Use the Pomodoro Technique for focused work sessions",
    "Take regular breaks to maintain productivity",
    "Create a distraction-free work environment",
    "Set specific goals for each work session",
    "Use task batching for similar activities",
    "Start with your most challenging task",
    "Track your productive hours and plan accordingly",
    "Minimize context switching between tasks",
    "Use productivity apps for better focus",
    "Practice mindfulness during work sessions",
  ],

  timeManagement: [
    "Block specific time slots for focused work",
    "Set reminders for important deadlines",
    "Use the 2-minute rule for quick tasks",
    "Schedule regular planning sessions",
    "Avoid multitasking for better efficiency",
    "Create daily to-do lists with time estimates",
    "Use time tracking to improve estimates",
    "Schedule buffer time for unexpected issues",
    "Set realistic deadlines for tasks",
    "Review and adjust time management strategies weekly",
  ],

  dailySchedule: [
    "Start with a morning planning session",
    "Focus on complex tasks during peak energy hours",
    "Schedule meetings in the afternoon",
    "Take regular breaks every 90 minutes",
    "End the day with planning for tomorrow",
    "Use mornings for creative work",
    "Schedule admin tasks for low-energy periods",
    "Include buffer time for unexpected tasks",
    "Align tasks with your natural energy cycles",
    "Set clear start and end times for work",
  ],

  weeklyPlan: [
    "Monday: Focus on planning and organization",
    "Tuesday: Tackle most challenging projects",
    "Wednesday: Focus on collaborative work",
    "Thursday: Complete remaining important tasks",
    "Friday: Review progress and plan next week",
    "Schedule regular team check-ins",
    "Allocate time for skill development",
    "Plan for project milestones",
    "Include time for documentation",
    "Set aside time for innovation and creativity",
  ],

  timeBlockingSuggestions: [
    "Create 2-hour deep work blocks",
    "Schedule 30-minute breaks between blocks",
    "Allocate specific times for emails and communication",
    "Block out time for learning and development",
    "Set aside time for planning and review",
    "Create focused blocks for similar tasks",
    "Schedule buffer time between major tasks",
    "Align blocks with your energy levels",
    "Protect your most productive hours",
    "Include flexible blocks for unexpected work",
  ],

  focusTimeRecommendations: [
    "Use morning hours for complex tasks",
    "Schedule creative work during peak focus times",
    "Minimize interruptions during deep work",
    "Create a pre-focus routine",
    "Use ambient noise for better concentration",
    "Set clear goals for focus sessions",
    "Use website blockers during focus time",
    "Practice mindfulness before deep work",
    "Create a dedicated focus workspace",
    "Track and optimize your focus periods",
  ],
};

// Function to get random suggestions
export const getRandomSuggestions = (category, count = 3) => {
  const suggestions = fallbackSuggestions[category];
  const result = [];
  const usedIndices = new Set();

  while (result.length < count && result.length < suggestions.length) {
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      result.push(suggestions[randomIndex]);
    }
  }

  return result;
};

// Function to get fallback insights
export const getFallbackInsights = () => {
  return {
    priorityRecommendations: getRandomSuggestions("priorityRecommendations"),
    workloadInsights: getRandomSuggestions("workloadInsights"),
    productivityTips: getRandomSuggestions("productivityTips"),
    timeManagement: getRandomSuggestions("timeManagement"),
  };
};

// Function to get fallback schedule
export const getFallbackSchedule = () => {
  return {
    dailySchedule: getRandomSuggestions("dailySchedule"),
    weeklyPlan: getRandomSuggestions("weeklyPlan"),
    timeBlockingSuggestions: getRandomSuggestions("timeBlockingSuggestions"),
    focusTimeRecommendations: getRandomSuggestions("focusTimeRecommendations"),
  };
};
