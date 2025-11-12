// /src/components/demo/InteractiveCard.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function InteractiveCard({ children, className = '', onClick }: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`
        relative rounded-2xl bg-white/5 border border-white/10 
        backdrop-blur-sm overflow-hidden
        ${className}
      `}
      whileHover={{ 
        scale: 1.02,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(255,255,255,0.08)'
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Анимированный градиентный оверлей */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Светящаяся граница */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-green-500/20 opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}