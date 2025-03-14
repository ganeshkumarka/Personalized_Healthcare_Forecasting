import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Bell, Lock, Monitor, Ruler, Palette } from 'lucide-react';
import { UserSettings } from '../types';
import { modernColorSchemes, ColorScheme } from '../styles/colorSchemes';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { userSettings, updateUserSettings } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(userSettings);
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'display' | 'units' | 'theme'>('notifications');
  
  const handleSave = () => {
    updateUserSettings(settings);
    onClose();
  };
  
  const handleToggle = (category: keyof UserSettings, setting: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting]
      }
    });
  };
  
  const handleUnitChange = (unit: keyof UserSettings['units'], value: string) => {
    setSettings({
      ...settings,
      units: {
        ...settings.units,
        [unit]: value
      }
    });
  };

  const handleThemeChange = (theme: ColorScheme) => {
    setSettings({
      ...settings,
      display: {
        ...settings.display,
        theme
      }
    });
  };
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex h-96">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-200 p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'notifications' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'privacy' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lock className="h-4 w-4 mr-2" />
                Privacy
              </button>
              <button
                onClick={() => setActiveTab('display')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'display' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Display
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'theme' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Palette className="h-4 w-4 mr-2" />
                Theme
              </button>
              <button
                onClick={() => setActiveTab('units')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'units' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Ruler className="h-4 w-4 mr-2" />
                Units
              </button>
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'notifications' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Email Notifications</h5>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.notifications.email}
                        onChange={() => handleToggle('notifications', 'email')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Push Notifications</h5>
                      <p className="text-sm text-gray-500">Receive notifications in the app</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.notifications.push}
                        onChange={() => handleToggle('notifications', 'push')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">SMS Notifications</h5>
                      <p className="text-sm text-gray-500">Receive notifications via text message</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.notifications.sms}
                        onChange={() => handleToggle('notifications', 'sms')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Share Health Data</h5>
                      <p className="text-sm text-gray-500">Allow sharing your health data with healthcare providers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.privacy.shareData}
                        onChange={() => handleToggle('privacy', 'shareData')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Anonymous Analytics</h5>
                      <p className="text-sm text-gray-500">Allow anonymous usage data to improve our services</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.privacy.anonymousAnalytics}
                        onChange={() => handleToggle('privacy', 'anonymousAnalytics')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'display' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Dark Mode</h5>
                      <p className="text-sm text-gray-500">Use dark theme for the application</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.display.darkMode}
                        onChange={() => handleToggle('display', 'darkMode')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Compact View</h5>
                      <p className="text-sm text-gray-500">Show more information in less space</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.display.compactView}
                        onChange={() => handleToggle('display', 'compactView')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Theme Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(modernColorSchemes) as ColorScheme[]).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleThemeChange(theme)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.display.theme === theme
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-200'
                      } ${modernColorSchemes[theme].background}`}
                    >
                      <div className="h-24 rounded-md mb-2 flex flex-col justify-between p-3">
                        <div className={`h-6 w-full rounded-md ${modernColorSchemes[theme].card}`}></div>
                        <div className={`h-6 w-2/3 rounded-md ${modernColorSchemes[theme].card}`}></div>
                      </div>
                      <p className="text-center capitalize font-medium">{theme}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Select a theme to customize the look and feel of your dashboard.
                </p>
              </div>
            )}
            
            {activeTab === 'units' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Units Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distance
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          name="distance"
                          value="km"
                          checked={settings.units.distance === 'km'}
                          onChange={() => handleUnitChange('distance', 'km')}
                        />
                        <span className="ml-2 text-sm text-gray-700">Kilometers (km)</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          name="distance"
                          value="mi"
                          checked={settings.units.distance === 'mi'}
                          onChange={() => handleUnitChange('distance', 'mi')}
                        />
                        <span className="ml-2 text-sm text-gray-700">Miles (mi)</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          name="weight"
                          value="kg"
                          checked={settings.units.weight === 'kg'}
                          onChange={() => handleUnitChange('weight', 'kg')}
                        />
                        <span className="ml-2 text-sm text-gray-700">Kilograms (kg)</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          name="weight"
                          value="lb"
                          checked={settings.units.weight === 'lb'}
                          onChange={() => handleUnitChange('weight', 'lb')}
                        />
                        <span className="ml-2 text-sm text-gray-700">Pounds (lb)</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          name="temperature"
                          value="c"
                          checked={settings.units.temperature === 'c'}
                          onChange={() => handleUnitChange('temperature', 'c')}
                        />
                        <span className="ml-2 text-sm text-gray-700">Celsius (°C)</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          name="temperature"
                          value="f"
                          checked={settings.units.temperature === 'f'}
                          onChange={() => handleUnitChange('temperature', 'f')}
                        />
                        <span className="ml-2 text-sm text-gray-700">Fahrenheit (°F)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;