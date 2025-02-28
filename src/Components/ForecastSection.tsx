import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { HealthForecast } from '../types';

interface ForecastSectionProps {
  forecasts: HealthForecast[];
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ forecasts }) => {
  const formattedData = forecasts.map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd')
  }));
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Forecast</h2>
      <p className="text-gray-600 mb-6">
        Based on your recent health patterns, here's a prediction of your health metrics for the next 7 days.
      </p>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Health Score Forecast</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="formattedDate" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Health Score']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="healthScore" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.2} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formattedData.slice(0, 3).map((forecast, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-800">{forecast.formattedDate}</h4>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Steps:</span> {forecast.predictedSteps.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Heart Rate:</span> {forecast.predictedHeartRate} bpm
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Sleep:</span> {forecast.predictedSleepHours} hrs
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Calories:</span> {forecast.predictedCaloriesBurned.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Stress Level:</span> {forecast.predictedStressLevel}/5
              </p>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="font-medium text-gray-700 mr-2">Health Score:</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        forecast.healthScore >= 80 ? 'bg-green-500' : 
                        forecast.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${forecast.healthScore}%` }}
                    ></div>
                  </div>
                  <div className="ml-2 text-sm font-medium">{forecast.healthScore}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
        View all forecasts
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  );
};

export default ForecastSection;