import React from 'react';
import { motion } from 'framer-motion';

interface SocialMetricProps {
  id: string;
  label: string;
  value: string;
  change: number;
  icon: string;
  description: string;
  compact?: boolean;
}

export const SocialMetric: React.FC<SocialMetricProps> = ({ 
  label,
  value,
  change,
  icon,
  description,
  compact = false 
}) => {
  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm">{icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm mb-1">{value}</div>
            <div className="text-white/60 text-xs truncate">{label}</div>
          </div>
          {change !== 0 && (
            <div className={`text-xs font-medium ${
              change > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-white/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <span className="text-lg">{icon}</span>
        </div>
        {change !== 0 && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
            change > 0 
              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-white font-medium text-sm mb-1">{label}</div>
      <div className="text-white/60 text-xs">{description}</div>
    </motion.div>
  );
};

// Export default for easier imports
export default SocialMetric;