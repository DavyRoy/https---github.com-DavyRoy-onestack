'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Цветовая палитра для курьерской темы
const COURIER_COLORS = {
  primary: 'from-gray-950 via-black to-gray-900',
  secondary: 'from-orange-900 via-black to-amber-900',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  courierOrange: '249, 115, 22',
  courierAmber: '245, 158, 11',
  courierEmerald: '16, 185, 129',
  courierBlue: '59, 130, 246',
  courierRed: '239, 68, 68',
  courierPurple: '139, 92, 246',
  courierCyan: '34, 211, 238'
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
  color = '#F97316',
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
          {showLabel && <span className="text-white/70">{label}</span>}
          {showValue && <span className="font-medium">{Math.round(percentage)}%</span>}
        </div>
      ) : null}
      <div className="w-full bg-white/8 rounded-full overflow-hidden" style={{ height }}>
        <motion.div
          className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}60`,
            background: `linear-gradient(90deg, ${color}80, ${color})`
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

// Компонент звезд рейтинга
const RatingStars = ({ rating, size = 'sm', showValue = false }: { 
  rating: number; 
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}) => {
  const sizeClass = {
    sm: 'w-3 h-3 text-[10px]',
    md: 'w-4 h-4 text-xs',
    lg: 'w-5 h-5 text-sm'
  }[size];

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div
          key={star}
          className={`${sizeClass} ${
            star <= rating ? 'text-amber-400' : 'text-white/20'
          } transition-colors duration-200`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          ★
        </motion.div>
      ))}
      {showValue && (
        <span className="text-white/60 text-xs ml-1.5 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Компонент статуса курьера
const StatusBadge = ({ status, size = 'sm' }: { status: string; size?: 'sm' | 'md' }) => {
  const statusConfig = {
    active: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', text: '', icon: '🟢' },
    delivering: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', text: '', icon: '📦' },
    break: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/40', text: '', icon: '☕' },
    offline: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/40', text: '', icon: '⚫' }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs';
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;

  return (
    <motion.div
      className={`${config.color} ${sizeClass} rounded-full border backdrop-blur-sm flex items-center gap-1.5`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <span className="text-[10px]">{config.icon}</span>
      {config.text}
    </motion.div>
  );
};

// Компонент иконки транспорта
const VehicleIcon = ({ vehicle, size = 'sm' }: { vehicle: string; size?: 'sm' | 'md' }) => {
  const icons = {
    bike: '🚲',
    scooter: '🛵',
    car: '🚗',
    foot: '🚶'
  };

  const sizeClass = size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <motion.span 
      className={sizeClass}
      whileHover={{ scale: 1.2, rotate: 5 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {icons[vehicle as keyof typeof icons] || '🚗'}
    </motion.span>
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

// Улучшенная карточка курьера
const CourierCard = ({
  courier,
  index,
  onCourierClick,
  viewMode = 'grid'
}: {
  courier: any;
  index: number;
  onCourierClick?: (courier: any) => void;
  viewMode?: 'grid' | 'list';
}) => {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isListMode = viewMode === 'list';

  const getGradient = (name: string) => {
    const gradients = [
      'from-orange-500 to-amber-600',
      'from-amber-500 to-yellow-600',
      'from-emerald-500 to-green-600',
      'from-blue-500 to-cyan-600',
      'from-purple-500 to-pink-600',
      'from-red-500 to-orange-600'
    ];
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

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
        onClick={() => onCourierClick?.(courier)}
      >
        <motion.div
          className={`w-14 h-14 rounded-full bg-gradient-to-r ${getGradient(courier.name)} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-lg relative`}
          whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {courier.initials}
          <div className="absolute -bottom-1 -right-1 bg-black/80 rounded-full p-0.5">
            <VehicleIcon vehicle={courier.vehicle} size="sm" />
          </div>
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-base group-hover:text-amber-300 transition-colors truncate">
                {courier.name}
              </div>
              <div className="text-white/60 text-sm mt-1">
                {courier.age} лет • {courier.vehicle === 'bike' ? 'Велосипед' : 
                courier.vehicle === 'scooter' ? 'Самокат' : 
                courier.vehicle === 'car' ? 'Автомобиль' : 'Пеший'} • {courier.details.experience} опыта
              </div>
            </div>
            
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <StatusBadge status={courier.status} size="sm" />
              <div className="text-white/60 text-sm hidden sm:block">
                {courier.lastActive}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-white/70">
                Заказов: <span className="text-white font-medium">{courier.completedOrders}</span>
              </div>
              <div className="text-white/70">
                Рейтинг: <span className="text-white font-medium">{courier.rating}</span>
              </div>
              <div className="text-white/70">
                Заработок: <span className="text-amber-400 font-medium">{courier.todayEarnings} ₽</span>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <ProgressBar
                value={courier.details.performance.onTimeRate}
                color={courier.color}
                height="6px"
                showLabel={false}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {courier.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
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
      onClick={() => onCourierClick?.(courier)}
    >
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <StatusBadge status={courier.status} size="sm" />
      </div>

      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <motion.div
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${getGradient(courier.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg relative`}
            whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {courier.initials}
            <div className="absolute -bottom-1 -right-1 bg-black/80 rounded-full p-0.5">
              <VehicleIcon vehicle={courier.vehicle} size="sm" />
            </div>
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold text-sm group-hover:text-amber-300 transition-colors truncate">
              {courier.name}
            </div>
            <div className="text-white/60 text-xs">
              {courier.age} лет • {courier.vehicle === 'bike' ? 'Велосипед' : 
              courier.vehicle === 'scooter' ? 'Самокат' : 
              courier.vehicle === 'car' ? 'Автомобиль' : 'Пеший'}
            </div>
            <div className="text-white/50 text-[11px] mt-1">
              {courier.details.experience} опыта
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4 flex-1">
        <div className="flex justify-between items-center text-white text-[11px]">
          <span className="text-white/60">Заказов сегодня</span>
          <span className="font-medium bg-white/10 px-2 py-1 rounded-full">
            {courier.completedOrders}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-[11px]">Рейтинг</span>
          <RatingStars rating={courier.rating} size="sm" showValue />
        </div>

        <ProgressBar
          value={courier.details.performance.onTimeRate}
          label="Своевременность"
          color={courier.color}
          height="6px"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-white/60 mb-3">
        <span>Локация</span>
        <span className="font-medium text-white/70 truncate max-w-[120px] text-right">{courier.location}</span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-white/60 mb-3">
        <span>Заработок</span>
        <span className="font-medium text-amber-400">{courier.todayEarnings} ₽</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {courier.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
          <motion.span
            key={tagIndex}
            className="text-[10px] bg-white/8 px-2 py-1 rounded-full border border-white/15 text-white/80 group-hover:bg-white/14 transition-colors truncate max-w-[80px]"
            whileHover={!isMobile ? { scale: 1.05 } : {}}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {tag}
          </motion.span>
        ))}
        {courier.tags.length > 3 && (
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full border border-white/10 text-white/60">
            +{courier.tags.length - 3}
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

// Улучшенная карточка зоны
const ZoneCard = ({
  zone,
  isSelected,
  onClick,
  index
}: {
  zone: any;
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
          ? 'border-amber-500/40 ring-2 ring-amber-500/20 bg-amber-500/5' 
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
          style={{ color: `rgb(${zone.glowColor})` }}
          whileHover={{ scale: 1.05 }}
        >
          {zone.value} {zone.metric}
        </motion.span>
        {isSelected && (
          <motion.div
            className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-1 border border-amber-500/40 text-[11px] text-amber-300"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420 }}
          >
            <motion.span 
              className="w-1.5 h-1.5 rounded-full bg-amber-300"
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
          {zone.title}
        </motion.h3>
        <p className="text-white/70 text-xs sm:text-[13px] leading-4 sm:leading-5 mb-3 sm:mb-4 flex-1">
          {zone.description}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
          {[
            { value: zone.avgDeliveryTime, label: 'Среднее время', color: 'text-white' },
            { value: zone.orderVolume, label: 'Заказов в день', color: 'text-amber-300' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="text-center p-1.5 sm:p-2.5 bg-white/6 rounded-lg backdrop-blur-sm border border-white/8"
              whileHover={{ scale: 1.03, y: -1 }}
            >
              <div className={`font-semibold text-xs sm:text-sm ${item.color}`}>
                {item.value}{i === 0 ? ' мин' : ''}
              </div>
              <div className="text-white/60 text-[11px]">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <ProgressBar
          value={zone.details.successRate}
          label="Успешность доставки"
          color={`rgb(${zone.glowColor})`}
          showLabel
          height="6px"
        />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 70% 10%, rgba(${zone.glowColor}, 0.35) 0%, transparent 60%)`
        }}
        animate={{
          background: [
            `radial-gradient(circle at 70% 10%, rgba(${zone.glowColor}, 0.35) 0%, transparent 60%)`,
            `radial-gradient(circle at 30% 80%, rgba(${zone.glowColor}, 0.35) 0%, transparent 60%)`,
            `radial-gradient(circle at 70% 10%, rgba(${zone.glowColor}, 0.35) 0%, transparent 60%)`
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
  filterVehicle,
  setFilterVehicle,
  onAddCourier,
  onGenerateReport,
  onShowAnalytics,
  viewMode,
  setViewMode
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterVehicle: string;
  setFilterVehicle: (vehicle: string) => void;
  onAddCourier: () => void;
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
          onClick={onGenerateReport}
          className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
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

        <motion.button
          onClick={onAddCourier}
          className="flex-1 sm:flex-initial px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 backdrop-blur-sm"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            +
          </motion.span>
          <span>{isMobile ? 'Добавить' : 'Добавить курьера'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Модальное окно добавления курьера
const AddCourierModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    vehicle: 'scooter',
    phone: '',
    email: '',
    zone: 'all',
    schedule: '9:00-18:00'
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
    // Обработка добавления курьера
    console.log('Добавление курьера:', formData);
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
              Добавить нового курьера
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
                <label className="text-white text-sm mb-2 block">ФИО курьера</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="28"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Транспорт</label>
                <select
                  required
                  value={formData.vehicle}
                  onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="scooter">Самокат</option>
                  <option value="bike">Велосипед</option>
                  <option value="car">Автомобиль</option>
                  <option value="foot">Пеший</option>
                </select>
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Телефон</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="+7 (915) 123-45-67"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="courier@example.ru"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Зона работы</label>
                <select
                  required
                  value={formData.zone}
                  onChange={(e) => setFormData({...formData, zone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="all">Все зоны</option>
                  <option value="center">Центральный район</option>
                  <option value="north">Северный район</option>
                  <option value="south">Южный район</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">График работы</label>
              <input
                type="text"
                required
                value={formData.schedule}
                onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                placeholder="9:00-18:00, 5/2"
              />
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
                className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Добавить курьера
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
    totalCouriers: 247,
    activeCouriers: 189,
    deliveringCouriers: 132,
    todayOrders: 1560,
    avgDeliveryTime: 28,
    serviceRating: 4.7,
    zoneDistribution: [
      { name: 'Центральный', value: 32, color: `rgba(${COURIER_COLORS.courierOrange}, 0.9)` },
      { name: 'Северный', value: 28, color: `rgba(${COURIER_COLORS.courierBlue}, 0.9)` },
      { name: 'Южный', value: 18, color: `rgba(${COURIER_COLORS.courierEmerald}, 0.9)` },
      { name: 'Западный', value: 12, color: `rgba(${COURIER_COLORS.courierPurple}, 0.9)` },
      { name: 'Восточный', value: 8, color: `rgba(${COURIER_COLORS.courierAmber}, 0.9)` },
      { name: 'Другие зоны', value: 2, color: `rgba(${COURIER_COLORS.courierRed}, 0.9)` }
    ],
    monthlyStats: [
      { month: 'Янв', couriers: 200, orders: 12000 },
      { month: 'Фев', couriers: 215, orders: 12500 },
      { month: 'Мар', couriers: 228, orders: 13000 },
      { month: 'Апр', couriers: 235, orders: 13800 },
      { month: 'Май', couriers: 242, orders: 14500 },
      { month: 'Июн', couriers: 247, orders: 15600 }
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
              📊 Аналитика курьерской службы
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
                  <div className="text-2xl font-bold text-white mb-1">{analyticsData.totalCouriers}</div>
                  <div className="text-white/60 text-sm">Всего курьеров</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{analyticsData.activeCouriers}</div>
                  <div className="text-white/60 text-sm">Активных сейчас</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400 mb-1">{analyticsData.todayOrders}</div>
                  <div className="text-white/60 text-sm">Заказов сегодня</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{analyticsData.avgDeliveryTime} мин</div>
                  <div className="text-white/60 text-sm">Среднее время</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-white font-semibold text-lg mb-4">Распределение по зонам</h4>
              <div className="space-y-3">
                {analyticsData.zoneDistribution.map((zone, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white/70 text-sm w-20">{zone.name}</span>
                    <div className="flex-1 mx-4">
                      <ProgressBar
                        value={zone.value}
                        color={zone.color}
                        height="12px"
                        showLabel={false}
                      />
                    </div>
                    <div className="text-right text-xs text-white/60 w-8">
                      {zone.value}%
                    </div>
                  </div>
                ))}
              </div>
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
                      value={(stat.couriers / 300) * 100}
                      color="#F97316"
                      height="20px"
                      showLabel={false}
                    />
                  </div>
                  <div className="text-right text-xs text-white/60 w-20">
                    {stat.couriers} курьеров
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
              className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors backdrop-blur-sm"
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
              >
                <option value="full">Полный отчет</option>
                <option value="monthly">Месячный отчет</option>
                <option value="zones">По зонам</option>
                <option value="performance">По эффективности</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Период</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                />
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
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
              className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors backdrop-blur-sm"
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

// Улучшенное модальное окно курьера
const CourierModal = ({ courier, onClose }: { courier: any; onClose: () => void }) => {
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
              Профиль курьера
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
                className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-xl relative"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                {courier.initials}
                <div className="absolute -bottom-1 -right-1 bg-black/80 rounded-full p-1">
                  <VehicleIcon vehicle={courier.vehicle} size="md" />
                </div>
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-2xl mb-2 truncate">{courier.name}</h4>
                <div className="text-white/60 text-sm mb-3">
                  {courier.age} лет • {courier.vehicle === 'bike' ? 'Велосипед' : 
                  courier.vehicle === 'scooter' ? 'Самокат' : 
                  courier.vehicle === 'car' ? 'Автомобиль' : 'Пеший'} • {courier.details.experience} опыта
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={courier.status} size="md" />
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    Заказов сегодня: {courier.completedOrders}
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    Рейтинг: {courier.rating}
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
                      { label: 'Телефон', value: courier.phone },
                      { label: 'Email', value: courier.email },
                      { label: 'Локация', value: courier.location }
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
                    <span>🕒</span> График работы
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Время работы', value: `${courier.startTime} - ${courier.endTime}` },
                      { label: 'График', value: courier.details.workSchedule },
                      { label: 'Последняя активность', value: courier.lastActive }
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
                    <span>💳</span> Заработок
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Сегодня', value: `${courier.todayEarnings} ₽` },
                      { label: 'Общий заработок', value: `${courier.totalEarnings} ₽` },
                      { label: 'Текущий заказ', value: courier.currentOrder || 'Свободен' }
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
                      value={courier.details.performance.onTimeRate}
                      label="Своевременность доставки"
                      color={courier.color}
                      showLabel
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
                  whileHover={{ y: -2 }}
                >
                  <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>📊</span> Производительность
                  </h5>
                  <div className="space-y-3">
                    <ProgressBar
                      value={courier.details.performance.onTimeRate}
                      label="Своевременность"
                      color="#10B981"
                      height="6px"
                    />
                    <ProgressBar
                      value={courier.details.performance.acceptanceRate}
                      label="Принятие заказов"
                      color="#3B82F6"
                      height="6px"
                    />
                    <ProgressBar
                      value={courier.details.performance.customerRating * 20}
                      label="Рейтинг клиентов"
                      color="#8B5CF6"
                      height="6px"
                    />
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
                <span>🏷️</span> Теги и специализация
              </h5>
              <div className="flex flex-wrap gap-2">
                {courier.tags.map((tag: string, index: number) => (
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
                {courier.details.notes}
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
              className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Назначить заказ
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

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

// Данные
const courierZones = [
  {
    id: 'all',
    title: '🚗 Все курьеры',
    description: 'Полная база курьеров системы • Все районы города • Управление доставками в реальном времени',
    value: '247',
    metric: 'Всего курьеров',
    color: '#060010',
    glowColor: COURIER_COLORS.courierOrange,
    couriersCount: 247,
    avgDeliveryTime: 28,
    orderVolume: 1560,
    growth: '+12%',
    popularAreas: ['Центр', 'Северный', 'Южный', 'Западный', 'Восточный', 'Пригород'],
    details: {
      availableCouriers: 189,
      totalCouriers: 247,
      avgRating: 4.7,
      activeOrders: 342,
      successRate: 96.2,
      efficiency: 88.5
    }
  },
  {
    id: 'center',
    title: '🏙️ Центральный район',
    description: 'Деловой центр города • Высокая плотность заказов • Премиум сервис доставки',
    value: '68',
    metric: 'Курьеров онлайн',
    color: '#060010',
    glowColor: COURIER_COLORS.courierAmber,
    couriersCount: 68,
    avgDeliveryTime: 35,
    orderVolume: 520,
    growth: '+18%',
    popularAreas: ['Деловой центр', 'Исторический центр', 'Набережная', 'Парки', 'ТЦ "Галерея"'],
    details: {
      availableCouriers: 45,
      totalCouriers: 68,
      avgRating: 4.8,
      activeOrders: 128,
      successRate: 97.5,
      efficiency: 92.3
    }
  },
  {
    id: 'north',
    title: '🧭 Северный район',
    description: 'Спальные районы • Торговые центры • Семейные заказы • Стабильный поток',
    value: '54',
    metric: 'Курьеров онлайн',
    color: '#060010',
    glowColor: COURIER_COLORS.courierBlue,
    couriersCount: 54,
    avgDeliveryTime: 25,
    orderVolume: 380,
    growth: '+8%',
    popularAreas: ['Северный парк', 'ТЦ "Северный"', 'ЖК "Северные высоты"', 'Университет', 'Школы'],
    details: {
      availableCouriers: 42,
      totalCouriers: 54,
      avgRating: 4.6,
      activeOrders: 89,
      successRate: 95.8,
      efficiency: 85.7
    }
  },
  {
    id: 'south',
    title: '🌇 Южный район',
    description: 'Промышленная зона • Логистические центры • Корпоративные заказы • Крупные грузы',
    value: '42',
    metric: 'Курьеров онлайн',
    color: '#060010',
    glowColor: COURIER_COLORS.courierEmerald,
    couriersCount: 42,
    avgDeliveryTime: 22,
    orderVolume: 310,
    growth: '+15%',
    popularAreas: ['Промышленная зона', 'Склады', 'Бизнес-парк', 'Логистический центр', 'Офисы'],
    details: {
      availableCouriers: 38,
      totalCouriers: 42,
      avgRating: 4.5,
      activeOrders: 67,
      successRate: 94.3,
      efficiency: 89.1
    }
  }
];

const couriersData = [
  {
    id: 1,
    name: 'Иванов Алексей Петрович',
    initials: 'ИА',
    age: 28,
    vehicle: 'scooter',
    status: 'delivering',
    rating: 4.8,
    completedOrders: 15,
    currentOrder: '#ORD-7842',
    location: 'Центр, ул. Ленина, 15',
    phone: '+7 (915) 123-45-67',
    email: 'a.ivanov@courier.ru',
    startTime: '08:00',
    endTime: '20:00',
    todayEarnings: 3420,
    totalEarnings: 156800,
    color: '#F97316',
    lastActive: '2 минуты назад',
    tags: ['Экспресс', 'Самокат', 'Центр', 'Топ-курьер', 'Быстрая доставка'],
    details: {
      experience: '2 года',
      vehicleInfo: 'Xiaomi Mi Electric Scooter Pro 2',
      workSchedule: '8:00-20:00, 5/2',
      preferredZones: ['Центр', 'Северный'],
      performance: {
        onTimeRate: 98,
        customerRating: 4.8,
        acceptanceRate: 95
      },
      notes: 'Ответственный, всегда на связи. Специализируется на срочных доставках. Отличное знание центра города.'
    }
  },
  {
    id: 2,
    name: 'Петрова Мария Сергеевна',
    initials: 'ПМ',
    age: 25,
    vehicle: 'bike',
    status: 'active',
    rating: 4.9,
    completedOrders: 12,
    currentOrder: null,
    location: 'Северный, ТЦ "Северный"',
    phone: '+7 (916) 234-56-78',
    email: 'm.petrova@courier.ru',
    startTime: '09:00',
    endTime: '18:00',
    todayEarnings: 2870,
    totalEarnings: 134500,
    color: '#10B981',
    lastActive: '5 минут назад',
    tags: ['Велосипед', 'Эко', 'Северный', 'Быстрая', 'Вежливая'],
    details: {
      experience: '1.5 года',
      vehicleInfo: 'Stels Navigator 500',
      workSchedule: '9:00-18:00, 5/2',
      preferredZones: ['Северный', 'Центр'],
      performance: {
        onTimeRate: 99,
        customerRating: 4.9,
        acceptanceRate: 92
      },
      notes: 'Очень внимательна к деталям. Всегда проверяет целостность упаковки. Вежлива с клиентами.'
    }
  },
  {
    id: 3,
    name: 'Сидоров Дмитрий Иванович',
    initials: 'СД',
    age: 32,
    vehicle: 'car',
    status: 'active',
    rating: 4.7,
    completedOrders: 8,
    currentOrder: null,
    location: 'Южный, Промзона, склад 5',
    phone: '+7 (917) 345-67-89',
    email: 'd.sidorov@courier.ru',
    startTime: '07:00',
    endTime: '22:00',
    todayEarnings: 4230,
    totalEarnings: 189200,
    color: '#3B82F6',
    lastActive: '10 минут назад',
    tags: ['Авто', 'Грузы', 'Южный', 'Опытный', 'Крупные заказы'],
    details: {
      experience: '4 года',
      vehicleInfo: 'Hyundai Solaris 2018',
      workSchedule: '7:00-22:00, 6/1',
      preferredZones: ['Южный', 'Все районы'],
      performance: {
        onTimeRate: 96,
        customerRating: 4.7,
        acceptanceRate: 98
      },
      notes: 'Берет крупные заказы, есть багажник. Специализируется на корпоративных доставках. Надежный исполнитель.'
    }
  },
  {
    id: 4,
    name: 'Козлова Анна Викторовна',
    initials: 'КА',
    age: 23,
    vehicle: 'foot',
    status: 'break',
    rating: 4.6,
    completedOrders: 9,
    currentOrder: null,
    location: 'Центр, Деловой район, оф. 45',
    phone: '+7 (918) 456-78-90',
    email: 'a.kozlova@courier.ru',
    startTime: '10:00',
    endTime: '19:00',
    todayEarnings: 2150,
    totalEarnings: 98700,
    color: '#8B5CF6',
    lastActive: '15 минут назад',
    tags: ['Пеший', 'Центр', 'Документы', 'Вежливая', 'Аккуратная'],
    details: {
      experience: '8 месяцев',
      vehicleInfo: 'Пеший курьер',
      workSchedule: '10:00-19:00, 5/2',
      preferredZones: ['Центр'],
      performance: {
        onTimeRate: 94,
        customerRating: 4.6,
        acceptanceRate: 88
      },
      notes: 'Специализируется на доставке документов и мелких пакетов в бизнес-центрах. Внимательна к деталям.'
    }
  },
  {
    id: 5,
    name: 'Николаев Артем Владимирович',
    initials: 'НА',
    age: 29,
    vehicle: 'scooter',
    status: 'delivering',
    rating: 4.8,
    completedOrders: 11,
    currentOrder: '#ORD-7915',
    location: 'Центр, ТЦ "Галерея"',
    phone: '+7 (919) 567-89-01',
    email: 'a.nikolaev@courier.ru',
    startTime: '10:00',
    endTime: '22:00',
    todayEarnings: 2980,
    totalEarnings: 112300,
    color: '#F97316',
    lastActive: '1 минуту назад',
    tags: ['Самокат', 'Центр', 'Быстрый', 'Надежный', 'Вечерняя смена'],
    details: {
      experience: '1 год',
      vehicleInfo: 'Ninebot Max G30',
      workSchedule: '10:00-22:00, 6/1',
      preferredZones: ['Центр'],
      performance: {
        onTimeRate: 97,
        customerRating: 4.8,
        acceptanceRate: 90
      },
      notes: 'Работает в вечернее время. Отлично ориентируется в центре города. Быстрая реакция на заказы.'
    }
  },
  {
    id: 6,
    name: 'Федорова Екатерина Дмитриевна',
    initials: 'ФЕ',
    age: 26,
    vehicle: 'bike',
    status: 'active',
    rating: 4.7,
    completedOrders: 14,
    currentOrder: null,
    location: 'Северный, ЖК "Северные высоты"',
    phone: '+7 (920) 678-90-12',
    email: 'e.fedorova@courier.ru',
    startTime: '08:30',
    endTime: '17:30',
    todayEarnings: 3250,
    totalEarnings: 143200,
    color: '#10B981',
    lastActive: '3 минуты назад',
    tags: ['Велосипед', 'Северный', 'Утренняя смена', 'Аккуратная', 'Пунктуальная'],
    details: {
      experience: '2 года',
      vehicleInfo: 'Forward Next 2.0',
      workSchedule: '8:30-17:30, 5/2',
      preferredZones: ['Северный'],
      performance: {
        onTimeRate: 96,
        customerRating: 4.7,
        acceptanceRate: 94
      },
      notes: 'Работает в утренние часы. Специализируется на доставках в жилые комплексы. Всегда пунктуальна.'
    }
  },
  {
    id: 7,
    name: 'Волков Максим Андреевич',
    initials: 'ВМ',
    age: 35,
    vehicle: 'car',
    status: 'delivering',
    rating: 4.9,
    completedOrders: 7,
    currentOrder: '#ORD-7934',
    location: 'Южный, Логистический центр',
    phone: '+7 (921) 789-01-23',
    email: 'm.volkov@courier.ru',
    startTime: '06:00',
    endTime: '20:00',
    todayEarnings: 5120,
    totalEarnings: 234500,
    color: '#3B82F6',
    lastActive: 'Только что',
    tags: ['Авто', 'Грузы', 'Южный', 'Опытный', 'Крупные заказы', 'Бизнес'],
    details: {
      experience: '5 лет',
      vehicleInfo: 'Lada Largus',
      workSchedule: '6:00-20:00, 6/1',
      preferredZones: ['Южный', 'Все районы'],
      performance: {
        onTimeRate: 99,
        customerRating: 4.9,
        acceptanceRate: 97
      },
      notes: 'Специализируется на крупных грузах и корпоративных заказах. Есть опыт работы с хрупкими грузами. Профессионал.'
    }
  },
  {
    id: 8,
    name: 'Семенова Ольга Игоревна',
    initials: 'СО',
    age: 24,
    vehicle: 'foot',
    status: 'active',
    rating: 4.5,
    completedOrders: 6,
    currentOrder: null,
    location: 'Центр, Деловой район, БЦ "Высота"',
    phone: '+7 (922) 890-12-34',
    email: 'o.semenova@courier.ru',
    startTime: '11:00',
    endTime: '20:00',
    todayEarnings: 1850,
    totalEarnings: 76500,
    color: '#8B5CF6',
    lastActive: '8 минут назад',
    tags: ['Пеший', 'Центр', 'Документы', 'Вежливая', 'Офисная доставка'],
    details: {
      experience: '6 месяцев',
      vehicleInfo: 'Пеший курьер',
      workSchedule: '11:00-20:00, 5/2',
      preferredZones: ['Центр'],
      performance: {
        onTimeRate: 92,
        customerRating: 4.5,
        acceptanceRate: 85
      },
      notes: 'Специализируется на доставке документов и мелких пакетов в бизнес-центрах. Внимательна к деталям, вежлива.'
    }
  }
];

const courierMetrics = [
  { category: 'Всего курьеров', value: '247', trend: 'up', color: '#F97316', icon: '🚗', change: '+12 за неделю' },
  { category: 'Активных сейчас', value: '189', trend: 'up', color: '#10B981', icon: '🟢', change: '+5 за час' },
  { category: 'Доставляют', value: '132', trend: 'stable', color: '#F59E0B', icon: '📦', change: 'Стабильно' },
  { category: 'Заказов сегодня', value: '1,560', trend: 'up', color: '#8B5CF6', icon: '📋', change: '+124 с утра' },
  { category: 'Среднее время', value: '28 мин', trend: 'down', color: '#3B82F6', icon: '⏱️', change: '-3 мин за месяц' },
  { category: 'Рейтинг сервиса', value: '4.7/5', trend: 'up', color: '#EC4899', icon: '⭐', change: '+0.2 за квартал' }
];

// Основной компонент
export default function CouriersCatalog() {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedCourier, setSelectedCourier] = useState<any>(null);
  const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
  const [isAddCourierModalOpen, setIsAddCourierModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');
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
    const anyModalOpen = isCourierModalOpen || isAddCourierModalOpen || isAnalyticsModalOpen || isReportModalOpen;
    if (anyModalOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [isCourierModalOpen, isAddCourierModalOpen, isAnalyticsModalOpen, isReportModalOpen, lockScroll, unlockScroll]);

  // Закрытие модалок по Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCourierModalOpen(false);
        setIsAddCourierModalOpen(false);
        setIsAnalyticsModalOpen(false);
        setIsReportModalOpen(false);
        setSelectedCourier(null);
      }
    };
    if (isCourierModalOpen || isAddCourierModalOpen || isAnalyticsModalOpen || isReportModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCourierModalOpen, isAddCourierModalOpen, isAnalyticsModalOpen, isReportModalOpen]);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
  };

  const handleCourierClick = (courier: any) => {
    setSelectedCourier(courier);
    setIsCourierModalOpen(true);
  };

  const closeCourierModal = () => {
    setIsCourierModalOpen(false);
    setSelectedCourier(null);
  };

  // Фильтрация курьеров
  const filteredCouriers = couriersData.filter(courier => {
    const matchesZone = selectedZone === 'all' || 
      (selectedZone === 'center' && courier.location.includes('Центр')) ||
      (selectedZone === 'north' && courier.location.includes('Северный')) ||
      (selectedZone === 'south' && courier.location.includes('Южный'));

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query ||
      courier.name.toLowerCase().includes(query) ||
      courier.location.toLowerCase().includes(query) ||
      courier.tags.some((tag: string) => tag.toLowerCase().includes(query));

    const matchesStatus = filterStatus === 'all' || courier.status === filterStatus;
    const matchesVehicle = filterVehicle === 'all' || courier.vehicle === filterVehicle;

    return matchesZone && matchesSearch && matchesStatus && matchesVehicle;
  });

  const selectedZoneData = courierZones.find(zone => zone.id === selectedZone);

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
    <div className={`min-h-screen bg-gradient-to-br ${COURIER_COLORS.primary}`}>
      <style jsx global>{`
        body.no-scroll {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fb923c 0%, #f97316 35%, #ea580c 100%);
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
                  <span className="gradient-text">Управление курьерами</span>
                </motion.h1>
                <motion.p
                  className="text-white/65 text-sm sm:text-base md:text-[15px] mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 }}
                >
                  <span className="text-emerald-400 font-medium">247 курьеров в системе</span> • 4 района
                  города • <span className="text-amber-400 font-medium">1,560 заказов сегодня</span>
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-2 sm:gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                >
                  {[
                    { color: 'bg-emerald-400', text: '189 курьеров онлайн' },
                    { color: 'bg-amber-400', text: '132 доставляют заказы' },
                    { color: 'bg-blue-400', text: '28 мин среднее время' }
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
                  className="inline-flex items-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg shadow-amber-500/25 backdrop-blur-sm"
                  whileHover={{ scale: 1.03, y: -1 }}
                >
                  <span className="text-xs text-amber-50/80 mr-2 hidden sm:inline">Статус системы</span>
                  <span className="text-sm sm:text-base font-semibold text-white">Активна</span>
                </motion.div>
                <div className="text-white/60 text-[11px] sm:text-xs mt-1">
                  Реальное время • Автообновление
                </div>
              </motion.div>
            </div>
            <div className="pointer-events-none absolute top-[-40px] right-[-40px] w-28 h-28 sm:w-40 sm:h-40 bg-amber-500/16 rounded-full blur-3xl" />
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
            {courierMetrics.map((metric, index) => (
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

        {/* Зоны */}
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
            Зоны доставки
          </h3>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {courierZones.map((zone, index) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                isSelected={selectedZone === zone.id}
                onClick={() => handleZoneClick(zone.id)}
                index={index}
              />
            ))}
          </div>
        </motion.section>

        {/* Аналитика выбранной зоны */}
        {selectedZone && selectedZoneData && (
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
                    Детальная статистика: {selectedZoneData.title}
                  </h3>
                  
                  <div className={`grid ${isMobile ? 'grid-cols-2' : 'sm:grid-cols-4'} gap-3 mb-4`}>
                    {[
                      { label: 'Свободные курьеры', value: `${selectedZoneData.details.availableCouriers}/${selectedZoneData.details.totalCouriers}`, color: 'text-white' },
                      { label: 'Активные заказы', value: selectedZoneData.details.activeOrders, color: 'text-amber-400' },
                      { label: 'Средний рейтинг', value: selectedZoneData.details.avgRating, color: 'text-white' },
                      { label: 'Успешность', value: `${selectedZoneData.details.successRate}%`, color: 'text-emerald-400' }
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
                      value={selectedZoneData.details.successRate}
                      label="Успешность доставки"
                      color={`rgb(${selectedZoneData.glowColor})`}
                      showLabel
                    />
                    <ProgressBar
                      value={selectedZoneData.details.efficiency}
                      label="Эффективность работы"
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
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 mb-3">
                    <div className="text-white font-bold text-3xl mb-1">
                      {selectedZoneData.couriersCount}
                    </div>
                    <div className="text-white/60 text-sm">курьеров в зоне</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold text-sm mb-1">Распределение</div>
                    <div className="text-white/60 text-xs">по типам транспорта<br/>и статусам</div>
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
            filterVehicle={filterVehicle}
            setFilterVehicle={setFilterVehicle}
            onAddCourier={() => setIsAddCourierModalOpen(true)}
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
                {selectedZoneData?.title || 'Все курьеры'} 
                <span className="text-white/60 ml-2 text-sm font-normal">
                  ({filteredCouriers.length} из {couriersData.length})
                </span>
              </h3>
              <div className="text-white/60 text-sm mt-1">
                {filteredCouriers.length === couriersData.length 
                  ? 'Все курьеры' 
                  : `Найдено по запросу: "${searchTerm}"`}
                {filterVehicle !== 'all' && ` • ${filterVehicle === 'bike' ? 'Велосипед' : 
                  filterVehicle === 'scooter' ? 'Самокат' : 
                  filterVehicle === 'car' ? 'Автомобиль' : 'Пеший'}`}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-white/60 text-sm hidden sm:block">
                Сортировка: <span className="text-white">По рейтингу</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Список курьеров */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          layout
        >
          {filteredCouriers.length === 0 ? (
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
              <div className="text-white font-semibold text-lg mb-2">Курьеры не найдены</div>
              <div className="text-white/60 text-sm mb-4">
                Попробуйте изменить параметры поиска или фильтры
              </div>
              <motion.button
                onClick={() => { setSearchTerm(''); setFilterStatus('all'); setFilterVehicle('all'); }}
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
              {filteredCouriers.map((courier, index) => (
                <CourierCard
                  key={courier.id}
                  courier={courier}
                  index={index}
                  onCourierClick={handleCourierClick}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Пагинация */}
        {filteredCouriers.length > 0 && (
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
        {isCourierModalOpen && selectedCourier && (
          <CourierModal
            courier={selectedCourier}
            onClose={closeCourierModal}
          />
        )}
      </AnimatePresence>

      <AddCourierModal
        isOpen={isAddCourierModalOpen}
        onClose={() => setIsAddCourierModalOpen(false)}
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