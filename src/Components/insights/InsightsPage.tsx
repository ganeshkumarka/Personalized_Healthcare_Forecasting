import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  Moon, 
  BarChart3, 
  Lightbulb, 
  Filter, 
  ArrowRight, 
  Zap,
  Calendar,
  Clock,
  Flame
} from 'lucide-react';
import { mockDetailedInsights } from '../../data/mockData';
import { HealthInsight } from '../../types';

const InsightsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'activity' | 'sleep' | 'heart' | 'stress'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  
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
  
  const filteredInsights = mockDetailedInsights.filter(insight => {
    if (filter !== 'all' && insight.category !== filter) return false;
    if (priorityFilter !== 'all' && insight.priority !== priorityFilter) return false;
    return true;
  });
  
  // Group insights by priority
  const highPriorityInsights = filteredInsights.filter(i => i.priority === 'high');
  const mediumPriorityInsights = filteredInsights.filter(i => i.priority === 'medium');
  const lowPriorityInsights = filteredInsights.filter(i => i.priority === 'low');
  
  const renderInsightCard = (insight: HealthInsight) => (
    <div key={insight.id} className="flex p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
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
        <p className="text-gray-600 mb-2">{insight.description}</p>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
          Learn more
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Health Insights</h1>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter by Category
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
              <div className="py-1">
                <button 
                  onClick={() => setFilter('all')}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'all' ? 'bg-gray-100' : ''}`}
                >
                  All Categories
                </button>
                <button 
                  onClick={() => setFilter('activity')}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'activity' ? 'bg-gray-100' : ''}`}
                >
                  Activity
                </button>
                <button 
                  onClick={() => setFilter('sleep')}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'sleep' ? 'bg-gray-100' : ''}`}
                >
                  Sleep
                </button>
                <button 
                  onClick={() => setFilter('heart')}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'heart' ? 'bg-gray-100' : ''}`}
                >
                  Heart
                </button>
                <button 
                  onClick={() => setFilter('stress')}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'stress' ? 'bg-gray-100' : ''}`}
                >
                  Stress
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                priorityFilter === 'all' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPriorityFilter('high')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                priorityFilter === 'high' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setPriorityFilter('medium')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                priorityFilter === 'medium' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setPriorityFilter('low')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                priorityFilter === 'low' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Low
            </button>
          </div>
        </div>
      </div>
      
      {/* Health Insights Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Insights Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Zap className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium text-red-800">High Priority</span>
            </div>
            <p className="text-2xl font-bold text-red-800">{highPriorityInsights.length}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium text-yellow-800">Medium Priority</span>
            </div>
            <p className="text-2xl font-bold text-yellow-800">{mediumPriorityInsights.length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium text-green-800">Low Priority</span>
            </div>
            <p className="text-2xl font-bold text-green-800">{lowPriorityInsights.length}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Flame className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium text-blue-800">Total Insights</span>
            </div>
            <p className="text-2xl font-bold text-blue-800">{filteredInsights.length}</p>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map(renderInsightCard)}
      </div>
    </div>
  );
};

export default InsightsPage;