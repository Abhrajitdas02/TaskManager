# Task Manager with AI Insights

A modern task management application with AI-powered insights, real-time notifications, and smart scheduling features.

## Features

### Core Features

- 📝 Task Creation and Management
- 🎯 Priority Levels (High, Medium, Low)
- 📅 Due Date Scheduling
- 🏷️ Task Status Tracking
- 🌓 Dark/Light Theme Support
- 📱 Responsive Design

### Smart Features

- 🤖 AI-Powered Task Insights
  - Workload Analysis
  - Priority Recommendations
  - Time Management Suggestions
  - Productivity Tips

### Notification System

- 🔔 Real-time Browser Notifications
- ⏰ Customizable Reminder Times
  - 1-hour and 2-hour reminders
  - Smart notification timing
- 📊 Task Status Updates
- 📬 Daily Task Digests
- 💡 Priority-based Notifications

### User Experience

- 🔐 Secure Authentication
- 🎨 Clean, Modern UI
- ⚡ Real-time Updates
- 📊 Task Analytics

## Technology Stack

### Frontend

- React.js
- Tailwind CSS
- Socket.io Client
- Google's Gemini AI

### Backend

- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Account
- Google Gemini API Key
- npm or yarn

### Environment Setup

REACT_APP_GEMINI_API_KEY
PORT=
MONGODB_URI=
JWT_SECRET=

## Usage Guide

1. **Getting Started**

   - Register a new account
   - Allow browser notifications when prompted
   - Set your theme preference

2. **Managing Tasks**

   - Click "Add Task" to create new tasks
   - Set task priority and due date
   - Enable notifications for important tasks
   - Update task status as needed

3. **Using AI Features**

   - View AI insights for task optimization
   - Follow productivity recommendations
   - Check workload analysis
   - Implement time management suggestions

4. **Notifications**
   - Receive alerts before task deadlines
   - Get daily task summaries
   - See real-time status updates
   - Click notifications to view tasks

## Browser Support

- Google Chrome (Recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari

## Known Limitations

- Browser notifications require permission
- AI insights require internet connection
- Limited to two reminder times
- Single user task management

## Future Enhancements

- Email notifications
- Mobile application
- Additional reminder options
- Calendar integration
- Team collaboration
- Task templates
- Advanced analytics
- Custom notification sounds

## Troubleshooting

### Common Issues

1. **Notifications not working**

   - Check browser notification permissions
   - Ensure browser is supported
   - Verify internet connection

2. **AI insights not loading**

   - Verify Gemini API key
   - Check internet connection
   - Ensure tasks are properly configured

3. **Connection issues**
   - Verify MongoDB connection string
   - Check server status
   - Confirm port availability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- MongoDB Atlas for database hosting
- Google Gemini AI for insights
- Socket.io for real-time features
- React and Node.js communities

## Deployment

The application is currently deployed at:

- Backend: https://taskmanager-9aik.onrender.com
- Frontend: http://localhost:3000

### Environment Setup

1. Frontend (.env):

```env
REACT_APP_API_URL=https://taskmanager-9aik.onrender.com
REACT_APP_SOCKET_URL=https://taskmanager-9aik.onrender.com
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

### Important Notes

- Ensure browser notifications are enabled
- Check internet connection for real-time features
- Allow CORS in your browser if needed
- Use HTTPS for secure connections
