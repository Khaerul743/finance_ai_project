import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import userService from '../services/userService';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const isAuthenticated = await userService.isAuthenticated();
        setIsAuth(isAuthenticated);

        if (!isAuthenticated) {
          navigate('/auth/login', { replace: true });
          return;
        }

        const data = await userService.getProfile();
        if (data) {
          setUserData(data);
        } else {
          navigate('/auth/login', { replace: true });
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/auth/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchUser();
  }, [navigate]);

  // Show nothing while checking auth
  if (loading || !isAuth) {
    return null;
  }

  // Function to check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Profile section component
  const ProfileSection = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'flex items-center space-x-3 pt-4 border-t border-gray-700' : 'hidden md:flex items-center space-x-3 group cursor-pointer'}`}>
      <img
        src="https://placekitten.com/40/40"
        alt="Profile"
        className={`w-10 h-10 rounded-full border-2 border-green-500 ${!isMobile ? 'transition-all duration-300 group-hover:scale-110 group-hover:border-green-400' : ''}`}
      />
      <span className={`text-white ${!isMobile ? 'transition-colors duration-300 group-hover:text-green-400' : ''}`}>
        {userData?.name}
      </span>
    </div>
  );

  return (
    <nav className="bg-gray-900/50 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2 group cursor-pointer">
          <div className="bg-green-500 w-8 h-8 flex items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[360deg]">
            <span className="text-white text-xl">$</span>
          </div>
          <span className="text-white text-xl font-semibold transition-colors duration-300 group-hover:text-green-400">Saving</span>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/dashboard" 
            className={`${isActive('/dashboard') ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 transition-all duration-300 hover:translate-y-[-2px] flex items-center space-x-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Home</span>
          </Link>
          <Link 
            to="/transaction" 
            className={`${isActive('/transaction') ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 transition-all duration-300 hover:translate-y-[-2px] flex items-center space-x-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span>Transaction</span>
          </Link>
          <Link 
            to="/wallet" 
            className={`${isActive('/budget') ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 transition-all duration-300 hover:translate-y-[-2px] flex items-center space-x-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <span>Wallet</span>
          </Link>
          <Link 
            to="/account" 
            className={`${isActive('/account') ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 transition-all duration-300 hover:translate-y-[-2px] flex items-center space-x-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Account</span>
          </Link>
          <Link 
            to="/chatbot" 
            className={`${isActive('/chatbot') ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 transition-all duration-300 hover:translate-y-[-2px] flex items-center space-x-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span>AI assistant</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors duration-300"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 transition-transform duration-300"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Profile */}
        <ProfileSection />
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col space-y-4 py-4">
          <Link 
            to="/dashboard" 
            className={`${isActive('/dashboard') ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 transition-all duration-300 transform hover:translate-x-2 flex items-center space-x-2`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Home</span>
          </Link>
          <Link 
            to="/transaction" 
            className={`${isActive('/transaction') ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 transition-all duration-300 transform hover:translate-x-2 flex items-center space-x-2`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span>Transaction</span>
          </Link>
          <Link 
            to="/wallet" 
            className={`${isActive('/budget') ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 transition-all duration-300 transform hover:translate-x-2 flex items-center space-x-2`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <span>Wallet</span>
          </Link>
          <Link 
            to="/account" 
            className={`${isActive('/account') ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 transition-all duration-300 transform hover:translate-x-2 flex items-center space-x-2`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Account</span>
          </Link>
          <Link 
            to="/chatbot" 
            className={`${isActive('/chatbot') ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 transition-all duration-300 transform hover:translate-x-2 flex items-center space-x-2`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span>AI assistant</span>
          </Link>
          
          {/* Mobile Profile */}
          <ProfileSection isMobile={true} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 