// src/app/demo/medicine/page.tsx
'use client';

import React, { useEffect, useMemo, useReducer, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { gsap } from 'gsap';

// Импортируем медицинские иконки из lucide-react
// В секции импортов из lucide-react добавьте Layers:
import {
  Stethoscope, Heart, Pill, Brain, Activity, Microscope, Ambulance, Tooth,
  Bone, Eye, Ear, Syringe, Thermometer, Bed, Wheelchair, User, UserCheck,
  Users, Clock, Star, TrendingUp, Shield, ShieldCheck, Zap, Rocket, Play,
  X, CheckCircle2, FileText, Video, BarChart3, Smartphone, Calendar, MapPin,
  Award, Database, Server, Cloud, Cpu, Code2, Palette, Workflow, Bot,
  ArrowUpRight, Menu, Github, Twitter, Linkedin, MessageSquareMore, Mail,
  Phone, Building2, Home, Sparkles, Cog, GitBranch, LineChart, PieChart,
  Target, UserPlus, UserX, Bell, AlertTriangle, Info, HelpCircle, Search,
  Filter, Settings, Download, Upload, Share2, ThumbsUp, MessageCircle, Image,
  Camera, Calculator, CreditCard, ShoppingCart, Wallet, Coins, Laptop, Tablet,
  Watch, Printer, Scanner, Keyboard, Mouse, Headphones, Volume2, Wifi,
  Bluetooth, Battery, BatteryCharging, Power, RefreshCw, Lock, Unlock, EyeOff,
  Key, Fingerprint, AlertTriangle as AlertTriangleIcon, Radio, Tv, Gamepad,
  Flask, Telescope, Microchip, Motherboard, Router, Cctv, AlarmClock, Megaphone,
  Speaker, List, ListOrdered, Table, Grid, Layout, ChevronLeft, ChevronRight,
  ChevronUp, ChevronDown, MoreHorizontal, Plus, Minus, Navigation, Compass,
  Car, Truck, Plane, Bike, Gas, Tool, Hammer, Box, Tree, Flower2, Mountain,
  CloudSnow, Umbrella, Droplets, Fire, Wind, Timer, Hourglass, History,
  CalendarDays, StopCircle, PlayCircle, PauseCircle, SkipBack, SkipForward,
  Rewind, FastForward, Repeat, Shuffle, Volume, VolumeX, MicOff, Airplay, Cast,
  HeartPulse, Brain as BrainIcon, Lung, Kidney, DNA, Virus, Microscope as MicroscopeIcon,
  TestTube, TestTube2, Beaker, Pill as PillIcon, Prescription, Hospital,
  Clipboard, ClipboardCheck, ClipboardList, FileSearch, FileCheck, FileX,
  Scan, ScanEye, ScanSearch, QrCode, Pulse, Waves, Activity as ActivityIcon,
  Gauge, Cpu as CpuIcon, Server as ServerIcon, Network, Wifi as WifiIcon,
  Shield as ShieldIcon, ShieldOff, Key as KeyIcon, Lock as LockIcon,
  Unlock as UnlockIcon, Users as UsersIcon, User as UserIcon, UserCheck as UserCheckIcon,
  UserPlus as UserPlusIcon, UserX as UserXIcon, Star as StarIcon, Award as AwardIcon,
  Trophy, Medal, Crown, Coffee, Wine, Utensils, Apple, Carrot, Drumstick,
  IceCream, Cake, Pizza, Hamburger, Coffee as CoffeeIcon, Cloud as CloudIcon,
  Sun, Moon, CloudRain, CloudLightning, CloudDrizzle, CloudSnow as CloudSnowIcon,
  Thermometer as ThermometerIcon, Droplets as DropletsIcon, Wind as WindIcon,
  Layers,
  Atom, Package // Добавьте эту строку
} from 'lucide-react';

// Создаем псевдонимы для конфликтующих иконок
const CloudIcon = Cloud;
const CoffeeIcon = Coffee;
const ActivityIconComp = Activity;
const BrainIconComp = Brain;
const ShieldIconComp = Shield;

/* ============================================================================
   CONSTANTS AND CONFIGURATION
============================================================================ */
const APP_CONFIG = {
  company: {
    name: 'Медицинская платформа',
    email: 'info@medical-platform.dev',
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
    baseUrl: 'https://api.medical-platform.dev/v1',
    timeout: 10000,
    retries: 3
  }
} as const;

const COLOR_PALETTE = {
  primary: {
    blue: 'rgba(59, 130, 246, 0.15)',
    green: 'rgba(16, 185, 129, 0.1)',
    purple: 'rgba(168, 85, 247, 0.1)',
    cyan: 'rgba(6, 182, 212, 0.1)',
    emerald: 'rgba(16, 185, 129, 0.1)',
    rose: 'rgba(244, 63, 94, 0.1)',
    amber: 'rgba(245, 158, 11, 0.1)'
  },
  gradients: {
    hero: 'from-blue-400 via-green-400 to-cyan-400',
    cta: 'from-green-500 to-blue-500',
    success: 'from-emerald-500 to-green-500',
    warning: 'from-amber-500 to-orange-500',
    error: 'from-rose-500 to-red-500',
    medical: 'from-blue-500 via-teal-500 to-emerald-500'
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    health: '#06B6D4'
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
        const variation = (Math.random() - 0.5) * (kpi.label.includes('Пациентов') ? 50 : 0.3);
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
type RoleId = 'user' | 'doctor' | 'admin';

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
  compliance: string[];
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
  compliance?: string[];
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
  medicalSpecialties: string[];
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
  medicalCertifications?: string[];
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
    name: 'Дмитрий Медведев',
    role: 'Lead Healthcare Architect',
    expertise: ['Medical Systems', 'HIPAA Compliance', 'System Architecture', 'Healthcare IT', 'FHIR/HL7', 'Security'],
    avatar: '👨‍⚕️',
    experience: '12+ лет',
    projects: 34,
    tech: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'FHIR', 'HL7', 'OAuth2', 'Redis'],
    bio: 'Специализируется на создании безопасных и масштабируемых медицинских систем. Имеет опыт внедрения EHR систем в 10+ крупных медицинских учреждениях.',
    education: ['МГМУ им. Сеченова, Лечебное дело', 'MIT, Healthcare Informatics', 'Stanford CS229 Machine Learning'],
    certifications: ['AWS Solutions Architect', 'Google Cloud Healthcare API', 'HIPAA Security Specialist'],
    medicalCertifications: ['Medical Software Development', 'Clinical Decision Support Systems'],
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#',
      portfolio: '#'
    },
    joinDate: '2021-01-15',
    specialization: ['Healthcare IT', 'Security & Compliance', 'System Architecture', 'Clinical Workflows']
  },
  {
    id: '2',
    name: 'Анна Карпова',
    role: 'Senior Medical UX Designer',
    expertise: ['Healthcare UX', 'Accessibility', 'User Research', 'Clinical Workflows', 'Patient Experience'],
    avatar: '👩‍💻',
    experience: '8+ лет',
    projects: 28,
    tech: ['Figma', 'Adobe XD', 'Sketch', 'Framer', 'Webflow', 'Principle', 'After Effects'],
    bio: 'Создает интуитивные интерфейсы для медицинских систем с фокусом на доступность и удобство использования в стрессовых ситуациях.',
    education: ['БВШД, Дизайн интерфейсов', 'HSE, Психология', 'Johns Hopkins Healthcare Design'],
    certifications: ['Google UX Design Certificate', 'NN/g UX Certification', 'Healthcare Accessibility Specialist'],
    medicalCertifications: ['Medical Interface Design', 'Clinical Usability Testing'],
    social: {
      linkedin: '#',
      behance: '#',
      dribbble: '#',
      portfolio: '#'
    },
    joinDate: '2021-06-20',
    specialization: ['Medical UX', 'Accessibility', 'User Research', 'Clinical Design']
  },
  {
    id: '3',
    name: 'Михаил Орлов',
    role: 'DevOps & Security Engineer',
    expertise: ['Healthcare Security', 'HIPAA Compliance', 'Docker', 'Kubernetes', 'CI/CD', 'Monitoring'],
    avatar: '👨‍🔧',
    experience: '9+ лет',
    projects: 22,
    tech: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Grafana', 'Prometheus', 'Ansible', 'Vault'],
    bio: 'Эксперт по развертыванию и защите медицинских систем. Специализируется на обеспечении HIPAA compliance и безопасности пациентских данных.',
    education: ['МФТИ, Кибербезопасность', 'Linux Foundation Training', 'CISSP Certification'],
    certifications: ['CKA', 'AWS Security Specialist', 'Terraform Associate', 'CISSP', 'HIPAA Security'],
    medicalCertifications: ['Healthcare Data Security', 'Medical Device Security'],
    social: {
      linkedin: '#',
      github: '#'
    },
    joinDate: '2021-03-10',
    specialization: ['Healthcare Security', 'Cloud Infrastructure', 'Compliance', 'Monitoring']
  },
  {
    id: '4',
    name: 'Елена Смирнова',
    role: 'Product Manager - Healthcare',
    expertise: ['Product Strategy', 'Clinical Workflows', 'Regulatory Compliance', 'User Stories', 'Analytics'],
    avatar: '👩‍💼',
    experience: '7+ лет',
    projects: 19,
    tech: ['Jira', 'Confluence', 'Amplitude', 'Mixpanel', 'Google Analytics', 'Hotjar'],
    bio: 'Управляет продуктом от исследований до реализации. Имеет глубокое понимание медицинских процессов и регуляторных требований.',
    education: ['МГУ, Менеджмент', 'Harvard Medical School Digital Health', 'Product School Certification'],
    certifications: ['PMP', 'SAFe Practitioner', 'Product Leadership', 'Digital Health Product Management'],
    medicalCertifications: ['Clinical Process Optimization', 'Healthcare Regulations'],
    social: {
      linkedin: '#',
      portfolio: '#'
    },
    joinDate: '2021-08-01',
    specialization: ['Healthcare Product Strategy', 'Clinical Workflows', 'Regulatory Compliance', 'Data Analysis']
  }
];

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Цифровизация многопрофильной клиники',
    client: 'Медицинский центр "Здоровье+"',
    industry: 'Многопрофильная медицина',
    duration: '8 месяцев',
    challenge: 'Бумажные медицинские карты, разрозненные системы учета, сложность координации между отделениями, длительное время обработки анализов, отсутствие единой системы телемедицины',
    solution: 'Внедрена комплексная EHR система с модулями для врачей, пациентов и администрации. Интеграция с лабораторным оборудованием, системами видеоконсультаций и мобильным приложением для пациентов',
    results: [
      { metric: 'Время доступа к медкарте', before: '15мин', after: '30с', improvement: '-97%' },
      { metric: 'Координация между врачами', before: '48ч', after: '2ч', improvement: '-96%' },
      { metric: 'Удовлетворенность пациентов', before: '72%', after: '94%', improvement: '+31%' },
      { metric: 'Эффективность врачей', before: '65%', after: '88%', improvement: '+35%' },
      { metric: 'Автоматизация процессов', before: '30%', after: '85%', improvement: '+183%' }
    ],
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'WebRTC', 'DICOM', 'HL7', 'FHIR', 'Docker'],
    testimonial: {
      text: 'Система полностью изменила нашу работу. Врачи теперь тратят на 40% меньше времени на документацию, а пациенты получают результаты анализов онлайн. Интеграция с лабораторным оборудованием сократила ошибки на 95%.',
      author: 'Иван Петров',
      position: 'Главный врач МЦ "Здоровье+"',
      avatar: '👨‍⚕️',
      rating: 5
    },
    budget: '8.5M ₽',
    teamSize: '8 специалистов',
    roi: '280% за первый год',
    implementationHighlights: [
      'Миграция 50,000+ бумажных медкарт',
      'Обучение 200+ медицинских работников',
      'Интеграция с 15+ системами лабораторного оборудования',
      'Круглосуточная поддержка с SLA 99.9%'
    ],
    medicalSpecialties: ['Терапия', 'Хирургия', 'Кардиология', 'Неврология', 'Лабораторная диагностика']
  },
  {
    id: '2',
    title: 'AI-диагностика в радиологии',
    client: 'Диагностический центр "Лучевая диагностика"',
    industry: 'Радиология и диагностика',
    duration: '1 год',
    challenge: 'Высокая нагрузка на радиологов, субъективность интерпретации снимков, длительное время диагностики, нехватка специалистов, сложность архивирования DICOM данных',
    solution: 'Разработана система AI-ассистента для анализа медицинских изображений с интеграцией в PACS. Алгоритмы машинного обучения для обнаружения патологий на КТ, МРТ и рентгеновских снимках',
    results: [
      { metric: 'Точность диагностики', before: '89%', after: '96%', improvement: '+8%' },
      { metric: 'Время анализа снимка', before: '12мин', after: '3мин', improvement: '-75%' },
      { metric: 'Обнаружение ранних стадий', before: '68%', after: '92%', improvement: '+35%' },
      { metric: 'Производительность радиологов', before: '15 снимков/день', after: '35 снимков/день', improvement: '+133%' },
      { metric: 'Ложноположительные результаты', before: '8%', after: '2%', improvement: '-75%' }
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'FastAPI', 'PostgreSQL', 'Redis', 'DICOM', 'PACS', 'AWS'],
    testimonial: {
      text: 'AI-ассистент стал незаменимым инструментом в нашей работе. Система не только ускоряет диагностику, но и помогает выявлять патологии, которые могли быть пропущены. Особенно эффективна для скрининговых исследований.',
      author: 'Мария Сидорова',
      position: 'Главный радиолог диагностического центра',
      avatar: '👩‍⚕️',
      rating: 5
    },
    budget: '12M ₽',
    teamSize: '10 специалистов',
    roi: '320% за 18 месяцев',
    implementationHighlights: [
      'Обучение AI-моделей на 500,000+ анонимизированных снимков',
      'Интеграция с существующей PACS системой',
      'Валидация алгоритмов с участием 20+ экспертов-радиологов',
      'Сертификация как медицинского устройства II класса'
    ],
    medicalSpecialties: ['Радиология', 'Онкология', 'Неврология', 'Кардиология', 'Ортопедия']
  },
  {
    id: '3',
    title: 'Умная система мониторинга пациентов',
    client: 'Кардиологический центр "Сердце"',
    industry: 'Кардиология и реабилитация',
    duration: '6 месяцев',
    challenge: 'Отсутствие непрерывного мониторинга после выписки, сложность удаленного наблюдения за хроническими больными, высокая частота повторных госпитализаций',
    solution: 'Создана система удаленного мониторинга пациентов с IoT устройствами (ЭКГ, тонометры, глюкометры) и мобильным приложением. AI-алгоритмы для прогнозирования ухудшений состояния',
    results: [
      { metric: 'Частота повторных госпитализаций', before: '35%', after: '12%', improvement: '-66%' },
      { metric: 'Время реакции на ухудшение', before: '48ч', after: '2ч', improvement: '-96%' },
      { metric: 'Приверженность лечению', before: '58%', after: '89%', improvement: '+53%' },
      { metric: 'Стоимость лечения', before: '120K ₽/год', after: '45K ₽/год', improvement: '-63%' },
      { metric: 'Качество жизни пациентов', before: '6.2/10', after: '8.7/10', improvement: '+40%' }
    ],
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'MQTT', 'TensorFlow', 'WebSocket', 'AWS IoT'],
    testimonial: {
      text: 'Система мониторинга позволила нам перейти от эпизодического к непрерывному наблюдению за пациентами. AI-прогнозирование помогает предотвращать острые состояния, а пациенты чувствуют себя в безопасности.',
      author: 'Ольга Козлова',
      position: 'Главный кардиолог центра',
      avatar: '👩‍⚕️',
      rating: 5
    },
    budget: '6.2M ₽',
    teamSize: '6 специалистов',
    roi: '210% за первый год',
    implementationHighlights: [
      'Интеграция с 10+ типами медицинских IoT устройств',
      'Разработка мобильного приложения для пациентов',
      'Создание AI-моделей прогнозирования на основе реальных данных',
      'Обучение 500+ пациентов использованию системы'
    ],
    medicalSpecialties: ['Кардиология', 'Эндокринология', 'Пульмонология', 'Реабилитация']
  }
];

const roleCards: RoleCard[] = [
  {
    id: 'user',
    title: 'Пациент',
    subtitle: 'Личный кабинет',
    icon: User,
    description: 'Удобный личный кабинет с мобильным приложением для записи на прием, доступа к медицинской карте, онлайн-консультаций и управления здоровьем. Полная безопасность данных и доступность 24/7.',
    points: [
      'Запись на прием к врачам в 2 клика с выбором удобного времени и специалиста',
      'Электронная медицинская карта с историей обращений, диагнозами и назначениями',
      'Онлайн-консультации с врачами через видеосвязь с записью сессий',
      'Доступ к результатам анализов и обследований в реальном времени',
      'Умные напоминания о приемах и приеме лекарств с интеграцией в календарь',
      'Личный дневник здоровья с отслеживанием показателей и симптомов',
      'Электронные рецепты с возможностью заказа доставки лекарств',
      'Система оценок и отзывов о врачах и медицинских услугах',
      'Интеграция с wearable устройствами (Apple Watch, Fitbit)',
      'Доступ к образовательным материалам и рекомендациям по здоровью'
    ],
    tech: ['React Native', 'PWA', 'WebSocket', 'Push Notifications', 'WebRTC', 'HealthKit API', 'FHIR'],
    benefits: [
      'Экономия времени на 70% за счет онлайн-записи и консультаций',
      'Полный контроль над медицинскими данными в одном месте',
      'Безопасное хранение данных с HIPAA-совместимым шифрованием',
      'Удобный доступ с любого устройства в любое время',
      'Персонализированные рекомендации по здоровью на основе AI',
      'Снижение стоимости медицинского обслуживания на 30%'
    ],
    gradient: 'from-blue-500 to-cyan-500',
    stats: [
      { label: 'Активных пациентов', value: '25K+', icon: Users },
      { label: 'Удовлетворенность', value: '95%', icon: Star },
      { label: 'Онлайн-записей', value: '45K+', icon: Calendar },
      { label: 'Мобильные устройства', value: '80%', icon: Smartphone }
    ],
    features: [
      { title: 'Мобильное приложение', description: 'Нативные приложения для iOS и Android с интеграцией HealthKit и Google Fit, push-уведомлениями', icon: Smartphone },
      { title: 'Телемедицина', description: 'HD видеоконсультации с врачами, обмен файлами, электронные рецепты с ЭЦП', icon: Video },
      { title: 'Электронная карта', description: 'Полная история здоровья с прикрепленными документами, анализами и снимками', icon: FileText },
      { title: 'Умные напоминания', description: 'Интеллектуальные уведомления о приемах, приеме лекарств и контрольных обследованиях', icon: Bell }
    ],
    path: '/demo/medicine/user',
    badge: 'Popular',
    metrics: [
      { metric: 'Время записи на прием', value: '2 минуты', improvement: '-85%' },
      { metric: 'Доступность медкарты', value: '24/7', improvement: 'Мобильный доступ' },
      { metric: 'Удовлетворенность', value: '95%', improvement: '+40%' },
      { metric: 'Экономия времени', value: '70%', improvement: 'Автоматизация' }
    ],
    demoVideo: '/demos/patient-demo.mp4',
    accessLevel: 'basic',
    trainingTime: '10 минут',
    compliance: ['HIPAA', 'GDPR', 'ISO 27001']
  },
  {
    id: 'doctor',
    title: 'Врач',
    subtitle: 'Профессиональная панель',
    icon: Stethoscope,
    description: 'Мощная рабочая станция врача с инструментами для ведения приема, работы с электронными медкартами, назначения лечения и телемедицины. Интеграция с медицинским оборудованием и лабораторными системами.',
    points: [
      'Умное расписание приемов с оптимизацией загрузки и автоматическим распределением',
      'Электронные медицинские карты с шаблонами осмотров и стандартизированными протоколами',
      'Система назначений с базой лекарств, взаимодействий и автоматическими проверками',
      'Доступ к результатам анализов и диагностических исследований в реальном времени',
      'Инструменты телемедицины с HD видео, совместным просмотром снимков и записью сессий',
      'Система клинических рекомендаций и протоколов лечения с AI-подсказками',
      'Интеграция с медицинским оборудованием (УЗИ, КТ, МРТ) через DICOM стандарт',
      'Мобильное рабочее место для обходов и экстренных консультаций',
      'Система контроля качества и аудита медицинской помощи',
      'Автоматическое формирование медицинской отчетности и статистики'
    ],
    tech: ['React', 'TypeScript', 'WebRTC', 'DICOM Viewer', 'HL7/FHIR', 'WebSocket', 'IndexedDB'],
    benefits: [
      'Снижение времени на документацию на 60% с помощью умных шаблонов',
      'Улучшение качества диагностики за счет AI-ассистента и клинических рекомендаций',
      'Единое рабочее пространство со всеми инструментами и данными пациента',
      'Мобильность и возможность работы из любого места с синхронизацией данных',
      'Снижение медицинских ошибок на 45% через систему проверок и предупреждений',
      'Автоматизация рутинных задач и формирование отчетности'
    ],
    gradient: 'from-green-500 to-emerald-500',
    stats: [
      { label: 'Активных врачей', value: '850+', icon: UserCheck },
      { label: 'Эффективность', value: '+45%', icon: TrendingUp },
      { label: 'Проведено консультаций', value: '120K+', icon: Stethoscope },
      { label: 'Автоматизация', value: '75%', icon: Zap }
    ],
    features: [
      { title: 'Рабочая станция врача', description: 'Интегрированная панель с медкартой, расписанием, назначениями и телемедициной', icon: Laptop },
      { title: 'DICOM просмотрщик', description: 'Продвинутый инструмент для анализа медицинских изображений с AI-помощником', icon: Scan },
      { title: 'Система назначений', description: 'Умная система выписки рецептов с проверкой взаимодействий и дозировок', icon: Pill },
      { title: 'Мобильное приложение', description: 'Приложение для врачей с оффлайн-режимом и синхронизацией данных', icon: Tablet }
    ],
    path: '/demo/medicine/manager',
    badge: 'Professional',
    metrics: [
      { metric: 'Время на документацию', value: '60% меньше', improvement: 'Автоматизация' },
      { metric: 'Качество диагностики', value: '+25%', improvement: 'AI-ассистент' },
      { metric: 'Медицинские ошибки', value: '-45%', improvement: 'Система проверок' },
      { metric: 'Удовлетворенность врачей', value: '89%', improvement: '+35%' }
    ],
    demoVideo: '/demos/doctor-demo.mp4',
    accessLevel: 'standard',
    trainingTime: '3 часа',
    compliance: ['HIPAA', 'FDA 510(k)', 'CE Marking', 'ISO 13485']
  },
  {
    id: 'admin',
    title: 'Администратор',
    subtitle: 'Система управления',
    icon: BarChart3,
    description: 'Комплексная система управления для администраторов медицинских учреждений с аналитикой, управлением ресурсами, финансовым контролем и обеспечением compliance. AI-прогнозирование нагрузки и оптимизация работы.',
    points: [
      'Панель управления медицинским учреждением с KPI и метриками в реальном времени',
      'Управление персоналом: врачи, медсестры, административный штат с системами ротации',
      'Финансовый контроль: биллинг, страховые выплаты, управление затратами и доходностью',
      'Аналитика эффективности работы отделений и медицинского персонала',
      'Управление ресурсами: оборудование, лекарства, расходные материалы с системой учета',
      'AI-прогнозирование нагрузки и оптимизация расписания для максимальной эффективности',
      'Система обеспечения качества и аккредитации медицинского учреждения',
      'Управление рисками и инцидентами с автоматическим оповещением и эскалацией',
      'Мульти-филиальное управление с консолидированной отчетностью',
      'Автоматическая генерация отчетов для контролирующих органов и страховых компаний'
    ],
    tech: ['TypeScript', 'GraphQL', 'D3.js', 'Machine Learning', 'Python', 'Apache ECharts', 'TensorFlow'],
    benefits: [
      'Полная прозрачность работы учреждения с аналитикой в реальном времени',
      'Снижение операционных затрат на 25% через оптимизацию ресурсов',
      'Data-driven принятие решений с AI-прогнозами и рекомендациями',
      'Автоматическая отчетность для регуляторов с гарантией compliance',
      'Масштабируемая архитектура для роста сети медицинских учреждений',
      'Снижение времени на стратегическое планирование на 50%'
    ],
    gradient: 'from-purple-500 to-indigo-500',
    stats: [
      { label: 'Мед учреждений', value: '75+', icon: Building2 },
      { label: 'Рост эффективности', value: '+30%', icon: TrendingUp },
      { label: 'Автоматизация', value: '80%', icon: Zap },
      { label: 'ROI', value: '350%', icon: LineChart }
    ],
    features: [
      { title: 'BI-дашборды', description: 'Интерактивные панели с глубокой аналитикой по всем аспектам работы учреждения', icon: PieChart },
      { title: 'AI-прогнозирование', description: 'Прогнозирование нагрузки, финансовых показателей и потребности в ресурсах', icon: Brain },
      { title: 'Мульти-филиал', description: 'Управление сетью медицинских учреждений с единой системой отчетности', icon: GitBranch },
      { title: 'Compliance управление', description: 'Автоматический контроль соответствия требованиям регуляторов и стандартов', icon: ShieldCheck }
    ],
    path: '/demo/medicine/owner',
    badge: 'Enterprise',
    metrics: [
      { metric: 'Операционные затраты', value: '-25%', improvement: 'Оптимизация' },
      { metric: 'Эффективность учреждения', value: '+30%', improvement: 'За 6 месяцев' },
      { metric: 'Время отчетности', value: '-85%', improvement: 'Автоматизация' },
      { metric: 'ROI', value: '350%', improvement: 'За первый год' }
    ],
    demoVideo: '/demos/admin-demo.mp4',
    accessLevel: 'premium',
    trainingTime: '6 часов',
    compliance: ['HIPAA', 'GDPR', 'ISO 27001', 'SOC 2', 'JCI Standards']
  },
];

const features: Feature[] = [
  {
    id: 'ehr',
    title: 'Электронная медицинская карта (EHR)',
    description: 'Полнофункциональная система электронных медицинских карт',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    tech: ['FHIR R4', 'HL7 v2/v3', 'DICOM', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis'],
    scenarios: [
      'Ведение полной истории болезни пациента с прикреплением файлов и снимков',
      'Стандартизированные протоколы осмотров и шаблоны для разных специальностей',
      'Интеграция с лабораторным и диагностическим оборудованием',
      'Система клинических решений и предупреждений о взаимодействиях',
      'Мультиязычная поддержка и локализация для международных стандартов',
      'Оффлайн-режим с синхронизацией при восстановлении соединения'
    ],
    stats: [
      { value: '99.95%', label: 'Uptime', icon: Activity },
      { value: '<2с', label: 'Время загрузки', icon: Clock },
      { value: '100%', label: 'FHIR Compatible', icon: CheckCircle2 },
      { value: '50K+', label: 'Медкарт', icon: Database }
    ],
    benchmarks: ['FHIR R4 Compliant', 'HIPAA Certified', 'ISO/HL7 Standards', 'Fast Healthcare Interoperability'],
    documentation: '/docs/ehr-system',
    status: 'stable',
    releaseDate: '2024-01-20',
    compliance: ['HIPAA', 'FHIR R4', 'HL7', 'ISO 27001']
  },
  {
    id: 'telemedicine',
    title: 'Телемедицина и удаленные консультации',
    description: 'Продвинутая система телемедицины с HD видеосвязью',
    icon: Video,
    gradient: 'from-green-500 to-emerald-500',
    tech: ['WebRTC', 'WebSocket', 'SFU', 'React Native', 'Node.js', 'Redis', 'AWS Kinesis'],
    scenarios: [
      'HD видеоконсультации с низкой задержкой и адаптацией к качеству сети',
      'Совместный просмотр медицинских изображений и документов в реальном времени',
      'Электронные рецепты с цифровой подписью и интеграцией с аптеками',
      'Запись консультаций с согласия пациента для учебных и медицинских целей',
      'Интеграция с IoT медицинскими устройствами для удаленного мониторинга',
      'Система бронирования и напоминаний о консультациях'
    ],
    stats: [
      { value: '4K', label: 'HD Quality', icon: Video },
      { value: '<200ms', label: 'Latency', icon: Zap },
      { value: '98%', label: 'Satisfaction', icon: Star },
      { value: '20K+', label: 'Consultations', icon: Users }
    ],
    benchmarks: ['WebRTC Standards', 'HIPAA Compliant', 'Mobile First', 'Low Latency'],
    documentation: '/docs/telemedicine',
    status: 'stable',
    releaseDate: '2024-02-15',
    compliance: ['HIPAA', 'GDPR', 'WebRTC Standards']
  },
  {
    id: 'ai-diagnostics',
    title: 'AI-диагностика и аналитика',
    description: 'Продвинутые алгоритмы машинного обучения для анализа медицинских изображений',
    icon: Brain,
    gradient: 'from-purple-500 to-indigo-500',
    tech: ['TensorFlow', 'PyTorch', 'Python', 'FastAPI', 'DICOM', 'OpenCV', 'AWS SageMaker'],
    scenarios: [
      'Автоматический анализ рентгеновских, КТ и МРТ снимков с выделением патологий',
      'Прогнозирование рисков заболеваний на основе исторических данных и генетики',
      'Система рекомендаций по лечению на основе клинических руководств и данных',
      'Обнаружение аномалий в лабораторных показателях и жизненных показателях',
      'Персонализированные планы лечения с учетом индивидуальных особенностей пациента',
      'Непрерывное обучение моделей на анонимизированных данных'
    ],
    stats: [
      { value: '96%', label: 'Accuracy', icon: Target },
      { value: '3x', label: 'Speed', icon: Zap },
      { value: '45%', label: 'Error Reduction', icon: TrendingUp },
      { value: 'FDA', label: 'Cleared', icon: Award }
    ],
    benchmarks: ['Model Accuracy > 95%', 'Inference < 5s', 'Clinical Validation', 'Continuous Learning'],
    documentation: '/docs/ai-diagnostics',
    status: 'beta',
    releaseDate: '2024-03-01',
    compliance: ['FDA 510(k)', 'CE Marking', 'HIPAA', 'GDPR']
  },
  {
    id: 'compliance',
    title: 'Безопасность и Compliance',
    description: 'Многоуровневая система безопасности',
    icon: ShieldCheck,
    gradient: 'from-amber-500 to-orange-500',
    tech: ['OAuth 2.0', 'RBAC', 'AES-256', 'HIPAA', 'GDPR', 'SOC 2', 'ISO 27001', 'FIPS 140-2'],
    scenarios: [
      'End-to-end шифрование всех медицинских данных и коммуникаций',
      'Ролевая модель доступа с минимальными привилегиями и аудитом действий',
      'Автоматическое обезличивание данных для исследований и обучения AI',
      'Система управления инцидентами и утечками данных с мгновенным оповещением',
      'Регулярные penetration testing и security assessment',
      'Compliance с международными стандартами (HIPAA, GDPR, ISO)'
    ],
    stats: [
      { value: '99.99%', label: 'Uptime SLA', icon: Shield },
      { value: '0', label: 'Security Incidents', icon: CheckCircle2 },
      { value: '100%', label: 'Compliance', icon: Award },
      { value: '<1ч', label: 'Incident Response', icon: Clock }
    ],
    benchmarks: ['HIPAA Compliant', 'GDPR Ready', 'SOC 2 Certified', 'Penetration Testing'],
    documentation: '/docs/security-compliance',
    status: 'stable',
    releaseDate: '2024-01-10',
    compliance: ['HIPAA', 'GDPR', 'SOC 2', 'ISO 27001', 'ISO 13485']
  },
  {
    id: 'iot',
    title: 'IoT и удаленный мониторинг',
    description: 'Комплексная система для подключения медицинских IoT устройств',
    icon: Activity,
    gradient: 'from-rose-500 to-pink-500',
    tech: ['AWS IoT', 'MQTT', 'React Native', 'Node.js', 'TensorFlow', 'WebSocket', 'Bluetooth LE'],
    scenarios: [
      'Интеграция с wearable устройствами (Apple Watch, Fitbit) и медицинскими датчиками',
      'Непрерывный мониторинг жизненных показателей с AI-анализом трендов',
      'Система оповещений о критических изменениях состояния пациента',
      'Удаленная настройка и управление медицинскими IoT устройствами',
      'Сбор данных для клинических исследований и улучшения алгоритмов',
      'Персонализированные рекомендации на основе данных мониторинга'
    ],
    stats: [
      { value: '50+', label: 'Device Types', icon: Watch },
      { value: '99.9%', label: 'Data Accuracy', icon: CheckCircle2 },
      { value: '<5мин', label: 'Alert Time', icon: Bell },
      { value: '10K+', label: 'Patients Monitored', icon: Users }
    ],
    benchmarks: ['Bluetooth 5.0', 'Medical Grade Accuracy', 'Real-time Processing', 'Battery Optimization'],
    documentation: '/docs/iot-monitoring',
    status: 'stable',
    releaseDate: '2024-02-28',
    compliance: ['FDA Class II', 'CE Medical', 'HIPAA', 'Bluetooth SIG']
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
export default function MedicineDemoPage() {
  const [modal, dispatch] = useReducer(modalReducer, { type: 'idle' });
  const initialKpis = useMemo(() => [
    { 
      label: 'Пациентов на платформе', 
      value: 25480, 
      icon: Users, 
      trend: 'up' as const, 
      description: 'Активные пользователи системы',
      format: 'number'
    },
    { 
      label: 'Врачей в системе', 
      value: 856, 
      icon: UserCheck, 
      trend: 'up' as const, 
      description: 'Медицинские специалисты',
      format: 'number'
    },
    { 
      label: 'Удовлетворенность', 
      value: 95.3, 
      suffix: '%', 
      icon: Star, 
      trend: 'up' as const, 
      description: 'NPS и отзывы пациентов',
      format: 'percentage'
    },
    { 
      label: 'Онлайн-консультаций', 
      value: 42.7, 
      suffix: 'K', 
      icon: Video, 
      trend: 'up' as const, 
      description: 'Проведено телемедицинских сессий',
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
    console.log('Medicine Demo Page loaded', {
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
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 z-50"
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
              ${COLOR_PALETTE.primary.blue} 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
              ${COLOR_PALETTE.primary.green} 0%, transparent 50%),
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
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
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
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
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
            className="absolute bg-green-400/30 rounded-full"
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
          className="absolute bg-green-400/30 rounded-full"
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
    { name: 'Команда', href: '#team', icon: Stethoscope },
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              {!reducedMotion && (
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  animate={{ rotate: [0, 180] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
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
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"
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
            placeholder="Поиск по медицинской платформе..."
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
                    <result.icon className="h-4 w-4 text-green-400" />
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
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-pulse" />
          Медицинская платформа 2024 • HIPAA Compliant
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
              Медицинская
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              платформа
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed px-4 text-balance"
          >
            Инновационная система для цифровизации здравоохранения с AI-диагностикой, 
            телемедициной и полным циклом управления медицинским учреждением
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
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('/demo/medicine/user', '_blank')}
            className="group relative bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-2xl w-full sm:w-auto"
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
                  <kpi.icon className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
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
            Демонстрационные роли
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Исследуйте полный функционал платформы через различные пользовательские роли с реальными медицинскими сценариями
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
                        <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto mb-1 sm:mb-2" />
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

                  {/* Compliance Badges */}
                  <div className="flex flex-wrap gap-1 mb-4 sm:mb-6">
                    {role.compliance.slice(0, 2).map((standard) => (
                      <span 
                        key={standard}
                        className="px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs"
                      >
                        {standard}
                      </span>
                    ))}
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
                        role.badge === 'Community' ? 'bg-rose-500 text-white' :
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
            Современные медицинские технологии и проверенные решения для цифровизации здравоохранения
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
                        <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 mx-auto mb-1" />
                        <div className="text-sm sm:text-base font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/60 leading-tight line-clamp-2">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Compliance */}
                  {feature.compliance && (
                    <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                      {feature.compliance.slice(0, 2).map((standard) => (
                        <span 
                          key={standard}
                          className="px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/10 text-green-400 text-xs"
                        >
                          {standard}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Scenarios Preview */}
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-white/80 mb-1 sm:mb-2">Основные сценарии:</h4>
                    <ul className="text-xs text-white/60 space-y-1">
                      {feature.scenarios.slice(0, 2).map((scenario, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0" />
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
            Успешные внедрения платформы в медицинских учреждениях с измеримыми результатами
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
                    <p className="text-green-400 font-semibold text-sm sm:text-base mb-1">{caseStudy.client}</p>
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

                {/* Medical Specialties */}
                <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                  {caseStudy.medicalSpecialties.slice(0, 3).map((specialty) => (
                    <span 
                      key={specialty}
                      className="px-2 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

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
      category: "Frontend & Mobile",
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      items: [
        { name: 'Next.js 14', icon: Layers, description: 'React фреймворк', status: 'stable' },
        { name: 'TypeScript', icon: Shield, description: 'Типизированный JavaScript', status: 'stable' },
        { name: 'React Native', icon: Smartphone, description: 'Мобильные приложения', status: 'stable' },
        { name: 'Tailwind CSS', icon: Palette, description: 'Utility-first CSS', status: 'stable' },
      ]
    },
    {
      category: "Backend & Databases",
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      items: [
        { name: 'Node.js', icon: Cpu, description: 'JavaScript runtime', status: 'stable' },
        { name: 'PostgreSQL', icon: Database, description: 'Реляционная БД', status: 'stable' },
        { name: 'Redis', icon: Zap, description: 'In-memory data store', status: 'stable' },
        { name: 'FHIR/HL7', icon: GitBranch, description: 'Медицинские стандарты', status: 'stable' },
      ]
    },
    {
      category: "AI & Machine Learning",
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      items: [
        { name: 'TensorFlow', icon: Brain, description: 'Machine Learning', status: 'beta' },
        { name: 'PyTorch', icon: Atom, description: 'Deep Learning', status: 'beta' },
        { name: 'OpenCV', icon: Eye, description: 'Computer Vision', status: 'stable' },
        { name: 'DICOM', icon: Scan, description: 'Медицинские изображения', status: 'stable' },
      ]
    },
    {
      category: "Cloud & DevOps",
      icon: CloudIcon,
      color: 'from-amber-500 to-orange-500',
      items: [
        { name: 'Docker', icon: Package, description: 'Containerization', status: 'stable' },
        { name: 'Kubernetes', icon: Workflow, description: 'Orchestration', status: 'stable' },
        { name: 'AWS', icon: CloudIcon, description: 'Cloud platform', status: 'stable' },
        { name: 'Terraform', icon: Settings, description: 'Infrastructure as Code', status: 'stable' },
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
            Современные технологии для создания безопасных и масштабируемых медицинских систем
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
                title: "Безопасность и Compliance", 
                description: "HIPAA, GDPR, ISO 27001, SOC 2, FDA",
                features: ["End-to-end шифрование", "Аудит действий", "RBAC"]
              },
              { 
                icon: Zap, 
                title: "Производительность", 
                description: "CDN, Caching, Real-time, PWA",
                features: ["<100ms response", "99.9% uptime", "Auto-scaling"]
              },
              { 
                icon: TrendingUp, 
                title: "Интероперабельность", 
                description: "FHIR, HL7, DICOM, IoT интеграции",
                features: ["Стандарты HL7/FHIR", "DICOM совместимость", "API First"]
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                {...fadeUp(1 + index * 0.1)}
                whileHover={{ y: -4 }}
                className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all"
              >
                <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mb-3 mx-auto" />
                <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{item.title}</h4>
                <p className="text-white/60 text-xs sm:text-sm mb-3">{item.description}</p>
                <div className="space-y-1">
                  {item.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                      <div className="w-1 h-1 bg-green-400 rounded-full" />
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
            Профессионалы с глубокой экспертизой в создании медицинских платформ
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
                  <p className="text-green-400 text-sm sm:text-base mb-1 sm:mb-2">{member.role}</p>
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

                {/* Medical Certifications */}
                {member.medicalCertifications && (
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-white/80 mb-2">Медицинские сертификаты:</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.medicalCertifications.slice(0, 2).map((cert) => (
                        <span 
                          key={cert}
                          className="px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

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
          {...fadeUp(0.8)}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto">
            {[
              { value: '34+', label: 'Завершенных проектов', icon: CheckCircle2 },
              { value: '12+', label: 'Лет медицинского опыта', icon: Calendar },
              { value: '99.95%', label: 'Доступность систем', icon: ShieldCheck },
              { value: 'HIPAA', label: 'Compliance', icon: Award },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeUp(1 + index * 0.1)}
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mx-auto mb-2" />
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
      value: '25,480',
      label: 'Пациентов на платформе',
      description: 'Активные пользователи системы',
      change: '+15%',
      trend: 'up' as const,
      icon: Users
    },
    {
      value: '856',
      label: 'Врачей в системе',
      description: 'Медицинские специалисты',
      change: '+8%',
      trend: 'up' as const,
      icon: UserCheck
    },
    {
      value: '95.3%',
      label: 'Удовлетворенность',
      description: 'NPS и отзывы пациентов',
      change: '+5.3%',
      trend: 'up' as const,
      icon: Star
    },
    {
      value: '42.7K',
      label: 'Онлайн-консультаций',
      description: 'Проведено телемедицинских сессий',
      change: '+45%',
      trend: 'up' as const,
      icon: Video
    },
    {
      value: '2.3с',
      label: 'Время ответа',
      description: 'Среднее время ответа системы',
      change: '-1.5с',
      trend: 'down' as const,
      icon: Clock
    },
    {
      value: '99.95%',
      label: 'Доступность',
      description: 'Uptime системы',
      change: '+0.3%',
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
            Реальные метрики и показатели эффективности нашей медицинской платформы
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
    { name: 'Команда', href: '#team', icon: Stethoscope },
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
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">Мед. платформа</span>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
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
                        <item.icon className="h-5 w-5 text-green-400" />
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
                        window.open('/demo/medicine/user', '_blank');
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition text-sm"
                    >
                      <Rocket className="h-4 w-4 text-green-400" />
                      Начать демо
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onContact();
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transition text-sm font-semibold"
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
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
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
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech' | 'compliance'>('overview');

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
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5 flex-shrink-0" />
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
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mb-3" />
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

          {activeTab === 'compliance' && (
            <Section title="Соответствие стандартам">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {role.compliance.map((standard, index) => (
                  <motion.div
                    key={standard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 sm:p-4 rounded-xl bg-green-500/20 border border-green-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-400" />
                      <span className="font-semibold text-white text-sm sm:text-base">{standard}</span>
                    </div>
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
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
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
                role.badge === 'Community' ? 'bg-rose-500/20 text-rose-400' :
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
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition shadow-lg text-sm sm:text-base"
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
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto mb-1 sm:mb-2" />
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
              <Calendar className="h-4 w-4 text-green-400" />
              <div>
                <div className="text-white/60 text-sm">Дата релиза</div>
                <div className="text-white font-semibold">
                  {new Date(feature.releaseDate).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Compliance */}
        {feature.compliance && (
          <Section title="Соответствие стандартам">
            <div className="flex flex-wrap gap-2">
              {feature.compliance.map((standard, index) => (
                <span 
                  key={standard}
                  className="px-3 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm"
                >
                  {standard}
                </span>
              ))}
            </div>
          </Section>
        )}

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
                <Play className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5 flex-shrink-0" />
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
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Срок</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.duration}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Улучшение</div>
            <div className="font-semibold text-white text-sm sm:text-base">+{caseStudy.results[0]?.improvement}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Охват</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.results[1]?.after}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto mb-1 sm:mb-2" />
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

        {/* Medical Specialties */}
        <Section title="Медицинские специализации">
          <div className="flex flex-wrap gap-2">
            {caseStudy.medicalSpecialties.map((specialty) => (
              <span 
                key={specialty}
                className="px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </Section>

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
                      <div className="text-green-400 text-xs sm:text-sm">{caseStudy.testimonial.position}</div>
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
            <p className="text-green-400 text-lg sm:text-xl mb-2">{member.role}</p>
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
                  <Sparkles className="h-4 w-4 text-green-400 flex-shrink-0" />
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

        {/* Medical Certifications */}
        {member.medicalCertifications && (
          <Section title="Медицинские сертификаты">
            <div className="flex flex-wrap gap-2">
              {member.medicalCertifications.map((cert) => (
                <span 
                  key={cert}
                  className="px-3 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm"
                >
                  {cert}
                </span>
              ))}
            </div>
          </Section>
        )}

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
    timeline: '',
    medicalSpecialty: ''
  });

  const roles = [
    'Пациент',
    'Врач',
    'Администратор клиники',
    'IT специалист',
    'Медицинский директор',
    'Инвестор',
    'Партнёр',
    'Другое'
  ];

  const budgets = [
    'до 1M ₽',
    '1M - 3M ₽',
    '3M - 5M ₽',
    '5M - 10M ₽',
    '10M+ ₽',
    'Не определён'
  ];

  const timelines = [
    'Срочно (1-3 месяца)',
    'В ближайшее время (3-6 месяцев)',
    'Планирую (6-12 месяцев)',
    'Исследую возможности'
  ];

  const medicalSpecialties = [
    'Терапия',
    'Хирургия',
    'Кардиология',
    'Неврология',
    'Онкология',
    'Педиатрия',
    'Стоматология',
    'Лабораторная диагностика',
    'Радиология',
    'Многопрофильная клиника'
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
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-green-500/50 transition text-sm sm:text-base"
              value={form.name}
              onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
              placeholder="Ваше имя"
            />
          </Field>
          <Field label="Email *">
            <input
              type="email"
              required
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-green-500/50 transition text-sm sm:text-base"
              value={form.email}
              onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
              placeholder="email@example.com"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Организация">
            <input
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-green-500/50 transition text-sm sm:text-base"
              value={form.organization}
              onChange={(e) => setForm(s => ({ ...s, organization: e.target.value }))}
              placeholder="Название медицинского учреждения"
            />
          </Field>
          <Field label="Телефон">
            <input
              type="tel"
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-green-500/50 transition text-sm sm:text-base"
              value={form.phone}
              onChange={(e) => setForm(s => ({ ...s, phone: e.target.value }))}
              placeholder="+7 (000) 000-00-00"
            />
          </Field>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Ваша роль в проекте">
            <select
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-green-500/50 transition text-sm sm:text-base"
              value={form.role}
              onChange={(e) => setForm(s => ({ ...s, role: e.target.value }))}
            >
              <option value="">Выберите роль</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </Field>
          <Field label="Медицинская специализация">
            <select
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-green-500/50 transition text-sm sm:text-base"
              value={form.medicalSpecialty}
              onChange={(e) => setForm(s => ({ ...s, medicalSpecialty: e.target.value }))}
            >
              <option value="">Выберите специализацию</option>
              {medicalSpecialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Примерный бюджет">
            <select
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-green-500/50 transition text-sm sm:text-base"
              value={form.budget}
              onChange={(e) => setForm(s => ({ ...s, budget: e.target.value }))}
            >
              <option value="">Выберите бюджет</option>
              {budgets.map(budget => (
                <option key={budget} value={budget}>{budget}</option>
              ))}
            </select>
          </Field>
          <Field label="Сроки реализации">
            <select
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-green-500/50 transition text-sm sm:text-base"
              value={form.timeline}
              onChange={(e) => setForm(s => ({ ...s, timeline: e.target.value }))}
            >
              <option value="">Выберите сроки</option>
              {timelines.map(timeline => (
                <option key={timeline} value={timeline}>{timeline}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Описание проекта *">
          <textarea
            rows={4}
            required
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-green-500/50 transition resize-none text-sm sm:text-base"
            value={form.description}
            onChange={(e) => setForm(s => ({ ...s, description: e.target.value }))}
            placeholder="Опишите вашу медицинскую задачу, текущие процессы, специфические требования и ожидаемый результат..."
          />
        </Field>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных в соответствии с HIPAA и GDPR
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
          Наш медицинский консультант ответит вам в течение 2 часов в рабочее время.
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
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition text-sm sm:text-base"
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
        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
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

// Иконка Banknote для CaseStudyModal
const Banknote = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M6 12h.01M18 12h.01"></path>
  </svg>
);

// Иконка ArrowRight для MobileMenu
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"></path>
  </svg>
);

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
        0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
        50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.8); }
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
        background: rgba(16, 185, 129, 0.3);
        color: white;
        text-shadow: none;
      }
      
      /* Focus Outline */
      button:focus-visible,
      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        outline: 2px solid rgb(16, 185, 129);
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
        outline: 2px solid #10B981;
        outline-offset: 2px;
      }

      /* Loading states */
      .loading {
        opacity: 0.7;
        pointer-events: none;
      }

      /* Custom selection colors */
      ::-moz-selection {
        background: rgba(16, 185, 129, 0.3);
        color: white;
      }

      /* Medical specific animations */
      @keyframes heartbeat {
        0% { transform: scale(1); }
        25% { transform: scale(1.1); }
        50% { transform: scale(1); }
        75% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }

      .animate-heartbeat {
        animation: heartbeat 2s ease-in-out infinite;
      }
    `}</style>
  );
}