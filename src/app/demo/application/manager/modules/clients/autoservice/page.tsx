'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Цветовая палитра для автосервиса
const AUTOSERVICE_COLORS = {
  primary: 'from-gray-950 via-black to-gray-900',
  secondary: 'from-red-900 via-black to-orange-900',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  autoRed: '239, 68, 68',
  autoOrange: '249, 115, 22',
  autoAmber: '245, 158, 11',
  autoBlue: '59, 130, 246',
  autoPurple: '139, 92, 246',
  autoEmerald: '16, 185, 129',
  autoCyan: '34, 211, 238'
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
  color = '#EF4444',
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
            : 'text-amber-400'
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

// Улучшенная карточка автовладельца
const CarOwnerCard = ({
  owner,
  index,
  onOwnerClick,
  viewMode = 'grid'
}: {
  owner: any;
  index: number;
  onOwnerClick?: (owner: any) => void;
  viewMode?: 'grid' | 'list';
}) => {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isListMode = viewMode === 'list';

  const getGradient = (name: string) => {
    const gradients = [
      'from-red-500 to-orange-600',
      'from-amber-500 to-yellow-600',
      'from-blue-500 to-cyan-600',
      'from-emerald-500 to-green-600',
      'from-purple-500 to-pink-600',
      'from-gray-500 to-slate-600'
    ];
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'servicing':
        return { color: 'bg-blue-400', text: '', label: 'servicing' };
      case 'waiting':
        return { color: 'bg-amber-400', text: '', label: 'waiting' };
      case 'completed':
        return { color: 'bg-emerald-400', text: '', label: 'completed' };
      case 'cancelled':
        return { color: 'bg-red-400', text: '', label: 'cancelled' };
      default:
        return { color: 'bg-gray-400', text: '', label: 'unknown' };
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'maintenance': return '🔧';
      case 'repair': return '⚡';
      case 'diagnostics': return '🔍';
      case 'bodywork': return '🎨';
      default: return '🚗';
    }
  };

  const getServiceText = (serviceType: string) => {
    switch (serviceType) {
      case 'maintenance': return 'ТО';
      case 'repair': return 'Ремонт';
      case 'diagnostics': return 'Диагностика';
      case 'bodywork': return 'Кузовные работы';
      default: return 'Обслуживание';
    }
  };

  const statusInfo = getStatusInfo(owner.status);

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
        onClick={() => onOwnerClick?.(owner)}
      >
        <motion.div
          className={`w-14 h-14 rounded-full bg-gradient-to-r ${getGradient(owner.name)} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-lg`}
          whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {owner.initials}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-base group-hover:text-orange-300 transition-colors truncate">
                {owner.name}
              </div>
              <div className="text-white/60 text-sm mt-1">
                {owner.carBrand} {owner.carModel} • {owner.licensePlate} • {getServiceText(owner.serviceType)}
              </div>
            </div>
            
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                <div className="text-white/60 text-sm hidden sm:block">
                  {owner.startTime}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-white/70">
                Пробег: <span className="text-white font-medium">{owner.details.mileage.toLocaleString()} км</span>
              </div>
              <div className="text-white/70">
                Стоимость: <span className="text-white font-medium">{owner.estimatedCost.toLocaleString()} ₽</span>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <ProgressBar
                value={owner.progress}
                color={owner.color}
                height="6px"
                showLabel={false}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {owner.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
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
      onClick={() => onOwnerClick?.(owner)}
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
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${getGradient(owner.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}
            whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {owner.initials}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold text-sm group-hover:text-orange-300 transition-colors truncate">
              {owner.name}
            </div>
            <div className="text-white/60 text-xs">
              {owner.carBrand} {owner.carModel}
            </div>
            <div className="text-white/50 text-[11px] mt-1">
              {owner.licensePlate}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4 flex-1">
        <div className="flex justify-between items-center text-white text-[11px]">
          <span className="text-white/60 flex items-center gap-1">
            {getServiceIcon(owner.serviceType)}
            {getServiceText(owner.serviceType)}
          </span>
          <span className="font-medium bg-white/10 px-2 py-1 rounded-full">
            {owner.startTime}
          </span>
        </div>
        
        <div className="flex justify-between text-white text-[11px]">
          <span className="text-white/60">Пробег</span>
          <span className="font-medium">{owner.details.mileage.toLocaleString()} км</span>
        </div>
        
        <ProgressBar
          value={owner.progress}
          label="Прогресс обслуживания"
          color={owner.color}
          height="6px"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-white/60 mb-3">
        <span>Стоимость</span>
        <span className="font-medium text-emerald-400">{owner.estimatedCost.toLocaleString()} ₽</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {owner.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
          <motion.span
            key={tagIndex}
            className="text-[10px] bg-white/8 px-2 py-1 rounded-full border border-white/15 text-white/80 group-hover:bg-white/14 transition-colors truncate max-w-[80px]"
            whileHover={!isMobile ? { scale: 1.05 } : {}}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {tag}
          </motion.span>
        ))}
        {owner.tags.length > 3 && (
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full border border-white/10 text-white/60">
            +{owner.tags.length - 3}
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

// Улучшенная карточка типа услуги
const ServiceTypeCard = ({
  service,
  isSelected,
  onClick,
  index
}: {
  service: any;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) => {
  const device = useResponsive();
  const isMobile = device === 'mobile';

  const getServiceIcon = (title: string) => {
    if (title.includes('ТО')) return '🔧';
    if (title.includes('Ремонт')) return '⚡';
    if (title.includes('Диагностика')) return '🔍';
    if (title.includes('Кузовные')) return '🎨';
    return '🚗';
  };

  return (
    <motion.div
      className={`flex flex-col justify-between relative aspect-[4/3] min-h-[200px] sm:min-h-[280px] w-full max-w-full px-4 py-4 sm:px-5 sm:py-5 rounded-xl sm:rounded-2xl border font-light overflow-hidden transition-all duration-300 ease-in-out cursor-pointer ${
        isSelected 
          ? 'border-red-500/40 ring-2 ring-red-500/20 bg-red-500/5' 
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
          style={{ color: `rgb(${service.glowColor})` }}
          whileHover={{ scale: 1.05 }}
        >
          {service.value} {service.metric}
        </motion.span>
        {isSelected && (
          <motion.div
            className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-1 border border-red-500/40 text-[11px] text-red-300"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420 }}
          >
            <motion.span 
              className="w-1.5 h-1.5 rounded-full bg-red-300"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>Выбрано</span>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col relative text-white z-10 flex-1">
        <motion.h3 
          className="font-semibold text-[15px] sm:text-[17px] mb-1.5 sm:mb-2 flex items-center gap-2"
          whileHover={{ x: 2 }}
        >
          <span>{getServiceIcon(service.title)}</span>
          {service.title}
        </motion.h3>
        <p className="text-white/70 text-xs sm:text-[13px] leading-4 sm:leading-5 mb-3 sm:mb-4 flex-1">
          {service.description}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
          {[
            { value: service.avgServiceTime, label: 'Среднее время', color: 'text-white' },
            { value: service.completionRate, label: 'Выполнение', color: 'text-emerald-300' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="text-center p-1.5 sm:p-2.5 bg-white/6 rounded-lg backdrop-blur-sm border border-white/8"
              whileHover={{ scale: 1.03, y: -1 }}
            >
              <div className={`font-semibold text-xs sm:text-sm ${item.color}`}>
                {item.value}{typeof item.value === 'number' && i === 1 ? '%' : i === 0 ? ' ч' : ''}
              </div>
              <div className="text-white/60 text-[11px]">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <ProgressBar
          value={service.details.satisfactionRate}
          label="Удовлетворенность клиентов"
          color={`rgb(${service.glowColor})`}
          showLabel
          height="6px"
        />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 70% 10%, rgba(${service.glowColor}, 0.35) 0%, transparent 60%)`
        }}
        animate={{
          background: [
            `radial-gradient(circle at 70% 10%, rgba(${service.glowColor}, 0.35) 0%, transparent 60%)`,
            `radial-gradient(circle at 30% 80%, rgba(${service.glowColor}, 0.35) 0%, transparent 60%)`,
            `radial-gradient(circle at 70% 10%, rgba(${service.glowColor}, 0.35) 0%, transparent 60%)`
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
  filterService,
  setFilterService,
  onAddOwner,
  onGenerateReport,
  onShowAnalytics,
  viewMode,
  setViewMode
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterService: string;
  setFilterService: (service: string) => void;
  onAddOwner: () => void;
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
          onClick={onAddOwner}
          className="flex-1 sm:flex-initial px-4 py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 backdrop-blur-sm"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            +
          </motion.span>
          <span>{isMobile ? 'Добавить' : 'Добавить клиента'}</span>
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

// Модальное окно добавления автовладельца
const AddOwnerModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    carBrand: '',
    carModel: '',
    carYear: '',
    licensePlate: '',
    serviceType: '',
    phone: ''
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
    // Обработка добавления автовладельца
    console.log('Добавление автовладельца:', formData);
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
              🚗 Добавить нового клиента
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
                <label className="text-white text-sm mb-2 block">ФИО владельца</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Иванов Алексей Петрович"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Марка авто</label>
                <input
                  type="text"
                  required
                  value={formData.carBrand}
                  onChange={(e) => setFormData({...formData, carBrand: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Toyota"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Модель авто</label>
                <input
                  type="text"
                  required
                  value={formData.carModel}
                  onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Camry"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Год выпуска</label>
                <input
                  type="number"
                  required
                  value={formData.carYear}
                  onChange={(e) => setFormData({...formData, carYear: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="2020"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Номерной знак</label>
                <input
                  type="text"
                  required
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="А123ВС777"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Тип услуги</label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="">Выберите услугу</option>
                  <option value="maintenance">Техническое обслуживание</option>
                  <option value="repair">Ремонтные работы</option>
                  <option value="diagnostics">Диагностика</option>
                  <option value="bodywork">Кузовные работы</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-white text-sm mb-2 block">Телефон</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="+7 (900) 123-45-67"
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
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Добавить клиента
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
    totalOwners: 156,
    activeServices: 42,
    avgSatisfaction: 94.5,
    monthlyGrowth: 18.2,
    serviceDistribution: [
      { name: 'Техническое обслуживание', value: 32, color: `rgba(${AUTOSERVICE_COLORS.autoOrange}, 0.9)` },
      { name: 'Ремонтные работы', value: 28, color: `rgba(${AUTOSERVICE_COLORS.autoBlue}, 0.9)` },
      { name: 'Диагностика', value: 18, color: `rgba(${AUTOSERVICE_COLORS.autoEmerald}, 0.9)` },
      { name: 'Кузовные работы', value: 12, color: `rgba(${AUTOSERVICE_COLORS.autoPurple}, 0.9)` },
      { name: 'Другие услуги', value: 10, color: `rgba(${AUTOSERVICE_COLORS.autoCyan}, 0.9)` }
    ],
    monthlyStats: [
      { month: 'Янв', owners: 120, revenue: 1450000 },
      { month: 'Фев', owners: 132, revenue: 1580000 },
      { month: 'Мар', owners: 141, revenue: 1680000 },
      { month: 'Апр', owners: 148, revenue: 1750000 },
      { month: 'Май', owners: 152, revenue: 1820000 },
      { month: 'Июн', owners: 156, revenue: 1890000 }
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
              📊 Аналитика автосервиса
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
                  <div className="text-2xl font-bold text-white mb-1">{analyticsData.totalOwners}</div>
                  <div className="text-white/60 text-sm">Клиентов сегодня</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{analyticsData.activeServices}</div>
                  <div className="text-white/60 text-sm">В обслуживании</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400 mb-1">{analyticsData.avgSatisfaction}%</div>
                  <div className="text-white/60 text-sm">Удовлетворенность</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-red-400 mb-1">+{analyticsData.monthlyGrowth}%</div>
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
              <h4 className="text-white font-semibold text-lg mb-4">Распределение по услугам</h4>
              <PieChart
                data={analyticsData.serviceDistribution}
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
                      value={(stat.owners / 200) * 100}
                      color="#EF4444"
                      height="20px"
                      showLabel={false}
                    />
                  </div>
                  <div className="text-right text-xs text-white/60 w-20">
                    {stat.owners} авто
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
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors backdrop-blur-sm"
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
  const [reportType, setReportType] = useState('daily');

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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
              >
                <option value="daily">Ежедневный отчет</option>
                <option value="weekly">Недельный отчет</option>
                <option value="monthly">Месячный отчет</option>
                <option value="services">По услугам</option>
                <option value="mechanics">По механикам</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Период</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                />
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
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
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors backdrop-blur-sm"
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

// Улучшенное модальное окно автовладельца
const OwnerModal = ({ owner, onClose }: { owner: any; onClose: () => void }) => {
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

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'maintenance': return '🔧';
      case 'repair': return '⚡';
      case 'diagnostics': return '🔍';
      case 'bodywork': return '🎨';
      default: return '🚗';
    }
  };

  const getServiceText = (serviceType: string) => {
    switch (serviceType) {
      case 'maintenance': return 'Техническое обслуживание';
      case 'repair': return 'Ремонтные работы';
      case 'diagnostics': return 'Диагностика';
      case 'bodywork': return 'Кузовные работы';
      default: return 'Обслуживание';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'servicing': return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
      case 'waiting': return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'completed': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
      case 'cancelled': return 'bg-red-500/15 text-red-400 border-red-500/40';
      default: return 'bg-gray-500/15 text-gray-400 border-gray-500/40';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'servicing': return 'В обслуживании';
      case 'waiting': return 'Ожидание';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return 'Неизвестно';
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
              Данные клиента
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
                className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                {owner.initials}
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-2xl mb-2 truncate">{owner.name}</h4>
                <div className="text-white/60 text-sm mb-3">
                  {owner.carBrand} {owner.carModel} • {owner.licensePlate} • {owner.carYear} год
                </div>
                <div className="flex flex-wrap gap-2">
                  <motion.div 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(owner.status)}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {getStatusText(owner.status)}
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    {getServiceIcon(owner.serviceType)} {getServiceText(owner.serviceType)}
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    Пробег: {owner.details.mileage.toLocaleString()} км
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
                      { label: 'Телефон', value: owner.details.phone },
                      { label: 'Email', value: owner.details.email },
                      { label: 'VIN код', value: owner.details.vin }
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
                    <span>🚗</span> Информация об автомобиле
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Марка', value: owner.carBrand },
                      { label: 'Модель', value: owner.carModel },
                      { label: 'Год выпуска', value: owner.carYear },
                      { label: 'Номерной знак', value: owner.licensePlate }
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
                    <span>🔄</span> Текущее обслуживание
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Услуга', value: owner.currentService },
                      { label: 'Время начала', value: owner.startTime },
                      { label: 'Расчетное время', value: owner.estimatedTime }
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
                    <div className="pt-2">
                      <div className="text-white/60 text-sm mb-2">Прогресс обслуживания</div>
                      <ProgressBar
                        value={owner.progress}
                        color={owner.color}
                        showLabel={false}
                        height="8px"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
                  whileHover={{ y: -2 }}
                >
                  <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>💰</span> Стоимость
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Расчетная стоимость:</span>
                      <span className="text-emerald-400 font-semibold">{owner.estimatedCost.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Фактическая стоимость:</span>
                      <span className="text-white font-semibold">
                        {owner.actualCost > 0 ? `${owner.actualCost.toLocaleString()} ₽` : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Предпочтительный механик:</span>
                      <span className="text-white font-medium">
                        {owner.details.preferredMechanic || 'Не назначен'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -2 }}
            >
              <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>🏷️</span> Теги и особенности
              </h5>
              <div className="flex flex-wrap gap-2">
                {owner.tags.map((tag: string, index: number) => (
                  <motion.span
                    key={index}
                    className="px-3 py-1 bg-white/10 rounded-full text-white text-xs border border-white/20 backdrop-blur-sm"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {owner.details.notes && (
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
                  {owner.details.notes}
                </div>
              </motion.div>
            )}
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
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Обновить статус
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Данные
const serviceTypes = [
  {
    id: 'all',
    title: '🚗 Все автовладельцы',
    description: 'Все услуги • Полная статистика • Управление обслуживанием',
    value: '156',
    metric: 'Авто сегодня',
    color: '#060010',
    glowColor: AUTOSERVICE_COLORS.autoRed,
    ownersCount: 156,
    avgServiceTime: 2.5,
    completionRate: 88,
    growth: '+18%',
    commonServices: ['Замена масла', 'Диагностика', 'Тормозная система', 'Шиномонтаж'],
    details: {
      activeServices: 42,
      totalCapacity: 68,
      avgCost: 12500,
      mechanicsCount: 23,
      satisfactionRate: 94.5
    }
  },
  {
    id: 'maintenance',
    title: '🔧 Техническое обслуживание',
    description: 'Плановое ТО • Замена жидкостей • Фильтры • Настройки',
    value: '67',
    metric: 'Авто',
    color: '#060010',
    glowColor: AUTOSERVICE_COLORS.autoOrange,
    ownersCount: 67,
    avgServiceTime: 1.8,
    completionRate: 92,
    growth: '+15%',
    commonServices: ['Замена масла', 'Фильтры', 'Жидкости', 'Диагностика'],
    details: {
      activeServices: 18,
      totalCapacity: 25,
      avgCost: 8500,
      mechanicsCount: 8,
      satisfactionRate: 96.2
    }
  },
  {
    id: 'repair',
    title: '⚡ Ремонтные работы',
    description: 'Электроника • Двигатель • Трансмиссия • Сложный ремонт',
    value: '45',
    metric: 'Авто',
    color: '#060010',
    glowColor: AUTOSERVICE_COLORS.autoBlue,
    ownersCount: 45,
    avgServiceTime: 4.2,
    completionRate: 78,
    growth: '+25%',
    commonServices: ['Ремонт двигателя', 'Электроника', 'Трансмиссия', 'Топливная система'],
    details: {
      activeServices: 12,
      totalCapacity: 18,
      avgCost: 23400,
      mechanicsCount: 6,
      satisfactionRate: 91.8
    }
  },
  {
    id: 'bodywork',
    title: '🎨 Кузовные работы',
    description: 'Покраска • Рихтовка • Замена деталей • Антикоррозийная обработка',
    value: '28',
    metric: 'Авто',
    color: '#060010',
    glowColor: AUTOSERVICE_COLORS.autoPurple,
    ownersCount: 28,
    avgServiceTime: 3.5,
    completionRate: 85,
    growth: '+32%',
    commonServices: ['Покраска', 'Рихтовка', 'Замена стекол', 'Полировка'],
    details: {
      activeServices: 8,
      totalCapacity: 12,
      avgCost: 18700,
      mechanicsCount: 5,
      satisfactionRate: 93.7
    }
  }
];

const carOwnersData = [
  {
    id: 1,
    name: 'Иванов Алексей Петрович',
    initials: 'ИА',
    age: 42,
    carBrand: 'Toyota',
    carModel: 'Camry',
    carYear: 2020,
    licensePlate: 'А123ВС777',
    status: 'servicing',
    serviceType: 'maintenance',
    currentService: 'Плановое ТО 60,000 км',
    estimatedCost: 12500,
    actualCost: 0,
    estimatedTime: '2.5 часа',
    startTime: '09:30',
    endTime: '12:00',
    progress: 65,
    color: '#EF4444',
    tags: ['Постоянный клиент', 'Тойота', 'Полное ТО', 'Срочное'],
    details: {
      phone: '+7 (915) 123-45-67',
      email: 'a.ivanov@mail.ru',
      vin: 'JTDKB20U987654321',
      mileage: 59800,
      lastService: '15.01.2024',
      nextService: '15.07.2024',
      serviceHistory: 8,
      insurance: 'АльфаСтрахование',
      preferredMechanic: 'Петров И.С.',
      notes: 'Клиент предпочитает оригинальные запчасти. Требуется замена масла и фильтров.'
    }
  },
  {
    id: 2,
    name: 'Петрова Мария Сергеевна',
    initials: 'ПМ',
    age: 35,
    carBrand: 'BMW',
    carModel: 'X5',
    carYear: 2022,
    licensePlate: 'У456ОР777',
    status: 'waiting',
    serviceType: 'repair',
    currentService: 'Ремонт электронной системы',
    estimatedCost: 34200,
    actualCost: 0,
    estimatedTime: '5 часов',
    startTime: '11:00',
    endTime: '16:00',
    progress: 0,
    color: '#3B82F6',
    tags: ['Новый клиент', 'BMW', 'Электроника', 'Гарантия'],
    details: {
      phone: '+7 (916) 234-56-78',
      email: 'm.petrova@mail.ru',
      vin: 'WBAKS810L0G123456',
      mileage: 23400,
      lastService: '20.02.2024',
      nextService: '20.08.2024',
      serviceHistory: 3,
      insurance: 'Ингосстрах',
      preferredMechanic: 'Сидоров А.В.',
      notes: 'Требуется диагностика CAN-шины. Возможны проблемы с датчиками.'
    }
  },
  {
    id: 3,
    name: 'Сидоров Дмитрий Иванович',
    initials: 'СД',
    age: 28,
    carBrand: 'Hyundai',
    carModel: 'Solaris',
    carYear: 2019,
    licensePlate: 'В789ТТ777',
    status: 'completed',
    serviceType: 'bodywork',
    currentService: 'Покраска бампера',
    estimatedCost: 15600,
    actualCost: 14200,
    estimatedTime: '3 часа',
    startTime: '08:00',
    endTime: '11:00',
    progress: 100,
    color: '#8B5CF6',
    tags: ['Постоянный', 'Хендай', 'Кузовные работы', 'Страховой случай'],
    details: {
      phone: '+7 (917) 345-67-89',
      email: 'd.sidorov@mail.ru',
      vin: 'Z94CB41BAGR123456',
      mileage: 67800,
      lastService: '10.03.2024',
      nextService: '10.09.2024',
      serviceHistory: 12,
      insurance: 'Росгосстрах',
      preferredMechanic: 'Козлов П.Н.',
      notes: 'Работа выполнена по страховке. Качество покраски соответствует оригиналу.'
    }
  },
  {
    id: 4,
    name: 'Козлова Анна Викторовна',
    initials: 'КА',
    age: 31,
    carBrand: 'Kia',
    carModel: 'Rio',
    carYear: 2021,
    licensePlate: 'С321АВ777',
    status: 'servicing',
    serviceType: 'diagnostics',
    currentService: 'Комплексная диагностика',
    estimatedCost: 4500,
    actualCost: 0,
    estimatedTime: '1.5 часа',
    startTime: '10:30',
    endTime: '12:00',
    progress: 40,
    color: '#10B981',
    tags: ['Новый', 'Киа', 'Диагностика', 'Первый визит'],
    details: {
      phone: '+7 (918) 456-78-90',
      email: 'a.kozlova@mail.ru',
      vin: 'KNAFX4A80E5123456',
      mileage: 18900,
      lastService: 'Не обслуживалась',
      nextService: 'По результатам диагностики',
      serviceHistory: 0,
      insurance: 'Согласие',
      preferredMechanic: '',
      notes: 'Первое посещение сервиса. Требуется полная диагностика всех систем.'
    }
  },
  {
    id: 5,
    name: 'Громов Александр Игоревич',
    initials: 'ГА',
    age: 45,
    carBrand: 'Mercedes-Benz',
    carModel: 'E-Class',
    carYear: 2018,
    licensePlate: 'О555ОО777',
    status: 'waiting',
    serviceType: 'repair',
    currentService: 'Замена тормозных колодок',
    estimatedCost: 8900,
    actualCost: 0,
    estimatedTime: '2 часа',
    startTime: '14:00',
    endTime: '16:00',
    progress: 0,
    color: '#F59E0B',
    tags: ['VIP', 'Мерседес', 'Тормозная система', 'Срочно'],
    details: {
      phone: '+7 (919) 567-89-01',
      email: 'a.gromov@mail.ru',
      vin: 'WDD2130421A123456',
      mileage: 89200,
      lastService: '12.04.2024',
      nextService: '12.10.2024',
      serviceHistory: 15,
      insurance: 'РЕСО-Гарантия',
      preferredMechanic: 'Петров И.С.',
      notes: 'VIP клиент. Требуется срочная замена передних тормозных колодок.'
    }
  },
  {
    id: 6,
    name: 'Николаева Елена Игоревна',
    initials: 'НЕ',
    age: 29,
    carBrand: 'Volkswagen',
    carModel: 'Tiguan',
    carYear: 2020,
    licensePlate: 'У123УУ777',
    status: 'completed',
    serviceType: 'maintenance',
    currentService: 'Сезонное ТО',
    estimatedCost: 11200,
    actualCost: 11200,
    estimatedTime: '3 часа',
    startTime: '08:30',
    endTime: '11:30',
    progress: 100,
    color: '#EC4899',
    tags: ['Постоянный', 'Фольксваген', 'Сезонное ТО', 'Мойка'],
    details: {
      phone: '+7 (920) 678-90-12',
      email: 'e.nikolaeva@mail.ru',
      vin: 'WVGZZZ5NZKW123456',
      mileage: 45600,
      lastService: '15.05.2024',
      nextService: '15.11.2024',
      serviceHistory: 6,
      insurance: 'ВТБ Страхование',
      preferredMechanic: 'Сидоров А.В.',
      notes: 'Обслуживание завершено. Клиент доволен качеством работ.'
    }
  }
];

const ownerMetrics = [
  { category: 'Авто сегодня', value: '156', trend: 'up', color: '#EF4444', icon: '🚗', change: '+12.4%' },
  { category: 'В обслуживании', value: '42', trend: 'stable', color: '#3B82F6', icon: '🔧', change: '+2.1%' },
  { category: 'Свободных мест', value: '26', trend: 'down', color: '#8B5CF6', icon: '🅿️', change: '-5.8%' },
  { category: 'Среднее время', value: '2.5 ч', trend: 'down', color: '#F59E0B', icon: '⏱️', change: '-0.3%' },
  { category: 'Завершено', value: '89', trend: 'up', color: '#10B981', icon: '✅', change: '+8.7%' },
  { category: 'Удовлетворенность', value: '94.5%', trend: 'up', color: '#EC4899', icon: '⭐', change: '+1.2%' }
];

const serviceDistribution = [
  { name: 'Техобслуживание', value: 32, color: `rgba(${AUTOSERVICE_COLORS.autoOrange}, 0.9)` },
  { name: 'Ремонтные работы', value: 28, color: `rgba(${AUTOSERVICE_COLORS.autoBlue}, 0.9)` },
  { name: 'Диагностика', value: 18, color: `rgba(${AUTOSERVICE_COLORS.autoEmerald}, 0.9)` },
  { name: 'Кузовные работы', value: 12, color: `rgba(${AUTOSERVICE_COLORS.autoPurple}, 0.9)` },
  { name: 'Другие услуги', value: 10, color: `rgba(${AUTOSERVICE_COLORS.autoCyan}, 0.9)` }
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
export default function CarOwnersCatalog() {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isAddOwnerModalOpen, setIsAddOwnerModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
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
    const anyModalOpen = isOwnerModalOpen || isAddOwnerModalOpen || isAnalyticsModalOpen || isReportModalOpen;
    if (anyModalOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [isOwnerModalOpen, isAddOwnerModalOpen, isAnalyticsModalOpen, isReportModalOpen, lockScroll, unlockScroll]);

  // Закрытие модалок по Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOwnerModalOpen(false);
        setIsAddOwnerModalOpen(false);
        setIsAnalyticsModalOpen(false);
        setIsReportModalOpen(false);
        setSelectedOwner(null);
      }
    };
    if (isOwnerModalOpen || isAddOwnerModalOpen || isAnalyticsModalOpen || isReportModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOwnerModalOpen, isAddOwnerModalOpen, isAnalyticsModalOpen, isReportModalOpen]);

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleOwnerClick = (owner: any) => {
    setSelectedOwner(owner);
    setIsOwnerModalOpen(true);
  };

  const closeOwnerModal = () => {
    setIsOwnerModalOpen(false);
    setSelectedOwner(null);
  };

  // Фильтрация автовладельцев
  const filteredOwners = carOwnersData.filter(owner => {
    const matchesService = selectedService === 'all' || 
      (selectedService === 'maintenance' && owner.serviceType === 'maintenance') ||
      (selectedService === 'repair' && owner.serviceType === 'repair') ||
      (selectedService === 'bodywork' && owner.serviceType === 'bodywork');

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query ||
      owner.name.toLowerCase().includes(query) ||
      owner.carBrand.toLowerCase().includes(query) ||
      owner.licensePlate.toLowerCase().includes(query) ||
      owner.tags.some((tag: string) => tag.toLowerCase().includes(query));

    const matchesStatus = filterStatus === 'all' || owner.status === filterStatus;
    const matchesServiceFilter = filterService === 'all' || owner.serviceType === filterService;

    return matchesService && matchesSearch && matchesStatus && matchesServiceFilter;
  });

  const selectedServiceData = serviceTypes.find(service => service.id === selectedService);

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
    <div className={`min-h-screen bg-gradient-to-br ${AUTOSERVICE_COLORS.primary}`}>
      <style jsx global>{`
        body.no-scroll {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fca5a5 0%, #ef4444 35%, #dc2626 100%);
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
                    🚗
                  </motion.span>
                  <span className="gradient-text">База автовладельцев</span>
                </motion.h1>
                <motion.p
                  className="text-white/65 text-sm sm:text-base md:text-[15px] mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 }}
                >
                  <span className="text-emerald-400 font-medium">156 авто сегодня</span> • 4 типа услуг
                  • <span className="text-red-400 font-medium">94.5% удовлетворенность</span>
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-2 sm:gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                >
                  {[
                    { color: 'bg-emerald-400', text: '42 авто в обслуживании' },
                    { color: 'bg-amber-400', text: '26 свободных мест' },
                    { color: 'bg-red-400', text: '89 завершено сегодня' }
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
                  className="inline-flex items-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg shadow-red-500/25 backdrop-blur-sm"
                  whileHover={{ scale: 1.03, y: -1 }}
                >
                  <span className="text-xs text-red-50/80 mr-2 hidden sm:inline">Статус системы</span>
                  <span className="text-sm sm:text-base font-semibold text-white">Активна</span>
                </motion.div>
                <div className="text-white/60 text-[11px] sm:text-xs mt-1">
                  Автообновление каждые 5 мин • Сегодня
                </div>
              </motion.div>
            </div>
            <div className="pointer-events-none absolute top-[-40px] right-[-40px] w-28 h-28 sm:w-40 sm:h-40 bg-red-500/16 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-40px] left-[-40px] w-24 h-24 sm:w-32 sm:h-32 bg-orange-500/18 rounded-full blur-3xl" />
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
            {ownerMetrics.map((metric, index) => (
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

        {/* Типы услуг */}
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
              🛠️
            </motion.span>
            Типы услуг
          </h3>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {serviceTypes.map((service, index) => (
              <ServiceTypeCard
                key={service.id}
                service={service}
                isSelected={selectedService === service.id}
                onClick={() => handleServiceClick(service.id)}
                index={index}
              />
            ))}
          </div>
        </motion.section>

        {/* Аналитика выбранной услуги */}
        {selectedService && selectedServiceData && (
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
                    Статистика услуги: {selectedServiceData.title}
                  </h3>
                  
                  <div className={`grid ${isMobile ? 'grid-cols-2' : 'sm:grid-cols-4'} gap-3 mb-4`}>
                    {[
                      { label: 'Активные услуги', value: `${selectedServiceData.details.activeServices}/${selectedServiceData.details.totalCapacity}`, color: 'text-white' },
                      { label: 'Механиков', value: selectedServiceData.details.mechanicsCount, color: 'text-emerald-400' },
                      { label: 'Средняя стоимость', value: `${selectedServiceData.details.avgCost.toLocaleString()} ₽`, color: 'text-white' },
                      { label: 'Удовлетворенность', value: `${selectedServiceData.details.satisfactionRate}%`, color: 'text-white' }
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
                      value={selectedServiceData.details.satisfactionRate}
                      label="Удовлетворенность клиентов"
                      color={`rgb(${selectedServiceData.glowColor})`}
                      showLabel
                    />
                    <ProgressBar
                      value={selectedServiceData.completionRate}
                      label="Выполнение услуг"
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
                    data={serviceDistribution}
                    size={isMobile ? 100 : 120}
                    className="mb-3"
                  />
                  <div className="text-center">
                    <div className="text-white font-semibold text-sm">Распределение услуг</div>
                    <div className="text-white/60 text-xs">Всего {selectedServiceData.ownersCount} авто</div>
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
            filterService={filterService}
            setFilterService={setFilterService}
            onAddOwner={() => setIsAddOwnerModalOpen(true)}
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
                {selectedServiceData?.title || 'Все автовладельцы'} 
                <span className="text-white/60 ml-2 text-sm font-normal">
                  ({filteredOwners.length} из {carOwnersData.length})
                </span>
              </h3>
              <div className="text-white/60 text-sm mt-1">
                {filteredOwners.length === carOwnersData.length 
                  ? 'Все автовладельцы' 
                  : `Найдено по запросу: "${searchTerm}"`}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-white/60 text-sm hidden sm:block">
                Сортировка: <span className="text-white">По времени начала</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Список автовладельцев */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          layout
        >
          {filteredOwners.length === 0 ? (
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
              <div className="text-white font-semibold text-lg mb-2">Автовладельцы не найдены</div>
              <div className="text-white/60 text-sm mb-4">
                Попробуйте изменить параметры поиска или фильтры
              </div>
              <motion.button
                onClick={() => { setSearchTerm(''); setFilterStatus('all'); setFilterService('all'); }}
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
              {filteredOwners.map((owner, index) => (
                <CarOwnerCard
                  key={owner.id}
                  owner={owner}
                  index={index}
                  onOwnerClick={handleOwnerClick}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Пагинация */}
        {filteredOwners.length > 0 && (
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
        {isOwnerModalOpen && selectedOwner && (
          <OwnerModal
            owner={selectedOwner}
            onClose={closeOwnerModal}
          />
        )}
      </AnimatePresence>

      <AddOwnerModal
        isOpen={isAddOwnerModalOpen}
        onClose={() => setIsAddOwnerModalOpen(false)}
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