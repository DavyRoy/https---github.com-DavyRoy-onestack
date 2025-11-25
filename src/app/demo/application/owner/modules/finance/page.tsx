'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';

// Константы и темы
const THEMES = {
  light: {
    background: 'from-slate-50 via-blue-50 to-slate-100',
    card: 'from-white to-slate-50',
    text: {
      primary: 'text-slate-900',
      secondary: 'text-slate-600',
      tertiary: 'text-slate-400'
    },
    border: 'border-slate-200',
    accent: 'blue'
  },
  dark: {
    background: 'from-slate-900 via-slate-950 to-slate-900',
    card: 'from-slate-800/30 to-slate-900/50',
    text: {
      primary: 'text-white',
      secondary: 'text-slate-300',
      tertiary: 'text-slate-400'
    },
    border: 'border-slate-700/50',
    accent: 'cyan'
  },
  professional: {
    background: 'from-gray-900 via-blue-950 to-gray-900',
    card: 'from-gray-800/40 to-gray-900/60',
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
      tertiary: 'text-gray-400'
    },
    border: 'border-gray-600/50',
    accent: 'blue'
  }
} as const;

const COLORS = {
  primary: 'from-slate-900 via-slate-950 to-slate-900',
  secondary: 'from-teal-900 via-slate-950 to-emerald-900',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  purple: '147, 51, 234',
  blue: '59, 130, 246',
  emerald: '16, 185, 129',
  orange: '249, 115, 22',
  teal: '20, 184, 166',
  indigo: '99, 102, 241',
  rose: '244, 63, 94',
  cyan: '34, 211, 238',
  amber: '245, 158, 11',
  slate: '100, 116, 139',
  violet: '139, 92, 246',
  fuchsia: '217, 70, 239',
  lime: '132, 204, 22',
  sky: '14, 165, 233'
} as const;

const FINANCE_COLORS = {
  income: '34, 197, 94',
  expense: '239, 68, 68',
  profit: '16, 185, 129',
  revenue: '59, 130, 246',
  tax: '245, 158, 11',
  investment: '147, 51, 234',
  savings: '34, 211, 238',
  debt: '244, 63, 94',
  high: '239, 68, 68',
  medium: '245, 158, 11',
  low: '34, 197, 94',
  transfer: '139, 92, 246',
  refund: '132, 204, 22',
  bonus: '217, 70, 239'
};

// Утилиты
const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}) => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  };
  return new Date(dateString).toLocaleDateString('ru-RU', defaultOptions);
};

const formatCurrency = (amount: number, currency: string = 'RUB') => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
};

const formatPercent = (value: number, decimals: number = 1) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

// Фиксированная генерация данных для избежания гидратации
const generateMonthlyData = (months: number = 12) => {
  const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  // Используем детерминированные значения вместо Math.random()
  const data = Array.from({ length: months }, (_, index) => {
    const monthIndex = index % 12;
    // Детерминированные вычисления на основе индекса
    const baseIncome = 2000000 + Math.sin(index * 0.5) * 1000000;
    const baseExpenses = 1000000 + Math.cos(index * 0.3) * 500000;
    
    // Детерминированный "случайный" множитель на основе индекса
    const deterministicRandom = (index * 12345) % 1000 / 1000;
    
    return {
      month: monthNames[monthIndex],
      income: Math.floor(baseIncome + deterministicRandom * 500000),
      expenses: Math.floor(baseExpenses + deterministicRandom * 300000),
      profit: 0,
      investments: Math.floor(deterministicRandom * 300000 + 100000),
      savings: Math.floor(deterministicRandom * 200000 + 50000)
    };
  }).map(item => ({
    ...item,
    profit: item.income - item.expenses
  }));

  return data;
};

// Предварительно вычисленные данные
const PRECOMPUTED_MONTHLY_DATA = generateMonthlyData();

const generateID = (prefix: string = 'item') => {
  // Используем детерминированный ID для SSR
  if (typeof window === 'undefined') {
    return `${prefix}-ssr-${prefix.length}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Базовые компоненты UI
const ThemeProvider = ({ children, theme = 'dark' }: { children: React.ReactNode; theme?: keyof typeof THEMES }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${THEMES[theme].background} transition-all duration-500`}>
      {children}
    </div>
  );
};

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  showCloseButton = true,
  backdropBlur = true
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  showCloseButton?: boolean;
  backdropBlur?: boolean;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    fullscreen: 'max-w-full max-h-full m-4'
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${backdropBlur ? 'bg-black/80 backdrop-blur-xl' : 'bg-black/80'}`}
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div
        ref={modalRef}
        className={`relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden z-10`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="border-b border-slate-700/50 p-6 bg-slate-800/20">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:scale-110 active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        <div className={`p-6 overflow-y-auto custom-scrollbar ${size === 'fullscreen' ? 'max-h-[calc(100vh-80px)]' : 'max-h-[calc(95vh-80px)]'}`}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// Улучшенный компонент BentoCard с лучшей мобильной адаптацией
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.teal, 
  onClick,
  hoverable = true,
  padding = 'p-4 md:p-6',
  delay = 0,
  variant = 'default',
  gradient = true
}: { 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
  delay?: number;
  variant?: 'default' | 'minimal' | 'gradient' | 'glass';
  gradient?: boolean;
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-white/5 border border-white/10 backdrop-blur-sm';
      case 'gradient':
        return `bg-gradient-to-br from-slate-800/50 to-slate-900/70 border border-slate-700/30 backdrop-blur-xl`;
      case 'glass':
        return 'bg-white/10 border border-white/20 backdrop-blur-2xl';
      default:
        return 'bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-slate-700/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        relative overflow-hidden 
        rounded-2xl md:rounded-3xl
        transition-all duration-500
        w-full max-w-full
        group
        ${getVariantStyles()}
        ${hoverable ? 'hover:border-slate-600/70 hover:shadow-2xl' : ''}
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${padding}
        ${className}
      `}
      style={
        gradient ? {
          backgroundImage: `
            radial-gradient(140px circle at 50% 50%, rgba(${glowColor},0.15), transparent 60%),
            linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)
          `
        } : {}
      }
      whileHover={hoverable ? { y: -2, scale: 1.01 } : {}}
      onClick={onClick}
    >
      {gradient && (
        <>
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(300px circle at 50% 50%, rgba(${glowColor},0.12), transparent 50%)`
            }}
          />
          
          <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden">
            <div className="absolute -inset-5 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 group-hover:animate-shine" />
          </div>
        </>
      )}
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

const StatusBadge = ({ 
  status, 
  type = 'default', 
  animated = false, 
  size = 'md',
  showIcon = true 
}: { 
  status: string; 
  type?: 'default' | 'finance' | 'priority' | 'progress';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}) => {
  const getStatusConfig = () => {
    const configs = {
      // Финансовые статусы
      income: { color: FINANCE_COLORS.income, label: 'Доход', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: '📈' },
      expense: { color: FINANCE_COLORS.expense, label: 'Расход', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '📉' },
      profit: { color: FINANCE_COLORS.profit, label: 'Прибыль', bg: 'bg-green-500/15', border: 'border-green-500/30', icon: '💰' },
      revenue: { color: FINANCE_COLORS.revenue, label: 'Выручка', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '💸' },
      tax: { color: FINANCE_COLORS.tax, label: 'Налоги', bg: 'bg-amber-500/15', border: 'border-amber-500/30', icon: '🏛️' },
      investment: { color: FINANCE_COLORS.investment, label: 'Инвестиции', bg: 'bg-purple-500/15', border: 'border-purple-500/30', icon: '📊' },
      savings: { color: FINANCE_COLORS.savings, label: 'Сбережения', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', icon: '🏦' },
      debt: { color: FINANCE_COLORS.debt, label: 'Долг', bg: 'bg-rose-500/15', border: 'border-rose-500/30', icon: '💳' },
      transfer: { color: FINANCE_COLORS.transfer, label: 'Перевод', bg: 'bg-violet-500/15', border: 'border-violet-500/30', icon: '🔄' },
      refund: { color: FINANCE_COLORS.refund, label: 'Возврат', bg: 'bg-lime-500/15', border: 'border-lime-500/30', icon: '↩️' },
      bonus: { color: FINANCE_COLORS.bonus, label: 'Бонус', bg: 'bg-fuchsia-500/15', border: 'border-fuchsia-500/30', icon: '🎁' },
      
      // Статусы операций
      completed: { color: COLORS.success, label: 'Завершен', bg: 'bg-green-500/15', border: 'border-green-500/30', icon: '✅' },
      pending: { color: COLORS.warning, label: 'Ожидание', bg: 'bg-amber-500/15', border: 'border-amber-500/30', icon: '⏳' },
      cancelled: { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '❌' },
      processing: { color: COLORS.info, label: 'В обработке', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '🔄' },
      failed: { color: COLORS.error, label: 'Ошибка', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '⚠️' },
      
      // Приоритеты
      high: { color: FINANCE_COLORS.high, label: 'Высокий', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '🔴' },
      medium: { color: FINANCE_COLORS.medium, label: 'Средний', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: '🟡' },
      low: { color: FINANCE_COLORS.low, label: 'Низкий', bg: 'bg-green-500/15', border: 'border-green-500/30', icon: '🟢' },
      critical: { color: COLORS.error, label: 'Критичный', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '🚨' },
      
      // Прогресс
      on_track: { color: COLORS.success, label: 'По плану', bg: 'bg-green-500/15', border: 'border-green-500/30', icon: '🎯' },
      over_budget: { color: COLORS.error, label: 'Превышен', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '📊' },
      under_budget: { color: COLORS.info, label: 'Экономно', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '💹' },
      at_risk: { color: COLORS.warning, label: 'Под угрозой', bg: 'bg-amber-500/15', border: 'border-amber-500/30', icon: '⚡' }
    };

    return configs[status as keyof typeof configs] || { 
      color: COLORS.slate, 
      label: status, 
      bg: 'bg-slate-500/15', 
      border: 'border-slate-500/30',
      icon: '📄'
    };
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  return (
    <motion.span 
      className={`inline-flex items-center rounded-full font-medium border backdrop-blur-sm ${config.bg} ${config.border} ${sizeClasses[size]}`}
      style={{ color: `rgb(${config.color})` }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {showIcon && (
        <span className="mr-1.5">{config.icon}</span>
      )}
      
      {animated && (
        <motion.div 
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: `rgb(${config.color})` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {!animated && showIcon && (
        <div 
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: `rgb(${config.color})` }}
        />
      )}
      {config.label}
    </motion.span>
  );
};

const ProgressBar = ({ 
  value, 
  max = 100, 
  color = COLORS.teal, 
  label, 
  showValue = true, 
  size = 'md', 
  animated = true,
  variant = 'default',
  showLabel = true
}: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  variant?: 'default' | 'gradient' | 'minimal';
  showLabel?: boolean;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return `bg-gradient-to-r from-${color}-500 to-${color}-600`;
      case 'minimal':
        return `bg-${color}-500`;
      default:
        return '';
    }
  };

  return (
    <div className="w-full">
      {(label || showValue) && showLabel && (
        <div className="flex justify-between text-sm text-slate-300 mb-2">
          {label && <span>{label}</span>}
          {showValue && <span className="font-semibold">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-700/50 rounded-full ${height} overflow-hidden`}>
        <motion.div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${height} ${getVariantStyles()}`}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          style={{ 
            backgroundColor: variant === 'default' ? `rgb(${color})` : undefined,
            boxShadow: `0 0 12px rgba(${color}, 0.4)`
          }}
        />
      </div>
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = COLORS.teal, 
  subtitle, 
  onClick, 
  trend, 
  delay = 0,
  variant = 'default',
  size = 'md'
}: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  subtitle?: string;
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
  variant?: 'default' | 'minimal' | 'highlight';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const trendConfig = trend || (change !== undefined ? (change >= 0 ? 'up' : 'down') : 'neutral');
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl lg:text-3xl',
    lg: 'text-3xl lg:text-4xl'
  };

  return (
    <BentoCard 
      className={`p-4 md:p-6 ${variant === 'highlight' ? 'ring-2 ring-opacity-50' : ''}`}
      glowColor={color} 
      onClick={onClick}
      padding="p-4 md:p-6"
      delay={delay}
      variant={variant === 'minimal' ? 'minimal' : 'default'}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-sm ${
            size === 'sm' ? 'text-xl md:text-2xl' : size === 'lg' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
          }`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.div>
        {trendConfig !== 'neutral' && (
          <motion.div 
            className={`font-semibold px-2 py-1 md:px-2.5 md:py-1 rounded-full backdrop-blur-sm text-xs ${
              trendConfig === 'up' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {trendConfig === 'up' ? '↗' : '↘'} {change !== undefined ? `${Math.abs(change)}%` : ''}
          </motion.div>
        )}
      </div>
      <motion.div 
        className={`font-bold mb-1 ${sizeClasses[size]}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.1 }}
      >
        {value}
      </motion.div>
      <div className="text-slate-300 text-sm font-medium">{title}</div>
      {subtitle && <div className="text-slate-400 text-xs mt-1">{subtitle}</div>}
    </BentoCard>
  );
};

// Типы данных
interface FinancialTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense' | 'transfer' | 'investment';
  category: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled' | 'processing' | 'failed';
  account: string;
  tags: string[];
  currency: string;
  recipient?: string;
  notes?: string;
  attachment?: string;
}

interface FinancialReport {
  id: string;
  title: string;
  period: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  generatedDate: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  metrics: {
    revenueGrowth: number;
    expenseRatio: number;
    profitMargin: number;
    cashFlow: number;
    roi: number;
    liquidity: number;
  };
  insights: string[];
  recommendations: string[];
}

interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  progress: number;
  status: 'on_track' | 'over_budget' | 'under_budget' | 'at_risk';
  period: 'monthly' | 'quarterly' | 'annual';
  currency: string;
  alerts: {
    threshold: number;
    enabled: boolean;
  }[];
}

interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  status: 'active' | 'completed' | 'cancelled' | 'at_risk';
}

// Фиксированные моки данных для избежания гидратации
const financialTransactions: FinancialTransaction[] = [
  {
    id: 'txn-1',
    date: '2024-06-25',
    type: 'income',
    category: 'Услуги',
    description: 'Оплата за консультационные услуги по проекту Alpha',
    amount: 150000,
    status: 'completed',
    account: 'Основной счет',
    tags: ['услуги', 'консультации', 'проект Alpha', 'IT'],
    currency: 'RUB',
    recipient: 'ООО "ТехноСофт"',
    notes: 'Предоплата за первый этап работ'
  },
  {
    id: 'txn-2',
    date: '2024-06-24',
    type: 'expense',
    category: 'Зарплаты',
    description: 'Выплата заработной платы сотрудникам за июнь',
    amount: 850000,
    status: 'completed',
    account: 'Зарплатный счет',
    tags: ['зарплата', 'персонал', 'оплата труда', 'ежемесячно'],
    currency: 'RUB',
    recipient: 'Банк Тинькофф'
  },
  {
    id: 'txn-3',
    date: '2024-06-23',
    type: 'expense',
    category: 'Аренда',
    description: 'Аренда офисного помещения в БЦ "Сокол"',
    amount: 250000,
    status: 'completed',
    account: 'Основной счет',
    tags: ['аренда', 'офис', 'основные расходы', 'недвижимость'],
    currency: 'RUB',
    recipient: 'УК "Сокол Менеджмент"'
  },
  {
    id: 'txn-4',
    date: '2024-06-22',
    type: 'income',
    category: 'Продажи',
    description: 'Продажа корпоративной лицензии программного обеспечения',
    amount: 450000,
    status: 'completed',
    account: 'Основной счет',
    tags: ['продажи', 'софт', 'лицензии', 'корпоративные'],
    currency: 'RUB',
    recipient: 'ОАО "Газпром Нефть"'
  },
  {
    id: 'txn-5',
    date: '2024-06-21',
    type: 'expense',
    category: 'Маркетинг',
    description: 'Рекламная кампания в социальных сетях и контекстная реклама',
    amount: 120000,
    status: 'pending',
    account: 'Маркетинговый счет',
    tags: ['маркетинг', 'реклама', 'smm', 'digital'],
    currency: 'RUB',
    recipient: 'Яндекс Директ'
  },
  {
    id: 'txn-6',
    date: '2024-06-20',
    type: 'income',
    category: 'Инвестиции',
    description: 'Дивиденды по портфельным инвестициям в акции технологических компаний',
    amount: 75000,
    status: 'completed',
    account: 'Инвестиционный счет',
    tags: ['инвестиции', 'дивиденды', 'пассивный доход', 'акции'],
    currency: 'USD',
    recipient: 'Interactive Brokers'
  },
  {
    id: 'txn-7',
    date: '2024-06-19',
    type: 'expense',
    category: 'Разработка',
    description: 'Закупка лицензий ПО для разработки и тестирования',
    amount: 180000,
    status: 'completed',
    account: 'Основной счет',
    tags: ['разработка', 'софт', 'лицензии', 'tools'],
    currency: 'RUB',
    recipient: 'JetBrains'
  },
  {
    id: 'txn-8',
    date: '2024-06-18',
    type: 'income',
    category: 'Продажи',
    description: 'Корпоративная лицензия Enterprise+ с технической поддержкой',
    amount: 890000,
    status: 'completed',
    account: 'Основной счет',
    tags: ['продажи', 'корпоративные', 'лицензии', 'enterprise'],
    currency: 'RUB'
  },
  {
    id: 'txn-9',
    date: '2024-06-17',
    type: 'expense',
    category: 'Командировки',
    description: 'Командировочные расходы на конференцию в Санкт-Петербурге',
    amount: 45000,
    status: 'completed',
    account: 'Операционный счет',
    tags: ['командировки', 'транспорт', 'гостиница', 'конференция'],
    currency: 'RUB'
  },
  {
    id: 'txn-10',
    date: '2024-06-16',
    type: 'income',
    category: 'Инвестиции',
    description: 'Возврат инвестиций по венчурному проекту Blockchain Solutions',
    amount: 320000,
    status: 'completed',
    account: 'Инвестиционный счет',
    tags: ['инвестиции', 'ROI', 'венчурные', 'blockchain'],
    currency: 'RUB'
  },
  {
    id: 'txn-11',
    date: '2024-06-15',
    type: 'transfer',
    category: 'Переводы',
    description: 'Межбанковский перевод на брокерский счет',
    amount: 200000,
    status: 'completed',
    account: 'Основной счет',
    tags: ['перевод', 'инвестиции', 'брокерский счет'],
    currency: 'RUB',
    recipient: 'Тинькофф Инвестиции'
  },
  {
    id: 'txn-12',
    date: '2024-06-14',
    type: 'investment',
    category: 'Инвестиции',
    description: 'Покупка акций голубых фишек на Московской бирже',
    amount: 150000,
    status: 'completed',
    account: 'Брокерский счет',
    tags: ['инвестиции', 'акции', 'мосбиржа', 'портфель'],
    currency: 'RUB'
  }
];

const financialReports: FinancialReport[] = [
  {
    id: 'rep-1',
    title: 'Финансовый отчет за Июнь 2024',
    period: 'Июнь 2024',
    type: 'monthly',
    generatedDate: '2024-06-30',
    totalIncome: 4850000,
    totalExpenses: 3250000,
    netProfit: 1600000,
    metrics: {
      revenueGrowth: 12.5,
      expenseRatio: 67.0,
      profitMargin: 33.0,
      cashFlow: 1450000,
      roi: 24.8,
      liquidity: 2.3
    },
    insights: [
      'Рост доходов на 12.5% по сравнению с предыдущим месяцем',
      'Увеличилась маржа прибыли до 33%',
      'Снижение операционных расходов на 3.2%'
    ],
    recommendations: [
      'Увеличить инвестиции в маркетинг для дальнейшего роста',
      'Оптимизировать налоговую нагрузку',
      'Рассмотреть возможность расширения штата'
    ]
  },
  {
    id: 'rep-2',
    title: 'Отчет за 2 квартал 2024',
    period: 'Апрель-Июнь 2024',
    type: 'quarterly',
    generatedDate: '2024-07-05',
    totalIncome: 14200000,
    totalExpenses: 9800000,
    netProfit: 4400000,
    metrics: {
      revenueGrowth: 8.7,
      expenseRatio: 69.0,
      profitMargin: 31.0,
      cashFlow: 4200000,
      roi: 18.5,
      liquidity: 2.1
    },
    insights: [
      'Стабильный рост в течение квартала',
      'Успешный запуск нового продукта',
      'Увеличение клиентской базы на 25%'
    ],
    recommendations: [
      'Инвестировать в развитие нового продуктового направления',
      'Улучшить процессы управления затратами',
      'Провести анализ эффективности маркетинговых каналов'
    ]
  },
  {
    id: 'rep-3',
    title: 'Годовой отчет 2023',
    period: '2023 год',
    type: 'annual',
    generatedDate: '2024-01-15',
    totalIncome: 52800000,
    totalExpenses: 38500000,
    netProfit: 14300000,
    metrics: {
      revenueGrowth: 15.2,
      expenseRatio: 72.9,
      profitMargin: 27.1,
      cashFlow: 13800000,
      roi: 32.4,
      liquidity: 2.8
    },
    insights: [
      'Годовой рост превысил плановые показатели',
      'Успешная экспансия на новые рынки',
      'Высокая эффективность инвестиций в R&D'
    ],
    recommendations: [
      'Рассмотреть возможность международной экспансии',
      'Увеличить бюджет на исследования и разработки',
      'Оптимизировать структуру капитала'
    ]
  },
  {
    id: 'rep-4',
    title: 'Операционный отчет Май 2024',
    period: 'Май 2024',
    type: 'monthly',
    generatedDate: '2024-06-01',
    totalIncome: 4200000,
    totalExpenses: 2900000,
    netProfit: 1300000,
    metrics: {
      revenueGrowth: 5.2,
      expenseRatio: 69.0,
      profitMargin: 31.0,
      cashFlow: 1250000,
      roi: 15.7,
      liquidity: 2.0
    },
    insights: [
      'Стабильные операционные показатели',
      'Эффективное управление запасами',
      'Снижение кредиторской задолженности'
    ],
    recommendations: [
      'Улучшить управление дебиторской задолженностью',
      'Рассмотреть возможность рефинансирования кредитов',
      'Оптимизировать логистические процессы'
    ]
  }
];

const budgets: Budget[] = [
  {
    id: 'bud-1',
    category: 'Маркетинг',
    allocated: 500000,
    spent: 420000,
    remaining: 80000,
    progress: 84,
    status: 'on_track',
    period: 'monthly',
    currency: 'RUB',
    alerts: [
      { threshold: 90, enabled: true },
      { threshold: 100, enabled: true }
    ]
  },
  {
    id: 'bud-2',
    category: 'Зарплаты',
    allocated: 3500000,
    spent: 3400000,
    remaining: 100000,
    progress: 97,
    status: 'on_track',
    period: 'monthly',
    currency: 'RUB',
    alerts: [
      { threshold: 95, enabled: true },
      { threshold: 100, enabled: true }
    ]
  },
  {
    id: 'bud-3',
    category: 'Аренда',
    allocated: 750000,
    spent: 750000,
    remaining: 0,
    progress: 100,
    status: 'on_track',
    period: 'monthly',
    currency: 'RUB',
    alerts: [
      { threshold: 100, enabled: true }
    ]
  },
  {
    id: 'bud-4',
    category: 'IT и оборудование',
    allocated: 300000,
    spent: 350000,
    remaining: -50000,
    progress: 117,
    status: 'over_budget',
    period: 'monthly',
    currency: 'RUB',
    alerts: [
      { threshold: 90, enabled: true },
      { threshold: 100, enabled: true }
    ]
  },
  {
    id: 'bud-5',
    category: 'Командировки',
    allocated: 200000,
    spent: 120000,
    remaining: 80000,
    progress: 60,
    status: 'under_budget',
    period: 'monthly',
    currency: 'RUB',
    alerts: [
      { threshold: 80, enabled: true }
    ]
  },
  {
    id: 'bud-6',
    category: 'Обучение',
    allocated: 150000,
    spent: 90000,
    remaining: 60000,
    progress: 60,
    status: 'under_budget',
    period: 'monthly',
    currency: 'RUB',
    alerts: [
      { threshold: 75, enabled: true }
    ]
  },
  {
    id: 'bud-7',
    category: 'Налоги',
    allocated: 600000,
    spent: 600000,
    remaining: 0,
    progress: 100,
    status: 'on_track',
    period: 'quarterly',
    currency: 'RUB',
    alerts: [
      { threshold: 100, enabled: true }
    ]
  },
  {
    id: 'bud-8',
    category: 'Разработка',
    allocated: 1200000,
    spent: 1150000,
    remaining: 50000,
    progress: 96,
    status: 'on_track',
    period: 'monthly',
    currency: 'RUB',
    alerts: [
      { threshold: 95, enabled: true }
    ]
  }
];

const financialGoals: FinancialGoal[] = [
  {
    id: 'goal-1',
    title: 'Накопление на первоначальный взнос для квартиры',
    targetAmount: 3000000,
    currentAmount: 1200000,
    deadline: '2025-12-31',
    category: 'Недвижимость',
    priority: 'high',
    progress: 40,
    status: 'active'
  },
  {
    id: 'goal-2',
    title: 'Создание резервного фонда',
    targetAmount: 1500000,
    currentAmount: 900000,
    deadline: '2024-12-31',
    category: 'Финансовая безопасность',
    priority: 'high',
    progress: 60,
    status: 'active'
  },
  {
    id: 'goal-3',
    title: 'Инвестиции в образование',
    targetAmount: 500000,
    currentAmount: 200000,
    deadline: '2025-06-30',
    category: 'Образование',
    priority: 'medium',
    progress: 40,
    status: 'active'
  },
  {
    id: 'goal-4',
    title: 'Покупка автомобиля',
    targetAmount: 2000000,
    currentAmount: 800000,
    deadline: '2026-03-31',
    category: 'Транспорт',
    priority: 'medium',
    progress: 40,
    status: 'active'
  }
];

// Компонент карточки транзакции
const TransactionCard = ({ 
  transaction, 
  onClick, 
  delay = 0,
  variant = 'default',
  isMobile = false
}: { 
  transaction: FinancialTransaction; 
  onClick?: () => void;
  delay?: number;
  variant?: 'default' | 'minimal' | 'detailed';
  isMobile?: boolean;
}) => {
  const getTransactionColor = (type: string) => {
    const colors = {
      income: FINANCE_COLORS.income,
      expense: FINANCE_COLORS.expense,
      transfer: FINANCE_COLORS.transfer,
      investment: FINANCE_COLORS.investment
    };
    return colors[type as keyof typeof colors] || FINANCE_COLORS.income;
  };

  const getTransactionIcon = (type: string) => {
    const icons = {
      income: '📈',
      expense: '📉',
      transfer: '🔄',
      investment: '📊'
    };
    return icons[type as keyof typeof icons] || '💰';
  };

  return (
    <BentoCard 
      className={isMobile ? "p-3" : "p-4"} 
      glowColor={getTransactionColor(transaction.type)} 
      onClick={onClick}
      delay={delay}
      variant={variant === 'minimal' ? 'minimal' : 'default'}
      padding={isMobile ? "p-3" : "p-4"}
    >
      <div className={`flex items-start justify-between ${isMobile ? 'mb-2' : 'mb-3'}`}>
        <div className="flex items-start space-x-2 flex-1">
          <motion.div 
            className={`p-1.5 rounded-lg ${
              transaction.type === 'income' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : transaction.type === 'expense'
                ? 'bg-rose-500/20 text-rose-400'
                : transaction.type === 'transfer'
                ? 'bg-violet-500/20 text-violet-400'
                : 'bg-purple-500/20 text-purple-400'
            }`}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <span className={isMobile ? "text-sm" : "text-base"}>{getTransactionIcon(transaction.type)}</span>
          </motion.div>
          <div className="flex-1 min-w-0">
            <h5 className={`text-white font-semibold ${isMobile ? 'text-xs' : 'text-sm'} mb-0.5 line-clamp-2`}>
              {transaction.description}
            </h5>
            <p className={`text-slate-400 ${isMobile ? 'text-xs' : 'text-xs'}`}>
              {transaction.category} • {formatDate(transaction.date, { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1 ml-2">
          <StatusBadge status={transaction.type} size={isMobile ? "sm" : "sm"} />
          <StatusBadge status={transaction.status} size={isMobile ? "sm" : "sm"} />
        </div>
      </div>
      
      <div className={`space-y-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Сумма:</span>
          <span className={`font-medium ${
            transaction.type === 'income' ? 'text-emerald-400' : 
            transaction.type === 'expense' ? 'text-rose-400' :
            transaction.type === 'transfer' ? 'text-violet-400' : 'text-purple-400'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
          </span>
        </div>
        
        {!isMobile && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Счет:</span>
            <span className="text-white">{transaction.account}</span>
          </div>
        )}

        {variant === 'detailed' && transaction.notes && !isMobile && (
          <div className="flex justify-between items-start">
            <span className="text-slate-400">Примечания:</span>
            <span className="text-white text-right text-xs">{transaction.notes}</span>
          </div>
        )}

        {transaction.tags.length > 0 && !isMobile && (
          <div className="flex flex-wrap gap-1 mt-2">
            {transaction.tags.slice(0, 3).map((tag, index) => (
              <motion.span 
                key={index}
                className="text-xs text-slate-400 bg-white/5 rounded-full px-2 py-1 border border-slate-600/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.span>
            ))}
            {transaction.tags.length > 3 && (
              <span className="text-xs text-slate-500">+{transaction.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </BentoCard>
  );
};

// Компонент карточки отчета
const ReportCard = ({ 
  report, 
  onClick, 
  delay = 0,
  variant = 'default'
}: { 
  report: FinancialReport; 
  onClick?: () => void;
  delay?: number;
  variant?: 'default' | 'minimal' | 'analytical';
}) => {
  const getReportColor = (type: string) => {
    const colors = {
      monthly: FINANCE_COLORS.revenue,
      quarterly: FINANCE_COLORS.investment,
      annual: FINANCE_COLORS.savings,
      custom: FINANCE_COLORS.tax
    };
    return colors[report.type] || FINANCE_COLORS.revenue;
  };

  return (
    <BentoCard 
      className="p-4 md:p-5" 
      glowColor={getReportColor(report.type)} 
      onClick={onClick}
      delay={delay}
      variant={variant === 'minimal' ? 'minimal' : 'default'}
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-sm md:text-base mb-1 line-clamp-2">{report.title}</h4>
          <p className="text-slate-400 text-xs md:text-sm">Период: {report.period}</p>
          {variant === 'analytical' && (
            <p className="text-slate-500 text-xs mt-1">
              Создан: {formatDate(report.generatedDate, { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
        <StatusBadge status={report.type} />
      </div>
      
      <div className="space-y-2 md:space-y-3 text-xs md:text-sm mb-4 md:mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Доходы:</span>
          <span className="text-emerald-400 font-medium">{formatCurrency(report.totalIncome)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Расходы:</span>
          <span className="text-rose-400 font-medium">{formatCurrency(report.totalExpenses)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Прибыль:</span>
          <span className="text-green-400 font-medium">{formatCurrency(report.netProfit)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рентабельность:</span>
          <span className="text-white font-medium">{report.metrics.profitMargin}%</span>
        </div>

        {variant === 'analytical' && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">ROI:</span>
              <span className="text-blue-400 font-medium">{report.metrics.roi}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Ликвидность:</span>
              <span className="text-cyan-400 font-medium">{report.metrics.liquidity}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-slate-700/50">
        <div className="text-xs text-slate-400">
          {report.insights.length} инсайтов
        </div>
        <div className="text-xs font-semibold text-emerald-500">
          Рост: {formatPercent(report.metrics.revenueGrowth)}
        </div>
      </div>

      {variant === 'analytical' && report.insights.length > 0 && (
        <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-slate-700/50">
          <p className="text-slate-400 text-xs mb-1 md:mb-2">Ключевой инсайт:</p>
          <p className="text-white text-xs line-clamp-2">{report.insights[0]}</p>
        </div>
      )}
    </BentoCard>
  );
};

// Компонент карточки бюджета
const BudgetCard = ({ 
  budget, 
  onClick, 
  delay = 0,
  variant = 'default'
}: { 
  budget: Budget; 
  onClick?: () => void;
  delay?: number;
  variant?: 'default' | 'minimal' | 'detailed';
}) => {
  const getBudgetColor = (status: string) => {
    switch (status) {
      case 'on_track': return FINANCE_COLORS.income;
      case 'over_budget': return FINANCE_COLORS.expense;
      case 'under_budget': return FINANCE_COLORS.savings;
      case 'at_risk': return FINANCE_COLORS.debt;
      default: return FINANCE_COLORS.tax;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-emerald-400';
      case 'over_budget': return 'text-rose-400';
      case 'under_budget': return 'text-cyan-400';
      case 'at_risk': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <BentoCard 
      className="p-4 md:p-5" 
      glowColor={getBudgetColor(budget.status)} 
      onClick={onClick}
      delay={delay}
      variant={variant === 'minimal' ? 'minimal' : 'default'}
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-sm md:text-base mb-1">{budget.category}</h4>
          <div className="flex items-center space-x-2 text-slate-400 text-xs md:text-sm">
            <span>Бюджет</span>
            <span>•</span>
            <StatusBadge status={budget.period} size="sm" showIcon={false} />
          </div>
        </div>
        <StatusBadge status={budget.status} />
      </div>
      
      <div className="space-y-2 md:space-y-3 text-xs md:text-sm mb-4 md:mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Выделено:</span>
          <span className="text-white font-medium">{formatCurrency(budget.allocated, budget.currency)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Потрачено:</span>
          <span className="text-white font-medium">{formatCurrency(budget.spent, budget.currency)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Остаток:</span>
          <span className={`font-medium ${getStatusColor(budget.status)}`}>
            {formatCurrency(budget.remaining, budget.currency)}
          </span>
        </div>

        <ProgressBar 
          value={budget.progress} 
          color={getBudgetColor(budget.status)}
          label="Использование бюджета"
          showValue
          delay={delay + 0.2}
        />

        {variant === 'detailed' && budget.alerts.some(alert => alert.enabled) && (
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>🔔</span>
            <span>Уведомления включены</span>
          </div>
        )}
      </div>
    </BentoCard>
  );
};

// Компонент карточки финансовой цели
const GoalCard = ({ 
  goal, 
  onClick, 
  delay = 0 
}: { 
  goal: FinancialGoal; 
  onClick?: () => void;
  delay?: number;
}) => {
  const getGoalColor = (priority: string) => {
    switch (priority) {
      case 'high': return FINANCE_COLORS.high;
      case 'medium': return FINANCE_COLORS.medium;
      case 'low': return FINANCE_COLORS.low;
      default: return FINANCE_COLORS.savings;
    }
  };

  const daysUntilDeadline = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <BentoCard 
      className="p-4 md:p-5" 
      glowColor={getGoalColor(goal.priority)} 
      onClick={onClick}
      delay={delay}
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-sm md:text-base mb-1 line-clamp-2">{goal.title}</h4>
          <p className="text-slate-400 text-xs md:text-sm">{goal.category}</p>
        </div>
        <StatusBadge status={goal.priority} />
      </div>
      
      <div className="space-y-2 md:space-y-3 text-xs md:text-sm mb-4 md:mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Цель:</span>
          <span className="text-white font-medium">{formatCurrency(goal.targetAmount)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Накоплено:</span>
          <span className="text-emerald-400 font-medium">{formatCurrency(goal.currentAmount)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Осталось:</span>
          <span className="text-cyan-400 font-medium">{formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
        </div>

        <ProgressBar 
          value={goal.progress} 
          color={getGoalColor(goal.priority)}
          label={`Прогресс: ${goal.progress}%`}
          showValue
        />

        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>До дедлайна:</span>
          <span className={daysUntilDeadline < 30 ? 'text-rose-400' : 'text-slate-400'}>
            {daysUntilDeadline} дней
          </span>
        </div>
      </div>
    </BentoCard>
  );
};

// Улучшенный компонент SearchAndFilters для мобильных устройств
const SearchAndFilters = ({ 
  dateRange, 
  setDateRange, 
  searchQuery, 
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  isMobile = false
}: {
  dateRange: string;
  setDateRange: (range: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  viewMode?: 'grid' | 'list';
  setViewMode?: (mode: 'grid' | 'list') => void;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
  isMobile?: boolean;
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const categories = ['Все категории', 'Услуги', 'Зарплаты', 'Аренда', 'Продажи', 'Маркетинг', 'Инвестиции', 'Разработка', 'Командировки', 'Налоги', 'Переводы'];

  if (isMobile) {
    return (
      <div className="space-y-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 mb-4">
        {/* Поиск всегда виден */}
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 text-sm"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Кнопка показа фильтров */}
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors text-sm flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Фильтры {showFilters ? '▲' : '▼'}
        </button>

        {/* Раскрывающиеся фильтры */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="quarter">Квартал</option>
                <option value="year">Год</option>
                <option value="all">Все время</option>
              </select>
              
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {sortBy && setSortBy && (
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date-desc">Сначала новые</option>
                  <option value="date-asc">Сначала старые</option>
                  <option value="amount-desc">Сумма (убыв.)</option>
                  <option value="amount-asc">Сумма (возр.)</option>
                  <option value="category">Категория</option>
                </select>
              )}

              {viewMode && setViewMode && (
                <div className="flex bg-slate-700/50 border border-slate-600 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 p-1.5 rounded-md transition-colors text-xs ${
                      viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Сетка
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 p-1.5 rounded-md transition-colors text-xs ${
                      viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Список
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Десктопная версия
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 mb-6">
      {/* Поиск */}
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск операций, категорий, тегов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-2">
        <select 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
          <option value="quarter">Квартал</option>
          <option value="year">Год</option>
          <option value="all">Все время</option>
        </select>
        
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {sortBy && setSortBy && (
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date-desc">Сначала новые</option>
            <option value="date-asc">Сначала старые</option>
            <option value="amount-desc">Сумма (убыв.)</option>
            <option value="amount-asc">Сумма (возр.)</option>
            <option value="category">Категория</option>
          </select>
        )}

        {viewMode && setViewMode && (
          <div className="flex bg-slate-700/50 border border-slate-600 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}

        <button className="px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:bg-slate-600/50 transition-colors text-sm">
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Фильтры
        </button>
      </div>
    </div>
  );
};

// Улучшенный компонент QuickActions для мобильных
const QuickActions = () => {
  const actions = [
    { icon: '📊', label: 'Отчет', color: 'from-blue-500 to-cyan-500', action: () => console.log('Create report') },
    { icon: '💳', label: 'Операция', color: 'from-emerald-500 to-green-500', action: () => console.log('Add transaction') },
    { icon: '💰', label: 'Бюджет', color: 'from-purple-500 to-pink-500', action: () => console.log('Set budget') },
    { icon: '📈', label: 'Анализ', color: 'from-orange-500 to-red-500', action: () => console.log('Analyze') },
  ];

  const [showAll, setShowAll] = useState(false);

  return (
    <div className="mb-6">
      <div className={`grid grid-cols-2 gap-2 ${showAll ? 'grid-cols-2 md:grid-cols-4' : ''}`}>
        {(showAll ? actions : actions.slice(0, 4)).map((action, index) => (
          <motion.button
            key={index}
            className={`p-3 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium text-xs backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 group`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-lg mb-1 group-hover:scale-110 transition-transform duration-300">
              {action.icon}
            </div>
            <div className="truncate">{action.label}</div>
          </motion.button>
        ))}
      </div>
      
      {!showAll && actions.length > 4 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-2 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors text-sm"
        >
          Еще {actions.length - 4} действий ▼
        </button>
      )}
    </div>
  );
};

// Улучшенный компонент навигации для мобильных
const MobileNavigation = ({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: string; 
  setActiveTab: (tab: any) => void;
}) => {
  const tabs = [
    { id: 'overview', label: 'Обзор', icon: '📊' },
    { id: 'transactions', label: 'Операции', icon: '💳' },
    { id: 'reports', label: 'Отчеты', icon: '📋' },
    { id: 'budgets', label: 'Бюджеты', icon: '💰' },
    { id: 'goals', label: 'Цели', icon: '🎯' }
  ];

  return (
    <div className="flex space-x-1 p-1 bg-slate-800/50 rounded-xl backdrop-blur-xl border border-slate-700/50 mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-shrink-0 flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-white/10 text-white shadow-lg shadow-black/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

// Компонент уведомлений
const NotificationsPanel = () => {
  const notifications = [
    { 
      id: 1, 
      type: 'warning', 
      message: 'Бюджет IT превышен на 17%', 
      time: '2 часа назад',
      action: 'Просмотреть'
    },
    { 
      id: 2, 
      type: 'info', 
      message: 'Новый отчет доступен для просмотра', 
      time: '5 часов назад',
      action: 'Открыть'
    },
    { 
      id: 3, 
      type: 'success', 
      message: 'Все квартальные цели достигнуты', 
      time: '1 день назад',
      action: 'Поздравляем!'
    },
    { 
      id: 4, 
      type: 'error', 
      message: 'Неудачная попытка синхронизации с банком', 
      time: '2 дня назад',
      action: 'Повторить'
    }
  ];

  return (
    <BentoCard className="p-4 mb-6" glowColor={FINANCE_COLORS.amber}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm md:text-base">Уведомления</h3>
        <span className="text-xs text-slate-400 bg-white/10 rounded-full px-2 py-1">
          {notifications.length} новых
        </span>
      </div>
      <div className="space-y-2">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`w-2 h-2 rounded-full mt-2 ${
              notification.type === 'warning' ? 'bg-amber-500' :
              notification.type === 'info' ? 'bg-blue-500' : 
              notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`} />
            <div className="flex-1">
              <p className="text-white text-sm">{notification.message}</p>
              <p className="text-slate-400 text-xs">{notification.time}</p>
            </div>
            <motion.button 
              className="text-xs text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              whileHover={{ scale: 1.05 }}
            >
              {notification.action}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </BentoCard>
  );
};

// Анимированный фон
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 150, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
};

// Хук для определения мобильного устройства с исправлением гидратации
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Устанавливаем начальное значение на основе userAgent для SSR
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
    const initialIsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(initialIsMobile);

    // После монтирования обновляем на основе реальной ширины экрана
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};

// Основной компонент дашборда финансов с исправлением гидратации
const FinanceReportsDashboard = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'reports' | 'budgets' | 'goals'>('overview');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date-desc');
  const [theme, setTheme] = useState<'dark' | 'light' | 'professional'>('dark');
  const [isMounted, setIsMounted] = useState(false);

  const isMobile = useMobile();

  // Исправление гидратации - ждем монтирования компонента
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Прокрутка прогресса
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Статистика для дашборда с фиксированными значениями
  const stats = useMemo(() => {
    const monthlyData = PRECOMPUTED_MONTHLY_DATA;
    const currentMonth = monthlyData[5]; // Июнь
    const totalIncome = financialTransactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = financialTransactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((acc, t) => acc + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    
    // Дополнительная аналитика
    const investmentIncome = financialTransactions
      .filter(t => t.type === 'investment' && t.status === 'completed')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const savingsAmount = financialGoals.reduce((acc, goal) => acc + goal.currentAmount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      monthlyData,
      currentMonth,
      investmentIncome,
      savingsAmount,
      transactionCount: financialTransactions.length,
      completedTransactions: financialTransactions.filter(t => t.status === 'completed').length
    };
  }, []);

  // Фильтрация и сортировка данных
  const filteredTransactions = useMemo(() => {
    let filtered = financialTransactions;
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.recipient?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Фильтрация по категории
    if (selectedCategory !== 'Все категории') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [searchQuery, selectedCategory, dateRange, sortBy]);

  const filteredReports = useMemo(() => {
    return financialReports;
  }, [dateRange]);

  const filteredBudgets = useMemo(() => {
    return budgets;
  }, []);

  const filteredGoals = useMemo(() => {
    return financialGoals;
  }, []);

  // Быстрый доступ к часто используемым функциям
  const quickStats = [
    {
      label: 'Активные бюджеты',
      value: budgets.filter(b => b.status === 'on_track').length,
      total: budgets.length,
      color: COLORS.emerald
    },
    {
      label: 'Открытые цели',
      value: financialGoals.filter(g => g.status === 'active').length,
      total: financialGoals.length,
      color: COLORS.blue
    },
    {
      label: 'Ожидающие операции',
      value: financialTransactions.filter(t => t.status === 'pending').length,
      total: financialTransactions.length,
      color: COLORS.amber
    }
  ];

  // Если компонент еще не смонтирован, показываем минимальный контент
  if (!isMounted) {
    return (
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-3 md:p-6 relative">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-2xl mb-4">📊</div>
              <div className="text-slate-300">Загрузка финансового дашборда...</div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-3 md:p-6 relative">
        <AnimatedBackground />

        {/* Хедер с мобильной адаптацией */}
        <motion.header 
          className="mb-6 md:mb-8 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col mb-4 md:mb-6">
            <div className="mb-4">
              <motion.h1 
                className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-1 md:mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Финансовые Отчеты
              </motion.h1>
              <motion.p 
                className="text-slate-400 text-sm md:text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isMobile ? 'Контроль финансов' : 'Полный контроль над финансами и аналитика в реальном времени'}
              </motion.p>
            </div>
            
            {/* Мобильные кнопки действий */}
            {isMobile ? (
              <div className="flex space-x-2 mb-4">
                <motion.button 
                  className="flex-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center space-x-1 text-sm"
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📊</span>
                  <span>Отчет</span>
                </motion.button>
                <motion.button 
                  className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center space-x-1 text-sm"
                  whileTap={{ scale: 0.95 }}
                >
                  <span>💰</span>
                  <span>Добавить</span>
                </motion.button>
              </div>
            ) : (
              <motion.div 
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button 
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-medium transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📊</span>
                  <span>Создать отчет</span>
                </motion.button>
                <motion.button 
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>💰</span>
                  <span>Добавить операцию</span>
                </motion.button>
                <motion.button 
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(theme === 'dark' ? 'professional' : 'dark')}
                >
                  <span>🎨</span>
                  <span>Тема</span>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Навигация */}
          {isMobile ? (
            <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          ) : (
            <motion.nav 
              className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { id: 'overview', label: 'Обзор', icon: '📊' },
                { id: 'transactions', label: 'Операции', icon: '💳' },
                { id: 'reports', label: 'Отчеты', icon: '📋' },
                { id: 'budgets', label: 'Бюджеты', icon: '💰' },
                { id: 'goals', label: 'Цели', icon: '🎯' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </motion.nav>
          )}

          {/* Быстрые действия */}
          <QuickActions />

          {/* Уведомления и быстрая статистика с мобильной адаптацией */}
          <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-4'} mb-6`}>
            <NotificationsPanel />
            {!isMobile && (
              <div className="lg:col-span-2">
                <div className="grid grid-cols-3 gap-3">
                  {quickStats.map((stat, index) => (
                    <BentoCard key={index} className="p-4 text-center" delay={0.5 + index * 0.1}>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}/{stat.total}</div>
                      <div className="text-slate-400 text-sm">{stat.label}</div>
                      <ProgressBar 
                        value={(stat.value / stat.total) * 100} 
                        color={stat.color}
                        showValue={false}
                        size="sm"
                        variant="minimal"
                        showLabel={false}
                      />
                    </BentoCard>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Поиск и фильтры */}
          <SearchAndFilters
            dateRange={dateRange}
            setDateRange={setDateRange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
            isMobile={isMobile}
          />
        </motion.header>

        {/* Основной контент с улучшенной мобильной сеткой */}
        <main className="relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Основная статистика с мобильной адаптацией */}
                <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'} mb-6 md:mb-8`}>
                  <StatCard
                    title="Доход"
                    value={isMobile ? formatCurrency(stats.totalIncome).split(',')[0] + 'K' : formatCurrency(stats.totalIncome)}
                    change={12.5}
                    icon="📈"
                    color={FINANCE_COLORS.income}
                    subtitle={isMobile ? "период" : "за текущий период"}
                    trend="up"
                    delay={0.1}
                    size={isMobile ? "sm" : "md"}
                  />
                  <StatCard
                    title="Расходы"
                    value={isMobile ? formatCurrency(stats.totalExpenses).split(',')[0] + 'K' : formatCurrency(stats.totalExpenses)}
                    change={8.2}
                    icon="📉"
                    color={FINANCE_COLORS.expense}
                    subtitle={isMobile ? "период" : "за текущий период"}
                    trend="up"
                    delay={0.2}
                    size={isMobile ? "sm" : "md"}
                  />
                  {!isMobile && (
                    <>
                      <StatCard
                        title="Прибыль"
                        value={formatCurrency(stats.netProfit)}
                        change={15.8}
                        icon="💰"
                        color={FINANCE_COLORS.profit}
                        subtitle="рентабельность"
                        trend="up"
                        delay={0.3}
                      />
                      <StatCard
                        title="Маржа"
                        value={`${stats.profitMargin.toFixed(1)}%`}
                        change={3.2}
                        icon="🎯"
                        color={FINANCE_COLORS.revenue}
                        subtitle="прибыль"
                        trend="up"
                        delay={0.4}
                      />
                    </>
                  )}
                </div>

                <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'} mb-6 md:mb-8`}>
                  {/* Последние операции */}
                  <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.revenue} delay={0.6}>
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-bold text-white">Последние операции</h3>
                      <motion.button 
                        className="text-slate-400 hover:text-white text-sm font-medium flex items-center space-x-1"
                        whileHover={{ x: 2 }}
                      >
                        <span>Все</span>
                        <span>→</span>
                      </motion.button>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      {financialTransactions.slice(0, 5).map((transaction, index) => (
                        <motion.div 
                          key={transaction.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer group"
                          onClick={() => setSelectedTransaction(transaction)}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <motion.div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                transaction.type === 'income' 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : transaction.type === 'expense'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : transaction.type === 'transfer'
                                  ? 'bg-violet-500/20 text-violet-400'
                                  : 'bg-purple-500/20 text-purple-400'
                              }`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {transaction.type === 'income' ? '⬆️' : 
                               transaction.type === 'expense' ? '⬇️' :
                               transaction.type === 'transfer' ? '🔄' : '📊'}
                            </motion.div>
                            <div>
                              <h4 className="text-white font-medium text-sm">{transaction.description}</h4>
                              <p className="text-slate-400 text-xs">{transaction.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${
                              transaction.type === 'income' ? 'text-emerald-400' : 
                              transaction.type === 'expense' ? 'text-rose-400' :
                              transaction.type === 'transfer' ? 'text-violet-400' : 'text-purple-400'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-slate-400 text-xs">{formatDate(transaction.date)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </BentoCard>

                  {/* Дополнительный контент для десктопа */}
                  {!isMobile && (
                    <BentoCard className="p-6" glowColor={FINANCE_COLORS.investment} delay={0.8}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Аналитика</h3>
                        <motion.button 
                          className="text-slate-400 hover:text-white text-sm font-medium flex items-center space-x-1"
                          whileHover={{ x: 2 }}
                        >
                          <span>Подробнее</span>
                          <span>→</span>
                        </motion.button>
                      </div>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl text-emerald-400 font-bold mb-2">
                            {/* Фиксированное значение для избежания гидратации */}
                            {formatPercent(1.7)}
                          </div>
                          <div className="text-slate-400 text-sm">Рост прибыли за месяц</div>
                        </div>
                        <ProgressBar 
                          value={75} 
                          color={FINANCE_COLORS.income}
                          label="Эффективность инвестиций"
                          showValue
                        />
                        <ProgressBar 
                          value={60} 
                          color={FINANCE_COLORS.savings}
                          label="Достижение целей"
                          showValue
                        />
                      </div>
                    </BentoCard>
                  )}
                </div>

                {/* Бюджеты и цели */}
                <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}`}>
                  {/* Бюджеты */}
                  <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.tax} delay={0.8}>
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-bold text-white">Бюджеты</h3>
                      <motion.button 
                        className="text-slate-400 hover:text-white text-sm font-medium flex items-center space-x-1"
                        whileHover={{ x: 2 }}
                      >
                        <span>Все</span>
                        <span>→</span>
                      </motion.button>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      {budgets.slice(0, 3).map((budget, index) => (
                        <motion.div 
                          key={budget.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                          onClick={() => setSelectedBudget(budget)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div>
                            <h4 className="text-white font-medium text-sm">{budget.category}</h4>
                            <p className="text-slate-400 text-xs">
                              {formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${
                              budget.status === 'on_track' ? 'text-emerald-400' :
                              budget.status === 'over_budget' ? 'text-rose-400' : 
                              budget.status === 'under_budget' ? 'text-cyan-400' : 'text-amber-400'
                            }`}>
                              {budget.progress}%
                            </p>
                            <StatusBadge status={budget.status} size="sm" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </BentoCard>

                  {/* Финансовые цели */}
                  <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.investment} delay={1.0}>
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-bold text-white">Финансовые цели</h3>
                      <motion.button 
                        className="text-slate-400 hover:text-white text-sm font-medium flex items-center space-x-1"
                        whileHover={{ x: 2 }}
                      >
                        <span>Все</span>
                        <span>→</span>
                      </motion.button>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      {financialGoals.slice(0, 3).map((goal, index) => (
                        <motion.div 
                          key={goal.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                          onClick={() => setSelectedGoal(goal)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div>
                            <h4 className="text-white font-medium text-sm">{goal.title}</h4>
                            <p className="text-slate-400 text-xs">{goal.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 text-sm font-medium">{goal.progress}%</p>
                            <StatusBadge status={goal.priority} size="sm" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </BentoCard>
                </div>
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Финансовые операции</h2>
                  <p className="text-slate-400 text-sm">
                    {filteredTransactions.length} операций найдено
                    {searchQuery && ` по запросу "${searchQuery}"`}
                    {selectedCategory !== 'Все категории' && ` в категории "${selectedCategory}"`}
                  </p>
                </div>
                
                <div className={`${
                  viewMode === 'grid' 
                    ? `grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-3 md:gap-4` 
                    : 'space-y-3 md:space-y-4'
                }`}>
                  {filteredTransactions.map((transaction, index) => (
                    viewMode === 'grid' ? (
                      <TransactionCard 
                        key={transaction.id} 
                        transaction={transaction} 
                        onClick={() => setSelectedTransaction(transaction)}
                        delay={index * 0.1}
                        variant={isMobile ? "minimal" : "detailed"}
                        isMobile={isMobile}
                      />
                    ) : (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TransactionCard 
                          transaction={transaction} 
                          onClick={() => setSelectedTransaction(transaction)}
                          variant={isMobile ? "minimal" : "detailed"}
                          isMobile={isMobile}
                        />
                      </motion.div>
                    )
                  ))}
                </div>

                {filteredTransactions.length === 0 && (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Операции не найдены</h3>
                    <p className="text-slate-400">Попробуйте изменить параметры поиска или фильтры</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Финансовые отчеты</h2>
                  <p className="text-slate-400 text-sm md:text-base">Аналитические отчеты и статистика</p>
                </div>
                
                <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-3 md:gap-4`}>
                  {filteredReports.map((report, index) => (
                    <ReportCard 
                      key={report.id} 
                      report={report} 
                      onClick={() => setSelectedReport(report)}
                      delay={index * 0.1}
                      variant="analytical"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'budgets' && (
              <motion.div
                key="budgets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Бюджеты</h2>
                  <p className="text-slate-400 text-sm md:text-base">Управление бюджетами и контроль расходов</p>
                </div>
                
                <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-3 md:gap-4`}>
                  {filteredBudgets.map((budget, index) => (
                    <BudgetCard 
                      key={budget.id} 
                      budget={budget} 
                      onClick={() => setSelectedBudget(budget)}
                      delay={index * 0.1}
                      variant="detailed"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Финансовые цели</h2>
                  <p className="text-slate-400 text-sm md:text-base">Планирование и отслеживание финансовых целей</p>
                </div>
                
                <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-3 md:gap-4`}>
                  {filteredGoals.map((goal, index) => (
                    <GoalCard 
                      key={goal.id} 
                      goal={goal} 
                      onClick={() => setSelectedGoal(goal)}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Модальные окна */}
        <Modal 
          isOpen={!!selectedTransaction} 
          onClose={() => setSelectedTransaction(null)}
          title="Детали операции"
          size={isMobile ? "md" : "lg"}
        >
          {selectedTransaction && (
            <div className="space-y-4 md:space-y-6">
              <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'}`}>
                <BentoCard className="p-4 md:p-6" glowColor={getTransactionColor(selectedTransaction.type)}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Основная информация</h4>
                  <div className="space-y-2 md:space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Описание:</span>
                      <span className="text-white text-right">{selectedTransaction.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Категория:</span>
                      <span className="text-white">{selectedTransaction.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Тип:</span>
                      <StatusBadge status={selectedTransaction.type} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Статус:</span>
                      <StatusBadge status={selectedTransaction.status} />
                    </div>
                    {selectedTransaction.recipient && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Получатель:</span>
                        <span className="text-white">{selectedTransaction.recipient}</span>
                      </div>
                    )}
                  </div>
                </BentoCard>

                <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.revenue}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Финансовая информация</h4>
                  <div className="space-y-2 md:space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Сумма:</span>
                      <span className={`text-xl font-bold ${
                        selectedTransaction.type === 'income' ? 'text-emerald-400' : 
                        selectedTransaction.type === 'expense' ? 'text-rose-400' :
                        selectedTransaction.type === 'transfer' ? 'text-violet-400' : 'text-purple-400'
                      }`}>
                        {selectedTransaction.type === 'income' ? '+' : '-'}{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Дата:</span>
                      <span className="text-white">{formatDate(selectedTransaction.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Счет:</span>
                      <span className="text-white">{selectedTransaction.account}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Валюта:</span>
                      <span className="text-white">{selectedTransaction.currency}</span>
                    </div>
                  </div>
                </BentoCard>
              </div>

              {selectedTransaction.tags.length > 0 && (
                <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.tax}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Теги и категории</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTransaction.tags.map((tag, index) => (
                      <motion.span 
                        key={index}
                        className="text-sm text-slate-300 bg-white/10 rounded-full px-3 py-1.5 border border-slate-600/50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </BentoCard>
              )}

              {selectedTransaction.notes && (
                <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.info}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Примечания</h4>
                  <p className="text-slate-300">{selectedTransaction.notes}</p>
                </BentoCard>
              )}
            </div>
          )}
        </Modal>

        <Modal 
          isOpen={!!selectedReport} 
          onClose={() => setSelectedReport(null)}
          title={selectedReport?.title}
          size={isMobile ? "md" : "xl"}
        >
          {selectedReport && (
            <div className="space-y-4 md:space-y-6">
              <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'}`}>
                <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.income}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Основные показатели</h4>
                  <div className="space-y-2 md:space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Общий доход:</span>
                      <span className="text-emerald-400 font-medium">{formatCurrency(selectedReport.totalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Общие расходы:</span>
                      <span className="text-rose-400 font-medium">{formatCurrency(selectedReport.totalExpenses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Чистая прибыль:</span>
                      <span className="text-green-400 font-medium">{formatCurrency(selectedReport.netProfit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Денежный поток:</span>
                      <span className="text-blue-400 font-medium">{formatCurrency(selectedReport.metrics.cashFlow)}</span>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.revenue}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Ключевые метрики</h4>
                  <div className="space-y-2 md:space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Рост выручки:</span>
                      <span className="text-emerald-400 font-medium">{formatPercent(selectedReport.metrics.revenueGrowth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Коэффициент расходов:</span>
                      <span className="text-white font-medium">{selectedReport.metrics.expenseRatio}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Маржа прибыли:</span>
                      <span className="text-green-400 font-medium">{selectedReport.metrics.profitMargin}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ROI:</span>
                      <span className="text-blue-400 font-medium">{selectedReport.metrics.roi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ликвидность:</span>
                      <span className="text-cyan-400 font-medium">{selectedReport.metrics.liquidity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Период:</span>
                      <span className="text-white">{selectedReport.period}</span>
                    </div>
                  </div>
                </BentoCard>
              </div>

              <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.investment}>
                <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Анализ эффективности</h4>
                <div className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'md:grid-cols-4 gap-4'}`}>
                  <motion.div 
                    className="text-center p-3 md:p-4 rounded-xl bg-white/5"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl text-emerald-400 mb-2">📈</div>
                    <div className="text-white font-medium text-sm">Рост</div>
                    <div className="text-slate-400 text-xs">{formatPercent(selectedReport.metrics.revenueGrowth)}</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-3 md:p-4 rounded-xl bg-white/5"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl text-rose-400 mb-2">📊</div>
                    <div className="text-white font-medium text-sm">Расходы</div>
                    <div className="text-slate-400 text-xs">{selectedReport.metrics.expenseRatio}%</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-3 md:p-4 rounded-xl bg-white/5"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl text-green-400 mb-2">🎯</div>
                    <div className="text-white font-medium text-sm">Маржа</div>
                    <div className="text-slate-400 text-xs">{selectedReport.metrics.profitMargin}%</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-3 md:p-4 rounded-xl bg-white/5"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl text-blue-400 mb-2">💧</div>
                    <div className="text-white font-medium text-sm">Кэш-флоу</div>
                    <div className="text-slate-400 text-xs">{formatCurrency(selectedReport.metrics.cashFlow)}</div>
                  </motion.div>
                </div>
              </BentoCard>

              {selectedReport.insights.length > 0 && (
                <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.savings}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Ключевые инсайты</h4>
                  <ul className="space-y-2 text-slate-300">
                    {selectedReport.insights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span className="text-sm">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </BentoCard>
              )}

              {selectedReport.recommendations.length > 0 && (
                <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.tax}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Рекомендации</h4>
                  <ul className="space-y-2 text-slate-300">
                    {selectedReport.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </BentoCard>
              )}
            </div>
          )}
        </Modal>

        <Modal 
          isOpen={!!selectedBudget} 
          onClose={() => setSelectedBudget(null)}
          title={`Бюджет: ${selectedBudget?.category}`}
          size={isMobile ? "md" : "lg"}
        >
          {selectedBudget && (
            <div className="space-y-4 md:space-y-6">
              <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'}`}>
                <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.tax}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Бюджетные показатели</h4>
                  <div className="space-y-2 md:space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Выделенный бюджет:</span>
                      <span className="text-white font-medium">{formatCurrency(selectedBudget.allocated, selectedBudget.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Фактические расходы:</span>
                      <span className="text-white font-medium">{formatCurrency(selectedBudget.spent, selectedBudget.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Остаток:</span>
                      <span className={`font-medium ${
                        selectedBudget.remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {formatCurrency(selectedBudget.remaining, selectedBudget.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Использование:</span>
                      <span className="text-white font-medium">{selectedBudget.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Период:</span>
                      <span className="text-white">{selectedBudget.period}</span>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="p-4 md:p-6" glowColor={
                  selectedBudget.status === 'on_track' ? FINANCE_COLORS.income :
                  selectedBudget.status === 'over_budget' ? FINANCE_COLORS.expense : 
                  selectedBudget.status === 'under_budget' ? FINANCE_COLORS.savings : FINANCE_COLORS.debt
                }>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Статус бюджета</h4>
                  <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <StatusBadge status={selectedBudget.status} animated />
                    </div>
                    <ProgressBar 
                      value={selectedBudget.progress} 
                      color={
                        selectedBudget.status === 'on_track' ? FINANCE_COLORS.income :
                        selectedBudget.status === 'over_budget' ? FINANCE_COLORS.expense : 
                        selectedBudget.status === 'under_budget' ? FINANCE_COLORS.savings : FINANCE_COLORS.debt
                      }
                      label="Прогресс использования бюджета"
                      showValue
                      size="lg"
                    />
                    <div className="text-center text-slate-400 text-sm mt-4">
                      {selectedBudget.status === 'on_track' && 'Бюджет используется в рамках плана'}
                      {selectedBudget.status === 'over_budget' && 'Превышение бюджета! Требуется корректировка'}
                      {selectedBudget.status === 'under_budget' && 'Бюджет используется экономно'}
                      {selectedBudget.status === 'at_risk' && 'Бюджет находится под угрозой превышения'}
                    </div>
                  </div>
                </BentoCard>
              </div>

              {selectedBudget.alerts.length > 0 && (
                <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.amber}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Уведомления</h4>
                  <div className="space-y-2">
                    {selectedBudget.alerts.map((alert, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Уведомление при {alert.threshold}%</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          alert.enabled 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                        }`}>
                          {alert.enabled ? 'Включено' : 'Выключено'}
                        </span>
                      </div>
                    ))}
                  </div>
                </BentoCard>
              )}

              <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.investment}>
                <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Рекомендации</h4>
                <div className="space-y-3 text-sm text-slate-300">
                  {selectedBudget.status === 'over_budget' && (
                    <>
                      <p>• Рекомендуется пересмотреть расходы по категории {selectedBudget.category}</p>
                      <p>• Рассмотреть возможность оптимизации процессов</p>
                      <p>• Запланировать встречу для обсуждения бюджета</p>
                      <p>• Проанализировать причины превышения бюджета</p>
                    </>
                  )}
                  {selectedBudget.status === 'on_track' && (
                    <>
                      <p>• Бюджет используется оптимально</p>
                      <p>• Продолжать текущую финансовую политику</p>
                      <p>• Рассмотреть возможность увеличения бюджета на следующий период</p>
                      <p>• Продолжать мониторинг расходов</p>
                    </>
                  )}
                  {selectedBudget.status === 'under_budget' && (
                    <>
                      <p>• Имеется резерв для дополнительных инвестиций</p>
                      <p>• Рассмотреть возможность перераспределения средств</p>
                      <p>• Возможно увеличение бюджета на стратегические инициативы</p>
                      <p>• Проанализировать эффективность использования бюджета</p>
                    </>
                  )}
                  {selectedBudget.status === 'at_risk' && (
                    <>
                      <p>• Внимательно отслеживать текущие расходы</p>
                      <p>• Рассмотреть возможность сокращения второстепенных затрат</p>
                      <p>• Подготовить план действий на случай превышения бюджета</p>
                      <p>• Усилить контроль над утверждением новых расходов</p>
                    </>
                  )}
                </div>
              </BentoCard>
            </div>
          )}
        </Modal>

        <Modal 
          isOpen={!!selectedGoal} 
          onClose={() => setSelectedGoal(null)}
          title={`Цель: ${selectedGoal?.title}`}
          size={isMobile ? "md" : "lg"}
        >
          {selectedGoal && (
            <div className="space-y-4 md:space-y-6">
              <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'}`}>
                <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.savings}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Основная информация</h4>
                  <div className="space-y-2 md:space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Название цели:</span>
                      <span className="text-white text-right">{selectedGoal.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Категория:</span>
                      <span className="text-white">{selectedGoal.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Приоритет:</span>
                      <StatusBadge status={selectedGoal.priority} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Статус:</span>
                      <StatusBadge status={selectedGoal.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Дедлайн:</span>
                      <span className="text-white">{formatDate(selectedGoal.deadline)}</span>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.investment}>
                  <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Финансовые показатели</h4>
                  <div className="space-y-2 md:space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Целевая сумма:</span>
                      <span className="text-white font-medium">{formatCurrency(selectedGoal.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Текущая сумма:</span>
                      <span className="text-emerald-400 font-medium">{formatCurrency(selectedGoal.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Осталось собрать:</span>
                      <span className="text-cyan-400 font-medium">{formatCurrency(selectedGoal.targetAmount - selectedGoal.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Прогресс:</span>
                      <span className="text-white font-medium">{selectedGoal.progress}%</span>
                    </div>
                  </div>
                </BentoCard>
              </div>

              <BentoCard className="p-4 md:p-6" glowColor={getGoalColor(selectedGoal.priority)}>
                <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Прогресс цели</h4>
                <div className="space-y-4">
                  <ProgressBar 
                    value={selectedGoal.progress} 
                    color={getGoalColor(selectedGoal.priority)}
                    label={`Достигнуто ${selectedGoal.progress}% от цели`}
                    showValue
                    size="lg"
                  />
                  
                  <div className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'gap-4'} text-sm`}>
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <div className="text-slate-400">Дней до дедлайна</div>
                      <div className="text-white font-medium">
                        {Math.ceil((new Date(selectedGoal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <div className="text-slate-400">Ежемесячно нужно</div>
                      <div className="text-emerald-400 font-medium">
                        {formatCurrency((selectedGoal.targetAmount - selectedGoal.currentAmount) / 
                         (Math.ceil((new Date(selectedGoal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))))}
                      </div>
                    </div>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-4 md:p-6" glowColor={FINANCE_COLORS.info}>
                <h4 className="text-lg font-semibold text-white mb-3 md:mb-4">Рекомендации</h4>
                <div className="space-y-3 text-sm text-slate-300">
                  {selectedGoal.progress < 50 && (
                    <>
                      <p>• Рекомендуется увеличить ежемесячные взносы для достижения цели в срок</p>
                      <p>• Рассмотреть возможность дополнительных источников дохода</p>
                      <p>• Пересмотреть приоритеты расходов для выделения большего бюджета на цель</p>
                    </>
                  )}
                  {selectedGoal.progress >= 50 && selectedGoal.progress < 80 && (
                    <>
                      <p>• Хороший прогресс! Продолжайте в том же темпе</p>
                      <p>• Рассмотрите возможность небольшого увеличения взносов для досрочного достижения цели</p>
                      <p>• Продолжайте отслеживать прогресс и корректировать стратегию при необходимости</p>
                    </>
                  )}
                  {selectedGoal.progress >= 80 && (
                    <>
                      <p>• Отличный прогресс! Цель почти достигнута</p>
                      <p>• Подумайте о следующей финансовой цели</p>
                      <p>• Рассмотрите возможность инвестирования накопленных средств</p>
                    </>
                  )}
                </div>
              </BentoCard>
            </div>
          )}
        </Modal>

        {/* Кастомные стили для скроллбара */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          
          /* Улучшенная анимация shine для мобильных */
          @keyframes shine {
            0% {
              transform: translateX(-100%) skewX(-12deg);
            }
            100% {
              transform: translateX(200%) skewX(-12deg);
            }
          }
          
          .animate-shine {
            animation: shine 3s infinite;
          }

          /* Улучшения для touch devices */
          @media (max-width: 768px) {
            .animate-shine {
              animation: shine 4s infinite;
            }
            
            /* Улучшение читаемости текста на мобильных */
            .text-shadow-mobile {
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            }
          }

          /* Предотвращение zoom на input focus на iOS */
          @media screen and (max-width: 768px) {
            input, select, textarea {
              font-size: 16px !important;
            }
          }
        `}</style>
      </div>
    </ThemeProvider>
  );
};

export default FinanceReportsDashboard;