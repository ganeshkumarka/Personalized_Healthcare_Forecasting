import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface HealthMetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  goal: number;
  current: number;
  lowerIsBetter?: boolean;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  goal, 
  current,
  lowerIsBetter = false
}) => {
  const isPositiveChange = lowerIsBetter ? change < 0 : change > 0;
  const progressPercentage = lowerIsBetter 
    ? Math.max(0, Math.min(100, (1 - current / goal) * 100))
    : Math.max(0, Math.min(100, (current / goal) * 100));
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {icon}
          <h3 className="text-lg font-medium text-gray-700 ml-2">{title}</h3>
        </div>
        <div className={`flex items-center ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
          {isPositiveChange ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          <span className="text-sm">{Math.abs(change)}%</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 mb-2">{value}</p>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
        <div 
          className={`h-2 rounded-full ${isPositiveChange ? 'bg-green-500' : 'bg-orange-500'}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500">
        {lowerIsBetter ? `Goal: Below ${goal}` : `Goal: ${goal.toLocaleString()}`}
      </p>
    </div>
  );
};

export default HealthMetricCard;