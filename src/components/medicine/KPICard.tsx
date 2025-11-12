// /src/components/demo/medicine/KPICard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveCard } from './InteractiveCard';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export function KPICard({ title, value, change, icon, trend, color = 'blue' }: KPICardProps) {
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
    <InteractiveCard className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-white/60 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-2">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
              <span>{getTrendIcon()}</span>
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg">
          {icon}
        </div>
      </div>
    </InteractiveCard>
  );
}