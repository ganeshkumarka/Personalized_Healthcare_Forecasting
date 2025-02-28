import React from 'react';
import { Activity, Bell, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type PageType = 'dashboard' | 'trends' | 'insights' | 'devices';

interface NavbarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { currentUser, logout } = useAuth();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">HealthForecast</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`${
                  currentPage === 'dashboard' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentPage('trends')}
                className={`${
                  currentPage === 'trends' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Trends
              </button>
              <button 
                onClick={() => setCurrentPage('insights')}
                className={`${
                  currentPage === 'insights' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Insights
              </button>
              <button 
                onClick={() => setCurrentPage('devices')}
                className={`${
                  currentPage === 'devices' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Devices
              </button>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>

            <div className="ml-3 relative">
              <div className="flex items-center">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2">
                  <span className="sr-only">Settings</span>
                  <Settings className="h-6 w-6" />
                </button>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{currentUser?.name || 'User'}</span>
                </div>
                <button 
                  onClick={logout}
                  className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Log out</span>
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;