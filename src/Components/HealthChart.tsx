import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { HealthData } from '../types';

interface HealthChartProps {
  data: HealthData[];
}

const HealthChart: React.FC<HealthChartProps> = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState<'steps' | 'heartRate' | 'sleepHours' | 'caloriesBurned' | 'stressLevel'>('steps');
  
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd')
  }));
  
  const metrics = [
    { id: 'steps', name: 'Steps', color: '#3b82f6' },
    { id: 'heartRate', name: 'Heart Rate', color: '#ef4444' },
    { id: 'sleepHours', name: 'Sleep Hours', color: '#8b5cf6' },
    { id: 'caloriesBurned', name: 'Calories', color: '#f97316' },
    { id: 'stressLevel', name: 'Stress Level', color: '#8b5cf6' }
  ];
  
  const getYAxisDomain = () => {
    switch (activeMetric) {
      case 'steps':
        return [0, 12000];
      case 'heartRate':
        return [50, 100];
      case 'sleepHours':
        return [0, 10];
      case 'caloriesBurned':
        return [0, 3000];
      case 'stressLevel':
        return [0, 5];
      default:
        return [0, 'auto'];
    }
  };
  
  const activeMetricInfo = metrics.find(m => m.id === activeMetric);
  
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {metrics.map(metric => (
          <button
            key={metric.id}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeMetric === metric.id 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveMetric(metric.id as any)}
          >
            {metric.name}
          </button>
        ))}
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={getYAxisDomain()}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [value, activeMetricInfo?.name]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={activeMetric}
            stroke={activeMetricInfo?.color || '#8884d8'}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthChart;