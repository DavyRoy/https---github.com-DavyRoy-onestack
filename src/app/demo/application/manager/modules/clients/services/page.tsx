'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Цветовая палитра для сферы услуг
const SERVICE_COLORS = {
  primary: 'from-gray-950 via-black to-gray-900',
  secondary: 'from-purple-900 via-black to-pink-900',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  purple: '147, 51, 234',
  pink: '236, 72, 153',
  indigo: '99, 102, 241',
  rose: '244, 63, 94',
  fuchsia: '217, 70, 239',
  violet: '139, 92, 246',
  emerald: '16, 185, 129',
  amber: '245, 158, 11',
  cyan: '34, 211, 238'
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
  color = '#8B5CF6',
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
            : 'text-purple-400'
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

// Типы для клиентов сферы услуг
interface ServiceClient {
  id: number;
  name: string;
  initials: string;
  age: number;
  gender: 'male' | 'female';
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  serviceType: 'beauty' | 'wellness' | 'consulting' | 'education' | 'other';
  serviceName: string;
  specialist: string;
  duration: string;
  scheduledTime: string;
  endTime: string;
  price: number;
  paid: boolean;
  loyaltyLevel: 'new' | 'regular' | 'vip' | 'premium';
  contact: string;
  email: string;
  color: string;
  tags: string[];
  details: {
    preferences: string[];
    allergies: string[];
    medicalNotes: string;
    serviceHistory: number;
    lastVisit: string;
    nextRecommendation: string;
    specialRequests: string;
    rating: number;
    notes: string;
  };
}

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  value: string;
  metric: string;
  color: string;
  glowColor: string;
  clientsCount: number;
  avgSessionTime: number;
  satisfactionRate: number;
  growth: string;
  popularServices: string[];
  details: {
    activeSessions: number;
    totalCapacity: number;
    avgPrice: number;
    specialistsCount: number;
    repeatRate: number;
  };
}

// Рейтинг звездочками
const RatingStars = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
  const stars = [];
  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <div
        key={i}
        className={`${sizeClass} ${
          i <= rating ? 'text-amber-400' : 'text-white/30'
        }`}
      >
        ★
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className="text-white/60 text-xs ml-1">({rating.toFixed(1)})</span>
    </div>
  );
};

// Карточка клиента
const ServiceClientCard = ({
  client,
  index,
  onClientClick,
  viewMode = 'grid'
}: {
  client: ServiceClient;
  index: number;
  onClientClick?: (client: ServiceClient) => void;
  viewMode?: 'grid' | 'list';
}) => {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isListMode = viewMode === 'list';

  const getGradient = (name: string) => {
    const gradients = [
      'from-purple-500 to-pink-600',
      'from-violet-500 to-purple-600',
      'from-fuchsia-500 to-pink-600',
      'from-indigo-500 to-blue-600',
      'from-rose-500 to-pink-600',
      'from-amber-500 to-orange-600'
    ];
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const getStatusInfo = (status: ServiceClient['status']) => {
    switch (status) {
      case 'active':
        return { color: 'bg-emerald-400', text: '', label: 'active' };
      case 'pending':
        return { color: 'bg-amber-400', text: '', label: 'pending' };
      case 'completed':
        return { color: 'bg-blue-400', text: '', label: 'completed' };
      case 'cancelled':
        return { color: 'bg-rose-400', text: '', label: 'cancelled' };
      default:
        return { color: 'bg-gray-400', text: '', label: 'unknown' };
    }
  };

  const getServiceIcon = (service: ServiceClient['serviceType']) => {
    switch (service) {
      case 'beauty': return '💅';
      case 'wellness': return '🧘';
      case 'consulting': return '💼';
      case 'education': return '🎓';
      case 'other': return '🌟';
    }
  };

  const getLoyaltyColor = (level: ServiceClient['loyaltyLevel']) => {
    switch (level) {
      case 'new': return 'text-gray-400';
      case 'regular': return 'text-blue-400';
      case 'vip': return 'text-purple-400';
      case 'premium': return 'text-amber-400';
    }
  };

  const getLoyaltyText = (level: ServiceClient['loyaltyLevel']) => {
    switch (level) {
      case 'new': return 'Новый';
      case 'regular': return 'Постоянный';
      case 'vip': return 'VIP';
      case 'premium': return 'Премиум';
    }
  };

  const statusInfo = getStatusInfo(client.status);

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
        onClick={() => onClientClick?.(client)}
      >
        <motion.div
          className={`w-14 h-14 rounded-full bg-gradient-to-r ${getGradient(client.name)} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-lg`}
          whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {client.initials}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-base group-hover:text-purple-300 transition-colors truncate">
                {client.name}
              </div>
              <div className="text-white/60 text-sm mt-1 flex items-center gap-2">
                <span>{client.age} лет</span>
                <span>•</span>
                <span className={getLoyaltyColor(client.loyaltyLevel)}>
                  {getLoyaltyText(client.loyaltyLevel)}
                </span>
                <span>•</span>
                <span>{client.serviceName}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                <div className="text-white/60 text-sm hidden sm:block">
                  {client.scheduledTime}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-white/70">
                Специалист: <span className="text-white font-medium">{client.specialist}</span>
              </div>
              <div className="text-white/70">
                Рейтинг: <span className="text-white font-medium"><RatingStars rating={client.details.rating} /></span>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <ProgressBar
                value={client.details.serviceHistory * 10}
                color={client.color}
                height="6px"
                showLabel={false}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {client.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
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
      onClick={() => onClientClick?.(client)}
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
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${getGradient(client.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}
            whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {client.initials}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors truncate">
              {client.name}
            </div>
            <div className="text-white/60 text-xs">
              {client.age} лет • {getLoyaltyText(client.loyaltyLevel)}
            </div>
            <div className="text-white/50 text-[11px] mt-1 flex items-center gap-1">
              {getServiceIcon(client.serviceType)}
              {client.serviceName}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4 flex-1">
        <div className="flex justify-between items-center text-white text-[11px]">
          <span className="text-white/60">Специалист</span>
          <span className="font-medium bg-white/10 px-2 py-1 rounded-full">
            {client.specialist}
          </span>
        </div>
        <div className="flex justify-between items-center text-white text-[11px]">
          <span className="text-white/60">Рейтинг</span>
          <RatingStars rating={client.details.rating} />
        </div>
        <ProgressBar
          value={client.details.serviceHistory * 10}
          label="Активность клиента"
          color={client.color}
          height="6px"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-white/60 mb-3">
        <span>Время приема</span>
        <span className="font-medium text-white/70">{client.scheduledTime}</span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-white mb-3">
        <span className="text-white/60">Стоимость</span>
        <div className="flex items-center gap-1">
          <span className="font-semibold text-emerald-400">{client.price.toLocaleString('ru-RU')} ₽</span>
          {client.paid && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">Оплачено</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {client.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
          <motion.span
            key={tagIndex}
            className="text-[10px] bg-white/8 px-2 py-1 rounded-full border border-white/15 text-white/80 group-hover:bg-white/14 transition-colors truncate max-w-[80px]"
            whileHover={!isMobile ? { scale: 1.05 } : {}}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {tag}
          </motion.span>
        ))}
        {client.tags.length > 3 && (
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full border border-white/10 text-white/60">
            +{client.tags.length - 3}
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

// Улучшенная карточка категории услуг
const ServiceCategoryCard = ({
  category,
  isSelected,
  onClick,
  index
}: {
  category: ServiceCategory;
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
          ? 'border-purple-500/40 ring-2 ring-purple-500/20 bg-purple-500/5' 
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
            className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-2 py-1 border border-purple-500/40 text-[11px] text-purple-300"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420 }}
          >
            <motion.span 
              className="w-1.5 h-1.5 rounded-full bg-purple-300"
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
            { value: category.avgSessionTime, label: 'Среднее время', color: 'text-white', suffix: 'ч' },
            { value: category.satisfactionRate, label: 'Удовлетворенность', color: 'text-emerald-300', suffix: '%' }
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
          value={category.details.repeatRate}
          label="Повторные обращения"
          color={`rgb(${category.glowColor})`}
          showLabel
          height="6px"
        />
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

// Улучшенный компонент фильтров для услуг
const ServiceFiltersSection = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterService,
  setFilterService,
  onAddClient,
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
  onAddClient: () => void;
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
          onClick={onAddClient}
          className="flex-1 sm:flex-initial px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 backdrop-blur-sm"
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

// Модальное окно добавления клиента
const AddClientModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    email: '',
    serviceType: '',
    serviceName: '',
    specialist: '',
    duration: '',
    scheduledTime: '',
    price: '',
    notes: ''
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
    // Обработка добавления клиента
    console.log('Добавление клиента:', formData);
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
              Добавить нового клиента
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Иванова Анна Сергеевна"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Возраст</label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="32"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Пол</label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="">Выберите пол</option>
                  <option value="female">Женский</option>
                  <option value="male">Мужской</option>
                </select>
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Телефон</label>
                <input
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="+7 (915) 123-45-67"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="client@example.com"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Тип услуги</label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="">Выберите тип услуги</option>
                  <option value="beauty">Красота</option>
                  <option value="wellness">Wellness</option>
                  <option value="consulting">Консалтинг</option>
                  <option value="education">Образование</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Название услуги</label>
                <input
                  type="text"
                  required
                  value={formData.serviceName}
                  onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Комплексный уход за лицом"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Специалист</label>
                <input
                  type="text"
                  required
                  value={formData.specialist}
                  onChange={(e) => setFormData({...formData, specialist: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Петрова М.И."
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Длительность</label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="2 часа"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Время приема</label>
                <input
                  type="time"
                  required
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Стоимость (₽)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="5000"
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Примечания</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm resize-none"
                placeholder="Дополнительная информация о клиенте..."
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
                className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors backdrop-blur-sm"
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

// Модальное окно аналитики услуг
const ServiceAnalyticsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
    totalClients: 324,
    activeSessions: 87,
    totalRevenue: 856200,
    avgSatisfaction: 96,
    monthlyGrowth: 22,
    categoryDistribution: [
      { name: 'Красота', value: 48, color: `rgba(${SERVICE_COLORS.pink}, 0.9)` },
      { name: 'Wellness', value: 27, color: `rgba(${SERVICE_COLORS.violet}, 0.9)` },
      { name: 'Консалтинг', value: 17, color: `rgba(${SERVICE_COLORS.indigo}, 0.9)` },
      { name: 'Образование', value: 6, color: `rgba(${SERVICE_COLORS.amber}, 0.9)` },
      { name: 'Другие', value: 2, color: `rgba(${SERVICE_COLORS.gray}, 0.9)` }
    ],
    monthlyStats: [
      { month: 'Янв', clients: 280, revenue: 720000 },
      { month: 'Фев', clients: 295, revenue: 760000 },
      { month: 'Мар', clients: 310, revenue: 790000 },
      { month: 'Апр', clients: 302, revenue: 780000 },
      { month: 'Май', clients: 318, revenue: 820000 },
      { month: 'Июн', clients: 324, revenue: 856200 }
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
              📊 Аналитика клиентов сферы услуг
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
                  <div className="text-2xl font-bold text-white mb-1">{analyticsData.totalClients}</div>
                  <div className="text-white/60 text-sm">Всего клиентов</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{analyticsData.activeSessions}</div>
                  <div className="text-white/60 text-sm">Активных сеансов</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400 mb-1">{analyticsData.avgSatisfaction}%</div>
                  <div className="text-white/60 text-sm">Удовлетворенность</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">+{analyticsData.monthlyGrowth}%</div>
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
                      value={(stat.clients / 400) * 100}
                      color="#8B5CF6"
                      height="20px"
                      showLabel={false}
                    />
                  </div>
                  <div className="text-right text-xs text-white/60 w-20">
                    {stat.clients} клиентов
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
              className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors backdrop-blur-sm"
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
const ServiceReportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
              📋 Генерация отчета по услугам
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
              >
                <option value="full">Полный отчет</option>
                <option value="monthly">Месячный отчет</option>
                <option value="categories">По категориям услуг</option>
                <option value="specialists">По специалистам</option>
                <option value="revenue">Финансовый отчет</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Период</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                />
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
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
              className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors backdrop-blur-sm"
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

// Улучшенное модальное окно клиента
const ServiceClientModal = ({ client, onClose }: { client: ServiceClient; onClose: () => void }) => {
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

  const getStatusColor = (status: ServiceClient['status']) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
      case 'pending': return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'completed': return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
      case 'cancelled': return 'bg-rose-500/15 text-rose-400 border-rose-500/40';
    }
  };

  const getServiceIcon = (service: ServiceClient['serviceType']) => {
    switch (service) {
      case 'beauty': return '💅';
      case 'wellness': return '🧘';
      case 'consulting': return '💼';
      case 'education': return '🎓';
      case 'other': return '🌟';
    }
  };

  const getLoyaltyColor = (level: ServiceClient['loyaltyLevel']) => {
    switch (level) {
      case 'new': return 'text-gray-400';
      case 'regular': return 'text-blue-400';
      case 'vip': return 'text-purple-400';
      case 'premium': return 'text-amber-400';
    }
  };

  const getLoyaltyText = (level: ServiceClient['loyaltyLevel']) => {
    switch (level) {
      case 'new': return 'Новый клиент';
      case 'regular': return 'Постоянный клиент';
      case 'vip': return 'VIP клиент';
      case 'premium': return 'Премиум клиент';
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
                className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                {client.initials}
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-2xl mb-2 truncate">{client.name}</h4>
                <div className="text-white/60 text-sm mb-3">
                  {client.age} лет • {client.gender === 'male' ? 'Мужской' : 'Женский'} • 
                  <span className={getLoyaltyColor(client.loyaltyLevel)}> {getLoyaltyText(client.loyaltyLevel)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <motion.div 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(client.status)}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {client.status === 'active' ? 'Активен' : 
                     client.status === 'pending' ? 'Ожидание' :
                     client.status === 'completed' ? 'Завершен' : 'Отменен'}
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    {getServiceIcon(client.serviceType)} {client.serviceName}
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    Рейтинг: <RatingStars rating={client.details.rating} />
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
                      { label: 'Телефон', value: client.contact },
                      { label: 'Email', value: client.email },
                      { label: 'Специалист', value: client.specialist }
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
                    <span>⭐</span> История обслуживания
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Посещений в этом месяце', value: client.details.serviceHistory.toString() },
                      { label: 'Последний визит', value: client.details.lastVisit },
                      { label: 'Следующая рекомендация', value: client.details.nextRecommendation }
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
                    <ProgressBar
                      value={client.details.serviceHistory * 10}
                      label="Активность клиента"
                      color={client.color}
                      showLabel
                    />
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4">
                <motion.div 
                  className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
                  whileHover={{ y: -2 }}
                >
                  <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>🔄</span> Текущая услуга
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Услуга', value: client.serviceName },
                      { label: 'Время приема', value: `${client.scheduledTime} - ${client.endTime}` },
                      { label: 'Длительность', value: client.duration }
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
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Стоимость:</span>
                      <span className="text-emerald-400 font-semibold">{client.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Статус оплаты:</span>
                      <span className={`font-semibold ${client.paid ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {client.paid ? 'Оплачено' : 'Ожидает оплаты'}
                      </span>
                    </div>
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
                    {client.tags.map((tag: string, index: number) => (
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

            {/* Предпочтения и особенности */}
            <motion.div 
              className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -2 }}
            >
              <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>❤️</span> Предпочтения и особенности
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-white/60 text-sm mb-2">Предпочтения:</div>
                  <div className="flex flex-wrap gap-1">
                    {client.details.preferences.map((pref, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-xs"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-white/60 text-sm mb-2">Аллергии:</div>
                  <div className="flex flex-wrap gap-1">
                    {client.details.allergies.length > 0 ? (
                      client.details.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-300 text-xs"
                        >
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-white/60 text-xs">Нет аллергий</span>
                    )}
                  </div>
                </div>
              </div>
              {client.details.medicalNotes && (
                <div className="mt-4">
                  <div className="text-white/60 text-sm mb-2">Медицинские заметки:</div>
                  <p className="text-white text-sm">{client.details.medicalNotes}</p>
                </div>
              )}
            </motion.div>

            {/* Особые пожелания */}
            {client.details.specialRequests && (
              <motion.div 
                className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ y: -2 }}
              >
                <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span>💫</span> Особые пожелания
                </h5>
                <p className="text-white text-sm">{client.details.specialRequests}</p>
              </motion.div>
            )}

            {/* Примечания */}
            {client.details.notes && (
              <motion.div 
                className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                whileHover={{ y: -2 }}
              >
                <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span>📝</span> Примечания
                </h5>
                <p className="text-white text-sm">{client.details.notes}</p>
              </motion.div>
            )}
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
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
              className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Записать на прием
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Данные
const serviceCategories: ServiceCategory[] = [
  {
    id: 'all',
    title: '🌟 Все клиенты',
    description: 'Все услуги • Полная статистика • Управление клиентами',
    value: '324',
    metric: 'Клиентов сегодня',
    color: '#060010',
    glowColor: SERVICE_COLORS.purple,
    clientsCount: 324,
    avgSessionTime: 1.2,
    satisfactionRate: 96,
    growth: '+22%',
    popularServices: ['Массаж', 'Стрижка', 'Консультация', 'Маникюр'],
    details: {
      activeSessions: 87,
      totalCapacity: 120,
      avgPrice: 2500,
      specialistsCount: 45,
      repeatRate: 78
    }
  },
  {
    id: 'beauty',
    title: '💅 Красота и уход',
    description: 'Салоны красоты • Косметология • Парикмахерские • Ногтевой сервис',
    value: '156',
    metric: 'Клиентов',
    color: '#060010',
    glowColor: SERVICE_COLORS.pink,
    clientsCount: 156,
    avgSessionTime: 1.8,
    satisfactionRate: 97,
    growth: '+18%',
    popularServices: ['Стрижка', 'Окрашивание', 'Маникюр', 'Косметология'],
    details: {
      activeSessions: 42,
      totalCapacity: 60,
      avgPrice: 1800,
      specialistsCount: 25,
      repeatRate: 82
    }
  },
  {
    id: 'wellness',
    title: '🧘 Здоровье и wellness',
    description: 'СПА • Массаж • Йога • Фитнес • Релаксация',
    value: '89',
    metric: 'Клиентов',
    color: '#060010',
    glowColor: SERVICE_COLORS.violet,
    clientsCount: 89,
    avgSessionTime: 2.5,
    satisfactionRate: 95,
    growth: '+35%',
    popularServices: ['Массаж', 'СПА-процедуры', 'Йога', 'Медитация'],
    details: {
      activeSessions: 23,
      totalCapacity: 35,
      avgPrice: 3200,
      specialistsCount: 12,
      repeatRate: 85
    }
  },
  {
    id: 'consulting',
    title: '💼 Консалтинг и коучинг',
    description: 'Бизнес-консультации • Персональный коучинг • Психологические услуги',
    value: '54',
    metric: 'Клиентов',
    color: '#060010',
    glowColor: SERVICE_COLORS.indigo,
    clientsCount: 54,
    avgSessionTime: 1.5,
    satisfactionRate: 94,
    growth: '+28%',
    popularServices: ['Коучинг', 'Консультация', 'Тренинг', 'Психотерапия'],
    details: {
      activeSessions: 18,
      totalCapacity: 25,
      avgPrice: 4500,
      specialistsCount: 8,
      repeatRate: 72
    }
  }
];

const serviceClientsData: ServiceClient[] = [
  {
    id: 1,
    name: 'Иванова Анна Сергеевна',
    initials: 'ИА',
    age: 32,
    gender: 'female',
    status: 'active',
    serviceType: 'beauty',
    serviceName: 'Комплексный уход за лицом',
    specialist: 'Петрова М.И.',
    duration: '2 часа',
    scheduledTime: '14:30',
    endTime: '16:30',
    price: 5600,
    paid: true,
    loyaltyLevel: 'vip',
    contact: '+7 (915) 123-45-67',
    email: 'a.ivanova@mail.ru',
    color: '#EC4899',
    tags: ['VIP', 'Косметология', 'Постоянная', 'Премиум'],
    details: {
      preferences: ['Гипоаллергенная косметика', 'Без парфюмерных отдушек'],
      allergies: ['Мед', 'Эфирные масла'],
      medicalNotes: 'Чувствительная кожа, склонность к куперозу',
      serviceHistory: 12,
      lastVisit: '15.01.2024',
      nextRecommendation: 'Через 3 недели',
      specialRequests: 'Предпочтительно утреннее время',
      rating: 4.9,
      notes: 'Клиентка очень довольна результатами, регулярно посещает 2 раза в месяц'
    }
  },
  {
    id: 2,
    name: 'Петров Дмитрий Викторович',
    initials: 'ПД',
    age: 45,
    gender: 'male',
    status: 'pending',
    serviceType: 'consulting',
    serviceName: 'Бизнес-коучинг',
    specialist: 'Сидоров А.В.',
    duration: '1.5 часа',
    scheduledTime: '16:00',
    endTime: '17:30',
    price: 7500,
    paid: false,
    loyaltyLevel: 'regular',
    contact: '+7 (916) 234-56-78',
    email: 'd.petrov@mail.ru',
    color: '#6366F1',
    tags: ['Бизнес', 'Коучинг', 'Карьера', 'Новый проект'],
    details: {
      preferences: ['Практические задания', 'Детальный разбор кейсов'],
      allergies: [],
      medicalNotes: '',
      serviceHistory: 3,
      lastVisit: '20.02.2024',
      nextRecommendation: 'Еженедельно',
      specialRequests: 'Запись сессии',
      rating: 4.7,
      notes: 'Работает над масштабированием бизнеса, требуется помощь в стратегическом планировании'
    }
  },
  {
    id: 3,
    name: 'Сидорова Мария Дмитриевна',
    initials: 'СМ',
    age: 28,
    gender: 'female',
    status: 'completed',
    serviceType: 'wellness',
    serviceName: 'Тайский массаж',
    specialist: 'Козлов П.Н.',
    duration: '1.5 часа',
    scheduledTime: '11:00',
    endTime: '12:30',
    price: 4200,
    paid: true,
    loyaltyLevel: 'premium',
    contact: '+7 (917) 345-67-89',
    email: 'm.sidorova@mail.ru',
    color: '#A78BFA',
    tags: ['Массаж', 'Релаксация', 'Постоянная', 'СПА'],
    details: {
      preferences: ['Сильное давление', 'Ароматерапия'],
      allergies: ['Лаванда'],
      medicalNotes: 'Проблемы с поясничным отделом',
      serviceHistory: 8,
      lastVisit: '10.03.2024',
      nextRecommendation: 'Через 2 недели',
      specialRequests: 'Тихая музыка, приглушенный свет',
      rating: 5.0,
      notes: 'Отличные результаты по снижению болей в спине, очень благодарный клиент'
    }
  },
  {
    id: 4,
    name: 'Козлов Алексей Игоревич',
    initials: 'КА',
    age: 35,
    gender: 'male',
    status: 'active',
    serviceType: 'education',
    serviceName: 'Персональный тренинг',
    specialist: 'Новикова Е.В.',
    duration: '2 часа',
    scheduledTime: '18:00',
    endTime: '20:00',
    price: 3800,
    paid: true,
    loyaltyLevel: 'new',
    contact: '+7 (918) 456-78-90',
    email: 'a.kozlov@mail.ru',
    color: '#8B5CF6',
    tags: ['Обучение', 'Новый', 'Мотивация', 'Развитие'],
    details: {
      preferences: ['Интерактивный формат', 'Домашние задания'],
      allergies: [],
      medicalNotes: '',
      serviceHistory: 1,
      lastVisit: '05.03.2024',
      nextRecommendation: 'Еженедельно',
      specialRequests: 'Материалы для самостоятельного изучения',
      rating: 4.8,
      notes: 'Первый визит, очень замотивирован на результат, быстрая обучаемость'
    }
  },
  {
    id: 5,
    name: 'Николаева Елена Викторовна',
    initials: 'НЕ',
    age: 41,
    gender: 'female',
    status: 'active',
    serviceType: 'beauty',
    serviceName: 'Стрижка и укладка',
    specialist: 'Орлова С.П.',
    duration: '1.5 часа',
    scheduledTime: '15:30',
    endTime: '17:00',
    price: 2800,
    paid: true,
    loyaltyLevel: 'regular',
    contact: '+7 (919) 567-89-01',
    email: 'e.nikolaeva@mail.ru',
    color: '#F59E0B',
    tags: ['Стрижка', 'Укладка', 'Постоянная', 'Вечерний прием'],
    details: {
      preferences: ['Классическая стрижка', 'Натуральные средства'],
      allergies: ['Лак для волос'],
      medicalNotes: '',
      serviceHistory: 6,
      lastVisit: '12.03.2024',
      nextRecommendation: 'Через 4 недели',
      specialRequests: 'Вечернее время',
      rating: 4.6,
      notes: 'Предпочитает одного специалиста, доверяет только Орловой С.П.'
    }
  },
  {
    id: 6,
    name: 'Федоров Сергей Александрович',
    initials: 'ФС',
    age: 52,
    gender: 'male',
    status: 'completed',
    serviceType: 'consulting',
    serviceName: 'Финансовое планирование',
    specialist: 'Васнецова О.Д.',
    duration: '2 часа',
    scheduledTime: '12:00',
    endTime: '14:00',
    price: 9200,
    paid: true,
    loyaltyLevel: 'vip',
    contact: '+7 (920) 678-90-12',
    email: 's.fedorov@mail.ru',
    color: '#10B981',
    tags: ['Финансы', 'Инвестиции', 'VIP', 'Бизнес'],
    details: {
      preferences: ['Детальный анализ', 'Графики и диаграммы'],
      allergies: [],
      medicalNotes: '',
      serviceHistory: 15,
      lastVisit: '08.03.2024',
      nextRecommendation: 'Ежемесячно',
      specialRequests: 'Подготовить отчет заранее',
      rating: 4.9,
      notes: 'Крупный инвестор, требует индивидуального подхода и конфиденциальности'
    }
  }
];

const clientMetrics = [
  { category: 'Клиентов сегодня', value: '324', trend: 'up', color: '#8B5CF6', icon: '👥', change: '+2.3%' },
  { category: 'Активных сеансов', value: '87', trend: 'stable', color: '#EC4899', icon: '🟢', change: '+1.1%' },
  { category: 'Свободных мест', value: '33', trend: 'down', color: '#A78BFA', icon: '💺', change: '-0.4%' },
  { category: 'Среднее время', value: '1.2 ч', trend: 'down', color: '#6366F1', icon: '⏱️', change: '+5.2%' },
  { category: 'Завершено', value: '189', trend: 'up', color: '#10B981', icon: '✅', change: '+1.8%' },
  { category: 'Удовлетворенность', value: '96%', trend: 'up', color: '#F59E0B', icon: '⭐', change: '+3.7%' }
];

const categoryDistribution = [
  { name: 'Красота', value: 48, color: `rgba(${SERVICE_COLORS.pink}, 0.9)` },
  { name: 'Wellness', value: 27, color: `rgba(${SERVICE_COLORS.violet}, 0.9)` },
  { name: 'Консалтинг', value: 17, color: `rgba(${SERVICE_COLORS.indigo}, 0.9)` },
  { name: 'Образование', value: 6, color: `rgba(${SERVICE_COLORS.amber}, 0.9)` },
  { name: 'Другие', value: 2, color: `rgba(${SERVICE_COLORS.gray}, 0.9)` }
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
export default function ServicesCatalog() {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<ServiceClient | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
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
    const anyModalOpen = isClientModalOpen || isAddClientModalOpen || isAnalyticsModalOpen || isReportModalOpen;
    if (anyModalOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [isClientModalOpen, isAddClientModalOpen, isAnalyticsModalOpen, isReportModalOpen, lockScroll, unlockScroll]);

  // Закрытие модалок по Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsClientModalOpen(false);
        setIsAddClientModalOpen(false);
        setIsAnalyticsModalOpen(false);
        setIsReportModalOpen(false);
        setSelectedClient(null);
      }
    };
    if (isClientModalOpen || isAddClientModalOpen || isAnalyticsModalOpen || isReportModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClientModalOpen, isAddClientModalOpen, isAnalyticsModalOpen, isReportModalOpen]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleClientClick = (client: ServiceClient) => {
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };

  const closeClientModal = () => {
    setIsClientModalOpen(false);
    setSelectedClient(null);
  };

  // Фильтрация клиентов
  const filteredClients = serviceClientsData.filter(client => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'beauty' && client.serviceType === 'beauty') ||
      (selectedCategory === 'wellness' && client.serviceType === 'wellness') ||
      (selectedCategory === 'consulting' && client.serviceType === 'consulting');

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query ||
      client.name.toLowerCase().includes(query) ||
      client.serviceName.toLowerCase().includes(query) ||
      client.specialist.toLowerCase().includes(query) ||
      client.tags.some((tag: string) => tag.toLowerCase().includes(query));

    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesService = filterService === 'all' || client.serviceType === filterService;

    return matchesCategory && matchesSearch && matchesStatus && matchesService;
  });

  const selectedCategoryData = serviceCategories.find(cat => cat.id === selectedCategory);

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
    <div className={`min-h-screen bg-gradient-to-br ${SERVICE_COLORS.primary}`}>
      <style jsx global>{`
        body.no-scroll {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }

        .gradient-text {
          background: linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 35%, #7c3aed 100%);
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
                    🌟
                  </motion.span>
                  <span className="gradient-text">Система управления клиентами сферы услуг</span>
                </motion.h1>
                <motion.p
                  className="text-white/65 text-sm sm:text-base md:text-[15px] mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 }}
                >
                  <span className="text-emerald-400 font-medium">324 клиента сегодня</span> • 4 категории услуг
                  • <span className="text-purple-400 font-medium">96% удовлетворенность</span>
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-2 sm:gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                >
                  {[
                    { color: 'bg-emerald-400', text: '87 активных сеансов' },
                    { color: 'bg-purple-400', text: '33 свободных места' },
                    { color: 'bg-pink-400', text: '1.2 ч среднее время' }
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
                  className="inline-flex items-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg shadow-purple-500/25 backdrop-blur-sm"
                  whileHover={{ scale: 1.03, y: -1 }}
                >
                  <span className="text-xs text-purple-50/80 mr-2 hidden sm:inline">Статус системы</span>
                  <span className="text-sm sm:text-base font-semibold text-white">Активна</span>
                </motion.div>
                <div className="text-white/60 text-[11px] sm:text-xs mt-1">
                  Автообновление каждые 3 мин • Сегодня
                </div>
              </motion.div>
            </div>
            <div className="pointer-events-none absolute top-[-40px] right-[-40px] w-28 h-28 sm:w-40 sm:h-40 bg-purple-500/16 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-40px] left-[-40px] w-24 h-24 sm:w-32 sm:h-32 bg-pink-500/18 rounded-full blur-3xl" />
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
            {clientMetrics.map((metric, index) => (
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

        {/* Категории услуг */}
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
            Категории услуг
          </h3>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {serviceCategories.map((category, index) => (
              <ServiceCategoryCard
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
                      { label: 'Активные сеансы', value: `${selectedCategoryData.details.activeSessions}/${selectedCategoryData.details.totalCapacity}`, color: 'text-white' },
                      { label: 'Специалистов', value: selectedCategoryData.details.specialistsCount, color: 'text-emerald-400' },
                      { label: 'Средняя цена', value: `${selectedCategoryData.details.avgPrice.toLocaleString('ru-RU')} ₽`, color: 'text-white' },
                      { label: 'Повторные клиенты', value: `${selectedCategoryData.details.repeatRate}%`, color: 'text-white' }
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
                      value={selectedCategoryData.satisfactionRate}
                      label="Удовлетворенность клиентов"
                      color={`rgb(${selectedCategoryData.glowColor})`}
                      showLabel
                    />
                    <ProgressBar
                      value={selectedCategoryData.details.repeatRate}
                      label="Лояльность клиентов"
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
                    data={categoryDistribution}
                    size={isMobile ? 100 : 120}
                    className="mb-3"
                  />
                  <div className="text-center">
                    <div className="text-white font-semibold text-sm">Распределение услуг</div>
                    <div className="text-white/60 text-xs">Всего {selectedCategoryData.clientsCount} клиентов</div>
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
          <ServiceFiltersSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterService={filterService}
            setFilterService={setFilterService}
            onAddClient={() => setIsAddClientModalOpen(true)}
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
                {selectedCategoryData?.title || 'Все клиенты'} 
                <span className="text-white/60 ml-2 text-sm font-normal">
                  ({filteredClients.length} из {serviceClientsData.length})
                </span>
              </h3>
              <div className="text-white/60 text-sm mt-1">
                {filteredClients.length === serviceClientsData.length 
                  ? 'Все клиенты' 
                  : `Найдено по запросу: "${searchTerm}"`}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-white/60 text-sm hidden sm:block">
                Сортировка: <span className="text-white">По времени приема</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Список клиентов */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          layout
        >
          {filteredClients.length === 0 ? (
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
              <div className="text-white font-semibold text-lg mb-2">Клиенты не найдены</div>
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
              {filteredClients.map((client, index) => (
                <ServiceClientCard
                  key={client.id}
                  client={client}
                  index={index}
                  onClientClick={handleClientClick}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Пагинация */}
        {filteredClients.length > 0 && (
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
        {isClientModalOpen && selectedClient && (
          <ServiceClientModal
            client={selectedClient}
            onClose={closeClientModal}
          />
        )}
      </AnimatePresence>

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
      />

      <ServiceAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />

      <ServiceReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}