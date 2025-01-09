import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to Your Website
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Create beautiful and responsive web applications with modern technologies
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/about"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Learn More
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View GitHub
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          {
            title: 'Feature 1',
            description: 'Amazing feature description goes here',
            icon: '🚀',
          },
          {
            title: 'Feature 2',
            description: 'Another great feature description',
            icon: '⚡',
          },
          {
            title: 'Feature 3',
            description: 'One more awesome feature detail',
            icon: '🎯',
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
          Join us today and start building amazing things with our platform.
        </p>
        <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home; 