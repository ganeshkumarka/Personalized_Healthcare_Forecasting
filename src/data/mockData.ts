import { HealthData, HealthForecast, HealthInsight, UserProfile, Device, TrendData, Notification, UserSettings } from '../types';
import { addDays, format, subDays, subMonths, subHours, } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Generate dates for the past 7 days
const generatePastDates = (days: number): string[] => {
  return Array.from({ length: days }).map((_, i) => {
    const date = addDays(new Date(), -days + i + 1);
    return format(date, 'yyyy-MM-dd');
  });
};

// Generate dates for the next 7 days
const generateFutureDates = (days: number): string[] => {
  return Array.from({ length: days }).map((_, i) => {
    const date = addDays(new Date(), i + 1);
    return format(date, 'yyyy-MM-dd');
  });
};

// Generate mock health data for the past 7 days
export const mockHealthData: HealthData[] = generatePastDates(7).map((date, index) => ({
  id: index + 1,
  date,
  steps: Math.floor(Math.random() * 5000) + 5000, // 5000-10000 steps
  heartRate: Math.floor(Math.random() * 20) + 60, // 60-80 bpm
  sleepHours: Math.floor(Math.random() * 3) + 6, // 6-9 hours
  caloriesBurned: Math.floor(Math.random() * 500) + 1500, // 1500-2000 calories
  stressLevel: Math.floor(Math.random() * 5) + 1, // 1-5 stress level
}));

// Generate mock health forecasts for the next 7 days
export const mockHealthForecasts: HealthForecast[] = generateFutureDates(7).map((date) => {
  const baseSteps = Math.floor(Math.random() * 5000) + 5000;
  const baseHeartRate = Math.floor(Math.random() * 20) + 60;
  const baseSleepHours = Math.floor(Math.random() * 3) + 6;
  const baseCaloriesBurned = Math.floor(Math.random() * 500) + 1500;
  const baseStressLevel = Math.floor(Math.random() * 5) + 1;
  
  // Calculate a health score based on the metrics (0-100)
  const healthScore = Math.floor(
    (baseSteps / 10000) * 25 + 
    ((80 - baseHeartRate) / 20) * 25 + 
    (baseSleepHours / 9) * 25 + 
    ((5 - baseStressLevel) / 5) * 25
  );
  
  return {
    date,
    predictedSteps: baseSteps,
    predictedHeartRate: baseHeartRate,
    predictedSleepHours: baseSleepHours,
    predictedCaloriesBurned: baseCaloriesBurned,
    predictedStressLevel: baseStressLevel,
    healthScore: Math.min(100, Math.max(0, healthScore)),
  };
});

// Generate mock health insights
export const mockHealthInsights: HealthInsight[] = [
  {
    id: 1,
    title: 'Increase Daily Steps',
    description: 'Your step count has been below your goal for the past 3 days. Try to take short walks during breaks.',
    category: 'activity',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Improve Sleep Quality',
    description: 'Your sleep duration has been inconsistent. Try to maintain a regular sleep schedule.',
    category: 'sleep',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Heart Rate Variability',
    description: 'Your heart rate variability has improved, indicating better recovery and stress management.',
    category: 'heart',
    priority: 'low',
  },
  {
    id: 4,
    title: 'Stress Management',
    description: 'Your stress levels peak in the afternoon. Consider short meditation sessions after lunch.',
    category: 'stress',
    priority: 'medium',
  },
  {
    id: 5,
    title: 'Activity Pattern',
    description: 'Youre most active on weekends. Try to distribute activity more evenly throughout the week.',
    category: 'activity',
    priority: 'low',
  },
];

// Generate more detailed insights for the insights page
export const mockDetailedInsights: HealthInsight[] = [
  ...mockHealthInsights,
  {
    id: 6,
    title: 'Sleep and Stress Correlation',
    description: 'We\'ve noticed that your stress levels are higher on days following poor sleep. Try to improve your sleep quality to reduce stress.',
    category: 'sleep',
    priority: 'high',
  },
  {
    id: 7,
    title: 'Optimal Exercise Time',
    description: 'Based on your heart rate patterns, your body responds best to exercise in the morning between 7-9 AM.',
    category: 'heart',
    priority: 'medium',
  },
  {
    id: 8,
    title: 'Hydration Reminder',
    description: 'Your activity levels suggest you may need to increase water intake, especially on days with over 8,000 steps.',
    category: 'activity',
    priority: 'medium',
  },
  {
    id: 9,
    title: 'Recovery Days',
    description: 'Your performance improves when you take a recovery day after 3 consecutive days of high activity.',
    category: 'activity',
    priority: 'low',
  },
  {
    id: 10,
    title: 'Heart Rate Zones',
    description: 'You spend most of your exercise time in the fat-burning zone. Consider adding high-intensity intervals for cardiovascular benefits.',
    category: 'heart',
    priority: 'medium',
  },
];

// Mock user profile
export const mockUserProfile: UserProfile = {
  name: 'Alex Johnson',
  age: 32,
  weight: 70, // kg
  height: 175, // cm
  gender: 'male',
  birthdate: '1993-05-15',
  bloodType: 'O+',
  medicalConditions: ['Asthma', 'Seasonal allergies'],
  allergies: ['Peanuts', 'Penicillin'],
  emergencyContact: {
    name: 'Sarah Johnson',
    relationship: 'Spouse',
    phone: '555-123-4567'
  },
  goals: {
    dailySteps: 10000,
    sleepHours: 8,
    caloriesBurn: 2000,
  },
};

// Mock connected devices
export const mockDevices: Device[] = [
  {
    id: 'dev-001',
    name: 'Fitbit Charge 5',
    type: 'fitness-tracker',
    lastSync: new Date().toISOString(),
    batteryLevel: 72,
    status: 'connected',
    metrics: ['steps', 'heartRate', 'sleep', 'calories'],
  },
  {
    id: 'dev-002',
    name: 'Apple Watch Series 7',
    type: 'smartwatch',
    lastSync: subDays(new Date(), 2).toISOString(),
    batteryLevel: 45,
    status: 'low-battery',
    metrics: ['steps', 'heartRate', 'calories', 'stress'],
  },
  {
    id: 'dev-003',
    name: 'Withings Sleep Analyzer',
    type: 'sleep-tracker',
    lastSync: new Date().toISOString(),
    batteryLevel: 90,
    status: 'connected',
    metrics: ['sleep'],
  },
  {
    id: 'dev-004',
    name: 'Oura Ring Gen 3',
    type: 'fitness-tracker',
    lastSync: subDays(new Date(), 5).toISOString(),
    batteryLevel: 0,
    status: 'disconnected',
    metrics: ['sleep', 'heartRate', 'temperature'],
  },
];

// Generate trend data for the past 30 days
const generateTrendData = (days: number): TrendData[] => {
  const data: TrendData[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Generate some realistic patterns
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // More steps on weekends, less on weekdays
    const baseSteps = isWeekend ? 9000 : 7000;
    const stepsVariation = Math.floor(Math.random() * 2000) - 1000;
    const steps = Math.max(4000, baseSteps + stepsVariation);
    
    // Heart rate slightly higher on active days
    const baseHeartRate = steps > 8000 ? 72 : 68;
    const heartRateVariation = Math.floor(Math.random() * 8) - 4;
    const heartRate = baseHeartRate + heartRateVariation;
    
    // Sleep tends to be less on weekdays
    const baseSleepHours = isWeekend ? 8 : 7;
    const sleepVariation = Math.random() * 1.5 - 0.75;
    const sleepHours = Math.max(5, Math.min(9.5, baseSleepHours + sleepVariation));
    
    // Calories burned correlates with steps
    const baseCalories = 1500 + (steps / 10000) * 800;
    const caloriesVariation = Math.floor(Math.random() * 300) - 150;
    const caloriesBurned = Math.floor(baseCalories + caloriesVariation);
    
    // Stress level higher on weekdays, especially Monday and Friday
    const baseStress = isWeekend ? 2 : (dayOfWeek === 1 || dayOfWeek === 5) ? 4 : 3;
    const stressVariation = Math.random() * 1.5 - 0.75;
    const stressLevel = Math.max(1, Math.min(5, baseStress + stressVariation));
    
    data.push({
      date: formattedDate,
      steps,
      heartRate,
      sleepHours,
      caloriesBurned,
      stressLevel: Math.round(stressLevel),
    });
  }
  
  return data;
};

export const mockTrendData: TrendData[] = generateTrendData(30);

// Generate monthly averages for the past 6 months
export const mockMonthlyAverages = Array.from({ length: 6 }).map((_, index) => {
  const month = subMonths(new Date(), index);
  const monthName = format(month, 'MMM');
  
  // Create some realistic patterns - health improving over time
  const improvementFactor = index / 6; // More recent months have lower index, so less improvement
  
  return {
    month: monthName,
    avgSteps: Math.floor(7000 + 2000 * improvementFactor),
    avgHeartRate: Math.floor(75 - 5 * improvementFactor),
    avgSleepHours: 6.5 + 1 * improvementFactor,
    avgCaloriesBurned: Math.floor(1800 + 300 * improvementFactor),
    avgStressLevel: Math.max(1, Math.min(5, 4 - 2 * improvementFactor)),
    healthScore: Math.floor(65 + 20 * improvementFactor),
  };
}).reverse(); // Reverse to show oldest to newest

// Generate mock notifications
export const mockNotifications: Notification[] = [
  {
    id: uuidv4(),
    title: 'Goal Achieved!',
    message: 'Congratulations! You reached your daily step goal of 10,000 steps.',
    type: 'success',
    read: false,
    date: subHours(new Date(), 2).toISOString(),
    link: '/trends'
  },
  {
    id: uuidv4(),
    title: 'Device Battery Low',
    message: 'Your Apple Watch battery is below 20%. Please charge it soon.',
    type: 'warning',
    read: false,
    date: subHours(new Date(), 5).toISOString(),
    link: '/devices'
  },
  {
    id: uuidv4(),
    title: 'New Insight Available',
    message: 'We\'ve analyzed your sleep patterns and have a new recommendation for you.',
    type: 'info',
    read: true,
    date: subDays(new Date(), 1).toISOString(),
    link: '/insights'
  },
  {
    id: uuidv4(),
    title: 'Stress Level Alert',
    message: 'Your stress level has been elevated for the past 3 days. Consider some relaxation techniques.',
    type: 'alert',
    read: true,
    date: subDays(new Date(), 2).toISOString(),
    link: '/insights'
  },
  {
    id: uuidv4(),
    title: 'Weekly Report Ready',
    message: 'Your weekly health summary is now available. Check it out to see your progress!',
    type: 'info',
    read: true,
    date: subDays(new Date(), 3).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Device Disconnected',
    message: 'Your Oura Ring has been disconnected for 5 days. Reconnect it to continue tracking your health.',
    type: 'warning',
    read: true,
    date: subDays(new Date(), 4).toISOString(),
    link: '/devices'
  },
  {
    id: uuidv4(),
    title: 'Heart Rate Anomaly',
    message: 'We detected an unusual heart rate pattern yesterday. Consider consulting with your doctor if this continues.',
    type: 'alert',
    read: true,
    date: subDays(new Date(), 1).toISOString()
  }
];

// Default user settings
export const defaultUserSettings: UserSettings = {
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  privacy: {
    shareData: false,
    anonymousAnalytics: true
  },
  display: {
    darkMode: false,
    compactView: false
  },
  units: {
    distance: 'km',
    weight: 'kg',
    temperature: 'c'
  }
};