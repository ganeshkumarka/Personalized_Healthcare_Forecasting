import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { mockTrendData, mockMonthlyAverages } from '../../data/mockData';
import { TrendData } from '../../types';
import { Calendar, TrendingUp, BarChart2, Clock, Filter } from 'lucide-react';

const TrendsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('7d');
  const [activeMetric, setActiveMetric] = useState<'steps' | 'heartRate' | 'sleepHours' | 'caloriesBurned' | 'stressLevel'>('steps');
  
  // Filter data based on selected time range
  const getFilteredData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    return mockTrendData.slice(-days);
  };
  
  const filteredData = getFilteredData();
  
  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMM dd');
  };
  
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
  
  const metrics = [
    { id: 'steps', name: 'Steps', color: '#3b82f6', unit: '' },
    { id: 'heartRate', name: 'Heart Rate', color: '#ef4444', unit: 'bpm' },
    { id: 'sleepHours', name: 'Sleep', color: '#8b5cf6', unit: 'hrs' },
    { id: 'caloriesBurned', name: 'Calories', color: '#f97316', unit: '' },
    { id: 'stressLevel', name: 'Stress', color: '#ec4899', unit: '/5' }
  ];
  
  const activeMetricInfo = metrics.find(m => m.id === activeMetric);
  
  // Calculate averages for the selected time period
  const calculateAverages = (data: TrendData[]) => {
    if (data.length === 0) return null;
    
    const sum = data.reduce((acc, item) => {
      return {
        steps: acc.steps + item.steps,
        heartRate: acc.heartRate + item.heartRate,
        sleepHours: acc.sleepHours + item.sleepHours,
        caloriesBurned: acc.caloriesBurned + item.caloriesBurned,
        stressLevel: acc.stressLevel + item.stressLevel
      };
    }, { steps: 0, heartRate: 0, sleepHours: 0, caloriesBurned: 0, stressLevel: 0 });
    
    return {
      steps: Math.round(sum.steps / data.length),
      heartRate: Math.round(sum.heartRate / data.length),
      sleepHours: +(sum.sleepHours / data.length).toFixed(1),
      caloriesBurned: Math.round(sum.caloriesBurned / data.length),
      stressLevel: +(sum.stressLevel / data.length).toFixed(1)
    };
  };
  
  const averages = calculateAverages(filteredData);
  
  // Find min and max values for the selected metric
  const findMinMax = (data: TrendData[], metric: keyof TrendData) => {
    if (data.length === 0) return { min: 0, max: 0, minDate: '', maxDate: '' };
    
    let min = data[0][metric] as number;
    let max = data[0][metric] as number;
    let minDate = data[0].date;
    let maxDate = data[0].date;
    
    data.forEach(item => {
      const value = item[metric] as number;
      if (value < min) {
        min = value;
        minDate = item.date;
      }
      if (value > max) {
        max = value;
        maxDate = item.date;
      }
    });
    
    return { min, max, minDate, maxDate };
  };
  
  const minMax = findMinMax(filteredData, activeMetric);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Health Trends</h1>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeRange === '7d' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('14d')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeRange === '14d' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            14 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeRange === '30d' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>
      
      {/* Metric Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Metric Analysis</h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {metrics.map(metric => (
            <button
              key={metric.id}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
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
        
        {/* Metric Stats */}
        {averages && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">Average</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {activeMetric === 'steps' && averages.steps.toLocaleString()}
                {activeMetric === 'heartRate' && `${averages.heartRate} bpm`}
                {activeMetric === 'sleepHours' && `${averages.sleepHours} hrs`}
                {activeMetric === 'caloriesBurned' && averages.caloriesBurned.toLocaleString()}
                {activeMetric === 'stressLevel' && `${averages.stressLevel}/5`}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center mb-2">
                <BarChart2 className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">Maximum</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {activeMetric === 'steps' && minMax.max.toLocaleString()}
                {activeMetric === 'heartRate' && `${minMax.max} bpm`}
                {activeMetric === 'sleepHours' && `${minMax.max} hrs`}
                {activeMetric === 'caloriesBurned' && minMax.max.toLocaleString()}
                {activeMetric === 'stressLevel' && `${minMax.max}/5`}
              </p>
              <p className="text-xs text-gray-500 mt-1">{formatDate(minMax.maxDate)}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center mb-2">
                <BarChart2 className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">Minimum</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {activeMetric === 'steps' && minMax.min.toLocaleString()}
                {activeMetric === 'heartRate' && `${minMax.min} bpm`}
                {activeMetric === 'sleepHours' && `${minMax.min} hrs`}
                {activeMetric === 'caloriesBurned' && minMax.min.toLocaleString()}
                {activeMetric === 'stressLevel' && `${minMax.min}/5`}
              </p>
              <p className="text-xs text-gray-500 mt-1">{formatDate(minMax.minDate)}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">Time Period</h3>
              </div>
              <p className="text-lg font-bold text-gray-800">
                Last {timeRange === '7d' ? '7' : timeRange === '14d' ? '14' : '30'} days
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {format(parseISO(filteredData[0].date), 'MMM dd')} - {format(parseISO(filteredData[filteredData.length - 1].date), 'MMM dd')}
              </p>
            </div>
          </div>
        )}
        
        {/* Trend Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={filteredData.map(item => ({
              ...item,
              formattedDate: format(parseISO(item.date), 'MMM dd')
            }))}
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
              formatter={(value) => [`${value}${activeMetricInfo?.unit || ''}`, activeMetricInfo?.name]}
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
      
      {/* Monthly Averages */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Progress</h2>
        <p className="text-gray-600 mb-6">
          Track how your health metrics have changed over the past 6 months.
        </p>
        
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={mockMonthlyAverages}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" orientation="left" domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10000]} />
            <Tooltip />
            <Legend />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="healthScore" 
              fill="#10b981" 
              stroke="#10b981" 
              name="Health Score"
              fillOpacity={0.2}
            />
            <Bar 
              yAxisId="right"
              dataKey="avgSteps" 
              barSize={20} 
              fill="#3b82f6" 
              name="Avg. Steps"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="avgSleepHours" 
              stroke="#8b5cf6" 
              name="Avg. Sleep (hrs)"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Weekly Patterns */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Patterns</h2>
        <p className="text-gray-600 mb-6">
          Analyze how your health metrics vary throughout the week.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {metrics.map(metric => (
            <button
              key={metric.id}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeMetric === metric.id 
                  ? `bg-${metric.color.replace('#', '')} text-white` 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={{ backgroundColor: activeMetric === metric.id ? metric.color : undefined }}
              onClick={() => setActiveMetric(metric.id as any)}
            >
              {metric.name}
            </button>
          ))}
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { day: 'Mon', value: 7500 },
              { day: 'Tue', value: 8200 },
              { day: 'Wed', value: 7800 },
              { day: 'Thu', value: 8100 },
              { day: 'Fri', value: 8500 },
              { day: 'Sat', value: 9800 },
              { day: 'Sun', value: 9200 },
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 12000]} />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="value" 
              name={activeMetricInfo?.name || 'Value'} 
              fill={activeMetricInfo?.color || '#8884d8'} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsPage;