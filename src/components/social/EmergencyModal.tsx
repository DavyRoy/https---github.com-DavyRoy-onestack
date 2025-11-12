import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmergencyCall: (number: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onEmergencyCall
}) => {
  const emergencyNumbers = [
    { name: 'Экстренная служба', number: '112', description: 'Единый номер экстренных служб' },
    { name: 'Социальная служба', number: '8-800-555-00-00', description: 'Круглосуточная социальная поддержка' },
    { name: 'Психологическая помощь', number: '8-800-200-01-02', description: 'Бесплатная психологическая помощь' },
    { name: 'Ваш куратор', number: '+7-XXX-XXX-XX-XX', description: 'Персональный куратор Мария' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <span className="text-xl">🆘</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Экстренная помощь</h2>
                    <p className="text-white/60 text-sm">Выберите службу для вызова</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-3">
                  {emergencyNumbers.map((service, index) => (
                    <motion.button
                      key={service.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => onEmergencyCall(service.number)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">📞</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-white">{service.name}</div>
                        <div className="text-white/60 text-sm">{service.description}</div>
                      </div>
                      <div className="text-red-400 font-mono font-bold text-lg group-hover:scale-110 transition-transform">
                        {service.number}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="text-center text-white/60 text-sm">
                    В экстренной ситуации сохраняйте спокойствие
                  </div>
                </div>
              </div>

              {/* Close button */}
              <div className="p-4 border-t border-white/10">
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white font-medium transition-all duration-200"
                >
                  Отмена
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};