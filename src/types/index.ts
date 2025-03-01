export interface HealthData {
  id: number;
  date: string;
  steps: number;
  heartRate: number;
  sleepHours: number;
  caloriesBurned: number;
  stressLevel: number;
}

export interface HealthForecast {
  date: string;
  predictedSteps: number;
  predictedHeartRate: number;
  predictedSleepHours: number;
  predictedCaloriesBurned: number;
  predictedStressLevel: number;
  healthScore: number;
}

export interface HealthInsight {
  id: number;
  title: string;
  description: string;
  category: 'activity' | 'sleep' | 'heart' | 'stress' | 'general';
  priority: 'high' | 'medium' | 'low';
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  birthdate?: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';
  medicalConditions?: string[];
  allergies?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  goals: {
    dailySteps: number;
    sleepHours: number;
    caloriesBurn: number;
  };
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  profile: UserProfile;
}

export interface Device {
  id: string;
  name: string;
  type: 'fitness-tracker' | 'smartwatch' | 'sleep-tracker' | 'scale' | 'other';
  lastSync: string;
  batteryLevel: number;
  status: 'connected' | 'disconnected' | 'low-battery' | 'syncing';
  metrics: string[];
}

export interface TrendData {
  date: string;
  steps: number;
  heartRate: number;
  sleepHours: number;
  caloriesBurned: number;
  stressLevel: number;
}

export interface MonthlyAverage {
  month: string;
  avgSteps: number;
  avgHeartRate: number;
  avgSleepHours: number;
  avgCaloriesBurned: number;
  avgStressLevel: number;
  healthScore: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
  date: string;
  link?: string;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareData: boolean;
    anonymousAnalytics: boolean;
  };
  display: {
    darkMode: boolean;
    compactView: boolean;
  };
  units: {
    distance: 'km' | 'mi';
    weight: 'kg' | 'lb';
    temperature: 'c' | 'f';
  };
}