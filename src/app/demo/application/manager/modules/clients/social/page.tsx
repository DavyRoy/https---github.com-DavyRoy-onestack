'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Цветовая палитра
const COLORS = {
  primary: 'from-gray-950 via-black to-gray-900',
  secondary: 'from-purple-900 via-black to-blue-900',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  purple: '147, 51, 234',
  orange: '249, 115, 22',
  blue: '59, 130, 246',
  cyan: '34, 211, 238',
  gray: '156, 163, 175',
  emerald: '16, 185, 129',
  rose: '244, 63, 94',
  indigo: '99, 102, 241',
  teal: '20, 184, 166',
  amber: '245, 158, 11',
  violet: '139, 92, 246',
  fuchsia: '217, 70, 239',
  sky: '14, 165, 233',
  lime: '132, 204, 22',
  pink: '236, 72, 153',
  yellow: '234, 179, 8'
} as const;

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

// Хук для адаптивности
const useResponsive = () => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width <= MOBILE_BREAKPOINT) {
        setDevice('mobile');
      } else if (width <= TABLET_BREAKPOINT) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return device;
};

// Улучшенный ProgressBar с анимацией
const ProgressBar = ({
  value,
  max = 100,
  color = '#3B82F6',
  label = '',
  showLabel = true,
  height = '8px',
  animated = true,
  showValue = false
}: {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showLabel?: boolean;
  height?: string;
  animated?: boolean;
  showValue?: boolean;
}) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  
  return (
    <div className="w-full">
      {(showLabel && label) || showValue ? (
        <div className="flex justify-between text-white text-[11px] sm:text-xs mb-1.5">
          {showLabel && <span>{label}</span>}
          {showValue && <span>{Math.round(percentage)}%</span>}
        </div>
      ) : null}
      <div className="w-full bg-white/8 rounded-full overflow-hidden" style={{ height }}>
        <motion.div
          className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}60`
          }}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

// Улучшенная круговая диаграмма
const PieChart = ({
  data,
  className = '',
  size = 100,
  strokeWidth = 20,
  showLegend = false
}: {
  data: { name: string; value: number; color: string }[];
  className?: string;
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -accumulated * (circumference / 100);
            accumulated += percentage;

            return (
              <motion.circle
                key={item.name}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                initial={{ 
                  strokeDashoffset: -accumulated * (circumference / 100) + (percentage / 100) * circumference, 
                  strokeDasharray: `0 ${circumference}` 
                }}
                animate={{ strokeDashoffset, strokeDasharray }}
                transition={{ 
                  duration: 1.2, 
                  delay: index * 0.15,
                  ease: "easeOut"
                }}
                style={{
                  filter: `drop-shadow(0 0 6px ${item.color}80)`
                }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center transform rotate-90">
            <div className="text-white font-bold text-sm sm:text-base">{total}%</div>
            <div className="text-white/60 text-[10px] sm:text-xs mt-0.5">Всего</div>
          </div>
        </div>
      </div>
      
      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-2 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-white/80">{item.name}</span>
              <span className="text-white/60 ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Компонент статистической карточки
const StatCard = ({
  title,
  value,
  change,
  trend,
  icon,
  color,
  delay = 0
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
  delay?: number;
}) => {
  const device = useResponsive();
  const isMobile = device === 'mobile';

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 text-center group"
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: 0.12 * delay + 0.22,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        y: isMobile ? 0 : -4,
        scale: isMobile ? 1 : 1.02,
        transition: { type: 'spring', stiffness: 280 }
      }}
    >
      <motion.div
        className="text-lg sm:text-xl mb-2"
        whileHover={!isMobile ? { scale: 1.08, rotate: 6 } : {}}
        transition={{ type: 'spring', stiffness: 320 }}
      >
        {icon}
      </motion.div>
      <div className="text-white font-semibold text-base sm:text-lg mb-1">
        {value}
      </div>
      <div className="text-white/65 text-xs sm:text-sm mb-1">{title}</div>
      <div
        className={`text-[10px] sm:text-[11px] font-medium ${
          trend === 'up'
            ? 'text-emerald-400'
            : trend === 'down'
            ? 'text-rose-400'
            : 'text-sky-400'
        }`}
      >
        {change} {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
      </div>
      
      {/* Анимированный фон */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`
        }}
        animate={{
          background: [
            `radial-gradient(circle at 30% 20%, ${color}15 0%, transparent 70%)`,
            `radial-gradient(circle at 70% 80%, ${color}15 0%, transparent 70%)`,
            `radial-gradient(circle at 30% 20%, ${color}15 0%, transparent 70%)`
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.div>
  );
};

// Улучшенная карточка гражданина
const CitizenCard = ({
  citizen,
  index,
  onCitizenClick,
  viewMode = 'grid'
}: {
  citizen: any;
  index: number;
  onCitizenClick?: (citizen: any) => void;
  viewMode?: 'grid' | 'list';
}) => {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isListMode = viewMode === 'list';

  const getGradient = (name: string) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-emerald-500 to-cyan-600',
      'from-orange-500 to-red-500',
      'from-violet-500 to-purple-600',
      'from-cyan-500 to-blue-600',
      'from-rose-500 to-pink-600'
    ];
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'bg-emerald-400', text: '', label: 'active' };
      case 'pending':
        return { color: 'bg-amber-400', text: '', label: 'pending' };
      case 'inactive':
        return { color: 'bg-blue-400', text: '', label: 'inactive' };
      default:
        return { color: 'bg-gray-400', text: '', label: 'unknown' };
    }
  };

  const statusInfo = getStatusInfo(citizen.status);

  if (isListMode) {
    return (
      <motion.div
        className="relative bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer backdrop-blur-sm flex items-center gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          delay: index * 0.05,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        whileHover={!isMobile ? { 
          x: 4, 
          backgroundColor: "rgba(255,255,255,0.08)",
          transition: { type: 'spring', stiffness: 400, damping: 25 } 
        } : {}}
        whileTap={{ scale: 0.98 }}
        onClick={() => onCitizenClick?.(citizen)}
      >
        <motion.div
          className={`w-14 h-14 rounded-full bg-gradient-to-r ${getGradient(citizen.name)} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-lg`}
          whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {citizen.initials}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-base group-hover:text-blue-300 transition-colors truncate">
                {citizen.name}
              </div>
              <div className="text-white/60 text-sm mt-1">
                {citizen.age} лет • {citizen.city} • {citizen.category}
              </div>
            </div>
            
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                <div className="text-white/60 text-sm hidden sm:block">
                  {citizen.lastActivity}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-white/70">
                Услуг: <span className="text-white font-medium">{citizen.servicesReceived}</span>
              </div>
              <div className="text-white/70">
                Удовлетворенность: <span className="text-white font-medium">{citizen.satisfaction}%</span>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <ProgressBar
                value={citizen.satisfaction}
                color={citizen.color}
                height="6px"
                showLabel={false}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {citizen.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
              <motion.span
                key={tagIndex}
                className="text-xs bg-white/8 px-2.5 py-1 rounded-full border border-white/15 text-white/80 group-hover:bg-white/14 transition-colors"
                whileHover={!isMobile ? { scale: 1.05 } : {}}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    );
  }

  // Grid mode
  return (
    <motion.div
      className="relative bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer backdrop-blur-sm flex flex-col h-full"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.08,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={!isMobile ? { 
        y: -6, 
        scale: 1.02, 
        transition: { type: 'spring', stiffness: 400, damping: 25 } 
      } : {}}
      whileTap={{ scale: 0.97 }}
      onClick={() => onCitizenClick?.(citizen)}
    >
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
        <span className="text-white/60 text-[10px] hidden sm:inline">
          {statusInfo.text}
        </span>
      </div>

      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <motion.div
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${getGradient(citizen.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}
            whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {citizen.initials}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors truncate">
              {citizen.name}
            </div>
            <div className="text-white/60 text-xs">
              {citizen.age} лет • {citizen.city}
            </div>
            <div className="text-white/50 text-[11px] mt-1">
              {citizen.category}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4 flex-1">
        <div className="flex justify-between items-center text-white text-[11px]">
          <span className="text-white/60">Получено услуг</span>
          <span className="font-medium bg-white/10 px-2 py-1 rounded-full">
            {citizen.servicesReceived}
          </span>
        </div>
        <ProgressBar
          value={citizen.satisfaction}
          label="Удовлетворенность"
          color={citizen.color}
          height="6px"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-white/60 mb-3">
        <span>Последняя активность</span>
        <span className="font-medium text-white/70">{citizen.lastActivity}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {citizen.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
          <motion.span
            key={tagIndex}
            className="text-[10px] bg-white/8 px-2 py-1 rounded-full border border-white/15 text-white/80 group-hover:bg-white/14 transition-colors truncate max-w-[80px]"
            whileHover={!isMobile ? { scale: 1.05 } : {}}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {tag}
          </motion.span>
        ))}
        {citizen.tags.length > 3 && (
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full border border-white/10 text-white/60">
            +{citizen.tags.length - 3}
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

// Улучшенная карточка категории
const CategoryCard = ({
  category,
  isSelected,
  onClick,
  index
}: {
  category: any;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) => {
  const device = useResponsive();
  const isMobile = device === 'mobile';

  return (
    <motion.div
      className={`flex flex-col justify-between relative aspect-[4/3] min-h-[200px] sm:min-h-[280px] w-full max-w-full px-4 py-4 sm:px-5 sm:py-5 rounded-xl sm:rounded-2xl border font-light overflow-hidden transition-all duration-300 ease-in-out cursor-pointer ${
        isSelected 
          ? 'border-blue-500/40 ring-2 ring-blue-500/20 bg-blue-500/5' 
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 90,
        damping: 16
      }}
      whileHover={!isMobile ? { 
        y: -4, 
        scale: 1.02,
        transition: { type: 'spring', stiffness: 350, damping: 22 }
      } : {}}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-2 mb-3 text-white z-10">
        <motion.span
          className="text-[11px] sm:text-xs bg-white/10 px-2.5 sm:px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm"
          style={{ color: `rgb(${category.glowColor})` }}
          whileHover={{ scale: 1.05 }}
        >
          {category.value} {category.metric}
        </motion.span>
        {isSelected && (
          <motion.div
            className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-1 border border-blue-500/40 text-[11px] text-blue-300"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420 }}
          >
            <motion.span 
              className="w-1.5 h-1.5 rounded-full bg-blue-300"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>Выбрано</span>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col relative text-white z-10 flex-1">
        <motion.h3 
          className="font-semibold text-[15px] sm:text-[17px] mb-1.5 sm:mb-2"
          whileHover={{ x: 2 }}
        >
          {category.title}
        </motion.h3>
        <p className="text-white/70 text-xs sm:text-[13px] leading-4 sm:leading-5 mb-3 sm:mb-4 flex-1">
          {category.description}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
          {[
            { value: category.avgSatisfaction, label: 'Удовлетворенность', color: 'text-white' },
            { value: category.servicesPerCitizen, label: 'Услуг на человека', color: 'text-amber-300' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="text-center p-1.5 sm:p-2.5 bg-white/6 rounded-lg backdrop-blur-sm border border-white/8"
              whileHover={{ scale: 1.03, y: -1 }}
            >
              <div className={`font-semibold text-xs sm:text-sm ${item.color}`}>
                {item.value}{typeof item.value === 'number' ? '%' : ''}
              </div>
              <div className="text-white/60 text-[11px]">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <ProgressBar
          value={category.avgSatisfaction}
          label="Общая удовлетворенность"
          color={`rgb(${category.glowColor})`}
          showLabel
          height="6px"
        />

        <div className="mt-3 sm:mt-3.5">
          <div className="text-white/60 text-[11px] mb-1.5">Основные категории</div>
          <div className="flex flex-wrap gap-1.5">
            {category.popularCategories
              .slice(0, isMobile ? 2 : 3)
              .map((catName: string, catIndex: number) => (
                <motion.span
                  key={catIndex}
                  className="text-[11px] bg-white/10 px-2 py-1 rounded-full border border-white/20 text-white/80"
                  whileHover={!isMobile ? { scale: 1.04 } : {}}
                  transition={{ type: 'spring', stiffness: 380 }}
                >
                  {catName}
                </motion.span>
              ))}
            {category.popularCategories.length > (isMobile ? 2 : 3) && (
              <span className="text-[11px] bg-white/6 px-2 py-1 rounded-full border border-white/16 text-white/60">
                +{category.popularCategories.length - (isMobile ? 2 : 3)}
              </span>
            )}
          </div>
        </div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 70% 10%, rgba(${category.glowColor}, 0.35) 0%, transparent 60%)`
        }}
        animate={{
          background: [
            `radial-gradient(circle at 70% 10%, rgba(${category.glowColor}, 0.35) 0%, transparent 60%)`,
            `radial-gradient(circle at 30% 80%, rgba(${category.glowColor}, 0.35) 0%, transparent 60%)`,
            `radial-gradient(circle at 70% 10%, rgba(${category.glowColor}, 0.35) 0%, transparent 60%)`
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

// Улучшенный компонент фильтров
const FiltersSection = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onAddCitizen,
  onGenerateReport,
  viewMode,
  setViewMode,
  onShowAnalytics
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  onAddCitizen: () => void;
  onGenerateReport: () => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onShowAnalytics: () => void;
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const device = useResponsive();
  const isMobile = device === 'mobile';
  
  return (
    <motion.div 
      className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
    >
      <div className="flex gap-3 w-full sm:w-auto flex-wrap">
        <motion.button
          onClick={onShowAnalytics}
          className="px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>📊</span>
          <span className={isMobile ? 'hidden sm:inline' : 'inline'}>Аналитика</span>
        </motion.button>

        <motion.button
          onClick={onAddCitizen}
          className="flex-1 sm:flex-initial px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 backdrop-blur-sm"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            +
          </motion.span>
          <span>{isMobile ? 'Добавить' : 'Добавить гражданина'}</span>
        </motion.button>
        
        <motion.button
          onClick={onGenerateReport}
          className="px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            📋
          </motion.span>
          <span className={isMobile ? 'hidden sm:inline' : 'inline'}>Отчет</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Модальное окно добавления гражданина
const AddCitizenModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    category: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Обработка добавления гражданина
    console.log('Добавление гражданина:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <motion.h3 
              className="text-white font-semibold text-xl"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Добавить нового гражданина
            </motion.h3>
            <motion.button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">ФИО</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Иванов Иван Иванович"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Возраст</label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="45"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Город</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Москва"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Категория</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="">Выберите категорию</option>
                  <option value="pensioner">Пенсионер</option>
                  <option value="disabled">Инвалид</option>
                  <option value="family">Многодетная семья</option>
                  <option value="veteran">Ветеран</option>
                  <option value="single">Мать-одиночка</option>
                </select>
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Телефон</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="+7 (900) 123-45-67"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Адрес</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="ул. Ленина, д. 1, кв. 1"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Отмена
              </motion.button>
              <motion.button 
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Добавить гражданина
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Модальное окно аналитики
const AnalyticsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const analyticsData = {
    totalCitizens: 3562,
    activeServices: 12457,
    avgSatisfaction: 87,
    monthlyGrowth: 4.2,
    categoryDistribution: [
      { name: 'Пенсионеры', value: 32, color: `rgba(${COLORS.blue}, 0.9)` },
      { name: 'Инвалиды', value: 28, color: `rgba(${COLORS.purple}, 0.9)` },
      { name: 'Многодетные семьи', value: 18, color: `rgba(${COLORS.emerald}, 0.9)` },
      { name: 'Ветераны', value: 12, color: `rgba(${COLORS.rose}, 0.9)` },
      { name: 'Матери-одиночки', value: 8, color: `rgba(${COLORS.amber}, 0.9)` },
      { name: 'Другие категории', value: 2, color: `rgba(${COLORS.gray}, 0.9)` }
    ],
    monthlyStats: [
      { month: 'Янв', citizens: 3200, services: 11000 },
      { month: 'Фев', citizens: 3320, services: 11500 },
      { month: 'Мар', citizens: 3410, services: 11800 },
      { month: 'Апр', citizens: 3480, services: 12000 },
      { month: 'Май', citizens: 3520, services: 12200 },
      { month: 'Июн', citizens: 3562, services: 12457 }
    ]
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <motion.h3 
              className="text-white font-semibold text-2xl"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              📊 Аналитика базы граждан
            </motion.h3>
            <motion.button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <motion.div 
              className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-white font-semibold text-lg mb-4">Общая статистика</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">{analyticsData.totalCitizens}</div>
                  <div className="text-white/60 text-sm">Всего граждан</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{analyticsData.activeServices}</div>
                  <div className="text-white/60 text-sm">Активных услуг</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400 mb-1">{analyticsData.avgSatisfaction}%</div>
                  <div className="text-white/60 text-sm">Удовлетворенность</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">+{analyticsData.monthlyGrowth}%</div>
                  <div className="text-white/60 text-sm">Рост за месяц</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-white font-semibold text-lg mb-4">Распределение по категориям</h4>
              <PieChart
                data={analyticsData.categoryDistribution}
                size={200}
                showLegend={true}
              />
            </motion.div>
          </div>

          <motion.div 
            className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-white font-semibold text-lg mb-4">Динамика за полгода</h4>
            <div className="space-y-3">
              {analyticsData.monthlyStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white/70 text-sm w-12">{stat.month}</span>
                  <div className="flex-1 mx-4">
                    <ProgressBar
                      value={(stat.citizens / 4000) * 100}
                      color="#3B82F6"
                      height="20px"
                      showLabel={false}
                    />
                  </div>
                  <div className="text-right text-xs text-white/60 w-20">
                    {stat.citizens} чел.
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="flex gap-3 mt-8 pt-6 border-t border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Закрыть
            </motion.button>
            <motion.button 
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Экспорт отчета
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Модальное окно отчета
const ReportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [reportType, setReportType] = useState('full');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <motion.h3 
              className="text-white font-semibold text-xl"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              📋 Генерация отчета
            </motion.h3>
            <motion.button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Тип отчета</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
              >
                <option value="full">Полный отчет</option>
                <option value="monthly">Месячный отчет</option>
                <option value="categories">По категориям</option>
                <option value="services">По услугам</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Период</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                />
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Формат</label>
              <div className="flex gap-3">
                {['PDF', 'Excel', 'CSV'].map((format) => (
                  <motion.label
                    key={format}
                    className="flex-1 text-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm cursor-pointer transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input type="radio" name="format" value={format.toLowerCase()} className="hidden" />
                    {format}
                  </motion.label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
            <motion.button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Отмена
            </motion.button>
            <motion.button 
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Сгенерировать отчет
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Улучшенное модальное окно гражданина
const CitizenModal = ({ citizen, onClose }: { citizen: any; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const device = useResponsive();
  const isMobile = device === 'mobile';
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <motion.h3 
              className="text-white font-semibold text-xl"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Данные гражданина
            </motion.h3>
            <motion.button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>

          <div className="space-y-6">
            <motion.div 
              className="flex flex-col sm:flex-row items-start gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                {citizen.initials}
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-2xl mb-2 truncate">{citizen.name}</h4>
                <div className="text-white/60 text-sm mb-3">
                  {citizen.age} лет • {citizen.city} • {citizen.category}
                </div>
                <div className="flex flex-wrap gap-2">
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    Услуг получено: {citizen.servicesReceived}
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    Удовлетворенность: {citizen.satisfaction}%
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-4">
                <motion.div 
                  className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
                  whileHover={{ y: -2 }}
                >
                  <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>📱</span> Контактная информация
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Телефон', value: citizen.details.phone },
                      { label: 'Адрес', value: citizen.details.address },
                      { label: 'Дата рождения', value: citizen.details.birthDate }
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="text-white/60">{item.label}</div>
                        <div className="text-white">{item.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
                  whileHover={{ y: -2 }}
                >
                  <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>📄</span> Документы
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'СНИЛС', value: citizen.details.snils },
                      { label: 'Дата регистрации', value: citizen.details.registrationDate }
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="text-white/60">{item.label}</div>
                        <div className="text-white">{item.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4">
                <motion.div 
                  className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
                  whileHover={{ y: -2 }}
                >
                  <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>🔄</span> Активность
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Последняя активность', value: citizen.lastActivity },
                      { label: 'Последняя услуга', value: citizen.details.lastService }
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div className="text-white/60">{item.label}</div>
                        <div className="text-white">{item.value}</div>
                      </motion.div>
                    ))}
                    <ProgressBar
                      value={citizen.satisfaction}
                      label="Удовлетворенность услугами"
                      color={citizen.color}
                      showLabel
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
                  whileHover={{ y: -2 }}
                >
                  <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>🏷️</span> Теги и категории
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {citizen.tags.map((tag: string, index: number) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1 bg-white/10 rounded-full text-white text-xs border border-white/20 backdrop-blur-sm"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -2 }}
            >
              <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>📝</span> Примечания
              </h5>
              <div className="text-white text-sm leading-relaxed">
                {citizen.details.notes}
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Закрыть
            </motion.button>
            <motion.button 
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Редактировать данные
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Данные
const citizenCategories = [
  {
    id: 'all',
    title: '👥 Все граждане',
    description: 'Полная база получателей услуг • Все категории • Статистика по всем клиентам',
    value: '3,562',
    metric: 'Всего граждан',
    color: '#060010',
    glowColor: COLORS.blue,
    citizensCount: 3562,
    avgSatisfaction: 87,
    servicesPerCitizen: 3.4,
    growth: '+15%',
    popularCategories: ['Пенсионеры', 'Инвалиды', 'Многодетные', 'Ветераны', 'Матери-одиночки'],
    details: {
      activeClients: 2987,
      newThisMonth: 234,
      avgAge: 56,
      maleFemaleRatio: '41/59',
      totalServices: 12108
    }
  },
  {
    id: 'pensioners',
    title: '👵 Пенсионеры',
    description: 'Граждане пенсионного возраста • Социальное обеспечение • Медицинское обслуживание',
    value: '1,245',
    metric: 'Пенсионеров',
    color: '#060010',
    glowColor: COLORS.purple,
    citizensCount: 1245,
    avgSatisfaction: 92,
    servicesPerCitizen: 4.2,
    growth: '+8%',
    popularCategories: ['Ветераны труда', 'Инвалиды', 'Одинокие пенсионеры'],
    details: {
      activeClients: 1120,
      newThisMonth: 45,
      avgAge: 72,
      maleFemaleRatio: '35/65',
      totalServices: 5229
    }
  },
  {
    id: 'disabled',
    title: '♿ Инвалиды',
    description: 'Граждане с ограниченными возможностями • Реабилитация • Социальная адаптация',
    value: '893',
    metric: 'Инвалидов',
    color: '#060010',
    glowColor: COLORS.emerald,
    citizensCount: 893,
    avgSatisfaction: 85,
    servicesPerCitizen: 5.1,
    growth: '+12%',
    popularCategories: ['I группа', 'II группа', 'Дети-инвалиды'],
    details: {
      activeClients: 845,
      newThisMonth: 23,
      avgAge: 48,
      maleFemaleRatio: '52/48',
      totalServices: 4554
    }
  },
  {
    id: 'families',
    title: '👨‍👩‍👧‍👦 Многодетные',
    description: 'Многодетные семьи • Детские пособия • Жилищные программы • Образование',
    value: '567',
    metric: 'Семей',
    color: '#060010',
    glowColor: COLORS.amber,
    citizensCount: 567,
    avgSatisfaction: 89,
    servicesPerCitizen: 3.8,
    growth: '+18%',
    popularCategories: ['3 детей', '4+ детей', 'Матери-одиночки'],
    details: {
      activeClients: 532,
      newThisMonth: 34,
      avgAge: 36,
      maleFemaleRatio: '42/58',
      totalServices: 2155
    }
  }
];

const citizensData = [
  {
    id: 1,
    name: 'Иванова Мария Петровна',
    initials: 'ИМ',
    age: 72,
    city: 'Москва',
    status: 'active',
    category: 'Пенсионер',
    servicesReceived: 8,
    satisfaction: 95,
    color: '#3B82F6',
    lastActivity: '2 дня назад',
    tags: ['Пенсионер', 'Ветеран труда', 'Социальный патронаж', 'Медобслуживание'],
    details: {
      phone: '+7 (915) 123-45-67',
      address: 'ул. Ленина, д. 15, кв. 42',
      birthDate: '15.03.1952',
      snils: '123-456-789 00',
      registrationDate: '12.01.2020',
      lastService: 'Медицинский осмотр',
      notes: 'Требуется регулярный патронаж. Проживает одна. Нуждается в помощи по хозяйству.'
    }
  },
  {
    id: 2,
    name: 'Петров Иван Сергеевич',
    initials: 'ПИ',
    age: 45,
    city: 'Москва',
    status: 'active',
    category: 'Инвалид II группы',
    servicesReceived: 12,
    satisfaction: 88,
    color: '#8B5CF6',
    lastActivity: '5 дней назад',
    tags: ['Инвалид', 'Реабилитация', 'Юридические услуги', 'Психолог'],
    details: {
      phone: '+7 (916) 234-56-78',
      address: 'пр. Мира, д. 23, кв. 15',
      birthDate: '23.07.1979',
      snils: '234-567-890 11',
      registrationDate: '03.05.2021',
      lastService: 'Психологическая консультация',
      notes: 'Активно участвует в программах реабилитации. Требуется помощь в передвижении по городу.'
    }
  },
  {
    id: 3,
    name: 'Сидорова Анна Владимировна',
    initials: 'СА',
    age: 34,
    city: 'Москва',
    status: 'pending',
    category: 'Многодетная мать',
    servicesReceived: 6,
    satisfaction: 92,
    color: '#10B981',
    lastActivity: 'Вчера',
    tags: ['Многодетная', 'Детские пособия', 'Консультации', 'Материальная помощь'],
    details: {
      phone: '+7 (917) 345-67-89',
      address: 'ул. Пушкина, д. 8, кв. 33',
      birthDate: '11.09.1990',
      snils: '345-678-901 22',
      registrationDate: '15.08.2022',
      lastService: 'Консультация по детским пособиям',
      notes: 'Воспитывает 3 детей. Требуется поддержка с оформлением детских пособий.'
    }
  },
  {
    id: 4,
    name: 'Козлов Дмитрий Николаевич',
    initials: 'КД',
    age: 68,
    city: 'Москва',
    status: 'active',
    category: 'Ветеран боевых действий',
    servicesReceived: 15,
    satisfaction: 90,
    color: '#EF4444',
    lastActivity: 'Неделю назад',
    tags: ['Ветеран', 'Льготник', 'Медобслуживание', 'Социальные услуги'],
    details: {
      phone: '+7 (918) 456-78-90',
      address: 'б-р Рокоссовского, д. 12, кв. 7',
      birthDate: '30.11.1956',
      snils: '456-789-012 33',
      registrationDate: '22.03.2019',
      lastService: 'Юридическая консультация',
      notes: 'Требуется помощь в оформлении документов на дополнительные льготы.'
    }
  },
  {
    id: 5,
    name: 'Николаева Елена Игоревна',
    initials: 'НЕ',
    age: 29,
    city: 'Москва',
    status: 'active',
    category: 'Мать-одиночка',
    servicesReceived: 4,
    satisfaction: 85,
    color: '#F59E0B',
    lastActivity: '3 дня назад',
    tags: ['Мать-одиночка', 'Детские пособия', 'Психолог', 'Консультации'],
    details: {
      phone: '+7 (919) 567-89-01',
      address: 'ул. Тверская, д. 45, кв. 18',
      birthDate: '14.02.1995',
      snils: '567-890-123 44',
      registrationDate: '08.11.2023',
      lastService: 'Психологическая поддержка',
      notes: 'Активно ищет работу, требует помощи с детским садом для ребенка.'
    }
  },
  {
    id: 6,
    name: 'Федоров Сергей Васильевич',
    initials: 'ФС',
    age: 55,
    city: 'Москва',
    status: 'inactive',
    category: 'Инвалид I группы',
    servicesReceived: 20,
    satisfaction: 94,
    color: '#EC4899',
    lastActivity: '2 недели назад',
    tags: ['Инвалид', 'Реабилитация', 'Медобслуживание', 'Социальный патронаж'],
    details: {
      phone: '+7 (920) 678-90-12',
      address: 'пр. Вернадского, д. 78, кв. 25',
      birthDate: '05.08.1969',
      snils: '678-901-234 55',
      registrationDate: '17.06.2018',
      lastService: 'Медицинский патронаж',
      notes: 'Тяжелое состояние, требуется постоянный уход.'
    }
  },
  {
    id: 7,
    name: 'Орлова Татьяна Сергеевна',
    initials: 'ОТ',
    age: 61,
    city: 'Подольск',
    status: 'active',
    category: 'Пенсионер',
    servicesReceived: 5,
    satisfaction: 89,
    color: '#06B6D4',
    lastActivity: 'Сегодня',
    tags: ['Пенсионер', 'Социальные услуги', 'Консультации'],
    details: {
      phone: '+7 (921) 111-22-33',
      address: 'ул. Южная, д. 5',
      birthDate: '10.01.1963',
      snils: '789-012-345 66',
      registrationDate: '01.03.2022',
      lastService: 'Социальная консультация',
      notes: 'Необходима помощь в организации ухода за супругом.'
    }
  },
  {
    id: 8,
    name: 'Смирнов Алексей Викторович',
    initials: 'СА',
    age: 42,
    city: 'Москва',
    status: 'active',
    category: 'Инвалид III группы',
    servicesReceived: 7,
    satisfaction: 91,
    color: '#84CC16',
    lastActivity: 'Вчера',
    tags: ['Инвалид', 'Реабилитация', 'Трудовая адаптация'],
    details: {
      phone: '+7 (922) 222-33-44',
      address: 'ул. Мира, д. 67, кв. 12',
      birthDate: '15.08.1982',
      snils: '890-123-456 77',
      registrationDate: '20.05.2021',
      lastService: 'Профориентационная консультация',
      notes: 'Активно ищет работу, проходит переобучение.'
    }
  },
  {
    id: 9,
    name: 'Васнецова Ольга Дмитриевна',
    initials: 'ВО',
    age: 58,
    city: 'Москва',
    status: 'active',
    category: 'Пенсионер',
    servicesReceived: 6,
    satisfaction: 91,
    color: '#8B5CF6',
    lastActivity: 'Вчера',
    tags: ['Пенсионер', 'Социальный патронаж', 'Медобслуживание', 'Юридические консультации'],
    details: {
      phone: '+7 (915) 555-44-33',
      address: 'ул. Мира, д. 45, кв. 12',
      birthDate: '12.08.1966',
      snils: '555-444-333 22',
      registrationDate: '20.03.2021',
      lastService: 'Юридическая консультация',
      notes: 'Активно участвует в социальных программах. Требуется помощь в оформлении документов на льготы.'
    }
  },
  {
    id: 10,
    name: 'Громов Александр Игоревич',
    initials: 'ГА',
    age: 39,
    city: 'Москва',
    status: 'pending',
    category: 'Инвалид III группы',
    servicesReceived: 3,
    satisfaction: 78,
    color: '#10B981',
    lastActivity: '3 дня назад',
    tags: ['Инвалид', 'Трудовая адаптация', 'Психолог'],
    details: {
      phone: '+7 (916) 777-88-99',
      address: 'пр. Ленинградский, д. 78, кв. 34',
      birthDate: '15.11.1985',
      snils: '777-888-999 00',
      registrationDate: '10.09.2023',
      lastService: 'Профориентационное тестирование',
      notes: 'Проходит программу трудовой адаптации. Требуется помощь в поиске работы.'
    }
  }
];

const citizenMetrics = [
  { category: 'Всего граждан', value: '3,562', trend: 'up', color: '#3B82F6', icon: '👥', change: '+2.3%' },
  { category: 'Льготных категорий', value: '1,845', trend: 'stable', color: '#10B981', icon: '🎗️', change: '+1.1%' },
  { category: 'В очереди', value: '287', trend: 'down', color: '#F59E0B', icon: '⏳', change: '-0.4%' },
  { category: 'Новых в месяце', value: '156', trend: 'up', color: '#8B5CF6', icon: '🆕', change: '+5.2%' },
  { category: 'Средняя удовлетворенность', value: '87%', trend: 'up', color: '#06B6D4', icon: '⭐', change: '+1.8%' },
  { category: 'Обращений в месяц', value: '567', trend: 'up', color: '#84CC16', icon: '📞', change: '+3.7%' }
];

const categoryDistribution = [
  { name: 'Пенсионеры', value: 32, color: `rgba(${COLORS.blue}, 0.9)` },
  { name: 'Инвалиды', value: 28, color: `rgba(${COLORS.purple}, 0.9)` },
  { name: 'Многодетные семьи', value: 18, color: `rgba(${COLORS.emerald}, 0.9)` },
  { name: 'Ветераны', value: 12, color: `rgba(${COLORS.rose}, 0.9)` },
  { name: 'Матери-одиночки', value: 8, color: `rgba(${COLORS.amber}, 0.9)` },
  { name: 'Другие категории', value: 2, color: `rgba(${COLORS.gray}, 0.9)` }
];

// Хук блокировки скролла
const useScrollLock = () => {
  const lockScroll = useCallback(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

  return { lockScroll, unlockScroll };
};

// Основной компонент
export default function CitizensCatalog() {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCitizen, setSelectedCitizen] = useState<any>(null);
  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState(false);
  const [isAddCitizenModalOpen, setIsAddCitizenModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(isMobile ? 'list' : 'grid');

  const { lockScroll, unlockScroll } = useScrollLock();

  // Адаптивное изменение viewMode при изменении устройства
  useEffect(() => {
    if (isMobile) {
      setViewMode('list');
    } else {
      setViewMode('grid');
    }
  }, [isMobile]);

  // Время / дата
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        })
      );
      setCurrentDate(
        now.toLocaleDateString('ru-RU', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Блокировка скролла при модальных окнах
  useEffect(() => {
    const anyModalOpen = isCitizenModalOpen || isAddCitizenModalOpen || isAnalyticsModalOpen || isReportModalOpen;
    if (anyModalOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [isCitizenModalOpen, isAddCitizenModalOpen, isAnalyticsModalOpen, isReportModalOpen, lockScroll, unlockScroll]);

  // Закрытие модалок по Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCitizenModalOpen(false);
        setIsAddCitizenModalOpen(false);
        setIsAnalyticsModalOpen(false);
        setIsReportModalOpen(false);
        setSelectedCitizen(null);
      }
    };
    if (isCitizenModalOpen || isAddCitizenModalOpen || isAnalyticsModalOpen || isReportModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCitizenModalOpen, isAddCitizenModalOpen, isAnalyticsModalOpen, isReportModalOpen]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleCitizenClick = (citizen: any) => {
    setSelectedCitizen(citizen);
    setIsCitizenModalOpen(true);
  };

  const closeCitizenModal = () => {
    setIsCitizenModalOpen(false);
    setSelectedCitizen(null);
  };

  // Фильтрация граждан
  const filteredCitizens = citizensData.filter(citizen => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'pensioners' && citizen.category.includes('Пенсионер')) ||
      (selectedCategory === 'disabled' && citizen.category.includes('Инвалид')) ||
      (selectedCategory === 'families' && (citizen.category.includes('Многодет') || citizen.category.includes('Мать-одиночка')));

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query ||
      citizen.name.toLowerCase().includes(query) ||
      citizen.category.toLowerCase().includes(query) ||
      citizen.tags.some((tag: string) => tag.toLowerCase().includes(query));

    const matchesStatus = filterStatus === 'all' || citizen.status === filterStatus;

    return matchesCategory && matchesSearch && matchesStatus;
  });

  const selectedCategoryData = citizenCategories.find(cat => cat.id === selectedCategory);

  const handleRefreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  // Адаптивная сетка
  const getGridColumns = () => {
    if (viewMode === 'list') return 'grid-cols-1';
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-2';
    return 'grid-cols-3 xl:grid-cols-4';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      <style jsx global>{`
        body.no-scroll {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }

        .gradient-text {
          background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 35%, #22c1c3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        .loading {
          animation: pulse 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Hero */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, type: "spring", stiffness: 90 }}
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-7">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1 min-w-0">
                <motion.h1
                  className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-white mb-2 sm:mb-3 tracking-tight flex items-center gap-2"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  >
                    👥
                  </motion.span>
                  <span className="gradient-text">База граждан</span>
                </motion.h1>
                <motion.p
                  className="text-white/65 text-sm sm:text-base md:text-[15px] mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 }}
                >
                  <span className="text-emerald-400 font-medium">3,562 получателей услуг</span> • 6 категорий
                  помощи • <span className="text-sky-400 font-medium">87% удовлетворенность</span>
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-2 sm:gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                >
                  {[
                    { color: 'bg-emerald-400', text: '2,987 активных клиентов' },
                    { color: 'bg-amber-400', text: '287 в очереди на услуги' },
                    { color: 'bg-purple-400', text: '1,845 льготных категорий' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 text-white/70 text-xs sm:text-[13px]"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span>{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <motion.div
                className="text-right mt-2 sm:mt-0 flex flex-col items-end gap-1"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.26 }}
              >
                <motion.div 
                  className="inline-flex items-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg shadow-emerald-500/25 backdrop-blur-sm"
                  whileHover={{ scale: 1.03, y: -1 }}
                >
                  <span className="text-xs text-emerald-50/80 mr-2 hidden sm:inline">Статус базы</span>
                  <span className="text-sm sm:text-base font-semibold text-white">Активна</span>
                </motion.div>
                <div className="text-white/60 text-[11px] sm:text-xs mt-1">
                  Автообновление раз в час • Сегодня
                </div>
              </motion.div>
            </div>
            <div className="pointer-events-none absolute top-[-40px] right-[-40px] w-28 h-28 sm:w-40 sm:h-40 bg-emerald-500/16 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-40px] left-[-40px] w-24 h-24 sm:w-32 sm:h-32 bg-sky-500/18 rounded-full blur-3xl" />
          </div>
        </motion.section>

        {/* Метрики */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5'}`}>
            {citizenMetrics.map((metric, index) => (
              <StatCard
                key={metric.category}
                title={metric.category}
                value={metric.value}
                change={metric.change}
                trend={metric.trend}
                icon={metric.icon}
                color={metric.color}
                delay={index}
              />
            ))}
          </div>
        </motion.section>

        {/* Категории */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 8 }}
            >
              📂
            </motion.span>
            Категории граждан
          </h3>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {citizenCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
                index={index}
              />
            ))}
          </div>
        </motion.section>

        {/* Аналитика выбранной категории */}
        {selectedCategory && selectedCategoryData && (
          <motion.section
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/8 backdrop-blur-xl p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Детальная статистика: {selectedCategoryData.title}
                  </h3>
                  
                  <div className={`grid ${isMobile ? 'grid-cols-2' : 'sm:grid-cols-4'} gap-3 mb-4`}>
                    {[
                      { label: 'Активные клиенты', value: selectedCategoryData.details.activeClients, color: 'text-white' },
                      { label: 'Новых в месяце', value: `+${selectedCategoryData.details.newThisMonth}`, color: 'text-emerald-400' },
                      { label: 'Средний возраст', value: selectedCategoryData.details.avgAge, color: 'text-white' },
                      { label: 'М/Ж соотношение', value: selectedCategoryData.details.maleFemaleRatio, color: 'text-white' }
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        className="bg-white/6 rounded-xl p-3 border border-white/10 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ y: -2 }}
                      >
                        <div className="text-white/60 text-xs mb-1">{item.label}</div>
                        <div className={`font-semibold text-lg ${item.color}`}>
                          {item.value}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <ProgressBar
                      value={selectedCategoryData.avgSatisfaction}
                      label="Удовлетворенность услугами"
                      color={`rgb(${selectedCategoryData.glowColor})`}
                      showLabel
                    />
                    <ProgressBar
                      value={(selectedCategoryData.details.newThisMonth / selectedCategoryData.citizensCount) * 100}
                      label="Прирост в месяце"
                      color="#10B981"
                      showLabel
                    />
                  </div>
                </div>

                <motion.div 
                  className="lg:w-48 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <PieChart
                    data={categoryDistribution}
                    size={isMobile ? 100 : 120}
                    className="mb-3"
                  />
                  <div className="text-center">
                    <div className="text-white font-semibold text-sm">Распределение категорий</div>
                    <div className="text-white/60 text-xs">Всего {selectedCategoryData.citizensCount} чел.</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Фильтры */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <FiltersSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onAddCitizen={() => setIsAddCitizenModalOpen(true)}
            onGenerateReport={() => setIsReportModalOpen(true)}
            onShowAnalytics={() => setIsAnalyticsModalOpen(true)}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </motion.section>

        {/* Заголовок списка */}
        <motion.section
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg">
                {selectedCategoryData?.title || 'Все граждане'} 
                <span className="text-white/60 ml-2 text-sm font-normal">
                  ({filteredCitizens.length} из {citizensData.length})
                </span>
              </h3>
              <div className="text-white/60 text-sm mt-1">
                {filteredCitizens.length === citizensData.length 
                  ? 'Все граждане' 
                  : `Найдено по запросу: "${searchTerm}"`}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-white/60 text-sm hidden sm:block">
                Сортировка: <span className="text-white">По дате активности</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Список граждан */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          layout
        >
          {filteredCitizens.length === 0 ? (
            <motion.div 
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <motion.div 
                className="text-4xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔍
              </motion.div>
              <div className="text-white font-semibold text-lg mb-2">Граждане не найдены</div>
              <div className="text-white/60 text-sm mb-4">
                Попробуйте изменить параметры поиска или фильтры
              </div>
              <motion.button
                onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors text-sm backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Сбросить фильтры
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              className={`grid gap-4 ${getGridColumns()}`}
              layout
            >
              {filteredCitizens.map((citizen, index) => (
                <CitizenCard
                  key={citizen.id}
                  citizen={citizen}
                  index={index}
                  onCitizenClick={handleCitizenClick}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Пагинация */}
        {filteredCitizens.length > 0 && (
          <motion.section
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex gap-2">
              {['← Назад', '1', '2', '3', 'Далее →'].map((label, index) => (
                <motion.button
                  key={index}
                  className={`px-4 py-2 border text-white rounded-lg text-sm transition-colors backdrop-blur-sm ${
                    index === 1 
                      ? 'bg-white/10 border-white/20' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Модальные окна */}
      <AnimatePresence>
        {isCitizenModalOpen && selectedCitizen && (
          <CitizenModal
            citizen={selectedCitizen}
            onClose={closeCitizenModal}
          />
        )}
      </AnimatePresence>

      <AddCitizenModal
        isOpen={isAddCitizenModalOpen}
        onClose={() => setIsAddCitizenModalOpen(false)}
      />

      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}