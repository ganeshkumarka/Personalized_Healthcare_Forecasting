import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import Dashboard from './Components/Dashboard';
import TrendsPage from './Components/trends/TrendsPage';
import InsightsPage from './Components/insights/InsightsPage';
import DevicesPage from './Components/devices/DevicesPage';
import Footer from './Components/Footer';
import AuthPage from './Components/auth/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './Components/Layout';

// Define page types
type PageType = 'dashboard' | 'trends' | 'insights' | 'devices';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  
  if (!isAuthenticated) {
    return <AuthPage />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'trends' && <TrendsPage />}
        {currentPage === 'insights' && <InsightsPage />}
        {currentPage === 'devices' && <DevicesPage />}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Layout>
        <AppContent />
      </Layout>
    </AuthProvider>
  );
}

export default App;