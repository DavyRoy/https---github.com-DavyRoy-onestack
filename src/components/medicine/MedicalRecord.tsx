// /src/components/medicine/MedicalRecord.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MedicalRecord {
  id: string;
  type: 'allergy' | 'diagnosis' | 'procedure' | 'vaccination' | 'note';
  title: string;
  description: string;
  date: string;
  doctor: string;
  specialty: string;
  status: 'active' | 'resolved' | 'chronic';
  severity?: 'low' | 'medium' | 'high';
  medications?: string[];
  attachments?: string[];
}

interface MedicalRecordProps {
  record: MedicalRecord;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function MedicalRecord({ record, isExpanded = false, onToggle }: MedicalRecordProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'allergy': return '⚠️';
      case 'diagnosis': return '🏥';
      case 'procedure': return '🔬';
      case 'vaccination': return '💉';
      case 'note': return '📝';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'resolved': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'chronic': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активно';
      case 'resolved': return 'Вылечено';
      case 'chronic': return 'Хроническое';
      default: return 'Неизвестно';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-orange-400 bg-orange-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <motion.div
      layout
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
      whileHover={{ y: -2 }}
      onClick={onToggle}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-lg flex-shrink-0">
              {getTypeIcon(record.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-lg mb-1">{record.title}</h3>
              <p className="text-white/60 text-sm mb-2">{record.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(record.status)}`}>
                  {getStatusText(record.status)}
                </span>
                {record.severity && (
                  <span className={`px-2 py-1 rounded-lg text-xs ${getSeverityColor(record.severity)}`}>
                    {record.severity === 'high' ? 'Высокая' : 
                     record.severity === 'medium' ? 'Средняя' : 'Низкая'} важность
                  </span>
                )}
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-white/60 text-lg"
          >
            ▼
          </motion.div>
        </div>

        <div className="flex items-center justify-between text-sm text-white/60">
          <div className="flex items-center gap-4">
            <span>👨‍⚕️ {record.doctor}</span>
            <span>📅 {record.date}</span>
          </div>
          <span>{record.specialty}</span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10 bg-white/5"
          >
            <div className="p-6">
              {/* Medications */}
              {record.medications && record.medications.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-white mb-2">💊 Назначенные препараты</h4>
                  <div className="flex flex-wrap gap-2">
                    {record.medications.map((med, index) => (
                      <span key={index} className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-sm">
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {record.attachments && record.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium text-white mb-2">📎 Прикрепленные файлы</h4>
                  <div className="space-y-2">
                    {record.attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-lg">📄</span>
                        <div className="flex-1">
                          <div className="text-white text-sm">{file}</div>
                          <div className="text-white/40 text-xs">PDF • 2.4 MB</div>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                          <span className="text-lg">📥</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 transition-all duration-200 text-blue-400 text-sm">
                  <span>📋</span>
                  <span>Полная история</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-white text-sm">
                  <span>🖨️</span>
                  <span>Распечатать</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-white text-sm">
                  <span>📤</span>
                  <span>Экспорт</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}