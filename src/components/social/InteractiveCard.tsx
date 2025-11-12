import React from 'react';
import { motion } from 'framer-motion';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({ 
  children, 
  className = '',
  onClick 
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        bg-white/5 backdrop-blur-sm border border-white/10 
        rounded-xl transition-all duration-300
        hover:border-white/20 hover:bg-white/10
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};