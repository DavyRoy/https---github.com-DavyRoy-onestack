'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const emergencyContacts = [
    { name: 'Скорая помощь', number: '103', description: 'Медицинская помощь' },
    { name: 'Единый номер', number: '112', description: 'Экстренные службы' },
    { name: 'Психологическая помощь', number: '8-800-2000-122', description: 'Круглосуточно' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-3xl p-6 max-w-md w-full backdrop-blur-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                🚑
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Экстренная помощь</h3>
              <p className="text-white/60 text-sm">
                Выберите службу для вызова. Будьте готовы сообщить адрес и симптомы.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {emergencyContacts.map((contact, index) => (
                <motion.button
                  key={index}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open(`tel:${contact.number}`)}
                >
                  <div className="text-left">
                    <div className="text-white font-semibold">{contact.name}</div>
                    <div className="text-white/60 text-sm">{contact.description}</div>
                  </div>
                  <div className="text-red-400 font-bold text-lg">{contact.number}</div>
                </motion.button>
              ))}
            </div>

            <div className="text-center text-white/40 text-xs mb-4">
              В экстренных случаях немедленно обращайтесь за помощью
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200 text-white font-medium"
            >
              Закрыть
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};