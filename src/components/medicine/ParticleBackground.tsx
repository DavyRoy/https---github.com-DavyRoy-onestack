// /src/components/medicine/ParticleBackground.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  width: number;
  height: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Generate particles only on client side
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 20,
      duration: Math.random() * 20 + 20,
    }));
    
    setParticles(generatedParticles);
  }, []);

  // Don't render anything during SSR or before mount
  if (!isMounted) {
    return (
      <div className="absolute inset-0 opacity-30">
        {/* Static fallback for SSR */}
        <div className="absolute rounded-full bg-blue-500/20" 
          style={{
            width: '3px',
            height: '3px',
            left: '50%',
            top: '50%',
          }} 
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 opacity-30">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-500/20"
          style={{
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -20, -40, -20, 0],
            x: [0, 10, -5, -10, 0],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.3, 0.5, 0.3, 0.1, 0.3],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}