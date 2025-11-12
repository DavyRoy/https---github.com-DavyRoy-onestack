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
    label: 'Клиент',
    href: '/demo/services/user',
    icon: '👤',
    description: 'Поиск и заказ услуг',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'specialist',
    label: 'Специалист',
    href: '/demo/services/specialist',
    icon: '🔧',
    description: 'Оказание услуг',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'manager',
    label: 'Менеджер',
    href: '/demo/services/manager',
    icon: '👨‍💼',
    description: 'Управление услугами',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'owner',
    label: 'Владелец',
    href: '/demo/services/owner',
    icon: '👑',
    description: 'Управление бизнесом',
    color: 'from-purple-500 to-pink-500'
  }
];

// Конфигурация меню для менеджера сферы услуг
const MANAGER_CATEGORIES: Category[] = [
  {
    key: "dashboard",
    title: "Главная",
    icon: "🏠",
    items: [{ label: "Операционная панель", href: "/demo/services/manager", icon: "🏠" }],
  },
  {
    key: "orders",
    title: "ЗАКАЗЫ",
    icon: "📋",
    items: [
      {
        label: "Управление заказами",
        href: "/demo/services/manager/modules/orders",
        icon: "📋",
        children: [
          { label: "Все заказы", href: "/demo/services/manager/modules/orders" },
          { label: "Новые заказы", href: "/demo/services/manager/modules/orders/new" },
          { label: "В работе", href: "/demo/services/manager/modules/orders/in-progress" },
          { label: "На подтверждении", href: "/demo/services/manager/modules/orders/pending" },
          { label: "Завершенные", href: "/demo/services/manager/modules/orders/completed" },
          { label: "Отмененные", href: "/demo/services/manager/modules/orders/cancelled" },
        ],
      },
    ],
  },
  {
    key: "services",
    title: "УСЛУГИ",
    icon: "🛠️",
    items: [
      {
        label: "Управление услугами",
        href: "/demo/services/manager/modules/services",
        icon: "🛠️",
        children: [
          { label: "Каталог услуг", href: "/demo/services/manager/modules/services" },
          { label: "Создание услуги", href: "/demo/services/manager/modules/services/create" },
          { label: "Цены и тарифы", href: "/demo/services/manager/modules/services/pricing" },
          { label: "Категории", href: "/demo/services/manager/modules/services/categories" },
          { label: "Акции и скидки", href: "/demo/services/manager/modules/services/discounts" },
          { label: "Популярные услуги", href: "/demo/services/manager/modules/services/popular" },
        ],
      },
    ],
  },
  {
    key: "specialists",
    title: "СПЕЦИАЛИСТЫ",
    icon: "👨‍🔧",
    items: [
      {
        label: "Управление специалистами",
        href: "/demo/services/manager/modules/specialists",
        icon: "👨‍🔧",
        children: [
          { label: "Все специалисты", href: "/demo/services/manager/modules/specialists" },
          { label: "Расписание", href: "/demo/services/manager/modules/specialists/schedule" },
          { label: "Назначение заказов", href: "/demo/services/manager/modules/specialists/assignment" },
          { label: "Рейтинги", href: "/demo/services/manager/modules/specialists/ratings" },
          { label: "Зарплаты", href: "/demo/services/manager/modules/specialists/salaries" },
          { label: "Отпуска", href: "/demo/services/manager/modules/specialists/vacations" },
        ],
      },
    ],
  },
  {
    key: "customers",
    title: "КЛИЕНТЫ",
    icon: "👥",
    items: [
      {
        label: "База клиентов",
        href: "/demo/services/manager/modules/customers",
        icon: "👥",
        children: [
          { label: "Все клиенты", href: "/demo/services/manager/modules/customers" },
          { label: "История заказов", href: "/demo/services/manager/modules/customers/history" },
          { label: "Лояльные клиенты", href: "/demo/services/manager/modules/customers/loyal" },
          { label: "Рассылки", href: "/demo/services/manager/modules/customers/newsletters" },
          { label: "Отзывы", href: "/demo/services/manager/modules/customers/reviews" },
          { label: "Жалобы", href: "/demo/services/manager/modules/customers/complaints" },
        ],
      },
    ],
  },
  {
    key: "booking",
    title: "ЗАПИСЬ",
    icon: "📅",
    items: [
      {
        label: "Управление записью",
        href: "/demo/services/manager/modules/booking",
        icon: "📅",
        children: [
          { label: "Расписание", href: "/demo/services/manager/modules/booking" },
          { label: "Слоты времени", href: "/demo/services/manager/modules/booking/slots" },
          { label: "Подтверждение записей", href: "/demo/services/manager/modules/booking/confirmation" },
          { label: "Переносы", href: "/demo/services/manager/modules/booking/reschedule" },
          { label: "Отмены", href: "/demo/services/manager/modules/booking/cancellations" },
          { label: "Напоминания", href: "/demo/services/manager/modules/booking/reminders" },
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
        href: "/demo/services/manager/modules/finance",
        icon: "💰",
        children: [
          { label: "Ежедневная выручка", href: "/demo/services/manager/modules/finance" },
          { label: "Счета и оплаты", href: "/demo/services/manager/modules/finance/invoices" },
          { label: "Расходы", href: "/demo/services/manager/modules/finance/expenses" },
          { label: "Авансовые платежи", href: "/demo/services/manager/modules/finance/advances" },
          { label: "Возвраты", href: "/demo/services/manager/modules/finance/refunds" },
          { label: "Финансовые отчеты", href: "/demo/services/manager/modules/finance/reports" },
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
        href: "/demo/services/manager/modules/quality",
        icon: "⭐",
        children: [
          { label: "Контроль услуг", href: "/demo/services/manager/modules/quality" },
          { label: "Стандарты обслуживания", href: "/demo/services/manager/modules/quality/standards" },
          { label: "Рекламации", href: "/demo/services/manager/modules/quality/complaints" },
          { label: "Аудит качества", href: "/demo/services/manager/modules/quality/audit" },
          { label: "Улучшение процессов", href: "/demo/services/manager/modules/quality/improvement" },
          { label: "Обучение персонала", href: "/demo/services/manager/modules/quality/training" },
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
        href: "/demo/services/manager/modules/analytics",
        icon: "📊",
        children: [
          { label: "Общая статистика", href: "/demo/services/manager/modules/analytics" },
          { label: "Анализ услуг", href: "/demo/services/manager/modules/analytics/services" },
          { label: "Эффективность специалистов", href: "/demo/services/manager/modules/analytics/specialists" },
          { label: "Загрузка", href: "/demo/services/manager/modules/analytics/workload" },
          { label: "KPI и метрики", href: "/demo/services/manager/modules/analytics/kpi" },
          { label: "Отчеты", href: "/demo/services/manager/modules/analytics/reports" },
        ],
      },
    ],
  },
  {
    key: "marketing",
    title: "МАРКЕТИНГ",
    icon: "🎯",
    items: [
      {
        label: "Маркетинг и продвижение",
        href: "/demo/services/manager/modules/marketing",
        icon: "🎯",
        children: [
          { label: "Акции и скидки", href: "/demo/services/manager/modules/marketing" },
          { label: "Промо-кампании", href: "/demo/services/manager/modules/marketing/campaigns" },
          { label: "Лояльность клиентов", href: "/demo/services/manager/modules/marketing/loyalty" },
          { label: "Отзывы и рейтинги", href: "/demo/services/manager/modules/marketing/reviews" },
          { label: "Рекламные материалы", href: "/demo/services/manager/modules/marketing/materials" },
          { label: "Анализ эффективности", href: "/demo/services/manager/modules/marketing/analytics" },
        ],
      },
    ],
  },
  {
    key: "support",
    title: "ПОДДЕРЖКА",
    icon: "🤝",
    items: [
      {
        label: "Служба поддержки",
        href: "/demo/services/manager/modules/support",
        icon: "🤝",
        children: [
          { label: "Обращения клиентов", href: "/demo/services/manager/modules/support" },
          { label: "Техподдержка", href: "/demo/services/manager/modules/support/technical" },
          { label: "Обучение персонала", href: "/demo/services/manager/modules/support/training" },
          { label: "База знаний", href: "/demo/services/manager/modules/support/knowledge-base" },
          { label: "Эскалация проблем", href: "/demo/services/manager/modules/support/escalation" },
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
        href: "/demo/services/manager/modules/profile",
        icon: "👨‍💼",
        children: [
          { label: "Мой профиль", href: "/demo/services/manager/modules/profile" },
          { label: "Рабочие настройки", href: "/demo/services/manager/modules/profile/settings" },
          { label: "Уведомления", href: "/demo/services/manager/modules/profile/notifications" },
          { label: "Доступ и права", href: "/demo/services/manager/modules/profile/permissions" },
          { label: "Смена роли", href: "/demo/services/manager/modules/profile/roles" },
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
    if (pathname.includes('/owner')) return ROLES[3]; // owner
    if (pathname.includes('/manager')) return ROLES[2]; // manager
    if (pathname.includes('/specialist')) return ROLES[1]; // specialist
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
              <div className="text-white/70 text-xs font-medium">Управление услугами</div>
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
          onClick={() => router.push('/demo/services/manager/modules/profile')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
            <span className="text-base">👨‍💼</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white/90 truncate">Анна Козлова</div>
            <div className="text-xs text-white/70 truncate">Менеджер сервиса услуг</div>
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
    if (pathname.includes('/owner')) return ROLES[3];
    if (pathname.includes('/manager')) return ROLES[2];
    if (pathname.includes('/specialist')) return ROLES[1];
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
            <div className="text-xs text-white/70">Управление услугами</div>
          </div>
        </div>
        
        <div className="text-sm text-white/70 font-medium">
          {new Date().toLocaleDateString('ru-RU')}
        </div>
      </div>
    </motion.div>
  );
};

// Основной компонент лейаута
export default function ManagerLayout({
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