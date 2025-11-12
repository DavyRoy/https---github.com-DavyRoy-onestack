
// src/app/demo/services/page.tsx
'use client';

import React, { useEffect, useMemo, useReducer, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { gsap } from 'gsap';

// Импортируем только существующие иконки из lucide-react
import {
  Rocket, Smartphone, Globe, BarChart3, Cpu, Database, ShieldCheck, Layers, Activity,
  ArrowRight, Play, X, CheckCircle2, Heart, Users, Truck, Wrench, Bus, Monitor,
  MessageSquareMore, Mail, Phone, Building2, Home, Sparkles, Zap, Cog, GitBranch,
  Star, Smile, TrendingUp, Clock, Shield, Code2, Palette, Workflow, Bot, Cloud,
  ArrowUpRight, Menu, Github, Twitter, Linkedin, Calendar, MapPin, Award,
  FileText, Server, GitMerge, Eye, Package, Search, Filter, Settings, 
  Download, Upload, Share2, ThumbsUp, MessageCircle, Video, Image, Music, 
  Film, BookOpen, Calculator, Camera, Coffee, CreditCard, ShoppingCart, Banknote, 
  Wallet, Coins, PieChart, LineChart, Target, Users2, UserPlus, UserCheck, 
  UserX, Mailbox, Inbox, Send, Archive, Folder, File, FolderOpen, HardDrive, 
  CloudRain, Sun, Moon, Laptop, Tablet, Watch, Printer, Scanner, Keyboard, 
  Mouse, Headphones, Mic, Volume2, CameraOff, VideoOff, Wifi, Bluetooth,
  Battery, BatteryCharging, Power, RotateCcw, RefreshCw, Lock, Unlock,
  EyeOff, Key, QrCode, Fingerprint, Scan, ShieldOff, AlertTriangle,
  Info, HelpCircle, Ban, Radio, Tv, Gamepad, Vortex, Atom, Satellite, 
  Flask, Microscope, Telescope, Brain, Bone, Stethoscope, Pill, Syringe, 
  Thermometer, Ambulance, Bed, Wheelchair, Tooth, DNA, Virus, Microchip, 
  Motherboard, Router, Hub, Cctv, AlarmClock, Bell, BellOff, Megaphone, 
  Speaker, Type, Quote, AlignLeft, AlignCenter, AlignRight, Bold, Italic, 
  Underline, Link2, Unlink, List, ListOrdered, ListChecks, Table, Columns,
  Grid, Layout, Sidebar, Container, PanelTop, PanelLeft, PanelRight, 
  PanelBottom, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  MoreHorizontal, MoreVertical, Plus, Minus, Crosshair, Navigation, 
  Compass, Flag, Navigation2, Car, Train, Ship, Plane, Bike, Walk,
  Gas, Fuel, Gauge, Tool, Hammer, Screwdriver, Ruler, Weight, Scale, 
  Box, Cube, Package2, Footprints, Tree, Leaf, Sprout, Flower2,
  Mountain, CloudSnow, CloudDrizzle, CloudLightning, Umbrella, 
  Droplets, ThermometerSnowflake, Fire, Wind, Tornado, Timer, 
  Hourglass, History, CalendarDays, StopCircle, PlayCircle, 
  PauseCircle, SkipBack, SkipForward, Rewind, FastForward,
  Repeat, Shuffle, Volume, Volume1, VolumeX, MicOff, Airplay, 
  Cast, User, ChefHat, Scissors, CarFront, Music2, Dumbbell,
  ShoppingBag, Wine, Utensils, Shirt, Home as HomeIcon, Sparkles as SparklesIcon,
  Calendar as CalendarIcon, CreditCard as CreditCardIcon,
  MapPin as MapPinIcon, Clock as ClockIcon, Star as StarIcon,
  Phone as PhoneIcon, Mail as MailIcon, MessageCircle as MessageCircleIcon,
  CloudOff
} from 'lucide-react';

// Создаем псевдонимы для конфликтующих иконок
const CloudIcon = Cloud;
const CoffeeIcon = Coffee;
const FlameIcon = Fire;
const LightningIcon = Zap;

/* ============================================================================
   CONSTANTS AND CONFIGURATION
============================================================================ */
const APP_CONFIG = {
  company: {
    name: 'Cервис Платформа',
    email: 'info@service-platform.dev',
    phone: '+7 (000) 000-00-00',
    demo: true,
    founded: 2021,
    teamSize: 25
  },
  features: {
    particleCount: 40,
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
    baseUrl: 'https://api.service-platform.dev/v1',
    timeout: 10000,
    retries: 3
  }
} as const;

const COLOR_PALETTE = {
  primary: {
    blue: 'rgba(59, 130, 246, 0.15)',
    purple: 'rgba(168, 85, 247, 0.1)',
    cyan: 'rgba(6, 182, 212, 0.1)',
    emerald: 'rgba(16, 185, 129, 0.1)',
    rose: 'rgba(244, 63, 94, 0.1)',
    amber: 'rgba(245, 158, 11, 0.1)'
  },
  gradients: {
    hero: 'from-blue-400 via-purple-400 to-cyan-400',
    cta: 'from-blue-500 to-purple-500',
    success: 'from-emerald-500 to-green-500',
    warning: 'from-amber-500 to-orange-500',
    error: 'from-rose-500 to-red-500'
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
        const variation = (Math.random() - 0.5) * (kpi.label.includes('Бронирований') ? 50 : 0.5);
        const newValue = Math.max(0, kpi.value + variation);
        const trend = variation > 0 ? 'up' : variation < 0 ? 'down' : 'stable';
        
        return {
          ...kpi,
          value: Number(newValue.toFixed(kpi.suffix ? 2 : 0)),
          delta: Math.abs(variation),
          trend
        };
      }));
    }, APP_CONFIG.features.kpiUpdateInterval);

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
        isMobile: width < APP_CONFIG.breakpoints.mobile,
        isTablet: width >= APP_CONFIG.breakpoints.mobile && width < APP_CONFIG.breakpoints.desktop,
        isDesktop: width >= APP_CONFIG.breakpoints.desktop && width < APP_CONFIG.breakpoints.large,
        isLarge: width >= APP_CONFIG.breakpoints.large
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
  industries: string[];
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
  industries: string[];
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
   DATA
============================================================================ */
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Анна Козлова',
    role: 'Lead Product Manager',
    expertise: ['Product Strategy', 'UX Research', 'Business Analytics', 'Service Design', 'Customer Journey'],
    avatar: '👩‍💼',
    experience: '7+ лет',
    projects: 34,
    tech: ['Figma', 'Amplitude', 'Mixpanel', 'Hotjar', 'Google Analytics', 'Jira', 'Confluence'],
    bio: 'Специализируется на создании продуктов для сервисного бизнеса с фокусом на пользовательский опыт и бизнес-метрики. Руководила запуском 15+ успешных проектов в сфере услуг.',
    education: ['НИУ ВШЭ, Менеджмент', 'Stanford Executive Program'],
    certifications: ['PMP', 'Google Analytics', 'Scrum Master'],
    social: {
      linkedin: '#',
      twitter: '#',
      portfolio: '#'
    },
    joinDate: '2021-03-15',
    specialization: ['Product Strategy', 'UX Research', 'Service Design']
  },
  {
    id: '2',
    name: 'Максим Орлов',
    role: 'Senior Fullstack Developer',
    expertise: ['React', 'Node.js', 'TypeScript', 'AWS', 'Real-time Systems', 'Payment Integration'],
    avatar: '👨‍💻',
    experience: '8+ лет',
    projects: 42,
    tech: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'WebSocket', 'Stripe API'],
    bio: 'Эксперт в создании высоконагруженных систем для бронирования и оплаты услуг. Специализируется на real-time обновлениях и интеграции платежных систем.',
    education: ['МГТУ им. Баумана, Компьютерные науки', 'AWS Certified'],
    certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
    social: {
      linkedin: '#',
      github: '#',
      portfolio: '#'
    },
    joinDate: '2021-01-20',
    specialization: ['Backend', 'Payment Systems', 'Real-time Applications']
  },
  {
    id: '3',
    name: 'Елена Васнецова',
    role: 'UX/UI Designer',
    expertise: ['Figma', 'Design Systems', 'User Research', 'Mobile Design', 'Service Blueprinting'],
    avatar: '👩‍🎨',
    experience: '5+ лет',
    projects: 28,
    tech: ['Figma', 'Adobe XD', 'Sketch', 'Framer', 'Principle', 'After Effects'],
    bio: 'Создает интуитивные интерфейсы для сложных сервисных процессов. Специализируется на мобильном дизайне и создании дизайн-систем для предприятий услуг.',
    education: ['БВШД, Дизайн интерфейсов', 'HSE, Психология'],
    certifications: ['Google UX Design Certificate', 'NN/g UX Certification'],
    social: {
      linkedin: '#',
      behance: '#',
      dribbble: '#'
    },
    joinDate: '2021-06-10',
    specialization: ['Mobile Design', 'Design Systems', 'User Research']
  },
  {
    id: '4',
    name: 'Денис Соколов',
    role: 'DevOps Engineer',
    expertise: ['Docker', 'Kubernetes', 'CI/CD', 'Monitoring', 'Cloud Infrastructure', 'Security'],
    avatar: '👨‍🔧',
    experience: '6+ лет',
    projects: 31,
    tech: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Grafana', 'Prometheus', 'GitLab CI'],
    bio: 'Обеспечивает высокую доступность и масштабируемость платформы. Специализируется на автоматизации развертывания и мониторинге производительности.',
    education: ['МФТИ, Прикладная математика'],
    certifications: ['CKA', 'AWS DevOps Engineer', 'Terraform Associate'],
    social: {
      linkedin: '#',
      github: '#'
    },
    joinDate: '2021-08-15',
    specialization: ['Cloud Infrastructure', 'CI/CD', 'Monitoring']
  }
];

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Цифровизация сети ресторанов',
    client: 'Сеть "Вкус Востока"',
    industry: 'Ресторанный бизнес',
    duration: '4 месяца',
    challenge: 'Ручное управление бронированиями, потеря заказов, сложности с управлением столиками, низкая эффективность персонала, отсутствие аналитики в реальном времени',
    solution: 'Внедрена облачная система управления рестораном с онлайн-бронированием, CRM для гостей, аналитикой загрузки залов и интеграцией с кухонным оборудованием',
    results: [
      { metric: 'Увеличение бронирований', before: '45%', after: '78%', improvement: '+73%' },
      { metric: 'Средний чек', before: '2,400 ₽', after: '3,100 ₽', improvement: '+29%' },
      { metric: 'Обслуживание гостей', before: '25 мин', after: '18 мин', improvement: '-28%' },
      { metric: 'Повторные посещения', before: '35%', after: '62%', improvement: '+77%' },
      { metric: 'Ошибки заказов', before: '12%', after: '3%', improvement: '-75%' }
    ],
    technologies: ['React Native', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'WebSocket', 'Stripe'],
    testimonial: {
      text: 'Система полностью изменила наш подход к обслуживанию. Автоматическое распределение столиков и интеграция с кухней сократили время обслуживания на 30%. Гости стали приходить чаще благодаря удобному бронированию.',
      author: 'Ольга Иванова',
      position: 'Управляющая сетью',
      avatar: '👩‍🍳',
      rating: 5
    },
    budget: '1.8M ₽',
    teamSize: '4 специалиста',
    roi: '280% за 8 месяцев',
    implementationHighlights: [
      'Интеграция с 5 системами онлайн-бронирования',
      'Обучение 120+ сотрудников',
      'Миграция данных без остановки работы',
      'Круглосуточная техподдержка'
    ]
  },
  {
    id: '2',
    title: 'Автоматизация салонов красоты',
    client: 'Сеть "Элит-Стиль"',
    industry: 'Салон красоты',
    duration: '3 месяца',
    challenge: 'Ручная запись клиентов, потеря клиентской базы, сложности с напоминаниями, отсутствие системы лояльности, ручная отчетность по мастерам',
    solution: 'Разработана специализированная CRM с мобильным приложением для мастеров, системой напоминаний, программой лояльности и автоматической аналитикой',
    results: [
      { metric: 'Заполняемость', before: '65%', after: '92%', improvement: '+42%' },
      { metric: 'Лояльность клиентов', before: '40%', after: '75%', improvement: '+88%' },
      { metric: 'Отмены записей', before: '15%', after: '4%', improvement: '-73%' },
      { metric: 'Выручка на мастера', before: '85K ₽', after: '120K ₽', improvement: '+41%' },
      { metric: 'Время на администрирование', before: '20ч/нед', after: '4ч/нед', improvement: '-80%' }
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Twilio', 'Push Notifications', 'Stripe'],
    testimonial: {
      text: 'CRM система стала незаменимым инструментом для наших салонов. Автоматические напоминания сократили отмены в 3 раза, а программа лояльности увеличила повторные визиты. Мастера теперь тратят больше времени на клиентов, а не на бумажную работу.',
      author: 'Марина Петрова',
      position: 'Владелец сети',
      avatar: '💇‍♀️',
      rating: 5
    },
    budget: '1.2M ₽',
    teamSize: '3 специалиста',
    roi: '320% за 6 месяцев',
    implementationHighlights: [
      'Интеграция с мессенджерами для напоминаний',
      'Мобильное приложение для мастеров',
      'Система геймификации для персонала',
      'Автоматическая программа лояльности'
    ]
  },
  {
    id: '3',
    title: 'Управление фитнес-центром',
    client: 'Фитнес-клуб "Актив"',
    industry: 'Фитнес и спорт',
    duration: '5 месяцев',
    challenge: 'Ручная продажа абонементов, сложности с расписанием тренеров, отсутствие системы бронирования занятий, низкая вовлеченность клиентов, ручные платежи',
    solution: 'Создана комплексная платформа с системой бронирования занятий, мобильным приложением для клиентов, CRM для тренеров и интеграцией с платежными системами',
    results: [
      { metric: 'Продажи онлайн', before: '15%', after: '65%', improvement: '+333%' },
      { metric: 'Посещаемость', before: '58%', after: '82%', improvement: '+41%' },
      { metric: 'Удержание клиентов', before: '45%', after: '78%', improvement: '+73%' },
      { metric: 'Выручка', before: '1.2M ₽', after: '2.1M ₽', improvement: '+75%' },
      { metric: 'Нагрузка тренеров', before: '70%', after: '95%', improvement: '+36%' }
    ],
    technologies: ['React Native', 'Next.js', 'GraphQL', 'PostgreSQL', 'Redis', 'WebSocket'],
    testimonial: {
      text: 'Платформа позволила нам полностью перейти на цифровое обслуживание. Клиенты бронируют занятия через приложение, тренеры видят расписание в реальном времени, а мы получили полный контроль над бизнес-процессами. Рост выручки на 75% за полгода говорит сам за себя.',
      author: 'Алексей Сидоров',
      position: 'Директор клуба',
      avatar: '💪',
      rating: 5
    },
    budget: '2.1M ₽',
    teamSize: '5 специалистов',
    roi: '250% за первый год',
    implementationHighlights: [
      'Мобильное приложение для iOS и Android',
      'Интеграция с фитнес-браслетами',
      'Система персональных рекомендаций',
      'Автоматическое формирование расписания'
    ]
  }
];

const roleCards: RoleCard[] = [
  {
    id: 'user',
    title: 'Клиент',
    subtitle: 'Удобное бронирование и управление',
    icon: User,
    description: 'Современное мобильное приложение и веб-платформа для поиска, бронирования и оплаты услуг. Умные рекомендации, система лояльности и персональные предложения на основе предпочтений.',
    points: [
      'Поиск услуг по категориям, рейтингу и местоположению с AI-рекомендациями',
      'Онлайн-бронирование с выбором времени и предоплатой в 2 клика',
      'Электронные билеты и QR-коды для быстрого доступа к услугам',
      'Система отзывов и рейтингов с модерацией и фото-подтверждениями',
      'Персональные скидки и программа лояльности с кэшбэком',
      'Умные напоминания о бронированиях и персональные рекомендации',
      'История заказов и избранные провайдеры услуг',
      'Чат с провайдерами услуг для уточнения деталей',
      'Быстрая отмена и перенос бронирований с уведомлениями',
      'Мультиязычная поддержка и доступность 24/7'
    ],
    tech: ['React Native', 'PWA', 'WebSocket', 'Push Notifications', 'QR Codes', 'AI Recommendations', 'Stripe', 'Google Maps'],
    benefits: [
      'Экономия времени на поиск и бронирование услуг',
      'Лучшие цены и эксклюзивные предложения',
      'Гарантия качества и защита платежей',
      'Персональный подход и умные рекомендации',
      'Мгновенные уведомления и напоминания',
      'Простая отмена и возврат средств'
    ],
    gradient: 'from-blue-500 to-cyan-500',
    stats: [
      { label: 'Активных пользователей', value: '250K+', icon: Users },
      { label: 'Удовлетворенность', value: '96%', icon: Star },
      { label: 'Мобильные устройства', value: '88%', icon: Smartphone },
      { label: 'Повторные бронирования', value: '65%', icon: RefreshCw }
    ],
    features: [
      { title: 'Умный поиск', description: 'AI-рекомендации услуг на основе предпочтений, местоположения и отзывов с машинным обучением', icon: Search },
      { title: 'Быстрое бронирование', description: 'Бронирование в 2 клика с выбором времени, предоплатой и мгновенным подтверждением', icon: CalendarIcon },
      { title: 'Электронные билеты', description: 'QR-коды для быстрого доступа, оффлайн-режим и возможность передачи другому лицу', icon: QrCode },
      { title: 'Программа лояльности', description: 'Кэшбэк, персональные скидки и эксклюзивные предложения для постоянных клиентов', icon: Award }
    ],
    path: '/demo/services/user',
    badge: 'Popular',
    metrics: [
      { metric: 'Время бронирования', value: '45 сек', improvement: '-70%' },
      { metric: 'Удовлетворенность', value: '96%', improvement: '+28%' },
      { metric: 'Повторные обращения', value: '65%', improvement: '+40%' },
      { metric: 'Мобильные пользователи', value: '88%', improvement: '+35%' }
    ],
    demoVideo: '/demos/services-user-demo.mp4',
    accessLevel: 'basic',
    trainingTime: '5 минут',
    industries: ['Рестораны', 'Салон красоты', 'Фитнес', 'Развлечения', 'Образование']
  },
  {
    id: 'manager',
    title: 'Менеджер',
    subtitle: 'Панель управления услугами',
    icon: Users,
    description: 'Мощная система управления бронированиями, персоналом и ресурсами в реальном времени. Автоматическое распределение заказов, аналитика загрузки и инструменты для повышения эффективности команды.',
    points: [
      'Управление расписанием и бронированиями с AI-оптимизацией',
      'Мониторинг загрузки залов, столиков и мастеров в реальном времени',
      'Управление персоналом с учетом квалификации и загруженности',
      'Автоматические уведомления клиентам и напоминания персоналу',
      'Аналитика продаж и эффективности в реальном времени',
      'Управление ресурсами и инвентарем с автоматическим учетом',
      'Система отчетности и KPI для каждого сотрудника',
      'Интеграция с кассовыми системами и платежными терминалами',
      'Мобильное приложение для управления на ходу',
      'Чат с клиентами и внутренняя коммуникация команды'
    ],
    tech: ['React', 'Redux', 'WebSocket', 'Chart.js', 'Workbox', 'IndexedDB', 'Push Notifications', 'Stripe Terminal'],
    benefits: [
      'Автоматизация 85% рутинных операций',
      'Увеличение загрузки мощностей на 40%',
      'Снижение количества ошибок на 90%',
      'Рост удовлетворенности клиентов на 35%',
      'Экономия времени на администрирование 25+ часов в неделю',
      'Прозрачность всех бизнес-процессов'
    ],
    gradient: 'from-green-500 to-emerald-500',
    stats: [
      { label: 'Активных менеджеров', value: '15K+', icon: UserCheck },
      { label: 'Эффективность', value: '+45%', icon: TrendingUp },
      { label: 'Обработано заказов', value: '2.5M+', icon: CheckCircle2 },
      { label: 'Автоматизация', value: '85%', icon: Zap }
    ],
    features: [
      { title: 'Расписание в реальном времени', description: 'Интерактивное расписание с drag-and-drop, конфликтами и оптимизацией загрузки', icon: CalendarIcon },
      { title: 'Аналитика эффективности', description: 'KPI по сотрудникам, услугам и времени с AI-рекомендациями по оптимизации', icon: BarChart3 },
      { title: 'Управление ресурсами', description: 'Контроль инвентаря, помещений и оборудования с прогнозированием потребностей', icon: Package },
      { title: 'Мобильное управление', description: 'Полный функционал управления в мобильном приложении с оффлайн-режимом', icon: Smartphone }
    ],
    path: '/demo/services/manager',
    badge: 'Professional',
    metrics: [
      { metric: 'Загрузка мощностей', value: '92%', improvement: '+32%' },
      { metric: 'Время обработки заказа', value: '2 мин', improvement: '-80%' },
      { metric: 'Ошибки расписания', value: '1%', improvement: '-90%' },
      { metric: 'Эффективность персонала', value: '+45%', improvement: '+25%' }
    ],
    demoVideo: '/demos/services-manager-demo.mp4',
    accessLevel: 'standard',
    trainingTime: '3 часа',
    industries: ['Рестораны', 'Салон красоты', 'Фитнес', 'Отели', 'Медицина']
  },
  {
    id: 'owner',
    title: 'Владелец',
    subtitle: 'Бизнес-аналитика и управление',
    icon: Building2,
    description: 'Комплексная система бизнес-аналитики и стратегического управления для владельцев сетей услуг. AI-прогнозирование, финансовая аналитика и инструменты для масштабирования бизнеса.',
    points: [
      'Консолидированная отчетность по всем филиалам и направлениям',
      'Финансовая аналитика с AI-прогнозированием выручки и расходов',
      'KPI и метрики эффективности бизнеса в реальном времени',
      'Управление мульти-брендовой структурой и франчайзингом',
      'AI-прогнозирование спроса и оптимизация ценообразования',
      'Бенчмаркинг и сравнительная аналитика с конкурентами',
      'Управление рисками и предиктивная аналитика проблем',
      'Автоматическая генерация отчетов для инвесторов и партнеров',
      'Стратегическое планирование с моделированием сценариев',
      'Мониторинг рыночных трендов и адаптация бизнес-модели'
    ],
    tech: ['TypeScript', 'GraphQL', 'D3.js', 'Machine Learning', 'Python', 'Apache ECharts', 'TensorFlow', 'FastAPI'],
    benefits: [
      'Прозрачность финансовых показателей в реальном времени',
      'Data-driven принятие стратегических решений',
      'Рост рентабельности бизнеса на 25-40%',
      'Снижение операционных рисков на 60%',
      'Автоматизация стратегического планирования',
      'Масштабирование без потери контроля качества'
    ],
    gradient: 'from-purple-500 to-indigo-500',
    stats: [
      { label: 'Компаний', value: '8,500+', icon: Building2 },
      { label: 'Рост выручки', value: '+32%', icon: TrendingUp },
      { label: 'Автоматизация', value: '90%', icon: Zap },
      { label: 'ROI', value: '350%', icon: LineChart }
    ],
    features: [
      { title: 'BI-дашборды', description: 'Интерактивные панели с глубокой аналитикой по всем бизнес-метрикам с drill-down', icon: PieChart },
      { title: 'AI-прогнозирование', description: 'Прогнозы выручки, спроса и рисков с доверительными интервалами и сценариями', icon: Brain },
      { title: 'Мульти-бренд управление', description: 'Управление несколькими брендами и филиалами с консолидированной отчетностью', icon: GitBranch },
      { title: 'Стратегическая аналитика', description: 'Анализ рыночных трендов, конкурентов и оптимизация бизнес-модели', icon: Target }
    ],
    path: '/demo/services/owner',
    badge: 'Enterprise',
    metrics: [
      { metric: 'Рентабельность', value: '+28%', improvement: 'За год' },
      { metric: 'Снижение затрат', value: '-35%', improvement: 'Оптимизация' },
      { metric: 'Рост выручки', value: '+32%', improvement: 'За 6 месяцев' },
      { metric: 'Время отчетности', value: '-95%', improvement: 'Автоматизация' }
    ],
    demoVideo: '/demos/services-owner-demo.mp4',
    accessLevel: 'premium',
    trainingTime: '6 часов',
    industries: ['Все отрасли услуг', 'Франчайзинг', 'Сетевой бизнес', 'Инвестиции']
  },
];

const features: Feature[] = [
  {
    id: 'booking',
    title: 'Система бронирования',
    description: 'Интеллектуальная система онлайн-бронирования',
    icon: CalendarIcon,
    gradient: 'from-blue-500 to-cyan-500',
    tech: ['React', 'Node.js', 'WebSocket', 'Redis', 'Google Calendar API', 'iCal', 'FullCalendar'],
    scenarios: [
      'Онлайн-бронирование с выбором времени и ресурсов в реальном времени',
      'Автоматическое распределение заказов между сотрудниками по квалификации',
      'Управление повторяющимися бронированиями и абонементами',
      'Интеграция с внешними календарями и системами бронирования',
      'Динамическое ценообразование на основе спроса и загрузки',
      'Умные уведомления и напоминания для клиентов и персонала'
    ],
    stats: [
      { value: '99.9%', label: 'Доступность', icon: ShieldCheck },
      { value: '<100мс', label: 'Время ответа', icon: Zap },
      { value: '50K+', label: 'Бронирований/день', icon: CalendarIcon },
      { value: '95%', label: 'Автоматизация', icon: CheckCircle2 }
    ],
    benchmarks: ['Response Time < 100ms', 'Uptime 99.9%', 'Concurrent Users 10K+', 'Booking Accuracy 99.99%'],
    documentation: '/docs/booking-system',
    status: 'stable',
    releaseDate: '2024-01-15',
    industries: ['Рестораны', 'Салон красоты', 'Фитнес', 'Отели', 'Медицина', 'Образование']
  },
  {
    id: 'payments',
    title: 'Платежная система',
    description: 'Универсальная платежная платформа с поддержкой оплаты',
    icon: CreditCardIcon,
    gradient: 'from-green-500 to-emerald-500',
    tech: ['Stripe', 'Apple Pay', 'Google Pay', 'Sberbank API', 'Tinkoff API', '3D-Secure', 'PCI DSS'],
    scenarios: [
      'Прием онлайн-платежей с поддержкой 50+ платежных систем',
      'Автоматическое списание по подпискам и рекуррентным платежам',
      'Разделение счетов между несколькими клиентами',
      'Возвраты и частичные возвраты с автоматическим уведомлением',
      'Защита от мошенничества с машинным обучением',
      'Мульти-валютные операции с автоматической конвертацией'
    ],
    stats: [
      { value: '99.95%', label: 'Success Rate', icon: CheckCircle2 },
      { value: '<2с', label: 'Processing Time', icon: Clock },
      { value: '0', label: 'Security Incidents', icon: Shield },
      { value: '50+', label: 'Payment Methods', icon: CreditCardIcon }
    ],
    benchmarks: ['PCI DSS Compliant', 'Success Rate 99.95%', 'Fraud Detection 99.9%', 'Multi-currency Support'],
    documentation: '/docs/payment-system',
    status: 'stable',
    releaseDate: '2024-01-10',
    industries: ['Все отрасли услуг']
  },
  {
    id: 'analytics',
    title: 'Бизнес-аналитика',
    description: 'Мощная система аналитики с AI-инсайтами и кастомизируемыми дашбордами',
    icon: BarChart3,
    gradient: 'from-purple-500 to-indigo-500',
    tech: ['Apache Superset', 'Apache Druid', 'd3.js', 'TensorFlow', 'Apache ECharts', 'Metabase'],
    scenarios: [
      'Real-time дашборды с ключевыми метриками бизнеса',
      'AI-прогнозирование спроса и выручки на основе исторических данных',
      'Анализ клиентского поведения и сегментация аудитории',
      'Сравнительная аналитика между филиалами и конкурентами',
      'Автоматическое выявление аномалий и проблемных зон',
      'Кастомизируемые отчеты для разных стейкхолдеров'
    ],
    stats: [
      { value: '1M+', label: 'Data Points/Day', icon: Database },
      { value: '<3с', label: 'Query Time', icon: Gauge },
      { value: '95%', label: 'Prediction Accuracy', icon: Target },
      { value: '50+', label: 'Pre-built Reports', icon: FileText }
    ],
    benchmarks: ['Query Performance < 3s', 'Data Freshness < 1m', 'Prediction Accuracy > 90%', 'Real-time Processing'],
    documentation: '/docs/business-analytics',
    status: 'stable',
    releaseDate: '2024-01-25',
    industries: ['Все отрасли услуг']
  },
  {
    id: 'crm',
    title: 'CRM и лояльность',
    description: 'Комплексная CRM система с программой лояльности, автоматизацией маркетинга и управлением клиентским опытом. Персональные предложения и увеличение LTV клиентов.',
    icon: Users,
    gradient: 'from-pink-500 to-rose-500',
    tech: ['React', 'Node.js', 'MongoDB', 'Redis', 'SendGrid', 'Twilio', 'Mailchimp API'],
    scenarios: [
      'Единая база клиентов с историей взаимодействий и предпочтениями',
      'Программа лояльности с кэшбэком, бонусами и персональными скидками',
      'Автоматизация email и SMS рассылок на основе поведения клиентов',
      'Сегментация клиентов для таргетированных маркетинговых кампаний',
      'Управление отзывами и репутацией с автоматической модерацией',
      'Интеграция с социальными сетями и мессенджерами'
    ],
    stats: [
      { value: '45%', label: 'LTV Increase', icon: TrendingUp },
      { value: '68%', label: 'Repeat Customers', icon: RefreshCw },
      { value: '3.2x', label: 'ROI Campaigns', icon: LineChart },
      { value: '85%', label: 'Satisfaction', icon: Star }
    ],
    benchmarks: ['LTV Increase > 40%', 'Repeat Rate > 60%', 'Campaign ROI > 3x', 'Satisfaction > 80%'],
    documentation: '/docs/crm-loyalty',
    status: 'stable',
    releaseDate: '2024-02-01',
    industries: ['Рестораны', 'Салон красоты', 'Фитнес', 'Ритейл', 'Образование']
  },
  {
    id: 'mobile',
    title: 'Мобильная платформа',
    description: 'Нативные мобильные приложения для iOS и Android с оффлайн-режимом, push-уведомлениями и премиальным пользовательским опытом. Полная функциональность веб-версии.',
    icon: Smartphone,
    gradient: 'from-orange-500 to-amber-500',
    tech: ['React Native', 'iOS SDK', 'Android SDK', 'Firebase', 'Push Notifications', 'Biometric Auth'],
    scenarios: [
      'Нативные приложения с премиальным UI/UX для iOS и Android',
      'Оффлайн-работа с синхронизацией при появлении соединения',
      'Push-уведомления о бронированиях, акциях и напоминаниях',
      'Биометрическая аутентификация и Apple Pay/Google Pay',
      'Глубокие ссылки и шеринг в социальные сети',
      'AR-просмотр услуг и виртуальные туры'
    ],
    stats: [
      { value: '4.8/5', label: 'App Store Rating', icon: Star },
      { value: '88%', label: 'Mobile Users', icon: Smartphone },
      { value: '<1.5с', label: 'Load Time', icon: Zap },
      { value: '95%', label: 'Offline Support', icon: CloudOff }
    ],
    benchmarks: ['App Rating > 4.5', 'Load Time < 2s', 'Crash Rate < 0.1%', 'Offline Capabilities'],
    documentation: '/docs/mobile-platform',
    status: 'stable',
    releaseDate: '2024-01-20',
    industries: ['Все отрасли услуг']
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
   MAIN COMPONENT
============================================================================ */
export default function ServicesDemoPage() {
  const [modal, dispatch] = useReducer(modalReducer, { type: 'idle' });
  const initialKpis = useMemo(() => [
    { 
      label: 'Активных клиентов', 
      value: 254800, 
      icon: Users, 
      trend: 'up' as const, 
      description: 'Пользователи платформы',
      format: 'number'
    },
    { 
      label: 'Бронирований в день', 
      value: 52300, 
      icon: CalendarIcon, 
      trend: 'up' as const, 
      description: 'Среднее количество',
      format: 'number'
    },
    { 
      label: 'Удовлетворенность', 
      value: 96.2, 
      suffix: '%', 
      icon: Star, 
      trend: 'up' as const, 
      description: 'NPS и отзывы',
      format: 'percentage'
    },
    { 
      label: 'Средний чек', 
      value: 2850, 
      suffix: '₽', 
      icon: CreditCardIcon, 
      trend: 'up' as const, 
      description: 'По всем услугам',
      format: 'currency'
    },
  ], []);
  
  const kpis = useKpiAnimation(initialKpis);
  const mousePosition = useMousePosition();
  const scrollProgress = useScrollProgress();
  const { isMobile, isTablet, isDesktop, isLarge } = useViewportDetection();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visitedSections, setVisitedSections] = useLocalStorage<string[]>('visited-sections', []);
  const [lastVisit, setLastVisit] = useLocalStorage<string>('last-visit', new Date().toISOString());

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
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        // Focus search
        const searchButton = document.querySelector('button[aria-label="Search"]') as HTMLButtonElement;
        searchButton?.click();
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

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [visitedSections, setVisitedSections]);

  // Update last visit
  useEffect(() => {
    setLastVisit(new Date().toISOString());
  }, [setLastVisit]);

  // Page analytics
  useEffect(() => {
    // Track page view
    console.log('Services Demo Page loaded', {
      viewport: { isMobile, isTablet, isDesktop, isLarge },
      timestamp: new Date().toISOString(),
      lastVisit,
      visitedSections
    });
  }, [isMobile, isTablet, isDesktop, isLarge, lastVisit, visitedSections]);

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
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50"
        style={{ width: `${scrollProgress}%` }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />
      
      {/* Floating Particles */}
      <FloatingParticles count={APP_CONFIG.features.particleCount} />
      
      {/* Keyboard Shortcut Helper */}
      {isDesktop && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="fixed bottom-4 right-4 z-40"
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/50 backdrop-blur border border-white/10 text-white/60 text-sm">
            <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs">K</kbd>
            <span>для связи</span>
          </div>
        </motion.div>
      )}

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

        {/* Industries Section */}
        <IndustriesSection visitedSections={visitedSections} />

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
        {modal.type === 'video' && (
          <VideoModal 
            url={modal.payload.url}
            title={modal.payload.title}
            onClose={() => dispatch({ type: 'CLOSE' })}
          />
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <CustomStyles />
    </div>
  );
}

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
              ${COLOR_PALETTE.primary.purple} 0%, transparent 50%),
            radial-gradient(circle at ${mousePosition.x}% ${100 - mousePosition.y}%, 
              ${COLOR_PALETTE.primary.cyan} 0%, transparent 50%)
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
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
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
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
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

function FloatingParticles({ count }: { count: number }) {
  const particles = useMemo(() => {
    const formatUnit = (value: number, unit: string) => `${value.toFixed(4)}${unit}`;
    const formatNumber = (value: number) => Number(value.toFixed(4));

    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: count }).map((_, i) => {
      const seed = i + 1;
      const initialX = pseudoRandom(seed * 1.13) * 100;
      const initialY = pseudoRandom(seed * 1.97) * 100;
      const targetX = pseudoRandom(seed * 2.71) * 100;
      const targetY = pseudoRandom(seed * 3.53) * 100;
      const scale = pseudoRandom(seed * 4.19) * 0.5 + 0.5;
      const duration = pseudoRandom(seed * 5.31) * 10 + 10;
      const delay = pseudoRandom(seed * 6.47) * 5;
      const size = pseudoRandom(seed * 7.61) * 3 + 1;
      const opacity = pseudoRandom(seed * 8.83) * 0.3 + 0.1;

      return {
        initialX: formatUnit(initialX, 'vw'),
        initialY: formatUnit(initialY, 'vh'),
        targetX: formatUnit(targetX, 'vw'),
        targetY: formatUnit(targetY, 'vh'),
        scale: formatNumber(scale),
        duration: formatNumber(duration),
        delay: formatNumber(delay),
        size: formatNumber(size),
        opacity: formatNumber(opacity),
      };
    });
  }, [count]);

  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute bg-blue-400/30 rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              left: particle.initialX,
              top: particle.initialY,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-400/30 rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            scale: particle.scale,
          }}
          animate={{
            y: [particle.initialY, particle.targetY],
            x: [particle.initialX, particle.targetX],
            opacity: [0, particle.opacity, 0],
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    { name: 'Отрасли', href: '#industries', icon: Building2 },
    { name: 'Технологии', href: '#tech', icon: Code2 },
    { name: 'Команда', href: '#team', icon: Heart },
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              {!reducedMotion && (
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  animate={{ rotate: [0, 180] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {APP_CONFIG.company.name}
              </span>
              {APP_CONFIG.company.demo && (
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
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"
                  layoutId="navIndicator"
                />
              </motion.a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <motion.button
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm font-medium hover:bg-white/10 transition backdrop-blur"
              aria-label="Search"
            >
            </motion.button>

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

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchModal onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ============================================================================
   SEARCH MODAL COMPONENT
============================================================================ */
function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!debouncedQuery) return [];
    
    const allItems = [
      ...roleCards.map(role => ({
        type: 'role' as const,
        title: role.title,
        description: role.subtitle,
        icon: role.icon,
        href: `#${role.id}`,
        category: 'Демо роли'
      })),
      ...features.map(feature => ({
        type: 'feature' as const,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        href: `#${feature.id}`,
        category: 'Возможности'
      })),
      ...caseStudies.map(caseStudy => ({
        type: 'case' as const,
        title: caseStudy.title,
        description: caseStudy.client,
        icon: FileText,
        href: `#${caseStudy.id}`,
        category: 'Кейсы'
      }))
    ];

    return allItems.filter(item =>
      item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(debouncedQuery.toLowerCase())
    ).slice(0, 8);
  }, [debouncedQuery]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative p-4 border-b border-white/10">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Поиск по демо-платформе..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-white placeholder-white/40 text-lg"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="h-5 w-5 text-white/40" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((result, index) => (
                <motion.a
                  key={`${result.type}-${index}`}
                  href={result.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                  onClick={onClose}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition">
                    <result.icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">{result.title}</div>
                    <div className="text-white/60 text-sm truncate">{result.description}</div>
                  </div>
                  <div className="text-xs text-white/40 px-2 py-1 rounded bg-white/5">
                    {result.category}
                  </div>
                </motion.a>
              ))}
            </div>
          ) : debouncedQuery ? (
            <div className="p-8 text-center text-white/40">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <div className="text-lg font-semibold mb-2">Ничего не найдено</div>
              <div className="text-sm">Попробуйте изменить запрос</div>
            </div>
          ) : (
            <div className="p-8 text-center text-white/40">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <div className="text-lg font-semibold mb-2">Начните вводить запрос</div>
              <div className="text-sm">Ищите по ролям, возможностям и кейсам</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/40">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                <ArrowDown className="h-3 w-3" />
                <span>Навигация</span>
              </div>
              <div className="flex items-center gap-1">
                <EnterIcon className="h-3 w-3" />
                <span>Выбрать</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EscIcon className="h-3 w-3" />
              <span>Закрыть</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Иконки для поиска
const ArrowUp = () => <span>↑</span>;
const ArrowDown = () => <span>↓</span>;
const EnterIcon = () => <span>↵</span>;
const EscIcon = () => <span>ESC</span>;

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
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
          Service Platform 2024 • Enterprise Edition
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Сфера
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              услуг
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed px-4 text-balance"
          >
            Единая платформа для управления сервисным бизнесом. Рестораны, салоны красоты, 
            фитнес-центры — автоматизация всех процессов от бронирования до аналитики.
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
            onClick={() => window.open('/demo/services/user', '_blank')}
            className="group relative bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-2xl w-full sm:w-auto"
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
                  <kpi.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  <motion.div
                    animate={{ 
                      rotate: kpi.trend === 'up' ? 0 : kpi.trend === 'down' ? 180 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp className={`h-4 w-4 ${
                      kpi.trend === 'up' ? 'text-emerald-400' : 
                      kpi.trend === 'down' ? 'text-rose-400' : 
                      'text-yellow-400'
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
                    {kpi.delta >= 0 ? '+' : ''}{kpi.delta.toFixed(2)}{kpi.suffix}
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
   ROLES SECTION
============================================================================ */
function RolesSection({ onOpen, visitedSections }: { 
  onOpen: (r: RoleCard) => void; 
  visitedSections: string[];
}) {
  const hasVisited = visitedSections.includes('roles');
  
  return (
    <section id="roles" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Демонстрационные роли
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Исследуйте полный функционал платформы через различные пользовательские роли с реальными сценариями из сферы услуг
          </p>
        </motion.div>

        {/* Roles Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
        >
          {roleCards.map((role, index) => (
            <motion.div
              key={role.id}
              variants={fadeUp(index * 0.1)}
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
                        <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mx-auto mb-1 sm:mb-2" />
                        <div className="text-base sm:text-lg font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-white/60 leading-tight">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Industries */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-xs sm:text-sm font-semibold text-white/80 mb-2">Отрасли:</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.industries.slice(0, 3).map((industry) => (
                        <span 
                          key={industry}
                          className="px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-white/80 text-xs backdrop-blur hover:bg-white/20 transition-colors"
                        >
                          {industry}
                        </span>
                      ))}
                      {role.industries.length > 3 && (
                        <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-white/60 text-xs">
                          +{role.industries.length - 3}
                        </span>
                      )}
                    </div>
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
        </motion.div>
      </div>
    </section>
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
    <section id="features" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Ключевые возможности
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Современные технологии и проверенные решения для эффективного управления сервисным бизнесом
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              {...fadeUp(index * 0.2)}
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
                        <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 mx-auto mb-1" />
                        <div className="text-sm sm:text-base font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/60 leading-tight line-clamp-2">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Industries */}
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-white/80 mb-1 sm:mb-2">Отрасли:</h4>
                    <div className="flex flex-wrap gap-1">
                      {feature.industries.slice(0, 3).map((industry) => (
                        <span 
                          key={industry}
                          className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/70 text-xs hover:bg-white/20 transition-colors"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Scenarios Preview */}
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-white/80 mb-1 sm:mb-2">Основные сценарии:</h4>
                    <ul className="text-xs text-white/60 space-y-1">
                      {feature.scenarios.slice(0, 2).map((scenario, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0" />
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
      </div>
    </section>
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
    <section id="cases" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Реальные кейсы
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Успешные внедрения платформы в сервисных компаниях с измеримыми результатами
          </p>
        </motion.div>

        {/* Case Studies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {caseStudies.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.id}
              {...fadeUp(index * 0.2)}
              whileHover={{ y: -8 }}
              className="group relative cursor-pointer"
              onClick={() => onOpen(caseStudy)}
            >
              <SpotlightCard className="h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{caseStudy.title}</h3>
                    <p className="text-blue-400 font-semibold text-sm sm:text-base mb-1">{caseStudy.client}</p>
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
      </div>
    </section>
  );
}

/* ============================================================================
   INDUSTRIES SECTION
============================================================================ */
function IndustriesSection({ visitedSections }: { visitedSections: string[] }) {
  const hasVisited = visitedSections.includes('industries');
  const industries = [
    {
      name: 'Рестораны и кафе',
      icon: Utensils,
      description: 'Полный цикл от бронирования столиков до управления кухней',
      metrics: ['+45% бронирований', '+29% средний чек', '-28% время обслуживания'],
      color: 'from-orange-500 to-amber-500'
    },
    {
      name: 'Салон красоты',
      icon: Scissors,
      description: 'Управление записями, мастерами и программой лояльности',
      metrics: ['+42% заполняемость', '+88% лояльность', '-73% отмены'],
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Фитнес и спорт',
      icon: Dumbbell,
      description: 'Бронирование занятий, управление тренерами и абонементы',
      metrics: ['+333% онлайн-продажи', '+41% посещаемость', '+75% выручка'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Отели и проживание',
      icon: HomeIcon,
      description: 'Система бронирования номеров и управления отелем',
      metrics: ['+65% онлайн-бронирований', '+38% загрузка', '+52% выручка'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Образование',
      icon: BookOpen,
      description: 'Управление курсами, расписанием и студентами',
      metrics: ['+70% онлайн-записей', '+48% удержание', '+35% завершение'],
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <section id="industries" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Поддержка отраслей
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Специализированные решения для различных видов сервисного бизнеса
          </p>
        </motion.div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              {...fadeUp(index * 0.1)}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <SpotlightCard className="h-full">
                <div className="relative z-10 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${industry.color} shadow-lg flex-shrink-0`}>
                      <industry.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{industry.name}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-white/70 mb-4 sm:mb-6 leading-relaxed flex-grow text-sm sm:text-base">
                    {industry.description}
                  </p>

                  {/* Metrics */}
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-white/80">Результаты внедрения:</h4>
                    <div className="space-y-1">
                      {industry.metrics.map((metric, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   TECH STACK SECTION
============================================================================ */
function TechStackSection({ visitedSections }: { visitedSections: string[] }) {
  const hasVisited = visitedSections.includes('tech');
  const technologies = [
    {
      category: "Frontend",
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      items: [
        { name: 'Next.js 14', icon: Layers, description: 'React фреймворк', status: 'stable' },
        { name: 'TypeScript', icon: Shield, description: 'Типизированный JavaScript', status: 'stable' },
        { name: 'Tailwind CSS', icon: Palette, description: 'Utility-first CSS', status: 'stable' },
        { name: 'React Native', icon: Smartphone, description: 'Мобильные приложения', status: 'stable' },
      ]
    },
    {
      category: "Backend",
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      items: [
        { name: 'Node.js', icon: Cpu, description: 'JavaScript runtime', status: 'stable' },
        { name: 'PostgreSQL', icon: Database, description: 'Реляционная БД', status: 'stable' },
        { name: 'Redis', icon: Zap, description: 'In-memory data store', status: 'stable' },
        { name: 'GraphQL', icon: GitBranch, description: 'Query language', status: 'stable' },
      ]
    },
    {
      category: "Cloud & DevOps",
      icon: CloudIcon,
      color: 'from-purple-500 to-indigo-500',
      items: [
        { name: 'Docker', icon: Package, description: 'Containerization', status: 'stable' },
        { name: 'Kubernetes', icon: Workflow, description: 'Orchestration', status: 'stable' },
        { name: 'AWS', icon: CloudIcon, description: 'Cloud platform', status: 'stable' },
        { name: 'Terraform', icon: Settings, description: 'Infrastructure as Code', status: 'stable' },
      ]
    },
    {
      category: "AI & Analytics",
      icon: Brain,
      color: 'from-pink-500 to-rose-500',
      items: [
        { name: 'TensorFlow', icon: Brain, description: 'Machine Learning', status: 'beta' },
        { name: 'Apache Superset', icon: BarChart3, description: 'Business Intelligence', status: 'stable' },
        { name: 'd3.js', icon: ChartEmojiIcon, description: 'Data Visualization', status: 'stable' },
        { name: 'Apache Druid', icon: Database, description: 'Real-time Analytics', status: 'stable' },
      ]
    }
  ];

  return (
    <section id="tech" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Технологический стек
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Современные технологии для создания высокопроизводительных сервисных платформ
          </p>
        </motion.div>

        {/* Tech Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-12">
          {technologies.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              {...fadeUp(categoryIndex * 0.2)}
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
                      {...fadeUp(categoryIndex * 0.2 + techIndex * 0.1)}
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
          {...fadeUp(0.8)}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {[
              { 
                icon: ShieldCheck, 
                title: "Безопасность", 
                description: "PCI DSS, GDPR, OAuth2, End-to-end Encryption",
                features: ["Аудит действий", "2FA", "Шифрование данных"]
              },
              { 
                icon: Zap, 
                title: "Производительность", 
                description: "CDN, Caching, Real-time Updates, PWA",
                features: ["<100ms response", "99.9% uptime", "Auto-scaling"]
              },
              { 
                icon: TrendingUp, 
                title: "Масштабируемость", 
                description: "Microservices, Multi-tenant, Cloud Native",
                features: ["50K+ RPS", "Multi-region", "Zero-downtime"]
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                {...fadeUp(1 + index * 0.1)}
                whileHover={{ y: -4 }}
                className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all"
              >
                <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mb-3 mx-auto" />
                <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{item.title}</h4>
                <p className="text-white/60 text-xs sm:text-sm mb-3">{item.description}</p>
                <div className="space-y-1">
                  {item.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                      <div className="w-1 h-1 bg-blue-400 rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ChartEmojiIcon component
function ChartEmojiIcon() {
  return <div role="img" aria-label="chart" className="text-lg">📊</div>;
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
    <section id="team" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Наша команда
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Профессионалы с глубокой экспертизой в создании сервисных платформ
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              {...fadeUp(index * 0.1)}
              whileHover={{ y: -8 }}
              className="group relative cursor-pointer"
              onClick={() => onOpenMember(member)}
            >
              <SpotlightCard className="h-full">
                {/* Avatar & Basic Info */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{member.avatar}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{member.name}</h3>
                  <p className="text-blue-400 text-sm sm:text-base mb-1 sm:mb-2">{member.role}</p>
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
              
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Team Stats */}
        <motion.div
          {...fadeUp(0.8)}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto">
            {[
              { value: '150+', label: 'Завершенных проектов', icon: CheckCircle2 },
              { value: '4+', label: 'Лет опыта', icon: Calendar },
              { value: '99.9%', label: 'Доступность систем', icon: ShieldCheck },
              { value: '24/7', label: 'Поддержка', icon: Clock },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeUp(1 + index * 0.1)}
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/60 text-xs sm:text-sm leading-tight">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================================
   STATISTICS SECTION
============================================================================ */
function StatisticsSection({ visitedSections }: { visitedSections: string[] }) {
  const hasVisited = visitedSections.includes('stats');
  const stats = [
    {
      value: '254,800',
      label: 'Активных клиентов',
      description: 'Пользователи платформы',
      change: '+12%',
      trend: 'up' as const,
      icon: Users
    },
    {
      value: '52,300',
      label: 'Бронирований в день',
      description: 'Среднее количество',
      change: '+18%',
      trend: 'up' as const,
      icon: CalendarIcon
    },
    {
      value: '96.2%',
      label: 'Удовлетворенность',
      description: 'NPS и отзывы',
      change: '+5.2%',
      trend: 'up' as const,
      icon: Star
    },
    {
      value: '2,850₽',
      label: 'Средний чек',
      description: 'По всем услугам',
      change: '+8%',
      trend: 'up' as const,
      icon: CreditCardIcon
    },
    {
      value: '15,000+',
      label: 'Провайдеров услуг',
      description: 'Компании на платформе',
      change: '+25%',
      trend: 'up' as const,
      icon: Building2
    },
    {
      value: '99.9%',
      label: 'Доступность',
      description: 'Uptime системы',
      change: '+0.4%',
      trend: 'up' as const,
      icon: ShieldCheck
    }
  ];

  return (
    <section id="stats" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Статистика платформы
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Реальные метрики и показатели эффективности нашей сервисной платформы
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              {...fadeUp(index * 0.1)}
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
      </div>
    </section>
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
    { name: 'Отрасли', href: '#industries', icon: Building2 },
    { name: 'Технологии', href: '#tech', icon: Code2 },
    { name: 'Команда', href: '#team', icon: Heart },
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
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">ServicePlatform</span>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
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
                        <item.icon className="h-5 w-5 text-blue-400" />
                        <span className="font-medium text-sm">{item.name}</span>
                        <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                    Быстрые действия
                  </h4>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        window.open('/demo/services/user', '_blank');
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition text-sm"
                    >
                      <Rocket className="h-4 w-4 text-blue-400" />
                      Начать демо
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onContact();
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition text-sm font-semibold"
                    >
                      <MessageSquareMore className="h-4 w-4" />
                      Связаться с нами
                    </motion.button>
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-white/10">
                <div className="space-y-3 text-white/60 text-xs">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {APP_CONFIG.company.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {APP_CONFIG.company.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Пн-Пт 9:00-18:00
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                  {[Github, Twitter, Linkedin].map((Icon, index) => (
                    <motion.a
                      key={index}
                      whileHover={{ scale: 1.1, y: -2 }}
                      href="#"
                      className="p-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
                    >
                      <Icon className="h-4 w-4 text-white/60 hover:text-white" />
                    </motion.a>
                  ))}
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
   BASE MODAL COMPONENT
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
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
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

/* ============================================================================
   ROLE MODAL
============================================================================ */
function RoleModal({ 
  role, 
  onClose, 
  onOpenVideo 
}: { 
  role: RoleCard; 
  onClose: () => void;
  onOpenVideo: (url: string, title: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech' | 'industries'>('overview');

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
              <Section title="Описание">
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">{role.description}</p>
              </Section>

              <Section title="Ключевые преимущества">
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
              </Section>

              <Section title="Основные возможности">
                <ul className="space-y-2 sm:space-y-3">
                  {role.points.map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-white/80 text-sm sm:text-base"
                    >
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </Section>
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
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mb-3" />
                  <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{feature.title}</h4>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'tech' && (
            <>
              <Section title="Технологический стек">
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
              </Section>

              <Section title="Метрики эффективности">
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
              </Section>
            </>
          )}

          {activeTab === 'industries' && (
            <Section title="Поддерживаемые отрасли">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {role.industries.map((industry, index) => (
                  <motion.div
                    key={industry}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                    <span className="text-white/90 text-sm sm:text-base">{industry}</span>
                  </motion.div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Section title="Статистика">
            <div className="space-y-2 sm:space-y-3">
              {role.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm sm:text-base">{stat.value}</div>
                    <div className="text-white/60 text-xs sm:text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Детали роли">
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
          </Section>

          {role.badge && (
            <Section title="Статус">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${
                role.badge === 'Popular' ? 'bg-blue-500/20 text-blue-400' :
                role.badge === 'Professional' ? 'bg-green-500/20 text-green-400' :
                role.badge === 'Enterprise' ? 'bg-purple-500/20 text-purple-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                <Award className="h-4 w-4" />
                <span className="font-semibold text-sm">{role.badge}</span>
              </div>
            </Section>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open(role.path, '_blank')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition shadow-lg text-sm sm:text-base"
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
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mx-auto mb-1 sm:mb-2" />
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
              <Calendar className="h-4 w-4 text-blue-400" />
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
        <Section title="Основные сценарии">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {feature.scenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/90 text-sm sm:text-base">{scenario}</span>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Industries */}
        <Section title="Поддерживаемые отрасли">
          <div className="flex flex-wrap gap-2">
            {feature.industries.map((industry, index) => (
              <span 
                key={industry}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs sm:text-sm hover:bg-white/20 transition-colors"
              >
                {industry}
              </span>
            ))}
          </div>
        </Section>

        {/* Technologies */}
        <Section title="Технологии">
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
        </Section>

        {/* Benchmarks */}
        <Section title="Бенчмарки">
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
        </Section>
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
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Срок</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.duration}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Улучшение</div>
            <div className="font-semibold text-white text-sm sm:text-base">+{caseStudy.results[0]?.improvement}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Охват</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.results[1]?.after}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mx-auto mb-1 sm:mb-2" />
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
          <Section title="Задача">
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">{caseStudy.challenge}</p>
          </Section>
          <Section title="Решение">
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">{caseStudy.solution}</p>
          </Section>
        </div>

        {/* Results */}
        <Section title="Результаты">
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
        </Section>

        {/* Implementation Highlights */}
        {caseStudy.implementationHighlights && (
          <Section title="Ключевые моменты внедрения">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {caseStudy.implementationHighlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 text-white/70 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Technologies */}
        <Section title="Технологии">
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
        </Section>

        {/* Testimonial */}
        {caseStudy.testimonial && (
          <Section title="Отзыв клиента">
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
                      <div className="text-blue-400 text-xs sm:text-sm">{caseStudy.testimonial.position}</div>
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
          </Section>
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
            <p className="text-blue-400 text-lg sm:text-xl mb-2">{member.role}</p>
            <p className="text-white/60 text-sm sm:text-base">{member.experience} • {member.projects} проектов</p>
            <p className="text-white/50 text-xs sm:text-sm mt-1">В команде с {new Date(member.joinDate).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        {/* Bio */}
        {member.bio && (
          <Section title="О специалисте">
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">{member.bio}</p>
          </Section>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Expertise */}
          <Section title="Экспертиза">
            <div className="space-y-2">
              {member.expertise.map((skill, index) => (
                <div key={index} className="flex items-center gap-3 text-white/80 text-sm sm:text-base">
                  <Sparkles className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Specialization */}
          <Section title="Специализация">
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
          </Section>
        </div>

        {/* Technologies */}
        <Section title="Технологии">
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
        </Section>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {member.certifications && member.certifications.length > 0 && (
            <Section title="Сертификаты">
              <div className="space-y-2">
                {member.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/70 text-sm">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </BaseModal>
  );
}

/* ============================================================================
   VIDEO MODAL COMPONENT
============================================================================ */
function VideoModal({ url, title, onClose }: { 
  url: string; 
  title: string; 
  onClose: () => void;
}) {
  return (
    <BaseModal
      title={title}
      subtitle="Демонстрация функционала"
      onClose={onClose}
      size="max-w-4xl"
      icon={Video}
    >
      <div className="aspect-video bg-black rounded-xl overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center text-white/60">
            <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">Демо видео</p>
            <p className="text-sm mt-2">{url}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-white/60 text-sm">
        <p>В реальной реализации здесь будет встроенный видеоплеер</p>
      </div>
    </BaseModal>
  );
}
/* ============================================================================
   CONTACT MODAL COMPONENT
============================================================================ */
function ContactModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    interest: 'demo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Имитация отправки формы
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    onSubmit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <BaseModal
      title="Связаться с нами"
      subtitle="Обсудим ваш проект и предложим лучшее решение"
      onClose={onClose}
      size="max-w-md"
      icon={MessageSquareMore}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
            Имя *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ваше имя"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-white/80 mb-2">
            Компания
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Название компании"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
            Телефон
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+7 (XXX) XXX-XX-XX"
          />
        </div>

        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-white/80 mb-2">
            Интерес
          </label>
          <select
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="demo">Демонстрация</option>
            <option value="consultation">Консультация</option>
            <option value="partnership">Партнерство</option>
            <option value="support">Техподдержка</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
            Сообщение *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Расскажите о вашем проекте..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Отправка...
            </div>
          ) : (
            'Отправить сообщение'
          )}
        </motion.button>

        <p className="text-center text-white/40 text-xs">
          Нажимая кнопку, вы соглашаетесь с нашей{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300 underline">
            политикой конфиденциальности
          </a>
        </p>
      </form>
    </BaseModal>
  );
}

/* ============================================================================
   SUCCESS MODAL COMPONENT
============================================================================ */
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <BaseModal
      title="Сообщение отправлено!"
      subtitle="Мы свяжемся с вами в ближайшее время"
      onClose={onClose}
      size="max-w-md"
      icon={CheckCircle2}
    >
      <div className="text-center py-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="h-8 w-8 text-white" />
        </motion.div>
        
        <h3 className="text-xl font-bold text-white mb-2">Спасибо за обращение!</h3>
        <p className="text-white/70 mb-6">
          Наш менеджер свяжется с вами в течение 24 часов для обсуждения деталей вашего проекта.
        </p>
        
        <div className="space-y-3 text-sm text-white/60">
          <div className="flex items-center gap-2 justify-center">
            <Mail className="h-4 w-4" />
            <span>{APP_CONFIG.company.email}</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Phone className="h-4 w-4" />
            <span>{APP_CONFIG.company.phone}</span>
          </div>
        </div>

        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-600 transition shadow-lg"
        >
          Понятно
        </motion.button>
      </div>
    </BaseModal>
  );
}

/* ============================================================================
   SECTION COMPONENT (вспомогательный)
============================================================================ */
function Section({ 
  title, 
  children, 
  className = "" 
}: { 
  title?: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {title && (
        <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}

/* ============================================================================
   CUSTOM STYLES COMPONENT
============================================================================ */
function CustomStyles() {
  return (
    <style jsx global>{`
      /* Плавная прокрутка */
      html {
        scroll-behavior: smooth;
      }
      
      /* Кастомный скроллбар */
      ::-webkit-scrollbar {
        width: 6px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      /* Утилиты для текста */
      .text-balance {
        text-wrap: balance;
      }
      
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
      
      /* Анимации для reduced motion */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* Поддержка safe-area */
      .safe-bottom {
        padding-bottom: env(safe-area-inset-bottom);
      }
      
      /* Градиентный текст с анимацией */
      .animated-gradient {
        background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
      }
      
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Свечение для интерактивных элементов */
      .glow-hover:hover {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
      }
      
      /* Адаптивные улучшения */
      @media (max-width: 640px) {
        .mobile-padding {
          padding-left: 1rem;
          padding-right: 1rem;
        }
      }
    `}</style>
  );
}

/* ============================================================================
   FOOTER COMPONENT (добавим в main компонент)
============================================================================ */
function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">{APP_CONFIG.company.name}</span>
            </div>
            <p className="text-white/70 mb-6 max-w-md text-sm sm:text-base">
              Ведущая платформа для автоматизации сервисного бизнеса. 
              Решения для ресторанов, салонов красоты, фитнес-центров и других предприятий услуг.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="p-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
                >
                  <Icon className="h-4 w-4 text-white/60 hover:text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm sm:text-base">Продукт</h4>
            <ul className="space-y-3 text-sm">
              {['Возможности', 'Цены', 'Кейсы', 'Документация', 'Статус'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm sm:text-base">Контакты</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {APP_CONFIG.company.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {APP_CONFIG.company.phone}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Пн-Пт 9:00-18:00
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-white/60 text-sm">
            © {new Date().getFullYear()} {APP_CONFIG.company.name}. Все права защищены.
          </div>
          <div className="flex gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-white transition-colors">Конфиденциальность</a>
            <a href="#" className="hover:text-white transition-colors">Условия</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
