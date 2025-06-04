import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import userService from '../services/userService';

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      setLoggingOut(true);
      await userService.logout();
    } catch (err) {
      console.error('Error logging out:', err);
      setError(err.message || 'Failed to logout');
      setLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account</h1>
          <p className="text-gray-400">Manage your account settings</p>
        </div>

        {/* User Profile Card */}
        <div className="max-w-xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src="https://placekitten.com/120/120"
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-purple-500/50"
                />
                <button className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-6">
              <div className="bg-gray-700/30 rounded-xl p-4 flex items-center space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="text-lg font-semibold text-white">{userData?.name}</p>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-xl p-4 flex items-center space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email Address</p>
                  <p className="text-lg font-semibold text-white">{userData?.email}</p>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-xl p-4 flex items-center space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="text-lg font-semibold text-white capitalize">{userData?.role}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogoutClick}
                disabled={loggingOut}
                className="w-full mt-8 bg-red-600/80 hover:bg-red-700 text-white py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            {/* Overlay */}
            <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={() => !loggingOut && setShowLogoutConfirm(false)} />
            
            {/* Modal */}
            <div className="relative inline-block p-6 overflow-hidden text-left align-bottom transition-all transform bg-gray-800 rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Confirm Logout</h3>
                <p className="text-gray-300 mb-6">Are you sure you want to logout? You will need to login again to access your account.</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => !loggingOut && setShowLogoutConfirm(false)}
                    disabled={loggingOut}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogoutConfirm}
                    disabled={loggingOut}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loggingOut ? 'Logging out...' : 'Yes, Logout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
