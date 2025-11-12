'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Типы для меню
type Child = { label: string; href: string; icon?: string };
type Item = { label: string; href: string; icon: string; children?: Child[] };
type Category = { key: string; title: string; icon: string; items: Item[] };

// Конфигурация ролей
const ROLES = [
  {
    id: 'user',
    label: 'Пассажир',
    href: '/demo/transport/user',
    icon: '👤',
    description: 'Поездки и билеты',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'driver',
    label: 'Водитель',
    href: '/demo/transport/driver',
    icon: '🚌',
    description: 'Управление транспортом',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'manager',
    label: 'Менеджер',
    href: '/demo/transport/manager',
    icon: '👨‍💼',
    description: 'Управление операциями',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'dispatcher',
    label: 'Диспетчер',
    href: '/demo/transport/dispatcher',
    icon: '📞',
    description: 'Управление маршрутами',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'admin',
    label: 'Администратор',
    href: '/demo/transport/admin',
    icon: '👑',
    description: 'Управление системой',
    color: 'from-indigo-500 to-blue-500'
  }
];

// Конфигурация меню для менеджера общественного транспорта
const MANAGER_CATEGORIES: Category[] = [
  {
    key: "dashboard",
    title: "Главная",
    icon: "🏠",
    items: [{ label: "Операционная панель", href: "/demo/transport/manager", icon: "🏠" }],
  },
  {
    key: "routes",
    title: "МАРШРУТЫ",
    icon: "🗺️",
    items: [
      {
        label: "Управление маршрутами",
        href: "/demo/transport/manager/modules/routes",
        icon: "🗺️",
        children: [
          { label: "Все маршруты", href: "/demo/transport/manager/modules/routes" },
          { label: "Создание маршрута", href: "/demo/transport/manager/modules/routes/create" },
          { label: "Расписание маршрутов", href: "/demo/transport/manager/modules/routes/schedule" },
          { label: "Оптимизация маршрутов", href: "/demo/transport/manager/modules/routes/optimization" },
          { label: "Зоны покрытия", href: "/demo/transport/manager/modules/routes/coverage" },
          { label: "Сезонные изменения", href: "/demo/transport/manager/modules/routes/seasonal" },
        ],
      },
    ],
  },
  {
    key: "vehicles",
    title: "ТРАНСПОРТ",
    icon: "🚌",
    items: [
      {
        label: "Управление транспортом",
        href: "/demo/transport/manager/modules/vehicles",
        icon: "🚌",
        children: [
          { label: "Весь транспорт", href: "/demo/transport/manager/modules/vehicles" },
          { label: "Состояние транспорта", href: "/demo/transport/manager/modules/vehicles/status" },
          { label: "Техническое обслуживание", href: "/demo/transport/manager/modules/vehicles/maintenance" },
          { label: "Заправка и зарядка", href: "/demo/transport/manager/modules/vehicles/fuel" },
          { label: "Ремонты и ТО", href: "/demo/transport/manager/modules/vehicles/repairs" },
          { label: "Списание транспорта", href: "/demo/transport/manager/modules/vehicles/write-off" },
        ],
      },
    ],
  },
  {
    key: "drivers",
    title: "ВОДИТЕЛИ",
    icon: "👨‍✈️",
    items: [
      {
        label: "Управление водителями",
        href: "/demo/transport/manager/modules/drivers",
        icon: "👨‍✈️",
        children: [
          { label: "Все водители", href: "/demo/transport/manager/modules/drivers" },
          { label: "Расписание смен", href: "/demo/transport/manager/modules/drivers/schedule" },
          { label: "Назначение маршрутов", href: "/demo/transport/manager/modules/drivers/assignment" },
          { label: "Квалификация", href: "/demo/transport/manager/modules/drivers/qualification" },
          { label: "Отпуска и больничные", href: "/demo/transport/manager/modules/drivers/vacations" },
          { label: "Производительность", href: "/demo/transport/manager/modules/drivers/performance" },
        ],
      },
    ],
  },
  {
    key: "schedule",
    title: "РАСПИСАНИЕ",
    icon: "⏰",
    items: [
      {
        label: "Управление расписанием",
        href: "/demo/transport/manager/modules/schedule",
        icon: "⏰",
        children: [
          { label: "Общее расписание", href: "/demo/transport/manager/modules/schedule" },
          { label: "Интервалы движения", href: "/demo/transport/manager/modules/schedule/intervals" },
          { label: "Пиковые часы", href: "/demo/transport/manager/modules/schedule/peak" },
          { label: "Ночные маршруты", href: "/demo/transport/manager/modules/schedule/night" },
          { label: "Выходные и праздники", href: "/demo/transport/manager/modules/schedule/holidays" },
          { label: "Корректировка расписания", href: "/demo/transport/manager/modules/schedule/adjustment" },
        ],
      },
    ],
  },
  {
    key: "stops",
    title: "ОСТАНОВКИ",
    icon: "🚏",
    items: [
      {
        label: "Управление остановками",
        href: "/demo/transport/manager/modules/stops",
        icon: "🚏",
        children: [
          { label: "Все остановки", href: "/demo/transport/manager/modules/stops" },
          { label: "Создание остановки", href: "/demo/transport/manager/modules/stops/create" },
          { label: "Обслуживание остановок", href: "/demo/transport/manager/modules/stops/maintenance" },
          { label: "Инфраструктура", href: "/demo/transport/manager/modules/stops/infrastructure" },
          { label: "Пассажиропоток", href: "/demo/transport/manager/modules/stops/passenger-flow" },
          { label: "Пересадки", href: "/demo/transport/manager/modules/stops/transfers" },
        ],
      },
    ],
  },
  {
    key: "tickets",
    title: "БИЛЕТЫ",
    icon: "🎫",
    items: [
      {
        label: "Управление билетами",
        href: "/demo/transport/manager/modules/tickets",
        icon: "🎫",
        children: [
          { label: "Продажи билетов", href: "/demo/transport/manager/modules/tickets" },
          { label: "Тарифы и цены", href: "/demo/transport/manager/modules/tickets/pricing" },
          { label: "Льготные программы", href: "/demo/transport/manager/modules/tickets/discounts" },
          { label: "Проездные", href: "/demo/transport/manager/modules/tickets/passes" },
          { label: "Контроль оплаты", href: "/demo/transport/manager/modules/tickets/control" },
          { label: "Статистика продаж", href: "/demo/transport/manager/modules/tickets/statistics" },
        ],
      },
    ],
  },
  {
    key: "finance",
    title: "ФИНАНСЫ",
    icon: "💰",
    items: [
      {
        label: "Финансовый учет",
        href: "/demo/transport/manager/modules/finance",
        icon: "💰",
        children: [
          { label: "Ежедневная выручка", href: "/demo/transport/manager/modules/finance" },
          { label: "Расходы", href: "/demo/transport/manager/modules/finance/expenses" },
          { label: "Бюджетирование", href: "/demo/transport/manager/modules/finance/budget" },
          { label: "Отчетность", href: "/demo/transport/manager/modules/finance/reports" },
          { label: "Анализ доходов", href: "/demo/transport/manager/modules/finance/revenue" },
          { label: "Затраты на топливо", href: "/demo/transport/manager/modules/finance/fuel-costs" },
        ],
      },
    ],
  },
  {
    key: "passengers",
    title: "ПАССАЖИРЫ",
    icon: "👥",
    items: [
      {
        label: "Аналитика пассажиров",
        href: "/demo/transport/manager/modules/passengers",
        icon: "👥",
        children: [
          { label: "Пассажиропоток", href: "/demo/transport/manager/modules/passengers" },
          { label: "Статистика поездок", href: "/demo/transport/manager/modules/passengers/statistics" },
          { label: "Часы пик", href: "/demo/transport/manager/modules/passengers/peak-hours" },
          { label: "Обратная связь", href: "/demo/transport/manager/modules/passengers/feedback" },
          { label: "Жалобы", href: "/demo/transport/manager/modules/passengers/complaints" },
          { label: "Удовлетворенность", href: "/demo/transport/manager/modules/passengers/satisfaction" },
        ],
      },
    ],
  },
  {
    key: "operations",
    title: "ОПЕРАЦИИ",
    icon: "⚙️",
    items: [
      {
        label: "Операционное управление",
        href: "/demo/transport/manager/modules/operations",
        icon: "⚙️",
        children: [
          { label: "Текущие операции", href: "/demo/transport/manager/modules/operations" },
          { label: "Мониторинг транспорта", href: "/demo/transport/manager/modules/operations/monitoring" },
          { label: "Задержки и сбои", href: "/demo/transport/manager/modules/operations/delays" },
          { label: "Аварии и инциденты", href: "/demo/transport/manager/modules/operations/incidents" },
          { label: "Координация", href: "/demo/transport/manager/modules/operations/coordination" },
          { label: "Экстренные ситуации", href: "/demo/transport/manager/modules/operations/emergency" },
        ],
      },
    ],
  },
  {
    key: "analytics",
    title: "АНАЛИТИКА",
    icon: "📊",
    items: [
      {
        label: "Операционная аналитика",
        href: "/demo/transport/manager/modules/analytics",
        icon: "📊",
        children: [
          { label: "Общая статистика", href: "/demo/transport/manager/modules/analytics" },
          { label: "Эффективность маршрутов", href: "/demo/transport/manager/modules/analytics/routes" },
          { label: "Загрузка транспорта", href: "/demo/transport/manager/modules/analytics/load" },
          { label: "KPI и метрики", href: "/demo/transport/manager/modules/analytics/kpi" },
          { label: "Отчеты", href: "/demo/transport/manager/modules/analytics/reports" },
          { label: "Прогнозирование", href: "/demo/transport/manager/modules/analytics/forecasting" },
        ],
      },
    ],
  },
  {
    key: "quality",
    title: "КАЧЕСТВО",
    icon: "⭐",
    items: [
      {
        label: "Контроль качества",
        href: "/demo/transport/manager/modules/quality",
        icon: "⭐",
        children: [
          { label: "Стандарты обслуживания", href: "/demo/transport/manager/modules/quality" },
          { label: "Чистота транспорта", href: "/demo/transport/manager/modules/quality/cleanliness" },
          { label: "Пунктуальность", href: "/demo/transport/manager/modules/quality/punctuality" },
          { label: "Комфорт пассажиров", href: "/demo/transport/manager/modules/quality/comfort" },
          { label: "Аудит качества", href: "/demo/transport/manager/modules/quality/audit" },
          { label: "Улучшение сервиса", href: "/demo/transport/manager/modules/quality/improvement" },
        ],
      },
    ],
  },
  {
    key: "profile",
    title: "ПРОФИЛЬ",
    icon: "👨‍💼",
    items: [
      {
        label: "Кабинет менеджера",
        href: "/demo/transport/manager/modules/profile",
        icon: "👨‍💼",
        children: [
          { label: "Мой профиль", href: "/demo/transport/manager/modules/profile" },
          { label: "Рабочие настройки", href: "/demo/transport/manager/modules/profile/settings" },
          { label: "Уведомления", href: "/demo/transport/manager/modules/profile/notifications" },
          { label: "Доступ и права", href: "/demo/transport/manager/modules/profile/permissions" },
          { label: "Смена роли", href: "/demo/transport/manager/modules/profile/roles" },
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

// Компонент переключения ролей
const RoleSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Определяем текущую роль на основе пути
  const currentRole = useMemo(() => {
    if (pathname.includes('/admin')) return ROLES[4]; // admin
    if (pathname.includes('/dispatcher')) return ROLES[3]; // dispatcher
    if (pathname.includes('/manager')) return ROLES[2]; // manager
    if (pathname.includes('/driver')) return ROLES[1]; // driver
    return ROLES[0]; // user
  }, [pathname]);

  const handleRoleChange = (role: typeof ROLES[0]) => {
    router.push(role.href);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Кнопка переключения ролей */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-lg transition-all duration-300 w-full',
          'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10 text-white/90 hover:text-white',
          isOpen && 'bg-white/20 border-white/40 text-white shadow-lg'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentRole.color} flex items-center justify-center text-white shadow-lg`}>
          <Icon name={currentRole.icon} size={16} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="text-sm font-semibold truncate">{currentRole.label}</div>
          <div className="text-xs text-white/70 truncate">{currentRole.description}</div>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-white/60 text-lg flex-shrink-0"
        >
          ↓
        </motion.span>
      </motion.button>

      {/* Выпадающий список ролей */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-2xl border border-white/30 rounded-xl p-2 shadow-2xl z-50"
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
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={role.icon} size={16} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium truncate">{role.label}</div>
                  <div className="text-xs text-white/70 truncate">{role.description}</div>
                </div>
                {currentRole.id === role.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-white shadow-lg"
                  />
                )}
                <motion.span
                  className="opacity-0 group-hover:opacity-100 text-white/60 transition-opacity"
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

// Мобильное меню в стиле таббара
const MobileTabbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const categories = useMemo(() => MANAGER_CATEGORIES, []);
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
        <div
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
              <div className="mb-3 flex items-center justify-center gap-2 px-1">
                <Icon name={currentCategory.icon} aria-hidden size={18} className="text-white/90" />
                <div className="text-xs font-semibold uppercase tracking-wide text-white/90">
                  {currentCategory.title}
                </div>
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
                          'inline-flex h-12 w-[min(92%,500px)] items-center justify-center gap-3',
                          'rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg px-4 text-sm font-medium transition-all duration-300',
                          'hover:bg-white/20 hover:border-white/30 text-white/90 hover:text-white',
                          active && 'bg-white/20 border-white/40 text-white shadow-lg'
                        )}
                        onClick={onItemClick(it)}
                      >
                        <Icon name={it.icon} aria-hidden size={16} className="shrink-0" />
                        <span className="truncate">{it.label}</span>
                        {it.children && it.children.length ? (
                          <span className="ml-auto text-xs text-white/70">›</span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Шаг 2: подпункты */}
              {stage === 'children' && selectedItem && (
                <div className="flex flex-col items-center gap-2">
                  <div className="mb-2 text-sm font-medium text-white/90">{selectedItem.label}</div>

                  {selectedItem.children!.map((ch) => {
                    const active = isActive(pathname, ch.href);
                    return (
                      <Link
                        key={ch.href}
                        href={ch.href}
                        prefetch={false}
                        className={cn(
                          'inline-flex h-12 w-[min(92%,500px)] items-center justify-center gap-3',
                          'rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg px-4 text-sm font-medium transition-all duration-300',
                          'hover:bg-white/20 hover:border-white/30 text-white/90 hover:text-white',
                          active && 'bg-white/20 border-white/40 text-white shadow-lg'
                        )}
                        onClick={onChildClick(ch.href)}
                      >
                        {ch.icon && <Icon name={ch.icon} aria-hidden size={16} className="shrink-0" />}
                        <span className="truncate">{ch.label}</span>
                      </Link>
                    );
                  })}

                  <button
                    onClick={() => {
                      setStage('items');
                      setSelectedItem(null);
                    }}
                    className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg px-4 text-xs text-white/80 hover:bg-white/20 transition-all duration-300"
                  >
                    ← Назад к {currentCategory.title}
                  </button>
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
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/90 to-transparent" />

          {/* Лента категорий */}
          <div
            ref={railRef}
            className="grid auto-cols-[136px] grid-flow-col gap-2 overflow-x-auto px-2 py-3 snap-x snap-mandatory"
          >
            <div className="w-1" aria-hidden />
            {categories.map((cat) => {
              const anyActive = cat.items.some((it) => isActive(pathname, it.href));
              const isOpen = openKey === cat.key;
              return (
                <motion.button
                  key={cat.key}
                  ref={(el) => (btnRefs.current[cat.key] = el)}
                  className={cn(
                    'inline-flex h-14 snap-start items-center gap-2 rounded-2xl border px-3 text-left transition-all duration-300 backdrop-blur-lg',
                    'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/20',
                    (anyActive || isOpen) && 'border-white/40 bg-white/20 shadow-lg'
                  )}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpen(cat.key)}
                >
                  <Icon name={cat.icon} size={18} className="text-white/90" />
                  <span className="min-w-0 leading-4">
                    <span className="block truncate text-[10px] uppercase tracking-wide text-white/70">
                      {cat.title}
                    </span>
                    <span className="block truncate text-xs font-medium text-white/90">
                      {cat.items[0]?.label}
                    </span>
                  </span>
                  {(anyActive || isOpen) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-white/90"
                    />
                  )}
                </motion.button>
              );
            })}
            <div className="w-1" aria-hidden />
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

  const toggleCategory = useCallback((key: string) => {
    setExpandedCategory(current => current === key ? null : key);
  }, []);

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
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-xl text-white">👨‍💼</span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white/90 text-sm truncate">Менеджер</div>
              <div className="text-white/70 text-xs font-medium">Управление операциями</div>
            </div>
          </div>

          {/* Переключение ролей */}
          <RoleSwitcher />
        </div>

        {/* Навигация */}
        <nav className="flex flex-1 flex-col gap-2">
          {MANAGER_CATEGORIES.map((category) => (
            <div key={category.key} className="space-y-1">
              {/* Категория */}
              <motion.button
                onClick={() => toggleCategory(category.key)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-lg border',
                  'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/20 text-white/90 hover:text-white',
                  expandedCategory === category.key && 'bg-white/20 border-white/40 text-white shadow-lg'
                )}
                whileHover={{ x: 4 }}
              >
                <Icon name={category.icon} size={18} />
                <span className="flex-1 text-left">{category.title}</span>
                <motion.span
                  animate={{ rotate: expandedCategory === category.key ? 180 : 0 }}
                  className="text-white/60"
                >
                  ↓
                </motion.span>
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
                            'flex items-center gap-3 p-2 rounded-lg text-sm transition-all duration-300 backdrop-blur-lg group',
                            'text-white/60 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10',
                            isActive(pathname, item.href) && 'text-white bg-white/20 border-white/20 shadow-md'
                          )}
                        >
                          {item.icon && <Icon name={item.icon} size={14} />}
                          <span className="flex-1">{item.label}</span>
                          <motion.span
                            className="opacity-0 group-hover:opacity-100 text-white/60 transition-opacity"
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

        {/* Профиль менеджера */}
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
          whileHover={{ y: -1 }}
          onClick={() => router.push('/demo/transport/manager/modules/profile')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
            <span className="text-base">👨‍💼</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white/90 truncate">Дмитрий Соколов</div>
            <div className="text-xs text-white/70 truncate">Менеджер транспорта</div>
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

// Основной компонент лейаута
export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Определяем текущую роль для мобильного заголовка
  const currentRole = useMemo(() => {
    if (pathname.includes('/admin')) return ROLES[4]; // admin
    if (pathname.includes('/dispatcher')) return ROLES[3]; // dispatcher
    if (pathname.includes('/manager')) return ROLES[2]; // manager
    if (pathname.includes('/driver')) return ROLES[1]; // driver
    return ROLES[0]; // user
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Десктопное меню */}
      <DesktopSidebar />

      {/* Мобильное меню */}
      <MobileTabbar />

      {/* Основная область контента */}
      <div className="lg:pl-80">
        {/* Верхний заголовок для мобильных */}
        <motion.header 
          className={`lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-2xl border-b border-white/20 transition-all duration-300 ${
            scrolled ? 'shadow-lg' : ''
          }`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentRole.color} flex items-center justify-center shadow-lg`}>
              <span className="text-lg text-white">{currentRole.icon}</span>
            </div>
            <div>
              <div className="text-white/90 font-bold text-sm">{currentRole.label}</div>
              <div className="text-white/70 text-xs">Управление операциями</div>
            </div>
          </div>
          
          {/* Индикатор текущей роли для мобильных */}
          <motion.div 
            className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white/80 text-xs font-medium"
            whileHover={{ scale: 1.05 }}
          >
            {currentRole.label}
          </motion.div>
        </motion.header>

        {/* Контент страницы */}
        <main className="min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}