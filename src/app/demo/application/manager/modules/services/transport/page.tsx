'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// Константы для цветов и настроек
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
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

const DEFAULT_PARTICLE_COUNT = 16;
const DEFAULT_SPOTLIGHT_RADIUS = 400;
const DEFAULT_GLOW_COLOR = '59, 130, 246';
const MOBILE_BREAKPOINT = 768;

// Типы
interface ManagerStats {
  assignedDrivers: number;
  completionRate: number;
  satisfaction: number;
  revenue: string;
  onTimeArrival: number;
  monthlyGrowth?: string;
  vehicleCondition?: number;
  fuelEfficiency?: number;
}

interface TransportService {
  id: number;
  name: string;
  category: string;
  icon: string;
  status: 'active' | 'development' | 'paused';
  price: string;
  tripsPerMonth: string;
  utilization: number;
  color: string;
  rating: number;
  reviews: number;
  tags: string[];
  description: string;
  features: string[];
  duration: string;
  specialist: string;
  requirements: string;
  managerStats: ManagerStats;
  coverage?: string[];
  maintenanceSchedule?: string;
  insurance?: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  trips: number;
  completion: number;
  rating: number;
  status: 'active' | 'vacation' | 'training' | 'sick';
  vehicle: string;
  experience: string;
  contact: string;
  lastTrip?: string;
  nextMaintenance?: string;
  performanceTrend: 'up' | 'down' | 'stable';
}

interface Task {
  id: number;
  title: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  assigned: string;
  progress: number;
  department: string;
  description?: string;
  dependencies?: string[];
}

interface Metric {
  category: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
  change?: string;
}

// Утилиты форматирования
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Хук для блокировки прокрутки
const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (locked) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = originalStyle;
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = originalStyle;
    };
  }, [locked]);
};

// Хук для определения мобильного устройства
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Вспомогательные функции
const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
};

// Компонент прогресс-бара
const ProgressBar = ({ 
  value, 
  max = 100, 
  color = '#3B82F6', 
  label = '',
  showLabel = true,
  height = '6px',
  showAnimation = true
}: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showLabel?: boolean;
  height?: string;
  showAnimation?: boolean;
}) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex justify-between text-white text-xs mb-1">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="w-full bg-white/10 rounded-full overflow-hidden" style={{ height }}>
        {showAnimation ? (
          <motion.div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: color,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: 0.1 }}
          />
        ) : (
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        )}
      </div>
    </div>
  );
};

// Компонент рейтинга
const RatingStars = ({ 
  rating, 
  size = 'sm', 
  showValue = true,
  showReviews = false,
  reviews = 0 
}: { 
  rating: number; 
  size?: 'sm' | 'md' | 'lg'; 
  showValue?: boolean;
  showReviews?: boolean;
  reviews?: number;
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`${
            size === 'sm' ? 'text-xs' : 
            size === 'md' ? 'text-sm' : 'text-base'
          } ${
            index < fullStars ? 'text-yellow-400' : 
            index === fullStars && hasHalfStar ? 'text-yellow-400' : 'text-gray-500'
          }`}
        >
          {index < fullStars ? '★' : 
           index === fullStars && hasHalfStar ? '★' : '☆'}
        </span>
      ))}
      <div className="flex items-center gap-1 ml-1">
        {showValue && (
          <span className={`text-white/60 ${
            size === 'sm' ? 'text-xs' : 
            size === 'md' ? 'text-sm' : 'text-sm'
          }`}>
            {rating.toFixed(1)}
          </span>
        )}
        {showReviews && reviews > 0 && (
          <>
            <span className="text-white/40 text-xs">•</span>
            <span className="text-white/60 text-xs">{reviews} отзывов</span>
          </>
        )}
      </div>
    </div>
  );
};

// Компонент статистической карточки
const StatCard = ({ 
  metric, 
  index,
  onClick 
}: { 
  metric: Metric; 
  index: number;
  onClick?: () => void;
}) => (
  <motion.div
    className="card--border-glow relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 text-center group cursor-pointer"
    style={{ '--glow-color': metric.color } as React.CSSProperties}
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: 0.1 * index + 0.3 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    onClick={onClick}
  >
    <div className="text-lg mb-2">{metric.icon}</div>
    <div className="text-white font-bold text-lg mb-1">{metric.value}</div>
    <div className="text-white/60 text-sm mb-1">{metric.category}</div>
    <div className="flex items-center justify-center gap-1">
      <div className={`text-xs ${
        metric.trend === 'up' ? 'text-green-400' : 
        metric.trend === 'down' ? 'text-red-400' : 'text-blue-400'
      }`}>
        {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
      </div>
      <div className={`text-xs ${
        metric.trend === 'up' ? 'text-green-400' : 
        metric.trend === 'down' ? 'text-red-400' : 'text-blue-400'
      }`}>
        {metric.change || (metric.trend === 'up' ? 'Рост' : metric.trend === 'down' ? 'Снижение' : 'Стабильно')}
      </div>
    </div>
  </motion.div>
);

// Компонент карточки услуги
const ServiceCard = ({ 
  service, 
  index, 
  onServiceClick 
}: { 
  service: TransportService; 
  index: number; 
  onServiceClick?: (service: TransportService) => void;
}) => {
  return (
    <motion.div 
      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer backdrop-blur-sm h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      onClick={() => onServiceClick?.(service)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-2xl flex-shrink-0">
            {service.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors truncate">
              {service.name}
            </div>
            <div className="text-white/60 text-xs truncate">{service.category}</div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs border backdrop-blur-sm flex-shrink-0 ${
          service.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
          service.status === 'development' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
          'bg-blue-500/20 text-blue-400 border-blue-500/30'
        }`}>
          {service.status === 'active' ? 'Активна' : service.status === 'development' ? 'В разработке' : 'Приостановлена'}
        </div>
      </div>
      
      <div className="space-y-2 mb-3 flex-1">
        <div className="flex justify-between text-white text-xs">
          <span>Стоимость</span>
          <span className="font-semibold">{service.price}</span>
        </div>
        <div className="flex justify-between text-white text-xs">
          <span>Поездок в месяц</span>
          <span>{service.tripsPerMonth}</span>
        </div>
        <ProgressBar 
          value={service.utilization} 
          label="Загрузка услуги" 
          color={service.color} 
          height="4px"
        />
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold">{service.managerStats.onTimeArrival}%</div>
            <div className="text-white/60">Вовремя</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold">{service.managerStats.satisfaction}%</div>
            <div className="text-white/60">Удовлетворенность</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <RatingStars 
          rating={service.rating} 
          size="sm" 
          showValue={true}
          showReviews={false}
        />
        <span className="text-white/60 text-xs">{service.managerStats.assignedDrivers} водителей</span>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {service.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
          <span 
            key={tagIndex}
            className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/80 truncate flex-1 min-w-0 text-center"
          >
            {tag}
          </span>
        ))}
        {service.tags.length > 2 && (
          <span className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/60 flex-1 min-w-0 text-center">
            +{service.tags.length - 2}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Компонент карточки члена команды
const TeamMemberCard = ({ 
  member, 
  index 
}: { 
  member: TeamMember; 
  index: number;
}) => (
  <motion.div
    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group h-full flex flex-col"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -2 }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-sm mb-1 truncate">{member.name}</div>
        <div className="text-white/60 text-xs mb-2">{member.role}</div>
        <div className="text-blue-400 text-xs truncate">{member.vehicle}</div>
      </div>
      <div className={`px-2 py-1 rounded-full text-xs border backdrop-blur-sm flex-shrink-0 ${
        member.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
        member.status === 'vacation' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
        member.status === 'training' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
        'bg-red-500/20 text-red-400 border-red-500/30'
      }`}>
        {member.status === 'active' ? 'Активен' : 
         member.status === 'vacation' ? 'Отпуск' : 
         member.status === 'training' ? 'Обучение' : 'Больничный'}
      </div>
    </div>
    
    <div className="space-y-2 mb-3 flex-1">
      <div className="flex justify-between text-white text-xs">
        <span>Поездки</span>
        <span className="font-semibold">{member.trips}</span>
      </div>
      <ProgressBar value={member.completion} label="Выполнение" color="#10B981" height="4px" />
      
      <div className="flex justify-between items-center">
        <RatingStars rating={member.rating} size="sm" showValue={false} />
        <div className="flex items-center gap-1">
          <span className={`text-xs ${
            member.performanceTrend === 'up' ? 'text-green-400' : 
            member.performanceTrend === 'down' ? 'text-red-400' : 'text-blue-400'
          }`}>
            {member.performanceTrend === 'up' ? '↗' : member.performanceTrend === 'down' ? '↘' : '→'}
          </span>
          <span className="text-white/60 text-xs">Тренд</span>
        </div>
      </div>
    </div>
    
    <div className="text-white/60 text-xs space-y-1">
      <div className="flex justify-between">
        <span>Опыт:</span>
        <span>{member.experience}</span>
      </div>
      {member.lastTrip && (
        <div className="flex justify-between">
          <span>Последняя поездка:</span>
          <span>{formatDate(member.lastTrip)}</span>
        </div>
      )}
    </div>
  </motion.div>
);

// Компонент карточки задачи
const TaskCard = ({ 
  task, 
  index 
}: { 
  task: Task; 
  index: number;
}) => (
  <motion.div
    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ x: 4 }}
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${
          task.priority === 'high' ? 'bg-red-400' : 
          task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
        }`} />
        <div className="text-white font-medium text-sm group-hover:text-green-300 transition-colors truncate">
          {task.title}
        </div>
      </div>
      <div className="text-white/60 text-xs truncate">
        {task.assigned} • {task.department} • До {formatDate(task.deadline)}
      </div>
      {task.description && (
        <div className="text-white/70 text-xs mt-1 line-clamp-2">
          {task.description}
        </div>
      )}
      <ProgressBar value={task.progress} showLabel={false} height="4px" showAnimation={false} />
    </div>
    <div className="text-right ml-3 flex-shrink-0">
      <div className="text-white font-bold text-sm">{task.progress}%</div>
      <div className="text-white/60 text-xs">Выполнено</div>
    </div>
  </motion.div>
);

// Модальное окно услуги
const ServiceModal = ({ 
  service, 
  isOpen, 
  onClose 
}: { 
  service: TransportService | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  useLockBodyScroll(isOpen);

  if (!isOpen || !service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              '--glow-color': service.color.replace('#', ''),
            } as React.CSSProperties}
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{service.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{service.name}</h2>
                    <p className="text-white/60 text-sm">{service.category}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Левая колонка - Основная информация */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">📊 Ключевые показатели</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/5 rounded-xl">
                        <div className="text-2xl font-bold text-white mb-1">{service.managerStats.revenue}</div>
                        <div className="text-white/60 text-sm">Доход в месяц</div>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-xl">
                        <div className="text-2xl font-bold text-white mb-1">{service.managerStats.assignedDrivers}</div>
                        <div className="text-white/60 text-sm">Водителей</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">📈 Эффективность</h3>
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between text-white text-sm mb-2">
                          <span>Прибытие вовремя</span>
                          <span className="font-semibold">{service.managerStats.onTimeArrival}%</span>
                        </div>
                        <ProgressBar value={service.managerStats.onTimeArrival} color="#10B981" height="6px" />
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between text-white text-sm mb-2">
                          <span>Удовлетворенность клиентов</span>
                          <span className="font-semibold">{service.managerStats.satisfaction}%</span>
                        </div>
                        <ProgressBar value={service.managerStats.satisfaction} color="#3B82F6" height="6px" />
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between text-white text-sm mb-2">
                          <span>Загрузка услуги</span>
                          <span className="font-semibold">{service.utilization}%</span>
                        </div>
                        <ProgressBar value={service.utilization} color={service.color} height="6px" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">⭐ Рейтинг и отзывы</h3>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <RatingStars rating={service.rating} size="md" showValue={true} />
                        <span className="text-white/60 text-sm">{service.reviews} отзывов</span>
                      </div>
                      <div className="text-white/70 text-sm">
                        Сервис получил {service.reviews} оценок со средним рейтингом {service.rating}/5
                      </div>
                    </div>
                  </div>
                </div>

                {/* Правая колонка - Детали услуги */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">📝 Описание услуги</h3>
                    <p className="text-white/70 leading-relaxed text-sm">{service.description}</p>
                  </div>

                  {service.features && service.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">✨ Особенности</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-white/80 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-white/60 text-sm mb-1">Специалист</div>
                      <div className="text-white font-semibold text-sm">{service.specialist}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-white/60 text-sm mb-1">Длительность</div>
                      <div className="text-white font-semibold text-sm">{service.duration}</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/60 text-sm mb-1">Требования к перевозке</div>
                    <div className="text-white font-semibold text-sm">{service.requirements}</div>
                  </div>

                  {service.coverage && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">🗺️ Зона покрытия</h3>
                      <div className="flex flex-wrap gap-2">
                        {service.coverage.map((area: string, index: number) => (
                          <span key={index} className="bg-white/10 text-white/80 px-3 py-1 rounded-lg text-sm border border-white/20">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                    <h4 className="text-green-400 font-semibold text-sm mb-2">📈 Тренд роста</h4>
                    <div className="text-green-400 text-lg font-bold">
                      {service.managerStats.monthlyGrowth || '+12%'} за последний месяц
                    </div>
                    <div className="text-green-400/60 text-xs mt-1">
                      Положительная динамика по ключевым показателям
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10">
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🚗 Управлять перевозками
                </motion.button>
                <motion.button
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Аналитика маршрутов
                </motion.button>
                <motion.button
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ⚙️ Настройки услуги
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Компонент ParticleCard (упрощенная версия)
const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  glowColor?: string;
  onCardClick?: () => void;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  glowColor = DEFAULT_GLOW_COLOR,
  onCardClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      className={`${className} relative overflow-hidden cursor-pointer transition-all duration-300 card--border-glow`}
      style={{ 
        ...style,
        '--glow-color': glowColor,
      } as React.CSSProperties}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onCardClick}
    >
      {children}
    </motion.div>
  );
};

// Компонент GlobalSpotlight (упрощенная версия)
const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
}) => {
  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll('.card');

      if (!mouseInside) {
        cards.forEach(card => {
          (card as HTMLElement).style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      cards.forEach(card => {
        const cardElement = card as HTMLElement;
        updateCardGlowProperties(cardElement, e.clientX, e.clientY, 0.3, DEFAULT_SPOTLIGHT_RADIUS);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gridRef, disableAnimations, enabled]);

  return null;
};

// Компонент BentoCardGrid
const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}> = ({ children, gridRef, className = '' }) => (
  <motion.div
    className={`bento-section grid gap-4 p-4 max-w-7xl mx-auto select-none relative ${className}`}
    ref={gridRef}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.div>
);

// Основные данные
const transportServicesData: TransportService[] = [
  {
    id: 1,
    name: "Такси премиум-класса",
    category: "Пассажирские перевозки",
    icon: "🚖",
    status: "active",
    price: "от 250 ₽",
    tripsPerMonth: "3,450",
    utilization: 88,
    color: "#F59E0B",
    rating: 4.8,
    reviews: 892,
    tags: ["Премиум", "Комфорт", "Быстро", "Круглосуточно"],
    description: "Премиальные пассажирские перевозки на комфортабельных автомобилях бизнес-класса с профессиональными водителями. Сервис включает встречу с табличкой, помощь с багажом, бутилированную воду и премиум-обслуживание.",
    features: ["Кондиционер", "Wi-Fi", "Бутилированная вода", "Зарядные устройства", "Детские кресла", "Встреча с табличкой"],
    duration: "По запросу",
    specialist: "Водитель премиум-класса",
    requirements: "Предварительный заказ за 30 минут",
    managerStats: {
      assignedDrivers: 25,
      completionRate: 95,
      satisfaction: 94,
      revenue: "862,500 ₽",
      onTimeArrival: 96,
      monthlyGrowth: "+12%",
      vehicleCondition: 98,
      fuelEfficiency: 85
    },
    coverage: ["Весь город", "Аэропорт", "Вокзалы", "Гостиницы"],
    maintenanceSchedule: "Еженедельно",
    insurance: "Полная страховка"
  },
  {
    id: 2,
    name: "Эконом такси",
    category: "Пассажирские перевозки",
    icon: "🚕",
    status: "active",
    price: "от 150 ₽",
    tripsPerMonth: "5,780",
    utilization: 92,
    color: "#3B82F6",
    rating: 4.6,
    reviews: 1245,
    tags: ["Эконом", "Доступно", "Город", "Быстро"],
    description: "Доступные пассажирские перевозки по городу на современных автомобилях эконом-класса. Оптимальное соотношение цены и качества с быстрым временем подачи.",
    features: ["Кондиционер", "Онлайн-оплата", "Фиксированные тарифы", "Быстрая подача"],
    duration: "По запросу",
    specialist: "Водитель",
    requirements: "Минимальный тариф 150 ₽",
    managerStats: {
      assignedDrivers: 35,
      completionRate: 93,
      satisfaction: 91,
      revenue: "867,000 ₽",
      onTimeArrival: 94,
      monthlyGrowth: "+8%",
      vehicleCondition: 95,
      fuelEfficiency: 88
    },
    coverage: ["Городская зона", "Пригород"],
    maintenanceSchedule: "Раз в 2 недели"
  },
  {
    id: 3,
    name: "Корпоративный транспорт",
    category: "Бизнес-перевозки",
    icon: "🚐",
    status: "active",
    price: "от 1,200 ₽",
    tripsPerMonth: "890",
    utilization: 75,
    color: "#10B981",
    rating: 4.9,
    reviews: 345,
    tags: ["Бизнес", "Корпорации", "Микроавтобус", "Комфорт"],
    description: "Транспортное обслуживание корпоративных клиентов, трансферы сотрудников и деловые поездки. Индивидуальный подход к каждому клиенту.",
    features: ["Ежедневное обслуживание", "Отчетность", "Выделенный менеджер", "Гибкий график"],
    duration: "По договору",
    specialist: "Водитель бизнес-класса",
    requirements: "Корпоративный договор",
    managerStats: {
      assignedDrivers: 12,
      completionRate: 97,
      satisfaction: 96,
      revenue: "1,068,000 ₽",
      onTimeArrival: 98,
      monthlyGrowth: "+15%",
      vehicleCondition: 99,
      fuelEfficiency: 82
    },
    coverage: ["Город", "Область", "Межгород"],
    maintenanceSchedule: "По графику ТО"
  },
  {
    id: 4,
    name: "Трансфер в аэропорт",
    category: "Специальные перевозки",
    icon: "✈️",
    status: "active",
    price: "от 800 ₽",
    tripsPerMonth: "1,234",
    utilization: 82,
    color: "#06B6D4",
    rating: 4.7,
    reviews: 567,
    tags: ["Аэропорт", "Трансфер", "Встреча", "Отправление"],
    description: "Специализированные трансферы до аэропортов и обратно с учетом расписания рейсов. Мониторинг рейсов в реальном времени.",
    features: ["Мониторинг рейсов", "Встреча в зале", "Помощь с багажом", "Страхование"],
    duration: "1-2 часа",
    specialist: "Водитель трансфера",
    requirements: "Информация о рейсе",
    managerStats: {
      assignedDrivers: 18,
      completionRate: 96,
      satisfaction: 95,
      revenue: "987,200 ₽",
      onTimeArrival: 97,
      monthlyGrowth: "+10%",
      vehicleCondition: 97,
      fuelEfficiency: 84
    },
    coverage: ["Все аэропорты", "Вокзалы"],
    maintenanceSchedule: "Перед каждым трансфером"
  },
  {
    id: 5,
    name: "Грузовые перевозки",
    category: "Грузоперевозки",
    icon: "🚛",
    status: "development",
    price: "от 2,500 ₽",
    tripsPerMonth: "345",
    utilization: 65,
    color: "#8B5CF6",
    rating: 4.5,
    reviews: 178,
    tags: ["Грузы", "Переезд", "Доставка", "Газель"],
    description: "Грузовые перевозки различной сложности, переезды и доставка товаров. Грузчики в составе экипажа.",
    features: ["Грузчики", "Страхование груза", "Различные ТС", "Срочные перевозки"],
    duration: "3-6 часов",
    specialist: "Водитель-грузчик",
    requirements: "Габариты груза",
    managerStats: {
      assignedDrivers: 8,
      completionRate: 89,
      satisfaction: 90,
      revenue: "862,500 ₽",
      onTimeArrival: 92,
      monthlyGrowth: "+5%",
      vehicleCondition: 93,
      fuelEfficiency: 78
    },
    coverage: ["Город", "Область", "Складские зоны"]
  },
  {
    id: 6,
    name: "Междугородние перевозки",
    category: "Дальние перевозки",
    icon: "🚍",
    status: "active",
    price: "от 1,500 ₽",
    tripsPerMonth: "567",
    utilization: 78,
    color: "#EC4899",
    rating: 4.6,
    reviews: 234,
    tags: ["Межгород", "Автобус", "Комфорт", "Дальние"],
    description: "Междугородние пассажирские перевозки на комфортабельных автобусах и микроавтобусах. Регулярные рейсы и индивидуальные заказы.",
    features: ["Комфортабельные сиденья", "Туалет", "Кондиционер", "Багажное отделение"],
    duration: "2-8 часов",
    specialist: "Водитель междугородний",
    requirements: "Предварительное бронирование",
    managerStats: {
      assignedDrivers: 15,
      completionRate: 94,
      satisfaction: 93,
      revenue: "850,500 ₽",
      onTimeArrival: 95,
      monthlyGrowth: "+7%",
      vehicleCondition: 96,
      fuelEfficiency: 80
    },
    coverage: ["Межгород", "Соседние области"],
    maintenanceSchedule: "После каждого рейса"
  }
];

const managerMetrics: Metric[] = [
  { category: "Всего поездок", value: "12,266", trend: "up", color: "#F59E0B", icon: "🚗", change: "+8%" },
  { category: "Активных услуг", value: "6", trend: "stable", color: "#10B981", icon: "✅" },
  { category: "Средний рейтинг", value: "4.7/5", trend: "up", color: "#F59E0B", icon: "⭐", change: "+0.1" },
  { category: "Выполнение плана", value: "91%", trend: "up", color: "#8B5CF6", icon: "📊", change: "+3%" },
  { category: "Доход в месяц", value: "5.5M ₽", trend: "up", color: "#84CC16", icon: "💰", change: "+12%" },
  { category: "Удовлетворенность", value: "94%", trend: "stable", color: "#06B6D4", icon: "😊" }
];

const teamPerformance: TeamMember[] = [
  {
    id: 1,
    name: "Александр Волков",
    role: "Старший водитель",
    trips: 456,
    completion: 98,
    rating: 4.9,
    status: "active",
    vehicle: "Mercedes E-Class",
    experience: "8 лет",
    contact: "+7 (999) 123-45-67",
    lastTrip: "2024-01-20",
    nextMaintenance: "2024-02-01",
    performanceTrend: "up"
  },
  {
    id: 2,
    name: "Ирина Петрова",
    role: "Водитель бизнес-класса",
    trips: 389,
    completion: 96,
    rating: 4.8,
    status: "active",
    vehicle: "Toyota Camry",
    experience: "6 лет",
    contact: "+7 (999) 123-45-68",
    lastTrip: "2024-01-20",
    performanceTrend: "stable"
  },
  {
    id: 3,
    name: "Сергей Козлов",
    role: "Водитель трансфера",
    trips: 345,
    completion: 95,
    rating: 4.7,
    status: "active",
    vehicle: "Hyundai Solaris",
    experience: "5 лет",
    contact: "+7 (999) 123-45-69",
    lastTrip: "2024-01-19",
    performanceTrend: "up"
  },
  {
    id: 4,
    name: "Дмитрий Новиков",
    role: "Водитель междугородний",
    trips: 278,
    completion: 94,
    rating: 4.6,
    status: "active",
    vehicle: "Mercedes Sprinter",
    experience: "7 лет",
    contact: "+7 (999) 123-45-70",
    lastTrip: "2024-01-18",
    performanceTrend: "stable"
  },
  {
    id: 5,
    name: "Мария Сидорова",
    role: "Водитель-грузчик",
    trips: 156,
    completion: 92,
    rating: 4.5,
    status: "training",
    vehicle: "Газель Next",
    experience: "3 года",
    contact: "+7 (999) 123-45-71",
    lastTrip: "2024-01-17",
    performanceTrend: "up"
  },
  {
    id: 6,
    name: "Андрей Кузнецов",
    role: "Водитель эконом-класса",
    trips: 423,
    completion: 93,
    rating: 4.6,
    status: "vacation",
    vehicle: "Kia Rio",
    experience: "4 года",
    contact: "+7 (999) 123-45-72",
    lastTrip: "2024-01-15",
    performanceTrend: "down"
  }
];

const upcomingTasks: Task[] = [
  {
    id: 1,
    title: "Техническое обслуживание автопарка",
    deadline: "2024-01-22",
    priority: "high",
    assigned: "Сервисный отдел",
    progress: 65,
    department: "Техническая служба",
    description: "Плановое ТО 25 автомобилей, замена расходников, диагностика систем"
  },
  {
    id: 2,
    title: "Обучение новых водителей",
    deadline: "2024-01-25",
    priority: "medium",
    assigned: "Александр Волков",
    progress: 40,
    department: "Персонал",
    description: "Обучение 3 новых водителей стандартам сервиса и технике безопасности"
  },
  {
    id: 3,
    title: "Внедрение GPS-мониторинга",
    deadline: "2024-02-05",
    priority: "high",
    assigned: "IT отдел",
    progress: 75,
    department: "Технологии",
    description: "Установка и настройка системы мониторинга на весь автопарк"
  },
  {
    id: 4,
    title: "Аудит безопасности перевозок",
    deadline: "2024-01-30",
    priority: "medium",
    assigned: "Ирина Петрова",
    progress: 30,
    department: "Безопасность",
    description: "Проверка соблюдения правил безопасности и стандартов обслуживания"
  },
  {
    id: 5,
    title: "Обновление страховых полисов",
    deadline: "2024-01-28",
    priority: "low",
    assigned: "Бухгалтерия",
    progress: 20,
    department: "Финансы",
    description: "Продление страховых полисов для 45 транспортных средств"
  }
];

const transportIndicators = [
  { name: "Прибытие вовремя", value: 96, target: 90, color: "#10B981" },
  { name: "Безопасность поездок", value: 99, target: 95, color: "#3B82F6" },
  { name: "Чистота транспорта", value: 97, target: 92, color: "#8B5CF6" },
  { name: "Эффективность маршрутов", value: 91, target: 85, color: "#F59E0B" },
  { name: "Экономия топлива", value: 87, target: 80, color: "#06B6D4" },
  { name: "Использование автопарка", value: 82, target: 75, color: "#EC4899" }
];

const serviceAnalytics = [
  { name: "Такси премиум", revenue: "862K", growth: "+12%", utilization: 88, trips: 3450 },
  { name: "Эконом такси", revenue: "867K", growth: "+8%", utilization: 92, trips: 5780 },
  { name: "Корпоративный", revenue: "1.07M", growth: "+15%", utilization: 75, trips: 890 },
  { name: "Трансферы", revenue: "987K", growth: "+10%", utilization: 82, trips: 1234 },
  { name: "Грузовые", revenue: "863K", growth: "+5%", utilization: 65, trips: 345 },
  { name: "Межгород", revenue: "851K", growth: "+7%", utilization: 78, trips: 567 }
];

// Основной компонент
export default function TransportServicesManager() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedService, setSelectedService] = useState<TransportService | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'development' | 'paused'>('all');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
      setCurrentDate(now.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleServiceClick = (service: TransportService) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  // Фильтрация услуг
  const filteredServices = transportServicesData.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = transportServicesData.reduce((sum, service) => {
    const revenue = service.managerStats.revenue === '0 ₽' ? 0 : 
      parseInt(service.managerStats.revenue.replace(/\s/g, '').replace('₽', ''));
    return sum + revenue;
  }, 0);

  const formatRevenue = (revenue: number) => {
    return new Intl.NumberFormat('ru-RU').format(revenue) + ' ₽';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      <style jsx global>{`
        .bento-section {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: ${DEFAULT_SPOTLIGHT_RADIUS}px;
          --glow-color: ${DEFAULT_GLOW_COLOR};
          --border-color: rgba(255, 255, 255, 0.1);
          --background-dark: #060010;
          --white: hsl(0, 0%, 100%);
        }
        
        .card--border-glow {
          position: relative;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
        }
        
        .card--border-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1px;
          background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.8)) 0%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.4)) 30%,
              transparent 60%);
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          pointer-events: none;
          z-index: 1;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Мобильная оптимизация */
        @media (max-width: 768px) {
          .bento-section {
            padding: 1rem;
            gap: 1rem;
          }
          
          .card--border-glow::before {
            display: none;
          }
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Заголовок страницы */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <motion.h1 
                  className="text-2xl sm:text-3xl font-bold text-white mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  🚗 Управление транспортными услугами
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-base sm:text-lg mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-orange-400">6 транспортных услуг</span> • <span className="text-blue-400">12,266 поездок</span> • <span className="text-green-400">18 водителей в команде</span>
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>Общий доход: {formatRevenue(totalRevenue)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>91% выполнение плана</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>94% удовлетворенность клиентов</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right mt-4 lg:mt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-xl sm:text-2xl bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg inline-block">
                  Менеджер отдела
                </div>
                <div className="text-white/60 text-sm mt-2">Николаев М.В.</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Навигационные табы */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { id: 'services', label: '🚗 Услуги и аналитика', icon: '🚗' },
            { id: 'team', label: '👨‍✈️ Команда водителей', icon: '👨‍✈️' },
            { id: 'tasks', label: '📋 Операционные задачи', icon: '📋' },
            { id: 'reports', label: '📊 Отчеты перевозок', icon: '📊' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Основные метрики */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {managerMetrics.map((metric, index) => (
              <StatCard 
                key={index} 
                metric={metric} 
                index={index}
              />
            ))}
          </div>
        </motion.section>

        {/* Контент в зависимости от активной вкладки */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'services' && (
              <div className="space-y-8">

                {/* Аналитика услуг */}
                <motion.div 
                  className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">📊 Аналитика услуг</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {serviceAnalytics.map((service, index) => (
                      <motion.div
                        key={index}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-white font-bold text-sm">{service.name}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            service.growth.includes('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {service.growth}
                          </div>
                        </div>
                        <div className="text-white font-bold text-lg mb-2">{service.revenue} ₽</div>
                        <div className="flex justify-between text-white/60 text-xs mb-2">
                          <span>{service.trips} поездок</span>
                          <span>{service.utilization}% загрузка</span>
                        </div>
                        <ProgressBar value={service.utilization} label="" color="#10B981" height="4px" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Список транспортных услуг */}
                <GlobalSpotlight
                  gridRef={gridRef}
                  disableAnimations={shouldDisableAnimations}
                  enabled={!isMobile}
                />

                <BentoCardGrid gridRef={gridRef} className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredServices.map((service, index) => (
                      <ParticleCard
                        key={service.id}
                        className="card w-full rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
                        style={{
                          backgroundColor: 'var(--background-dark)',
                          color: 'var(--white)',
                          '--glow-x': '50%',
                          '--glow-y': '50%',
                          '--glow-intensity': '0',
                          '--glow-radius': '200px',
                          '--glow-color': service.color.replace('#', '')
                        } as React.CSSProperties}
                        disableAnimations={shouldDisableAnimations}
                        glowColor={service.color.replace('#', '')}
                        onCardClick={() => handleServiceClick(service)}
                      >
                        <ServiceCard service={service} index={index} onServiceClick={handleServiceClick} />
                      </ParticleCard>
                    ))}
                  </div>
                </BentoCardGrid>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-8">
                <motion.div 
                  className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">👨‍✈️ Команда водителей</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {teamPerformance.map((member, index) => (
                      <TeamMemberCard key={member.id} member={member} index={index} />
                    ))}
                  </div>
                </motion.div>

                {/* Статистика команды */}
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">📈 Производительность команды</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Средний рейтинг</span>
                        <span className="text-white font-bold">4.7/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Выполнение поездок</span>
                        <span className="text-white font-bold">95%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Активных водителей</span>
                        <span className="text-white font-bold">15/18</span>
                      </div>
                    </div>
                  </div>

                  <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">🎯 Цели на месяц</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-white text-sm mb-2">
                          <span>Увеличить средний рейтинг</span>
                          <span>4.8/5</span>
                        </div>
                        <ProgressBar value={85} color="#F59E0B" height="4px" />
                      </div>
                      <div>
                        <div className="flex justify-between text-white text-sm mb-2">
                          <span>Снижение времени подачи</span>
                          <span>7 мин</span>
                        </div>
                        <ProgressBar value={70} color="#3B82F6" height="4px" />
                      </div>
                      <div>
                        <div className="flex justify-between text-white text-sm mb-2">
                          <span>Обучение новых водителей</span>
                          <span>3 чел</span>
                        </div>
                        <ProgressBar value={40} color="#10B981" height="4px" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-8">
                <motion.div 
                  className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold text-white">📋 Операционные задачи</h2>
                    <div className="flex gap-2">
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm transition-colors">
                        + Новая задача
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm transition-colors">
                        Фильтры
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {upcomingTasks.map((task, index) => (
                      <TaskCard key={task.id} task={task} index={index} />
                    ))}
                  </div>
                </motion.div>

                {/* Статистика задач */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">65%</div>
                    <div className="text-white/60 text-sm">Общий прогресс</div>
                  </div>
                  <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 text-center">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">3</div>
                    <div className="text-white/60 text-sm">Высокий приоритет</div>
                  </div>
                  <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-2">7 дн</div>
                    <div className="text-white/60 text-sm">Среднее время выполнения</div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div 
                    className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-bold text-white mb-4">📊 Показатели перевозок</h3>
                    <div className="space-y-4">
                      {transportIndicators.map((indicator, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-white text-sm">
                            <span>{indicator.name}</span>
                            <span className="font-bold">{indicator.value}%</span>
                          </div>
                          <div className="flex justify-between text-white/60 text-xs mb-1">
                            <span>Цель: {indicator.target}%</span>
                            <span className={indicator.value >= indicator.target ? 'text-green-400' : 'text-yellow-400'}>
                              {indicator.value >= indicator.target ? '✅ Выполнено' : '⚠️ Требует внимания'}
                            </span>
                          </div>
                          <ProgressBar value={indicator.value} color={indicator.color} showLabel={false} height="6px" />
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-bold text-white mb-4">💰 Финансовые показатели</h3>
                    <div className="space-y-3">
                      {transportServicesData.map((service, index) => (
                        <div key={service.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="text-lg">{service.icon}</div>
                            <span className="text-white text-sm truncate">{service.name}</span>
                          </div>
                          <div className="text-right ml-2">
                            <div className="text-white font-bold text-sm">{service.managerStats.revenue}</div>
                            <div className="text-white/60 text-xs">{service.tripsPerMonth} поездок</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Ежемесячная аналитика */}
                <motion.div 
                  className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-bold text-white mb-4">📈 Ежемесячная аналитика</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-2xl font-bold text-green-400 mb-1">+12%</div>
                      <div className="text-white/60 text-sm">Рост доходов</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-2xl font-bold text-blue-400 mb-1">+8%</div>
                      <div className="text-white/60 text-sm">Рост поездок</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">94%</div>
                      <div className="text-white/60 text-sm">Удовлетворенность</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-2xl font-bold text-purple-400 mb-1">96%</div>
                      <div className="text-white/60 text-sm">Вовремя</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Модальное окно услуги */}
      <ServiceModal 
        service={selectedService} 
        isOpen={isServiceModalOpen} 
        onClose={closeServiceModal} 
      />
    </div>
  );
}