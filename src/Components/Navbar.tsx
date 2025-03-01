import React, { useState, useRef, useEffect } from 'react';
import { Activity, Bell, Settings, User, LogOut, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Notification } from '../types';
import { formatDistanceToNow } from 'date-fns';
import ProfileCard from './ProfileCard';
import SettingsModal from './SettingsModal';

type PageType = 'dashboard' | 'trends' | 'insights' | 'devices';

interface NavbarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { currentUser, logout, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileCard(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    setShowNotifications(false);
    
    if (notification.link) {
      const page = notification.link.replace('/', '') as PageType;
      if (['dashboard', 'trends', 'insights', 'devices'].includes(page)) {
        setCurrentPage(page);
      }
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
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
            <div className="relative" ref={notificationRef}>
              <button 
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={() => markAllNotificationsAsRead()}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No notifications
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex">
                              <div className="mr-3 mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-sm text-gray-600">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="ml-2 flex-shrink-0">
                                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="ml-3 relative flex items-center">
              <button 
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                onClick={() => setShowSettings(true)}
              >
                <span className="sr-only">Settings</span>
                <Settings className="h-6 w-6" />
              </button>
              
              <div className="relative" ref={profileRef}>
                <button 
                  className="flex items-center focus:outline-none"
                  onClick={() => setShowProfileCard(!showProfileCard)}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{currentUser?.name || 'User'}</span>
                </button>
                
                {showProfileCard && <ProfileCard />}
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
      
      {showSettings && <SettingsModal onClose={() => setShowSettings( false)} />}
    </nav>
  );
};

export default Navbar;