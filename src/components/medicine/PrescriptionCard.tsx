// /src/components/medicine/PrescriptionCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  doctor: string;
  prescribedDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface PrescriptionCardProps {
  prescription: Prescription;
}

export function PrescriptionCard({ prescription }: PrescriptionCardProps) {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-white">{prescription.medication}</div>
          <div className="text-white/60 text-sm">{prescription.dosage}</div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs ${
          prescription.status === 'active' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        }`}>
          {prescription.status === 'active' ? 'Активно' : 'Завершено'}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="text-white/60">
          {prescription.frequency} • {prescription.doctor}
        </div>
        <motion.span
          className="opacity-0 group-hover:opacity-100 text-green-400 transition-opacity"
        >
          💊
        </motion.span>
      </div>
    </motion.div>
  );
}