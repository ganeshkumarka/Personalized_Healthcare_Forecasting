import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  TrendingUp, 
  Target, 
  Calendar, 
  Flag,
  Check
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';

interface JourneyEvent {
  date: Date;
  title: string;
  description: string;
  type: 'achievement' | 'milestone' | 'goal' | 'streak' | 'record';
  completed?: boolean;
}

const getEventIcon = (type: string, completed?: boolean) => {
  switch (type) {
    case 'achievement':
      return <Award className={`h-5 w-5 ${completed ? 'text-yellow-500' : 'text-gray-400'}`} />;
    case 'milestone':
      return <Flag className={`h-5 w-5 ${completed ? 'text-green-500' : 'text-gray-400'}`} />;
    case 'goal':
      return <Target className={`h-5 w-5 ${completed ? 'text-blue-500' : 'text-gray-400'}`} />;
    case 'streak':
      return <TrendingUp className={`h-5 w-5 ${completed ? 'text-purple-500' : 'text-gray-400'}`} />;
    case 'record':
      return <Calendar className={`h-5 w-5 ${completed ? 'text-red-500' : 'text-gray-400'}`} />;
    default:
      return <Check className={`h-5 w-5 ${completed ? 'text-gray-500' : 'text-gray-400'}`} />;
  }
};

// Generate sample journey events
const generateJourneyEvents = (): JourneyEvent[] => {
  const today = new Date();
  return [
    {
      date: subDays(today, 30),
      title: 'Started Health Journey',
      description: 'Began tracking health metrics and setting goals',
      type: 'milestone',
      completed: true
    },
    {
      date: subDays(today, 25),
      title: '10,000 Steps Achievement',
      description: 'Reached 10,000 steps for the first time',
      type: 'achievement',
      completed: true
    },
    {
      date: subDays(today, 18),
      title: '7-Day Activity Streak',
      description: 'Maintained consistent activity for a week',
      type: 'streak',
      completed: true
    },
    {
      date: subDays(today, 12),
      title: 'Personal Record: Sleep',
      description: '8+ hours of sleep for 5 consecutive days',
      type: 'record',
      completed: true
    },
    {
      date: subDays(today, 5),
      title: 'Stress Reduction Goal',
      description: 'Achieved 30% reduction in average stress levels',
      type: 'goal',
      completed: true
    },
    {
      date: today,
      title: 'Current Milestone',
      description: 'Maintaining consistent health score above 80',
      type: 'milestone',
      completed: true
    },
    {
      date: addDays(today, 7),
      title: '30-Day Streak Goal',
      description: 'Complete daily activity goals for 30 consecutive days',
      type: 'goal',
      completed: false
    },
    {
      date: addDays(today, 14),
      title: 'Heart Health Target',
      description: 'Maintain resting heart rate below 70 bpm for two weeks',
      type: 'goal',
      completed: false
    }
  ];
};

const journeyEvents = generateJourneyEvents();

const HealthJourneyTimeline: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Health Journey</h2>
      
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {journeyEvents.map((event, index) => {
            const isPast = event.date <= new Date();
            
            return (
              <motion.div
                key={index}
                className="relative pl-12"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Timeline dot */}
                <div className={`absolute left-1.5 w-6 h-6 rounded-full flex items-center justify-center ${
                  isPast ? 'bg-white border-2 border-blue-500' : 'bg-gray-100 border border-gray-300'
                }`}>
                  {getEventIcon(event.type, event.completed)}
                </div>
                
                {/* Event card */}
                <div className={`bg-white rounded-lg border p-4 ${
                  event.completed ? 'border-blue-200' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${
                      isPast ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {event.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {format(event.date, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  
                  {event.completed && (
                    <div className="mt-2 flex items-center">
                      <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    </div>
                  )}
                  
                  {!isPast && (
                    <div className="mt-2 flex items-center">
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Upcoming
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HealthJourneyTimeline;
