// src/app/demo/logistics/page.tsx
'use client';

import React, { useEffect, useMemo, useReducer, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

// Импортируем иконки для логистики
import {
  Truck, Package, MapPin, Clock, Zap, Shield, Users, UserCheck, BarChart3,
  ArrowRight, Play, X, CheckCircle2, Heart, Wrench, Monitor, MessageSquareMore,
  Mail, Phone, Building2, Home, Sparkles, Cog, GitBranch, Star, Smile, TrendingUp,
  ShieldCheck, Layers, Activity, ArrowUpRight, Menu, Github, Twitter, Linkedin,
  Calendar, Award, FileText, Server, GitMerge, Eye, Search, Filter, Settings,
  Download, Upload, Share2, ThumbsUp, MessageCircle, Video, Image, Camera,
  CreditCard, ShoppingCart, Wallet, Coins, PieChart, LineChart, Target, UserPlus,
  UserX, Send, Archive, Folder, File, FolderOpen, Cloud, Database, Cpu, Globe,
  Smartphone, Rocket, Brain, Bot, Workflow, Palette, Code2, CloudRain, Sun,
  Battery, BatteryCharging, Power, RefreshCw, Lock, Unlock, Key, Navigation,
  Compass, Car, Train, Ship, Plane, Bike, Navigation2, Gauge, Fuel, Hammer,
  Ruler, Scale, Box, Cube, Footprints, Timer, History, Bell, AlertTriangle,
  Info, HelpCircle, Radio, Tv, Gamepad, Flask, Microscope, Telescope, Router,
  Hub, Cctv, Speaker, Grid, Layout, ChevronLeft, ChevronRight, ChevronUp,
  ChevronDown, MoreHorizontal, MoreVertical, Plus, Minus, RotateCcw,
  Volume2, Wifi, Bluetooth, Scan, QrCode, Fingerprint, CloudSnow, Wind,
  Banknote, Camera as CameraIcon
} from 'lucide-react';

// Создаем псевдонимы для конфликтующих иконок
const CloudIcon = Cloud;
const LogisticsIcon = Truck;
const RouteIcon = Navigation2;
const WarehouseIcon = Building2;

/* ============================================================================
   CONSTANTS AND CONFIGURATION
============================================================================ */
const LOGISTICS_CONFIG = {
  company: {
    name: 'Логистическая платформа',
    email: 'info@logistics-platform.dev',
    phone: '+7 (000) 000-00-00',
    demo: true,
    founded: 2019,
    teamSize: 25,
    address: 'Москва, ул. Логистическая, 15'
  },
  features: {
    particleCount: 30,
    animationDuration: 2000,
    kpiUpdateInterval: 3000,
    autoSaveInterval: 30000
  },
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    large: 1280
  },
  api: {
    baseUrl: 'https://api.logistics-platform.dev/v1',
    timeout: 10000,
    retries: 3
  },
  stats: [
    { value: '15,847', label: 'Ежедневных доставок', icon: Package },
    { value: '2,524', label: 'Активных курьеров', icon: Users },
    { value: '98.2%', label: 'Успешных доставок', icon: Star },
    { value: '2.3ч', label: 'Среднее время доставки', icon: Clock }
  ]
} as const;

const COLOR_PALETTE = {
  primary: {
    blue: 'rgba(59, 130, 246, 0.15)',
    cyan: 'rgba(6, 182, 212, 0.1)',
    emerald: 'rgba(16, 185, 129, 0.1)',
    amber: 'rgba(245, 158, 11, 0.1)',
    orange: 'rgba(249, 115, 22, 0.1)',
    teal: 'rgba(20, 184, 166, 0.1)'
  },
  gradients: {
    hero: 'from-blue-400 via-cyan-400 to-emerald-400',
    cta: 'from-blue-500 to-cyan-500',
    success: 'from-emerald-500 to-green-500',
    warning: 'from-amber-500 to-orange-500',
    error: 'from-red-500 to-rose-500'
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  }
} as const;

const ACCESSIBILITY = {
  focus: {
    outline: '2px solid #3B82F6',
    offset: '2px'
  },
  reducedMotion: {
    duration: 0.01,
    ease: 'linear'
  }
} as const;

/* ============================================================================
   CUSTOM HOOKS
============================================================================ */
function useMousePosition() {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

function useKpiAnimation(initialKpis: KPI[]) {
  const [kpis, setKpis] = useState<KPI[]>(initialKpis);

  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(prev => prev.map(kpi => {
        const variation = (Math.random() - 0.5) * (kpi.label.includes('Доставок') ? 20 : 0.3);
        const newValue = Math.max(0, kpi.value + variation);
        const trend = variation > 0 ? 'up' : variation < 0 ? 'down' : 'stable';
        
        return {
          ...kpi,
          value: Number(newValue.toFixed(kpi.suffix ? 1 : 0)),
          delta: Math.abs(variation),
          trend
        };
      }));
    }, LOGISTICS_CONFIG.features.kpiUpdateInterval);

    return () => clearInterval(interval);
  }, []);

  return kpis;
}

function useViewportDetection() {
  const [viewport, setViewport] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLarge: false
  });

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setViewport({
        isMobile: width < LOGISTICS_CONFIG.breakpoints.mobile,
        isTablet: width >= LOGISTICS_CONFIG.breakpoints.mobile && width < LOGISTICS_CONFIG.breakpoints.desktop,
        isDesktop: width >= LOGISTICS_CONFIG.breakpoints.desktop && width < LOGISTICS_CONFIG.breakpoints.large,
        isLarge: width >= LOGISTICS_CONFIG.breakpoints.large
      });
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return viewport;
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prevValue => {
      try {
        const valueToStore = value instanceof Function ? value(prevValue) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
        return prevValue;
      }
    });
  }, [key]);

  return [storedValue, setValue] as const;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/* ============================================================================
   SPOTLIGHT CARD COMPONENT
============================================================================ */
interface Position {
  x: number;
  y: number;
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
  intensity?: number;
  enableHover?: boolean;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = COLOR_PALETTE.primary.blue,
  intensity = 0.15,
  enableHover = true
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);
  const reducedMotion = useReducedMotion();

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(e => {
    if (!divRef.current || isFocused || !enableHover) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [isFocused, enableHover]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setOpacity(0.4);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setOpacity(0);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (enableHover) {
      setOpacity(intensity);
    }
  }, [intensity, enableHover]);

  const handleMouseLeave = useCallback(() => {
    if (enableHover) {
      setOpacity(0);
    }
  }, [enableHover]);

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 overflow-hidden backdrop-blur transition-all duration-300 ${
        enableHover ? 'hover:border-white/20' : ''
      } ${className}`}
      whileHover={enableHover && !reducedMotion ? { scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
        }}
      />
      {children}
    </motion.div>
  );
};

/* ============================================================================
   TYPES AND INTERFACES
============================================================================ */
type RoleId = 'user' | 'manager' | 'owner';

type ModalState =
  | { type: 'idle' }
  | { type: 'role'; payload: RoleCard }
  | { type: 'feature'; payload: Feature }
  | { type: 'contact' }
  | { type: 'success' }
  | { type: 'mobileMenu' }
  | { type: 'caseStudy'; payload: CaseStudy }
  | { type: 'teamMember'; payload: TeamMember }
  | { type: 'video'; payload: { url: string; title: string } };

type Action =
  | { type: 'OPEN_ROLE'; payload: RoleCard }
  | { type: 'OPEN_FEATURE'; payload: Feature }
  | { type: 'OPEN_CONTACT' }
  | { type: 'SUBMIT_CONTACT' }
  | { type: 'CLOSE' }
  | { type: 'SUCCESS' }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'OPEN_CASE_STUDY'; payload: CaseStudy }
  | { type: 'OPEN_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'OPEN_VIDEO'; payload: { url: string; title: string } };

type KPI = { 
  label: string; 
  value: number; 
  suffix?: string; 
  delta?: number; 
  icon: React.ElementType;
  trend: 'up' | 'down' | 'stable';
  description?: string;
  format?: 'number' | 'currency' | 'percentage';
};

type RoleCard = {
  id: RoleId;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  points: string[];
  tech: string[];
  benefits: string[];
  gradient: string;
  stats: { label: string; value: string; icon: React.ElementType }[];
  features: { title: string; description: string; icon: React.ElementType }[];
  path: string;
  badge?: string;
  metrics: { metric: string; value: string; improvement: string }[];
  demoVideo?: string;
  accessLevel: 'basic' | 'standard' | 'premium' | 'enterprise';
  trainingTime: string;
};

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  tech: string[];
  scenarios: string[];
  stats: { value: string; label: string; icon: React.ElementType }[];
  benchmarks: string[];
  documentation?: string;
  status: 'stable' | 'beta' | 'alpha' | 'planned';
  releaseDate?: string;
};

type CaseStudy = {
  id: string;
  title: string;
  client: string;
  industry: string;
  duration: string;
  challenge: string;
  solution: string;
  results: { metric: string; before: string; after: string; improvement: string }[];
  technologies: string[];
  testimonial: { text: string; author: string; position: string; avatar?: string; rating: number };
  budget?: string;
  teamSize?: string;
  roi?: string;
  implementationHighlights: string[];
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  avatar: string;
  experience: string;
  projects: number;
  tech: string[];
  bio?: string;
  education?: string[];
  certifications?: string[];
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  joinDate: string;
  specialization: string[];
};

/* ============================================================================
   STATE MANAGEMENT
============================================================================ */
function modalReducer(state: ModalState, action: Action): ModalState {
  switch (action.type) {
    case 'OPEN_ROLE':   return { type: 'role',  payload: action.payload };
    case 'OPEN_FEATURE':  return { type: 'feature', payload: action.payload };
    case 'OPEN_CONTACT':   return { type: 'contact' };
    case 'SUBMIT_CONTACT': return { type: 'success' };
    case 'SUCCESS':        return { type: 'success' };
    case 'TOGGLE_MOBILE_MENU': return state.type === 'mobileMenu' ? { type: 'idle' } : { type: 'mobileMenu' };
    case 'OPEN_CASE_STUDY': return { type: 'caseStudy', payload: action.payload };
    case 'OPEN_TEAM_MEMBER': return { type: 'teamMember', payload: action.payload };
    case 'OPEN_VIDEO': return { type: 'video', payload: action.payload };
    case 'CLOSE':          return { type: 'idle' };
    default:               return state;
  }
}

/* ============================================================================
   LOGISTICS-SPECIFIC DATA
============================================================================ */
const logisticsTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Андрей Волков',
    role: 'Lead Logistics Developer',
    expertise: ['Route Optimization', 'Real-time Tracking', 'Fleet Management', 'AWS', 'System Architecture'],
    avatar: '👨‍💻',
    experience: '9+ лет',
    projects: 52,
    tech: ['Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Redis', 'WebSocket', 'Docker', 'AWS', 'Mapbox', 'GraphQL'],
    bio: 'Специализируется на создании масштабируемых логистических систем с фокусом на оптимизацию маршрутов и реальное время отслеживания. Руководил разработкой 15+ enterprise-проектов в логистике.',
    education: ['МГТУ им. Баумана, Компьютерные науки', 'MIT Supply Chain Management'],
    certifications: ['AWS Solutions Architect', 'Google Cloud Professional', 'Scrum Master'],
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#',
      portfolio: '#'
    },
    joinDate: '2019-05-15',
    specialization: ['Route Optimization', 'Real-time Systems', 'Cloud Infrastructure']
  },
  {
    id: '2',
    name: 'Ольга Семенова',
    role: 'Senior Logistics Analyst',
    expertise: ['Data Analysis', 'Supply Chain', 'KPI Optimization', 'Business Intelligence', 'Process Automation'],
    avatar: '👩‍💼',
    experience: '7+ лет',
    projects: 38,
    tech: ['Python', 'SQL', 'Tableau', 'Power BI', 'Apache Spark', 'Jupyter', 'Pandas', 'Scikit-learn'],
    bio: 'Эксперт по анализу логистических процессов и оптимизации цепочек поставок. Специализируется на создании систем бизнес-аналитики для логистических компаний.',
    education: ['ВШЭ, Логистика и SCM', 'Data Science Specialization'],
    certifications: ['Six Sigma Black Belt', 'Supply Chain Professional', 'Data Analyst'],
    social: {
      linkedin: '#',
      portfolio: '#'
    },
    joinDate: '2020-02-20',
    specialization: ['Data Analysis', 'Process Optimization', 'Business Intelligence']
  },
  {
    id: '3',
    name: 'Денис Морозов',
    role: 'DevOps Engineer',
    expertise: ['Kubernetes', 'CI/CD', 'Monitoring', 'Cloud Infrastructure', 'Security'],
    avatar: '👨‍🔧',
    experience: '6+ лет',
    projects: 31,
    tech: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Grafana', 'Prometheus', 'Ansible', 'Jenkins'],
    bio: 'Эксперт по развертыванию и поддержке высокодоступных cloud-инфраструктур для логистических систем. Специализируется на автоматизации процессов и обеспечении безопасности.',
    education: ['МФТИ, Прикладная математика'],
    certifications: ['CKA', 'AWS DevOps Engineer', 'Terraform Associate'],
    social: {
      linkedin: '#',
      github: '#'
    },
    joinDate: '2019-11-10',
    specialization: ['Cloud Infrastructure', 'CI/CD', 'Monitoring']
  },
  {
    id: '4',
    name: 'Ирина Ковалева',
    role: 'Product Manager',
    expertise: ['Product Strategy', 'Logistics Processes', 'User Research', 'Roadmapping', 'Analytics'],
    avatar: '👩‍🎨',
    experience: '8+ лет',
    projects: 45,
    tech: ['Jira', 'Confluence', 'Amplitude', 'Mixpanel', 'Google Analytics'],
    bio: 'Управляет продуктом от идеи до реализации в логистической сфере. Глубокое понимание процессов доставки и складской логистики.',
    education: ['МГУ, Менеджмент', 'Product School Certification'],
    certifications: ['PMP', 'SAFe Practitioner'],
    social: {
      linkedin: '#',
      portfolio: '#'
    },
    joinDate: '2019-08-01',
    specialization: ['Product Strategy', 'Logistics Processes', 'Team Leadership']
  }
];

const logisticsCaseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Оптимизация городской доставки',
    client: 'Курьерская служба "Быстрая доставка"',
    industry: 'Курьерские услуги',
    duration: '4 месяца',
    challenge: 'Высокие затраты на топливо, неоптимальные маршруты, задержки доставки, низкая прозрачность для клиентов, высокая нагрузка на диспетчеров',
    solution: 'Внедрена система AI-маршрутизации с мобильным приложением для курьеров с реальным отслеживанием и автоматическим распределением заказов',
    results: [
      { metric: 'Пробег автомобилей', before: '180км/день', after: '135км/день', improvement: '-25%' },
      { metric: 'Время доставки', before: '4.5ч', after: '3.2ч', improvement: '-29%' },
      { metric: 'Затраты на топливо', before: '45K ₽/мес', after: '32K ₽/мес', improvement: '-29%' },
      { metric: 'Количество доставок', before: '25/курьер', after: '35/курьер', improvement: '+40%' },
      { metric: 'Удовлетворенность клиентов', before: '72%', after: '94%', improvement: '+31%' }
    ],
    technologies: ['React Native', 'Next.js', 'PostgreSQL', 'Redis', 'WebSocket', 'Mapbox', 'AI Routing', 'Node.js'],
    testimonial: {
      text: 'AI-маршрутизация полностью изменила нашу работу. Курьеры теперь успевают сделать на 40% больше доставок с меньшим пробегом. Клиенты в восторге от точного времени прибытия.',
      author: 'Сергей Петров',
      position: 'Директор службы доставки',
      avatar: '👨‍💼',
      rating: 5
    },
    budget: '1.8M ₽',
    teamSize: '4 специалиста',
    roi: '280% за первый год',
    implementationHighlights: [
      'Интеграция с навигационными системами',
      'Обучение 80+ курьеров',
      'Миграция данных без простоя',
      'Круглосуточная поддержка'
    ]
  },
  {
    id: '2',
    title: 'Автоматизация складской логистики',
    client: 'Складской комплекс "Москва-Логистик"',
    industry: 'Складские услуги',
    duration: '6 месяцев',
    challenge: 'Ручной учет товаров, ошибки при комплектации, длительное время отбора заказов, отсутствие реальной картины остатков, высокие затраты на персонал',
    solution: 'Разработана система управления складом с мобильными терминалами для кладовщиков, системой штрих-кодирования и AI-алгоритмами оптимизации зон хранения',
    results: [
      { metric: 'Точность инвентаризации', before: '87%', after: '99.8%', improvement: '+15%' },
      { metric: 'Время комплектации заказа', before: '45мин', after: '18мин', improvement: '-60%' },
      { metric: 'Производительность персонала', before: '65%', after: '92%', improvement: '+42%' },
      { metric: 'Ошибки при отборе', before: '8%', after: '0.5%', improvement: '-94%' },
      { metric: 'Затраты на персонал', before: '100%', after: '70%', improvement: '-30%' }
    ],
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'Redis', 'WebSocket', 'QR Code', 'Python', 'Docker'],
    testimonial: {
      text: 'Система позволила нам обрабатывать в 2 раза больше заказов с тем же персоналом. Точность учета приблизилась к 100%, а клиенты получают заказы быстрее.',
      author: 'Мария Иванова',
      position: 'Директор склада',
      avatar: '👩‍💼',
      rating: 5
    },
    budget: '3.2M ₽',
    teamSize: '6 специалистов',
    roi: '220% за 18 месяцев',
    implementationHighlights: [
      'Внедрение системы штрих-кодирования',
      'Обучение 120+ сотрудников',
      'Интеграция с WMS системой',
      'Разработка мобильного приложения'
    ]
  }
];

const logisticsRoleCards: RoleCard[] = [
  {
    id: 'user',
    title: 'Курьер',
    subtitle: 'Мобильное приложение для курьеров',
    icon: Truck,
    description: 'Умное мобильное приложение с AI-оптимизацией маршрутов, сканированием посылок и реальным временем отслеживания. Поддержка оффлайн-режима и интеграция с навигационными системами.',
    points: [
      'AI-оптимизация маршрутов с учетом пробок и приоритетов с автоматическим перестроением',
      'Сканирование QR-кодов и штрих-кодов посылок с автоматической сверкой',
      'Навигация с пошаговыми инструкциями и временем прибытия с учетом дорожной ситуации',
      'Фото-подтверждение доставки с геолокацией и временными метками',
      'Чат с клиентами и диспетчерами с поддержкой файлов и голосовых сообщений',
      'Электронная подпись и документооборот с автоматической синхронизацией',
      'Управление задачами на день с умными уведомлениями и напоминаниями',
      'Отслеживание рабочего времени и пробега с автоматической отчетностью',
      'Система рейтингов и отзывов с мотивационными бонусами',
      'Оффлайн-режим с последующей синхронизацией при подключении'
    ],
    tech: ['React Native', 'PWA', 'WebSocket', 'Cache API', 'Push Notifications', 'Mapbox', 'QR Scanner', 'IndexedDB'],
    benefits: [
      'Снижение пробега на 25% с AI-маршрутизацией',
      'Увеличение количества доставок на 40% за счет оптимизации',
      'Простой и интуитивный интерфейс с поддержкой accessibility',
      'Работа в оффлайн-режиме при плохом соединении',
      'Автоматическая отчетность и учет рабочего времени',
      'Интеграция с популярными навигационными приложениями'
    ],
    gradient: 'from-blue-500 to-cyan-500',
    stats: [
      { label: 'Активных курьеров', value: '2.5K+', icon: Users },
      { label: 'Эффективность', value: '+40%', icon: TrendingUp },
      { label: 'Средний рейтинг', value: '4.8/5', icon: Star },
      { label: 'Онлайн-отслеживание', value: '99%', icon: Clock }
    ],
    features: [
      { title: 'AI-Маршрутизация', description: 'Интеллектуальная оптимизация маршрутов с учетом пробок, приоритетов доставки и ограничений ТС', icon: RouteIcon },
      { title: 'Мобильное сканирование', description: 'Сканирование QR-кодов и штрих-кодов с автоматической проверкой и подтверждением', icon: Scan },
      { title: 'Реальное время', description: 'Точное отслеживание местоположения с прогнозированием времени прибытия', icon: Clock },
      { title: 'Оффлайн-работа', description: 'Полная функциональность без интернета с автоматической синхронизацией', icon: Wifi }
    ],
    path: '/demo/logistics/user',
    badge: 'Popular',
    metrics: [
      { metric: 'Оптимизация пробега', value: '25%', improvement: 'AI-маршруты' },
      { metric: 'Увеличение доставок', value: '40%', improvement: 'За счет оптимизации' },
      { metric: 'Точность ETA', value: '95%', improvement: 'Реальное время' },
      { metric: 'Удовлетворенность', value: '94%', improvement: '+22%' }
    ],
    demoVideo: '/demos/courier-demo.mp4',
    accessLevel: 'basic',
    trainingTime: '30 минут'
  },
  {
    id: 'manager',
    title: 'Менеджер логистики',
    subtitle: 'Панель управления доставками',
    icon: Users,
    description: 'Мощная панель управления для координации курьеров, управления доставками и складскими операциями. Реальное время отслеживания, аналитика и автоматическое распределение задач.',
    points: [
      'Управление парком курьеров и транспортных средств с мониторингом в реальном времени',
      'Автоматическое распределение заказов с учетом загрузки и специализации курьеров',
      'Мониторинг KPI и метрик эффективности с дашбордами и аналитикой',
      'Управление складскими операциями и инвентаризацией с системой штрих-кодирования',
      'Обработка исключений и проблемных доставок с системой эскалации',
      'Коммуникация с курьерами и клиентами через единый чат с историей',
      'Планирование маршрутов и графиков доставки с оптимизацией ресурсов',
      'Управление возвратами и отказами с автоматическим учетом',
      'Аналитика эффективности работы с рекомендациями по улучшению',
      'Интеграция с внешними системами и API партнеров'
    ],
    tech: ['React', 'Redux', 'WebRTC', 'IndexedDB', 'WebSocket', 'Mapbox', 'Chart.js', 'TensorFlow.js'],
    benefits: [
      'Автоматизация 75% рутинных задач с AI-помощником',
      'Единое рабочее пространство со всеми инструментами управления',
      'Аналитика в реальном времени с предиктивными инсайтами',
      'Снижение времени на администрирование на 60%',
      'Интеграция с внешними системами через API',
      'Мобильная работа с синхронизацией в реальном времени'
    ],
    gradient: 'from-green-500 to-emerald-500',
    stats: [
      { label: 'Активных менеджеров', value: '150+', icon: UserCheck },
      { label: 'Эффективность', value: '+35%', icon: TrendingUp },
      { label: 'Обработано заказов', value: '1.2M+', icon: CheckCircle2 },
      { label: 'Автоматизация', value: '75%', icon: Zap }
    ],
    features: [
      { title: 'Дашборд аналитики', description: 'Визуализация ключевых метрик логистики в реальном времени с AI-инсайтами и прогнозами', icon: BarChart3 },
      { title: 'Управление парком', description: 'Мониторинг местоположения, состояния ТС и загрузки курьеров с умными оповещениями', icon: Truck },
      { title: 'Складской модуль', description: 'Управление складскими операциями, инвентаризацией и зонами хранения', icon: WarehouseIcon },
      { title: 'AI-распределение', description: 'Автоматическое распределение заказов с учетом оптимизации маршрутов и загрузки', icon: Brain }
    ],
    path: '/demo/logistics/manager',
    badge: 'Professional',
    metrics: [
      { metric: 'Эффективность менеджеров', value: '+35%', improvement: 'Автоматизация' },
      { metric: 'Время обработки заказа', value: '3 минуты', improvement: '-70%' },
      { metric: 'Точность планирования', value: '92%', improvement: '+27%' },
      { metric: 'Снижение ошибок', value: '85%', improvement: 'AI-контроль' }
    ],
    demoVideo: '/demos/manager-demo.mp4',
    accessLevel: 'standard',
    trainingTime: '2 часа'
  },
  {
    id: 'owner',
    title: 'Владелец бизнеса',
    subtitle: 'Система бизнес-аналитики',
    icon: BarChart3,
    description: 'Комплексная система бизнес-аналитики для принятия стратегических решений и управления логистическим бизнесом. Финансовая аналитика, KPI, прогнозирование и автоматическая отчетность.',
    points: [
      'Финансовая аналитика и контроль затрат в реальном времени с AI-прогнозами',
      'Управление KPI и метриками эффективности по всем направлениям бизнеса',
      'Стратегическое планирование и бюджетирование с AI-прогнозированием',
      'Мониторинг рентабельности и ключевых финансовых показателей с бенчмаркингом',
      'Управление персоналом и ресурсами с прогнозированием потребностей',
      'AI-прогнозирование спроса и оптимизация загрузки мощностей с учетом сезонности',
      'Автоматическая генерация отчетов для инвесторов и регуляторов по шаблонам',
      'Управление рисками и предиктивная аналитика с рекомендациями',
      'Мульти-компанейское управление с консолидированной отчетностью',
      'Бенчмаркинг с отраслевыми показателями и лучшими практиками'
    ],
    tech: ['TypeScript', 'GraphQL', 'D3.js', 'Machine Learning', 'Python', 'Apache ECharts', 'TensorFlow', 'FastAPI'],
    benefits: [
      'Полная прозрачность бизнес-процессов и финансовых показателей в реальном времени',
      'Data-driven принятие решений с AI-рекомендациями и прогнозами',
      'Автоматическая отчетность для инвесторов с гарантией compliance',
      'Масштабируемая архитектура для роста бизнеса и новых направлений',
      'AI-прогнозирование спроса и трендов с высокой точностью',
      'Снижение времени на стратегическое планирование на 50%'
    ],
    gradient: 'from-purple-500 to-indigo-500',
    stats: [
      { label: 'Компаний', value: '50+', icon: Building2 },
      { label: 'Рост эффективности', value: '+28%', icon: TrendingUp },
      { label: 'Автоматизация', value: '80%', icon: Zap },
      { label: 'ROI', value: '320%', icon: LineChart }
    ],
    features: [
      { title: 'BI-дашборды', description: 'Интерактивные панели с глубокой финансовой аналитикой и drill-down возможностями', icon: PieChart },
      { title: 'AI-прогнозирование', description: 'Прогнозирование спроса, финансовых показателей и рыночных трендов с доверительными интервалами', icon: Brain },
      { title: 'Мульти-компания', description: 'Управление несколькими юридическими лицами с консолидированной отчетностью', icon: GitBranch },
      { title: 'Авто-отчетность', description: 'Автоматическая генерация финансовых отчетов по установленным шаблонам и стандартам', icon: FileText }
    ],
    path: '/demo/logistics/owner',
    badge: 'Enterprise',
    metrics: [
      { metric: 'Рост прибыли', value: '+28%', improvement: 'За 6 месяцев' },
      { metric: 'Снижение затрат', value: '-22%', improvement: 'Оптимизация' },
      { metric: 'ROI системы', value: '320%', improvement: 'За первый год' },
      { metric: 'Время отчетности', value: '-85%', improvement: 'Автоматизация' }
    ],
    demoVideo: '/demos/owner-demo.mp4',
    accessLevel: 'premium',
    trainingTime: '4 часа'
  },
];

const logisticsFeatures: Feature[] = [
  {
    id: 'route-optimization',
    title: 'AI-Оптимизация маршрутов',
    description: 'Продвинутые алгоритмы машинного обучения для оптимизации маршрутов доставки с учетом пробок, приоритетов, ограничений ТС и погодных условий.',
    icon: RouteIcon,
    gradient: 'from-blue-500 to-cyan-500',
    tech: ['TensorFlow', 'PyTorch', 'OpenRouteService', 'Mapbox', 'OSRM', 'Python', 'Redis', 'WebSocket'],
    scenarios: [
      'Динамическая маршрутизация с учетом реальных пробок и дорожной ситуации',
      'Оптимизация многопостовых маршрутов с ограничениями по времени и емкости',
      'Прогнозирование времени доставки с учетом исторических данных и трендов',
      'Автоматическое перераспределение заказов при изменении условий',
      'Учет специфических требований (хрупкие грузы, температурный режим)',
      'Интеграция с навигационными системами и картографическими сервисами'
    ],
    stats: [
      { value: '25%', label: 'Снижение пробега', icon: TrendingUp },
      { value: '40%', label: 'Рост эффективности', icon: Zap },
      { value: '95%', label: 'Точность ETA', icon: Clock },
      { value: '99.9%', label: 'Надежность', icon: ShieldCheck }
    ],
    benchmarks: ['Оптимизация пробега: 25%+', 'Точность ETA: 95%+', 'Время расчета: <2с', 'Масштабируемость: 10K+ маршрутов'],
    documentation: '/docs/route-optimization',
    status: 'stable',
    releaseDate: '2024-01-20'
  },
  {
    id: 'real-time-tracking',
    title: 'Реальное время отслеживания',
    description: 'Система точного отслеживания местоположения курьеров и грузов в реальном времени с WebSocket и прогнозированием времени прибытия.',
    icon: MapPin,
    gradient: 'from-green-500 to-emerald-500',
    tech: ['WebSocket', 'Redis', 'Node.js', 'Mapbox', 'GPS', 'GIS', 'PostgreSQL', 'Docker'],
    scenarios: [
      'Точное отслеживание местоположения курьеров с частотой обновления 10 секунд',
      'Прогнозирование времени прибытия с учетом пробок и дорожных условий',
      'Геозоны и автоматические уведомления о приближении к точкам доставки',
      'История маршрутов и анализ эффективности перемещений',
      'Оффлайн-трекинг с последующей синхронизацией',
      'Интеграция с мобильными приложениями и навигационными системами'
    ],
    stats: [
      { value: '10сек', label: 'Частота обновления', icon: RefreshCw },
      { value: '99.9%', label: 'Доступность', icon: CloudIcon },
      { value: '<100м', label: 'Точность', icon: Target },
      { value: '1M+', label: 'Треков в день', icon: Database }
    ],
    benchmarks: ['Частота обновления: 10сек', 'Точность: <100м', 'Задержка данных: <5сек', 'Масштабируемость: 1M+ устройств'],
    documentation: '/docs/real-time-tracking',
    status: 'stable',
    releaseDate: '2024-01-15'
  }
];

/* ============================================================================
   ANIMATIONS
============================================================================ */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.8, 
    ease: [0.25, 0.46, 0.45, 0.94], 
    delay 
  },
  viewport: { once: true, margin: '-50px' },
});

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  viewport: { once: true }
};

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut", delay },
  viewport: { once: true }
});

const slideIn = {
  initial: { x: -100, opacity: 0 },
  whileInView: { x: 0, opacity: 1 },
  transition: { duration: 0.8, ease: "easeOut" },
  viewport: { once: true }
};

const spring = { 
  type: "spring", 
  stiffness: 300, 
  damping: 30 
};

const gentleBounce = {
  type: "spring",
  stiffness: 100,
  damping: 10
};

/* ============================================================================
   FIXED PARTICLE SYSTEM (No Randomness)
============================================================================ */
const FIXED_PARTICLES = [
  { size: 1.7, x: 77.4, y: 29.2, duration: 12, delay: 0 },
  { size: 3.2, x: 50.8, y: 98.3, duration: 15, delay: 1 },
  { size: 3.9, x: 89.2, y: 17.6, duration: 18, delay: 2 },
  { size: 3.5, x: 77.8, y: 10.7, duration: 14, delay: 3 },
  { size: 3.4, x: 48.0, y: 57.3, duration: 16, delay: 4 },
  { size: 1.7, x: 74.2, y: 62.7, duration: 13, delay: 5 },
  { size: 2.2, x: 50.8, y: 43.7, duration: 17, delay: 6 },
  { size: 2.3, x: 0.5, y: 35.4, duration: 11, delay: 7 },
  { size: 2.5, x: 13.7, y: 78.4, duration: 19, delay: 8 },
  { size: 2.9, x: 25.6, y: 33.5, duration: 14, delay: 9 },
  { size: 3.1, x: 19.7, y: 6.7, duration: 16, delay: 10 },
  { size: 2.7, x: 70.5, y: 36.1, duration: 12, delay: 11 },
  { size: 1.1, x: 64.3, y: 72.5, duration: 15, delay: 12 },
  { size: 2.5, x: 0.1, y: 4.5, duration: 18, delay: 13 },
  { size: 1.5, x: 86.6, y: 6.1, duration: 13, delay: 14 },
  { size: 3.6, x: 0.6, y: 53.4, duration: 17, delay: 15 },
  { size: 2.7, x: 94.3, y: 94.8, duration: 14, delay: 16 },
  { size: 2.6, x: 36.4, y: 9.3, duration: 16, delay: 17 },
  { size: 3.8, x: 30.6, y: 38.8, duration: 19, delay: 18 },
  { size: 3.6, x: 14.3, y: 59.1, duration: 15, delay: 19 },
  { size: 3.3, x: 69.0, y: 79.5, duration: 13, delay: 20 },
  { size: 1.3, x: 88.6, y: 50.5, duration: 17, delay: 21 },
  { size: 3.6, x: 94.2, y: 23.5, duration: 14, delay: 22 },
  { size: 3.5, x: 13.0, y: 53.1, duration: 16, delay: 23 },
  { size: 1.8, x: 37.8, y: 50.1, duration: 12, delay: 24 },
  { size: 2.3, x: 64.7, y: 25.0, duration: 18, delay: 25 },
  { size: 2.3, x: 47.7, y: 83.4, duration: 15, delay: 26 },
  { size: 1.4, x: 87.4, y: 28.6, duration: 13, delay: 27 },
  { size: 3.3, x: 28.3, y: 33.6, duration: 17, delay: 28 },
  { size: 3.0, x: 85.3, y: 2.6, duration: 14, delay: 29 }
];

/* ============================================================================
   BACKGROUND COMPONENTS
============================================================================ */
function InteractiveBackground({ mousePosition, scrollProgress }: { 
  mousePosition: { x: number; y: number }; 
  scrollProgress: number;
}) {
  const parallaxX = useTransform(() => mousePosition.x * 0.01);
  const parallaxY = useTransform(() => mousePosition.y * 0.01);
  const reducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* Animated Gradient */}
      <motion.div
        className="absolute inset-0 opacity-40 transition-opacity duration-1000"
        style={{
          x: reducedMotion ? 0 : parallaxX,
          y: reducedMotion ? 0 : parallaxY,
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              ${COLOR_PALETTE.primary.blue} 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
              ${COLOR_PALETTE.primary.cyan} 0%, transparent 50%),
            radial-gradient(circle at ${mousePosition.x}% ${100 - mousePosition.y}%, 
              ${COLOR_PALETTE.primary.emerald} 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Scan Line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        animate={{ y: `${scrollProgress * 10}vh` }}
        transition={{ type: "spring", damping: 30 }}
      />

      {/* Animated Orbs */}
      {!reducedMotion && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}
    </div>
  );
}

function FloatingParticles() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {FIXED_PARTICLES.map((particle, i) => (
          <div
            key={i}
            className="absolute bg-cyan-400/30 rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}vw`,
              top: `${particle.y}vh`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {FIXED_PARTICLES.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute bg-cyan-400/30 rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
          }}
          animate={{
            y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
            x: [`${particle.x}vw`, `${particle.x + 10}vw`, `${particle.x}vw`],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================================
   HEADER COMPONENT
============================================================================ */
function Header({ onMenuToggle, scrollProgress, onContact }: { 
  onMenuToggle: () => void; 
  scrollProgress: number;
  onContact: () => void;
}) {
  const headerOpacity = useTransform(() => Math.min(scrollProgress / 10, 1));
  const headerBlur = useTransform(() => Math.min(scrollProgress / 2, 10));
  const [isScrolled, setIsScrolled] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'Роли', href: '#roles', icon: Users },
    { name: 'Возможности', href: '#features', icon: Zap },
    { name: 'Кейсы', href: '#cases', icon: FileText },
    { name: 'Технологии', href: '#tech', icon: Code2 },
    { name: 'Команда', href: '#team', icon: Truck },
  ];

  return (
    <motion.header 
      style={{ 
        opacity: reducedMotion ? 1 : headerOpacity,
        backdropFilter: `blur(${reducedMotion ? 0 : headerBlur}px)`
      }}
      className={`fixed top-0 z-50 w-full px-4 sm:px-6 pt-4 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div 
          className={`flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl px-4 sm:px-6 transition-all duration-300 ${
            isScrolled ? 'py-3' : 'py-4'
          } shadow-2xl`}
          whileHover={{ 
            boxShadow: reducedMotion ? "0 0 40px rgba(0,0,0,0.3)" : "0 20px 40px rgba(0,0,0,0.3)",
            borderColor: "rgba(255,255,255,0.2)"
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
              className="relative"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Truck className="h-5 w-5 text-white" />
              </div>
              {!reducedMotion && (
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  animate={{ rotate: [0, 180] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {LOGISTICS_CONFIG.company.name}
              </span>
              {LOGISTICS_CONFIG.company.demo && (
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full hidden sm:inline-block">
                  Demo
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigationItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors font-medium relative group"
                whileHover={reducedMotion ? {} : { y: -2 }}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"
                  layoutId="navIndicator"
                />
              </motion.a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              onClick={onContact}
              className="hidden sm:flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/20 transition backdrop-blur"
            >
              <MessageSquareMore className="h-4 w-4" />
              <span className="hidden md:inline">Контакты</span>
            </motion.button>

            <motion.button
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}

/* ============================================================================
   HERO SECTION
============================================================================ */
function HeroSection({ kpis, onContact, isMobile, visitedSections }: { 
  kpis: KPI[]; 
  onContact: () => void;
  isMobile: boolean;
  visitedSections: string[];
}) {
  const hasVisited = visitedSections.includes('hero');
  
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative pt-20 pb-[140px] sm:pb-20 px-4 sm:px-6"
      style={{ paddingBottom: 'calc(8rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="mx-auto max-w-7xl w-full text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur text-sm text-white/80 mb-8"
        >
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" />
          Логистическая платформа 2024 • Enterprise Edition
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Логистическая
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              платформа
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed px-4 text-balance"
          >
            Инновационная система AI-маршрутизации, управления доставками и складской логистикой 
            для современных транспортных компаний и курьерских служб
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 sm:mb-20"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('/demo/logistics/user', '_blank')}
            className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-2xl w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-3 justify-center">
              <Rocket className="h-5 w-5" />
              Начать демонстрацию
            </span>
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#roles"
            className="group relative border-2 border-white/20 bg-white/5 backdrop-blur px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-3 justify-center">
              <Play className="h-5 w-5" />
              Исследовать роли
            </span>
          </motion.a>
        </motion.div>

        {/* KPI Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto px-4"
        >
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <kpi.icon className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
                  <motion.div
                    animate={{ 
                      rotate: kpi.trend === 'up' ? 0 : kpi.trend === 'down' ? 180 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp className={`h-4 w-4 ${
                      kpi.trend === 'up' ? 'text-emerald-400' : 
                      kpi.trend === 'down' ? 'text-rose-400' : 
                      'text-amber-400'
                    }`} />
                  </motion.div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {kpi.value}{kpi.suffix}
                </div>
                <div className="text-xs sm:text-sm text-white/60 leading-tight">{kpi.label}</div>
                {kpi.delta && (
                  <div className={`text-xs mt-1 sm:mt-2 ${
                    kpi.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {kpi.delta >= 0 ? '+' : ''}{kpi.delta.toFixed(1)}{kpi.suffix}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        {!hasVisited && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-24 sm:bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/50 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION COMPONENT
============================================================================ */
function Section({ 
  id, 
  title, 
  subtitle, 
  children, 
  background = 'transparent',
  className = '' 
}: { 
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  background?: 'transparent' | 'dark';
  className?: string;
}) {
  return (
    <section 
      id={id} 
      className={`py-16 sm:py-24 lg:py-32 ${
        background === 'dark' ? 'bg-white/5' : ''
      } ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
                {subtitle}
              </p>
            )}
          </motion.div>
          {children}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   ROLES SECTION
============================================================================ */
function RolesSection({ onOpen, visitedSections }: { 
  onOpen: (r: RoleCard) => void; 
  visitedSections: string[];
}) {
  const hasVisited = visitedSections.includes('roles');
  
  return (
    <Section id="roles" title="Демонстрационные роли" subtitle="Исследуйте полный функционал платформы через различные пользовательские роли с реальными сценариями логистики">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {logisticsRoleCards.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ 
              y: -8,
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            className="group relative cursor-pointer"
            onClick={() => onOpen(role)}
          >
            <SpotlightCard className="h-full">
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${role.gradient} shadow-lg`}>
                      <role.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">{role.title}</h3>
                      <p className="text-white/60 text-sm sm:text-base truncate">{role.subtitle}</p>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 45 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="flex-shrink-0"
                  >
                    <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 text-white/40 group-hover:text-white transition-colors" />
                  </motion.div>
                </div>

                {/* Description */}
                <p className="text-white/80 mb-4 sm:mb-6 leading-relaxed flex-grow text-sm sm:text-base line-clamp-3">
                  {role.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {role.stats.map((stat, i) => (
                    <div key={i} className="text-center p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                      <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mx-auto mb-1 sm:mb-2" />
                      <div className="text-base sm:text-lg font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-xs text-white/60 leading-tight">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Preview */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                  {role.tech.slice(0, 3).map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-white/80 text-xs backdrop-blur hover:bg-white/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                  {role.tech.length > 3 && (
                    <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-white/60 text-xs">
                      +{role.tech.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                    <span>{role.points.length} возможностей</span>
                  </div>
                  {role.badge && (
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      role.badge === 'Popular' ? 'bg-blue-500 text-white' :
                      role.badge === 'Professional' ? 'bg-green-500 text-white' :
                      role.badge === 'Enterprise' ? 'bg-purple-500 text-white' :
                      'bg-amber-500 text-white'
                    }`}>
                      {role.badge}
                    </div>
                  )}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================================
   FEATURES SECTION
============================================================================ */
function FeaturesSection({ onOpen, visitedSections }: { 
  onOpen: (f: Feature) => void; 
  visitedSections: string[];
}) {
  const hasVisited = visitedSections.includes('features');
  
  return (
    <Section id="features" title="Ключевые возможности" subtitle="Современные технологии для эффективной логистики и управления доставками" background="dark">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8">
        {logisticsFeatures.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.02, 
              y: -4,
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            className="group relative cursor-pointer"
            onClick={() => onOpen(feature)}
          >
            <SpotlightCard>
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg flex-shrink-0`}>
                    <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{feature.title}</h3>
                    <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-2">{feature.description}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className={`w-2 h-2 rounded-full ${
                    feature.status === 'stable' ? 'bg-emerald-400' :
                    feature.status === 'beta' ? 'bg-amber-400' :
                    feature.status === 'alpha' ? 'bg-rose-400' :
                    'bg-blue-400'
                  }`} />
                  <span className="text-xs text-white/60 capitalize">{feature.status}</span>
                  {feature.releaseDate && (
                    <span className="text-xs text-white/40 ml-auto">
                      {new Date(feature.releaseDate).toLocaleDateString('ru-RU')}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {feature.stats.map((stat, i) => (
                    <div key={i} className="text-center p-2 rounded-lg bg-white/5 border border-white/10">
                      <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400 mx-auto mb-1" />
                      <div className="text-sm sm:text-base font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-white/60 leading-tight line-clamp-2">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech Preview */}
                <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                  {feature.tech.slice(0, 4).map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/70 text-xs hover:bg-white/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Scenarios Preview */}
                <div className="mb-3 sm:mb-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-white/80 mb-1 sm:mb-2">Основные сценарии:</h4>
                  <ul className="text-xs text-white/60 space-y-1">
                    {feature.scenarios.slice(0, 2).map((scenario, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full flex-shrink-0" />
                        <span className="line-clamp-1">{scenario}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================================
   CASE STUDIES SECTION
============================================================================ */
function CaseStudiesSection({ onOpen, visitedSections }: { 
  onOpen: (cs: CaseStudy) => void; 
  visitedSections: string[];
}) {
  const hasVisited = visitedSections.includes('cases');
  
  return (
    <Section id="cases" title="Реальные кейсы" subtitle="Успешные внедрения платформы в логистических компаниях с измеримыми результатами">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {logisticsCaseStudies.map((caseStudy, index) => (
          <motion.div
            key={caseStudy.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative cursor-pointer"
            onClick={() => onOpen(caseStudy)}
          >
            <SpotlightCard className="h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{caseStudy.title}</h3>
                  <p className="text-cyan-400 font-semibold text-sm sm:text-base mb-1">{caseStudy.client}</p>
                  <p className="text-white/60 text-xs sm:text-sm">{caseStudy.industry} • {caseStudy.duration}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 text-white/40 group-hover:text-white transition-colors flex-shrink-0 ml-2" />
              </div>

              {/* ROI Badge */}
              {caseStudy.roi && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3 sm:mb-4">
                  <TrendingUp className="h-3 w-3" />
                  ROI: {caseStudy.roi}
                </div>
              )}

              {/* Challenge & Solution */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white/80 mb-1 sm:mb-2">Задача:</h4>
                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-3">{caseStudy.challenge}</p>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white/80 mb-1 sm:mb-2">Решение:</h4>
                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-3">{caseStudy.solution}</p>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                {caseStudy.results.slice(0, 2).map((result, i) => (
                  <div key={i} className="text-center p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-base sm:text-lg font-bold text-white mb-1">{result.improvement}</div>
                    <div className="text-xs text-white/60 leading-tight line-clamp-2">{result.metric}</div>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                {caseStudy.technologies.slice(0, 4).map((tech) => (
                  <span 
                    key={tech}
                    className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/70 text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          i < caseStudy.testimonial.rating 
                            ? 'text-amber-400 fill-current' 
                            : 'text-white/30'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/60">{caseStudy.testimonial.rating}/5</span>
                </div>
                <span className="text-xs text-white/40">{caseStudy.teamSize}</span>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================================
   TECH STACK SECTION
============================================================================ */
function TechStackSection({ visitedSections }: { visitedSections: string[] }) {
  const hasVisited = visitedSections.includes('tech');
  const technologies = [
    {
      category: "Frontend & Mobile",
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-500',
      items: [
        { name: 'Next.js 14', icon: Layers, description: 'React фреймворк', status: 'stable' },
        { name: 'React Native', icon: Smartphone, description: 'Мобильные приложения', status: 'stable' },
        { name: 'TypeScript', icon: Shield, description: 'Типизированный JavaScript', status: 'stable' },
        { name: 'Tailwind CSS', icon: Palette, description: 'Utility-first CSS', status: 'stable' },
      ]
    },
    {
      category: "Backend & AI",
      icon: Brain,
      color: 'from-green-500 to-emerald-500',
      items: [
        { name: 'Node.js', icon: Cpu, description: 'JavaScript runtime', status: 'stable' },
        { name: 'Python', icon: Brain, description: 'AI и ML алгоритмы', status: 'stable' },
        { name: 'PostgreSQL', icon: Database, description: 'Реляционная БД', status: 'stable' },
        { name: 'Redis', icon: Zap, description: 'In-memory data store', status: 'stable' },
      ]
    },
    {
      category: "Картография и GIS",
      icon: MapPin,
      color: 'from-orange-500 to-amber-500',
      items: [
        { name: 'Mapbox', icon: MapPin, description: 'Картографический сервис', status: 'stable' },
        { name: 'OpenRouteService', icon: RouteIcon, description: 'Маршрутизация', status: 'stable' },
        { name: 'OSRM', icon: Navigation, description: 'Расчет маршрутов', status: 'stable' },
        { name: 'GPS/GIS', icon: Globe, description: 'Геопозиционирование', status: 'stable' },
      ]
    },
    {
      category: "Инфраструктура",
      icon: CloudIcon,
      color: 'from-purple-500 to-indigo-500',
      items: [
        { name: 'Docker', icon: Package, description: 'Containerization', status: 'stable' },
        { name: 'Kubernetes', icon: Workflow, description: 'Orchestration', status: 'stable' },
        { name: 'AWS', icon: CloudIcon, description: 'Cloud platform', status: 'stable' },
        { name: 'Terraform', icon: Settings, description: 'Infrastructure as Code', status: 'stable' },
      ]
    }
  ];

  return (
    <Section id="tech" title="Технологический стек" subtitle="Современные технологии для создания высокопроизводительных логистических систем" background="dark">
      {/* Tech Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-12">
        {technologies.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <SpotlightCard className="h-full">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${category.color} shadow-lg`}>
                  <category.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">{category.category}</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {category.items.map((tech, techIndex) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: techIndex * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -4,
                      transition: { type: "spring", stiffness: 400 }
                    }}
                    className="group relative"
                  >
                    <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Tech Icon */}
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} shadow-lg flex-shrink-0`}>
                          <tech.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white text-sm sm:text-base truncate">{tech.name}</h4>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              tech.status === 'stable' ? 'bg-emerald-400' :
                              tech.status === 'beta' ? 'bg-amber-400' :
                              'bg-rose-400'
                            }`} />
                          </div>
                          <p className="text-white/60 text-xs sm:text-sm leading-tight">{tech.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-12 sm:mt-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {[
            { 
              icon: ShieldCheck, 
              title: "Безопасность", 
              description: "GDPR, OAuth2, RBAC, End-to-end Encryption",
              features: ["Аудит действий", "2FA", "Шифрование данных"]
            },
            { 
              icon: Zap, 
              title: "Производительность", 
              description: "CDN, Caching, Optimizations, PWA",
              features: ["<100ms response", "99.9% uptime", "Auto-scaling"]
            },
            { 
              icon: TrendingUp, 
              title: "Масштабируемость", 
              description: "Microservices, Auto-scaling, Cloud Native",
              features: ["10K+ RPS", "Multi-region", "Zero-downtime"]
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all"
            >
              <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mb-3 mx-auto" />
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{item.title}</h4>
              <p className="text-white/60 text-xs sm:text-sm mb-3">{item.description}</p>
              <div className="space-y-1">
                {item.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

/* ============================================================================
   TEAM SECTION
============================================================================ */
function TeamSection({ onOpenMember, visitedSections }: { 
  onOpenMember: (m: TeamMember) => void; 
  visitedSections: string[];
}) {
  const hasVisited = visitedSections.includes('team');
  
  return (
    <Section id="team" title="Наша команда" subtitle="Профессионалы с глубокой экспертизой в создании логистических платформ">
      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {logisticsTeamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative cursor-pointer"
            onClick={() => onOpenMember(member)}
          >
            <SpotlightCard className="h-full">
              {/* Avatar & Basic Info */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{member.avatar}</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{member.name}</h3>
                <p className="text-cyan-400 text-sm sm:text-base mb-1 sm:mb-2">{member.role}</p>
                <p className="text-white/60 text-xs sm:text-sm">{member.experience} • {member.projects} проектов</p>
              </div>
              
              {/* Specialization */}
              <div className="mb-3 sm:mb-4">
                <h4 className="text-xs sm:text-sm font-semibold text-white/80 mb-2">Специализация:</h4>
                <div className="flex flex-wrap gap-1">
                  {member.specialization.slice(0, 2).map((skill) => (
                    <span 
                      key={skill}
                      className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/70 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.specialization.length > 2 && (
                    <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/40 text-xs">
                      +{member.specialization.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-3 sm:mb-4">
                <h4 className="text-xs sm:text-sm font-semibold text-white/80 mb-2">Технологии:</h4>
                <div className="flex flex-wrap gap-1">
                  {member.tech.slice(0, 3).map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/70 text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-xs text-white/50 group-hover:text-white transition-colors">
                  Подробнее →
                </span>
                <div className="flex gap-1">
                  {member.expertise.slice(0, 3).map((_, i) => (
                    <div 
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white/60 transition-colors"
                    />
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Team Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-12 sm:mt-16"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto">
          {[
            { value: '50+', label: 'Завершенных проектов', icon: CheckCircle2 },
            { value: '4+', label: 'Лет опыта', icon: Calendar },
            { value: '99.9%', label: 'Доступность систем', icon: ShieldCheck },
            { value: '24/7', label: 'Поддержка', icon: Clock },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-xs sm:text-sm leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

/* ============================================================================
   STATISTICS SECTION
============================================================================ */
function StatisticsSection({ visitedSections }: { visitedSections: string[] }) {
  const hasVisited = visitedSections.includes('stats');
  const stats = [
    {
      value: '15,847',
      label: 'Ежедневных доставок',
      description: 'Обработано заказов за сегодня',
      change: '+12%',
      trend: 'up' as const,
      icon: Package
    },
    {
      value: '2,524',
      label: 'Активных курьеров',
      description: 'Курьеры на маршрутах',
      change: '+8%',
      trend: 'up' as const,
      icon: Users
    },
    {
      value: '98.2%',
      label: 'Успешных доставок',
      description: 'Доставлено вовремя и без проблем',
      change: '+2.1%',
      trend: 'up' as const,
      icon: Star
    },
    {
      value: '2.3ч',
      label: 'Среднее время доставки',
      description: 'От принятия заказа до доставки',
      change: '-0.4ч',
      trend: 'down' as const,
      icon: Clock
    },
    {
      value: '25%',
      label: 'Экономия пробега',
      description: 'За счет AI-оптимизации маршрутов',
      change: '+5%',
      trend: 'up' as const,
      icon: TrendingUp
    },
    {
      value: '99.9%',
      label: 'Доступность системы',
      description: 'Uptime платформы',
      change: '+0.2%',
      trend: 'up' as const,
      icon: ShieldCheck
    }
  ];

  return (
    <Section id="stats" title="Статистика платформы" subtitle="Реальные метрики и показатели эффективности нашей логистической платформы" background="dark">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="group relative"
          >
            <SpotlightCard>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${
                    stat.trend === 'up' ? 'from-emerald-500 to-green-500' : 'from-rose-500 to-red-500'
                  } shadow-lg`}>
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    <TrendingUp className={`h-4 w-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                    {stat.change}
                  </div>
                </div>
                
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-lg sm:text-xl font-semibold text-white/90 mb-2">{stat.label}</div>
                <div className="text-white/60 text-sm leading-relaxed">{stat.description}</div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================================
   MODAL COMPONENTS
============================================================================ */
function BaseModal({
  title,
  children,
  onClose,
  size = 'max-w-2xl',
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: string;
  icon?: React.ElementType;
}) {
  const reduced = useReducedMotion();
  
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4 lg:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.button
        aria-label="Закрыть модальное окно"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      {/* Modal */}
      <motion.div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${size} rounded-2xl sm:rounded-3xl border border-white/20 bg-gray-900/95 backdrop-blur-xl overflow-hidden shadow-2xl max-h-[90vh]`}
        initial={{ y: reduced ? 0 : 20, opacity: 0, scale: reduced ? 1 : 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1, transition: spring }}
        exit={{ y: reduced ? 0 : 20, opacity: 0, scale: reduced ? 1 : 0.95 }}
      >
        {/* Glow Effect */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-white/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />

        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-white/[0.03]">
          {Icon && (
            <div className="p-2 rounded-xl bg-white/10 border border-white/10 flex-shrink-0">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-white truncate">{title}</h3>
            {subtitle && <p className="text-white/60 text-xs sm:text-sm mt-0.5 truncate">{subtitle}</p>}
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white/10 transition flex-shrink-0"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </motion.button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-4 sm:p-6">
            {children}
            <div 
              className="h-32 sm:h-6"
              style={{ height: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RoleModal({ 
  role, 
  onClose, 
  onOpenVideo 
}: { 
  role: RoleCard; 
  onClose: () => void;
  onOpenVideo: (url: string, title: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech' | 'demo'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: Eye },
    { id: 'features' as const, label: 'Возможности', icon: Zap },
    { id: 'tech' as const, label: 'Технологии', icon: Code2 },
  ];

  return (
    <BaseModal
      title={role.title}
      subtitle={role.subtitle}
      onClose={onClose}
      size="max-w-4xl lg:max-w-6xl"
      icon={role.icon}
    >
      {/* Tabs */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur overflow-x-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition flex-shrink-0 ${
                  active 
                    ? 'bg-white text-black' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {activeTab === 'overview' && (
            <>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Описание</h4>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">{role.description}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Ключевые преимущества</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {role.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90 text-sm sm:text-base">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Основные возможности</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {role.points.map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-white/80 text-sm sm:text-base"
                    >
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {activeTab === 'features' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {role.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mb-3" />
                  <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{feature.title}</h4>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'tech' && (
            <>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Технологический стек</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {role.tech.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors"
                    >
                      <span className="text-white/90 text-xs sm:text-sm">{tech}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Метрики эффективности</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {role.metrics.map((metric, index) => (
                    <div key={index} className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white/80 text-xs sm:text-sm">{metric.metric}</div>
                        <span className="text-emerald-400 text-xs sm:text-sm font-semibold">{metric.improvement}</span>
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-white">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Статистика</h4>
            <div className="space-y-2 sm:space-y-3">
              {role.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm sm:text-base">{stat.value}</div>
                    <div className="text-white/60 text-xs sm:text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Детали роли</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Уровень доступа:</span>
                <span className="text-white font-semibold text-sm capitalize">{role.accessLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Обучение:</span>
                <span className="text-white font-semibold text-sm">{role.trainingTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Возможностей:</span>
                <span className="text-white font-semibold text-sm">{role.points.length}</span>
              </div>
            </div>
          </div>

          {role.badge && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Статус</h4>
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${
                role.badge === 'Popular' ? 'bg-blue-500/20 text-blue-400' :
                role.badge === 'Professional' ? 'bg-green-500/20 text-green-400' :
                role.badge === 'Enterprise' ? 'bg-purple-500/20 text-purple-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                <Award className="h-4 w-4" />
                <span className="font-semibold text-sm">{role.badge}</span>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open(role.path, '_blank')}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition shadow-lg text-sm sm:text-base"
          >
            Открыть демонстрацию
          </motion.button>
        </div>
      </div>
    </BaseModal>
  );
}

/* ============================================================================
   FEATURE MODAL
============================================================================ */
function FeatureModal({ feature, onClose }: { feature: Feature; onClose: () => void }) {
  return (
    <BaseModal
      title={feature.title}
      subtitle={feature.description}
      onClose={onClose}
      size="max-w-4xl"
      icon={feature.icon}
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {feature.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10"
            >
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-xs sm:text-sm leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Status & Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
            <div className={`w-3 h-3 rounded-full ${
              feature.status === 'stable' ? 'bg-emerald-400' :
              feature.status === 'beta' ? 'bg-amber-400' :
              feature.status === 'alpha' ? 'bg-rose-400' :
              'bg-blue-400'
            }`} />
            <div>
              <div className="text-white/60 text-sm">Статус</div>
              <div className="text-white font-semibold capitalize">{feature.status}</div>
            </div>
          </div>
          {feature.releaseDate && (
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <div>
                <div className="text-white/60 text-sm">Дата релиза</div>
                <div className="text-white font-semibold">
                  {new Date(feature.releaseDate).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scenarios */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Основные сценарии</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {feature.scenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/90 text-sm sm:text-base">{scenario}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Технологии</h4>
          <div className="flex flex-wrap gap-2">
            {feature.tech.map((tech, index) => (
              <span 
                key={tech}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs sm:text-sm hover:bg-white/20 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Benchmarks */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Бенчмарки</h4>
          <div className="flex flex-wrap gap-2">
            {feature.benchmarks.map((benchmark, index) => (
              <motion.div
                key={benchmark}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs sm:text-sm"
              >
                {benchmark}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Documentation Link */}
        {feature.documentation && (
          <motion.a
            href={feature.documentation}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Открыть документацию</span>
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </motion.a>
        )}
      </div>
    </BaseModal>
  );
}

/* ============================================================================
   CASE STUDY MODAL
============================================================================ */
function CaseStudyModal({ caseStudy, onClose }: { caseStudy: CaseStudy; onClose: () => void }) {
  return (
    <BaseModal
      title={caseStudy.title}
      subtitle={`${caseStudy.client} • ${caseStudy.industry}`}
      onClose={onClose}
      size="max-w-4xl"
      icon={FileText}
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Header Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Срок</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.duration}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Улучшение</div>
            <div className="font-semibold text-white text-sm sm:text-base">+{caseStudy.results[0]?.improvement}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Охват</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.results[1]?.after}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Рейтинг</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.testimonial.rating}/5</div>
          </div>
        </div>

        {/* ROI & Budget */}
        {(caseStudy.roi || caseStudy.budget) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {caseStudy.roi && (
              <div className="p-3 sm:p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold text-sm">ROI</span>
                </div>
                <div className="text-white font-bold text-lg">{caseStudy.roi}</div>
                <div className="text-emerald-400/80 text-xs">Возврат инвестиций</div>
              </div>
            )}
            {caseStudy.budget && (
              <div className="p-3 sm:p-4 rounded-xl bg-blue-500/20 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Banknote className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-semibold text-sm">Бюджет</span>
                </div>
                <div className="text-white font-bold text-lg">{caseStudy.budget}</div>
                <div className="text-blue-400/80 text-xs">Общие инвестиции</div>
              </div>
            )}
          </div>
        )}

        {/* Challenge & Solution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Задача</h4>
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">{caseStudy.challenge}</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Решение</h4>
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">{caseStudy.solution}</p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Результаты</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {caseStudy.results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="text-lg sm:text-xl font-bold text-white mb-1">{result.improvement}</div>
                <div className="text-white/60 text-xs sm:text-sm mb-2">{result.metric}</div>
                <div className="flex justify-center gap-2 text-white/40 text-xs">
                  <span>Было: {result.before}</span>
                  <span>Стало: {result.after}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Implementation Highlights */}
        {caseStudy.implementationHighlights && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Ключевые моменты внедрения</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {caseStudy.implementationHighlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 text-white/70 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Технологии</h4>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {caseStudy.technologies.map((tech, index) => (
              <span 
                key={tech}
                className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/70 text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        {caseStudy.testimonial && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Отзыв клиента</h4>
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                {caseStudy.testimonial.avatar && (
                  <div className="text-2xl sm:text-3xl flex-shrink-0">{caseStudy.testimonial.avatar}</div>
                )}
                <div className="flex-1">
                  <p className="text-white/80 italic mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                    "{caseStudy.testimonial.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.testimonial.author}</div>
                      <div className="text-cyan-400 text-xs sm:text-sm">{caseStudy.testimonial.position}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${
                            i < caseStudy.testimonial.rating 
                              ? 'text-amber-400 fill-current' 
                              : 'text-white/30'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}

/* ============================================================================
   TEAM MEMBER MODAL
============================================================================ */
function TeamMemberModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  return (
    <BaseModal
      title={member.name}
      subtitle={member.role}
      onClose={onClose}
      size="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4 sm:gap-6">
          <div className="text-4xl sm:text-5xl flex-shrink-0">{member.avatar}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{member.name}</h3>
            <p className="text-cyan-400 text-lg sm:text-xl mb-2">{member.role}</p>
            <p className="text-white/60 text-sm sm:text-base">{member.experience} • {member.projects} проектов</p>
            <p className="text-white/50 text-xs sm:text-sm mt-1">В команде с {new Date(member.joinDate).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        {/* Bio */}
        {member.bio && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">О специалисте</h4>
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">{member.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Expertise */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Экспертиза</h4>
            <div className="space-y-2">
              {member.expertise.map((skill, index) => (
                <div key={index} className="flex items-center gap-3 text-white/80 text-sm sm:text-base">
                  <Sparkles className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specialization */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Специализация</h4>
            <div className="flex flex-wrap gap-2">
              {member.specialization.map((specialty) => (
                <span 
                  key={specialty}
                  className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/70 text-xs hover:bg-white/20 transition-colors"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">Технологии</h4>
          <div className="flex flex-wrap gap-2">
            {member.tech.map((tech) => (
              <span 
                key={tech}
                className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/70 text-xs hover:bg-white/20 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {member.certifications && member.certifications.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Сертификаты</h4>
              <div className="space-y-2">
                {member.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/70 text-sm">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}

/* ============================================================================
   CONTACT MODAL
============================================================================ */
function ContactModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    role: '',
    description: '',
    budget: '',
    timeline: ''
  });

  const roles = [
    'Курьерская служба',
    'Логистическая компания',
    'Складской комплекс',
    'Интернет-магазин',
    'Производственное предприятие',
    'Франчайзи',
    'Технический партнер',
    'Другое'
  ];

  const budgets = [
    'до 500K ₽',
    '500K - 1M ₽',
    '1M - 2M ₽',
    '2M - 5M ₽',
    '5M+ ₽',
    'Не определён'
  ];

  const timelines = [
    'Срочно (1-2 месяца)',
    'В ближайшее время (3-6 месяцев)',
    'Планирую (6-12 месяцев)',
    'Исследую возможности'
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSubmit();
    }, 2000);
  };

  return (
    <BaseModal title="Обсудить проект" onClose={onClose} size="max-w-2xl" icon={MessageSquareMore}>
      <form onSubmit={submit} className="space-y-4 sm:space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/60 font-medium">Имя *</label>
            <input
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
              value={form.name}
              onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
              placeholder="Ваше имя"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60 font-medium">Email *</label>
            <input
              type="email"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
              value={form.email}
              onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/60 font-medium">Организация</label>
            <input
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
              value={form.organization}
              onChange={(e) => setForm(s => ({ ...s, organization: e.target.value }))}
              placeholder="Название организации"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60 font-medium">Телефон</label>
            <input
              type="tel"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
              value={form.phone}
              onChange={(e) => setForm(s => ({ ...s, phone: e.target.value }))}
              placeholder="+7 (000) 000-00-00"
            />
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/60 font-medium">Тип организации</label>
            <select
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
              value={form.role}
              onChange={(e) => setForm(s => ({ ...s, role: e.target.value }))}
            >
              <option value="">Выберите тип</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60 font-medium">Примерный бюджет</label>
            <select
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
              value={form.budget}
              onChange={(e) => setForm(s => ({ ...s, budget: e.target.value }))}
            >
              <option value="">Выберите бюджет</option>
              {budgets.map(budget => (
                <option key={budget} value={budget}>{budget}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/60 font-medium">Сроки реализации</label>
          <select
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
            value={form.timeline}
            onChange={(e) => setForm(s => ({ ...s, timeline: e.target.value }))}
          >
            <option value="">Выберите сроки</option>
            {timelines.map(timeline => (
              <option key={timeline} value={timeline}>{timeline}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/60 font-medium">Описание проекта *</label>
          <textarea
            rows={4}
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition resize-none text-sm sm:text-base"
            value={form.description}
            onChange={(e) => setForm(s => ({ ...s, description: e.target.value }))}
            placeholder="Опишите вашу логистическую задачу, текущие процессы и ожидаемый результат..."
          />
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
                Отправка...
              </div>
            ) : (
              'Отправить заявку'
            )}
          </motion.button>
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition text-sm sm:text-base"
          >
            Отмена
          </motion.button>
        </div>

        <p className="text-center text-white/40 text-xs sm:text-sm">
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
        </p>
      </form>
    </BaseModal>
  );
}

/* ============================================================================
   SUCCESS MODAL
============================================================================ */
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <BaseModal title="Заявка отправлена!" onClose={onClose} size="max-w-sm sm:max-w-md" icon={CheckCircle2}>
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
        >
          <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </motion.div>

        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Спасибо за вашу заявку!</h3>
        <p className="text-white/70 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
          Мы свяжемся с вами в ближайшее время для обсуждения деталей проекта. 
          Обычно мы отвечаем в течение 2 часов в рабочее время.
        </p>

        <div className="space-y-2 text-white/60 text-xs sm:text-sm mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-2">
            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
            {LOGISTICS_CONFIG.company.email}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            {LOGISTICS_CONFIG.company.phone}
          </div>
        </div>

        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition text-sm sm:text-base"
        >
          Понятно
        </motion.button>
      </div>
    </BaseModal>
  );
}

/* ============================================================================
   MOBILE MENU COMPONENT
============================================================================ */
function MobileMenu({ isOpen, onClose, onContact }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onContact: () => void;
}) {
  const menuItems = [
    { name: 'Роли', href: '#roles', icon: Users },
    { name: 'Возможности', href: '#features', icon: Zap },
    { name: 'Кейсы', href: '#cases', icon: FileText },
    { name: 'Технологии', href: '#tech', icon: Code2 },
    { name: 'Команда', href: '#team', icon: Truck },
    { name: 'Статистика', href: '#stats', icon: BarChart3 },
  ];

  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={reducedMotion ? { duration: 0.2 } : { type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-gray-900/95 border-l border-white/10 backdrop-blur-xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">Логистика</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/10 transition"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5 text-white" />
                  </motion.button>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Демо-режим</div>
                    <div className="text-xs text-white/60">Гость</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.name}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <a
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors group"
                      >
                        <item.icon className="h-5 w-5 text-cyan-400" />
                        <span className="font-medium text-sm">{item.name}</span>
                        <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {/* Contact CTA */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
                >
                  <h3 className="text-white font-semibold mb-2 text-sm">Начните проект</h3>
                  <p className="text-white/60 text-xs mb-3">Обсудите вашу логистическую задачу с экспертами</p>
                  <motion.button
                    onClick={() => {
                      onClose();
                      onContact();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2.5 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-cyan-600 transition"
                  >
                    Обсудить проект
                  </motion.button>
                </motion.div>
              </nav>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-white/10">
                <div className="flex items-center justify-between text-white/40 text-xs">
                  <span>© 2024 Логистика</span>
                  <span>Демо v1.0</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ============================================================================
   CUSTOM STYLES
============================================================================ */
function CustomStyles() {
  return (
    <style jsx global>{`
      @keyframes scan {
        0% { transform: translateX(-100%); opacity: 0; }
        15% { opacity: 1; }
        85% { opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
        50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
      }
      
      .animate-scan {
        animation: scan 8s linear infinite;
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-glow {
        animation: glow 2s ease-in-out infinite;
      }
      
      /* Custom Scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      /* Selection */
      ::selection {
        background: rgba(59, 130, 246, 0.3);
        color: white;
        text-shadow: none;
      }
      
      /* Focus Outline */
      button:focus-visible,
      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        outline: 2px solid rgb(59, 130, 246);
        outline-offset: 2px;
        border-radius: 8px;
      }
      
      /* Line clamp utilities */
      .line-clamp-1 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      
      .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      
      .line-clamp-3 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
      
      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        .animate-scan,
        .animate-float,
        .animate-glow { 
          animation: none !important; 
        }
        * { 
          animation-duration: 0.01ms !important; 
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* Smooth Scrolling */
      html {
        scroll-behavior: smooth;
        scroll-padding-top: 100px;
      }
      
      /* Mobile optimizations */
      @media (max-width: 640px) {
        .text-balance {
          text-wrap: balance;
        }
        
        /* Improve touch targets */
        button, 
        a {
          min-height: 44px;
          min-width: 44px;
        }
      }
    `}</style>
  );
}

/* ============================================================================
   MAIN COMPONENT
============================================================================ */
export default function LogisticsDemoPage() {
  const [modal, dispatch] = useReducer(modalReducer, { type: 'idle' });
  const initialKpis = useMemo(() => [
    { 
      label: 'Ежедневных доставок', 
      value: 15847, 
      icon: Package, 
      trend: 'up' as const, 
      description: 'Обработано заказов за сегодня',
      format: 'number'
    },
    { 
      label: 'Активных курьеров', 
      value: 2524, 
      icon: Users, 
      trend: 'up' as const, 
      description: 'Курьеры на маршрутах',
      format: 'number'
    },
    { 
      label: 'Успешных доставок', 
      value: 98.2, 
      suffix: '%', 
      icon: Star, 
      trend: 'up' as const, 
      description: 'Доставлено вовремя и без проблем',
      format: 'percentage'
    },
    { 
      label: 'Среднее время доставки', 
      value: 2.3, 
      suffix: 'ч', 
      icon: Clock, 
      trend: 'down' as const, 
      description: 'От принятия заказа до доставки',
      format: 'number'
    },
  ], []);
  
  const kpis = useKpiAnimation(initialKpis);
  const mousePosition = useMousePosition();
  const scrollProgress = useScrollProgress();
  const { isMobile, isTablet, isDesktop, isLarge } = useViewportDetection();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visitedSections, setVisitedSections] = useLocalStorage<string[]>('visited-sections-logistics', []);
  const [lastVisit, setLastVisit] = useLocalStorage<string>('last-visit-logistics', new Date().toISOString());

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.type !== 'idle') {
        dispatch({ type: 'CLOSE' });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: 'OPEN_CONTACT' });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [modal.type]);

  // Page analytics and section tracking
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (!visitedSections.includes(sectionId)) {
            setVisitedSections(prev => [...prev, sectionId]);
          }
        }
      });
    }, { threshold: 0.5 });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [visitedSections, setVisitedSections]);

  // Update last visit
  useEffect(() => {
    setLastVisit(new Date().toISOString());
  }, [setLastVisit]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-black text-white overflow-x-hidden relative"
      style={{ 
        '--scroll-progress': `${scrollProgress}%`,
      } as React.CSSProperties}
    >
      {/* Animated Background */}
      <InteractiveBackground 
        mousePosition={mousePosition} 
        scrollProgress={scrollProgress} 
      />
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 z-50"
        style={{ width: `${scrollProgress}%` }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />
      
      {/* Fixed Particles - No Randomness */}
      <FloatingParticles />
      
      {/* Header */}
      <Header 
        onMenuToggle={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
        scrollProgress={scrollProgress}
        onContact={() => dispatch({ type: 'OPEN_CONTACT' })}
      />

      <main className="relative pb-[140px] sm:pb-[160px] lg:pb-[200px]">
        {/* Hero Section */}
        <HeroSection 
          kpis={kpis} 
          onContact={() => dispatch({ type: 'OPEN_CONTACT' })}
          isMobile={isMobile}
          visitedSections={visitedSections}
        />

        {/* Roles Section */}
        <RolesSection 
          onOpen={(r) => dispatch({ type: 'OPEN_ROLE', payload: r })} 
          visitedSections={visitedSections}
        />

        {/* Features Section */}
        <FeaturesSection 
          onOpen={(f) => dispatch({ type: 'OPEN_FEATURE', payload: f })} 
          visitedSections={visitedSections}
        />

        {/* Case Studies Section */}
        <CaseStudiesSection 
          onOpen={(cs) => dispatch({ type: 'OPEN_CASE_STUDY', payload: cs })} 
          visitedSections={visitedSections}
        />

        {/* Tech Stack Section */}
        <TechStackSection visitedSections={visitedSections} />

        {/* Team Section */}
        <TeamSection 
          onOpenMember={(m) => dispatch({ type: 'OPEN_TEAM_MEMBER', payload: m })}
          visitedSections={visitedSections}
        />

        {/* Statistics Section */}
        <StatisticsSection visitedSections={visitedSections} />

      </main>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={modal.type === 'mobileMenu'} 
        onClose={() => dispatch({ type: 'CLOSE' })}
        onContact={() => dispatch({ type: 'OPEN_CONTACT' })}
      />

      {/* Modals */}
      <AnimatePresence mode="wait">
        {modal.type === 'role' && (
          <RoleModal 
            role={modal.payload} 
            onClose={() => dispatch({ type: 'CLOSE' })} 
            onOpenVideo={(url, title) => dispatch({ type: 'OPEN_VIDEO', payload: { url, title } })}
          />
        )}
        {modal.type === 'feature' && (
          <FeatureModal 
            feature={modal.payload} 
            onClose={() => dispatch({ type: 'CLOSE' })} 
          />
        )}
        {modal.type === 'contact' && (
          <ContactModal
            onClose={() => dispatch({ type: 'CLOSE' })}
            onSubmit={() => dispatch({ type: 'SUBMIT_CONTACT' })}
          />
        )}
        {modal.type === 'success' && (
          <SuccessModal 
            onClose={() => dispatch({ type: 'CLOSE' })} 
          />
        )}
        {modal.type === 'caseStudy' && (
          <CaseStudyModal 
            caseStudy={modal.payload} 
            onClose={() => dispatch({ type: 'CLOSE' })} 
          />
        )}
        {modal.type === 'teamMember' && (
          <TeamMemberModal 
            member={modal.payload} 
            onClose={() => dispatch({ type: 'CLOSE' })} 
          />
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <CustomStyles />
    </div>
  );
}