import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, LogOut, User, History, Star } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white font-bold text-xl flex items-center">
                <Search className="h-6 w-6 mr-2" />
                <span>PersonFinder</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <Search className="h-5 w-5 mr-1" />
                  <span>Search</span>
                </Link>
                <Link to="/history" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <History className="h-5 w-5 mr-1" />
                  <span>History</span>
                </Link>
                <Link to="/favorites" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <Star className="h-5 w-5 mr-1" />
                  <span>Favorites</span>
                </Link>
                <Link to="/profile" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <User className="h-5 w-5 mr-1" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}