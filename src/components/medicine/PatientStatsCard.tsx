// /src/components/medicine/PatientStatsCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface PatientStatsProps {
  stats: {
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'stable';
    description?: string;
    icon: string;
    color: string;
  };
  compact?: boolean;
}

export const PatientStatsCard: React.FC<PatientStatsProps> = ({ stats, compact = false }) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  if (compact) {
    return (
      <motion.div
        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
        whileHover={{ y: -1 }}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${stats.color} flex items-center justify-center text-sm`}>
            {stats.icon}
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-lg">{stats.value}</div>
            <div className="text-white/60 text-xs">{stats.label}</div>
          </div>
          {stats.change && (
            <div className={`text-xs font-medium ${getTrendColor(stats.trend || 'stable')}`}>
              {getTrendIcon(stats.trend || 'stable')} {stats.change}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
      whileHover={{ y: -2, scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-xl ${stats.color} flex items-center justify-center text-lg`}>
          {stats.icon}
        </div>
        {stats.change && (
          <div className={`text-sm font-medium ${getTrendColor(stats.trend || 'stable')}`}>
            {getTrendIcon(stats.trend || 'stable')} {stats.change}
          </div>
        )}
      </div>
      
      <div className="text-white font-bold text-2xl mb-1">{stats.value}</div>
      <div className="text-white font-medium text-sm mb-1">{stats.label}</div>
      {stats.description && (
        <div className="text-white/60 text-xs">{stats.description}</div>
      )}
    </motion.div>
  );
};