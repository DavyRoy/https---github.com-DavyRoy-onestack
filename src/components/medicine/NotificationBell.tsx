'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBellProps {
  count?: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ count = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">🔔</span>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-white/10 rounded-2xl shadow-xl z-50"
          >
            <div className="p-4 border-b border-white/10">
              <div className="font-semibold text-white">Уведомления</div>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
              {count === 0 ? (
                <div className="text-center py-8 text-white/60 text-sm">
                  Нет новых уведомлений
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Notification items would go here */}
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="text-white text-sm font-medium">Напоминание о приёме</div>
                    <div className="text-white/60 text-xs mt-1">Завтра в 14:30 у кардиолога</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};