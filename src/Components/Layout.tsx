import React from 'react';
import { modernColorSchemes } from '../styles/colorSchemes';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { userSettings } = useAuth();
  
  // Use the user's theme preference, defaulting to 'oceanic' if not set
  const currentScheme = userSettings?.display?.theme || 'oceanic';

  return (
    <div className={`min-h-screen ${modernColorSchemes[currentScheme].background}`}>
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
