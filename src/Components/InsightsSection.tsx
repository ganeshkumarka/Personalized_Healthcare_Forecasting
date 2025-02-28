import React from 'react';
import { Activity, Heart, Moon, BarChart3, Lightbulb } from 'lucide-react';
import { mockHealthInsights } from '../data/mockData';

const InsightsSection: React.FC = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'activity':
        return <Activity className="h-5 w-5 text-blue-500" />;
      case 'heart':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'sleep':
        return <Moon className="h-5 w-5 text-indigo-500" />;
      case 'stress':
        return <BarChart3 className="h-5 w-5 text-purple-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Insights</h2>
      <p className="text-gray-600 mb-6">
        Personalized insights based on your health data to help you improve your wellbeing.
      </p>
      
      <div className="space-y-4">
        {mockHealthInsights.map((insight) => (
          <div key={insight.id} className="flex p-4 border border-gray-200 rounded-lg">
            <div className="mr-4 mt-1">
              {getCategoryIcon(insight.category)}
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <h3 className="text-lg font-medium text-gray-800 mr-2">{insight.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)}`}>
                  {insight.priority}
                </span>
              </div>
              <p className="text-gray-600">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsSection;