'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Типы для меню
type Child = { 
  label: string; 
  href: string; 
  icon?: string;
  badge?: string | number;
  description?: string;
};

type Item = { 
  label: string; 
  href: string; 
  icon: string; 
  badge?: string | number;
  description?: string;
  children?: Child[];
  featured?: boolean;
};

type Category = { 
  key: string; 
  title: string; 
  icon: string; 
  badge?: string | number;
  items: Item[];
  color?: string;
};

// Конфигурация ролей
const ROLES = [
  {
    id: 'user',
    label: 'Гражданин',
    href: '/demo/application/user',
    icon: '👤',
    description: 'Получение социальных услуг',
    color: 'from-blue-500 to-cyan-500',
    stats: { services: 8, active: 3 }
  },
  {
    id: 'manager',
    label: 'Менеджер',
    href: '/demo/application/manager',
    icon: '👨‍💼',
    description: 'Управление социальными услугами',
    color: 'from-green-500 to-emerald-500',
    stats: { requests: 24, completed: 18 }
  },
  {
    id: 'admin',
    label: 'Администратор',
    href: '/demo/application/owner',
    icon: '👑',
    description: 'Полный контроль системы',
    color: 'from-purple-500 to-pink-500',
    stats: { users: 156, revenue: '1.2M' }
  }
];

// Расширенная конфигурация меню для гражданина
const USER_CATEGORIES: Category[] = [
  {
    key: "dashboard",
    title: "Главная",
    icon: "🏠",
    color: "from-blue-500 to-cyan-500",
    items: [
      { 
        label: "Главная панель", 
        href: "/demo/application/user", 
        icon: "🏠",
        featured: true,
        description: "Обзор услуг и заявок"
      }
    ],
  },
  {
    key: "services",
    title: "УСЛУГИ",
    icon: "🎯",
    color: "from-green-500 to-emerald-500",
    badge: 45,
    items: [
      {
        label: "Каталог услуг",
        href: "/demo/application/user/modules/services",
        icon: "🎯",
        description: "Все доступные услуги",
        featured: true,
        children: [
          { 
            label: "Социальные услуги", 
            href: "/demo/application/user/modules/services/social",
            description: "Социальная поддержка",
            badge: 18,
            icon: "🤝"
          },
          { 
            label: "Медицинские услуги", 
            href: "/demo/application/user/modules/services/medical",
            description: "Здравоохранение",
            badge: 12,
            icon: "🏥"
          },
          { 
            label: "Услуги доставки", 
            href: "/demo/application/user/modules/services/delivery",
            description: "Курьерские услуги",
            badge: 6,
            icon: "📦"
          },
          { 
            label: "Транспортные услуги", 
            href: "/demo/application/user/modules/services/transport",
            description: "Перевозки и такси",
            badge: 4,
            icon: "🚗"
          },
          { 
            label: "Услуги автосервиса", 
            href: "/demo/application/user/modules/services/autoservice",
            description: "Техническое обслуживание",
            badge: 3,
            icon: "🔧"
          },
          { 
            label: "Клиентские услуги", 
            href: "/demo/application/user/modules/services/service",
            description: "Дополнительные услуги",
            badge: 2,
            icon: "⭐"
          },
        ],
      },
    ],
  },
  {
    key: "requests",
    title: "МОИ ЗАЯВКИ",
    icon: "📋",
    color: "from-orange-500 to-amber-500",
    badge: 3,
    items: [
      {
        label: "Управление заявками",
        href: "/demo/application/user/modules/requests",
        icon: "📋",
        description: "Мои активные заявки",
        featured: true,
        children: [
          { 
            label: "Все заявки", 
            href: "/demo/application/user/modules/requests",
            description: "История всех заявок",
            badge: 12,
            icon: "📄"
          },
          { 
            label: "Новая заявка", 
            href: "/demo/application/user/modules/requests/new",
            description: "Создать новую заявку",
            icon: "➕",
            badge: "New"
          },
        ],
      },
    ],
  },
  {
    key: "support",
    title: "ПОДДЕРЖКА",
    icon: "🤝",
    color: "from-indigo-500 to-purple-500",
    badge: 5,
    items: [
      {
        label: "Центр поддержки",
        href: "/demo/application/user/modules/support",
        icon: "🤝",
        description: "Помощь и консультации",
        children: [
          { 
            label: "Помощь и консультации", 
            href: "/demo/application/user/modules/support",
            description: "Частые вопросы",
            badge: 5,
            icon: "❓"
          },
        ],
      },
    ],
  },
  {
    key: "documents",
    title: "ДОКУМЕНТЫ",
    icon: "📄",
    color: "from-cyan-500 to-blue-500",
    badge: 8,
    items: [
      {
        label: "Мои документы",
        href: "/demo/application/user/modules/documents",
        icon: "📄",
        description: "Личные документы",
        children: [
          { 
            label: "Личные документы", 
            href: "/demo/application/user/modules/documents",
            description: "Все мои документы",
            badge: 8,
            icon: "📁"
          },
        ],
      },
    ],
  },
  {
    key: "profile",
    title: "ПРОФИЛЬ",
    icon: "👤",
    color: "from-amber-500 to-orange-500",
    items: [
      {
        label: "Личный кабинет",
        href: "/demo/application/user/modules/profile",
        icon: "👤",
        description: "Персональные настройки",
        featured: true,
        children: [
          { 
            label: "Мой профиль", 
            href: "/demo/application/user/modules/profile",
            description: "Личная информация",
            icon: "👤"
          },
        ],
      },
    ],
  },
  {
    key: "demo",
    title: "ДЕМО",
    icon: "🎮",
    color: "from-gray-500 to-slate-500",
    items: [
      {
        label: "Демо-режим",
        href: "/demo",
        icon: "🎮",
        description: "Тестовый режим",
        children: [
          { 
            label: "Главная демо", 
            href: "/demo",
            description: "Демонстрация возможностей",
            icon: "🏠"
          },
        ],
      },
    ],
  },
];

// Утилиты
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/');
}

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

// Компонент иконки
const Icon = ({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) => (
  <span className={className} style={{ fontSize: size }}>
    {name}
  </span>
);

// Компонент бейджа
const Badge = ({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}) => {
  const variants = {
    default: 'bg-white/20 text-white/90',
    primary: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    success: 'bg-green-500/20 text-green-300 border-green-500/30',
    warning: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    error: 'bg-red-500/20 text-red-300 border-red-500/30'
  };

  return (
    <span className={cn(
      'inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

// Компонент переключения ролей
const RoleSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const currentRole = useMemo(() => {
    if (pathname.includes('/owner')) return ROLES[2];
    if (pathname.includes('/manager')) return ROLES[1];
    return ROLES[0];
  }, [pathname]);

  const handleRoleChange = (role: typeof ROLES[0]) => {
    router.push(role.href);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-lg transition-all duration-300 w-full group',
          'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10 text-white/90 hover:text-white',
          isOpen && 'bg-white/20 border-white/40 text-white shadow-2xl'
        )}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentRole.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-105 transition-transform duration-300`}>
          <Icon name={currentRole.icon} size={18} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="text-sm font-semibold truncate">{currentRole.label}</div>
          <div className="text-xs text-white/70 truncate">{currentRole.description}</div>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-white/60 text-lg flex-shrink-0 transition-transform duration-300"
        >
          ↓
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-2xl border border-white/30 rounded-2xl p-2 shadow-2xl z-50"
          >
            {ROLES.map((role, index) => (
              <motion.button
                key={role.id}
                onClick={() => handleRoleChange(role)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden',
                  'hover:bg-white/20 text-white/90 hover:text-white border border-transparent hover:border-white/20',
                  currentRole.id === role.id && 'bg-white/20 text-white border-white/30 shadow-lg'
                )}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4, scale: 1.02 }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <Icon name={role.icon} size={14} />
                </div>
                <div className="flex-1 text-left min-w-0 relative z-10">
                  <div className="font-semibold truncate">{role.label}</div>
                  <div className="text-xs text-white/70 truncate">{role.description}</div>
                  {role.stats && (
                    <div className="flex gap-2 mt-1">
                      {Object.entries(role.stats).map(([key, value]) => (
                        <span key={key} className="text-xs text-white/50">
                          {value} {key}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {currentRole.id === role.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-white shadow-lg relative z-10"
                  />
                )}
                <motion.span
                  className="opacity-0 group-hover:opacity-100 text-white/60 transition-all duration-300 relative z-10"
                  initial={{ x: -5 }}
                  whileHover={{ x: 0 }}
                >
                  →
                </motion.span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Мобильное переключение ролей
const MobileRoleSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const currentRole = useMemo(() => {
    if (pathname.includes('/owner')) return ROLES[2];
    if (pathname.includes('/manager')) return ROLES[1];
    return ROLES[0];
  }, [pathname]);

  const handleRoleChange = (role: typeof ROLES[0]) => {
    router.push(role.href);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-lg transition-all duration-300',
          'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10 text-white/90 hover:text-white',
          isOpen && 'bg-white/20 border-white/40 text-white shadow-lg'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${currentRole.color} flex items-center justify-center text-white shadow-lg`}>
          <Icon name={currentRole.icon} size={14} />
        </div>
        <span className="text-xs font-medium hidden sm:block">{currentRole.label}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-white/60 text-sm"
        >
          ↓
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-56 bg-black/90 backdrop-blur-2xl border border-white/30 rounded-2xl p-2 shadow-2xl z-50"
          >
            {ROLES.map((role, index) => (
              <motion.button
                key={role.id}
                onClick={() => handleRoleChange(role)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all duration-300 group',
                  'hover:bg-white/20 text-white/90 hover:text-white border border-transparent hover:border-white/20',
                  currentRole.id === role.id && 'bg-white/20 text-white border-white/30 shadow-lg'
                )}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={role.icon} size={14} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium truncate text-sm">{role.label}</div>
                  <div className="text-xs text-white/70 truncate">{role.description}</div>
                </div>
                {currentRole.id === role.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-1.5 h-1.5 rounded-full bg-white shadow-lg"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Мобильное меню в стиле таббара
const MobileTabbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const categories = useMemo(() => USER_CATEGORIES, []);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [stage, setStage] = useState<'items' | 'children'>('items');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const railRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Автоскролл активной категории
  useEffect(() => {
    const cat = categories.find((c) => c.items.some((it) => isActive(pathname, it.href)));
    const key = cat?.key;
    if (key && btnRefs.current[key]) {
      btnRefs.current[key]!.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [pathname, categories]);

  // Закрыть попап
  const close = useCallback(() => {
    setOpenKey(null);
    setStage('items');
    setSelectedItem(null);
  }, []);

  // Позиция каретки
  const [caretX, setCaretX] = useState<number | null>(null);
  const onOpen = useCallback((key: string) => {
    const el = btnRefs.current[key];
    if (el) {
      const rect = el.getBoundingClientRect();
      setCaretX(rect.left + rect.width / 2);
    }
    setOpenKey((k) => (k === key ? null : key));
    setStage('items');
    setSelectedItem(null);
  }, []);

  // Обработчики кликов
  const onItemClick = useCallback(
    (it: Item) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (it.children && it.children.length) {
        e.preventDefault();
        setSelectedItem(it);
        setStage('children');
      } else {
        e.preventDefault();
        router.push(it.href);
        close();
      }
    },
    [router, close]
  );

  const onChildClick = useCallback(
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      router.push(href);
      close();
    },
    [router, close]
  );

  // Закрытие по ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  const currentCategory = useMemo(
    () => categories.find((c) => c.key === openKey) || null,
    [categories, openKey]
  );

  return (
    <>
      {/* Оверлей для клика вне */}
      {openKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-lg sm:hidden"
          onClick={close}
          aria-hidden
        />
      )}

      {/* Всплывающее меню */}
      <div
        className="fixed inset-x-0 bottom-16 z-50 sm:hidden"
        style={{ paddingBottom: 'max(0px, calc(env(safe-area-inset-bottom) - 8px))' }}
      >
        {currentCategory && (
          <div className="relative">
            {/* Каретка */}
            {caretX !== null && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="pointer-events-none absolute -top-1 h-2 w-2 rotate-45 rounded-[2px] bg-white/20 backdrop-blur-lg"
                style={{ left: caretX - 4 }}
                aria-hidden
              />
            )}

            <motion.div
              ref={popupRef}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="mx-auto w-[min(94%,560px)] rounded-3xl bg-black/90 backdrop-blur-2xl border border-white/20 p-4 shadow-2xl"
            >
              {/* Заголовок */}
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Icon name={currentCategory.icon} aria-hidden size={20} className="text-white/90" />
                  <div className="text-sm font-semibold uppercase tracking-wide text-white/90">
                    {currentCategory.title}
                  </div>
                </div>
                {currentCategory.badge && (
                  <Badge variant="primary">
                    {currentCategory.badge}
                  </Badge>
                )}
              </div>

              {/* Шаг 1: пункты категории */}
              {stage === 'items' && (
                <div className="flex flex-col items-center gap-2">
                  {currentCategory.items.map((it) => {
                    const active = isActive(pathname, it.href);
                    return (
                      <Link
                        key={it.href}
                        href={it.href}
                        prefetch={false}
                        className={cn(
                          'inline-flex h-14 w-[min(92%,500px)] items-center justify-between gap-3',
                          'rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg px-4 text-sm font-medium transition-all duration-300 group relative overflow-hidden',
                          'hover:bg-white/20 hover:border-white/30 text-white/90 hover:text-white',
                          active && 'bg-white/20 border-white/40 text-white shadow-lg',
                          it.featured && 'border-yellow-500/40 bg-yellow-500/10'
                        )}
                        onClick={onItemClick(it)}
                      >
                        {/* Gradient background for featured items */}
                        {it.featured && (
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-50" />
                        )}
                        
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Icon name={it.icon} aria-hidden size={18} className="shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{it.label}</div>
                            {it.description && (
                              <div className="text-xs text-white/60 truncate">{it.description}</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          {it.badge && (
                            <Badge variant={it.featured ? 'warning' : 'default'} className="text-xs">
                              {it.badge}
                            </Badge>
                          )}
                          {it.children && it.children.length ? (
                            <span className="text-xs text-white/70 group-hover:text-white transition-colors">›</span>
                          ) : null}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Шаг 2: подпункты */}
              {stage === 'children' && selectedItem && (
                <div className="flex flex-col items-center gap-2">
                  <div className="mb-3 flex items-center gap-3 w-full px-2">
                    <button
                      onClick={() => {
                        setStage('items');
                        setSelectedItem(null);
                      }}
                      className="w-8 h-8 rounded-lg border border-white/20 bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-300"
                    >
                      ←
                    </button>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white/90 truncate">{selectedItem.label}</div>
                      {selectedItem.description && (
                        <div className="text-xs text-white/60 truncate">{selectedItem.description}</div>
                      )}
                    </div>
                  </div>

                  {selectedItem.children!.map((ch) => {
                    const active = isActive(pathname, ch.href);
                    return (
                      <Link
                        key={ch.href}
                        href={ch.href}
                        prefetch={false}
                        className={cn(
                          'inline-flex h-12 w-[min(92%,500px)] items-center justify-between gap-3',
                          'rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg px-4 text-sm font-medium transition-all duration-300 group',
                          'hover:bg-white/20 hover:border-white/30 text-white/90 hover:text-white',
                          active && 'bg-white/20 border-white/40 text-white shadow-lg'
                        )}
                        onClick={onChildClick(ch.href)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {ch.icon && <Icon name={ch.icon} aria-hidden size={16} className="shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{ch.label}</div>
                            {ch.description && (
                              <div className="text-xs text-white/60 truncate">{ch.description}</div>
                            )}
                          </div>
                        </div>
                        {ch.badge && (
                          <Badge variant="default" className="text-xs">
                            {ch.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Нижний док */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-black/80 backdrop-blur-2xl sm:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="relative">
          {/* Градиенты по краям */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/90 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/90 to-transparent z-10" />

          {/* Лента категорий */}
          <div
            ref={railRef}
            className="grid auto-cols-[140px] grid-flow-col gap-3 overflow-x-auto px-4 py-3 snap-x snap-mandatory scrollbar-hide"
          >
            {categories.map((cat) => {
              const anyActive = cat.items.some((it) => isActive(pathname, it.href));
              const isOpen = openKey === cat.key;
              return (
                <motion.button
                  key={cat.key}
                  ref={(el) => (btnRefs.current[cat.key] = el)}
                  className={cn(
                    'inline-flex h-16 snap-start items-center gap-3 rounded-2xl border px-3 text-left transition-all duration-300 backdrop-blur-lg group relative overflow-hidden min-w-0',
                    'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/20',
                    (anyActive || isOpen) && 'border-white/40 bg-white/20 shadow-lg'
                  )}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpen(cat.key)}
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <Icon name={cat.icon} size={20} className="text-white/90 relative z-10" />
                  <span className="min-w-0 leading-4 relative z-10">
                    <span className="block truncate text-[10px] uppercase tracking-wide text-white/70 font-semibold">
                      {cat.title}
                    </span>
                    <span className="block truncate text-xs font-medium text-white/90">
                      {cat.items[0]?.label}
                    </span>
                  </span>
                  
                  <div className="flex flex-col items-end gap-1 ml-auto relative z-10">
                    {cat.badge && (
                      <Badge variant="primary" className="text-[10px] px-1.5 py-0.5">
                        {cat.badge}
                      </Badge>
                    )}
                    {(anyActive || isOpen) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-white/90"
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

// Десктопное меню
const DesktopSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = useCallback((key: string) => {
    setExpandedCategory(current => current === key ? null : key);
  }, []);

  // Фильтрация меню по поиску
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return USER_CATEGORIES;
    
    return USER_CATEGORIES.map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.children?.some(child => 
          child.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    })).filter(category => category.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-80 lg:flex-col">
      <motion.div 
        className="flex grow flex-col gap-y-4 overflow-y-auto bg-black/60 backdrop-blur-2xl border-r border-white/20 px-4 pb-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Логотип и переключение ролей */}
        <div className="shrink-0 pt-4">
          <div className="flex h-20 items-center gap-3 mb-4">
            <motion.div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-xl text-white">👤</span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white/90 text-sm truncate">Гражданин</div>
              <div className="text-white/70 text-xs font-medium">Получение социальных услуг</div>
            </div>
          </div>

          {/* Переключение ролей */}
          <RoleSwitcher />
        </div>

        {/* Навигация */}
        <nav className="flex flex-1 flex-col gap-2">
          {filteredCategories.map((category) => (
            <div key={category.key} className="space-y-1">
              {/* Категория */}
              <motion.button
                onClick={() => toggleCategory(category.key)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-lg border group relative overflow-hidden',
                  'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/20 text-white/90 hover:text-white',
                  expandedCategory === category.key && 'bg-white/20 border-white/40 text-white shadow-lg'
                )}
                whileHover={{ x: 4 }}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <Icon name={category.icon} size={18} className="relative z-10" />
                <span className="flex-1 text-left relative z-10">{category.title}</span>
                
                <div className="flex items-center gap-2 relative z-10">
                  {category.badge && (
                    <Badge variant="primary" className="text-xs">
                      {category.badge}
                    </Badge>
                  )}
                  <motion.span
                    animate={{ rotate: expandedCategory === category.key ? 180 : 0 }}
                    className="text-white/60 transition-transform duration-300"
                  >
                    ↓
                  </motion.span>
                </div>
              </motion.button>

              {/* Подпункты */}
              <AnimatePresence>
                {expandedCategory === category.key && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 space-y-1 overflow-hidden"
                  >
                    {category.items.flatMap(item => 
                      item.children ? item.children : [item]
                    ).map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 p-2 rounded-lg text-sm transition-all duration-300 backdrop-blur-lg group relative overflow-hidden',
                            'text-white/60 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10',
                            isActive(pathname, item.href) && 'text-white bg-white/20 border-white/20 shadow-md'
                          )}
                        >
                          {item.icon && <Icon name={item.icon} size={14} className="relative z-10" />}
                          <div className="flex-1 min-w-0 relative z-10">
                            <div className="truncate">{item.label}</div>
                            {item.description && (
                              <div className="text-xs text-white/50 truncate">{item.description}</div>
                            )}
                          </div>
                          {item.badge && (
                            <Badge variant="default" className="text-xs relative z-10">
                              {item.badge}
                            </Badge>
                          )}
                          <motion.span
                            className="opacity-0 group-hover:opacity-100 text-white/60 transition-opacity relative z-10"
                            initial={{ x: -5 }}
                            whileHover={{ x: 0 }}
                          >
                            →
                          </motion.span>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Профиль пользователя */}
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
          whileHover={{ y: -1 }}
          onClick={() => router.push('/demo/application/user/modules/profile')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <span className="text-base">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white/90 truncate">Иванов Алексей</div>
            <div className="text-xs text-white/70 truncate">Гражданин</div>
          </div>
          <motion.span
            className="opacity-0 group-hover:opacity-100 text-white/90 transition-opacity"
            whileHover={{ x: 2 }}
          >
            →
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Мобильный заголовок
const MobileHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const currentRole = useMemo(() => {
    if (pathname.includes('/owner')) return ROLES[2];
    if (pathname.includes('/manager')) return ROLES[1];
    return ROLES[0];
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      className={cn(
        "lg:hidden fixed top-0 inset-x-0 z-30 backdrop-blur-lg border-b transition-all duration-300",
        scrolled 
          ? "bg-black/80 border-white/20" 
          : "bg-black/60 border-white/10"
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentRole.color} flex items-center justify-center text-white shadow-lg`}>
            <Icon name={currentRole.icon} size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white/90">{currentRole.label}</div>
            <div className="text-xs text-white/70">Получение услуг</div>
          </div>
        </div>
        
        {/* Переключение ролей в мобильном заголовке */}
        <MobileRoleSwitcher />
      </div>
    </motion.div>
  );
};

// Основной компонент лейаута
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Десктопное меню */}
      <DesktopSidebar />

      {/* Мобильный заголовок */}
      <MobileHeader />

      {/* Мобильное меню */}
      <MobileTabbar />

      {/* Основная область контента */}
      <div className="lg:pl-80">
        {/* Отступ для мобильного заголовка */}
        <div className="h-16 lg:h-0" />
        
        {/* Основной контент */}
        <main className="min-h-screen">
          <div className="p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </div>
        </main>
        
        {/* Отступ для мобильного таббара */}
        <div className="h-20 lg:h-0" />
      </div>
    </div>
  );
}