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
import { Sparkles, ArrowRight, Calendar, X, Brain, Clipboard, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ForecastSectionProps {
  forecasts: HealthForecast[];
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ forecasts }) => {
  const [activeMetric, setActiveMetric] = useState<'healthScore' | 'predictedSteps' | 'predictedHeartRate' | 'predictedSleepHours'>('healthScore');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);
  
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
        <button 
          className="flex items-center text-purple-700 font-semibold text-sm mt-3 md:mt-0 hover:text-purple-900 transition-colors"
          onClick={() => setShowAlgorithmInfo(true)}
        >
          Learn more about our algorithm
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Algorithm Information Modal */}
      <AnimatePresence>
        {showAlgorithmInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-t-xl flex justify-between items-center">
                <div className="flex items-center">
                  <Brain className="h-6 w-6 text-white mr-2" />
                  <h3 className="text-xl font-bold text-white">Our Prediction Algorithm</h3>
                </div>
                <button 
                  onClick={() => setShowAlgorithmInfo(false)}
                  className="text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-600 mb-4">
                    Our health prediction system uses advanced machine learning algorithms to forecast your future health metrics with high accuracy.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                    <Clipboard className="h-5 w-5 text-purple-500 mr-2" />
                    Data Collection & Processing
                  </h4>
                  <p className="mb-4">
                    The algorithm analyzes several types of data to make predictions:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Historical health metrics (steps, heart rate, sleep patterns)</li>
                    <li>Activity patterns and their correlations</li>
                    <li>Time-based trends (weekday vs weekend behaviors)</li>
                    <li>Seasonality and weather effects (when available)</li>
                    <li>Demographic information (age, gender, weight, height)</li>
                  </ul>
                  
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                    <Brain className="h-5 w-5 text-indigo-500 mr-2" />
                    Machine Learning Models
                  </h4>
                  <p className="mb-4">
                    We employ a combination of machine learning techniques to achieve the most accurate predictions:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li><span className="font-medium">Recurrent Neural Networks (RNNs):</span> Specialized in time-series forecasting</li>
                    <li><span className="font-medium">Gradient Boosting:</span> For handling complex feature interactions</li>
                    <li><span className="font-medium">Ensemble Methods:</span> Combining multiple models for higher accuracy</li>
                  </ul>
                  
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    Continuous Learning
                  </h4>
                  <p className="mb-4">
                    Our system improves over time in two important ways:
                  </p>
                  <ol className="list-decimal pl-6 mb-4 space-y-1">
                    <li>The predictions become more personalized as it learns from your specific patterns</li>
                    <li>The overall algorithm improves as our user base grows (while maintaining strict privacy)</li>
                  </ol>
                  
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                    <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                    Accuracy & Limitations
                  </h4>
                  <p className="mb-2">
                    Our predictions have shown an average accuracy of 87% for next-day forecasts and 78% for 7-day forecasts across our user base. However, it's important to note:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Sudden lifestyle changes may temporarily reduce accuracy</li>
                    <li>Predictions are most accurate for users with at least 14 days of historical data</li>
                    <li>These forecasts are estimates and should not replace medical advice</li>
                  </ul>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h5 className="font-medium text-blue-800 mb-2">Privacy Commitment</h5>
                    <p className="text-blue-700 text-sm">
                      Your data is processed with the highest privacy standards. All personal information is encrypted, and we never share individual data with third parties. Aggregate, anonymized data may be used to improve our algorithms.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowAlgorithmInfo(false)} 
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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