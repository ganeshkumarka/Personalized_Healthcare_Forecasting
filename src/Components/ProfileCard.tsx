import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Heart, Activity, Moon, Weight, Ruler, Calendar, Droplets, AlertTriangle } from 'lucide-react';
// import { format, parseISO } from 'date-fns';

const ProfileCard: React.FC = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;
  
  const { profile } = currentUser;
  
  // Calculate BMI
  const heightInMeters = profile.height / 100;
  const bmi = profile.weight / (heightInMeters * heightInMeters);
  const bmiCategory = () => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };
  
  // Calculate daily calorie needs (basic estimation)
//   const calculateBasalMetabolicRate = () => {
//     if (profile.gender === 'male') {
//       return 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
//     } else if (profile.gender === 'female') {
//       return 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
//     }
//     // Default calculation if gender not specified
//     return 370 + (21.6 * (profile.weight * (1 - 0.25)));
//   };
  
  
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-5">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <div className="ml-4 text-white">
            <h3 className="text-lg font-semibold">{profile.name}</h3>
            <p className="text-blue-100 text-sm">{currentUser.email}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-500 mb-2">HEALTH PROFILE</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm">Age</span>
            </div>
            <span className="text-sm font-medium">{profile.age} years</span>
          </div>
          
          {profile.gender && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm">Gender</span>
              </div>
              <span className="text-sm font-medium capitalize">{profile.gender}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <Weight className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm">Weight</span>
            </div>
            <span className="text-sm font-medium">{profile.weight} kg</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <Ruler className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm">Height</span>
            </div>
            <span className="text-sm font-medium">{profile.height} cm</span>
          </div>
          
          {profile.bloodType && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <Droplets className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm">Blood Type</span>
              </div>
              <span className="text-sm font-medium">{profile.bloodType}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-2">HEALTH INSIGHTS</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <Activity className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm">BMI</span>
              </div>
              <span className={`text-sm font-medium ${bmiCategory().color}`}>
                {bmi.toFixed(1)} ({bmiCategory().label})
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <Heart className="h-4 w-4 mr-2 text-red-500" />
                <span className="text-sm">Resting Heart Rate</span>
              </div>
              <span className="text-sm font-medium">68 bpm</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <Moon className="h-4 w-4 mr-2 text-indigo-500" />
                <span className="text-sm">Avg. Sleep</span>
              </div>
              <span className="text-sm font-medium">7.2 hrs</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-2">DAILY GOALS</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <Activity className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm">Steps</span>
              </div>
              <span className="text-sm font-medium">{profile.goals.dailySteps.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <Moon className="h-4 w-4 mr-2 text-indigo-500" />
                <span className="text-sm">Sleep</span>
              </div>
              <span className="text-sm font-medium">{profile.goals.sleepHours} hrs</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <Activity className="h-4 w-4 mr-2 text-orange-500" />
                <span className="text-sm">Calories</span>
              </div>
              <span className="text-sm font-medium">{profile.goals.caloriesBurn.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {profile.medicalConditions && profile.medicalConditions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
              <h4 className="text-sm font-medium text-gray-500">MEDICAL CONDITIONS</h4>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {profile.medicalConditions.map((condition, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;