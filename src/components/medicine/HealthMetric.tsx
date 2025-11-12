// /src/components/medicine/HealthMetric.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HealthMetricProps {
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  icon: string;
  color: string;
}

export function HealthMetric({ title, value, unit, trend, change, icon, color }: HealthMetricProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className={`text-sm ${getTrendColor()}`}>
          {getTrendIcon()} {change}
        </div>
      </div>
      
      <div className="text-2xl font-bold text-white mb-1">
        {value} <span className="text-sm text-white/60">{unit}</span>
      </div>
      <div className="text-white/60 text-sm">{title}</div>
    </motion.div>
  );
}