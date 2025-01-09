import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Gemini API key not found in environment variables!");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Large collection of fallback tips
const fallbackTips = {
  priorityRecommendations: [
    "Focus on high-priority tasks during your peak energy hours",
    "Break complex tasks into smaller, manageable steps",
    "Use the Eisenhower Matrix to prioritize tasks effectively",
    "Address urgent deadlines before non-time-sensitive work",
    "Review and adjust priorities at the start of each day",
    "Tackle the most challenging task when you're most alert",
    "Group similar priority tasks together for better focus",
    "Set clear deadlines for all high-priority items",
    "Delegate low-priority tasks when possible",
    "Schedule buffer time for unexpected high-priority tasks",
    "Use time-blocking for priority tasks",
    "Maintain a priority task list separate from regular tasks",
    "Re-evaluate priorities every few hours",
    "Focus on one priority task at a time",
    "Set realistic expectations for high-priority work",
  ],
  workloadInsights: [
    "Distribute tasks evenly throughout the week",
    "Avoid scheduling more than 3 major tasks per day",
    "Leave buffer time between tasks for transitions",
    "Group similar tasks together for better efficiency",
    "Schedule breaks between high-intensity tasks",
    "Balance creative and administrative work",
    "Monitor your energy levels throughout the day",
    "Adjust workload based on task complexity",
    "Plan for unexpected interruptions",
    "Use time-tracking to improve estimates",
    "Maintain a consistent daily workload",
    "Alternate between complex and simple tasks",
    "Schedule focused work during quiet hours",
    "Build in flexibility for urgent requests",
    "Review workload distribution weekly",
  ],
  productivityTips: [
    "Use the Pomodoro Technique (25 min work, 5 min break)",
    "Create a distraction-free workspace",
    "Set specific goals for each work session",
    "Take regular breaks to maintain focus",
    "Use task batching for similar activities",
    "Minimize context switching between tasks",
    "Keep a clean and organized workspace",
    "Use productivity apps to track progress",
    "Practice mindfulness during work sessions",
    "Stay hydrated and maintain energy levels",
    "Use noise-canceling headphones when needed",
    "Follow the two-minute rule for quick tasks",
    "Maintain a daily accomplishments log",
    "Set up automated reminders for tasks",
    "Create templates for recurring tasks",
  ],
  timeManagement: [
    "Block specific time slots for focused work",
    "Use time-boxing to limit task duration",
    "Schedule regular planning sessions",
    "Set realistic deadlines with buffer time",
    "Use calendar blocking for better time allocation",
    "Review and adjust time estimates regularly",
    "Track time spent on different activities",
    "Identify and eliminate time-wasters",
    "Schedule similar tasks together",
    "Use the 2-minute rule for quick tasks",
    "Plan tomorrow's schedule today",
    "Set specific start and end times",
    "Use time-tracking tools for insights",
    "Schedule buffer time for unexpected issues",
    "Regular time audit of activities",
  ],
  dailySchedule: [
    "Start with a morning planning session",
    "Schedule most important tasks first",
    "Use time-blocking for focused work",
    "Take regular breaks every 90 minutes",
    "Group similar tasks together",
    "Schedule email checks at specific times",
    "Plan buffer time between meetings",
    "End day with planning tomorrow",
    "Use morning hours for complex work",
    "Schedule creative work during peak hours",
    "Set specific times for communications",
    "Allow flexibility in your schedule",
    "Review progress mid-day",
    "Schedule breaks strategically",
    "End each day with a review",
  ],
  weeklyPlan: [
    "Plan your week every Sunday evening",
    "Distribute challenging tasks across days",
    "Schedule regular weekly reviews",
    "Balance workload throughout week",
    "Set weekly goals and priorities",
    "Allow time for unexpected tasks",
    "Group similar tasks by day",
    "Schedule focus days for major projects",
    "Plan lighter days after intense ones",
    "Include time for skill development",
    "Review previous week's progress",
    "Adjust plans based on energy levels",
    "Schedule collaborative work strategically",
    "Plan buffer days for overflow work",
    "Set realistic weekly objectives",
  ],
  timeBlockingSuggestions: [
    "Block 2-hour chunks for deep work",
    "Schedule breaks between blocks",
    "Group similar tasks in blocks",
    "Protect your blocked time",
    "Use color coding for different blocks",
    "Schedule buffer blocks for flexibility",
    "Block time for regular reviews",
    "Create focused work blocks",
    "Plan communication blocks",
    "Set specific goals for each block",
    "Review and adjust blocks weekly",
    "Block time for self-development",
    "Create transition time between blocks",
    "Schedule energy-appropriate blocks",
    "Maintain consistent block schedules",
  ],
  focusTimeRecommendations: [
    "Use morning hours for complex tasks",
    "Create a dedicated focus space",
    "Turn off notifications during focus time",
    "Use ambient noise for concentration",
    "Set clear goals for focus sessions",
    "Practice mindfulness before focusing",
    "Use time-tracking during focus time",
    "Maintain a focus ritual",
    "Schedule focus time during peak hours",
    "Protect your focus time",
    "Use focus-enhancing techniques",
    "Create optimal focus conditions",
    "Set focus session boundaries",
    "Review focus session effectiveness",
    "Adjust focus duration as needed",
  ],
};

// Helper function to get random items from an array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to generate random insights
const generateRandomInsights = (tasks) => {
  return {
    priorityRecommendations: getRandomItems(
      fallbackTips.priorityRecommendations,
      4
    ),
    workloadInsights: getRandomItems(fallbackTips.workloadInsights, 4),
    productivityTips: getRandomItems(fallbackTips.productivityTips, 4),
    timeManagement: getRandomItems(fallbackTips.timeManagement, 4),
  };
};

// Function to generate random schedule
const generateRandomSchedule = () => {
  return {
    dailySchedule: getRandomItems(fallbackTips.dailySchedule, 3),
    weeklyPlan: getRandomItems(fallbackTips.weeklyPlan, 3),
    timeBlockingSuggestions: getRandomItems(
      fallbackTips.timeBlockingSuggestions,
      3
    ),
    focusTimeRecommendations: getRandomItems(
      fallbackTips.focusTimeRecommendations,
      3
    ),
  };
};

const timeout = (promise, ms = 45000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    ),
  ]);
};

export const getTaskInsights = async (tasks) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const formattedTasks = tasks.map((task) => ({
      title: task.title,
      dueDate: new Date(task.dueDate).toLocaleDateString(),
      priority: task.priority,
      status: task.status,
    }));

    const prompt = `You are a productivity expert. Here are the tasks to analyze:
    ${JSON.stringify(formattedTasks, null, 2)}

    Provide recommendations in this exact JSON format:
    {
      "priorityRecommendations": ["4 specific suggestions for task priorities"],
      "workloadInsights": ["4 insights about managing the workload"],
      "productivityTips": ["4 tips for staying productive"],
      "timeManagement": ["4 time management strategies"]
    }

    Keep each suggestion under 100 characters.
    Make recommendations specific to the given tasks.
    Focus on practical, actionable advice.`;

    const result = await timeout(model.generateContent(prompt));
    const response = await result.response;
    const text = response.text();

    try {
      const jsonStr = text.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(jsonStr);

      const requiredKeys = [
        "priorityRecommendations",
        "workloadInsights",
        "productivityTips",
        "timeManagement",
      ];
      const isValidResponse = requiredKeys.every(
        (key) => Array.isArray(parsedData[key]) && parsedData[key].length === 4
      );

      if (!isValidResponse) {
        throw new Error("Invalid response structure");
      }

      return parsedData;
    } catch (parseError) {
      console.error("Parse error:", parseError);
      throw new Error("Failed to parse AI response");
    }
  } catch (error) {
    console.error("AI Insight Error:", error);
    return generateRandomInsights(tasks);
  }
};

export const getSmartSchedulingSuggestions = async (tasks) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const formattedTasks = tasks.map((task) => ({
      title: task.title,
      dueDate: new Date(task.dueDate).toLocaleDateString(),
      priority: task.priority,
      status: task.status,
    }));

    const prompt = `You are a scheduling expert. Here are the tasks to schedule:
    ${JSON.stringify(formattedTasks, null, 2)}

    Create a scheduling plan in this exact JSON format:
    {
      "dailySchedule": ["3 specific daily scheduling recommendations"],
      "weeklyPlan": ["3 weekly planning suggestions"],
      "timeBlockingSuggestions": ["3 time blocking recommendations"],
      "focusTimeRecommendations": ["3 focus time suggestions"]
    }

    Keep each suggestion under 100 characters.
    Make recommendations specific to the given tasks.
    Focus on practical scheduling advice.`;

    const result = await timeout(model.generateContent(prompt));
    const response = await result.response;
    const text = response.text();

    try {
      const jsonStr = text.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(jsonStr);

      const requiredKeys = [
        "dailySchedule",
        "weeklyPlan",
        "timeBlockingSuggestions",
        "focusTimeRecommendations",
      ];
      const isValidResponse = requiredKeys.every(
        (key) => Array.isArray(parsedData[key]) && parsedData[key].length === 3
      );

      if (!isValidResponse) {
        throw new Error("Invalid response structure");
      }

      return parsedData;
    } catch (parseError) {
      console.error("Parse error:", parseError);
      throw new Error("Failed to parse AI response");
    }
  } catch (error) {
    console.error("AI Scheduling Error:", error);
    return generateRandomSchedule();
  }
};

export const getTaskCompletion = async (task) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze this task and provide a detailed breakdown:
    ${JSON.stringify(task, null, 2)}

    Return a JSON object with these exact keys and format:
    {
      "steps": [
        "step 1",
        "step 2",
        "step 3"
      ],
      "timeEstimates": {
        "step 1": "time",
        "step 2": "time",
        "step 3": "time"
      },
      "challenges": [
        "challenge 1",
        "challenge 2",
        "challenge 3"
      ],
      "resources": [
        "resource 1",
        "resource 2",
        "resource 3"
      ],
      "successCriteria": [
        "criteria 1",
        "criteria 2",
        "criteria 3"
      ]
    }

    Make recommendations specific to the task.
    Keep suggestions practical and actionable.
    Return only the JSON object, no additional text.`;

    const result = await timeout(model.generateContent(prompt));
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("AI Task Completion Error:", error);
    throw error;
  }
};
