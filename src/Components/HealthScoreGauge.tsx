import React, { useEffect, useRef, useState } from 'react';

interface HealthScoreGaugeProps {
  score: number;
  size?: number;
}

const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ score, size = 150 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentScore, setCurrentScore] = useState(0);
  
  // Animation effect for score
  useEffect(() => {
    let animationFrame: number;
    const animateScore = () => {
      if (currentScore < score) {
        setCurrentScore(prev => Math.min(prev + 1, score));
        animationFrame = requestAnimationFrame(animateScore);
      }
    };
    
    animationFrame = requestAnimationFrame(animateScore);
    return () => cancelAnimationFrame(animationFrame);
  }, [score]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Calculate positions
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    const lineWidth = size * 0.07;
    
    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.7, Math.PI * 2.3, false);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#edf2f7'; // gray-100
    ctx.stroke();
    
    // Calculate score arc
    const scorePercent = currentScore / 100;
    const startAngle = Math.PI * 0.7;
    const endAngle = startAngle + (Math.PI * 1.6) * scorePercent;
    
    // Get color based on score
    let gradient;
    if (currentScore < 40) {
      gradient = ctx.createLinearGradient(0, 0, size, 0);
      gradient.addColorStop(0, '#ef4444'); // red-500
      gradient.addColorStop(1, '#f97316'); // orange-500
    } else if (currentScore < 70) {
      gradient = ctx.createLinearGradient(0, 0, size, 0);
      gradient.addColorStop(0, '#f97316'); // orange-500
      gradient.addColorStop(1, '#eab308'); // yellow-500
    } else {
      gradient = ctx.createLinearGradient(0, 0, size, 0);
      gradient.addColorStop(0, '#22c55e'); // green-500
      gradient.addColorStop(1, '#10b981'); // emerald-500
    }
    
    // Draw score arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = gradient;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Draw inner shadow for depth
    const innerRadius = radius - lineWidth / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    
    // Draw score text
    ctx.font = `bold ${size * 0.2}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#111827'; // gray-900
    ctx.fillText(`${currentScore}`, centerX, centerY);
    
    // Draw label text
    ctx.font = `${size * 0.08}px sans-serif`;
    ctx.fillStyle = '#6b7280'; // gray-500
    ctx.fillText('Health Score', centerX, centerY + size * 0.15);
    
  }, [currentScore, size]);

  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size} 
        className="cursor-pointer hover:scale-105 transition-transform"
        title="Your health score is calculated based on activity, sleep, heart rate and stress levels"
      />
    </div>
  );
};

export default HealthScoreGauge;
