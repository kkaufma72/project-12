import React, { useState } from 'react';
import { Bell, Menu, User, X, LogOut, Settings } from 'lucide-react';
import { useMLContext } from '../../context/MLContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { currentProject } = useMLContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      navigate('/signin', { replace: true });
    }
  };

  return (
    <nav className="sticky top-0 z-10 flex-shrink-0 bg-white border-b border-gray-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="block w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="flex items-center flex-1 justify-between">
            <div className="flex items-center flex-shrink-0 md:hidden">
              <span className="text-xl font-bold text-indigo-600">AutoML</span>
            </div>
            {currentProject && (
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-700">
                  {currentProject.name}
                </h1>
              </div>
            )}
            <div className="flex items-center">
              <button
                type="button"
                className="p-1 mr-3 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="w-6 h-6" aria-hidden="true" />
              </button>
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex items-center max-w-xs p-1 text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <User className="w-8 h-8 p-1 text-gray-500 bg-gray-100 rounded-full" />
                  </button>
                </div>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={() => navigate('/app/documentation')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Documentation
                      </button>
                      <button
                        onClick={() => navigate('/app/settings')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;