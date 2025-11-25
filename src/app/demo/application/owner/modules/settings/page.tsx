'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Константы цветовой схемы
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
  slate: '100, 116, 139'
} as const;

// Хук для блокировки прокрутки тела страницы
const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (locked) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = originalStyle;
    };
  }, [locked]);
};

// Интерфейсы для компонентов
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
  delay?: number;
  fullHeight?: boolean;
}

// Базовый компонент карточки
const BentoCard = React.memo(({ 
  children, 
  className = '', 
  glowColor = COLORS.teal, 
  onClick,
  hoverable = true,
  padding = 'p-4 sm:p-6 lg:p-8',
  delay = 0,
  fullHeight = false
}: BentoCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      duration: 0.6, 
      delay, 
      ease: [0.25, 0.46, 0.45, 0.94],
      scale: { type: "spring", stiffness: 300, damping: 25 }
    }}
    className={`
      relative overflow-hidden 
      rounded-2xl sm:rounded-3xl xl:rounded-4xl 
      border border-slate-700/50
      bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-slate-800/40 
      backdrop-blur-2xl
      shadow-2xl shadow-black/30
      transition-all duration-500 ease-out
      w-full max-w-full
      group
      ${hoverable ? 'hover:border-slate-500/60 hover:shadow-3xl hover:shadow-slate-500/10' : ''}
      ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
      ${padding}
      ${fullHeight ? 'h-full' : 'min-h-[200px]'}
      before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-white/5
      before:opacity-0 before:transition-opacity before:duration-500
      hover:before:opacity-100
      ${className}
    `}
    style={{
      backgroundImage: `
        radial-gradient(ellipse at 50% 0%, rgba(${glowColor},0.15) 0%, transparent 70%),
        radial-gradient(ellipse at 0% 50%, rgba(${glowColor},0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 100% 50%, rgba(${glowColor},0.1) 0%, transparent 50%),
        linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.08) 100%)
      `
    }}
    whileHover={hoverable ? { 
      y: -8, 
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
  >
    {/* Анимированное свечение */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style={{
        background: `
          radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), 
            rgba(${glowColor},0.12) 0%, 
            transparent 50%
          )
        `
      }}
    />
    
    {/* Контент */}
    <div className="relative z-10 h-full flex flex-col">
      {children}
    </div>

    {/* Блестящая анимация при hover */}
    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl xl:rounded-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden">
      <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 group-hover:animate-shine" />
    </div>

    {/* Угловые акценты */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-500/50 rounded-tl-lg" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-500/50 rounded-tr-lg" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-slate-500/50 rounded-bl-lg" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-slate-500/50 rounded-br-lg" />
  </motion.div>
));

BentoCard.displayName = 'BentoCard';

// Компонент переключателя
interface SwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const Switch = React.memo(({ 
  enabled, 
  onChange,
  size = 'md',
  label
}: SwitchProps) => {
  const sizes = {
    sm: 'w-12 h-6',
    md: 'w-16 h-8',
    lg: 'w-20 h-10'
  };

  const dotSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center space-x-3">
      {label && (
        <span className="text-sm font-medium text-slate-300">{label}</span>
      )}
      <motion.button
        type="button"
        className={`${sizes[size]} flex items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          enabled 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25' 
            : 'bg-slate-600 shadow-inner'
        }`}
        onClick={() => onChange(!enabled)}
        whileTap={{ scale: 0.95 }}
        aria-checked={enabled}
        role="switch"
      >
        <motion.div
          className={`${dotSizes[size]} bg-white rounded-full shadow-lg transform transition-all duration-300 ${
            enabled ? 'shadow-black/20' : 'shadow-black/10'
          }`}
          animate={{ 
            x: enabled ? (size === 'sm' ? 28 : size === 'md' ? 36 : 44) : 4,
            scale: enabled ? 1.1 : 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
        />
      </motion.button>
    </div>
  );
});

Switch.displayName = 'Switch';

// Компонент поля ввода
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

const Input = React.memo(({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error = '',
  disabled = false,
  required = false,
  icon = null,
  description = ''
}: InputProps) => {
  const inputId = React.useId();
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className="block text-sm font-semibold text-slate-200">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      
      {description && (
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
            isFocused ? 'text-blue-400' : 'text-slate-400'
          } ${error ? 'text-rose-400' : ''}`}>
            {icon}
          </div>
        )}
        
        <motion.input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 ${icon ? 'pl-11' : 'pl-4'} py-3.5 
            bg-slate-800/60 border-2 backdrop-blur-xl
            rounded-xl text-white placeholder-slate-400 
            focus:outline-none focus:ring-4 transition-all duration-300
            text-base leading-relaxed
            ${error 
              ? 'border-rose-500/50 focus:border-rose-400 focus:ring-rose-400/20' 
              : 'border-slate-600/50 focus:border-blue-400 focus:ring-blue-400/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-500/70'}
            shadow-lg shadow-black/20
          `}
          whileFocus={{ scale: 1.02 }}
        />
        
        {/* Анимация фокуса */}
        <motion.div 
          className={`absolute inset-0 rounded-xl pointer-events-none -z-10 ${
            error ? 'bg-rose-500/5' : 'bg-blue-500/5'
          }`}
          animate={{ opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-rose-400 text-sm flex items-center space-x-2"
        >
          <span>⚠</span>
          <span>{error}</span>
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Компонент выпадающего списка
interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

const Select = React.memo(({
  label,
  value,
  onChange,
  options,
  error = '',
  disabled = false,
  required = false,
  icon = null,
  description = ''
}: SelectProps) => {
  const selectId = React.useId();
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="space-y-3">
      <label htmlFor={selectId} className="block text-sm font-semibold text-slate-200">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      
      {description && (
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
            isFocused ? 'text-blue-400' : 'text-slate-400'
          } ${error ? 'text-rose-400' : ''}`}>
            {icon}
          </div>
        )}
        
        <motion.select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 ${icon ? 'pl-11' : 'pl-4'} py-3.5 
            bg-slate-800/60 border-2 backdrop-blur-xl
            rounded-xl text-white focus:outline-none focus:ring-4 
            transition-all duration-300 appearance-none
            text-base leading-relaxed cursor-pointer
            ${error 
              ? 'border-rose-500/50 focus:border-rose-400 focus:ring-rose-400/20' 
              : 'border-slate-600/50 focus:border-blue-400 focus:ring-blue-400/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-500/70'}
            shadow-lg shadow-black/20
          `}
          whileFocus={{ scale: 1.02 }}
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-slate-800 text-white py-2"
            >
              {option.label}
            </option>
          ))}
        </motion.select>
        
        {/* Кастомная стрелка */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <motion.svg 
            className={`w-5 h-5 transition-colors duration-200 ${
              isFocused ? 'text-blue-400' : 'text-slate-400'
            }`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            animate={{ rotate: isFocused ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
        
        {/* Анимация фокуса */}
        <motion.div 
          className={`absolute inset-0 rounded-xl pointer-events-none -z-10 ${
            error ? 'bg-rose-500/5' : 'bg-blue-500/5'
          }`}
          animate={{ opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-rose-400 text-sm flex items-center space-x-2"
        >
          <span>⚠</span>
          <span>{error}</span>
        </motion.p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Компонент модального окна
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const Modal = React.memo(({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  showCloseButton = true
}: ModalProps) => {
  useLockBodyScroll(isOpen);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 300,
                duration: 0.6
              }}
              className={`bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 
                rounded-2xl sm:rounded-3xl xl:rounded-4xl 
                border border-slate-700/50 
                shadow-3xl shadow-black/40
                w-full ${sizes[size]} 
                max-h-[95vh] overflow-hidden
                backdrop-blur-2xl
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-700/50 bg-slate-800/30">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent"
                >
                  {title}
                </motion.h2>
                
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center 
                      rounded-xl hover:bg-slate-700/50 
                      transition-all duration-300 
                      text-slate-400 hover:text-white 
                      text-xl font-light
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    "
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Закрыть"
                  >
                    ×
                  </motion.button>
                )}
              </div>
              
              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(95vh-80px)] custom-scrollbar">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
});

Modal.displayName = 'Modal';

// Типы данных
interface OrganizationSettings {
  id: string;
  name: string;
  legalName: string;
  taxId: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  currency: string;
  timezone: string;
  language: string;
  fiscalYearStart: string;
  industry: string;
  employees: string;
  founded: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  ipWhitelist: string[];
  loginNotifications: boolean;
  failedLoginAttempts: number;
  autoLogout: boolean;
  passwordComplexity: boolean;
}

interface NotificationSettings {
  email: {
    transactions: boolean;
    reports: boolean;
    security: boolean;
    marketing: boolean;
    system: boolean;
    weeklyDigest: boolean;
  };
  push: {
    transactions: boolean;
    reports: boolean;
    security: boolean;
    reminders: boolean;
  };
  sms: {
    security: boolean;
    important: boolean;
    twoFactor: boolean;
  };
  inApp: {
    announcements: boolean;
    updates: boolean;
    tips: boolean;
  };
}

interface IntegrationSettings {
  accounting: {
    quickbooks: boolean;
    xero: boolean;
    freshbooks: boolean;
    wave: boolean;
  };
  payment: {
    stripe: boolean;
    paypal: boolean;
    bank: boolean;
    wise: boolean;
    yookassa: boolean;
  };
  analytics: {
    google: boolean;
    custom: boolean;
    metrika: boolean;
    amplitude: boolean;
  };
  communication: {
    slack: boolean;
    telegram: boolean;
    discord: boolean;
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  lastLogin: string;
  joinedDate: string;
  department: string;
  phone: string;
  location: string;
  timezone: string;
}

// Моки данных
const organizationSettings: OrganizationSettings = {
  id: 'org-001',
  name: 'ТехноИнновации ООО',
  legalName: 'Общество с ограниченной ответственностью "ТехноИнновации"',
  taxId: '7712345678',
  website: 'https://techinnovations.ru',
  phone: '+7 (495) 123-45-67',
  email: 'info@techinnovations.ru',
  address: 'ул. Тверская, д. 25',
  city: 'Москва',
  country: 'Россия',
  postalCode: '125009',
  currency: 'RUB',
  timezone: 'Europe/Moscow',
  language: 'ru',
  fiscalYearStart: '2024-01-01',
  industry: 'IT и технологии',
  employees: '50-100',
  founded: '2020'
};

const securitySettings: SecuritySettings = {
  twoFactorAuth: true,
  sessionTimeout: 30,
  passwordExpiry: 90,
  ipWhitelist: ['192.168.1.1', '10.0.0.1', '172.16.0.1'],
  loginNotifications: true,
  failedLoginAttempts: 5,
  autoLogout: true,
  passwordComplexity: true
};

const notificationSettings: NotificationSettings = {
  email: {
    transactions: true,
    reports: true,
    security: true,
    marketing: false,
    system: true,
    weeklyDigest: true
  },
  push: {
    transactions: true,
    reports: false,
    security: true,
    reminders: true
  },
  sms: {
    security: true,
    important: true,
    twoFactor: true
  },
  inApp: {
    announcements: true,
    updates: true,
    tips: false
  }
};

const integrationSettings: IntegrationSettings = {
  accounting: {
    quickbooks: true,
    xero: false,
    freshbooks: false,
    wave: true
  },
  payment: {
    stripe: true,
    paypal: false,
    bank: true,
    wise: false,
    yookassa: true
  },
  analytics: {
    google: true,
    custom: false,
    metrika: true,
    amplitude: false
  },
  communication: {
    slack: true,
    telegram: false,
    discord: false
  }
};

const userProfile: UserProfile = {
  id: 'user-001',
  name: 'Александр Петров',
  email: 'a.petrov@techinnovations.ru',
  role: 'Владелец',
  avatar: '',
  lastLogin: '2024-06-25T14:30:00Z',
  joinedDate: '2023-01-15T00:00:00Z',
  department: 'Руководство',
  phone: '+7 (925) 123-45-67',
  location: 'Москва, Россия',
  timezone: 'Europe/Moscow'
};

// Компонент секции организации
const OrganizationSection = React.memo(({ 
  settings, 
  onUpdate 
}: { 
  settings: OrganizationSettings; 
  onUpdate: (settings: OrganizationSettings) => void;
}) => {
  const [formData, setFormData] = useState(settings);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleChange = useCallback((field: keyof OrganizationSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    onUpdate(formData);
    setIsSaveModalOpen(true);
  }, [formData, onUpdate]);

  const countries = useMemo(() => [
    { value: 'Россия', label: '🇷🇺 Россия' },
    { value: 'Казахстан', label: '🇰🇿 Казахстан' },
    { value: 'Беларусь', label: '🇧🇾 Беларусь' },
    { value: 'Украина', label: '🇺🇦 Украина' },
    { value: 'США', label: '🇺🇸 США' },
    { value: 'Германия', label: '🇩🇪 Германия' }
  ], []);

  const currencies = useMemo(() => [
    { value: 'RUB', label: '₽ Российский рубль (RUB)' },
    { value: 'USD', label: '$ Доллар США (USD)' },
    { value: 'EUR', label: '€ Евро (EUR)' },
    { value: 'KZT', label: '₸ Казахстанский тенге (KZT)' },
    { value: 'GBP', label: '£ Фунт стерлингов (GBP)' }
  ], []);

  const timezones = useMemo(() => [
    { value: 'Europe/Moscow', label: 'Москва (UTC+3)' },
    { value: 'Asia/Almaty', label: 'Алматы (UTC+6)' },
    { value: 'Europe/Minsk', label: 'Минск (UTC+3)' },
    { value: 'Europe/Kyiv', label: 'Киев (UTC+3)' },
    { value: 'America/New_York', label: 'Нью-Йорк (UTC-5)' },
    { value: 'Europe/London', label: 'Лондон (UTC+0)' }
  ], []);

  const industries = useMemo(() => [
    { value: 'IT и технологии', label: '💻 IT и технологии' },
    { value: 'Финансы', label: '💰 Финансы' },
    { value: 'Розничная торговля', label: '🛍️ Розничная торговля' },
    { value: 'Производство', label: '🏭 Производство' },
    { value: 'Здравоохранение', label: '🏥 Здравоохранение' },
    { value: 'Образование', label: '🎓 Образование' }
  ], []);

  const employeeRanges = useMemo(() => [
    { value: '1-10', label: '👤 1-10 сотрудников' },
    { value: '11-50', label: '👥 11-50 сотрудников' },
    { value: '51-200', label: '👨‍👩‍👧‍👦 51-200 сотрудников' },
    { value: '201-500', label: '🏢 201-500 сотрудников' },
    { value: '500+', label: '🏛️ 500+ сотрудников' }
  ], []);

  return (
    <>
      <BentoCard className="p-4 sm:p-6 lg:p-8" glowColor={COLORS.blue} delay={0.1}>
        {/* Заголовок секции */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div className="flex-1">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2"
            >
              🏢 Информация об организации
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-base sm:text-lg"
            >
              Основные данные и реквизиты вашей компании
            </motion.p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={() => setFormData(settings)}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 
                rounded-xl text-slate-200 font-medium 
                transition-all duration-300 
                border border-slate-600/50 hover:border-slate-500/50
                flex items-center space-x-2 text-sm sm:text-base
                backdrop-blur-xl
              "
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🔄</span>
              <span>Сбросить</span>
            </motion.button>
            <motion.button
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 
                hover:from-blue-600 hover:to-cyan-600 
                rounded-xl text-white font-semibold 
                transition-all duration-300 
                shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
                flex items-center space-x-2 text-sm sm:text-base
                backdrop-blur-xl
              "
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>💾</span>
              <span>Сохранить изменения</span>
            </motion.button>
          </div>
        </div>

        {/* Форма */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            label="Название организации"
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            placeholder="Введите название организации"
            required
            description="Официальное название вашей компании"
          />
          
          <Input
            label="Юридическое название"
            value={formData.legalName}
            onChange={(value) => handleChange('legalName', value)}
            placeholder="Полное юридическое название"
            required
            description="Полное наименование как в учредительных документах"
          />
          
          <Input
            label="ИНН"
            value={formData.taxId}
            onChange={(value) => handleChange('taxId', value)}
            placeholder="Введите ИНН организации"
            required
            description="Идентификационный номер налогоплательщика"
          />
          
          <Input
            label="Веб-сайт"
            value={formData.website}
            onChange={(value) => handleChange('website', value)}
            placeholder="https://example.com"
            type="url"
            description="Официальный сайт компании"
          />
          
          <Input
            label="Телефон"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            placeholder="+7 (XXX) XXX-XX-XX"
            type="tel"
            description="Контактный телефон для связи"
          />
          
          <Input
            label="Email"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            placeholder="email@example.com"
            type="email"
            required
            description="Официальный email адрес"
          />
          
          <Input
            label="Адрес"
            value={formData.address}
            onChange={(value) => handleChange('address', value)}
            placeholder="Введите адрес"
            required
            description="Юридический адрес компании"
          />
          
          <Input
            label="Город"
            value={formData.city}
            onChange={(value) => handleChange('city', value)}
            placeholder="Введите город"
            required
          />
          
          <Select
            label="Страна"
            value={formData.country}
            onChange={(value) => handleChange('country', value)}
            options={countries}
            required
            description="Страна регистрации компании"
          />
          
          <Input
            label="Почтовый индекс"
            value={formData.postalCode}
            onChange={(value) => handleChange('postalCode', value)}
            placeholder="Введите индекс"
          />
          
          <Select
            label="Валюта"
            value={formData.currency}
            onChange={(value) => handleChange('currency', value)}
            options={currencies}
            required
            description="Основная валюта для операций"
          />
          
          <Select
            label="Часовой пояс"
            value={formData.timezone}
            onChange={(value) => handleChange('timezone', value)}
            options={timezones}
            required
            description="Часовой пояс для отображения времени"
          />

          <Select
            label="Отрасль"
            value={formData.industry}
            onChange={(value) => handleChange('industry', value)}
            options={industries}
            required
            description="Основной вид деятельности компании"
          />

          <Select
            label="Количество сотрудников"
            value={formData.employees}
            onChange={(value) => handleChange('employees', value)}
            options={employeeRanges}
            required
            description="Приблизительная численность персонала"
          />

          <Input
            label="Год основания"
            value={formData.founded}
            onChange={(value) => handleChange('founded', value)}
            placeholder="2020"
            type="number"
            description="Год основания компании"
          />
        </motion.div>
      </BentoCard>

      {/* Модальное окно успешного сохранения */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="✅ Изменения сохранены"
        size="sm"
      >
        <div className="p-6 sm:p-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25"
          >
            <span className="text-2xl text-white">✓</span>
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-center text-white mb-4"
          >
            Настройки сохранены!
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-300 text-center text-base leading-relaxed mb-8"
          >
            Все изменения в настройках организации были успешно применены и сохранены в системе.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={() => setIsSaveModalOpen(false)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 
                hover:from-blue-600 hover:to-cyan-600 
                rounded-xl text-white font-semibold 
                transition-all duration-300 
                shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
                flex items-center space-x-2
              "
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Понятно</span>
            </motion.button>
          </motion.div>
        </div>
      </Modal>
    </>
  );
});

OrganizationSection.displayName = 'OrganizationSection';

// Компонент секции безопасности
const SecuritySection = React.memo(({ 
  settings, 
  onUpdate 
}: { 
  settings: SecuritySettings; 
  onUpdate: (settings: SecuritySettings) => void;
}) => {
  const [formData, setFormData] = useState(settings);
  const [newIp, setNewIp] = useState('');
  const [isIpModalOpen, setIsIpModalOpen] = useState(false);

  const handleToggle = useCallback((field: keyof SecuritySettings, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleNumberChange = useCallback((field: keyof SecuritySettings, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  }, []);

  const handleAddIp = useCallback(() => {
    if (newIp && !formData.ipWhitelist.includes(newIp)) {
      setFormData(prev => ({
        ...prev,
        ipWhitelist: [...prev.ipWhitelist, newIp]
      }));
      setNewIp('');
    }
  }, [newIp, formData.ipWhitelist]);

  const handleRemoveIp = useCallback((ip: string) => {
    setFormData(prev => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter(item => item !== ip)
    }));
  }, []);

  const handleSave = useCallback(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const securityFeatures = useMemo(() => [
    {
      key: 'twoFactorAuth' as const,
      title: 'Двухфакторная аутентификация',
      description: 'Повышенная безопасность входа',
      icon: '🔐'
    },
    {
      key: 'loginNotifications' as const,
      title: 'Уведомления о входе',
      description: 'Получать уведомления о новых входах',
      icon: '📱'
    },
    {
      key: 'autoLogout' as const,
      title: 'Автоматический выход',
      description: 'Выход при неактивности',
      icon: '⏱️'
    },
    {
      key: 'passwordComplexity' as const,
      title: 'Сложные пароли',
      description: 'Требовать сложные пароли',
      icon: '🎯'
    }
  ], []);

  return (
    <>
      <BentoCard className="p-4 sm:p-6 lg:p-8" glowColor={COLORS.emerald} delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div className="flex-1">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2"
            >
              🔒 Безопасность
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-base sm:text-lg"
            >
              Настройки безопасности и контроля доступа
            </motion.p>
          </div>
          <motion.button
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 
              hover:from-emerald-600 hover:to-teal-600 
              rounded-xl text-white font-semibold 
              transition-all duration-300 
              shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40
              flex items-center space-x-2 text-sm sm:text-base
              backdrop-blur-xl
            "
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🛡️</span>
            <span>Сохранить настройки</span>
          </motion.button>
        </div>

        <div className="space-y-6">
          {/* Основные настройки безопасности */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.key}
                className="flex items-center justify-between p-4 sm:p-6 rounded-xl bg-white/5 border border-slate-600/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <span className="text-xl sm:text-2xl">{feature.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold text-sm sm:text-base">{feature.title}</h4>
                    <p className="text-slate-400 text-xs sm:text-sm">{feature.description}</p>
                  </div>
                </div>
                <Switch
                  enabled={formData[feature.key]}
                  onChange={(value) => handleToggle(feature.key, value)}
                />
              </motion.div>
            ))}
          </div>

          {/* Таймауты и ограничения */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Таймаут сессии (минуты)
              </label>
              <input
                type="number"
                value={formData.sessionTimeout}
                onChange={(e) => handleNumberChange('sessionTimeout', e.target.value)}
                min="5"
                max="240"
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Срок действия пароля (дни)
              </label>
              <input
                type="number"
                value={formData.passwordExpiry}
                onChange={(e) => handleNumberChange('passwordExpiry', e.target.value)}
                min="30"
                max="365"
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Попытки входа
              </label>
              <input
                type="number"
                value={formData.failedLoginAttempts}
                onChange={(e) => handleNumberChange('failedLoginAttempts', e.target.value)}
                min="3"
                max="10"
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl"
              />
            </div>

            <div className="flex items-end">
              <motion.button
                onClick={() => setIsIpModalOpen(true)}
                className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 
                  border border-slate-600/50 hover:border-slate-500/50
                  rounded-xl text-white transition-all duration-300 
                  flex items-center justify-center space-x-2 text-sm sm:text-base
                  backdrop-blur-xl
                "
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>🌐</span>
                <span>Управление IP</span>
              </motion.button>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Модальное окно управления IP */}
      <Modal
        isOpen={isIpModalOpen}
        onClose={() => setIsIpModalOpen(false)}
        title="Управление белым списком IP-адресов"
        size="md"
      >
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="Введите IP-адрес (например: 192.168.1.1)"
              className="flex-1 px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-xl"
            />
            <motion.button
              onClick={handleAddIp}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>+</span>
              <span>Добавить</span>
            </motion.button>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm sm:text-base">
              Доступные IP-адреса ({formData.ipWhitelist.length})
            </h4>
            <div className="grid gap-2 max-h-48 sm:max-h-60 overflow-y-auto">
              {formData.ipWhitelist.map((ip, index) => (
                <motion.div
                  key={ip}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-slate-400">🌐</span>
                    <span className="text-slate-300 font-mono text-xs sm:text-sm">{ip}</span>
                  </div>
                  <motion.button
                    onClick={() => handleRemoveIp(ip)}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors text-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-slate-700/50">
            <motion.button
              onClick={() => setIsIpModalOpen(false)}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-all duration-300 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Отмена
            </motion.button>
            <motion.button
              onClick={() => {
                handleSave();
                setIsIpModalOpen(false);
              }}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-medium transition-all duration-300 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Сохранить
            </motion.button>
          </div>
        </div>
      </Modal>
    </>
  );
});

SecuritySection.displayName = 'SecuritySection';

// Компонент секции уведомлений
const NotificationsSection = React.memo(({ 
  settings, 
  onUpdate 
}: { 
  settings: NotificationSettings; 
  onUpdate: (settings: NotificationSettings) => void;
}) => {
  const [formData, setFormData] = useState(settings);
  const [activeCategory, setActiveCategory] = useState<'email' | 'push' | 'sms' | 'inApp'>('email');

  const handleToggle = useCallback((category: keyof NotificationSettings, field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  }, []);

  const handleSave = useCallback(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const notificationCategories = [
    { id: 'email', label: 'Email', icon: '📧', color: 'from-blue-500 to-cyan-500' },
    { id: 'push', label: 'Push', icon: '📱', color: 'from-purple-500 to-pink-500' },
    { id: 'sms', label: 'SMS', icon: '💬', color: 'from-green-500 to-emerald-500' },
    { id: 'inApp', label: 'In-App', icon: '🔔', color: 'from-orange-500 to-amber-500' }
  ] as const;

  const notificationConfig = {
    email: {
      transactions: { label: 'Финансовые операции', description: 'Уведомления о доходах и расходах' },
      reports: { label: 'Отчеты', description: 'Еженедельные и месячные отчеты' },
      security: { label: 'Безопасность', description: 'Уведомления о безопасности' },
      marketing: { label: 'Маркетинг', description: 'Новости и обновления' },
      system: { label: 'Системные', description: 'Уведомления о работе системы' },
      weeklyDigest: { label: 'Еженедельный дайджест', description: 'Сводка за неделю' }
    },
    push: {
      transactions: { label: 'Финансовые операции', description: 'Мгновенные уведомления об операциях' },
      reports: { label: 'Отчеты', description: 'Уведомления о готовности отчетов' },
      security: { label: 'Безопасность', description: 'Срочные уведомления безопасности' },
      reminders: { label: 'Напоминания', description: 'Напоминания о важных событиях' }
    },
    sms: {
      security: { label: 'Безопасность', description: 'Критические уведомления безопасности' },
      important: { label: 'Важные события', description: 'Важные финансовые события' },
      twoFactor: { label: '2FA коды', description: 'Коды двухфакторной аутентификации' }
    },
    inApp: {
      announcements: { label: 'Анонсы', description: 'Новые функции и обновления' },
      updates: { label: 'Обновления', description: 'Обновления системы' },
      tips: { label: 'Советы', description: 'Полезные советы по использованию' }
    }
  };

  return (
    <BentoCard className="p-4 sm:p-6 lg:p-8" glowColor={COLORS.purple} delay={0.1}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div className="flex-1">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
          >
            🔔 Уведомления
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-base sm:text-lg"
          >
            Настройки уведомлений и оповещений
          </motion.p>
        </div>
        <motion.button
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
            hover:from-purple-600 hover:to-pink-600 
            rounded-xl text-white font-semibold 
            transition-all duration-300 
            shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
            flex items-center space-x-2 text-sm sm:text-base
            backdrop-blur-xl
          "
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>💾</span>
          <span>Сохранить настройки</span>
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Боковая навигация */}
        <div className="lg:w-64 space-y-2">
          {notificationCategories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all duration-300 backdrop-blur-xl ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-2xl`
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-slate-600/30'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">{category.icon}</span>
              <div>
                <span className="font-semibold block">{category.label}</span>
                <span className="text-xs opacity-80 hidden sm:block">
                  {Object.values(formData[category.id]).filter(Boolean).length} / {Object.values(formData[category.id]).length}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Контент категории */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-white font-bold text-lg sm:text-xl mb-6">
                {notificationCategories.find(c => c.id === activeCategory)?.label} Уведомления
              </h4>
              
              {Object.entries(formData[activeCategory]).map(([key, value]) => (
                <motion.div
                  key={key}
                  className="flex items-center justify-between p-4 sm:p-6 rounded-xl bg-white/5 border border-slate-600/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex-1">
                    <h5 className="text-white font-semibold text-sm sm:text-base">
                      {notificationConfig[activeCategory][key as keyof typeof notificationConfig[typeof activeCategory]]?.label}
                    </h5>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      {notificationConfig[activeCategory][key as keyof typeof notificationConfig[typeof activeCategory]]?.description}
                    </p>
                  </div>
                  <Switch
                    enabled={value}
                    onChange={(enabled) => handleToggle(activeCategory, key, enabled)}
                    size="md"
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </BentoCard>
  );
});

NotificationsSection.displayName = 'NotificationsSection';

// Компонент секции интеграций
const IntegrationsSection = React.memo(({ 
  settings, 
  onUpdate 
}: { 
  settings: IntegrationSettings; 
  onUpdate: (settings: IntegrationSettings) => void;
}) => {
  const [formData, setFormData] = useState(settings);
  const [activeIntegration, setActiveIntegration] = useState<'accounting' | 'payment' | 'analytics' | 'communication'>('accounting');

  const handleToggle = useCallback((category: keyof IntegrationSettings, field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  }, []);

  const handleSave = useCallback(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const integrationCategories = [
    { id: 'accounting', label: 'Бухгалтерия', icon: '📊', color: 'from-green-500 to-emerald-500' },
    { id: 'payment', label: 'Платежи', icon: '💳', color: 'from-blue-500 to-cyan-500' },
    { id: 'analytics', label: 'Аналитика', icon: '📈', color: 'from-orange-500 to-amber-500' },
    { id: 'communication', label: 'Коммуникации', icon: '💬', color: 'from-purple-500 to-pink-500' }
  ] as const;

  const integrationConfig = {
    accounting: {
      quickbooks: { name: 'QuickBooks', description: 'Интеграция с бухгалтерской системой', status: 'active' },
      xero: { name: 'Xero', description: 'Облачная бухгалтерия', status: 'available' },
      freshbooks: { name: 'FreshBooks', description: 'Управление счетами', status: 'available' },
      wave: { name: 'Wave', description: 'Бесплатная бухгалтерия', status: 'active' }
    },
    payment: {
      stripe: { name: 'Stripe', description: 'Платежная система', status: 'active' },
      paypal: { name: 'PayPal', description: 'Международные платежи', status: 'available' },
      bank: { name: 'Банковская интеграция', description: 'Прямое подключение к банку', status: 'active' },
      wise: { name: 'Wise', description: 'Международные переводы', status: 'available' },
      yookassa: { name: 'ЮKassa', description: 'Платежи для РФ', status: 'active' }
    },
    analytics: {
      google: { name: 'Google Analytics', description: 'Веб-аналитика', status: 'active' },
      custom: { name: 'Custom API', description: 'Собственная интеграция', status: 'available' },
      metrika: { name: 'Яндекс.Метрика', description: 'Российская аналитика', status: 'active' },
      amplitude: { name: 'Amplitude', description: 'Продуктовая аналитика', status: 'available' }
    },
    communication: {
      slack: { name: 'Slack', description: 'Корпоративный чат', status: 'active' },
      telegram: { name: 'Telegram', description: 'Мессенджер', status: 'available' },
      discord: { name: 'Discord', description: 'Комьюнити платформа', status: 'available' }
    }
  };

  return (
    <BentoCard className="p-4 sm:p-6 lg:p-8" glowColor={COLORS.orange} delay={0.1}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div className="flex-1">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2"
          >
            🔗 Интеграции
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-base sm:text-lg"
          >
            Подключенные сервисы и API
          </motion.p>
        </div>
        <motion.button
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 
            hover:from-orange-600 hover:to-amber-600 
            rounded-xl text-white font-semibold 
            transition-all duration-300 
            shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
            flex items-center space-x-2 text-sm sm:text-base
            backdrop-blur-xl
          "
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>🔄</span>
          <span>Синхронизировать все</span>
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Боковая навигация */}
        <div className="lg:w-64 space-y-2">
          {integrationCategories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveIntegration(category.id)}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all duration-300 backdrop-blur-xl ${
                activeIntegration === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-2xl`
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-slate-600/30'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">{category.icon}</span>
              <div>
                <span className="font-semibold block">{category.label}</span>
                <span className="text-xs opacity-80 hidden sm:block">
                  {Object.values(formData[category.id]).filter(Boolean).length} / {Object.values(formData[category.id]).length}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Список интеграций */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIntegration}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {Object.entries(formData[activeIntegration]).map(([key, value]) => {
                const config = integrationConfig[activeIntegration][key as keyof typeof integrationConfig[typeof activeIntegration]];
                return (
                  <motion.div
                    key={key}
                    className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 ${
                      value 
                        ? 'bg-white/5 border-slate-600/50 hover:border-slate-500/50' 
                        : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                    } backdrop-blur-xl`}
                    whileHover={{ y: -2, scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          value ? 'bg-emerald-400' : 'bg-slate-500'
                        }`} />
                        <div>
                          <h4 className="text-white font-semibold text-sm sm:text-base">{config.name}</h4>
                          <p className="text-slate-400 text-xs sm:text-sm">{config.description}</p>
                        </div>
                      </div>
                      <Switch
                        enabled={value}
                        onChange={(enabled) => handleToggle(activeIntegration, key, enabled)}
                        size="sm"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        config.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {config.status === 'active' ? 'Активно' : 'Доступно'}
                      </span>
                      <span className="text-slate-500">
                        {value ? 'Подключено' : 'Не подключено'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </BentoCard>
  );
});

IntegrationsSection.displayName = 'IntegrationsSection';

// Компонент секции профиля
const ProfileSection = React.memo(({ 
  profile 
}: { 
  profile: UserProfile;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    department: profile.department,
    location: profile.location,
    timezone: profile.timezone
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = [
    { label: 'Проектов', value: '24', change: '+3', icon: '📁' },
    { label: 'Задач', value: '127', change: '+12', icon: '✅' },
    { label: 'Активность', value: '98%', change: '+2%', icon: '📊' },
    { label: 'Рейтинг', value: '4.8', change: '+0.2', icon: '⭐' }
  ];

  return (
    <>
      <BentoCard className="p-4 sm:p-6 lg:p-8" glowColor={COLORS.cyan} delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div className="flex-1">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2"
            >
              👤 Профиль пользователя
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-base sm:text-lg"
            >
              Информация о вашем аккаунте и активности
            </motion.p>
          </div>
          <motion.button
            onClick={() => setIsEditModalOpen(true)}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 
              hover:from-cyan-600 hover:to-blue-600 
              rounded-xl text-white font-semibold 
              transition-all duration-300 
              shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40
              flex items-center space-x-2 text-sm sm:text-base
              backdrop-blur-xl
            "
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>✏️</span>
            <span>Редактировать профиль</span>
          </motion.button>
        </div>

        <div className="flex flex-col lg:flex-row items-start space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Аватар и основная информация */}
          <div className="flex-shrink-0">
            <motion.div 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-2xl shadow-cyan-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {profile.name.split(' ').map(n => n[0]).join('')}
            </motion.div>
            
            {/* Статистика */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/5 rounded-xl p-3 text-center border border-slate-600/30 backdrop-blur-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-white font-bold text-lg">{stat.value}</div>
                  <div className="text-slate-400 text-xs">{stat.label}</div>
                  <div className="text-emerald-400 text-xs">{stat.change}</div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Детальная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <div className="space-y-1">
              <label className="text-slate-400 text-sm font-medium">Полное имя</label>
              <p className="text-white font-semibold text-lg">{profile.name}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-slate-400 text-sm font-medium">Email</label>
              <p className="text-white font-medium">{profile.email}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-slate-400 text-sm font-medium">Роль</label>
              <p className="text-emerald-400 font-semibold">{profile.role}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-slate-400 text-sm font-medium">Отдел</label>
              <p className="text-white font-medium">{profile.department}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-slate-400 text-sm font-medium">Телефон</label>
              <p className="text-white font-medium">{profile.phone}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-slate-400 text-sm font-medium">Местоположение</label>
              <p className="text-white font-medium">{profile.location}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-slate-400 text-sm font-medium">Дата регистрации</label>
              <p className="text-white font-medium">{formatDate(profile.joinedDate)}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-slate-400 text-sm font-medium">Последний вход</label>
              <p className="text-white font-medium">{formatDate(profile.lastLogin)}</p>
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="text-slate-400 text-sm font-medium">ID пользователя</label>
              <p className="text-slate-300 font-mono text-sm bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                {profile.id}
              </p>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Модальное окно редактирования профиля */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Редактирование профиля"
        size="md"
      >
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Полное имя"
              value={editForm.name}
              onChange={(value) => setEditForm(prev => ({ ...prev, name: value }))}
              placeholder="Введите ваше имя"
              required
            />
            
            <Input
              label="Email"
              value={editForm.email}
              onChange={(value) => setEditForm(prev => ({ ...prev, email: value }))}
              placeholder="email@example.com"
              type="email"
              required
            />
            
            <Input
              label="Телефон"
              value={editForm.phone}
              onChange={(value) => setEditForm(prev => ({ ...prev, phone: value }))}
              placeholder="+7 (XXX) XXX-XX-XX"
              type="tel"
            />
            
            <Input
              label="Отдел"
              value={editForm.department}
              onChange={(value) => setEditForm(prev => ({ ...prev, department: value }))}
              placeholder="Ваш отдел"
            />
            
            <Input
              label="Местоположение"
              value={editForm.location}
              onChange={(value) => setEditForm(prev => ({ ...prev, location: value }))}
              placeholder="Город, страна"
            />
            
            <Select
              label="Часовой пояс"
              value={editForm.timezone}
              onChange={(value) => setEditForm(prev => ({ ...prev, timezone: value }))}
              options={[
                { value: 'Europe/Moscow', label: 'Москва (UTC+3)' },
                { value: 'Asia/Almaty', label: 'Алматы (UTC+6)' },
                { value: 'Europe/Minsk', label: 'Минск (UTC+3)' },
                { value: 'America/New_York', label: 'Нью-Йорк (UTC-5)' }
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-slate-700/50">
            <motion.button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-all duration-300 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Отмена
            </motion.button>
            <motion.button
              onClick={() => setIsEditModalOpen(false)}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-medium transition-all duration-300 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Сохранить изменения
            </motion.button>
          </div>
        </div>
      </Modal>
    </>
  );
});

ProfileSection.displayName = 'ProfileSection';

// Основной компонент дашборда
const OwnerSettingsDashboard = () => {
  const [activeSection, setActiveSection] = useState<'organization' | 'security' | 'notifications' | 'integrations' | 'profile'>('organization');
  const [orgSettings, setOrgSettings] = useState(organizationSettings);
  const [secSettings, setSecSettings] = useState(securitySettings);
  const [notifSettings, setNotifSettings] = useState(notificationSettings);
  const [integSettings, setIntegSettings] = useState(integrationSettings);

  const sections = useMemo(() => [
    { 
      id: 'organization', 
      label: 'Организация', 
      icon: '🏢', 
      description: 'Основные настройки компании',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'security', 
      label: 'Безопасность', 
      icon: '🔒', 
      description: 'Безопасность и доступ',
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      id: 'notifications', 
      label: 'Уведомления', 
      icon: '🔔', 
      description: 'Оповещения и уведомления',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'integrations', 
      label: 'Интеграции', 
      icon: '🔗', 
      description: 'Подключенные сервисы',
      color: 'from-orange-500 to-amber-500'
    },
  ], []);

  const handleSaveAll = useCallback(() => {
    // В реальном приложении здесь был бы API вызов
    console.log('Все настройки сохранены');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-4 sm:p-6 lg:p-8">
      {/* Хедер */}
      <motion.header 
        className="mb-8 sm:mb-12 lg:mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 gap-6">
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4 leading-tight"
            >
              Настройки <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                организации
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl text-slate-400 max-w-3xl leading-relaxed"
            >
              Полный контроль над настройками и конфигурацией вашей организации в одном месте
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <motion.button 
              onClick={handleSaveAll}
              className="px-6 sm:px-8 py-3 sm:py-4 
                bg-gradient-to-r from-emerald-500 to-teal-500 
                hover:from-emerald-600 hover:to-teal-600 
                rounded-xl sm:rounded-2xl text-white font-bold 
                transition-all duration-300 
                shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40
                flex items-center space-x-3 text-base sm:text-lg
                backdrop-blur-xl border border-emerald-400/20
              "
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">💾</span>
              <span>Сохранить все</span>
            </motion.button>
            
            <motion.button 
              className="px-6 sm:px-8 py-3 sm:py-4 
                bg-slate-800/50 hover:bg-slate-700/50 
                rounded-xl sm:rounded-2xl text-slate-200 font-semibold 
                transition-all duration-300 
                border border-slate-600/50 hover:border-slate-500/50
                flex items-center space-x-3 text-base sm:text-lg
                backdrop-blur-xl
              "
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">↻</span>
              <span>Сбросить все</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Навигация по секциям */}
        <motion.nav 
          className="flex overflow-x-auto py-4 space-x-2 
            bg-slate-800/30 backdrop-blur-2xl 
            rounded-2xl sm:rounded-3xl 
            border border-slate-700/50 
            shadow-2xl shadow-black/20
            px-4
            scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent
          "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex-shrink-0 flex items-center space-x-3 
                px-5 sm:px-6 py-3 sm:py-4 
                rounded-xl sm:rounded-2xl 
                text-sm sm:text-base font-semibold 
                transition-all duration-500 ease-out
                min-w-max
                backdrop-blur-xl
                ${
                  activeSection === section.id
                    ? `bg-gradient-to-r ${section.color} text-white shadow-2xl`
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg sm:text-xl">{section.icon}</span>
              <div className="text-left">
                <span className="block whitespace-nowrap">{section.label}</span>
                <span className="text-xs opacity-80 hidden sm:block whitespace-nowrap">
                  {section.description}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.nav>
      </motion.header>

      {/* Основной контент */}
      <main className="mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ 
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {activeSection === 'organization' && (
              <OrganizationSection 
                settings={orgSettings} 
                onUpdate={setOrgSettings} 
              />
            )}
            
            {activeSection === 'security' && (
              <SecuritySection 
                settings={secSettings} 
                onUpdate={setSecSettings} 
              />
            )}
            
            {activeSection === 'notifications' && (
              <NotificationsSection 
                settings={notifSettings} 
                onUpdate={setNotifSettings} 
              />
            )}
            
            {activeSection === 'integrations' && (
              <IntegrationsSection 
                settings={integSettings} 
                onUpdate={setIntegSettings} 
              />
            )}
            
            {activeSection === 'profile' && (
              <ProfileSection profile={userProfile} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OwnerSettingsDashboard;