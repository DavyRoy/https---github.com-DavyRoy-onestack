'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false);

  // Отслеживаем положение прокрутки
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Прокрутка к верху
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="scroll-top"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50"
        >
          <button
            onClick={scrollToTop}
            className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 hover:scale-110"
            aria-label="Вернуться к началу страницы"
          >
            {/* Иконка стрелки */}
            <svg
              className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M5 15l7-7 7 7" />
            </svg>

            {/* Светящийся эффект при hover */}
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-t from-cyan-500/20 to-blue-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 pointer-events-none" />

            {/* Контурный эффект */}
            <span className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/20 transition-colors duration-300" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}