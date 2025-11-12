import React from 'react';
import { motion } from 'framer-motion';
import { Consultation } from '@/app/demo/social/user/demo-data';

interface ConsultationCardProps {
  consultation: Consultation;
  compact?: boolean;
}

export const ConsultationCard: React.FC<ConsultationCardProps> = ({ 
  consultation, 
  compact = false 
}) => {
  const statusColors = {
    scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const typeIcons = {
    online: '💻',
    offline: '🏢'
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <span className="text-sm">{typeIcons[consultation.type]}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-white text-sm truncate">
                {consultation.manager}
              </span>
              {consultation.isUrgent && (
                <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                  Срочно
                </span>
              )}
            </div>
            <div className="text-white/60 text-xs truncate">
              {consultation.date} • {consultation.time}
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs border ${statusColors[consultation.status]}`}>
            {consultation.status === 'scheduled' && 'Запланирована'}
            {consultation.status === 'in-progress' && 'В процессе'}
            {consultation.status === 'completed' && 'Завершена'}
            {consultation.status === 'cancelled' && 'Отменена'}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
            <span className="text-lg">{consultation.managerAvatar || '👤'}</span>
          </div>
          <div>
            <div className="font-semibold text-white">{consultation.manager}</div>
            <div className="text-white/60 text-sm">{consultation.topic}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {consultation.isUrgent && (
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
              Срочно
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[consultation.status]}`}>
            {consultation.status === 'scheduled' && 'Запланирована'}
            {consultation.status === 'in-progress' && 'В процессе'}
            {consultation.status === 'completed' && 'Завершена'}
            {consultation.status === 'cancelled' && 'Отменена'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-white/60">
          <div className="flex items-center gap-1">
            <span>{typeIcons[consultation.type]}</span>
            <span>
              {consultation.type === 'online' ? 'Онлайн' : 'Личная встреча'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>🕒</span>
            <span>{consultation.duration}</span>
          </div>
        </div>
        
        <div className="text-white font-medium">
          {consultation.date} • {consultation.time}
        </div>
      </div>

      {/* Hover action indicator */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <motion.div
          initial={{ x: 10 }}
          whileHover={{ x: 0 }}
          className="text-blue-400 text-lg"
        >
          →
        </motion.div>
      </div>
    </motion.div>
  );
};