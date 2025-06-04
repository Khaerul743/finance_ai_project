import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Error Code */}
          <div className="relative">
            <h1 className="text-[150px] font-bold text-gray-700/20">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-gray-800/30 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Page Not Found</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4 mt-8">
            <h2 className="text-3xl text-white font-bold">Oops! You seem to be lost</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved to another location.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <Link 
              to="/dashboard" 
              className="px-6 py-2 bg-green-500 text-white rounded-full transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 transform active:scale-95"
            >
              Go to Dashboard
            </Link>
            <Link 
              to="/" 
              className="px-6 py-2 bg-gray-700 text-white rounded-full transition-all duration-300 hover:bg-gray-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transform active:scale-95"
            >
              Back to Home
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 grid grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className="h-2 rounded-full bg-gradient-to-r from-gray-800/50 to-purple-900/30 animate-pulse"
                style={{ 
                  animationDelay: `${item * 200}ms`,
                  width: `${Math.random() * 100 + 100}px`
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
