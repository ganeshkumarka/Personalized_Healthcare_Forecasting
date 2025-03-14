import React, { useState } from 'react';
import { Activity, Heart, Moon, Flame, BarChart3, Sparkles, ChevronDown, Lightbulb, Settings } from 'lucide-react';
import { mockHealthData, mockHealthForecasts } from '../data/mockData';
import HealthMetricCard from './HealthMetricCard';
import HealthChart from './HealthChart';
import ForecastSection from './ForecastSection';
import InsightsSection from './InsightsSection';
import { modernColorSchemes } from '../styles/colorSchemes';
import { useAuth } from '../context/AuthContext';
import HealthScoreGauge from './HealthScoreGauge';
import SettingsModal from './SettingsModal';
import ChatbotModule from './ChatbotModule';

const Dashboard: React.FC = () => {
  const { userSettings, currentUser } = useAuth();
  const currentScheme = userSettings?.display?.theme || 'oceanic';
  const colors = modernColorSchemes[currentScheme];
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'insights'>('overview');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Get user's name or a default
  const userName = currentUser?.name || 'there';
  
  // Get the time of day for personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Handle section toggle
  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };
  
  // Get the most recent health data
  const latestData = mockHealthData[mockHealthData.length - 1];
  
  // Calculate health score based on most recent data
  const healthScore = Math.min(100, Math.floor(
    (latestData.steps / 10000) * 25 + 
    ((80 - latestData.heartRate) / 20) * 25 + 
    (latestData.sleepHours / 9) * 25 + 
    ((5 - latestData.stressLevel) / 5) * 25
  ));
  
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className={`${colors.card} backdrop-blur-md rounded-xl shadow-lg p-6 mb-6 border ${colors.border} overflow-hidden relative transition-all duration-300`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-radial from-white/10 to-transparent rounded-full -mr-24 -mt-24 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-white/10 to-transparent rounded-full -ml-16 -mb-16 opacity-70"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{getGreeting()}, {userName}</h1>
            <p className="text-gray-600">Your health insights for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <HealthScoreGauge score={healthScore} size={120} />
            <div className="ml-2">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Open Settings"
              >
                <Settings className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Interactive Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Activity className="h-4 w-4 mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${
            activeTab === 'forecast' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Forecast & Predictions
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${
            activeTab === 'insights' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Insights
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Health Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <HealthMetricCard 
              title="Steps" 
              value={latestData.steps.toLocaleString()} 
              icon={<Activity className="h-6 w-6 text-blue-500" />} 
              change={+5.2} 
              goal={10000}
              current={latestData.steps}
            />
            <HealthMetricCard 
              title="Heart Rate" 
              value={`${latestData.heartRate} bpm`} 
              icon={<Heart className="h-6 w-6 text-red-500" />} 
              change={-2.1} 
              goal={70}
              current={latestData.heartRate}
            />
            <HealthMetricCard 
              title="Sleep" 
              value={`${latestData.sleepHours} hrs`} 
              icon={<Moon className="h-6 w-6 text-indigo-500" />} 
              change={+0.5} 
              goal={8}
              current={latestData.sleepHours}
            />
            <HealthMetricCard 
              title="Calories" 
              value={latestData.caloriesBurned.toLocaleString()} 
              icon={<Flame className="h-6 w-6 text-orange-500" />} 
              change={+120} 
              goal={2000}
              current={latestData.caloriesBurned}
            />
            <HealthMetricCard 
              title="Stress" 
              value={`${latestData.stressLevel}/5`} 
              icon={<BarChart3 className="h-6 w-6 text-purple-500" />} 
              change={-1} 
              goal={2}
              current={latestData.stressLevel}
              lowerIsBetter
            />
          </div>

          {/* Interactive Collapsible Sections */}
          <div className={`${colors.card} rounded-lg shadow-lg mb-6 border ${colors.border} transition-all duration-300`}>
            <button 
              onClick={() => toggleSection('healthTrends')}
              className="w-full px-6 py-4 flex justify-between items-center"
            >
              <h2 className="text-xl font-semibold text-gray-800">Health Trends</h2>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expanded === 'healthTrends' ? 'transform rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${expanded === 'healthTrends' ? 'max-h-[500px] p-6 border-t' : 'max-h-0'}`}>
              <HealthChart data={mockHealthData} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'forecast' && (
        <div className={`${colors.card} rounded-lg shadow-lg p-6 mb-6 border ${colors.border} ${colors.cardHover} transition-all duration-300`}>
          <ForecastSection forecasts={mockHealthForecasts} />
        </div>
      )}

      {activeTab === 'insights' && (
        <div className={`${colors.card} rounded-lg shadow-lg p-6 border ${colors.border} ${colors.cardHover} transition-all duration-300`}>
          <InsightsSection />
        </div>
      )}

      {/* Chat button */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          title="Health Assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      
      {/* Chatbot Module */}
      {isChatOpen && <ChatbotModule onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default Dashboard;