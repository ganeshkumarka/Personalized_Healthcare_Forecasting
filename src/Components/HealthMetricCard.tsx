import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthMetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  goal?: number;
  current?: number;
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
  const [isHovered, setIsHovered] = useState(false);
  
  const isPositiveChange = lowerIsBetter ? change < 0 : change > 0;
  const progressPercentage = goal && current ? Math.min(100, (current / goal) * 100) : 0;
  
  // Determine if we're over or under the goal
  const isAboveGoal = lowerIsBetter 
    ? current && goal ? current > goal : false
    : current && goal ? current >= goal : false;
  
  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 hover-float"
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          {icon}
          <h3 className="text-sm font-medium text-gray-700 ml-1">{title}</h3>
        </div>
        <div className={`text-xs font-medium flex items-center ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
          {isPositiveChange ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      
      {goal && current !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-500">Progress</span>
            <span className={`font-medium ${isAboveGoal ? 'text-green-600' : 'text-blue-600'}`}>
              {current} / {goal} {isAboveGoal ? '✓' : ''}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${isAboveGoal ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {isHovered && (
        <motion.div 
          className="mt-3 text-xs text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {title === 'Steps' && 'Daily step count helps maintain cardiovascular health.'}
          {title === 'Heart Rate' && 'Average resting heart rate over the last 24 hours.'}
          {title === 'Sleep' && 'Total hours of sleep recorded last night.'}
          {title === 'Calories' && 'Estimated calories burned based on activity level.'}
          {title === 'Stress' && 'Stress level based on heart rate variability and activity patterns.'}
        </motion.div>
      )}
    </motion.div>
  );
};

export default HealthMetricCard;