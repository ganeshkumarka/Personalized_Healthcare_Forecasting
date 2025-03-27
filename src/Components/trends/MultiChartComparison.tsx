import React, { useState } from 'react';
import { mockTrendData } from '../../data/mockData';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type MetricKey = 'steps' | 'heartRate' | 'sleepHours' | 'caloriesBurned' | 'stressLevel';
type MetricInfo = {
  key: MetricKey;
  label: string;
  color: string;
  unit: string;
  scale?: 'primary' | 'secondary';
};

const availableMetrics: MetricInfo[] = [
  { key: 'steps', label: 'Steps', color: 'rgb(59, 130, 246)', unit: 'steps' },
  { key: 'heartRate', label: 'Heart Rate', color: 'rgb(239, 68, 68)', unit: 'bpm' },
  { key: 'sleepHours', label: 'Sleep Hours', color: 'rgb(99, 102, 241)', unit: 'hrs' },
  { key: 'caloriesBurned', label: 'Calories Burned', color: 'rgb(249, 115, 22)', unit: 'cal' },
  { key: 'stressLevel', label: 'Stress Level', color: 'rgb(168, 85, 247)', unit: 'level' },
];

const MultiChartComparison: React.FC = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(['steps', 'caloriesBurned']);
  
  const toggleMetric = (metric: MetricKey) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else if (selectedMetrics.length < 3) {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  // Format data for the chart
  const chartData: ChartData<'line'> = {
    labels: mockTrendData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: selectedMetrics.map(metricKey => {
      const metricInfo = availableMetrics.find(m => m.key === metricKey)!;
      
      // Normalize the data values
      let values = mockTrendData.map(item => item[metricKey]);
      const max = Math.max(...values);
      
      return {
        label: metricInfo.label,
        data: values,
        borderColor: metricInfo.color,
        backgroundColor: `${metricInfo.color}33`, // Add transparency
        yAxisID: metricInfo.key === 'steps' || metricInfo.key === 'caloriesBurned' ? 'y' : 'y1',
        tension: 0.3,
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Value',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const metricKey = context.dataset.label.toLowerCase().replace(' ', '') as MetricKey;
            const metricInfo = availableMetrics.find(m => m.label.toLowerCase().replace(' ', '') === metricKey.toLowerCase().replace(' ', ''))!;
            return `${context.dataset.label}: ${context.parsed.y} ${metricInfo?.unit || ''}`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Metric Comparison</h2>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {availableMetrics.map(metric => (
          <button
            key={metric.key}
            onClick={() => toggleMetric(metric.key)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedMetrics.includes(metric.key)
                ? `bg-${metric.color.replace('rgb(', '').replace(')', '').replace(', ', '-')} text-white`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            style={selectedMetrics.includes(metric.key) ? { backgroundColor: metric.color, color: 'white' } : {}}
          >
            {metric.label}
          </button>
        ))}
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        Select up to 3 metrics to compare their trends over time
      </div>
      
      <div className="h-80">
        {selectedMetrics.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select metrics to see comparison chart
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiChartComparison;
