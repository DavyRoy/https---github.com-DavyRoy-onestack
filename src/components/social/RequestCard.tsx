import React from 'react';
import { motion } from 'framer-motion';
import { Request } from '@/app/demo/social/user/demo-data';

interface RequestCardProps {
  request: Request;
  compact?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, compact = false }) => {
  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'in-progress': 'bg-green-500/20 text-green-400 border-green-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const typeIcons = {
    material: '🛍️',
    consultation: '💬',
    volunteer: '🤝',
    other: '❓'
  };

  const priorityColors = {
    low: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-red-500/20 text-red-400'
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
              <span className="text-sm">{typeIcons[request.type]}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-white text-sm truncate">
                {request.title}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${priorityColors[request.priority]}`}>
                {request.priority === 'high' && 'Высокий'}
                {request.priority === 'medium' && 'Средний'}
                {request.priority === 'low' && 'Низкий'}
              </span>
            </div>
            <div className="text-white/60 text-xs truncate">
              {request.manager} • {request.date}
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs border ${statusColors[request.status]}`}>
            {request.status === 'pending' && 'На рассмотрении'}
            {request.status === 'approved' && 'Одобрена'}
            {request.status === 'in-progress' && 'В работе'}
            {request.status === 'completed' && 'Выполнена'}
            {request.status === 'rejected' && 'Отклонена'}
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
            <span className="text-lg">{typeIcons[request.type]}</span>
          </div>
          <div>
            <div className="font-semibold text-white">{request.title}</div>
            <div className="text-white/60 text-sm">{request.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[request.priority]}`}>
            {request.priority === 'high' && 'Высокий'}
            {request.priority === 'medium' && 'Средний'}
            {request.priority === 'low' && 'Низкий'}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[request.status]}`}>
            {request.status === 'pending' && 'На рассмотрении'}
            {request.status === 'approved' && 'Одобрена'}
            {request.status === 'in-progress' && 'В работе'}
            {request.status === 'completed' && 'Выполнена'}
            {request.status === 'rejected' && 'Отклонена'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-white/60">
        <div className="flex items-center gap-1">
          <span>👤</span>
          <span>{request.manager}</span>
        </div>
        <div className="text-white font-medium">
          {request.date}
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