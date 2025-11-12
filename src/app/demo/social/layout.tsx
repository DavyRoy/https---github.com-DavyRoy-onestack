// src/app/demo/social/layout.tsx
'use client';

import React from 'react';
import { Metadata } from 'next';


interface SocialLayoutProps {
  children: React.ReactNode;
}

// Анимированный фон компонент
function AnimatedBackground() {
  return (
    <>
      {/* Основной градиентный фон */}
      <div className="fixed inset-0 -z-30 bg-gradient-to-br from-black via-slate-950/95 to-purple-950/90" />
      
      {/* Анимированные градиентные сферы */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        {/* Большая сфера - верхний левый угол */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Средняя сфера - нижний правый угол */}
        <div className="absolute -bottom-48 -right-48 w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/10 rounded-full blur-3xl animate-pulse-slower" />
        
        {/* Малая сфера - центр */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-emerald-500/5 rounded-full blur-3xl animate-pulse-delayed" />
      </div>

      {/* Particle эффекты */}
      <div className="fixed inset-0 -z-10 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float">
          <div className="absolute inset-0 bg-white rounded-full animate-ping" />
        </div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-blue-400 rounded-full animate-float-delayed">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping" />
        </div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float-slow">
          <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping" />
        </div>
      </div>

      {/* Grid Overlay с анимацией */}
      <div 
        className="fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(120, 119, 198, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(120, 119, 198, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        }}
      />

      {/* Анимированные линии */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-shimmer-delayed" />
      </div>

      {/* Noise текстура */}
      <div 
        className="fixed inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}

// Navigation Progress Bar
function NavigationProgress() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-pulse">
      <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
    </div>
  );
}

export default function SocialLayout({ children }: SocialLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white antialiased overflow-x-hidden">
      <AnimatedBackground />
      <NavigationProgress />
      
      {/* Main Content */}
      <main className="relative min-h-screen">
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Global Styles для анимаций */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(45deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.02); }
        }
        
        @keyframes pulse-delayed {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.03); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .animate-shimmer-delayed {
          animation: shimmer 4s ease-in-out 1s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
        
        .animate-pulse-delayed {
          animation: pulse-delayed 10s ease-in-out 2s infinite;
        }

        /* Улучшенная плавность скролла */
        html {
          scroll-behavior: smooth;
        }

        /* Убираем подсветку тапов на мобильных */
        @media (max-width: 768px) {
          * {
            -webkit-tap-highlight-color: transparent;
          }
        }

        /* Улучшаем рендеринг шрифтов */
        body {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Кастомный скроллбар */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }

        /* Оптимизация для мобильных устройств */
        @media (max-width: 393px) {
          .fixed.inset-0.-z-20.overflow-hidden > div {
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}