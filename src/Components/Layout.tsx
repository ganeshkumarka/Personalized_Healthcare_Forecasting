import React from 'react';
import { modernColorSchemes } from '../styles/colorSchemes';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Change this to try different schemes: 'oceanic', 'sunset', 'forest', 'lavender'
  const currentScheme = 'forest';

  return (
    <div className={`min-h-screen ${modernColorSchemes[currentScheme].background}`}>
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
