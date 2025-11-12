import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBellProps {
  count: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ count }) => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    { id: 1, message: 'Новое сообщение от куратора', time: '2 мин назад', read: false },
    { id: 2, message: 'Заявка одобрена', time: '1 час назад', read: false },
    { id: 3, message: 'Напоминание о консультации', time: '2 часа назад', read: true }
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
      >
        <span className="text-lg">🔔</span>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold border-2 border-slate-800"
          >
            {count}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Notifications panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-full right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Уведомления</h3>
                  <span className="text-white/60 text-sm">{count} новых</span>
                </div>
              </div>

              {/* Notifications list */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer ${
                      notification.read ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.read ? 'bg-white/30' : 'bg-blue-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm mb-1">{notification.message}</div>
                        <div className="text-white/40 text-xs">{notification.time}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-white/10">
                <button className="w-full text-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                  Показать все
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};