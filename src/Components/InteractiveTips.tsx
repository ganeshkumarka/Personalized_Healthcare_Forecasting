import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface InteractiveTipProps {
  id: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const InteractiveTip: React.FC<InteractiveTipProps> = ({ 
  id, 
  title, 
  content, 
  position = 'bottom', 
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  
  // Check if tip has been shown before
  useEffect(() => {
    const shown = localStorage.getItem(`tip_${id}_shown`);
    setHasBeenShown(shown === 'true');
  }, [id]);
  
  // Handle dismissal
  const dismissTip = () => {
    setIsVisible(false);
    localStorage.setItem(`tip_${id}_shown`, 'true');
    setHasBeenShown(true);
  };
  
  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tipRef.current && 
        !tipRef.current.contains(event.target as Node) &&
        childRef.current &&
        !childRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <div 
        ref={childRef}
        className={`${!hasBeenShown ? 'animate-pulse' : ''}`} 
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div 
          ref={tipRef}
          className={`absolute z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4
            ${position === 'top' ? 'bottom-full mb-2' : 
              position === 'bottom' ? 'top-full mt-2' : 
              position === 'left' ? 'right-full mr-2' : 
              'left-full ml-2'}`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <button onClick={dismissTip} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600">{content}</p>
          <div className="mt-2 text-right">
            <button 
              onClick={dismissTip}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const TipIcon: React.FC<{color?: string}> = ({ color = 'currentColor' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="ml-1 cursor-help"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
};
