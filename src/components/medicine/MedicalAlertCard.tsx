// /src/components/medicine/MedicalAlertCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface MedicalAlertProps {
  alert: {
    id: string;
    type: 'allergy' | 'lab' | 'medication' | 'critical';
    patientName: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    time: string;
  };
}

const getAlertConfig = (type: string, priority: string) => {
  const configs = {
    allergy: {
      icon: '⚠️',
      color: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400'
    },
    lab: {
      icon: '🔬',
      color: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400'
    },
    medication: {
      icon: '💊',
      color: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400'
    },
    critical: {
      icon: '🚨',
      color: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400'
    }
  };

  return configs[type as keyof typeof configs] || configs.critical;
};

const getPriorityBadge = (priority: string) => {
  const badges = {
    high: { label: 'Высокий', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    medium: { label: 'Средний', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    low: { label: 'Низкий', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
  };
  return badges[priority as keyof typeof badges] || badges.medium;
};

export const MedicalAlertCard: React.FC<MedicalAlertProps> = ({ alert }) => {
  const config = getAlertConfig(alert.type, alert.priority);
  const priorityBadge = getPriorityBadge(alert.priority);

  return (
    <motion.div
      className={`p-4 rounded-2xl border ${config.borderColor} ${config.color} hover:shadow-lg transition-all duration-300 cursor-pointer`}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center text-lg flex-shrink-0`}>
          {config.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-sm ${config.textColor}`}>
              {alert.message}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs border ${priorityBadge.color}`}>
              {priorityBadge.label}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">{alert.patientName}</p>
              <p className="text-white/60 text-xs">{alert.time}</p>
            </div>
            
            <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-medium transition-colors">
              Решить
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};