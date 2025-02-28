import React from 'react';
import { Activity, Heart, Moon, Flame, BarChart3 } from 'lucide-react';
import { mockHealthData, mockHealthForecasts } from '../data/mockData';
import HealthMetricCard from './HealthMetricCard';
import HealthChart from './HealthChart';
import ForecastSection from './ForecastSection';
import InsightsSection from './InsightsSection';

const Dashboard: React.FC = () => {
  // Get the most recent health data
  const latestData = mockHealthData[mockHealthData.length - 1];
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Health Dashboard</h1>
      
      {/* Health Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
      
      {/* Health Trends Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Trends</h2>
        <HealthChart data={mockHealthData} />
      </div>
      
      {/* Health Forecast */}
      <ForecastSection forecasts={mockHealthForecasts} />
      
      {/* Health Insights */}
      <InsightsSection />
    </div>
  );
};

export default Dashboard;