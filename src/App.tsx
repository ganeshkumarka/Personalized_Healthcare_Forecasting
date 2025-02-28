import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TrendsPage from './components/trends/TrendsPage';
import InsightsPage from './components/insights/InsightsPage';
import DevicesPage from './components/devices/DevicesPage';
import Footer from './components/Footer';
import AuthPage from './components/auth/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Define page types
type PageType = 'dashboard' | 'trends' | 'insights' | 'devices';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  
  if (!isAuthenticated) {
    return <AuthPage />;
  }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'trends':
        return <TrendsPage />;
      case 'insights':
        return <InsightsPage />;
      case 'devices':
        return <DevicesPage />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;