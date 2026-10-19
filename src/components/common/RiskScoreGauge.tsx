import React from 'react';
import { Severity } from '@/types';

interface RiskScoreGaugeProps {
  score: number;
  severity?: Severity;
  size?: 'sm' | 'md' | 'lg';
  showScale?: boolean;
}

export function RiskScoreGauge({
  score,
  severity,
  size = 'md',
  showScale = false,
}: RiskScoreGaugeProps) {
  // Determine color based on score
  let strokeColor = '#10b981'; // emerald
  let textColor = 'text-emerald-500';

  if (score >= 76) {
    strokeColor = '#ef4444'; // red
    textColor = 'text-red-500';
  } else if (score >= 51) {
    strokeColor = '#f97316'; // orange
    textColor = 'text-orange-500';
  } else if (score >= 26) {
    strokeColor = '#f59e0b'; // amber
    textColor = 'text-amber-500';
  }

  const radius = size === 'sm' ? 24 : size === 'lg' ? 44 : 34;
  const strokeWidth = size === 'sm' ? 4 : size === 'lg' ? 7 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const dimension = radius * 2 + strokeWidth * 2 + 4;

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={dimension} height={dimension} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
            fill="transparent"
          />
          {/* Active progress arc */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={`font-bold tracking-tight ${textColor} ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'
            }`}
          >
            {score}
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] uppercase font-semibold text-slate-400">/100</span>
          )}
        </div>
      </div>

      {showScale && (
        <div className="w-full mt-2 text-center">
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div className="w-1/4 bg-emerald-500" title="0-25 Safe" />
            <div className="w-1/4 bg-amber-500" title="26-50 Suspicious" />
            <div className="w-1/4 bg-orange-500" title="51-75 High" />
            <div className="w-1/4 bg-red-500" title="76-100 Critical" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0 Safe</span>
            <span>26 Susp</span>
            <span>51 High</span>
            <span>76 Crit</span>
          </div>
        </div>
      )}
    </div>
  );
}
