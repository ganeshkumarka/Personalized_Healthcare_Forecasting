import React, { useState, useEffect } from 'react';
import { Activity, Heart, Moon, Flame, BarChart3, Sparkles, Lightbulb, Settings } from 'lucide-react';
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
import HealthJourneyTimeline from './HealthJourneyTimeline';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveTip } from './InteractiveTips';

const Dashboard: React.FC = () => {
  const { userSettings, currentUser } = useAuth();
  const currentScheme = userSettings?.display?.theme || 'oceanic';
  const colors = modernColorSchemes[currentScheme];
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'insights'>('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  
  // Hide welcome animation after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get user's name or a default
  const userName = currentUser?.name || 'there';
  
  // Get the time of day for personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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
      {/* Welcome Banner with enhanced animations */}
      <motion.div 
        className={`${colors.card} backdrop-blur-md rounded-xl shadow-lg p-6 mb-6 border ${colors.border} overflow-hidden relative transition-all duration-300`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-white/20 z-0"></div>
        {showWelcomeAnimation && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 z-0"
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.95, 1, 1.05]
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        )}
        
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-radial from-white/10 to-transparent rounded-full -mr-24 -mt-24 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-white/10 to-transparent rounded-full -ml-16 -mb-16 opacity-70"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {getGreeting()}, {userName}
            </motion.h1>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your health insights for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </motion.p>
          </div>
          <motion.div 
            className="mt-4 md:mt-0 flex items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <InteractiveTip
              id="health-score"
              title="Your Health Score"
              content="This score is calculated based on your activity, sleep quality, heart rate, and stress levels. A score above 80 is excellent!"
              position="left"
            >
              <HealthScoreGauge score={healthScore} size={120} />
            </InteractiveTip>
            <div className="ml-2">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Open Settings"
              >
                <Settings className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Interactive Tabs with sliding indicator */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar relative">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'text-blue-600' 
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
              ? 'text-blue-600' 
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
              ? 'text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Insights
        </button>
        
        {/* Animated active indicator - adjusted to match tab width */}
        <div className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
          style={{ 
            left: activeTab === 'overview' 
              ? '0%' 
              : activeTab === 'forecast' 
                ? '83px' 
                : '280px',
            width: activeTab === 'overview' 
              ? '83px' 
              : activeTab === 'forecast' 
                ? '197px' 
                : '80px'
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <>
              {/* Health Metrics Overview with staggered animations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {[
                  { title: "Steps", value: latestData.steps.toLocaleString(), icon: <Activity className="h-6 w-6 text-blue-500" />, change: +5.2, goal: 10000, current: latestData.steps },
                  { title: "Heart Rate", value: `${latestData.heartRate} bpm`, icon: <Heart className="h-6 w-6 text-red-500" />, change: -2.1, goal: 70, current: latestData.heartRate },
                  { title: "Sleep", value: `${latestData.sleepHours} hrs`, icon: <Moon className="h-6 w-6 text-indigo-500" />, change: +0.5, goal: 8, current: latestData.sleepHours },
                  { title: "Calories", value: latestData.caloriesBurned.toLocaleString(), icon: <Flame className="h-6 w-6 text-orange-500" />, change: +120, goal: 2000, current: latestData.caloriesBurned },
                  { title: "Stress", value: `${latestData.stressLevel}/5`, icon: <BarChart3 className="h-6 w-6 text-purple-500" />, change: -1, goal: 2, current: latestData.stressLevel, lowerIsBetter: true }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HealthMetricCard {...metric} />
                  </motion.div>
                ))}
              </div>

              {/* Health Trends Section - Now Always Visible */}
              <motion.div
                className={`${colors.card} rounded-lg shadow-lg mb-6 border ${colors.border} transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-800">Health Trends</h2>
                </div>
                <div className="p-6 border-t">
                  <HealthChart data={mockHealthData} />
                </div>
              </motion.div>

              {/* Health Journey Timeline section */}
              <motion.div
                className={`${colors.card} rounded-lg shadow-lg mb-6 border ${colors.border} transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <HealthJourneyTimeline />
              </motion.div>
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
        </motion.div>
      </AnimatePresence>

      {/* Chat button with pulse effect */}
      <div className="fixed bottom-6 right-6">
        <motion.button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          title="Health Assistant"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isChatOpen ? {} : { 
            boxShadow: ['0 4px 6px -1px rgba(0,0,0,0.1)', '0 10px 15px -3px rgba(0,0,0,0.2)', '0 4px 6px -1px rgba(0,0,0,0.1)'],
          }}
          transition={{ repeat: isChatOpen ? 0 : Infinity, duration: 2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </motion.button>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      
      {/* Chatbot Module */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ChatbotModule onClose={() => setIsChatOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;