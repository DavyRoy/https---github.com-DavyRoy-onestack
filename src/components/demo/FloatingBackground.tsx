'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function FloatingBackground() {
  const reduced = useReducedMotion();

  if (reduced) return null; // уважение к пользователю с ограничением анимации

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* ======= Градиентные шары ======= */}
      <motion.div
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl"
        animate={{ 
          y: [0, 40, 0], 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl"
        animate={{ 
          y: [0, -30, 0], 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.07, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ 
          y: [0, 60, 0], 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* ======= Мягкий центральный свет ======= */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent opacity-50" />

      {/* ======= Сканирующие линии ======= */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ y: ['100%', '0%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 2 }}
        />
      </div>

      {/* ======= Сетка ======= */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '3rem 3rem',
        }}
      />
    </div>
  );
}