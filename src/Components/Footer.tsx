import React from 'react';
import { Activity } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-bold text-gray-800">HealthForecast</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Contact Us
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} HealthForecast. All rights reserved.
          </p>
          <p className="text-center text-gray-400 text-xs mt-2">
            This is a demo application. Data shown is simulated and not real health data.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;