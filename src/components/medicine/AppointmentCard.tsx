// /src/components/medicine/AppointmentCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  type: 'online' | 'offline';
}

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждена';
      case 'pending': return 'Ожидание';
      case 'cancelled': return 'Отменена';
      default: return 'Неизвестно';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-white text-lg">{appointment.doctor}</div>
          <div className="text-white/60 text-sm">{appointment.specialty}</div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(appointment.status)}`}>
          {getStatusText(appointment.status)}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="text-white/80">
          {appointment.date} в {appointment.time}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-lg text-xs ${
            appointment.type === 'online' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'bg-purple-500/20 text-purple-400'
          }`}>
            {appointment.type === 'online' ? '📞 Онлайн' : '🏥 В клинике'}
          </span>
          <motion.span
            className="opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity"
            whileHover={{ x: 3 }}
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}