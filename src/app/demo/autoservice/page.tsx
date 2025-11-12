// src/app/demo/autoservice/page.tsx
'use client';

import React, { useEffect, useMemo, useReducer, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

// Импортируем иконки из lucide-react
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
  Cast, User, Wrench as WrenchIcon, Car as CarIcon, Calendar as CalendarIcon,
  PhoneCall, MapPin as MapPinIcon, Clock as ClockIcon, DollarSign,
  Settings as SettingsIcon, Users as UsersIcon, FileText as FileTextIcon,
  BarChart as BarChartIcon, MessageSquare, Shield as ShieldIcon,
  Package as PackageIcon, CreditCard as CreditCardIcon,
  Camera as CameraIcon, TrendingUp as TrendingUpIcon,
  CheckCircle, AlertCircle, Star as StarIcon,
  ArrowUp, ArrowDown, ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon, Search as SearchIcon,
  Filter as FilterIcon, Download as DownloadIcon,
  Upload as UploadIcon, Share2 as ShareIcon,
  ThumbsUp as ThumbsUpIcon, MessageCircle as MessageCircleIcon
} from 'lucide-react';

// Создаем псевдонимы для конфликтующих иконок
const CloudIcon = Cloud;
const CoffeeIcon = Coffee;
const FlameIcon = Fire;
const LightningIcon = Zap;
const CarRepairIcon = Wrench;
const CarServiceIcon = CarIcon;
const AppointmentIcon = CalendarIcon;
const PhoneIcon = PhoneCall;
const LocationIcon = MapPinIcon;
const TimeIcon = ClockIcon;
const PaymentIcon = CreditCardIcon;
const AnalyticsIcon = BarChartIcon;
const ChatIcon = MessageSquare;
const InventoryIcon = PackageIcon;
const SecurityIcon = ShieldIcon;
const PhotoReportIcon = CameraIcon;

/* ============================================================================
   CONSTANTS AND CONFIGURATION
============================================================================ */
const APP_CONFIG = {
  company: {
    name: 'AutoService Pro',
    email: 'info@autoservice-pro.dev',
    phone: '+7 (000) 000-00-00',
    demo: true,
    founded: 2021,
    teamSize: 15
  },
  features: {
    particleCount: 25,
    animationDuration: 1800,
    kpiUpdateInterval: 4000,
    autoSaveInterval: 30000
  },
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    large: 1280
  },
  api: {
    baseUrl: 'https://api.autoservice-pro.dev/v1',
    timeout: 10000,
    retries: 3
  }
} as const;

const COLOR_PALETTE = {
  primary: {
    orange: 'rgba(255, 138, 0, 0.15)',
    blue: 'rgba(59, 130, 246, 0.1)',
    red: 'rgba(239, 68, 68, 0.1)',
    emerald: 'rgba(16, 185, 129, 0.1)',
    amber: 'rgba(245, 158, 11, 0.1)',
    gray: 'rgba(156, 163, 175, 0.1)'
  },
  gradients: {
    hero: 'from-orange-400 via-amber-400 to-red-400',
    cta: 'from-orange-500 to-amber-500',
    success: 'from-emerald-500 to-green-500',
    warning: 'from-amber-500 to-orange-500',
    error: 'from-red-500 to-rose-500',
    premium: 'from-blue-500 to-purple-500'
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    premium: '#8B5CF6'
  }
} as const;

const ACCESSIBILITY = {
  focus: {
    outline: '2px solid #FF8A00',
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
        const variation = (Math.random() - 0.5) * (kpi.label.includes('Клиентов') ? 20 : 0.3);
        const newValue = Math.max(0, kpi.value + variation);
        const trend = variation > 0 ? 'up' : variation < 0 ? 'down' : 'stable';
        
        return {
          ...kpi,
          value: Number(newValue.toFixed(kpi.suffix ? 1 : 0)),
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
  spotlightColor = COLOR_PALETTE.primary.orange,
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
   DATA
============================================================================ */
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Алексей Волков',
    role: 'Lead Fullstack Developer',
    expertise: ['React', 'Node.js', 'TypeScript', 'AWS', 'System Architecture', 'IoT Integration'],
    avatar: '👨‍💻',
    experience: '7+ лет',
    projects: 32,
    tech: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSocket', 'Docker', 'AWS'],
    bio: 'Специализируется на создании масштабируемых систем для автосервисов с интеграцией диагностического оборудования и IoT-устройств.',
    education: ['МГТУ им. Баумана, Компьютерные науки', 'AWS Solutions Architect'],
    certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
    social: {
      linkedin: '#',
      github: '#',
    },
    joinDate: '2021-03-15',
    specialization: ['Backend Development', 'Cloud Architecture', 'IoT Integration']
  },
  {
    id: '2',
    name: 'Дмитрий Соколов',
    role: 'Senior Mobile Developer',
    expertise: ['React Native', 'iOS', 'Android', 'Mobile Architecture', 'UI/UX'],
    avatar: '📱',
    experience: '6+ лет',
    projects: 28,
    tech: ['React Native', 'TypeScript', 'Redux', 'Firebase', 'GraphQL'],
    bio: 'Создает интуитивные мобильные приложения для клиентов и механиков с оффлайн-режимом и push-уведомлениями.',
    education: ['МФТИ, Прикладная математика'],
    certifications: ['React Native Certification'],
    social: {
      linkedin: '#',
      github: '#',
    },
    joinDate: '2021-06-20',
    specialization: ['Mobile Development', 'Cross-platform', 'User Experience']
  },
  {
    id: '3',
    name: 'Мария Иванова',
    role: 'UI/UX Designer',
    expertise: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Animation'],
    avatar: '🎨',
    experience: '5+ лет',
    projects: 24,
    tech: ['Figma', 'Adobe Creative Suite', 'Framer', 'Webflow'],
    bio: 'Создает интуитивные и красивые интерфейсы, ориентированные на пользовательский опыт и доступность.',
    education: ['Британская высшая школа дизайна'],
    certifications: ['Google UX Design Certificate'],
    social: {
      linkedin: '#',
      portfolio: '#',
    },
    joinDate: '2022-01-10',
    specialization: ['User Interface', 'User Experience', 'Design Systems']
  },
  {
    id: '4',
    name: 'Сергей Петров',
    role: 'DevOps Engineer',
    expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Monitoring'],
    avatar: '⚙️',
    experience: '8+ лет',
    projects: 35,
    tech: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Grafana', 'Prometheus'],
    bio: 'Обеспечивает надежность и масштабируемость инфраструктуры платформы с фокусом на автоматизацию и мониторинг.',
    education: ['МГУ, Факультет вычислительной математики и кибернетики'],
    certifications: ['AWS DevOps Engineer', 'CKA'],
    social: {
      linkedin: '#',
      github: '#',
    },
    joinDate: '2021-09-05',
    specialization: ['Cloud Infrastructure', 'Automation', 'Monitoring']
  }
];

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Цифровизация сети автосервисов',
    client: 'Сеть "АвтоМастер"',
    industry: 'Автосервис',
    duration: '4 месяца',
    challenge: 'Ручная запись клиентов, потеря заказов, отсутствие единой базы клиентов и истории ремонтов, сложности с управлением запчастями',
    solution: 'Внедрена облачная система управления с онлайн-записью, мобильным приложением для механиков, интеграцией с поставщиками запчастей и системой фотоотчетов',
    results: [
      { metric: 'Загрузка сервиса', before: '65%', after: '92%', improvement: '+42%' },
      { metric: 'Время оформления заказа', before: '25мин', after: '8мин', improvement: '-68%' },
      { metric: 'Клиентская база', before: '1,200', after: '3,800', improvement: '+217%' },
      { metric: 'Оборачиваемость запчастей', before: '45дн', after: '18дн', improvement: '-60%' }
    ],
    technologies: ['Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Redis'],
    testimonial: {
      text: 'Система полностью изменила нашу работу. Онлайн-запись увеличила загрузку на 42%, а автоматизация учета запчастей сократила затраты на 30%.',
      author: 'Иван Петров',
      position: 'Владелец сети "АвтоМастер"',
      avatar: '👨‍💼',
      rating: 5
    },
    budget: '1.8M ₽',
    teamSize: '4 специалиста',
    roi: '280% за первый год',
    implementationHighlights: [
      'Интеграция с 3 системами поставщиков',
      'Обучение 25 сотрудников',
      'Миграция данных без простоя',
      'Круглосуточная поддержка'
    ]
  },
  {
    id: '2',
    title: 'Автоматизация премиум-сервиса',
    client: 'Luxury Auto Care',
    industry: 'Премиум автосервис',
    duration: '3 месяца',
    challenge: 'Необходимость предоставления эксклюзивного сервиса для клиентов премиум-сегмента, персонализация обслуживания, управление ожиданиями',
    solution: 'Разработана персонализированная система с индивидуальными кабинетами клиентов, системой предварительной диагностики и премиальным сервисом сопровождения',
    results: [
      { metric: 'Удовлетворенность клиентов', before: '78%', after: '96%', improvement: '+18%' },
      { metric: 'Средний чек', before: '8,500₽', after: '15,200₽', improvement: '+79%' },
      { metric: 'Повторные обращения', before: '45%', after: '82%', improvement: '+37%' },
      { metric: 'Время ожидания', before: '15мин', after: '3мин', improvement: '-80%' }
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'WebSocket', 'Stripe'],
    testimonial: {
      text: 'Персонализированный подход и автоматизация рутинных процессов позволили нам сосредоточиться на качестве обслуживания. Клиенты ценят индивидуальный подход и цифровой комфорт.',
      author: 'Анна Козлова',
      position: 'Управляющий директор Luxury Auto Care',
      avatar: '👩‍💼',
      rating: 5
    },
    budget: '2.2M ₽',
    teamSize: '3 специалиста',
    roi: '320% за первый год',
    implementationHighlights: [
      'Интеграция с системой бронирования',
      'Персонализированные уведомления',
      'Система лояльности клиентов',
      'Автоматизация отчетности'
    ]
  }
];

const roleCards: RoleCard[] = [
  {
    id: 'user',
    title: 'Клиент',
    subtitle: 'Мобильное приложение',
    icon: User,
    description: 'Удобное мобильное приложение для записи на обслуживание, отслеживания статуса ремонта, получения фотоотчетов и онлайн-оплаты. Уведомления о готовности и история всех обслуживаний.',
    points: [
      'Онлайн-запись на удобное время с выбором услуги',
      'Отслеживание статуса ремонта в реальном времени',
      'Фотоотчеты о ходе работ и выявленных проблемах',
      'История обслуживания и напоминания о ТО',
      'Онлайн-оплата и электронные чеки',
      'Чат с механиком и консультации',
      'Рейтинги и отзывы о качестве услуг',
      'Push-уведомления о готовности',
      'Документы и гарантии в электронном виде',
      'Запись на мойку и дополнительные услуги'
    ],
    tech: ['React Native', 'PWA', 'WebSocket', 'Push Notifications', 'Apple Pay/Google Pay'],
    benefits: [
      'Экономия времени - запись за 2 минуты',
      'Прозрачность ремонта - фотоотчеты онлайн',
      'Удобные платежи - без очередей',
      'Вся история обслуживания в телефоне',
      'Напоминания о ТО и акциях'
    ],
    gradient: 'from-blue-500 to-cyan-500',
    stats: [
      { label: 'Пользователей', value: '25K+', icon: Users },
      { label: 'Оценка', value: '4.8/5', icon: Star },
      { label: 'Записей/мес', value: '8,500+', icon: CalendarIcon },
      { label: 'Мобильные', value: '95%', icon: Smartphone }
    ],
    features: [
      { title: 'Онлайн-запись', description: 'Интеллектуальное расписание с выбором даты, времени и услуги', icon: CalendarIcon },
      { title: 'Статус ремонта', description: 'Real-time отслеживание этапов ремонта с уведомлениями', icon: RefreshCw },
      { title: 'Фотоотчеты', description: 'Детальные фото процесса работ и выявленных проблем', icon: CameraIcon },
      { title: 'Электронные чеки', description: 'Мгновенные чеки и документы после оплаты', icon: FileText }
    ],
    path: '/demo/autoservice/user',
    badge: 'Popular',
    metrics: [
      { metric: 'Время записи', value: '2 минуты', improvement: '-85%' },
      { metric: 'Удовлетворенность', value: '94%', improvement: '+35%' },
      { metric: 'Лояльность', value: '+40%', improvement: 'Повторные визиты' }
    ],
    demoVideo: '/demos/client-demo.mp4',
    accessLevel: 'basic',
    trainingTime: '5 минут'
  },
  {
    id: 'manager',
    title: 'Менеджер',
    subtitle: 'Панель управления сервисом',
    icon: Users,
    description: 'Комплексная система управления автосервисом: запись клиентов, управление персоналом, контроль финансов и аналитика в реальном времени.',
    points: [
      'Управление онлайн-записью и расписанием',
      'Контроль загрузки механиков и станков',
      'Управление клиентской базой и историей',
      'Контроль финансов и движение денежных средств',
      'Аналитика продаж и эффективности услуг',
      'Управление складом и заказами запчастей',
      'CRM и маркетинговые кампании',
      'Отчетность для руководства',
      'Управление качеством и рейтингами',
      'Интеграция с поставщиками и партнерами'
    ],
    tech: ['React', 'Redux', 'WebSocket', 'Chart.js', 'IndexedDB'],
    benefits: [
      'Полный контроль над бизнес-процессами',
      'Снижение времени на администрирование на 60%',
      'Data-driven принятие решений',
      'Автоматизация рутинных операций',
      'Прозрачность всех процессов'
    ],
    gradient: 'from-green-500 to-emerald-500',
    stats: [
      { label: 'Менеджеров', value: '280+', icon: UserCheck },
      { label: 'Эффективность', value: '+45%', icon: TrendingUp },
      { label: 'Записей/мес', value: '15K+', icon: CalendarIcon },
      { label: 'Автоматизация', value: '75%', icon: Zap }
    ],
    features: [
      { title: 'Дашборд аналитики', description: 'Ключевые метрики бизнеса в реальном времени с AI-инсайтами', icon: BarChart3 },
      { title: 'Управление расписанием', description: 'Интеллектуальное планирование и оптимизация загрузки', icon: CalendarDays },
      { title: 'Финансовый контроль', description: 'Детальный учет доходов, расходов и рентабельности услуг', icon: DollarSign },
      { title: 'CRM система', description: 'Полный цикл взаимодействия с клиентами и уведомления', icon: Users }
    ],
    path: '/demo/autoservice/manager',
    badge: 'Business',
    metrics: [
      { metric: 'Загрузка сервиса', value: '92%', improvement: '+28%' },
      { metric: 'Время управления', value: '-60%', improvement: 'Автоматизация' },
      { metric: 'Конверсия', value: '+35%', improvement: 'CRM система' }
    ],
    demoVideo: '/demos/manager-demo.mp4',
    accessLevel: 'premium',
    trainingTime: '4 часа'
  },
  {
    id: 'owner',
    title: 'Владелец',
    subtitle: 'Бизнес-аналитика и контроль',
    icon: BarChart3,
    description: 'Мощная система бизнес-аналитики для владельцев сетей автосервисов. Консолидированная отчетность, KPI филиалов, финансовый контроль и прогнозирование.',
    points: [
      'Консолидированная отчетность по всем филиалам',
      'KPI и метрики эффективности бизнеса',
      'Финансовый анализ и прогнозирование',
      'Управление персоналом и производительностью',
      'Бенчмаркинг и сравнительная аналитика',
      'Автоматическая генерация отчетов',
      'Мониторинг качества услуг и NPS',
      'Стратегическое планирование и бюджетирование',
      'Управление рисками и предиктивная аналитика',
      'Интеграция с бухгалтерскими системами'
    ],
    tech: ['TypeScript', 'GraphQL', 'D3.js', 'Machine Learning', 'Apache ECharts'],
    benefits: [
      'Полная прозрачность бизнеса 24/7',
      'Data-driven стратегические решения',
      'Автоматизация отчетности на 90%',
      'Раннее выявление проблем и рисков',
      'Оптимизация расходов и увеличение прибыли'
    ],
    gradient: 'from-purple-500 to-indigo-500',
    stats: [
      { label: 'Владельцев', value: '150+', icon: Building2 },
      { label: 'Рост прибыли', value: '+25%', icon: TrendingUp },
      { label: 'Автоматизация', value: '90%', icon: Zap },
      { label: 'ROI', value: '320%', icon: LineChart }
    ],
    features: [
      { title: 'BI-дашборды', description: 'Глубокая аналитика с drill-down по всем бизнес-метрикам', icon: PieChart },
      { title: 'Мульти-филиал', description: 'Единое управление сетью сервисов с сравнением эффективности', icon: GitBranch },
      { title: 'AI-прогнозирование', description: 'Прогнозы спроса, выручки и потребности в запчастях', icon: Brain },
      { title: 'Авто-отчетность', description: 'Автоматическая генерация отчетов для налоговой и инвесторов', icon: FileText }
    ],
    path: '/demo/autoservice/owner',
    badge: 'Enterprise',
    metrics: [
      { metric: 'Рентабельность', value: '+18%', improvement: 'За 6 месяцев' },
      { metric: 'Оборачиваемость', value: '-40%', improvement: 'Управление складом' },
      { metric: 'NPS', value: '72', improvement: '+25 пунктов' }
    ],
    demoVideo: '/demos/owner-demo.mp4',
    accessLevel: 'enterprise',
    trainingTime: '6 часов'
  }
];

const features: Feature[] = [
  {
    id: 'online-booking',
    title: 'Онлайн-запись',
    description: 'Интеллектуальная система онлайн-записи с выбором услуг',
    icon: CalendarIcon,
    gradient: 'from-blue-500 to-cyan-500',
    tech: ['React', 'WebSocket', 'Calendar API', 'Push Notifications', 'Redis'],
    scenarios: [
      'Запись клиента через сайт или мобильное приложение',
      'Интеллектуальное распределение по механикам',
      'Предварительный расчет стоимости услуг',
      'Напоминания о записи за 24 и 2 часа',
      'Интеграция с Google Calendar и Apple Calendar'
    ],
    stats: [
      { value: '95%', label: 'Удобство', icon: ThumbsUpIcon },
      { value: '2мин', label: 'Время записи', icon: ClockIcon },
      { value: '+40%', label: 'Конверсия', icon: TrendingUpIcon },
      { value: '24/7', label: 'Доступность', icon: Globe }
    ],
    benchmarks: ['Conversion Rate > 35%', 'Booking Time < 3min', 'Uptime 99.9%', 'Mobile First'],
    documentation: '/docs/online-booking',
    status: 'stable',
    releaseDate: '2024-01-15'
  },
  {
    id: 'repair-tracking',
    title: 'Отслеживание ремонта',
    description: 'Real-time система отслеживания статуса ремонта с фотоотчетами',
    icon: RefreshCw,
    gradient: 'from-green-500 to-emerald-500',
    tech: ['WebSocket', 'React Native', 'Camera API', 'Push Notifications', 'Cloud Storage'],
    scenarios: [
      'Автоматические уведомления о смене статуса',
      'Фотоотчеты по этапам работ',
      'Чат между клиентом и механиком',
      'Трекер времени выполнения работ',
      'Электронные акты приемки'
    ],
    stats: [
      { value: '4.8/5', label: 'Оценка клиентов', icon: StarIcon },
      { value: '-60%', label: 'Время ожидания', icon: ClockIcon },
      { value: '89%', label: 'Прозрачность', icon: Eye },
      { value: 'Real-time', label: 'Обновления', icon: Zap }
    ],
    benchmarks: ['Customer Satisfaction > 4.5', 'Status Updates < 1min', 'Photo Quality > 95%'],
    documentation: '/docs/repair-tracking',
    status: 'stable',
    releaseDate: '2024-01-20'
  },
  {
    id: 'inventory-management',
    title: 'Управление складом',
    description: 'Автоматизированная система управления складом запчастей',
    icon: PackageIcon,
    gradient: 'from-orange-500 to-amber-500',
    tech: ['Node.js', 'PostgreSQL', 'Redis', 'ML Algorithms', 'Supplier API'],
    scenarios: [
      'Автоматический учет прихода и расхода',
      'Интеграция с поставщиками для заказа',
      'Прогнозирование спроса на запчасти',
      'Контроль сроков годности и партий',
      'Оптимизация складских запасов'
    ],
    stats: [
      { value: '-40%', label: 'Запасы', icon: TrendingUpIcon },
      { value: '99%', label: 'Доступность', icon: CheckCircle },
      { value: '18дн', label: 'Оборачиваемость', icon: RefreshCw },
      { value: '+25%', label: 'Маржа', icon: DollarSign }
    ],
    benchmarks: ['Stock Turnover < 20d', 'Availability > 98%', 'Forecast Accuracy > 85%'],
    documentation: '/docs/inventory-management',
    status: 'stable',
    releaseDate: '2024-02-01'
  },
  {
    id: 'photo-reports',
    title: 'Фотоотчеты',
    description: 'Система автоматической фотофиксации этапов ремонта с AI-анализом',
    icon: CameraIcon,
    gradient: 'from-purple-500 to-indigo-500',
    tech: ['React Native', 'Camera API', 'TensorFlow.js', 'Cloud Storage', 'Image Processing'],
    scenarios: [
      'Автоматическая съемка до/после ремонта',
      'AI-анализ повреждений и износа',
      'Водяные знаки с датой и временем',
      'Автоматическая классификация фото',
      'Интеграция с актами выполненных работ'
    ],
    stats: [
      { value: '95%', label: 'Качество', icon: StarIcon },
      { value: '2сек', label: 'Обработка', icon: ClockIcon },
      { value: '+50%', label: 'Доверие', icon: ThumbsUpIcon },
      { value: 'AI', label: 'Анализ', icon: Brain }
    ],
    benchmarks: ['Image Quality > 90%', 'Processing < 3s', 'AI Accuracy > 88%'],
    documentation: '/docs/photo-reports',
    status: 'beta',
    releaseDate: '2024-03-15'
  },
  {
    id: 'financial-analytics',
    title: 'Финансовая аналитика',
    description: 'Комплексная система финансовой аналитики с детализацией по услугам',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-green-500',
    tech: ['D3.js', 'Chart.js', 'PostgreSQL', 'Machine Learning', 'Apache ECharts'],
    scenarios: [
      'Детальная аналитика доходов и расходов',
      'Рентабельность услуг и механиков',
      'Прогнозирование денежных потоков',
      'Сравнительная аналитика филиалов',
      'Автоматическая финансовая отчетность'
    ],
    stats: [
      { value: 'Real-time', label: 'Данные', icon: Zap },
      { value: '95%', label: 'Точность', icon: Target },
      { value: '+20%', label: 'Прибыль', icon: TrendingUpIcon },
      { value: '30дн', label: 'Прогноз', icon: CalendarIcon }
    ],
    benchmarks: ['Data Freshness < 1m', 'Forecast Accuracy > 90%', 'ROI Tracking'],
    documentation: '/docs/financial-analytics',
    status: 'stable',
    releaseDate: '2024-01-25'
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
export default function AutoservicePage() {
  const [modal, dispatch] = useReducer(modalReducer, { type: 'idle' });
  const initialKpis = useMemo(() => [
    { 
      label: 'Клиентов в месяц', 
      value: 8500, 
      icon: Users, 
      trend: 'up' as const, 
      description: 'Активные клиенты сервиса',
      format: 'number'
    },
    { 
      label: 'Автосервисов', 
      value: 280, 
      icon: Building2, 
      trend: 'up' as const, 
      description: 'Партнерские сервисы',
      format: 'number'
    },
    { 
      label: 'Средний чек', 
      value: 12500, 
      suffix: '₽', 
      icon: DollarSign, 
      trend: 'up' as const, 
      description: 'Средняя стоимость заказа',
      format: 'currency'
    },
    { 
      label: 'Оценка клиентов', 
      value: 4.8, 
      suffix: '/5', 
      icon: Star, 
      trend: 'stable' as const, 
      description: 'Рейтинг удовлетворенности',
      format: 'number'
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
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 z-50"
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
              ${COLOR_PALETTE.primary.orange} 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
              ${COLOR_PALETTE.primary.blue} 0%, transparent 50%),
            radial-gradient(circle at ${mousePosition.x}% ${100 - mousePosition.y}%, 
              ${COLOR_PALETTE.primary.red} 0%, transparent 50%)
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
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"
        animate={{ y: `${scrollProgress * 10}vh` }}
        transition={{ type: "spring", damping: 30 }}
      />

      {/* Animated Orbs */}
      {!reducedMotion && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"
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
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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
            className="absolute bg-orange-400/30 rounded-full"
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
          className="absolute bg-orange-400/30 rounded-full"
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
    { name: 'Технологии', href: '#tech', icon: Code2 },
    { name: 'Команда', href: '#team', icon: Users },
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
          <div className="flex items-center gap-3 group">
            <motion.div
              whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
              className="relative"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                <CarRepairIcon className="h-5 w-5 text-white" />
              </div>
              {!reducedMotion && (
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  animate={{ rotate: [0, 180] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                {APP_CONFIG.company.name}
              </span>
              {APP_CONFIG.company.demo && (
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full hidden sm:inline-block">
                  Demo
                </span>
              )}
            </div>
          </div>

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
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"
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
          <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-pulse" />
          Автосервис 2024 • Enterprise Edition
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-red-400 bg-clip-text text-transparent">
              AutoService
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Pro
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed px-4 text-balance"
          >
            Цифровая платформа для управления автосервисом: онлайн-запись, отслеживание ремонта, 
            управление запчастями и аналитика в реальном времени
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
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 138, 0, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('/demo/autoservice/user', '_blank')}
            className="group relative bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-2xl w-full sm:w-auto"
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
                  <kpi.icon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
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
            Роли в системе
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Полный цикл взаимодействия: от клиента до владельца сети автосервисов
          </p>
        </motion.div>

        {/* Roles Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
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
                        <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 mx-auto mb-1 sm:mb-2" />
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
                        role.badge === 'Business' ? 'bg-green-500 text-white' :
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
            Современные технологии для эффективного управления автосервисом
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
                        <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 mx-auto mb-1" />
                        <div className="text-sm sm:text-base font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/60 leading-tight line-clamp-2">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Preview */}
                  <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                    {feature.tech.slice(0, 3).map((tech) => (
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
                          <div className="w-1 h-1 bg-orange-400 rounded-full flex-shrink-0" />
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
            Успешные внедрения платформы в автосервисах с измеримыми результатами
          </p>
        </motion.div>

        {/* Case Studies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
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
                    <p className="text-orange-400 font-semibold text-sm sm:text-base mb-1">{caseStudy.client}</p>
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
      color: 'from-orange-500 to-amber-500',
      items: [
        { name: 'Node.js', icon: Cpu, description: 'JavaScript runtime', status: 'stable' },
        { name: 'PostgreSQL', icon: Database, description: 'Реляционная БД', status: 'stable' },
        { name: 'Redis', icon: Zap, description: 'In-memory data store', status: 'stable' },
        { name: 'WebSocket', icon: GitBranch, description: 'Real-time communication', status: 'stable' },
      ]
    },
    {
      category: "Cloud & DevOps",
      icon: CloudIcon,
      color: 'from-green-500 to-emerald-500',
      items: [
        { name: 'Docker', icon: Package, description: 'Containerization', status: 'stable' },
        { name: 'AWS', icon: CloudIcon, description: 'Cloud platform', status: 'stable' },
        { name: 'GitHub Actions', icon: GitMerge, description: 'CI/CD', status: 'stable' },
        { name: 'Redis', icon: Database, description: 'Caching', status: 'stable' },
      ]
    },
    {
      category: "Mobile & IoT",
      icon: Smartphone,
      color: 'from-purple-500 to-indigo-500',
      items: [
        { name: 'React Native', icon: Smartphone, description: 'Cross-platform', status: 'stable' },
        { name: 'Camera API', icon: CameraIcon, description: 'Photo reports', status: 'stable' },
        { name: 'Push Notifications', icon: Bell, description: 'Alerts', status: 'stable' },
        { name: 'OBD-II Integration', icon: Cpu, description: 'Car diagnostics', status: 'beta' },
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
            Современные технологии для создания высокопроизводительной платформы автосервиса
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
                description: "GDPR, OAuth2, RBAC, Data Encryption",
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
                {...fadeUp(1 + index * 0.1)}
                whileHover={{ y: -4 }}
                className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all"
              >
                <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400 mb-3 mx-auto" />
                <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{item.title}</h4>
                <p className="text-white/60 text-xs sm:text-sm mb-3">{item.description}</p>
                <div className="space-y-1">
                  {item.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                      <div className="w-1 h-1 bg-orange-400 rounded-full" />
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
            Профессионалы с глубокой экспертизой в создании платформ для автосервисов
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
                  <p className="text-orange-400 text-sm sm:text-base mb-1 sm:mb-2">{member.role}</p>
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
              { value: '32+', label: 'Завершенных проектов', icon: CheckCircle2 },
              { value: '3+', label: 'Лет опыта', icon: Calendar },
              { value: '99.9%', label: 'Доступность систем', icon: ShieldCheck },
              { value: '24/7', label: 'Поддержка', icon: Clock },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeUp(1 + index * 0.1)}
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400 mx-auto mb-2" />
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
      value: '8,500',
      label: 'Клиентов в месяц',
      description: 'Активные клиенты сервиса',
      change: '+12%',
      trend: 'up' as const,
      icon: Users
    },
    {
      value: '280',
      label: 'Автосервисов',
      description: 'Партнерские сервисы',
      change: '+8%',
      trend: 'up' as const,
      icon: Building2
    },
    {
      value: '12,500₽',
      label: 'Средний чек',
      description: 'Средняя стоимость заказа',
      change: '+5%',
      trend: 'up' as const,
      icon: DollarSign
    },
    {
      value: '4.8/5',
      label: 'Оценка клиентов',
      description: 'Рейтинг удовлетворенности',
      change: '+0.2',
      trend: 'up' as const,
      icon: Star
    },
    {
      value: '92%',
      label: 'Загрузка сервиса',
      description: 'Средняя загрузка по сети',
      change: '+15%',
      trend: 'up' as const,
      icon: Gauge
    },
    {
      value: '18дн',
      label: 'Оборачиваемость',
      description: 'Запчастей на складе',
      change: '-40%',
      trend: 'down' as const,
      icon: RefreshCw
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
            Реальные метрики и показатели эффективности нашей платформы для автосервисов
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
    { name: 'Технологии', href: '#tech', icon: Code2 },
    { name: 'Команда', href: '#team', icon: Users },
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
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                      <CarRepairIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">AutoService Pro</span>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
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
                        <item.icon className="h-5 w-5 text-orange-400" />
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
                        window.open('/demo/autoservice/client', '_blank');
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition text-sm"
                    >
                      <Rocket className="h-4 w-4 text-orange-400" />
                      Начать демо
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onContact();
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition text-sm font-semibold"
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
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
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
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 mt-0.5 flex-shrink-0" />
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
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400 mb-3" />
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
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Section title="Статистика">
            <div className="space-y-2 sm:space-y-3">
              {role.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 flex-shrink-0" />
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
                role.badge === 'Business' ? 'bg-green-500/20 text-green-400' :
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
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition shadow-lg text-sm sm:text-base"
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
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 mx-auto mb-1 sm:mb-2" />
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
              <Calendar className="h-4 w-4 text-orange-400" />
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
                <Play className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/90 text-sm sm:text-base">{scenario}</span>
              </motion.div>
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
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Срок</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.duration}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Улучшение</div>
            <div className="font-semibold text-white text-sm sm:text-base">+{caseStudy.results[0]?.improvement}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Охват</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.results[1]?.after}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 mx-auto mb-1 sm:mb-2" />
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
              <div className="p-3 sm:p-4 rounded-xl bg-orange-500/20 border border-orange-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Banknote className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 font-semibold text-sm">Бюджет</span>
                </div>
                <div className="text-white font-bold text-lg">{caseStudy.budget}</div>
                <div className="text-orange-400/80 text-xs">Общие инвестиции</div>
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
                      <div className="text-orange-400 text-xs sm:text-sm">{caseStudy.testimonial.position}</div>
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
            <p className="text-orange-400 text-lg sm:text-xl mb-2">{member.role}</p>
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
                  <Sparkles className="h-4 w-4 text-orange-400 flex-shrink-0" />
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
    'Владелец автосервиса',
    'Менеджер автосервиса',
    'IT специалист',
    'Инвестор',
    'Франчайзи',
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
          <Field label="Имя *">
            <input
              required
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-orange-500/50 transition text-sm sm:text-base"
              value={form.name}
              onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
              placeholder="Ваше имя"
            />
          </Field>
          <Field label="Email *">
            <input
              type="email"
              required
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-orange-500/50 transition text-sm sm:text-base"
              value={form.email}
              onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
              placeholder="email@example.com"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Организация">
            <input
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-orange-500/50 transition text-sm sm:text-base"
              value={form.organization}
              onChange={(e) => setForm(s => ({ ...s, organization: e.target.value }))}
              placeholder="Название автосервиса"
            />
          </Field>
          <Field label="Телефон">
            <input
              type="tel"
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-orange-500/50 transition text-sm sm:text-base"
              value={form.phone}
              onChange={(e) => setForm(s => ({ ...s, phone: e.target.value }))}
              placeholder="+7 (000) 000-00-00"
            />
          </Field>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Ваша роль">
            <select
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-orange-500/50 transition text-sm sm:text-base"
              value={form.role}
              onChange={(e) => setForm(s => ({ ...s, role: e.target.value }))}
            >
              <option value="">Выберите роль</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </Field>
          <Field label="Примерный бюджет">
            <select
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-orange-500/50 transition text-sm sm:text-base"
              value={form.budget}
              onChange={(e) => setForm(s => ({ ...s, budget: e.target.value }))}
            >
              <option value="">Выберите бюджет</option>
              {budgets.map(budget => (
                <option key={budget} value={budget}>{budget}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Сроки реализации">
          <select
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-orange-500/50 transition text-sm sm:text-base"
            value={form.timeline}
            onChange={(e) => setForm(s => ({ ...s, timeline: e.target.value }))}
          >
            <option value="">Выберите сроки</option>
            {timelines.map(timeline => (
              <option key={timeline} value={timeline}>{timeline}</option>
            ))}
          </select>
        </Field>

        <Field label="Описание проекта *">
          <textarea
            rows={4}
            required
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-orange-500/50 transition resize-none text-sm sm:text-base"
            value={form.description}
            onChange={(e) => setForm(s => ({ ...s, description: e.target.value }))}
            placeholder="Опишите текущие процессы, проблемы и ожидаемый результат от внедрения системы..."
          />
        </Field>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
            {APP_CONFIG.company.email}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            {APP_CONFIG.company.phone}
          </div>
        </div>

        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition text-sm sm:text-base"
        >
          Понятно
        </motion.button>
      </div>
    </BaseModal>
  );
}

/* ============================================================================
   UTILITY COMPONENTS
============================================================================ */
function Section({ title, children, className = '' }: { 
  title: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        <h4 className="font-semibold text-white text-base sm:text-lg">{title}</h4>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children, className = '' }: { 
  label: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="text-xs sm:text-sm text-white/60 mb-1 sm:mb-2 font-medium">{label}</div>
      {children}
    </label>
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
        0%, 100% { box-shadow: 0 0 20px rgba(255, 138, 0, 0.5); }
        50% { box-shadow: 0 0 40px rgba(255, 138, 0, 0.8); }
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
        background: rgba(255, 138, 0, 0.3);
        color: white;
        text-shadow: none;
      }
      
      /* Focus Outline */
      button:focus-visible,
      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        outline: 2px solid rgb(255, 138, 0);
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
      
      .line-clamp-4 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
      }
      
      .line-clamp-5 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
      }
      
      /* Gradient text animation */
      .animate-gradient {
        background-size: 200% 200%;
        animation: gradient 3s ease infinite;
      }
      
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        .animate-scan,
        .animate-float,
        .animate-glow,
        .animate-gradient { 
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
      
      /* Print styles */
      @media print {
        .no-print {
          display: none !important;
        }
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .bg-white\\/5 {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .border-white\\/10 {
          border-color: rgba(255, 255, 255, 0.3);
        }
      }
      
      /* Dark mode enhancements (though we're already dark) */
      @media (prefers-color-scheme: dark) {
        .bg-black {
          background-color: #000000;
        }
      }

      /* Safe area insets for modern mobile devices */
      .pb-safe {
        padding-bottom: env(safe-area-inset-bottom);
      }

      /* Custom focus styles for better accessibility */
      .focus-ring:focus {
        outline: 2px solid #FF8A00;
        outline-offset: 2px;
      }

      /* Loading states */
      .loading {
        opacity: 0.7;
        pointer-events: none;
      }

      /* Custom selection colors */
      ::-moz-selection {
        background: rgba(255, 138, 0, 0.3);
        color: white;
      }
    `}</style>
  );
}