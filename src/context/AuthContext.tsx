import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile, UserSettings, Notification } from '../types';
import { mockUserProfile, mockNotifications, defaultUserSettings } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  notifications: Notification[];
  userSettings: UserSettings;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, profileData?: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      // Load user settings if available
      const storedSettings = localStorage.getItem(`settings_${user.id}`);
      if (storedSettings) {
        setUserSettings(JSON.parse(storedSettings));
      }
      
      // Load notifications if available
      const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get users from local storage
    const usersJson = localStorage.getItem('users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Load user settings if available
      const storedSettings = localStorage.getItem(`settings_${user.id}`);
      if (storedSettings) {
        setUserSettings(JSON.parse(storedSettings));
      }
      
      // Load notifications if available
      const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        // Set default notifications for new login
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(mockNotifications));
      }
      
      return true;
    }
    
    return false;
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    profileData?: Partial<UserProfile>
  ): Promise<boolean> => {
    // Get existing users
    const usersJson = localStorage.getItem('users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return false;
    }
    
    // Create profile by merging default with provided data
    const profile: UserProfile = {
      ...mockUserProfile,
      name,
      ...(profileData || {})
    };
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      password,
      name,
      profile
    };
    
    // Add user to storage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set default settings for new user
    localStorage.setItem(`settings_${newUser.id}`, JSON.stringify(defaultUserSettings));
    
    // Set default notifications for new user
    localStorage.setItem(`notifications_${newUser.id}`, JSON.stringify(mockNotifications));
    
    // Log in the new user
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setUserSettings(defaultUserSettings);
    setNotifications(mockNotifications);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };
  
  const markNotificationAsRead = (id: string) => {
    if (!currentUser) return;
    
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(updatedNotifications));
  };
  
  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(updatedNotifications));
  };
  
  const updateUserSettings = (settings: Partial<UserSettings>) => {
    if (!currentUser) return;
    
    const updatedSettings = { ...userSettings, ...settings };
    setUserSettings(updatedSettings);
    localStorage.setItem(`settings_${currentUser.id}`, JSON.stringify(updatedSettings));
  };
  
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      profile: {
        ...currentUser.profile,
        ...profile
      }
    };
    
    setCurrentUser(updatedUser);
    
    // Update in local storage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Also update in users array
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      const users: User[] = JSON.parse(usersJson);
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? updatedUser : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    notifications,
    userSettings,
    login,
    signup,
    logout,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    updateUserSettings,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};