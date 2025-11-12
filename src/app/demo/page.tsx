'use client';

import React, { useEffect, useMemo, useReducer, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { gsap } from 'gsap';

// Импортируем только существующие иконки из lucide-react
import {
  Rocket, Smartphone, Globe, BarChart3, Cpu, Database, ShieldCheck, Layers,
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
  Cast, User
} from 'lucide-react';

// Создаем псевдонимы для конфликтующих иконок
// Добавляем недостающие иконки как псевдонимы существующих
const CupSoda = Coffee;
const Flame = Fire;

const CloudIcon = Cloud;
const CoffeeIcon = CupSoda; // Замена для Coffee
const FlameIcon = Flame; // Замена для Flame
const LightningIcon = Zap; // Замена для Lightning

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
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(120, 119, 198, 0.15)'
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.4);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.4);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 overflow-hidden backdrop-blur ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
        }}
      />
      {children}
    </div>
  );
};

/* ============================================================================
   MAGIC BENTO COMPONENT
============================================================================ */
export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const cardData: BentoCardProps[] = [
  {
    color: '#060010',
    title: 'Analytics',
    description: 'Track user behavior',
    label: 'Insights'
  },
  {
    color: '#060010',
    title: 'Dashboard',
    description: 'Centralized data view',
    label: 'Overview'
  },
  {
    color: '#060010',
    title: 'Collaboration',
    description: 'Work together seamlessly',
    label: 'Teamwork'
  },
  {
    color: '#060010',
    title: 'Automation',
    description: 'Streamline workflows',
    label: 'Efficiency'
  },
  {
    color: '#060010',
    title: 'Integration',
    description: 'Connect favorite tools',
    label: 'Connectivity'
  },
  {
    color: '#060010',
    title: 'Security',
    description: 'Enterprise-grade protection',
    label: 'Protection'
  }
];

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        cards.forEach(card => {
          (card as HTMLElement).style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.card').forEach(card => {
        (card as HTMLElement).style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
  <div
    className="bento-section grid gap-2 p-3 max-w-[54rem] select-none relative"
    style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' }}
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            --border-color: #392e4e;
            --background-dark: #060010;
            --white: hsl(0, 0%, 100%);
            --purple-primary: rgba(132, 0, 255, 1);
            --purple-glow: rgba(132, 0, 255, 0.2);
            --purple-border: rgba(132, 0, 255, 0.8);
          }
          
          .card-responsive {
            grid-template-columns: 1fr;
            width: 90%;
            margin: 0 auto;
            padding: 0.5rem;
          }
          
          @media (min-width: 600px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(4, 1fr);
            }
            
            .card-responsive .card:nth-child(3) {
              grid-column: span 2;
              grid-row: span 2;
            }
            
            .card-responsive .card:nth-child(4) {
              grid-column: 1 / span 2;
              grid-row: 2 / span 2;
            }
            
            .card-responsive .card:nth-child(6) {
              grid-column: 4;
              grid-row: 3;
            }
          }
          
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .card--border-glow:hover::after {
            opacity: 1;
          }
          
          .card--border-glow:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
          
          .particle-container:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.2), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          @media (max-width: 599px) {
            .card-responsive {
              grid-template-columns: 1fr;
              width: 90%;
              margin: 0 auto;
              padding: 0.5rem;
            }
            
            .card-responsive .card {
              width: 100%;
              min-height: 180px;
            }
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive grid gap-2">
          {cardData.map((card, index) => {
            const baseClassName = `card flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${
              enableBorderGlow ? 'card--border-glow' : ''
            }`;

            const cardStyle = {
              backgroundColor: card.color || 'var(--background-dark)',
              borderColor: 'var(--border-color)',
              color: 'var(--white)',
              '--glow-x': '50%',
              '--glow-y': '50%',
              '--glow-intensity': '0',
              '--glow-radius': '200px'
            } as React.CSSProperties;

            if (enableStars) {
              return (
                <ParticleCard
                  key={index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  <div className="card__header flex justify-between gap-3 relative text-white">
                    <span className="card__label text-base">{card.label}</span>
                  </div>
                  <div className="card__content flex flex-col relative text-white">
                    <h3 className={`card__title font-normal text-base m-0 mb-1 ${textAutoHide ? 'text-clamp-1' : ''}`}>
                      {card.title}
                    </h3>
                    <p
                      className={`card__description text-xs leading-5 opacity-90 ${textAutoHide ? 'text-clamp-2' : ''}`}
                    >
                      {card.description}
                    </p>
                  </div>
                </ParticleCard>
              );
            }

            return (
              <div
                key={index}
                className={baseClassName}
                style={cardStyle}
                ref={el => {
                  if (!el) return;

                  const handleMouseMove = (e: MouseEvent) => {
                    if (shouldDisableAnimations) return;

                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    if (enableTilt) {
                      const rotateX = ((y - centerY) / centerY) * -10;
                      const rotateY = ((x - centerX) / centerX) * 10;

                      gsap.to(el, {
                        rotateX,
                        rotateY,
                        duration: 0.1,
                        ease: 'power2.out',
                        transformPerspective: 1000
                      });
                    }

                    if (enableMagnetism) {
                      const magnetX = (x - centerX) * 0.05;
                      const magnetY = (y - centerY) * 0.05;

                      gsap.to(el, {
                        x: magnetX,
                        y: magnetY,
                        duration: 0.3,
                        ease: 'power2.out'
                      });
                    }
                  };

                  const handleMouseLeave = () => {
                    if (shouldDisableAnimations) return;

                    if (enableTilt) {
                      gsap.to(el, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                      });
                    }

                    if (enableMagnetism) {
                      gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                      });
                    }
                  };

                  const handleClick = (e: MouseEvent) => {
                    if (!clickEffect || shouldDisableAnimations) return;

                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const maxDistance = Math.max(
                      Math.hypot(x, y),
                      Math.hypot(x - rect.width, y),
                      Math.hypot(x, y - rect.height),
                      Math.hypot(x - rect.width, y - rect.height)
                    );

                    const ripple = document.createElement('div');
                    ripple.style.cssText = `
                      position: absolute;
                      width: ${maxDistance * 2}px;
                      height: ${maxDistance * 2}px;
                      border-radius: 50%;
                      background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                      left: ${x - maxDistance}px;
                      top: ${y - maxDistance}px;
                      pointer-events: none;
                      z-index: 1000;
                    `;

                    el.appendChild(ripple);

                    gsap.fromTo(
                      ripple,
                      {
                        scale: 0,
                        opacity: 1
                      },
                      {
                        scale: 1,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        onComplete: () => ripple.remove()
                      }
                    );
                  };

                  el.addEventListener('mousemove', handleMouseMove);
                  el.addEventListener('mouseleave', handleMouseLeave);
                  el.addEventListener('click', handleClick);
                }}
              >
                <div className="card__header flex justify-between gap-3 relative text-white">
                  <span className="card__label text-base">{card.label}</span>
                </div>
                <div className="card__content flex flex-col relative text-white">
                  <h3 className={`card__title font-normal text-base m-0 mb-1 ${textAutoHide ? 'text-clamp-1' : ''}`}>
                    {card.title}
                  </h3>
                  <p className={`card__description text-xs leading-5 opacity-90 ${textAutoHide ? 'text-clamp-2' : ''}`}>
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </BentoCardGrid>
    </>
  );
};

/* ============================================================================
   TYPES AND INTERFACES
============================================================================ */
type ProductId = 'web' | 'mobile' | 'ai' | 'cloud';

type ModalState =
  | { type: 'idle' }
  | { type: 'product'; payload: ProductCard }
  | { type: 'industry'; payload: Industry }
  | { type: 'contact' }
  | { type: 'success' }
  | { type: 'mobileMenu' }
  | { type: 'caseStudy'; payload: CaseStudy };

type Action =
  | { type: 'OPEN_PRODUCT'; payload: ProductCard }
  | { type: 'OPEN_INDUSTRY'; payload: Industry }
  | { type: 'OPEN_CONTACT' }
  | { type: 'SUBMIT_CONTACT' }
  | { type: 'CLOSE' }
  | { type: 'SUCCESS' }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'OPEN_CASE_STUDY'; payload: CaseStudy };

type KPI = { 
  label: string; 
  value: number; 
  suffix?: string; 
  delta?: number; 
  icon: React.ElementType;
  trend: 'up' | 'down' | 'stable';
};

type ProductCard = {
  id: ProductId;
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
  pricing: { plan: string; price: string; features: string[] }[];
  integrations: string[];
  caseStudies: string[];
};

type Industry = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  gradient: string;
  tech: string[];
  scenarios: string[];
  customize: string[];
  stats: { value: string; label: string; icon: React.ElementType }[];
  caseStudies: CaseStudy[];
  challenges: string[];
  solutions: string[];
  metrics: { metric: string; value: string; improvement: string }[];
};

type CaseStudy = {
  id: string;
  title: string;
  client: string;
  industry: string;
  duration: string;
  budget: string;
  challenge: string;
  solution: string;
  results: { metric: string; before: string; after: string; improvement: string }[];
  technologies: string[];
  team: { role: string; count: number }[];
  testimonial: { text: string; author: string; position: string };
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
};

/* ============================================================================
   STATE MANAGEMENT
============================================================================ */
function modalReducer(state: ModalState, action: Action): ModalState {
  switch (action.type) {
    case 'OPEN_PRODUCT':   return { type: 'product',  payload: action.payload };
    case 'OPEN_INDUSTRY':  return { type: 'industry', payload: action.payload };
    case 'OPEN_CONTACT':   return { type: 'contact' };
    case 'SUBMIT_CONTACT': return { type: 'success' };
    case 'SUCCESS':        return { type: 'success' };
    case 'TOGGLE_MOBILE_MENU': return state.type === 'mobileMenu' ? { type: 'idle' } : { type: 'mobileMenu' };
    case 'OPEN_CASE_STUDY': return { type: 'caseStudy', payload: action.payload };
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
    name: 'Алексей Петров',
    role: 'Lead Fullstack Developer',
    expertise: ['React', 'Node.js', 'TypeScript', 'AWS'],
    avatar: '👨‍💻',
    experience: '8+ лет',
    projects: 47,
    tech: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL']
  },
  {
    id: '2',
    name: 'Мария Иванова',
    role: 'Senior UX/UI Designer',
    expertise: ['Figma', 'Design Systems', 'User Research'],
    avatar: '👩‍🎨',
    experience: '6+ лет',
    projects: 32,
    tech: ['Figma', 'Adobe XD', 'Sketch', 'Framer', 'Webflow']
  },
  {
    id: '3',
    name: 'Дмитрий Сидоров',
    role: 'DevOps Engineer',
    expertise: ['Docker', 'Kubernetes', 'CI/CD', 'Monitoring'],
    avatar: '👨‍🔧',
    experience: '7+ лет',
    projects: 28,
    tech: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Grafana', 'Prometheus']
  },
  {
    id: '4',
    name: 'Елена Козлова',
    role: 'Mobile Developer',
    expertise: ['React Native', 'Flutter', 'iOS', 'Android'],
    avatar: '👩‍💻',
    experience: '5+ лет',
    projects: 23,
    tech: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase']
  },
  {
    id: '5',
    name: 'Иван Кузнецов',
    role: 'Backend Architect',
    expertise: ['Microservices', 'System Design', 'Database Optimization'],
    avatar: '👨‍💼',
    experience: '10+ лет',
    projects: 51,
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka', 'MongoDB']
  },
  {
    id: '6',
    name: 'Анна Смирнова',
    role: 'QA Automation Engineer',
    expertise: ['Test Automation', 'Performance Testing', 'CI/CD'],
    avatar: '👩‍🔬',
    experience: '5+ лет',
    projects: 29,
    tech: ['Selenium', 'Cypress', 'Jest', 'Playwright', 'Jenkins']
  },
  {
    id: '7',
    name: 'Михаил Орлов',
    role: 'AI/ML Engineer',
    expertise: ['Machine Learning', 'Computer Vision', 'NLP'],
    avatar: '👨‍🔬',
    experience: '6+ лет',
    projects: 18,
    tech: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'scikit-learn']
  },
  {
    id: '8',
    name: 'Ольга Новикова',
    role: 'Product Manager',
    expertise: ['Agile', 'Product Strategy', 'User Analytics'],
    avatar: '👩‍💼',
    experience: '7+ лет',
    projects: 34,
    tech: ['Jira', 'Amplitude', 'Mixpanel', 'Hotjar', 'Google Analytics']
  },
  {
    id: '9',
    name: 'Сергей Волков',
    role: 'Security Engineer',
    expertise: ['Cybersecurity', 'Penetration Testing', 'Security Audits'],
    avatar: '👨‍✈️',
    experience: '8+ лет',
    projects: 22,
    tech: ['OWASP', 'Burp Suite', 'Splunk', 'Wireshark', 'Metasploit']
  },
  {
    id: '10',
    name: 'Татьяна Лебедева',
    role: 'Data Scientist',
    expertise: ['Data Analysis', 'Predictive Modeling', 'Business Intelligence'],
    avatar: '👩‍📊',
    experience: '5+ лет',
    projects: 26,
    tech: ['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Apache Spark']
  },
  {
    id: '11',
    name: 'Павел Соколов',
    role: 'Cloud Architect',
    expertise: ['Cloud Infrastructure', 'Serverless', 'Multi-cloud'],
    avatar: '👨‍🚀',
    experience: '9+ лет',
    projects: 31,
    tech: ['AWS', 'Azure', 'GCP', 'Terraform', 'Serverless Framework']
  },
  {
    id: '12',
    name: 'Юлия Воробьева',
    role: 'Technical Writer',
    expertise: ['Documentation', 'API Guides', 'Technical Content'],
    avatar: '👩‍🏫',
    experience: '4+ лет',
    projects: 41,
    tech: ['Markdown', 'Swagger', 'GitBook', 'Confluence', 'ReadMe']
  }
];

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Автоматизация медицинской клиники',
    client: 'Клиника "Здоровье+"',
    industry: 'Медицина',
    duration: '6 месяцев',
    budget: '₽2.5M',
    challenge: 'Ручная обработка записей, потеря клиентов, сложная отчетность',
    solution: 'Разработана облачная CRM-система с онлайн-записью, телемедициной и автоматической отчетностью',
    results: [
      { metric: 'Онлайн-записи', before: '15%', after: '85%', improvement: '+467%' },
      { metric: 'Время обработки', before: '24ч', after: '2ч', improvement: '-92%' },
      { metric: 'Удержание клиентов', before: '60%', after: '89%', improvement: '+48%' }
    ],
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'WebRTC', 'Stripe'],
    team: [
      { role: 'Frontend Developer', count: 2 },
      { role: 'Backend Developer', count: 2 },
      { role: 'UI/UX Designer', count: 1 },
      { role: 'DevOps', count: 1 }
    ],
    testimonial: {
      text: 'OneStack превзошел все ожидания. Система работает без сбоев, персонал обучился быстро, а клиенты в восторге от онлайн-записи.',
      author: 'Иван Сидоров',
      position: 'Директор клиники "Здоровье+"'
    }
  },
  {
    id: '2',
    title: 'Модернизация логистической платформы',
    client: 'Логистическая компания "БыстрыйГруз"',
    industry: 'Логистика',
    duration: '8 месяцев',
    budget: '₽4.2M',
    challenge: 'Неэффективное планирование маршрутов, отсутствие реального трекинга, ручной ввод данных',
    solution: 'Создана интеллектуальная система управления логистикой с AI-оптимизацией маршрутов и real-time трекингом',
    results: [
      { metric: 'Экономия топлива', before: '0%', after: '28%', improvement: '+28%' },
      { metric: 'Точность ETA', before: '65%', after: '94%', improvement: '+45%' },
      { metric: 'Автоматизация процессов', before: '20%', after: '85%', improvement: '+325%' }
    ],
    technologies: ['React', 'Python', 'PostgreSQL', 'Redis', 'Mapbox', 'TensorFlow'],
    team: [
      { role: 'Fullstack Developer', count: 3 },
      { role: 'Data Scientist', count: 2 },
      { role: 'UI/UX Designer', count: 1 },
      { role: 'DevOps', count: 1 }
    ],
    testimonial: {
      text: 'Внедрение системы позволило сократить затраты на логистику на 28% и значительно улучшить клиентский опыт.',
      author: 'Мария Иванова',
      position: 'CEO логистической компании'
    }
  },
  {
    id: '3',
    title: 'Разработка банковского мобильного приложения',
    client: 'Банк "ФинансПро"',
    industry: 'Финтех',
    duration: '9 месяцев',
    budget: '₽6.8M',
    challenge: 'Устаревшее мобильное приложение, низкая конверсия, проблемы с безопасностью',
    solution: 'Создано современное кроссплатформенное приложение с биометрической аутентификацией и AI-ассистентом',
    results: [
      { metric: 'Конверсия операций', before: '42%', after: '78%', improvement: '+86%' },
      { metric: 'Рейтинг в сторах', before: '3.2', after: '4.7', improvement: '+47%' },
      { metric: 'Время загрузки', before: '4.2с', after: '1.1с', improvement: '-74%' }
    ],
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Firebase', 'Face ID', 'OpenAI API'],
    team: [
      { role: 'Mobile Developer', count: 3 },
      { role: 'Backend Developer', count: 2 },
      { role: 'Security Engineer', count: 1 },
      { role: 'UI/UX Designer', count: 1 }
    ],
    testimonial: {
      text: 'Новое приложение полностью изменило восприятие нашего банка клиентами. Конверсия выросла почти в 2 раза!',
      author: 'Алексей Петров',
      position: 'CTO банка "ФинансПро"'
    }
  },
  {
    id: '4',
    title: 'Внедрение системы умного дома',
    client: 'Технологическая компания "УмныйДом"',
    industry: 'IoT',
    duration: '7 месяцев',
    budget: '₽3.9M',
    challenge: 'Фрагментированная экосистема устройств, сложность интеграции, отсутствие единого интерфейса',
    solution: 'Разработана универсальная платформа для управления умным домом с голосовым помощником и сценариями автоматизации',
    results: [
      { metric: 'Интеграция устройств', before: '45%', after: '92%', improvement: '+104%' },
      { metric: 'Время отклика', before: '800мс', after: '120мс', improvement: '-85%' },
      { metric: 'Удовлетворенность пользователей', before: '3.1', after: '4.6', improvement: '+48%' }
    ],
    technologies: ['Vue.js', 'Python', 'MQTT', 'WebSocket', 'TensorFlow', 'AWS IoT'],
    team: [
      { role: 'Frontend Developer', count: 2 },
      { role: 'Backend Developer', count: 2 },
      { role: 'IoT Engineer', count: 2 },
      { role: 'AI Engineer', count: 1 }
    ],
    testimonial: {
      text: 'Платформа OneStack позволила нам создать действительно умную экосистему, которая понимает потребности пользователей.',
      author: 'Дмитрий Семенов',
      position: 'CEO компании "УмныйДом"'
    }
  },
  {
    id: '5',
    title: 'Создание образовательной платформы',
    client: 'Образовательный центр "Знание"',
    industry: 'Образование',
    duration: '5 месяцев',
    budget: '₽2.8M',
    challenge: 'Низкая вовлеченность студентов, отсутствие персонализации, сложность отслеживания прогресса',
    solution: 'Разработана интерактивная образовательная платформа с AI-рекомендациями, геймификацией и аналитикой прогресса',
    results: [
      { metric: 'Вовлеченность студентов', before: '35%', after: '82%', improvement: '+134%' },
      { metric: 'Успеваемость', before: '68%', after: '89%', improvement: '+31%' },
      { metric: 'Персонализация контента', before: '0%', after: '95%', improvement: '+95%' }
    ],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Redis', 'OpenAI API', 'WebRTC'],
    team: [
      { role: 'Fullstack Developer', count: 3 },
      { role: 'UI/UX Designer', count: 1 },
      { role: 'Data Scientist', count: 1 },
      { role: 'DevOps', count: 1 }
    ],
    testimonial: {
      text: 'Платформа кардинально изменила подход к обучению. Студенты теперь действительно вовлечены в процесс!',
      author: 'Елена Ковалева',
      position: 'Директор образовательного центра'
    }
  },
  {
    id: '6',
    title: 'Оптимизация e-commerce платформы',
    client: 'Интернет-магазин "МодныйСтиль"',
    industry: 'Ритейл',
    duration: '4 месяца',
    budget: '₽2.1M',
    challenge: 'Медленная загрузка страниц, высокая корзина брошенных покупок, слабая мобильная версия',
    solution: 'Проведена полная оптимизация производительности, внедрен PWA, улучшена мобильная версия и UX',
    results: [
      { metric: 'Скорость загрузки', before: '3.8с', after: '0.9с', improvement: '-76%' },
      { metric: 'Конверсия', before: '1.8%', after: '4.2%', improvement: '+133%' },
      { metric: 'Мобильные продажи', before: '28%', after: '65%', improvement: '+132%' }
    ],
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'PWA', 'Lighthouse'],
    team: [
      { role: 'Frontend Developer', count: 2 },
      { role: 'Backend Developer', count: 1 },
      { role: 'UI/UX Designer', count: 1 },
      { role: 'Performance Engineer', count: 1 }
    ],
    testimonial: {
      text: 'После оптимизации наши продажи выросли в 2.3 раза! OneStack сделали невозможное возможным.',
      author: 'Анна Морозова',
      position: 'CMO интернет-магазина'
    }
  },
  {
    id: '7',
    title: 'Разработка системы для фитнес-клуба',
    client: 'Фитнес-сеть "ActiveLife"',
    industry: 'Фитнес',
    duration: '5 месяцев',
    budget: '₽1.9M',
    challenge: 'Ручное управление расписанием, отсутствие онлайн-записи, сложности с аналитикой посещений',
    solution: 'Создана комплексная система управления фитнес-клубом с мобильным приложением, онлайн-записью и аналитикой',
    results: [
      { metric: 'Онлайн-записи', before: '12%', after: '78%', improvement: '+550%' },
      { metric: 'Загрузка тренеров', before: '65%', after: '92%', improvement: '+42%' },
      { metric: 'Удержание клиентов', before: '55%', after: '84%', improvement: '+53%' }
    ],
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Stripe', 'Google Maps API'],
    team: [
      { role: 'Mobile Developer', count: 2 },
      { role: 'Backend Developer', count: 1 },
      { role: 'UI/UX Designer', count: 1 },
      { role: 'DevOps', count: 1 }
    ],
    testimonial: {
      text: 'Система позволила автоматизировать 80% рутинных процессов и сосредоточиться на развитии бизнеса.',
      author: 'Сергей Попов',
      position: 'Владелец фитнес-сети'
    }
  },
  {
    id: '8',
    title: 'Создание платформы для удаленной работы',
    client: 'IT компания "RemoteTeam"',
    industry: 'HR Tech',
    duration: '6 месяцев',
    budget: '₽3.5M',
    challenge: 'Низкая продуктивность удаленных команд, сложности коммуникации, отсутствие инструментов коллаборации',
    solution: 'Разработана всеобъемлющая платформа для удаленной работы с видеоконференциями, таск-менеджером и аналитикой продуктивности',
    results: [
      { metric: 'Продуктивность команд', before: '68%', after: '91%', improvement: '+34%' },
      { metric: 'Время на коммуникацию', before: '35%', after: '18%', improvement: '-49%' },
      { metric: 'Удовлетворенность сотрудников', before: '6.2', after: '8.7', improvement: '+40%' }
    ],
    technologies: ['React', 'Node.js', 'WebRTC', 'PostgreSQL', 'Redis', 'Socket.io'],
    team: [
      { role: 'Fullstack Developer', count: 4 },
      { role: 'UI/UX Designer', count: 2 },
      { role: 'DevOps', count: 1 },
      { role: 'QA Engineer', count: 1 }
    ],
    testimonial: {
      text: 'OneStack создали идеальную платформу для наших распределенных команд. Продуктивность выросла на 34%!',
      author: 'Ольга Новикова',
      position: 'HR Director компании'
    }
  }
];

const productCards: ProductCard[] = [
  {
    id: 'web',
    title: 'Веб-приложения',
    subtitle: 'Современные веб-решения для бизнеса',
    icon: Globe,
    description: 'Высокопроизводительные веб-приложения на современном стеке технологий с фокусом на пользовательский опыт и масштабируемость.',
    points: [
      'SSR/ISR на Next.js 14',
      'Микрофронтенд архитектура',
      'Real-time обновления',
      'PWA и офлайн-режим',
      'SEO-оптимизация'
    ],
    tech: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'tRPC', 'Prisma', 'PostgreSQL', 'Redis', 'WebSockets'],
    benefits: [
      'Мгновенная загрузка страниц',
      'Высокая конверсия',
      'Лучшие практики SEO',
      'Кроссплатформенная совместимость'
    ],
    gradient: 'from-cyan-500 via-blue-500 to-purple-600',
    stats: [
      { label: 'Lighthouse Score', value: '95+', icon: Award },
      { label: 'Time to Interactive', value: '< 1.2s', icon: Clock },
      { label: 'Core Web Vitals', value: 'Green', icon: CheckCircle2 }
    ],
    features: [
      { title: 'Server Components', description: 'Максимальная производительность с React Server Components', icon: Server },
      { title: 'Edge Runtime', description: 'Глобальная доставка с edge computing', icon: CloudIcon },
      { title: 'Type Safety', description: 'End-to-end типизация с TypeScript', icon: ShieldCheck }
    ],
    pricing: [
      {
        plan: 'Старт',
        price: '₽150K',
        features: ['До 5 страниц', 'Базовый дизайн', 'Хостинг включен', 'Техподдержка 3 месяца']
      },
      {
        plan: 'Бизнес',
        price: '₽450K',
        features: ['Неограниченно страниц', 'Индивидуальный дизайн', 'CRM интеграция', 'Год поддержки']
      }
    ],
    integrations: ['Google Analytics', 'Stripe', 'SendGrid', 'Auth0', 'Intercom'],
    caseStudies: ['Клиника "Здоровье+"', 'Логистическая компания "БыстрыйГруз"']
  },
  {
    id: 'mobile',
    title: 'Мобильные приложения',
    subtitle: 'Нативные и кроссплатформенные решения',
    icon: Smartphone,
    description: 'Высококачественные мобильные приложения для iOS и Android с нативным пользовательским опытом.',
    points: [
      'React Native & Flutter',
      'Нативная производительность',
      'Офлайн-режим',
      'Push-уведомления',
      'App Store оптимизация'
    ],
    tech: ['React Native', 'Flutter', 'Expo', 'Firebase', 'Redux', 'TypeScript', 'Fastlane'],
    benefits: [
      'Единый код для двух платформ',
      'Нативный UX',
      'Быстрый time-to-market',
      'Легкое обновление'
    ],
    gradient: 'from-emerald-500 via-teal-500 to-green-600',
    stats: [
      { label: 'App Store Rating', value: '4.8+', icon: Star },
      { label: 'Размер приложения', value: '< 15MB', icon: Package },
      { label: 'FPS', value: '60 FPS', icon: TrendingUp }
    ],
    features: [
      { title: 'Офлайн-first', description: 'Работа без интернета с синхронизацией', icon: Database },
      { title: 'Нативные модули', description: 'Полный доступ к API устройства', icon: Cpu },
      { title: 'Smooth Animations', description: 'Плавные анимации 60fps', icon: Play }
    ],
    pricing: [
      {
        plan: 'Базовый',
        price: '₽300K',
        features: ['Одна платформа', 'Базовые функции', 'Публикация в сторах', '6 месяцев поддержки']
      },
      {
        plan: 'Премиум',
        price: '₽650K',
        features: ['iOS + Android', 'Расширенные функции', 'Интеграция с бэкендом', 'Годовая поддержка']
      }
    ],
    integrations: ['Firebase', 'OneSignal', 'Stripe', 'Google Maps', 'Social Auth'],
    caseStudies: ['Фитнес-приложение "ActiveLife"', 'Банковское приложение "QuickPay"']
  },
  {
    id: 'ai',
    title: 'AI Solutions',
    subtitle: 'Искусственный интеллект для бизнеса',
    icon: Bot,
    description: 'Внедрение искусственного интеллекта и машинного обучения для автоматизации процессов и улучшения决策.',
    points: [
      'LLM интеграции',
      'Computer Vision',
      'Recommendation Systems',
      'Natural Language Processing',
      'Predictive Analytics'
    ],
    tech: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI API', 'LangChain', 'FastAPI', 'Docker'],
    benefits: [
      'Автоматизация рутинных задач',
      'Умная аналитика данных',
      'Персонализация пользовательского опыта',
      'Прогнозирование трендов'
    ],
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
    stats: [
      { label: 'Точность моделей', value: '95%+', icon: Target },
      { label: 'Время обработки', value: '< 2s', icon: Clock },
      { label: 'Экономия времени', value: '70%', icon: Zap }
    ],
    features: [
      { title: 'Chatbots', description: 'Умные ассистенты для поддержки клиентов', icon: MessageCircle },
      { title: 'Content Generation', description: 'Генерация контента и копирайтинг', icon: FileText },
      { title: 'Data Analysis', description: 'Глубокий анализ данных и инсайты', icon: BarChart3 }
    ],
    pricing: [
      {
        plan: 'Старт AI',
        price: '₽500K',
        features: ['Базовый чат-бот', 'Анализ данных', 'Интеграция с сайтом', 'Обучение модели']
      },
      {
        plan: 'Enterprise AI',
        price: '₽1.2M',
        features: ['Кастомные модели', 'Real-time обработка', 'API доступ', 'Полная кастомизация']
      }
    ],
    integrations: ['OpenAI', 'Hugging Face', 'Google AI', 'Azure Cognitive', 'AWS SageMaker'],
    caseStudies: ['AI-ассистент для e-commerce', 'Система рекомендаций для медиа']
  },
  {
    id: 'cloud',
    title: 'Cloud Solutions',
    subtitle: 'Масштабируемая облачная инфраструктура',
    icon: CloudIcon,
    description: 'Полноценные облачные решения с автоматическим масштабированием, высокой доступностью и безопасностью.',
    points: [
      'Auto-scaling',
      'Microservices Architecture',
      'CI/CD Pipeline',
      'Monitoring & Logging',
      'Disaster Recovery'
    ],
    tech: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Grafana', 'Prometheus', 'GitLab CI'],
    benefits: [
      '99.9% доступность',
      'Автоматическое масштабирование',
      'Высокая безопасность',
      'Экономическая эффективность'
    ],
    gradient: 'from-orange-500 via-red-500 to-pink-600',
    stats: [
      { label: 'Uptime', value: '99.95%', icon: Shield },
      { label: 'Response Time', value: '< 100ms', icon: Gauge },
      { label: 'Cost Saving', value: '40%', icon: TrendingUp }
    ],
    features: [
      { title: 'Auto-scaling', description: 'Автоматическое масштабирование под нагрузку', icon: RefreshCw },
      { title: 'Zero Downtime', description: 'Обновления без прерывания работы', icon: Zap },
      { title: 'Security First', description: 'Многоуровневая система безопасности', icon: ShieldCheck }
    ],
    pricing: [
      {
        plan: 'Cloud Basic',
        price: '₽25K/мес',
        features: ['2 vCPU, 4GB RAM', '100GB SSD', '1TB трафик', 'Базовый мониторинг']
      },
      {
        plan: 'Cloud Enterprise',
        price: '₽85K/мес',
        features: ['8 vCPU, 16GB RAM', '500GB SSD', '5TB трафик', 'Расширенный мониторинг']
      }
    ],
    integrations: ['AWS Services', 'GitHub Actions', 'Slack', 'Datadog', 'New Relic'],
    caseStudies: ['Масштабирование SaaS платформы', 'Миграция в облако для ритейла']
  }
];

const industries: Industry[] = [
  {
    id: 'medicine',
    title: 'Медицина',
    description: 'Запись, телемедицина, биллинг, отчёты',
    href: '/demo/medicine',
    icon: Heart,
    gradient: 'from-red-500 via-pink-500 to-rose-600',
    tech: ['HL7/FHIR', 'WebRTC', 'Keycloak', 'Stripe', 'PostgreSQL', 'Redis', 'Kafka'],
    scenarios: [
      'Онлайн-запись на прием',
      'Телемедицина и видео-консультации',
      'Электронная медицинская карта',
      'Управление расписанием врачей'
    ],
    customize: [
      'Интеграция с медицинским оборудованием',
      'Кастомизация под специфику клиники',
      'Модуль телемедицины',
      'Система напоминаний'
    ],
    stats: [
      { value: '3x', label: 'Скорость записи', icon: Zap },
      { value: '40%', label: 'Снижение нагрузки', icon: TrendingUp },
      { value: '99.9%', label: 'Доступность', icon: Shield }
    ],
    caseStudies: [caseStudies[0]],
    challenges: [
      'Ручная обработка записей',
      'Потеря медицинских карт',
      'Сложность координации между отделениями'
    ],
    solutions: [
      'Цифровая трансформация процессов',
      'Единая система данных',
      'Автоматизация рутинных задач'
    ],
    metrics: [
      { metric: 'Время записи', value: '2 минуты', improvement: '-85%' },
      { metric: 'Удовлетворенность', value: '94%', improvement: '+35%' },
      { metric: 'Эффективность', value: '78%', improvement: '+42%' }
    ]
  },
  {
    id: 'logistics',
    title: 'Логистика',
    description: 'Доставка, трекинг, склад, накладные',
    href: '/demo/logistics',
    icon: Truck,
    gradient: 'from-amber-500 via-orange-500 to-yellow-600',
    tech: ['WMS/OMS', 'Route Optimization', 'Barcode/RFID', '1C/ERP', 'Redis'],
    scenarios: [
      'Оптимизация маршрутов доставки',
      'Трекинг транспорта в реальном времени',
      'Управление складскими запасами',
      'Автоматизация документооборота'
    ],
    customize: [
      'Интеграция с GPS-трекерами',
      'Кастомизация под виды транспорта',
      'Модуль расчета тарифов',
      'Система уведомлений'
    ],
    stats: [
      { value: '30%', label: 'Экономия топлива', icon: TrendingUp },
      { value: '2x', label: 'Скорость доставки', icon: Zap },
      { value: '99.5%', label: 'Точность инвентаря', icon: CheckCircle2 }
    ],
    caseStudies: [caseStudies[1]],
    challenges: [
      'Неэффективные маршруты',
      'Отсутствие реального трекинга',
      'Ручной ввод данных'
    ],
    solutions: [
      'AI-оптимизация маршрутов',
      'Real-time мониторинг',
      'Автоматизация процессов'
    ],
    metrics: [
      { metric: 'Стоимость доставки', value: '-25%', improvement: 'Экономия' },
      { metric: 'Время в пути', value: '-35%', improvement: 'Сокращение' },
      { metric: 'Точность ETA', value: '95%', improvement: '+40%' }
    ]
  },
  {
    id: 'autoservice',
    title: 'Автосервис',
    description: 'Заявки, расчёт, расписание, фотоотчёты',
    href: '/demo/autoservice',
    icon: Wrench,
    gradient: 'from-emerald-500 via-green-500 to-lime-600',
    tech: ['VIN-decoder', 'Payments', 'SMS/WhatsApp', 'S3 Media', 'Keycloak'],
    scenarios: [
      'Сметы и согласования',
      'История ремонтов',
      'Запчасти и комплектующие',
      'Онлайн-оплата'
    ],
    customize: [
      'Прайс-калькулятор',
      'Интеграция DMS',
      'Каталог ARN',
      'Шаблоны актов'
    ],
    stats: [
      { value: '45%', label: 'Рост клиентов', icon: TrendingUp },
      { value: '3.5x', label: 'Онлайн-записей', icon: Zap },
      { value: '80%', label: 'Повторных обращений', icon: CheckCircle2 }
    ],
    caseStudies: [],
    challenges: [
      'Ручное ведение записей',
      'Сложности с расчетом стоимости',
      'Потеря истории ремонтов'
    ],
    solutions: [
      'Цифровая система записи',
      'Автоматический расчет стоимости',
      'Централизованная база данных'
    ],
    metrics: [
      { metric: 'Загрузка мастеров', value: '92%', improvement: '+28%' },
      { metric: 'Точность расчетов', value: '98%', improvement: '+45%' },
      { metric: 'Время обслуживания', value: '-40%', improvement: 'Сокращение' }
    ]
  },
  {
    id: 'social',
    title: 'Социальные услуги',
    description: 'Кейсы сопровождения граждан, заявки, выплаты, отчеты',
    href: '/demo/social',
    icon: Users,
    gradient: 'from-cyan-500 via-blue-500 to-sky-500',
    tech: ['ESIA/ГОСУслуги', 'Case Management', 'BI Reports', '1C', 'Docflow'],
    scenarios: [
      'Регистрация граждан и ведение случаев',
      'Назначение и контроль социальных услуг',
      'Волонтерские программы и мобильные бригады',
      'Отчетность для региональных ведомств'
    ],
    customize: [
      'Уведомления в мессенджеры',
      'Цифровые карты семьи',
      'Интеграция с региональными реестрами',
      'Мобильный кабинет куратора'
    ],
    stats: [
      { value: '12K', label: 'Активных случаев', icon: Users2 },
      { value: '4.8', label: 'Оценка заботы', icon: Star },
      { value: '60%', label: 'Автозаявок', icon: Zap }
    ],
    caseStudies: [],
    challenges: [
      'Фрагментарные данные о семьях',
      'Очереди и ручное согласование услуг',
      'Сложность подготовки статистики'
    ],
    solutions: [
      'Единый цифровой профиль гражданина',
      'Автоматические маршруты согласования',
      'BI-дэшборды с метриками эффективности'
    ],
    metrics: [
      { metric: 'Время обработки заявки', value: '-55%', improvement: 'Сокращение' },
      { metric: 'Доступность услуг', value: '24/7', improvement: 'Мобильные каналы' },
      { metric: 'Своевременность выплат', value: '99%', improvement: '+21%' }
    ]
  },
  {
    id: 'transport',
    title: 'Общественный транспорт',
    description: 'Маршруты, GPS-мониторинг, билеты, расписания',
    href: '/demo/transport',
    icon: Bus,
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    tech: ['GTFS', 'AVL/GPS', 'Payment Hub', 'BI', 'Digital Twins'],
    scenarios: [
      'Планирование рейсов и смен водителей',
      'Онлайн-продажа билетов и абонементов',
      'Мониторинг транспорта на карте',
      'Отчетность по KPI перевозчика'
    ],
    customize: [
      'Интеграция с валидаторами',
      'Видеоаналитика салона',
      'Приложение пассажира',
      'Динамические расписания'
    ],
    stats: [
      { value: '95%', label: 'Точность ETA', icon: Navigation },
      { value: '18%', label: 'Экономия топлива', icon: Gauge },
      { value: '35%', label: 'Рост e-билетов', icon: TrendingUp }
    ],
    caseStudies: [],
    challenges: [
      'Нет актуальных данных по задержкам',
      'Ручное составление расписания',
      'Сложно оценить загрузку маршрутов'
    ],
    solutions: [
      'Интеллектуальное планирование',
      'Live-трекинг транспорта и уведомления',
      'Аналитика загрузки и тепловые карты'
    ],
    metrics: [
      { metric: 'Время простоя', value: '-22%', improvement: 'Меньше холостых рейсов' },
      { metric: 'Жалобы пассажиров', value: '-38%', improvement: 'Push-уведомления' },
      { metric: 'Доход от билетов', value: '+19%', improvement: 'Онлайн-продажи' }
    ]
  },
  {
    id: 'services',
    title: 'Сфера услуг',
    description: 'Онлайн-бронирование, программы лояльности, продажи',
    href: '/demo/services',
    icon: Monitor,
    gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
    tech: ['Booking Engine', 'Loyalty', 'CDP', 'Payments', 'Marketing Automation'],
    scenarios: [
      'Витрина услуг и динамическое расписание',
      'Клиентские сегменты и персональные предложения',
      'Финансовая аналитика и прогнозирование',
      'Интеграции с маркетплейсами и CRM'
    ],
    customize: [
      'Мобильное приложение бренда',
      'Oмни-канальные уведомления',
      'Программа лояльности с cashback',
      'BI-дашборды под KPI сети'
    ],
    stats: [
      { value: '4.6', label: 'NPS клиентов', icon: Smile },
      { value: '72%', label: 'Онлайн-заказов', icon: ShoppingCart },
      { value: '2.3x', label: 'LTV клиентов', icon: TrendingUp }
    ],
    caseStudies: [],
    challenges: [
      'Несинхронизированные каналы продаж',
      'Нет прозрачности по марже услуг',
      'Сложно удерживать повторных клиентов'
    ],
    solutions: [
      'Единый каталог и календарь',
      'CDP + аналитика выручки',
      'Геймифицированная лояльность'
    ],
    metrics: [
      { metric: 'Повторные покупки', value: '+48%', improvement: 'За 3 месяца' },
      { metric: 'Средний чек', value: '+27%', improvement: 'Персональные офферы' },
      { metric: 'Загрузка мастеров', value: '88%', improvement: '+20%' }
    ]
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

const spring = { 
  type: "spring", 
  stiffness: 300, 
  damping: 30 
};

/* ============================================================================
   MAIN COMPONENT
============================================================================ */
export default function DemoDashboardPage() {
  const [modal, dispatch] = useReducer(modalReducer, { type: 'idle' });
  const [kpis, setKpis] = useState<KPI[]>([
    { label: 'Active Users', value: 12800, icon: Users, trend: 'up' },
    { label: 'Conversion Rate', value: 3.7, suffix: '%', icon: TrendingUp, trend: 'up' },
    { label: 'Uptime', value: 99.95, suffix: '%', icon: Shield, trend: 'stable' },
    { label: 'Avg Response', value: 182, suffix: 'ms', icon: Clock, trend: 'down' },
  ]);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // KPI animation
  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(prev => prev.map(kpi => {
        const variation = (Math.random() - 0.5) * (kpi.label.includes('Users') ? 200 : 0.5);
        const newValue = kpi.value + variation;
        const trend = variation > 0 ? 'up' : variation < 0 ? 'down' : 'stable';
        
        return {
          ...kpi,
          value: Number(newValue.toFixed(kpi.suffix ? 2 : 0)),
          delta: variation,
          trend
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-black text-white overflow-x-hidden relative"
    >
      {/* Animated Background */}
      <InteractiveBackground mousePosition={mousePosition} scrollProgress={scrollProgress} />
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 z-50"
        style={{ width: `${scrollProgress}%` }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />
      
      {/* Floating Particles */}
      <FloatingParticles count={20} />
      
      {/* Header */}
      <Header 
        onMenuToggle={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
        scrollProgress={scrollProgress}
      />

      <main className="relative pb-[140px] sm:pb-[160px] lg:pb-[200px]">
        {/* Hero Section */}
        <HeroSection 
          kpis={kpis} 
          onContact={() => dispatch({ type: 'OPEN_CONTACT' })}
        />

        {/* Products Section */}
        <ProductsSection onOpen={(p) => dispatch({ type: 'OPEN_PRODUCT', payload: p })} />

        {/* Industries Section */}
        <IndustriesSection onOpen={(i) => dispatch({ type: 'OPEN_INDUSTRY', payload: i })} />

        {/* Tech Stack Section */}
        <TechStackSection />

        {/* Case Studies Section */}
        <CaseStudiesSection onOpen={(cs) => dispatch({ type: 'OPEN_CASE_STUDY', payload: cs })} />

        {/* Team Section */}
        <TeamSection />

        {/* Process Section */}
        <ProcessSection />

        {/* Testimonials Section */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={modal.type === 'mobileMenu'} 
        onClose={() => dispatch({ type: 'CLOSE' })}
        onContact={() => dispatch({ type: 'OPEN_CONTACT' })}
      />

      {/* Modals */}
      <AnimatePresence mode="wait">
        {modal.type === 'product' && (
          <ProductModal product={modal.payload} onClose={() => dispatch({ type: 'CLOSE' })} />
        )}
        {modal.type === 'industry' && (
          <IndustryModal industry={modal.payload} onClose={() => dispatch({ type: 'CLOSE' })} />
        )}
        {modal.type === 'contact' && (
          <ContactModal
            onClose={() => dispatch({ type: 'CLOSE' })}
            onSubmit={() => dispatch({ type: 'SUBMIT_CONTACT' })}
          />
        )}
        {modal.type === 'success' && (
          <SuccessModal onClose={() => dispatch({ type: 'CLOSE' })} />
        )}
        {modal.type === 'caseStudy' && (
          <CaseStudyModal caseStudy={modal.payload} onClose={() => dispatch({ type: 'CLOSE' })} />
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
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* Animated Gradient */}
      <div
        className="absolute inset-0 opacity-40 transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(120, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
              rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at ${mousePosition.x}% ${100 - mousePosition.y}%, 
              rgba(119, 198, 255, 0.1) 0%, transparent 50%)
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

      return {
        initialX: formatUnit(initialX, 'vw'),
        initialY: formatUnit(initialY, 'vh'),
        targetX: formatUnit(targetX, 'vw'),
        targetY: formatUnit(targetY, 'vh'),
        scale: formatNumber(scale),
        duration: formatNumber(duration),
        delay: formatNumber(delay),
      };
    });
  }, [count]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            scale: particle.scale,
          }}
          animate={{
            y: [particle.initialY, particle.targetY],
            x: [particle.initialX, particle.targetX],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================================
   HEADER
============================================================================ */
function Header({ onMenuToggle, scrollProgress }: { 
  onMenuToggle: () => void; 
  scrollProgress: number;
}) {
  const headerOpacity = useTransform(() => Math.min(scrollProgress / 10, 1));
  const headerBlur = useTransform(() => Math.min(scrollProgress / 2, 10));

  return (
    <motion.header 
      style={{ 
        opacity: headerOpacity,
        backdropFilter: `blur(${headerBlur}px)`
      }}
      className="fixed top-0 z-50 w-full px-4 sm:px-6 pt-4"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl px-4 sm:px-6 py-3 shadow-2xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Layers className="h-5 w-5 text-white" />
              </div>
            </motion.div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                OneStack
              </span>
              <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full hidden sm:inline-block">
                Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { name: 'Продукты', href: '#products' },
              { name: 'Отрасли', href: '#industries' },
              { name: 'Технологии', href: '#tech' },
            ].map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-sm text-white/70 hover:text-white transition-colors font-medium relative group"
                whileHover={{ y: -2 }}
              >
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {/* Open contact */}}
              className="hidden sm:flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/20 transition backdrop-blur"
            >
              <MessageSquareMore className="h-4 w-4" />
              <span className="hidden md:inline">Контакты</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

/* ============================================================================
   HERO SECTION
============================================================================ */
function HeroSection({ kpis, onContact }: { 
  kpis: KPI[]; 
  onContact: () => void;
}) {
  return (
    <section
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
          <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse" />
          OneStack Platform 2025
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Цифровые
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              решения
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed px-4"
          >
            Создаём инновационные цифровые продукты, которые преобразуют бизнес процессы, 
            улучшают пользовательский опыт и обеспечивают конкурентное преимущество
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
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onContact}
            className="group relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-2xl w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-3 justify-center">
              <Rocket className="h-5 w-5" />
              Начать проект
            </span>
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#products"
            className="group relative border-2 border-white/20 bg-white/5 backdrop-blur px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-3 justify-center">
              <Play className="h-5 w-5" />
              Исследовать
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
      </div>
    </section>
  );
}

/* ============================================================================
   PRODUCTS SECTION
============================================================================ */
function ProductsSection({ onOpen }: { onOpen: (p: ProductCard) => void }) {
  return (
    <section id="products" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Наши Продукты
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Полный цикл разработки цифровых решений — от концепции до масштабируемого продакшена
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          {productCards.map((product, index) => (
            <motion.div
              key={product.id}
              variants={fadeUp(index * 0.2)}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 30 }
              }}
              className="group relative cursor-pointer"
              onClick={() => onOpen(product)}
            >
              <SpotlightCard className="h-full">
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${product.gradient} shadow-lg`}>
                        <product.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">{product.title}</h3>
                        <p className="text-white/60 text-sm sm:text-base truncate">{product.subtitle}</p>
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
                    {product.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    {product.stats.map((stat, i) => (
                      <div key={i} className="text-center p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                        <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mx-auto mb-1 sm:mb-2" />
                        <div className="text-base sm:text-lg font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-white/60 leading-tight">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Preview */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                    {product.tech.slice(0, 3).map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-white/80 text-xs backdrop-blur hover:bg-white/20 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                    {product.tech.length > 3 && (
                      <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-white/60 text-xs">
                        +{product.tech.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                      <span>{product.points.length} возможностей</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                      ))}
                    </div>
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
   INDUSTRIES SECTION
============================================================================ */
function IndustriesSection({ onOpen }: { onOpen: (i: Industry) => void }) {
  return (
    <section id="industries" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Отраслевые Решения
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Специализированные платформы, адаптированные под специфику вашего бизнеса
          </p>
        </motion.div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.id}
              {...fadeUp(index * 0.1)}
              whileHover={{ 
                scale: 1.02, 
                y: -4,
                transition: { type: "spring", stiffness: 300, damping: 30 }
              }}
              className="group relative cursor-pointer"
              onClick={() => onOpen(industry)}
            >
              <SpotlightCard>
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${industry.gradient} shadow-lg flex-shrink-0`}>
                      <industry.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{industry.title}</h3>
                      <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-2">{industry.description}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {industry.stats.map((stat, i) => (
                      <div key={i} className="text-center p-2 rounded-lg bg-white/5 border border-white/10">
                        <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400 mx-auto mb-1" />
                        <div className="text-sm sm:text-base font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/60 leading-tight line-clamp-2">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Preview */}
                  <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                    {industry.tech.slice(0, 2).map((tech) => (
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
                      {industry.scenarios.slice(0, 2).map((scenario, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-cyan-400 rounded-full flex-shrink-0" />
                          <span className="line-clamp-1">{scenario}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/10">
                    <span className="text-xs sm:text-sm text-white/50 group-hover:text-white transition-colors">
                      Изучить решение →
                    </span>
                    <div className="flex gap-1">
                      {industry.scenarios.slice(0, 3).map((_, i) => (
                        <div 
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white/60 transition-colors"
                        />
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
function TechStackSection() {
  const technologies = [
    {
      category: "Frontend",
      items: [
        { name: 'Next.js 14', icon: Code2, color: 'from-gray-500 to-gray-700', description: 'React фреймворк' },
        { name: 'TypeScript', icon: Shield, color: 'from-blue-500 to-blue-700', description: 'Типизированный JavaScript' },
        { name: 'Tailwind CSS', icon: Palette, color: 'from-cyan-500 to-blue-500', description: 'Utility-first CSS' },
        { name: 'React', icon: Atom, color: 'from-cyan-400 to-blue-400', description: 'UI библиотека' },
        { name: 'Vue.js', icon: Code2, color: 'from-green-500 to-green-700', description: 'Прогрессивный фреймворк' },
        { name: 'Svelte', icon: Zap, color: 'from-orange-500 to-red-500', description: 'Компилируемый фреймворк' },
      ]
    },
    {
      category: "Backend",
      items: [
        { name: 'Node.js', icon: Cpu, color: 'from-green-500 to-green-700', description: 'JavaScript runtime' },
        { name: 'PostgreSQL', icon: Database, color: 'from-blue-600 to-blue-800', description: 'Реляционная БД' },
        { name: 'Redis', icon: Zap, color: 'from-red-500 to-red-700', description: 'In-memory data store' },
        { name: 'GraphQL', icon: GitBranch, color: 'from-pink-500 to-purple-500', description: 'Query language' },
        { name: 'Python', icon: Code2, color: 'from-yellow-500 to-blue-500', description: 'Универсальный язык' },
        { name: 'Java', icon: Cpu, color: 'from-red-500 to-orange-500', description: 'Enterprise разработка' },
      ]
    },
    {
      category: "Mobile",
      items: [
        { name: 'React Native', icon: Smartphone, color: 'from-blue-400 to-cyan-500', description: 'Кроссплатформенность' },
        { name: 'Flutter', icon: Smartphone, color: 'from-blue-500 to-cyan-400', description: 'Google framework' },
        { name: 'Expo', icon: Rocket, color: 'from-purple-500 to-pink-500', description: 'Development platform' },
        { name: 'Swift', icon: Cpu, color: 'from-orange-500 to-red-500', description: 'iOS development' },
        { name: 'Kotlin', icon: Code2, color: 'from-purple-500 to-pink-500', description: 'Android development' },
        { name: 'Ionic', icon: Phone, color: 'from-blue-500 to-purple-500', description: 'Hybrid framework' },
      ]
    },
    {
      category: "DevOps & Cloud",
      items: [
        { name: 'Docker', icon: Package, color: 'from-blue-500 to-cyan-500', description: 'Containerization' },
        { name: 'Kubernetes', icon: Workflow, color: 'from-blue-600 to-cyan-600', description: 'Orchestration' },
        { name: 'AWS', icon: CloudIcon, color: 'from-orange-500 to-yellow-500', description: 'Cloud platform' },
        { name: 'GitLab CI', icon: GitMerge, color: 'from-orange-600 to-red-600', description: 'CI/CD' },
        { name: 'Terraform', icon: Settings, color: 'from-purple-500 to-pink-500', description: 'Infrastructure as Code' },
        { name: 'Azure', icon: CloudIcon, color: 'from-blue-500 to-cyan-500', description: 'Microsoft Cloud' },
      ]
    },
    {
      category: "AI & Data Science",
      items: [
        { name: 'TensorFlow', icon: Brain, color: 'from-orange-500 to-red-500', description: 'Machine Learning' },
        { name: 'PyTorch', icon: Zap, color: 'from-red-500 to-orange-500', description: 'Deep Learning' },
        { name: 'OpenAI API', icon: Bot, color: 'from-green-500 to-blue-500', description: 'AI Models' },
        { name: 'Pandas', icon: BarChart3, color: 'from-blue-500 to-purple-500', description: 'Data Analysis' },
        { name: 'Scikit-learn', icon: Microscope, color: 'from-orange-500 to-yellow-500', description: 'ML Library' },
        { name: 'Apache Spark', icon: Zap, color: 'from-red-500 to-orange-500', description: 'Big Data' },
      ]
    },
    {
      category: "Testing & Tools",
      items: [
        { name: 'Jest', icon: CheckCircle2, color: 'from-red-500 to-orange-500', description: 'Testing Framework' },
        { name: 'Cypress', icon: Monitor, color: 'from-gray-500 to-gray-700', description: 'E2E Testing' },
        { name: 'Storybook', icon: BookOpen, color: 'from-pink-500 to-purple-500', description: 'UI Development' },
        { name: 'Webpack', icon: Settings, color: 'from-blue-500 to-cyan-500', description: 'Module Bundler' },
        { name: 'Vite', icon: Zap, color: 'from-purple-500 to-pink-500', description: 'Build Tool' },
        { name: 'ESLint', icon: CheckCircle2, color: 'from-purple-500 to-blue-500', description: 'Code Linting' },
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
            Технологический Стек
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Современные технологии для создания высокопроизводительных и масштабируемых приложений
          </p>
        </motion.div>

        {/* Tech Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-12">
          {technologies.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              {...fadeUp(categoryIndex * 0.2)}
              className="relative"
            >
              <SpotlightCard className="h-full">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                  <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full" />
                  {category.category}
                </h3>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                      <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 text-center backdrop-blur hover:bg-white/10 transition-all duration-300">
                        {/* Gradient Icon */}
                        <div className={`inline-flex p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${tech.color} shadow-lg mb-2 sm:mb-3`}>
                          <tech.icon className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        
                        <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">{tech.name}</h4>
                        <p className="text-white/60 text-xs sm:text-sm leading-tight">{tech.description}</p>
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
              { icon: ShieldCheck, title: "Безопасность", description: "SSL, OAuth2, RBAC, Penetration Testing" },
              { icon: Zap, title: "Производительность", description: "CDN, Caching, Optimizations, Load Balancing" },
              { icon: TrendingUp, title: "Масштабируемость", description: "Microservices, Auto-scaling, Cloud Native" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                {...fadeUp(1 + index * 0.1)}
                whileHover={{ y: -4 }}
                className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all"
              >
                <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mb-3 mx-auto" />
                <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{item.title}</h4>
                <p className="text-white/60 text-xs sm:text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================================
   CASE STUDIES SECTION
============================================================================ */
function CaseStudiesSection({ onOpen }: { onOpen: (cs: CaseStudy) => void }) {
  return (
    <section id="cases" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Наши Кейсы
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Реальные проекты с измеримыми результатами для наших клиентов
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
                    <p className="text-cyan-400 font-semibold text-sm sm:text-base mb-1">{caseStudy.client}</p>
                    <p className="text-white/60 text-xs sm:text-sm">{caseStudy.industry} • {caseStudy.duration}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 text-white/40 group-hover:text-white transition-colors flex-shrink-0 ml-2" />
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
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {caseStudy.results.slice(0, 3).map((result, i) => (
                    <div key={i} className="text-center p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-base sm:text-lg font-bold text-white mb-1">{result.improvement}</div>
                      <div className="text-xs text-white/60 leading-tight line-clamp-2">{result.metric}</div>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {caseStudy.technologies.slice(0, 4).map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/70 text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          {...fadeUp(0.8)}
          className="text-center mt-12 sm:mt-16"
        >
          <p className="text-white/60 mb-6 text-sm sm:text-base">
            Хотите такой же результат для вашего бизнеса?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpen(caseStudies[0])}
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-2xl text-sm sm:text-base"
          >
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            Обсудить мой проект
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================================
   TEAM SECTION
============================================================================ */
function TeamSection() {
  return (
    <section id="team" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Наша Команда
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Профессионалы с глубокой экспертизой в создании цифровых продуктов
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              {...fadeUp(index * 0.1)}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <SpotlightCard className="h-full">
                {/* Avatar */}
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{member.avatar}</div>
                
                {/* Info */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{member.name}</h3>
                <p className="text-cyan-400 text-sm sm:text-base mb-1 sm:mb-2">{member.role}</p>
                <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4">{member.experience} • {member.projects} проектов</p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                  {member.tech.slice(0, 3).map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/70 text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Expertise */}
                <div className="space-y-1">
                  {member.expertise.slice(0, 2).map((skill) => (
                    <div key={skill} className="flex items-center gap-2 text-xs text-white/60">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full flex-shrink-0" />
                      <span className="line-clamp-1">{skill}</span>
                    </div>
                  ))}
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
              { value: '50+', label: 'Завершенных проектов' },
              { value: '3+', label: 'Лет опыта' },
              { value: '99.9%', label: 'Доступность систем' },
              { value: '24/7', label: 'Поддержка' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeUp(1 + index * 0.1)}
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10"
              >
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
   PROCESS SECTION
============================================================================ */
function ProcessSection() {
  const processSteps = [
    {
      step: 1,
      title: "Анализ и Планирование",
      description: "Глубокий анализ бизнес-задач, проектирование архитектуры и составление детального плана",
      icon: Search,
      color: "from-cyan-500 to-blue-500"
    },
    {
      step: 2,
      title: "Дизайн и Прототипирование",
      description: "Создание UI/UX дизайна, интерактивных прототипов и утверждение концепции",
      icon: Palette,
      color: "from-blue-500 to-purple-500"
    },
    {
      step: 3,
      title: "Разработка",
      description: "Agile-разработка с регулярными демо, код-ревью и непрерывной интеграцией",
      icon: Code2,
      color: "from-purple-500 to-pink-500"
    },
    {
      step: 4,
      title: "Тестирование и Запуск",
      description: "Всестороннее тестирование, развертывание и запуск проекта в продакшен",
      icon: Rocket,
      color: "from-pink-500 to-red-500"
    },
    {
      step: 5,
      title: "Поддержка и Развитие",
      description: "Постоянная техническая поддержка, мониторинг и развитие продукта",
      icon: ShieldCheck,
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Процесс Работы
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Четкий и прозрачный процесс от первой встречи до запуска и поддержки
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-emerald-500 transform -translate-x-1/2 hidden md:block" />
          
          <div className="space-y-8 sm:space-y-12">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                {...fadeUp(index * 0.2)}
                className="relative flex items-start gap-4 sm:gap-6 lg:gap-8 group"
              >
                {/* Step Number */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}>
                    <step.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <SpotlightCard className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{step.title}</h3>
                    <span className="text-cyan-400 text-sm font-semibold px-2 sm:px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 w-fit">
                      Шаг {step.step}
                    </span>
                  </div>
                  <p className="text-white/70 leading-relaxed text-sm sm:text-base">{step.description}</p>
                  
                  {/* Step Details */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                    {[
                      { icon: Clock, text: `Этап ${step.step}` },
                      { icon: CheckCircle2, text: 'Agile методология' },
                    ].map((detail, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                        <detail.icon className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                        {detail.text}
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   TESTIMONIALS SECTION
============================================================================ */
function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Иван Сидоров",
      position: "Директор клиники 'Здоровье+'",
      content: "OneStack превзошел все ожидания. Система работает без сбоев, персонал обучился быстро, а клиенты в восторге от онлайн-записи. Результат превзошел все ожидания!",
      rating: 5,
      project: "Медицинская CRM система"
    },
    {
      id: 2,
      name: "Мария Иванова",
      position: "CEO логистической компании",
      content: "Внедрение системы от OneStack позволило нам сократить затраты на логистику на 30% и улучшить точность доставки. Команда профессионалов своего дела!",
      rating: 5,
      project: "Логистическая платформа"
    },
    {
      id: 3,
      name: "Алексей Петров",
      position: "CTO FinTech стартапа",
      content: "Отличная работа! Сложный проект был реализован в срок и с высочайшим качеством. Особенно впечатлил подход к безопасности и масштабируемости.",
      rating: 5,
      project: "Банковское приложение"
    }
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp(0)}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Отзывы Клиентов
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Что говорят наши клиенты о сотрудничестве с OneStack
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              {...fadeUp(index * 0.2)}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <SpotlightCard className="h-full">
                {/* Rating */}
                <div className="flex gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-white/80 italic mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base line-clamp-5">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="mt-auto">
                  <div className="border-t border-white/10 pt-3 sm:pt-4">
                    <div className="font-semibold text-white text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-cyan-400 text-xs sm:text-sm mb-1">{testimonial.position}</div>
                    <div className="text-white/60 text-xs">{testimonial.project}</div>
                  </div>
                </div>

                {/* Quote Icon */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 text-cyan-400/20">
                  <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8" />
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
   FOOTER
============================================================================ */
function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  OneStack
                </span>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full mt-1 sm:mt-0">
                  Studio
                </span>
              </div>
            </div>
            <p className="text-white/60 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base">
              Создаём инновационные цифровые продукты, которые преобразуют бизнес-процессы 
              и обеспечивают конкурентное преимущество на рынке.
            </p>
          </div>

          {/* Quick Links */}
          {[
            {
              title: 'Контакты',
              links: ['info@onestack.dev', '+7 (000) 000-00-00', 'Телеграм', 'Заказать звонок']
            }
          ].map((column, index) => (
            <div key={column.title}>
              <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/60 hover:text-white transition-colors text-xs sm:text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/40 text-xs sm:text-sm mb-4 md:mb-0">
            © 2024 OneStack Studio. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================================
   MOBILE MENU
============================================================================ */
function MobileMenu({ isOpen, onClose, onContact }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onContact: () => void;
}) {
  const menuItems = [
    { name: 'Продукты', href: '#products', icon: Code2 },
    { name: 'Отрасли', href: '#industries', icon: Building2 },
    { name: 'Технологии', href: '#tech', icon: Cpu },
    { name: 'Кейсы', href: '#cases', icon: FileText },
    { name: 'Команда', href: '#team', icon: Users },
    { name: 'Процесс', href: '#process', icon: Workflow },
  ];

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
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-gray-900/95 border-l border-white/10 backdrop-blur-xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Layers className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">OneStack</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/10 transition"
                  >
                    <X className="h-5 w-5 text-white" />
                  </motion.button>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Демо-режим</div>
                    <div className="text-xs text-white/60">Гость</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 sm:p-6">
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
              </nav>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onContact();
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition mb-4 shadow-lg text-sm"
                >
                  Обсудить
                </motion.button>

                <div className="space-y-2 text-white/60 text-xs">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    info@onestack.dev
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +7 (000) 000-00-00
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
   PRODUCT MODAL
============================================================================ */
function ProductModal({ product, onClose }: { product: ProductCard; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech' | 'pricing'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: Eye },
    { id: 'features' as const, label: 'Структура', icon: Zap },
    { id: 'tech' as const, label: 'Технологии', icon: Code2 },
  ];

  return (
    <BaseModal
      title={product.title}
      subtitle={product.subtitle}
      onClose={onClose}
      size="max-w-4xl lg:max-w-6xl"
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
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">{product.description}</p>
              </Section>

              <Section title="Ключевые преимущества">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {product.benefits.map((benefit, index) => (
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
                  {product.points.map((point, index) => (
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
              </Section>
            </>
          )}

          {activeTab === 'features' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {product.features.map((feature, index) => (
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
              <Section title="Технологический стек">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {product.tech.map((tech, index) => (
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

              <Section title="Интеграции">
                <div className="flex flex-wrap gap-2">
                  {product.integrations.map((integration, index) => (
                    <motion.span
                      key={integration}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs sm:text-sm hover:bg-white/20 transition-colors"
                    >
                      {integration}
                    </motion.span>
                  ))}
                </div>
              </Section>
            </>
          )}

          {activeTab === 'pricing' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {product.pricing.map((plan, index) => (
                <motion.div
                  key={plan.plan}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">{plan.plan}</h4>
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-3 sm:mb-4">{plan.price}</div>
                  <ul className="space-y-2 mb-4 sm:mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition text-sm sm:text-base"
                  >
                    Выбрать план
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Section title="Статистика">
            <div className="space-y-2 sm:space-y-3">
              {product.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm sm:text-base">{stat.value}</div>
                    <div className="text-white/60 text-xs sm:text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Кейсы">
            <div className="space-y-2">
              {product.caseStudies.map((caseStudy, index) => (
                <div key={index} className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                  <span className="line-clamp-1">{caseStudy}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </BaseModal>
  );
}

/* ============================================================================
   INDUSTRY MODAL
============================================================================ */
function IndustryModal({ industry, onClose }: { industry: Industry; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'scenarios' | 'solutions' | 'cases'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: Eye },
    { id: 'scenarios' as const, label: 'Сценарии', icon: Play },
    { id: 'solutions' as const, label: 'Решения', icon: CheckCircle2 },
  ];

  return (
    <BaseModal
      title={industry.title}
      subtitle={industry.description}
      onClose={onClose}
      size="max-w-4xl lg:max-w-6xl"
    >
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
        {industry.stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10"
          >
            <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-cyan-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-white/60 text-xs sm:text-sm leading-tight">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition flex-shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-white text-black' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {activeTab === 'overview' && (
            <>
              <Section title="Основные метрики">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {industry.metrics.map((metric, index) => (
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

              <Section title="Технологии">
                <div className="flex flex-wrap gap-2">
                  {industry.tech.map((tech, index) => (
                    <span 
                      key={tech}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs sm:text-sm hover:bg-white/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Section>
            </>
          )}

          {activeTab === 'scenarios' && (
            <Section title="Бизнес-сценарии">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {industry.scenarios.map((scenario, index) => (
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
            </Section>
          )}

          {activeTab === 'solutions' && (
            <>
              <Section title="Проблемы">
                <div className="space-y-2 sm:space-y-3">
                  {industry.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start gap-3 text-white/80 text-sm sm:text-base">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400 mt-0.5 flex-shrink-0" />
                      <span>{challenge}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Наши решения">
                <div className="space-y-2 sm:space-y-3">
                  {industry.solutions.map((solution, index) => (
                    <div key={index} className="flex items-start gap-3 text-white/80 text-sm sm:text-base">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{solution}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Кастомизация">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {industry.customize.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                      <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                      <span className="line-clamp-2">{item}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {activeTab === 'cases' && industry.caseStudies.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              {industry.caseStudies.map((caseStudy, index) => (
                <motion.div
                  key={caseStudy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10"
                >
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">{caseStudy.title}</h4>
                  <p className="text-cyan-400 font-semibold text-sm sm:text-base mb-3 sm:mb-4">{caseStudy.client}</p>
                  
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                    {caseStudy.results.slice(0, 3).map((result, i) => (
                      <div key={i} className="text-center p-2 sm:p-3 rounded-xl bg-white/5">
                        <div className="text-base sm:text-lg font-bold text-white mb-1">{result.improvement}</div>
                        <div className="text-white/60 text-xs leading-tight">{result.metric}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-white/60 text-xs sm:text-sm">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{caseStudy.duration}</span>
                    <Banknote className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{caseStudy.budget}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Section title="Быстрый старт">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                Консультация 1-2 дня
              </div>
              <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                ТЗ и оценка 3-5 дней
              </div>
              <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                <Code2 className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                Старт разработки 1 неделя
              </div>
            </div>
          </Section>

          <Section title="Технологии">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {industry.tech.slice(0, 8).map((tech) => (
                <span 
                  key={tech}
                  className="px-2 py-1 rounded-lg bg-white/10 border border-white/5 text-white/70 text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Section>

          <div className="text-center">
            <Link 
              href={industry.href}
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-xs sm:text-sm"
            >
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              Смотреть демо-версию
            </Link>
          </div>
        </div>
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
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Header Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-cyan-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Срок</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.duration}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Banknote className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-cyan-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Бюджет</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.budget}</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-cyan-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Команда</div>
            <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.team.reduce((acc, t) => acc + t.count, 0)} чел</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-cyan-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm text-white/60 mb-1">Улучшение</div>
            <div className="font-semibold text-white text-sm sm:text-base">+{caseStudy.results[0]?.improvement}</div>
          </div>
        </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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

        {/* Team & Tech */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Section title="Команда проекта">
            <div className="space-y-2">
              {caseStudy.team.map((member, index) => (
                <div key={index} className="flex justify-between items-center text-white/70 text-xs sm:text-sm">
                  <span>{member.role}</span>
                  <span className="text-cyan-400">{member.count} чел</span>
                </div>
              ))}
            </div>
          </Section>

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
        </div>

        {/* Testimonial */}
        {caseStudy.testimonial && (
          <Section title="Отзыв клиента">
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
              <p className="text-white/80 italic mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                "{caseStudy.testimonial.text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white text-sm sm:text-base">{caseStudy.testimonial.author}</div>
                  <div className="text-cyan-400 text-xs sm:text-sm">{caseStudy.testimonial.position}</div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 fill-current" />
                  ))}
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
   CONTACT MODAL
============================================================================ */
function ContactModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    budget: '',
    timeline: '',
    description: ''
  });

  const budgets = [
    '₽150K - ₽500K',
    '₽500K - ₽1M', 
    '₽1M - ₽2M',
    '₽2M+',
    'Пока не знаю'
  ];

  const timelines = [
    'Срочно (1-2 недели)',
    'В ближайшее время (1 месяц)',
    'Планирую (2-3 месяца)',
    'Исследую варианты'
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
    <BaseModal title="Обсудить проект" onClose={onClose} size="max-w-2xl">
      <form onSubmit={submit} className="space-y-4 sm:space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Имя *">
            <input
              required
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
              value={form.name}
              onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
              placeholder="Ваше имя"
            />
          </Field>
          <Field label="Email *">
            <input
              type="email"
              required
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
              value={form.email}
              onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
              placeholder="email@example.com"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Компания">
            <input
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
              value={form.company}
              onChange={(e) => setForm(s => ({ ...s, company: e.target.value }))}
              placeholder="Название компании"
            />
          </Field>
          <Field label="Телефон">
            <input
              type="tel"
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
              value={form.phone}
              onChange={(e) => setForm(s => ({ ...s, phone: e.target.value }))}
              placeholder="+7 (000) 000-00-00"
            />
          </Field>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Примерный бюджет">
            <select
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
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
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition text-sm sm:text-base"
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
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:border-cyan-500/50 transition resize-none text-sm sm:text-base"
            value={form.description}
            onChange={(e) => setForm(s => ({ ...s, description: e.target.value }))}
            placeholder="Опишите вашу задачу, цели проекта и ожидаемый результат..."
          />
        </Field>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
    <BaseModal title="Заявка отправлена!" onClose={onClose} size="max-w-sm sm:max-w-md">
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
            info@onestack.dev
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            +7 (000) 000-00-00
          </div>
        </div>

        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition text-sm sm:text-base"
        >
          Понятно
        </motion.button>
      </div>
    </BaseModal>
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
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: string;
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
        <div className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-white/[0.03]">
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
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
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
      
      .animate-scan {
        animation: scan 8s linear infinite;
      }
      
      /* Custom Scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
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
      
      /* Selection */
      ::selection {
        background: rgba(6, 182, 212, 0.3);
        color: white;
      }
      
      /* Focus Outline */
      button:focus-visible,
      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        outline: 2px solid rgb(6, 182, 212);
        outline-offset: 2px;
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
      
      .line-clamp-5 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
      }
      
      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        .animate-scan { animation: none !important; }
        * { 
          animation-duration: 0.01ms !important; 
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* Smooth Scrolling */
      html {
        scroll-behavior: smooth;
      }
      
      /* Mobile optimizations */
      @media (max-width: 640px) {
        .text-balance {
          text-wrap: balance;
        }
      }

      /* Additional icons for tech stack */
      .coffee-icon {
        background: linear-gradient(135deg, #f89820, #f86600);
      }
      
      .flame-icon {
        background: linear-gradient(135deg, #ff6b35, #ff3d00);
      }
      
      .lightning-icon {
        background: linear-gradient(135deg, #ffd700, #ff6b00);
      }
    `}</style>
  );
}
