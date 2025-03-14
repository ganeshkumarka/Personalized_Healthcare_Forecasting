import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { HealthForecast } from '../types';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';

interface ForecastSectionProps {
  forecasts: HealthForecast[];
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ forecasts }) => {
  const [activeMetric, setActiveMetric] = useState<'healthScore' | 'predictedSteps' | 'predictedHeartRate' | 'predictedSleepHours'>('healthScore');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  
  const formattedData = forecasts.map((item, index) => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd'),
    dayOfWeek: format(parseISO(item.date), 'EEE'),
    index
  }));

  const getColorForMetric = (metric: string) => {
    switch(metric) {
      case 'healthScore': return '#10b981';
      case 'predictedSteps': return '#3b82f6';
      case 'predictedHeartRate': return '#ef4444';
      case 'predictedSleepHours': return '#8b5cf6';
      default: return '#10b981';
    }
  };

  const getUnitForMetric = (metric: string, value: number) => {
    switch(metric) {
      case 'healthScore': return `${value}`;
      case 'predictedSteps': return `${value.toLocaleString()}`;
      case 'predictedHeartRate': return `${value} bpm`;
      case 'predictedSleepHours': return `${value} hrs`;
      default: return `${value}`;
    }
  };

  const getLabelForMetric = (metric: string) => {
    switch(metric) {
      case 'healthScore': return 'Health Score';
      case 'predictedSteps': return 'Steps';
      case 'predictedHeartRate': return 'Heart Rate';
      case 'predictedSleepHours': return 'Sleep Hours';
      default: return 'Value';
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Personalized Health Forecast</h2>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Next 7 Days</span>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-100 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-purple-800 mb-1">AI-Powered Prediction</h3>
          <p className="text-purple-700 text-sm">
            Our machine learning model analyzes your historical data to forecast future health metrics.
          </p>
        </div>
        <button className="flex items-center text-purple-700 font-semibold text-sm mt-3 md:mt-0 hover:text-purple-900 transition-colors">
          Learn more about our algorithm
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveMetric('healthScore')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeMetric === 'healthScore' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Health Score
        </button>
        <button
          onClick={() => setActiveMetric('predictedSteps')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeMetric === 'predictedSteps' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Steps
        </button>
        <button
          onClick={() => setActiveMetric('predictedHeartRate')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeMetric === 'predictedHeartRate' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Heart Rate
        </button>
        <button
          onClick={() => setActiveMetric('predictedSleepHours')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeMetric === 'predictedSleepHours' ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Sleep
        </button>
      </div>

      <div className="h-64 lg:h-72 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === 'healthScore' ? (
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="formattedDate" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}`, getLabelForMetric(activeMetric)]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey={activeMetric} 
                stroke={getColorForMetric(activeMetric)}
                fill={getColorForMetric(activeMetric)}
                fillOpacity={0.2}
                activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <LineChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="formattedDate" />
              <YAxis domain={activeMetric === 'predictedSteps' ? [0, 12000] : 'auto'} />
              <Tooltip 
                formatter={(value) => [getUnitForMetric(activeMetric, Number(value)), getLabelForMetric(activeMetric)]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey={activeMetric} 
                stroke={getColorForMetric(activeMetric)}
                strokeWidth={2}
                dot={{ r: 4, fill: 'white', strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mt-6">
        {formattedData.map((forecast, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-lg shadow-sm border transition-all duration-300 p-3 
                      ${hoveredDay === index ? 'shadow-md transform scale-105 border-blue-300' : 'border-gray-100'}`}
            onMouseEnter={() => setHoveredDay(index)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            <div className="text-xs font-semibold text-gray-500 mb-1">{forecast.dayOfWeek}</div>
            <div className="text-sm font-semibold">{forecast.formattedDate}</div>
            <div className={`text-sm mt-2 font-medium ${
              forecast.healthScore >= 80 ? 'text-green-600' : 
              forecast.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              Score: {forecast.healthScore}
            </div>
            <div className="mt-1 text-xs text-gray-500 truncate">
              {forecast.predictedSteps.toLocaleString()} steps
            </div>
            <div className="mt-1 text-xs text-gray-500 truncate">
              {forecast.predictedSleepHours} hrs sleep
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-4 italic text-center">
        These forecasts are personalized based on your data patterns and may adjust as your habits change
      </p>
    </div>
  );
};

export default ForecastSection;