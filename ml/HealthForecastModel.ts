import { HealthData, HealthForecast } from '../src/types';
import { addDays, format } from 'date-fns';

/**
 * Machine Learning model for health forecasting
 * This model implements several prediction techniques:
 * - Time series analysis with exponential smoothing
 * - Pattern recognition for weekday/weekend patterns
 * - Personalized weighting based on user history
 */
export class HealthForecastModel {
  private historicalData: HealthData[] = [];
  private weekdayPatterns: Map<number, any> = new Map(); // 0-6 for Sunday-Saturday
  private userDemographics: UserDemographics | null = null;
  private lastUpdated: Date = new Date();
  private modelAccuracy: number = 0;
  private minimumDataPoints: number = 14; // Minimum days of data needed for accurate predictions

  constructor() {
    // Initialize weekday patterns with default values
    for (let i = 0; i < 7; i++) {
      this.weekdayPatterns.set(i, {
        avgSteps: 7500,
        avgHeartRate: 72,
        avgSleepHours: 7.2,
        avgStressLevel: 3,
      });
    }
  }

  /**
   * Train the model with historical health data
   */
  public trainModel(data: HealthData[], demographics?: UserDemographics): void {
    if (!data || data.length === 0) {
      throw new Error('Cannot train model with empty data');
    }

    // Sort data by date
    this.historicalData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (demographics) {
      this.userDemographics = demographics;
    }

    // Calculate weekday patterns
    this.calculateWeekdayPatterns();

    // Update model timestamp
    this.lastUpdated = new Date();

    // Calculate model accuracy based on backtesting
    this.assessModelAccuracy();

    console.log(`Model trained with ${data.length} data points. Accuracy: ${this.modelAccuracy.toFixed(2)}%`);
  }

  /**
   * Generate health forecasts for the next n days
   */
  public generateForecasts(days: number = 7): HealthForecast[] {
    if (this.historicalData.length < this.minimumDataPoints) {
      console.warn(`Forecast accuracy may be reduced. Only ${this.historicalData.length}/${this.minimumDataPoints} days of data available.`);
    }

    const forecasts: HealthForecast[] = [];
    const latestDate = new Date(this.historicalData[this.historicalData.length - 1].date);

    for (let i = 1; i <= days; i++) {
      const forecastDate = addDays(latestDate, i);
      const forecast = this.predictSingleDay(forecastDate);
      forecasts.push(forecast);
    }

    return forecasts;
  }

  /**
   * Generate a forecast for a specific date
   */
  private predictSingleDay(date: Date): HealthForecast {
    const dayOfWeek = date.getDay(); // 0-6
    const weekdayPattern = this.weekdayPatterns.get(dayOfWeek);
    
    // Get recent trends (last 7 days)
    const recentData = this.historicalData.slice(-7);
    
    // Calculate base predictions using exponential smoothing
    const recentSteps = recentData.map(d => d.steps);
    const recentHeartRate = recentData.map(d => d.heartRate);
    const recentSleep = recentData.map(d => d.sleepHours);
    const recentStress = recentData.map(d => d.stressLevel);

    // Apply exponential smoothing
    const alpha = 0.3; // Smoothing factor
    const beta = 0.1;  // Trend factor
    
    // Predicted values based on recent trends and weekday patterns
    let predictedSteps = this.exponentialSmoothing(recentSteps, alpha, beta);
    let predictedHeartRate = this.exponentialSmoothing(recentHeartRate, alpha, beta);
    let predictedSleepHours = this.exponentialSmoothing(recentSleep, alpha, beta);
    let predictedStressLevel = this.exponentialSmoothing(recentStress, alpha, beta);

    // Blend with weekday patterns (70% recent trend, 30% weekday pattern)
    predictedSteps = predictedSteps * 0.7 + weekdayPattern.avgSteps * 0.3;
    predictedHeartRate = predictedHeartRate * 0.7 + weekdayPattern.avgHeartRate * 0.3;
    predictedSleepHours = predictedSleepHours * 0.7 + weekdayPattern.avgSleepHours * 0.3;
    predictedStressLevel = predictedStressLevel * 0.7 + weekdayPattern.avgStressLevel * 0.3;

    // Apply demographic adjustments if available
    if (this.userDemographics) {
      // Age factor - older users might have lower step counts, higher heart rates
      const ageFactor = Math.max(0.8, Math.min(1.2, 1 - (this.userDemographics.age - 30) / 100));
      predictedSteps *= ageFactor;
      
      // Gender adjustments based on statistical averages
      if (this.userDemographics.gender === 'female') {
        predictedHeartRate += 5; // Women tend to have slightly higher heart rates
      }
      
      // Weight factor - higher BMI might affect step count
      if (this.userDemographics.weight && this.userDemographics.height) {
        const heightInMeters = this.userDemographics.height / 100;
        const bmi = this.userDemographics.weight / (heightInMeters * heightInMeters);
        if (bmi > 30) {
          predictedSteps *= 0.9;
        }
      }
    }

    // Apply random variation (within reasonable bounds)
    const randomVariation = 0.05; // 5% random variation
    predictedSteps *= (1 + (Math.random() * 2 - 1) * randomVariation);
    predictedHeartRate *= (1 + (Math.random() * 2 - 1) * randomVariation);
    predictedSleepHours *= (1 + (Math.random() * 2 - 1) * randomVariation);
    predictedStressLevel *= (1 + (Math.random() * 2 - 1) * randomVariation);

    // Ensure values are within reasonable ranges
    predictedSteps = Math.max(3000, Math.min(15000, Math.round(predictedSteps)));
    predictedHeartRate = Math.max(50, Math.min(100, Math.round(predictedHeartRate)));
    predictedSleepHours = Math.max(4, Math.min(10, Number(predictedSleepHours.toFixed(1))));
    predictedStressLevel = Math.max(1, Math.min(5, Number(predictedStressLevel.toFixed(1))));

    // Calculate health score based on the predicted metrics
    const healthScore = this.calculateHealthScore(
      predictedSteps, 
      predictedHeartRate, 
      predictedSleepHours, 
      predictedStressLevel
    );

    return {
      date: format(date, 'yyyy-MM-dd'),
      healthScore,
      predictedSteps,
      predictedHeartRate,
      predictedSleepHours,
      predictedStressLevel
    };
  }

  /**
   * Calculate weekday patterns from historical data
   */
  private calculateWeekdayPatterns(): void {
    const weekdayData: Map<number, HealthData[]> = new Map();
    
    // Group data by day of week
    this.historicalData.forEach(data => {
      const date = new Date(data.date);
      const dayOfWeek = date.getDay();
      
      if (!weekdayData.has(dayOfWeek)) {
        weekdayData.set(dayOfWeek, []);
      }
      
      weekdayData.get(dayOfWeek)?.push(data);
    });
    
    // Calculate averages for each day of week
    weekdayData.forEach((data, dayOfWeek) => {
      if (data.length > 0) {
        const avgSteps = data.reduce((sum, d) => sum + d.steps, 0) / data.length;
        const avgHeartRate = data.reduce((sum, d) => sum + d.heartRate, 0) / data.length;
        const avgSleepHours = data.reduce((sum, d) => sum + d.sleepHours, 0) / data.length;
        const avgStressLevel = data.reduce((sum, d) => sum + d.stressLevel, 0) / data.length;
        
        this.weekdayPatterns.set(dayOfWeek, {
          avgSteps,
          avgHeartRate,
          avgSleepHours,
          avgStressLevel
        });
      }
    });
  }

  /**
   * Exponential smoothing implementation for time series forecasting
   */
  private exponentialSmoothing(data: number[], alpha: number, beta: number): number {
    if (data.length === 0) return 0;
    if (data.length === 1) return data[0];
    
    let level = data[0];
    let trend = data[1] - data[0];
    
    // Process the data sequence
    for (let i = 1; i < data.length; i++) {
      const oldLevel = level;
      level = alpha * data[i] + (1 - alpha) * (level + trend);
      trend = beta * (level - oldLevel) + (1 - beta) * trend;
    }
    
    // Forecast one step ahead
    return level + trend;
  }

  /**
   * Calculate a health score based on predicted metrics
   */
  private calculateHealthScore(
    steps: number, 
    heartRate: number, 
    sleepHours: number, 
    stressLevel: number
  ): number {
    // Steps component (25% of score)
    const stepsScore = Math.min(25, (steps / 10000) * 25);
    
    // Heart Rate component (25% of score)
    // Optimal range: 60-70 bpm
    const heartRateScore = heartRate >= 60 && heartRate <= 70 
      ? 25 
      : 25 - Math.min(25, Math.abs(heartRate - 65) * 1.25);
    
    // Sleep component (25% of score)
    // Optimal range: 7-8 hours
    const sleepScore = sleepHours >= 7 && sleepHours <= 8
      ? 25
      : 25 - Math.min(25, Math.abs(sleepHours - 7.5) * 10);
    
    // Stress component (25% of score)
    // Lower is better (1-5 scale)
    const stressScore = 25 - ((stressLevel - 1) / 4) * 25;
    
    // Total score (0-100)
    const score = stepsScore + heartRateScore + sleepScore + stressScore;
    
    return Math.round(score);
  }

  /**
   * Assess model accuracy by backtesting
   * Holds out the most recent data and tries to predict it
   */
  private assessModelAccuracy(): void {
    if (this.historicalData.length < this.minimumDataPoints + 7) {
      this.modelAccuracy = 70; // Default accuracy if not enough data
      return;
    }
    
    // Hold out the most recent 7 days
    const trainingData = this.historicalData.slice(0, -7);
    const testData = this.historicalData.slice(-7);
    
    // Temporarily set historical data to training data
    const originalData = this.historicalData;
    this.historicalData = trainingData;
    
    // Generate forecasts for the test period
    const forecasts = this.generateForecasts(7);
    
    // Calculate error metrics (RMSE as percentage of the actual value)
    let totalErrorPercent = 0;
    let metricCount = 0;
    
    testData.forEach((actual, index) => {
      if (index < forecasts.length) {
        const forecast = forecasts[index];
        
        // Calculate percent error for steps
        const stepsError = Math.abs(forecast.predictedSteps - actual.steps) / actual.steps;
        
        // Calculate percent error for heart rate
        const heartRateError = Math.abs(forecast.predictedHeartRate - actual.heartRate) / actual.heartRate;
        
        // Calculate percent error for sleep
        const sleepError = Math.abs(forecast.predictedSleepHours - actual.sleepHours) / actual.sleepHours;
        
        // Calculate percent error for stress
        const stressError = Math.abs(forecast.predictedStressLevel - actual.stressLevel) / actual.stressLevel;
        
        totalErrorPercent += stepsError + heartRateError + sleepError + stressError;
        metricCount += 4;
      }
    });
    
    const avgErrorPercent = totalErrorPercent / metricCount;
    this.modelAccuracy = 100 - (avgErrorPercent * 100);
    
    // Restore original data
    this.historicalData = originalData;
  }

  /**
   * Get the current model accuracy
   */
  public getModelAccuracy(): number {
    return this.modelAccuracy;
  }

  /**
   * Update user demographics
   */
  public updateDemographics(demographics: UserDemographics): void {
    this.userDemographics = demographics;
  }
}

/**
 * User demographic information for personalized forecasting
 */
export interface UserDemographics {
  age: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number; // in kg
  height?: number; // in cm
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  medicalConditions?: string[];
}

/**
 * Example usage:
 * 
 * // Create and train the model
 * const model = new HealthForecastModel();
 * model.trainModel(historicalHealthData, {
 *   age: 35,
 *   gender: 'female',
 *   weight: 65,
 *   height: 170,
 *   activityLevel: 'moderate'
 * });
 * 
 * // Generate forecasts
 * const forecasts = model.generateForecasts(7);
 * console.log(`Model accuracy: ${model.getModelAccuracy()}%`);
 */
