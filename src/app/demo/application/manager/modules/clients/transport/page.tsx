'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Цветовая палитра для транспортной темы
const TRANSPORT_COLORS = {
  primary: 'from-gray-950 via-black to-gray-900',
  secondary: 'from-blue-900 via-black to-indigo-900',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  transportBlue: '59, 130, 246',
  transportIndigo: '99, 102, 241',
  transportEmerald: '16, 185, 129',
  transportAmber: '245, 158, 11',
  transportPurple: '139, 92, 246',
  transportCyan: '34, 211, 238',
  transportGreen: '34, 197, 94',
  transportRed: '239, 68, 68',
  transportYellow: '234, 179, 8'
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
            : 'text-blue-400'
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

// Улучшенная карточка пассажира
const PassengerCard = ({
  passenger,
  index,
  onPassengerClick,
  viewMode = 'grid'
}: {
  passenger: any;
  index: number;
  onPassengerClick?: (passenger: any) => void;
  viewMode?: 'grid' | 'list';
}) => {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isListMode = viewMode === 'list';

  const getGradient = (name: string) => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-cyan-600',
      'from-amber-500 to-orange-500',
      'from-purple-500 to-indigo-600',
      'from-cyan-500 to-blue-600',
      'from-green-500 to-emerald-600'
    ];
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'traveling':
        return { color: 'bg-blue-400', text: '', label: 'traveling' };
      case 'waiting':
        return { color: 'bg-amber-400', text: '', label: 'waiting' };
      case 'boarding':
        return { color: 'bg-emerald-400', text: '', label: 'boarding' };
      case 'arrived':
        return { color: 'bg-gray-400', text: '', label: 'arrived' };
      default:
        return { color: 'bg-gray-400', text: '', label: 'unknown' };
    }
  };

  const getTransportIcon = (transport: string) => {
    switch (transport) {
      case 'bus': return '🚌';
      case 'train': return '🚆';
      case 'metro': return '🚇';
      case 'tram': return '🚊';
      default: return '🚗';
    }
  };

  const statusInfo = getStatusInfo(passenger.status);

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
        onClick={() => onPassengerClick?.(passenger)}
      >
        <motion.div
          className={`w-14 h-14 rounded-full bg-gradient-to-r ${getGradient(passenger.name)} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-lg`}
          whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {passenger.initials}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-base group-hover:text-blue-300 transition-colors truncate">
                {passenger.name}
              </div>
              <div className="text-white/60 text-sm mt-1">
                {passenger.age} лет • {passenger.route} • {passenger.transport}
              </div>
            </div>
            
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                <div className="text-white/60 text-sm hidden sm:block">
                  {passenger.departureTime}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-white/70">
                Билет: <span className="text-white font-medium">{passenger.ticketNumber}</span>
              </div>
              <div className="text-white/70">
                Место: <span className="text-white font-medium">{passenger.seat}</span>
              </div>
              <div className="text-white/70 flex items-center gap-1">
                <span>{getTransportIcon(passenger.transport)}</span>
                <span>
                  {passenger.transport === 'bus' ? 'Автобус' :
                   passenger.transport === 'train' ? 'Поезд' :
                   passenger.transport === 'metro' ? 'Метро' : 'Трамвай'}
                </span>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <ProgressBar
                value={passenger.travelHistory}
                color={passenger.color}
                height="6px"
                showLabel={false}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {passenger.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
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
      onClick={() => onPassengerClick?.(passenger)}
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
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${getGradient(passenger.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}
            whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {passenger.initials}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors truncate">
              {passenger.name}
            </div>
            <div className="text-white/60 text-xs">
              {passenger.age} лет • {passenger.route}
            </div>
            <div className="text-white/50 text-[11px] mt-1 flex items-center gap-1">
              {getTransportIcon(passenger.transport)}
              {passenger.transport === 'bus' ? 'Автобус' :
               passenger.transport === 'train' ? 'Поезд' :
               passenger.transport === 'metro' ? 'Метро' : 'Трамвай'}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4 flex-1">
        <div className="flex justify-between items-center text-white text-[11px]">
          <span className="text-white/60">Номер билета</span>
          <span className="font-medium bg-white/10 px-2 py-1 rounded-full">
            {passenger.ticketNumber}
          </span>
        </div>
        <div className="flex justify-between items-center text-white text-[11px]">
          <span className="text-white/60">Место</span>
          <span className="font-medium">{passenger.seat}</span>
        </div>
        <ProgressBar
          value={passenger.travelHistory}
          label="Поездок в этом месяце"
          color={passenger.color}
          height="6px"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-white/60 mb-3">
        <span>Отправление</span>
        <span className="font-medium text-white/70">{passenger.departureTime}</span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-white mb-3">
        <span className="text-white/60">Багаж</span>
        <span className="font-semibold text-amber-400">{passenger.luggage} ед.</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {passenger.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
          <motion.span
            key={tagIndex}
            className="text-[10px] bg-white/8 px-2 py-1 rounded-full border border-white/15 text-white/80 group-hover:bg-white/14 transition-colors truncate max-w-[80px]"
            whileHover={!isMobile ? { scale: 1.05 } : {}}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {tag}
          </motion.span>
        ))}
        {passenger.tags.length > 3 && (
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full border border-white/10 text-white/60">
            +{passenger.tags.length - 3}
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

// Улучшенная карточка маршрута
const RouteCard = ({
  route,
  isSelected,
  onClick,
  index
}: {
  route: any;
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
          style={{ color: `rgb(${route.glowColor})` }}
          whileHover={{ scale: 1.05 }}
        >
          {route.value} {route.metric}
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
          {route.title}
        </motion.h3>
        <p className="text-white/70 text-xs sm:text-[13px] leading-4 sm:leading-5 mb-3 sm:mb-4 flex-1">
          {route.description}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
          {[
            { value: route.avgTravelTime, label: 'Среднее время', color: 'text-white', suffix: 'мин' },
            { value: route.occupancyRate, label: 'Загрузка', color: 'text-emerald-300', suffix: '%' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="text-center p-1.5 sm:p-2.5 bg-white/6 rounded-lg backdrop-blur-sm border border-white/8"
              whileHover={{ scale: 1.03, y: -1 }}
            >
              <div className={`font-semibold text-xs sm:text-sm ${item.color}`}>
                {item.value}{item.suffix}
              </div>
              <div className="text-white/60 text-[11px]">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <ProgressBar
          value={route.details.satisfactionRate}
          label="Удовлетворенность пассажиров"
          color={`rgb(${route.glowColor})`}
          showLabel
          height="6px"
        />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 70% 10%, rgba(${route.glowColor}, 0.35) 0%, transparent 60%)`
        }}
        animate={{
          background: [
            `radial-gradient(circle at 70% 10%, rgba(${route.glowColor}, 0.35) 0%, transparent 60%)`,
            `radial-gradient(circle at 30% 80%, rgba(${route.glowColor}, 0.35) 0%, transparent 60%)`,
            `radial-gradient(circle at 70% 10%, rgba(${route.glowColor}, 0.35) 0%, transparent 60%)`
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
  filterTransport,
  setFilterTransport,
  onAddPassenger,
  onGenerateReport,
  onShowAnalytics,
  viewMode,
  setViewMode
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterTransport: string;
  setFilterTransport: (transport: string) => void;
  onAddPassenger: () => void;
  onGenerateReport: () => void;
  onShowAnalytics: () => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
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
          onClick={onAddPassenger}
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
          <span>{isMobile ? 'Добавить' : 'Добавить пассажира'}</span>
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

// Модальное окно добавления пассажира
const AddPassengerModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    route: '',
    transport: '',
    ticketNumber: '',
    seat: '',
    departure: '',
    arrival: '',
    departureTime: '',
    arrivalTime: '',
    luggage: '0'
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
    // Обработка добавления пассажира
    console.log('Добавление пассажира:', formData);
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
              Добавить нового пассажира
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
                  placeholder="Иванов Алексей Петрович"
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
                  placeholder="35"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Маршрут</label>
                <select
                  required
                  value={formData.route}
                  onChange={(e) => setFormData({...formData, route: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="">Выберите маршрут</option>
                  <option value="Центральный → Северный">Центральный → Северный</option>
                  <option value="Северный → Центральный">Северный → Центральный</option>
                  <option value="Экспресс аэропорт">Экспресс аэропорт</option>
                  <option value="Центральный → Южные ворота">Центральный → Южные ворота</option>
                </select>
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Транспорт</label>
                <select
                  required
                  value={formData.transport}
                  onChange={(e) => setFormData({...formData, transport: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="">Выберите транспорт</option>
                  <option value="bus">Автобус</option>
                  <option value="train">Поезд</option>
                  <option value="metro">Метро</option>
                  <option value="tram">Трамвай</option>
                </select>
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Номер билета</label>
                <input
                  type="text"
                  required
                  value={formData.ticketNumber}
                  onChange={(e) => setFormData({...formData, ticketNumber: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="TK-7842-15"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Место</label>
                <input
                  type="text"
                  required
                  value={formData.seat}
                  onChange={(e) => setFormData({...formData, seat: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="12A"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Отправление</label>
                <input
                  type="text"
                  required
                  value={formData.departure}
                  onChange={(e) => setFormData({...formData, departure: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Центральный вокзал"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Прибытие</label>
                <input
                  type="text"
                  required
                  value={formData.arrival}
                  onChange={(e) => setFormData({...formData, arrival: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Северный терминал"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Время отправления</label>
                <input
                  type="text"
                  required
                  value={formData.departureTime}
                  onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="14:30"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Время прибытия</label>
                <input
                  type="text"
                  required
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="15:15"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Багаж (ед.)</label>
                <input
                  type="number"
                  value={formData.luggage}
                  onChange={(e) => setFormData({...formData, luggage: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="2"
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
                Добавить пассажира
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
    totalPassengers: 1842,
    travelingNow: 856,
    availableSeats: 1247,
    avgOccupancy: 78,
    monthlyGrowth: 15,
    delay: 3,
    satisfactionRate: 94.2,
    routeDistribution: [
      { name: 'Центральный маршрут', value: 32, color: `rgba(${TRANSPORT_COLORS.transportIndigo}, 0.9)` },
      { name: 'Северный маршрут', value: 28, color: `rgba(${TRANSPORT_COLORS.transportCyan}, 0.9)` },
      { name: 'Экспресс маршрут', value: 18, color: `rgba(${TRANSPORT_COLORS.transportEmerald}, 0.9)` },
      { name: 'Южный маршрут', value: 12, color: `rgba(${TRANSPORT_COLORS.transportAmber}, 0.9)` },
      { name: 'Западный маршрут', value: 8, color: `rgba(${TRANSPORT_COLORS.transportPurple}, 0.9)` },
      { name: 'Другие маршруты', value: 2, color: `rgba(${TRANSPORT_COLORS.transportBlue}, 0.9)` }
    ],
    monthlyStats: [
      { month: 'Янв', passengers: 1500, occupancy: 72 },
      { month: 'Фев', passengers: 1620, occupancy: 75 },
      { month: 'Мар', passengers: 1710, occupancy: 76 },
      { month: 'Апр', passengers: 1780, occupancy: 77 },
      { month: 'Май', passengers: 1820, occupancy: 78 },
      { month: 'Июн', passengers: 1842, occupancy: 78 }
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
              📊 Аналитика пассажиропотока
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
                  <div className="text-2xl font-bold text-white mb-1">{analyticsData.totalPassengers}</div>
                  <div className="text-white/60 text-sm">Пассажиров</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{analyticsData.travelingNow}</div>
                  <div className="text-white/60 text-sm">В пути сейчас</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400 mb-1">{analyticsData.avgOccupancy}%</div>
                  <div className="text-white/60 text-sm">Средняя загрузка</div>
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
              <h4 className="text-white font-semibold text-lg mb-4">Распределение по маршрутам</h4>
              <PieChart
                data={analyticsData.routeDistribution}
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
                      value={stat.occupancy}
                      color="#3B82F6"
                      height="20px"
                      showLabel={false}
                    />
                  </div>
                  <div className="text-right text-xs text-white/60 w-20">
                    {stat.passengers} чел.
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
                <option value="routes">По маршрутам</option>
                <option value="transport">По транспорту</option>
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

// Улучшенное модальное окно пассажира
const PassengerModal = ({ passenger, onClose }: { passenger: any; onClose: () => void }) => {
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

  const getTransportIcon = (transport: string) => {
    switch (transport) {
      case 'bus': return '🚌';
      case 'train': return '🚆';
      case 'metro': return '🚇';
      case 'tram': return '🚊';
      default: return '🚗';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'traveling': return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
      case 'waiting': return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'boarding': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
      case 'arrived': return 'bg-gray-500/15 text-gray-400 border-gray-500/40';
      default: return 'bg-gray-500/15 text-gray-400 border-gray-500/40';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'traveling': return 'В пути';
      case 'waiting': return 'Ожидание';
      case 'boarding': return 'Посадка';
      case 'arrived': return 'Прибыл';
      default: return 'Неизвестно';
    }
  };

  const getLoyaltyColor = (level: string) => {
    switch (level) {
      case 'standard': return 'text-gray-400';
      case 'silver': return 'text-gray-300';
      case 'gold': return 'text-amber-400';
      case 'platinum': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  const getLoyaltyText = (level: string) => {
    switch (level) {
      case 'standard': return 'Стандарт';
      case 'silver': return 'Серебро';
      case 'gold': return 'Золото';
      case 'platinum': return 'Платина';
      default: return 'Стандарт';
    }
  };

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
              Данные пассажира
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
                className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                {passenger.initials}
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-2xl mb-2 truncate">{passenger.name}</h4>
                <div className="text-white/60 text-sm mb-3">
                  {passenger.age} лет • {passenger.route} • 
                  <span className={getLoyaltyColor(passenger.loyaltyLevel)}>
                    {' '}{getLoyaltyText(passenger.loyaltyLevel)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <motion.div 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(passenger.status)} backdrop-blur-sm`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {getStatusText(passenger.status)}
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20 backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    Билет: {passenger.ticketNumber}
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20 backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    Багаж: {passenger.luggage} ед.
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
                    <span>🎫</span> Информация о поездке
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Транспорт', value: `${getTransportIcon(passenger.transport)} ${passenger.transport === 'bus' ? 'Автобус' : passenger.transport === 'train' ? 'Поезд' : passenger.transport === 'metro' ? 'Метро' : 'Трамвай'}` },
                      { label: 'Место', value: passenger.seat },
                      { label: 'Отправление', value: `${passenger.departure} в ${passenger.departureTime}` },
                      { label: 'Прибытие', value: `${passenger.arrival} в ${passenger.arrivalTime}` }
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
                    <span>📞</span> Контактная информация
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Телефон', value: passenger.contact },
                      { label: 'Email', value: passenger.email }
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
                    <span>📊</span> Статистика
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Поездок в этом месяце', value: passenger.travelHistory },
                      { label: 'Уровень лояльности', value: getLoyaltyText(passenger.loyaltyLevel) },
                      { label: 'Класс обслуживания', value: passenger.details.ticketClass },
                      { label: 'Способ оплаты', value: passenger.details.paymentMethod }
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
                      value={passenger.travelHistory}
                      label="Активность поездок"
                      color={passenger.color}
                      showLabel
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
                  whileHover={{ y: -2 }}
                >
                  <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>⭐</span> Предпочтения
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {Object.entries(passenger.details.preferences).map(([key, value], index) => (
                      <motion.div 
                        key={key}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                      >
                        <div className={`w-2 h-2 rounded-full ${value ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                        <span className={value ? 'text-white' : 'text-white/60'}>
                          {key === 'windowSeat' ? 'У окна' :
                           key === 'quietZone' ? 'Тихая зона' :
                           key === 'extraLegroom' ? 'Доп. пространство' : 'Wi-Fi'}
                        </span>
                      </motion.div>
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
                <span>🏷️</span> Теги и особенности
              </h5>
              <div className="flex flex-wrap gap-2">
                {passenger.tags.map((tag: string, index: number) => (
                  <motion.span
                    key={index}
                    className="px-3 py-1 bg-white/10 rounded-full text-white text-xs border border-white/20 backdrop-blur-sm"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
              {passenger.details.specialNeeds && passenger.details.specialNeeds.length > 0 && (
                <div className="mt-3">
                  <div className="text-white/60 text-sm mb-2">Особые потребности:</div>
                  <div className="flex flex-wrap gap-2">
                    {passenger.details.specialNeeds.map((need: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/10 rounded-full text-blue-300 text-xs border border-blue-500/20"
                      >
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {passenger.details.notes && (
              <motion.div 
                className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ y: -2 }}
              >
                <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span>📝</span> Примечания
                </h5>
                <div className="text-white text-sm leading-relaxed">
                  {passenger.details.notes}
                </div>
              </motion.div>
            )}
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
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
              Изменить данные
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Данные
const routesData = [
  {
    id: 'all',
    title: '🚌 Все пассажиры',
    description: 'Все маршруты • Полная статистика • Управление перевозками',
    value: '1,842',
    metric: 'Пассажиров',
    color: '#060010',
    glowColor: TRANSPORT_COLORS.transportBlue,
    passengersCount: 1842,
    occupancyRate: 78,
    avgTravelTime: 45,
    growth: '+15%',
    popularStations: ['Центральный вокзал', 'Северный терминал', 'Южные ворота', 'Западный хаб'],
    details: {
      availableSeats: 1247,
      totalSeats: 3089,
      nextDeparture: '15:30',
      delay: 3,
      satisfactionRate: 94.2
    }
  },
  {
    id: 'central',
    title: '🏙️ Центральный маршрут',
    description: 'Центр города • Деловые районы • Основные достопримечательности',
    value: '568',
    metric: 'Пассажиров',
    color: '#060010',
    glowColor: TRANSPORT_COLORS.transportIndigo,
    passengersCount: 568,
    occupancyRate: 85,
    avgTravelTime: 35,
    growth: '+22%',
    popularStations: ['Площадь Ленина', 'Центральный проспект', 'Деловой центр', 'Театральная'],
    details: {
      availableSeats: 342,
      totalSeats: 910,
      nextDeparture: '15:15',
      delay: 2,
      satisfactionRate: 96.5
    }
  },
  {
    id: 'northern',
    title: '🧭 Северный маршрут',
    description: 'Спальные районы • Университет • Торговые центры',
    value: '423',
    metric: 'Пассажиров',
    color: '#060010',
    glowColor: TRANSPORT_COLORS.transportCyan,
    passengersCount: 423,
    occupancyRate: 72,
    avgTravelTime: 52,
    growth: '+18%',
    popularStations: ['Северный вокзал', 'Университет', 'ТЦ "Северный"', 'Парк Победы'],
    details: {
      availableSeats: 289,
      totalSeats: 712,
      nextDeparture: '15:45',
      delay: 5,
      satisfactionRate: 92.8
    }
  },
  {
    id: 'express',
    title: '⚡ Экспресс маршрут',
    description: 'Скоростное сообщение • Аэропорт • Вокзалы • Минимум остановок',
    value: '287',
    metric: 'Пассажиров',
    color: '#060010',
    glowColor: TRANSPORT_COLORS.transportEmerald,
    passengersCount: 287,
    occupancyRate: 91,
    avgTravelTime: 28,
    growth: '+35%',
    popularStations: ['Аэропорт', 'Центральный вокзал', 'Южный терминал', 'Бизнес-парк'],
    details: {
      availableSeats: 156,
      totalSeats: 443,
      nextDeparture: '16:00',
      delay: 1,
      satisfactionRate: 97.1
    }
  }
];

const passengersData = [
  {
    id: 1,
    name: 'Иванов Алексей Петрович',
    initials: 'ИА',
    age: 35,
    gender: 'male',
    status: 'traveling',
    ticketNumber: 'TK-7842-15',
    route: 'Центральный → Северный',
    transport: 'bus',
    seat: '12A',
    departure: 'Центральный вокзал',
    arrival: 'Северный терминал',
    departureTime: '14:30',
    arrivalTime: '15:15',
    luggage: 2,
    loyaltyLevel: 'gold',
    contact: '+7 (915) 123-45-67',
    email: 'a.ivanov@mail.ru',
    color: '#3B82F6',
    travelHistory: 24,
    tags: ['Бизнес', 'WiFi', 'Окно', 'Частый пассажир'],
    details: {
      ticketClass: 'Комфорт',
      paymentMethod: 'Карта',
      specialNeeds: [],
      frequentRoutes: ['Центральный → Северный', 'Экспресс аэропорт'],
      preferences: {
        windowSeat: true,
        quietZone: false,
        extraLegroom: true,
        wifi: true
      },
      notes: 'Предпочитает первые ряды. Частый пассажир бизнес-класса.'
    }
  },
  {
    id: 2,
    name: 'Петрова Мария Сергеевна',
    initials: 'ПМ',
    age: 28,
    gender: 'female',
    status: 'waiting',
    ticketNumber: 'TK-9156-22',
    route: 'Северный → Центральный',
    transport: 'train',
    seat: '08B',
    departure: 'Северный терминал',
    arrival: 'Центральный вокзал',
    departureTime: '15:45',
    arrivalTime: '16:30',
    luggage: 1,
    loyaltyLevel: 'platinum',
    contact: '+7 (916) 234-56-78',
    email: 'm.petrova@mail.ru',
    color: '#10B981',
    travelHistory: 18,
    tags: ['Студент', 'Тихая зона', 'Розетка', 'Регулярный'],
    details: {
      ticketClass: 'Стандарт',
      paymentMethod: 'Мобильное приложение',
      specialNeeds: ['Тихая зона'],
      frequentRoutes: ['Северный → Центральный', 'Университетский'],
      preferences: {
        windowSeat: false,
        quietZone: true,
        extraLegroom: false,
        wifi: true
      },
      notes: 'Часто путешествует с ноутбуком. Предпочитает тихие зоны.'
    }
  },
  {
    id: 3,
    name: 'Сидоров Дмитрий Иванович',
    initials: 'СД',
    age: 42,
    gender: 'male',
    status: 'boarding',
    ticketNumber: 'TK-6321-07',
    route: 'Экспресс аэропорт',
    transport: 'bus',
    seat: '04C',
    departure: 'Аэропорт',
    arrival: 'Центральный вокзал',
    departureTime: '16:00',
    arrivalTime: '16:28',
    luggage: 3,
    loyaltyLevel: 'silver',
    contact: '+7 (917) 345-67-89',
    email: 'd.sidorov@mail.ru',
    color: '#8B5CF6',
    travelHistory: 12,
    tags: ['Багаж', 'Бизнес', 'Срочно', 'Командировка'],
    details: {
      ticketClass: 'Бизнес',
      paymentMethod: 'Корпоративная карта',
      specialNeeds: ['Приоритетная посадка'],
      frequentRoutes: ['Экспресс аэропорт'],
      preferences: {
        windowSeat: false,
        quietZone: false,
        extraLegroom: true,
        wifi: false
      },
      notes: 'Частые командировки, всегда с багажом. Требуется приоритетная посадка.'
    }
  },
  {
    id: 4,
    name: 'Козлова Анна Викторовна',
    initials: 'КА',
    age: 65,
    gender: 'female',
    status: 'arrived',
    ticketNumber: 'TK-4789-31',
    route: 'Центральный → Южные ворота',
    transport: 'tram',
    seat: '15D',
    departure: 'Центральный вокзал',
    arrival: 'Южные ворота',
    departureTime: '14:15',
    arrivalTime: '14:55',
    luggage: 0,
    loyaltyLevel: 'standard',
    contact: '+7 (918) 456-78-90',
    email: 'a.kozlova@mail.ru',
    color: '#F59E0B',
    travelHistory: 8,
    tags: ['Пенсионер', 'Без багажа', 'Регулярный', 'Утро'],
    details: {
      ticketClass: 'Стандарт',
      paymentMethod: 'Наличные',
      specialNeeds: ['Помощь при посадке'],
      frequentRoutes: ['Центральный → Южные ворота'],
      preferences: {
        windowSeat: true,
        quietZone: true,
        extraLegroom: false,
        wifi: false
      },
      notes: 'Постоянный пассажир, предпочитает утренние рейсы. Требуется помощь при посадке.'
    }
  },
  {
    id: 5,
    name: 'Николаев Сергей Дмитриевич',
    initials: 'НС',
    age: 29,
    gender: 'male',
    status: 'traveling',
    ticketNumber: 'TK-1256-88',
    route: 'Центральный → Северный',
    transport: 'metro',
    seat: '--',
    departure: 'Центральный вокзал',
    arrival: 'Северный терминал',
    departureTime: '15:00',
    arrivalTime: '15:25',
    luggage: 1,
    loyaltyLevel: 'gold',
    contact: '+7 (919) 567-89-01',
    email: 's.nikolaev@mail.ru',
    color: '#EC4899',
    travelHistory: 15,
    tags: ['Рабочие поездки', 'Метро', 'Электронный билет'],
    details: {
      ticketClass: 'Стандарт',
      paymentMethod: 'Электронный кошелек',
      specialNeeds: [],
      frequentRoutes: ['Центральный → Северный', 'Метро линия 1'],
      preferences: {
        windowSeat: false,
        quietZone: true,
        extraLegroom: false,
        wifi: true
      },
      notes: 'Ежедневные рабочие поездки. Предпочитает метро в часы пик.'
    }
  },
  {
    id: 6,
    name: 'Федорова Елена Игоревна',
    initials: 'ФЕ',
    age: 31,
    gender: 'female',
    status: 'waiting',
    ticketNumber: 'TK-3345-12',
    route: 'Экспресс аэропорт',
    transport: 'bus',
    seat: '06A',
    departure: 'Аэропорт',
    arrival: 'Центральный вокзал',
    departureTime: '17:30',
    arrivalTime: '18:05',
    luggage: 2,
    loyaltyLevel: 'platinum',
    contact: '+7 (920) 678-90-12',
    email: 'e.fedorova@mail.ru',
    color: '#06B6D4',
    travelHistory: 32,
    tags: ['Частые перелеты', 'Бизнес', 'Премиум'],
    details: {
      ticketClass: 'Бизнес',
      paymentMethod: 'Кредитная карта',
      specialNeeds: ['Приоритетная посадка', 'Дополнительное место для багажа'],
      frequentRoutes: ['Экспресс аэропорт'],
      preferences: {
        windowSeat: true,
        quietZone: true,
        extraLegroom: true,
        wifi: true
      },
      notes: 'Частые командировки с перелетами. Требуется дополнительное место для багажа.'
    }
  }
];

const passengerMetrics = [
  { category: 'Пассажиров', value: '1,842', trend: 'up', color: '#3B82F6', icon: '👥', change: '+2.3%' },
  { category: 'В пути сейчас', value: '856', trend: 'stable', color: '#10B981', icon: '🚌', change: '+1.1%' },
  { category: 'Свободных мест', value: '1,247', trend: 'down', color: '#8B5CF6', icon: '💺', change: '-0.4%' },
  { category: 'Средняя загрузка', value: '78%', trend: 'up', color: '#F59E0B', icon: '📊', change: '+1.8%' },
  { category: 'Задержки', value: '3 мин', trend: 'down', color: '#EC4899', icon: '⏱️', change: '-0.2%' },
  { category: 'Удовлетворенность', value: '94.2%', trend: 'up', color: '#06B6D4', icon: '⭐', change: '+0.8%' }
];

const routeDistribution = [
  { name: 'Центральный маршрут', value: 32, color: `rgba(${TRANSPORT_COLORS.transportIndigo}, 0.9)` },
  { name: 'Северный маршрут', value: 28, color: `rgba(${TRANSPORT_COLORS.transportCyan}, 0.9)` },
  { name: 'Экспресс маршрут', value: 18, color: `rgba(${TRANSPORT_COLORS.transportEmerald}, 0.9)` },
  { name: 'Южный маршрут', value: 12, color: `rgba(${TRANSPORT_COLORS.transportAmber}, 0.9)` },
  { name: 'Западный маршрут', value: 8, color: `rgba(${TRANSPORT_COLORS.transportPurple}, 0.9)` },
  { name: 'Другие маршруты', value: 2, color: `rgba(${TRANSPORT_COLORS.transportBlue}, 0.9)` }
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
export default function PassengersCatalog() {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [selectedPassenger, setSelectedPassenger] = useState<any>(null);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [isAddPassengerModalOpen, setIsAddPassengerModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTransport, setFilterTransport] = useState('all');
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
    const anyModalOpen = isPassengerModalOpen || isAddPassengerModalOpen || isAnalyticsModalOpen || isReportModalOpen;
    if (anyModalOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [isPassengerModalOpen, isAddPassengerModalOpen, isAnalyticsModalOpen, isReportModalOpen, lockScroll, unlockScroll]);

  // Закрытие модалок по Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPassengerModalOpen(false);
        setIsAddPassengerModalOpen(false);
        setIsAnalyticsModalOpen(false);
        setIsReportModalOpen(false);
        setSelectedPassenger(null);
      }
    };
    if (isPassengerModalOpen || isAddPassengerModalOpen || isAnalyticsModalOpen || isReportModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPassengerModalOpen, isAddPassengerModalOpen, isAnalyticsModalOpen, isReportModalOpen]);

  const handleRouteClick = (routeId: string) => {
    setSelectedRoute(routeId);
  };

  const handlePassengerClick = (passenger: any) => {
    setSelectedPassenger(passenger);
    setIsPassengerModalOpen(true);
  };

  const closePassengerModal = () => {
    setIsPassengerModalOpen(false);
    setSelectedPassenger(null);
  };

  // Фильтрация пассажиров
  const filteredPassengers = passengersData.filter(passenger => {
    const matchesRoute = selectedRoute === 'all' || 
      (selectedRoute === 'central' && passenger.route.includes('Центральный')) ||
      (selectedRoute === 'northern' && passenger.route.includes('Северный')) ||
      (selectedRoute === 'express' && passenger.route.includes('Экспресс'));

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query ||
      passenger.name.toLowerCase().includes(query) ||
      passenger.ticketNumber.toLowerCase().includes(query) ||
      passenger.route.toLowerCase().includes(query) ||
      passenger.tags.some((tag: string) => tag.toLowerCase().includes(query));

    const matchesStatus = filterStatus === 'all' || passenger.status === filterStatus;
    const matchesTransport = filterTransport === 'all' || passenger.transport === filterTransport;

    return matchesRoute && matchesSearch && matchesStatus && matchesTransport;
  });

  const selectedRouteData = routesData.find(route => route.id === selectedRoute);

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
    <div className={`min-h-screen bg-gradient-to-br ${TRANSPORT_COLORS.primary}`}>
      <style jsx global>{`
        body.no-scroll {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }

        .gradient-text {
          background: linear-gradient(135deg, #67e8f9 0%, #22d3ee 35%, #0ea5e9 100%);
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
                    🚌
                  </motion.span>
                  <span className="gradient-text">Система управления пассажирами</span>
                </motion.h1>
                <motion.p
                  className="text-white/65 text-sm sm:text-base md:text-[15px] mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 }}
                >
                  <span className="text-emerald-400 font-medium">1,842 пассажиров сегодня</span> • 4 основных маршрута
                  • <span className="text-blue-400 font-medium">94.2% удовлетворенность</span>
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-2 sm:gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                >
                  {[
                    { color: 'bg-emerald-400', text: '856 пассажиров в пути' },
                    { color: 'bg-blue-400', text: '1,247 свободных мест' },
                    { color: 'bg-amber-400', text: '78% средняя загрузка' }
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
                  className="inline-flex items-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg shadow-blue-500/25 backdrop-blur-sm"
                  whileHover={{ scale: 1.03, y: -1 }}
                >
                  <span className="text-xs text-blue-50/80 mr-2 hidden sm:inline">Статус системы</span>
                  <span className="text-sm sm:text-base font-semibold text-white">Активна</span>
                </motion.div>
                <div className="text-white/60 text-[11px] sm:text-xs mt-1">
                  Автообновление каждые 3 мин • Сегодня
                </div>
              </motion.div>
            </div>
            <div className="pointer-events-none absolute top-[-40px] right-[-40px] w-28 h-28 sm:w-40 sm:h-40 bg-blue-500/16 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-40px] left-[-40px] w-24 h-24 sm:w-32 sm:h-32 bg-indigo-500/18 rounded-full blur-3xl" />
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
            {passengerMetrics.map((metric, index) => (
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

        {/* Маршруты */}
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
              🗺️
            </motion.span>
            Маршруты и направления
          </h3>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {routesData.map((route, index) => (
              <RouteCard
                key={route.id}
                route={route}
                isSelected={selectedRoute === route.id}
                onClick={() => handleRouteClick(route.id)}
                index={index}
              />
            ))}
          </div>
        </motion.section>

        {/* Аналитика выбранного маршрута */}
        {selectedRoute && selectedRouteData && (
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
                    Детальная статистика: {selectedRouteData.title}
                  </h3>
                  
                  <div className={`grid ${isMobile ? 'grid-cols-2' : 'sm:grid-cols-4'} gap-3 mb-4`}>
                    {[
                      { label: 'Свободные места', value: `${selectedRouteData.details.availableSeats} / ${selectedRouteData.details.totalSeats}`, color: 'text-white' },
                      { label: 'Следующий рейс', value: selectedRouteData.details.nextDeparture, color: 'text-emerald-400' },
                      { label: 'Задержка', value: `${selectedRouteData.details.delay} мин`, color: 'text-white' },
                      { label: 'Удовлетворенность', value: `${selectedRouteData.details.satisfactionRate}%`, color: 'text-white' }
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
                      value={selectedRouteData.details.satisfactionRate}
                      label="Удовлетворенность пассажиров"
                      color={`rgb(${selectedRouteData.glowColor})`}
                      showLabel
                    />
                    <ProgressBar
                      value={selectedRouteData.occupancyRate}
                      label="Загрузка транспорта"
                      color="#F59E0B"
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
                    data={routeDistribution}
                    size={isMobile ? 100 : 120}
                    className="mb-3"
                  />
                  <div className="text-center">
                    <div className="text-white font-semibold text-sm">Распределение по маршрутам</div>
                    <div className="text-white/60 text-xs">Всего {selectedRouteData.passengersCount} чел.</div>
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
            filterTransport={filterTransport}
            setFilterTransport={setFilterTransport}
            onAddPassenger={() => setIsAddPassengerModalOpen(true)}
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
                {selectedRouteData?.title || 'Все пассажиры'} 
                <span className="text-white/60 ml-2 text-sm font-normal">
                  ({filteredPassengers.length} из {passengersData.length})
                </span>
              </h3>
              <div className="text-white/60 text-sm mt-1">
                {filteredPassengers.length === passengersData.length 
                  ? 'Все пассажиры' 
                  : `Найдено по запросу: "${searchTerm}"`}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-white/60 text-sm hidden sm:block">
                Сортировка: <span className="text-white">По времени отправления</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Список пассажиров */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          layout
        >
          {filteredPassengers.length === 0 ? (
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
              <div className="text-white font-semibold text-lg mb-2">Пассажиры не найдены</div>
              <div className="text-white/60 text-sm mb-4">
                Попробуйте изменить параметры поиска или фильтры
              </div>
              <motion.button
                onClick={() => { setSearchTerm(''); setFilterStatus('all'); setFilterTransport('all'); }}
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
              {filteredPassengers.map((passenger, index) => (
                <PassengerCard
                  key={passenger.id}
                  passenger={passenger}
                  index={index}
                  onPassengerClick={handlePassengerClick}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Пагинация */}
        {filteredPassengers.length > 0 && (
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
        {isPassengerModalOpen && selectedPassenger && (
          <PassengerModal
            passenger={selectedPassenger}
            onClose={closePassengerModal}
          />
        )}
      </AnimatePresence>

      <AddPassengerModal
        isOpen={isAddPassengerModalOpen}
        onClose={() => setIsAddPassengerModalOpen(false)}
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