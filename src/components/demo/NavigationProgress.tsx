'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function NavigationProgress() {
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    const onScroll = () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateProgress);

    updateProgress(); // начальное значение

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateProgress);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 sm:h-[3px] bg-transparent z-[60]">
      {/* Фон-градиент (мягкий шлейф) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-sm" />

      {/* Основная линия прогресса */}
      <div
        className="relative h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 shadow-[0_0_10px_rgba(56,189,248,0.4)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />

      {/* Тонкая светоотражающая полоска */}
      <div
        className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-cyan-300/70 to-transparent blur-[1px]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}