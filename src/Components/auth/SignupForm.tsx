import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Activity } from 'lucide-react';

interface SignupFormProps {
  onToggleForm: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleForm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const { signup } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (step === 1) {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
      
      setStep(2);
      setIsLoading(false);
      return;
    }
    
    // Step 2 validation
    if (!age || !height || !weight) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }
    
    try {
      const ageNum = parseInt(age);
      const heightNum = parseInt(height);
      const weightNum = parseInt(weight);
      
      const success = await signup(
        email, 
        password, 
        name, 
        {
          age: ageNum,
          height: heightNum,
          weight: weightNum,
          gender: gender as 'male' | 'female' | 'other' | 'prefer-not-to-say' || undefined
        }
      );
      
      if (!success) {
        setError('Email already in use');
      }
    } catch (err) {
      setError('An error occurred during signup');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-center mb-6">
        <Activity className="h-12 w-12 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        {step === 1 ? 'Create your account' : 'Health Profile'}
      </h2>
      
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="age" className="block text-gray-700 text-sm font-medium mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
                min="1"
                max="120"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="gender" className="block text-gray-700 text-sm font-medium mb-2">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="height" className="block text-gray-700 text-sm font-medium mb-2">
                Height (cm) <span className="text-red-500">*</span>
              </label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="175"
                min="50"
                max="250"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="weight" className="block text-gray-700 text-sm font-medium mb-2">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="70"
                min="20"
                max="300"
              />
            </div>
          </>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-70"
        >
          {isLoading 
            ? 'Processing...' 
            : step === 1 
              ? 'Continue' 
              : 'Create Account'}
        </button>
      </form>
      
      {step === 2 && (
        <button
          onClick={() => setStep(1)}
          className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Back
        </button>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;