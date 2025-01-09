import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const { currentUser, setCurrentUser } = useAuth();

  const handleSignOut = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Error signing out');
      }

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem('token');
        setCurrentUser(null);
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg transition-all duration-200">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-pink-600 hover:to-purple-600 transition-all duration-300">
            Your Logo
          </Link>
          <div className="flex items-center space-x-8">
            <ul className="flex space-x-8">
              <li>
                <Link 
                  to="/" 
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 relative group"
                >
                  <span>Home</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-200"></span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 relative group"
                >
                  <span>About</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-200"></span>
                </Link>
              </li>
            </ul>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {currentUser.username}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/signin"
                    className="font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                aria-label="Toggle theme"
              >
                {darkMode ? 
                  <span className="text-xl">🌞</span> : 
                  <span className="text-xl">🌙</span>
                }
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
