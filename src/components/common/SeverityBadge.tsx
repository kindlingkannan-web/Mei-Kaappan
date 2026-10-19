import React from 'react';
import { Severity } from '@/types';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export function SeverityBadge({ severity, size = 'md', showDot = true }: SeverityBadgeProps) {
  let bg = '';
  let text = '';
  let dotColor = '';
  let label: string = severity;

  switch (severity) {
    case 'CRITICAL':
      bg = 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400';
      dotColor = 'bg-red-500';
      label = 'CRITICAL';
      break;
    case 'HIGH':
      bg = 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400';
      dotColor = 'bg-orange-500';
      label = 'HIGH RISK';
      break;
    case 'SUSPICIOUS':
      bg = 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400';
      dotColor = 'bg-amber-500';
      label = 'SUSPICIOUS';
      break;
    case 'SAFE':
    default:
      bg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400';
      dotColor = 'bg-emerald-500';
      label = 'SAFE';
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${bg} ${sizeClasses[size]} tracking-wide uppercase transition-colors`}
    >
      {showDot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${dotColor} ${
            severity === 'CRITICAL' ? 'animate-pulse' : ''
          }`}
        />
      )}
      <span>{label}</span>
    </span>
  );
}
