import React, { useState } from 'react';
import { 
  Smartphone, 
  Watch, 
  Battery, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from 'lucide-react';
import { mockDevices } from '../../data/mockData';
import { Device } from '../../types';
import { format, parseISO } from 'date-fns';

const DevicesPage: React.FC = () => {
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch':
        return <Watch className="h-6 w-6 text-blue-500" />;
      case 'sleep-tracker':
        return <Clock className="h-6 w-6 text-purple-500" />;
      default:
        return <Smartphone className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </span>
        );
      case 'disconnected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Disconnected
          </span>
        );
      case 'low-battery':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Low Battery
          </span>
        );
      case 'syncing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Syncing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };
  
  const getBatteryColor = (level: number) => {
    if (level > 70) return 'text-green-500';
    if (level > 30) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const formatLastSync = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, 'MMM dd, yyyy h:mm a');
    } catch (e) {
      return 'Unknown';
    }
  };
  
  const renderDeviceCard = (device: Device) => (
    <div key={device.id} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-gray-100 p-3 rounded-lg mr-4">
              {getDeviceIcon(device.type)}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{device.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{device.type.replace('-', ' ')}</p>
            </div>
          </div>
          {getStatusBadge(device.status)}
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Battery className={`h-5 w-5 mr-2 ${getBatteryColor(device.batteryLevel)}`} />
            <div>
              <p className="text-sm text-gray-500">Battery</p>
              <p className="text-sm font-medium text-gray-900">{device.batteryLevel}%</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <RefreshCw className="h-5 w-5 mr-2 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Last Sync</p>
              <p className="text-sm font-medium text-gray-900">{formatLastSync(device.lastSync)}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-1">Tracked Metrics</p>
          <div className="flex flex-wrap gap-2">
            {device.metrics.map(metric => (
              <span 
                key={metric} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
              >
                {metric}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
        <button className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center">
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </button>
        
        <button className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center">
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </button>
        
        {device.status !== 'connected' && (
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            <RefreshCw className="h-4 w-4 mr-1" />
            Reconnect
          </button>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Connected Devices</h1>
        
        <button
          onClick={() => setShowAddDeviceModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Device
        </button>
      </div>
      
      {/* Device Status Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Device Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-800">Connected</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-800">
              {mockDevices.filter(d => d.status === 'connected').length}
            </p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-yellow-800">Low Battery</h3>
              <Battery className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-800">
              {mockDevices.filter(d => d.status === 'low-battery').length}
            </p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-red-800">Disconnected</h3>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-800">
              {mockDevices.filter(d => d.status === 'disconnected').length}
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-800">Syncing</h3>
              <RefreshCw className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-800">
              {mockDevices.filter(d => d.status === 'syncing').length}
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">Pro Tip:</span> Keep your devices charged above 20% for optimal data collection and syncing.
            </p>
          </div>
        </div>
      </div>
      
      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {mockDevices.map(renderDeviceCard)}
      </div>
      
      {/* Add New Device Card */}
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
        <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Connect a new device</h3>
        <p className="text-gray-500 mb-4">
          Add a new fitness tracker, smartwatch, or other health monitoring device.
        </p>
        <button
          onClick={() => setShowAddDeviceModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </button>
      </div>
      
      {/* Add Device Modal (hidden by default) */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Add New Device</h3>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700 mb-1">
                  Device Type
                </label>
                <select
                  id="deviceType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a device type</option>
                  <option value="fitness-tracker">Fitness Tracker</option>
                  <option value="smartwatch">Smartwatch</option>
                  <option value="sleep-tracker">Sleep Tracker</option>
                  <option value="scale">Smart Scale</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700 mb-1">
                  Device Name
                </label>
                <input
                  type="text"
                  id="deviceName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Fitbit Charge 5"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracked Metrics
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="metric-steps"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="metric-steps" className="ml-2 text-sm text-gray-700">
                      Steps
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="metric-heart"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="metric-heart" className="ml-2 text-sm text-gray-700">
                      Heart Rate
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="metric-sleep"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="metric-sleep" className="ml-2 text-sm text-gray-700">
                      Sleep
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="metric-calories"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="metric-calories" className="ml-2 text-sm text-gray-700">
                      Calories
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowAddDeviceModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddDeviceModal(false)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;