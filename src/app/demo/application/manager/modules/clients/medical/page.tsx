'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Медицинская цветовая палитра
const MEDICAL_COLORS = {
  primary: 'from-gray-950 via-black to-gray-900',
  secondary: 'from-blue-900 via-black to-cyan-900',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  medicalBlue: '59, 130, 246',
  medicalGreen: '16, 185, 129',
  medicalRed: '239, 68, 68',
  medicalCyan: '34, 211, 238',
  medicalTeal: '20, 184, 166',
  medicalPurple: '139, 92, 246',
  medicalEmerald: '16, 185, 129',
  medicalAmber: '245, 158, 11'
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

// Улучшенная карточка пациента
const PatientCard = ({
  patient,
  index,
  onPatientClick,
  viewMode = 'grid'
}: {
  patient: any;
  index: number;
  onPatientClick?: (patient: any) => void;
  viewMode?: 'grid' | 'list';
}) => {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isListMode = viewMode === 'list';

  const getGradient = (name: string) => {
    const gradients = [
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-green-600',
      'from-blue-500 to-purple-600',
      'from-teal-500 to-cyan-600',
      'from-sky-500 to-blue-600',
      'from-indigo-500 to-purple-600'
    ];
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'stable':
        return { color: 'bg-emerald-400', text: '', label: 'stable' };
      case 'critical':
        return { color: 'bg-red-400', text: '', label: 'critical' };
      case 'recovering':
        return { color: 'bg-amber-400', text: '', label: 'recovering' };
      case 'observation':
        return { color: 'bg-blue-400', text: '', label: 'observation' };
      default:
        return { color: 'bg-gray-400', text: '', label: 'unknown' };
    }
  };

  const statusInfo = getStatusInfo(patient.status);

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
        onClick={() => onPatientClick?.(patient)}
      >
        <motion.div
          className={`w-14 h-14 rounded-full bg-gradient-to-r ${getGradient(patient.name)} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-lg`}
          whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {patient.initials}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-base group-hover:text-cyan-300 transition-colors truncate">
                {patient.name}
              </div>
              <div className="text-white/60 text-sm mt-1">
                {patient.age} лет • {patient.gender === 'male' ? 'Муж' : 'Жен'} • {patient.department}
              </div>
            </div>
            
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                <div className="text-white/60 text-sm hidden sm:block">
                  {patient.lastCheckup}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-white/70">
                Диагноз: <span className="text-white font-medium">{patient.diagnosis}</span>
              </div>
              <div className="text-white/70">
                Прогресс: <span className="text-white font-medium">{patient.progress}%</span>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <ProgressBar
                value={patient.progress}
                color={patient.color}
                height="6px"
                showLabel={false}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {patient.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
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
      onClick={() => onPatientClick?.(patient)}
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
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${getGradient(patient.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}
            whileHover={!isMobile ? { scale: 1.08, rotate: 5 } : {}}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {patient.initials}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold text-sm group-hover:text-cyan-300 transition-colors truncate">
              {patient.name}
            </div>
            <div className="text-white/60 text-xs">
              {patient.age} лет • {patient.gender === 'male' ? 'Муж' : 'Жен'}
            </div>
            <div className="text-white/50 text-[11px] mt-1">
              {patient.department}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4 flex-1">
        <div className="flex justify-between items-center text-white text-[11px]">
          <span className="text-white/60">Диагноз</span>
          <span className="font-medium bg-white/10 px-2 py-1 rounded-full text-right truncate max-w-[120px]">
            {patient.diagnosis}
          </span>
        </div>
        <ProgressBar
          value={patient.progress}
          label="Прогресс лечения"
          color={patient.color}
          height="6px"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-white/60 mb-3">
        <span>Последний осмотр</span>
        <span className="font-medium text-white/70">{patient.lastCheckup}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {patient.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
          <motion.span
            key={tagIndex}
            className="text-[10px] bg-white/8 px-2 py-1 rounded-full border border-white/15 text-white/80 group-hover:bg-white/14 transition-colors truncate max-w-[80px]"
            whileHover={!isMobile ? { scale: 1.05 } : {}}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {tag}
          </motion.span>
        ))}
        {patient.tags.length > 3 && (
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full border border-white/10 text-white/60">
            +{patient.tags.length - 3}
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

// Улучшенная карточка отделения
const DepartmentCard = ({
  department,
  isSelected,
  onClick,
  index
}: {
  department: any;
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
          ? 'border-cyan-500/40 ring-2 ring-cyan-500/20 bg-cyan-500/5' 
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
          style={{ color: `rgb(${department.glowColor})` }}
          whileHover={{ scale: 1.05 }}
        >
          {department.value} {department.metric}
        </motion.span>
        {isSelected && (
          <motion.div
            className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2 py-1 border border-cyan-500/40 text-[11px] text-cyan-300"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420 }}
          >
            <motion.span 
              className="w-1.5 h-1.5 rounded-full bg-cyan-300"
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
          {department.title}
        </motion.h3>
        <p className="text-white/70 text-xs sm:text-[13px] leading-4 sm:leading-5 mb-3 sm:mb-4 flex-1">
          {department.description}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
          {[
            { value: department.avgRecovery, label: 'Успешность лечения', color: 'text-white' },
            { value: department.occupancy, label: 'Занятость коек', color: 'text-amber-300' }
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
          value={department.avgRecovery}
          label="Успешность лечения"
          color={`rgb(${department.glowColor})`}
          showLabel
          height="6px"
        />

        <div className="mt-3 sm:mt-3.5">
          <div className="text-white/60 text-[11px] mb-1.5">Распространенные диагнозы</div>
          <div className="flex flex-wrap gap-1.5">
            {department.commonDiagnoses
              .slice(0, isMobile ? 2 : 3)
              .map((diagnosis: string, diagnosisIndex: number) => (
                <motion.span
                  key={diagnosisIndex}
                  className="text-[11px] bg-white/10 px-2 py-1 rounded-full border border-white/20 text-white/80"
                  whileHover={!isMobile ? { scale: 1.04 } : {}}
                  transition={{ type: 'spring', stiffness: 380 }}
                >
                  {diagnosis}
                </motion.span>
              ))}
            {department.commonDiagnoses.length > (isMobile ? 2 : 3) && (
              <span className="text-[11px] bg-white/6 px-2 py-1 rounded-full border border-white/16 text-white/60">
                +{department.commonDiagnoses.length - (isMobile ? 2 : 3)}
              </span>
            )}
          </div>
        </div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 70% 10%, rgba(${department.glowColor}, 0.35) 0%, transparent 60%)`
        }}
        animate={{
          background: [
            `radial-gradient(circle at 70% 10%, rgba(${department.glowColor}, 0.35) 0%, transparent 60%)`,
            `radial-gradient(circle at 30% 80%, rgba(${department.glowColor}, 0.35) 0%, transparent 60%)`,
            `radial-gradient(circle at 70% 10%, rgba(${department.glowColor}, 0.35) 0%, transparent 60%)`
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
  onAddPatient,
  onGenerateReport,
  viewMode,
  setViewMode,
  onShowAnalytics
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  onAddPatient: () => void;
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
          onClick={onAddPatient}
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
          <span>{isMobile ? 'Добавить' : 'Добавить пациента'}</span>
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

// Модальное окно добавления пациента
const AddPatientModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    diagnosis: '',
    department: '',
    doctor: '',
    room: ''
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
    // Обработка добавления пациента
    console.log('Добавление пациента:', formData);
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
              Добавить нового пациента
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
                <label className="text-white text-sm mb-2 block">ФИО пациента</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="45"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Пол</label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                </select>
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Отделение</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="">Выберите отделение</option>
                  <option value="cardiology">Кардиология</option>
                  <option value="neurology">Неврология</option>
                  <option value="surgery">Хирургия</option>
                  <option value="therapy">Терапия</option>
                </select>
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Диагноз</label>
                <input
                  type="text"
                  required
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Основной диагноз"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Лечащий врач</label>
                <input
                  type="text"
                  required
                  value={formData.doctor}
                  onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Петрова А.И."
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
                className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Добавить пациента
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
    totalPatients: 1247,
    activeTreatments: 856,
    avgRecovery: 76,
    monthlyGrowth: 8.2,
    departmentDistribution: [
      { name: 'Кардиология', value: 28, color: `rgba(${MEDICAL_COLORS.medicalRed}, 0.9)` },
      { name: 'Неврология', value: 20, color: `rgba(${MEDICAL_COLORS.medicalPurple}, 0.9)` },
      { name: 'Хирургия', value: 25, color: `rgba(${MEDICAL_COLORS.medicalTeal}, 0.9)` },
      { name: 'Терапия', value: 15, color: `rgba(${MEDICAL_COLORS.medicalBlue}, 0.9)` },
      { name: 'Педиатрия', value: 8, color: `rgba(${MEDICAL_COLORS.medicalGreen}, 0.9)` },
      { name: 'Другие отделения', value: 4, color: `rgba(${MEDICAL_COLORS.medicalAmber}, 0.9)` }
    ],
    monthlyStats: [
      { month: 'Янв', patients: 1100, treatments: 800 },
      { month: 'Фев', patients: 1150, treatments: 820 },
      { month: 'Мар', patients: 1180, treatments: 830 },
      { month: 'Апр', patients: 1200, treatments: 840 },
      { month: 'Май', patients: 1220, treatments: 850 },
      { month: 'Июн', patients: 1247, treatments: 856 }
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
              📊 Медицинская аналитика
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
                  <div className="text-2xl font-bold text-white mb-1">{analyticsData.totalPatients}</div>
                  <div className="text-white/60 text-sm">Всего пациентов</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{analyticsData.activeTreatments}</div>
                  <div className="text-white/60 text-sm">Активных лечений</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400 mb-1">{analyticsData.avgRecovery}%</div>
                  <div className="text-white/60 text-sm">Успешность лечения</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">+{analyticsData.monthlyGrowth}%</div>
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
              <h4 className="text-white font-semibold text-lg mb-4">Распределение по отделениям</h4>
              <PieChart
                data={analyticsData.departmentDistribution}
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
                      value={(stat.patients / 1500) * 100}
                      color="#3B82F6"
                      height="20px"
                      showLabel={false}
                    />
                  </div>
                  <div className="text-right text-xs text-white/60 w-20">
                    {stat.patients} чел.
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
              className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors backdrop-blur-sm"
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
              📋 Генерация медицинского отчета
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
              >
                <option value="full">Полный отчет</option>
                <option value="monthly">Месячный отчет</option>
                <option value="departments">По отделениям</option>
                <option value="treatments">По видам лечения</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Период</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                />
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-300 backdrop-blur-sm"
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
              className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors backdrop-blur-sm"
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

// Улучшенное модальное окно пациента
const PatientModal = ({ patient, onClose }: { patient: any; onClose: () => void }) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-500/15 text-green-400 border-green-500/40';
      case 'critical': return 'bg-red-500/15 text-red-400 border-red-500/40';
      case 'recovering': return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'observation': return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
      default: return 'bg-gray-500/15 text-gray-300 border-gray-500/40';
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
              Медицинская карта пациента
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
                className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                {patient.initials}
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-2xl mb-2 truncate">{patient.name}</h4>
                <div className="text-white/60 text-sm mb-3">
                  {patient.age} лет • {patient.gender === 'male' ? 'Мужской' : 'Женский'} • {patient.department}
                </div>
                <div className="flex flex-wrap gap-2">
                  <motion.div 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(patient.status)}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {patient.status === 'stable' ? 'Стабилен' : 
                     patient.status === 'critical' ? 'Критический' :
                     patient.status === 'recovering' ? 'Восстанавливается' : 'Наблюдение'}
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    Лекарств: {patient.medications}
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    Прогресс: {patient.progress}%
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
                      { label: 'Телефон', value: patient.details.phone },
                      { label: 'Адрес', value: patient.details.address },
                      { label: 'Дата рождения', value: patient.details.birthDate }
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
                    <span>🏥</span> Медицинская информация
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Группа крови', value: patient.details.bloodType },
                      { label: 'Страховка', value: patient.details.insurance },
                      { label: 'Аллергии', value: patient.details.allergies.length > 0 ? patient.details.allergies.join(', ') : 'Нет' }
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
                    <span>🔄</span> Лечение и наблюдение
                  </h5>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Дата поступления', value: patient.admissionDate },
                      { label: 'Последний осмотр', value: patient.lastCheckup },
                      { label: 'Следующий прием', value: patient.nextAppointment }
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
                      value={patient.progress}
                      label="Прогресс лечения"
                      color={patient.color}
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
                    {patient.tags.map((tag: string, index: number) => (
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
                <span>📝</span> Примечания врача
              </h5>
              <div className="text-white text-sm leading-relaxed">
                {patient.details.notes}
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
              className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors backdrop-blur-sm"
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
const departments = [
  {
    id: 'all',
    title: '🏥 Все пациенты',
    description: 'Полная база пациентов • Все отделения • Статистика по всем больным',
    value: '1,247',
    metric: 'Всего пациентов',
    color: '#060010',
    glowColor: MEDICAL_COLORS.medicalBlue,
    patientsCount: 1247,
    avgRecovery: 76,
    occupancy: 85,
    growth: '+8%',
    commonDiagnoses: ['ОРВИ', 'Гипертония', 'Диабет', 'Травмы', 'Сердечные заболевания'],
    details: {
      availableBeds: 187,
      totalBeds: 1434,
      avgStay: 6.2,
      doctorsCount: 234,
      successRate: 94.5
    }
  },
  {
    id: 'cardiology',
    title: '❤️ Кардиология',
    description: 'Пациенты с сердечно-сосудистыми заболеваниями • Реанимация • Хирургия',
    value: '284',
    metric: 'Пациентов',
    color: '#060010',
    glowColor: MEDICAL_COLORS.medicalRed,
    patientsCount: 284,
    avgRecovery: 68,
    occupancy: 92,
    growth: '+12%',
    commonDiagnoses: ['ИБС', 'Инфаркт', 'Аритмия', 'Гипертония', 'Сердечная недостаточность'],
    details: {
      availableBeds: 23,
      totalBeds: 307,
      avgStay: 8.5,
      doctorsCount: 45,
      successRate: 89.2
    }
  },
  {
    id: 'neurology',
    title: '🧠 Неврология',
    description: 'Заболевания нервной системы • Инсульты • Реабилитация',
    value: '198',
    metric: 'Пациентов',
    color: '#060010',
    glowColor: MEDICAL_COLORS.medicalPurple,
    patientsCount: 198,
    avgRecovery: 72,
    occupancy: 78,
    growth: '+6%',
    commonDiagnoses: ['Инсульт', 'Эпилепсия', 'Рассеянный склероз', 'Мигрень', 'Болезнь Паркинсона'],
    details: {
      availableBeds: 44,
      totalBeds: 242,
      avgStay: 7.8,
      doctorsCount: 32,
      successRate: 91.8
    }
  },
  {
    id: 'surgery',
    title: '🔪 Хирургия',
    description: 'Операционные пациенты • Послеоперационное наблюдение • Травматология',
    value: '312',
    metric: 'Пациентов',
    color: '#060010',
    glowColor: MEDICAL_COLORS.medicalTeal,
    patientsCount: 312,
    avgRecovery: 84,
    occupancy: 88,
    growth: '+15%',
    commonDiagnoses: ['Аппендицит', 'Переломы', 'Онкология', 'Травмы', 'Воспаления'],
    details: {
      availableBeds: 38,
      totalBeds: 350,
      avgStay: 5.4,
      doctorsCount: 67,
      successRate: 96.1
    }
  }
];

const patientsData = [
  {
    id: 1,
    name: 'Иванов Сергей Петрович',
    initials: 'ИС',
    age: 65,
    gender: 'male',
    status: 'critical',
    diagnosis: 'Острый инфаркт миокарда',
    department: 'Кардиология',
    doctor: 'Петрова А.И.',
    room: '304-А',
    admissionDate: '2024-01-15',
    lastCheckup: '2 часа назад',
    nextAppointment: 'Завтра, 10:00',
    medications: 8,
    progress: 45,
    color: '#EF4444',
    tags: ['Критический', 'Реанимация', 'ЭКГ мониторинг', 'Кислород'],
    details: {
      phone: '+7 (915) 123-45-67',
      address: 'ул. Ленина, д. 15, кв. 42',
      birthDate: '15.03.1959',
      insurance: 'ОМС 123-456-789',
      bloodType: 'A(II) Rh+',
      allergies: ['Пенициллин', 'Аспирин'],
      emergencyContact: '+7 (916) 765-43-21 (жена)',
      medicalHistory: 'Гипертония 10 лет, диабет 2 типа',
      currentTreatment: 'Тромболитическая терапия, антикоагулянты',
      notes: 'Требуется постоянный мониторинг ЭКГ'
    }
  },
  {
    id: 2,
    name: 'Петрова Мария Ивановна',
    initials: 'ПМ',
    age: 42,
    gender: 'female',
    status: 'recovering',
    diagnosis: 'Острое нарушение мозгового кровообращения',
    department: 'Неврология',
    doctor: 'Сидоров В.П.',
    room: '215-Б',
    admissionDate: '2024-01-10',
    lastCheckup: 'Сегодня, 08:30',
    nextAppointment: 'Сегодня, 16:00',
    medications: 6,
    progress: 72,
    color: '#8B5CF6',
    tags: ['Инсульт', 'Реабилитация', 'Физиотерапия', 'Логопед'],
    details: {
      phone: '+7 (916) 234-56-78',
      address: 'пр. Мира, д. 23, кв. 15',
      birthDate: '23.07.1982',
      insurance: 'ДМС 234-567-890',
      bloodType: 'O(I) Rh+',
      allergies: [],
      emergencyContact: '+7 (917) 654-32-10 (муж)',
      medicalHistory: 'Мигрени, гипертония',
      currentTreatment: 'Ноотропы, антиагреганты, ЛФК',
      notes: 'Прогресс в восстановлении речи'
    }
  },
  {
    id: 3,
    name: 'Сидоров Алексей Дмитриевич',
    initials: 'СА',
    age: 28,
    gender: 'male',
    status: 'stable',
    diagnosis: 'Закрытый перелом бедра',
    department: 'Хирургия',
    doctor: 'Козлов И.С.',
    room: '112-В',
    admissionDate: '2024-01-12',
    lastCheckup: 'Вчера, 14:00',
    nextAppointment: 'Послезавтра, 11:00',
    medications: 4,
    progress: 88,
    color: '#10B981',
    tags: ['Перелом', 'Иммобилизация', 'Обезболивание', 'Рентген'],
    details: {
      phone: '+7 (917) 345-67-89',
      address: 'ул. Пушкина, д. 8, кв. 33',
      birthDate: '11.09.1996',
      insurance: 'ОМС 345-678-901',
      bloodType: 'B(III) Rh+',
      allergies: ['Лидокаин'],
      emergencyContact: '+7 (918) 543-21-09 (мать)',
      medicalHistory: 'Здоров',
      currentTreatment: 'Анальгетики, антибиотики, ЛФК',
      notes: 'Подготовка к выписке'
    }
  },
  {
    id: 4,
    name: 'Козлова Анна Сергеевна',
    initials: 'КА',
    age: 34,
    gender: 'female',
    status: 'observation',
    diagnosis: 'Острый аппендицит',
    department: 'Хирургия',
    doctor: 'Новикова Е.В.',
    room: '108-А',
    admissionDate: '2024-01-14',
    lastCheckup: 'Сегодня, 09:00',
    nextAppointment: 'Завтра, 09:00',
    medications: 5,
    progress: 65,
    color: '#3B82F6',
    tags: ['Послеоперационный', 'Аппендэктомия', 'Перевязка', 'Антибиотики'],
    details: {
      phone: '+7 (918) 456-78-90',
      address: 'б-р Рокоссовского, д. 12, кв. 7',
      birthDate: '30.11.1990',
      insurance: 'ДМС 456-789-012',
      bloodType: 'AB(IV) Rh-',
      allergies: ['Пенициллин'],
      emergencyContact: '+7 (919) 432-10-98 (сестра)',
      medicalHistory: 'Аппендэктомия',
      currentTreatment: 'Антибиотики, анальгетики, перевязки',
      notes: 'Наблюдение за послеоперационной раной'
    }
  },
  {
    id: 5,
    name: 'Николаев Дмитрий Владимирович',
    initials: 'НД',
    age: 55,
    gender: 'male',
    status: 'stable',
    diagnosis: 'Сахарный диабет 2 типа',
    department: 'Терапия',
    doctor: 'Орлова С.М.',
    room: '205-В',
    admissionDate: '2024-01-08',
    lastCheckup: 'Вчера, 16:00',
    nextAppointment: 'Через 3 дня, 14:00',
    medications: 3,
    progress: 92,
    color: '#10B981',
    tags: ['Диабет', 'Инсулин', 'Диета', 'Контроль'],
    details: {
      phone: '+7 (920) 567-89-01',
      address: 'ул. Гагарина, д. 45, кв. 12',
      birthDate: '15.08.1969',
      insurance: 'ОМС 567-890-123',
      bloodType: 'A(II) Rh+',
      allergies: [],
      emergencyContact: '+7 (921) 345-67-89 (жена)',
      medicalHistory: 'Диабет 5 лет, гипертония',
      currentTreatment: 'Инсулинотерапия, диета, контроль глюкозы',
      notes: 'Стабильное состояние, соблюдает диету'
    }
  },
  {
    id: 6,
    name: 'Федорова Елена Викторовна',
    initials: 'ФЕ',
    age: 38,
    gender: 'female',
    status: 'recovering',
    diagnosis: 'Острый бронхит',
    department: 'Терапия',
    doctor: 'Морозов П.К.',
    room: '301-А',
    admissionDate: '2024-01-13',
    lastCheckup: 'Сегодня, 11:00',
    nextAppointment: 'Завтра, 10:00',
    medications: 4,
    progress: 78,
    color: '#F59E0B',
    tags: ['Бронхит', 'Антибиотики', 'Ингаляции', 'Физиотерапия'],
    details: {
      phone: '+7 (921) 678-90-12',
      address: 'пр. Космонавтов, д. 78, кв. 34',
      birthDate: '22.04.1986',
      insurance: 'ДМС 678-901-234',
      bloodType: 'B(III) Rh+',
      allergies: ['Пенициллин'],
      emergencyContact: '+7 (922) 456-78-90 (муж)',
      medicalHistory: 'Частые бронхиты',
      currentTreatment: 'Антибиотики, бронхолитики, ингаляции',
      notes: 'Состояние улучшается, сохраняется кашель'
    }
  }
];

const patientMetrics = [
  { category: 'Всего пациентов', value: '1,247', trend: 'up', color: '#3B82F6', icon: '🏥', change: '+2.3%' },
  { category: 'В критическом состоянии', value: '48', trend: 'down', color: '#EF4444', icon: '🚨', change: '-0.4%' },
  { category: 'Свободных коек', value: '187', trend: 'stable', color: '#10B981', icon: '🛏️', change: '+0.1%' },
  { category: 'Новых за сутки', value: '34', trend: 'up', color: '#8B5CF6', icon: '🆕', change: '+5.2%' },
  { category: 'Средняя занятость', value: '85%', trend: 'up', color: '#F59E0B', icon: '📊', change: '+1.8%' },
  { category: 'Выписано за месяц', value: '456', trend: 'up', color: '#06B6D4', icon: '✅', change: '+3.7%' }
];

const departmentDistribution = [
  { name: 'Кардиология', value: 28, color: `rgba(${MEDICAL_COLORS.medicalRed}, 0.9)` },
  { name: 'Неврология', value: 20, color: `rgba(${MEDICAL_COLORS.medicalPurple}, 0.9)` },
  { name: 'Хирургия', value: 25, color: `rgba(${MEDICAL_COLORS.medicalTeal}, 0.9)` },
  { name: 'Терапия', value: 15, color: `rgba(${MEDICAL_COLORS.medicalBlue}, 0.9)` },
  { name: 'Педиатрия', value: 8, color: `rgba(${MEDICAL_COLORS.medicalGreen}, 0.9)` },
  { name: 'Другие отделения', value: 4, color: `rgba(${MEDICAL_COLORS.medicalAmber}, 0.9)` }
];

// Хук блокировки скролла
const useScrollLock = () => {
  const lockScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  return { lockScroll, unlockScroll };
};

// Основной компонент
export default function PatientsCatalog() {
  const device = useResponsive();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
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
    const anyModalOpen = isPatientModalOpen || isAddPatientModalOpen || isAnalyticsModalOpen || isReportModalOpen;
    if (anyModalOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [isPatientModalOpen, isAddPatientModalOpen, isAnalyticsModalOpen, isReportModalOpen, lockScroll, unlockScroll]);

  // Закрытие модалок по Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPatientModalOpen(false);
        setIsAddPatientModalOpen(false);
        setIsAnalyticsModalOpen(false);
        setIsReportModalOpen(false);
        setSelectedPatient(null);
      }
    };
    if (isPatientModalOpen || isAddPatientModalOpen || isAnalyticsModalOpen || isReportModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPatientModalOpen, isAddPatientModalOpen, isAnalyticsModalOpen, isReportModalOpen]);

  const handleDepartmentClick = (departmentId: string) => {
    setSelectedDepartment(departmentId);
  };

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  const closePatientModal = () => {
    setIsPatientModalOpen(false);
    setSelectedPatient(null);
  };

  // Фильтрация пациентов
  const filteredPatients = patientsData.filter(patient => {
    const matchesDepartment = selectedDepartment === 'all' || 
      (selectedDepartment === 'cardiology' && patient.department.includes('Кардиология')) ||
      (selectedDepartment === 'neurology' && patient.department.includes('Неврология')) ||
      (selectedDepartment === 'surgery' && patient.department.includes('Хирургия'));

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query ||
      patient.name.toLowerCase().includes(query) ||
      patient.diagnosis.toLowerCase().includes(query) ||
      patient.department.toLowerCase().includes(query) ||
      patient.tags.some((tag: string) => tag.toLowerCase().includes(query));

    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;

    return matchesDepartment && matchesSearch && matchesStatus;
  });

  const selectedDepartmentData = departments.find(dept => dept.id === selectedDepartment);

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
    <div className={`min-h-screen bg-gradient-to-br ${MEDICAL_COLORS.primary}`}>
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
                    🏥
                  </motion.span>
                  <span className="gradient-text">Медицинская база пациентов</span>
                </motion.h1>
                <motion.p
                  className="text-white/65 text-sm sm:text-base md:text-[15px] mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 }}
                >
                  <span className="text-emerald-400 font-medium">1,247 пациентов под наблюдением</span> • 8 отделений
                  • <span className="text-cyan-400 font-medium">85% занятость коек</span>
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-2 sm:gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                >
                  {[
                    { color: 'bg-emerald-400', text: '1,124 стабильных пациентов' },
                    { color: 'bg-red-400', text: '48 в критическом состоянии' },
                    { color: 'bg-cyan-400', text: '187 свободных коек' }
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
                  className="inline-flex items-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg shadow-cyan-500/25 backdrop-blur-sm"
                  whileHover={{ scale: 1.03, y: -1 }}
                >
                  <span className="text-xs text-cyan-50/80 mr-2 hidden sm:inline">Статус системы</span>
                  <span className="text-sm sm:text-base font-semibold text-white">Активна</span>
                </motion.div>
                <div className="text-white/60 text-[11px] sm:text-xs mt-1">
                  Автообновление каждые 5 мин • Сегодня
                </div>
              </motion.div>
            </div>
            <div className="pointer-events-none absolute top-[-40px] right-[-40px] w-28 h-28 sm:w-40 sm:h-40 bg-cyan-500/16 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-40px] left-[-40px] w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/18 rounded-full blur-3xl" />
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
            {patientMetrics.map((metric, index) => (
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

        {/* Отделения */}
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
            Медицинские отделения
          </h3>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {departments.map((department, index) => (
              <DepartmentCard
                key={department.id}
                department={department}
                isSelected={selectedDepartment === department.id}
                onClick={() => handleDepartmentClick(department.id)}
                index={index}
              />
            ))}
          </div>
        </motion.section>

        {/* Аналитика выбранного отделения */}
        {selectedDepartment && selectedDepartmentData && (
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
                    Статистика отделения: {selectedDepartmentData.title}
                  </h3>
                  
                  <div className={`grid ${isMobile ? 'grid-cols-2' : 'sm:grid-cols-4'} gap-3 mb-4`}>
                    {[
                      { label: 'Свободные койки', value: `${selectedDepartmentData.details.availableBeds} / ${selectedDepartmentData.details.totalBeds}`, color: 'text-white' },
                      { label: 'Врачей в отделении', value: selectedDepartmentData.details.doctorsCount, color: 'text-emerald-400' },
                      { label: 'Среднее время пребывания', value: `${selectedDepartmentData.details.avgStay} дн.`, color: 'text-white' },
                      { label: 'Успешность лечения', value: `${selectedDepartmentData.details.successRate}%`, color: 'text-white' }
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
                      value={selectedDepartmentData.avgRecovery}
                      label="Успешность лечения"
                      color={`rgb(${selectedDepartmentData.glowColor})`}
                      showLabel
                    />
                    <ProgressBar
                      value={selectedDepartmentData.occupancy}
                      label="Занятость коек"
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
                    data={departmentDistribution}
                    size={isMobile ? 100 : 120}
                    className="mb-3"
                  />
                  <div className="text-center">
                    <div className="text-white font-semibold text-sm">Распределение по отделениям</div>
                    <div className="text-white/60 text-xs">Всего {selectedDepartmentData.patientsCount} чел.</div>
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
            onAddPatient={() => setIsAddPatientModalOpen(true)}
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
                {selectedDepartmentData?.title || 'Все пациенты'} 
                <span className="text-white/60 ml-2 text-sm font-normal">
                  ({filteredPatients.length} из {patientsData.length})
                </span>
              </h3>
              <div className="text-white/60 text-sm mt-1">
                {filteredPatients.length === patientsData.length 
                  ? 'Все пациенты' 
                  : `Найдено по запросу: "${searchTerm}"`}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-white/60 text-sm hidden sm:block">
                Сортировка: <span className="text-white">По дате поступления</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Список пациентов */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          layout
        >
          {filteredPatients.length === 0 ? (
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
              <div className="text-white font-semibold text-lg mb-2">Пациенты не найдены</div>
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
              {filteredPatients.map((patient, index) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  index={index}
                  onPatientClick={handlePatientClick}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Пагинация */}
        {filteredPatients.length > 0 && (
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
        {isPatientModalOpen && selectedPatient && (
          <PatientModal
            patient={selectedPatient}
            onClose={closePatientModal}
          />
        )}
      </AnimatePresence>

      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
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