'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// ========== КОНСТАНТЫ И ТИПЫ ==========

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

interface SupportCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  actionText: string;
  examples: SupportExample[];
  stats: {
    responseTime: string;
    satisfaction: number;
    availability: string;
    specialists: number;
  };
}

interface SupportExample {
  id: string;
  title: string;
  description: string;
  steps: string[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  videoUrl?: string;
  attachments?: string[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  popularity: number;
  relatedExamples: string[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'support' | 'system';
  content: string;
  timestamp: Date;
  sender?: string;
  attachments?: string[];
  read?: boolean;
}

interface SupportSpecialist {
  id: string;
  name: string;
  position: string;
  avatar: string;
  rating: number;
  expertise: string[];
  isOnline: boolean;
  currentChats: number;
  languages: string[];
  experience: string;
}

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  lastUpdated: string;
  author: string;
  relatedArticles: string[];
  readingTime: string;
}

interface SupportTicket {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  category: string;
  assignedTo?: string;
}

// ========== МОКИ ДАННЫХ ==========

const supportCategories: SupportCategory[] = [
  {
    id: 'help',
    title: 'Помощь и консультация',
    description: 'Получите профессиональную помощь и консультации по всем вопросам работы с системой',
    icon: '❓',
    color: COLORS.blue,
    features: [
      'Пошаговые инструкции',
      'Видео-руководства',
      'Частые вопросы',
      'Документация',
      'Примеры использования',
      'База знаний',
      'Сообщества пользователей',
      'Форум поддержки'
    ],
    actionText: 'Найти решение',
    stats: {
      responseTime: '2-4 часа',
      satisfaction: 96,
      availability: '24/7',
      specialists: 8
    },
    examples: [
      {
        id: '1',
        title: 'Как настроить уведомления',
        description: 'Настройка системы оповещений о важных событиях',
        steps: [
          'Перейдите в раздел "Настройки"',
          'Выберите "Уведомления" в боковом меню',
          'Настройте параметры оповещений для каждого типа событий',
          'Выберите способ доставки (email, push, sms)',
          'Сохраните изменения и протестируйте работу',
          'При необходимости настройте расписание уведомлений'
        ],
        estimatedTime: '5-7 минут',
        difficulty: 'easy',
        category: 'Настройки',
        tags: ['уведомления', 'настройки', 'оповещения'],
        videoUrl: '#',
        attachments: ['guide.pdf', 'settings-template.json']
      },
      {
        id: '2',
        title: 'Создание отчета по клиентам',
        description: 'Генерация детальных отчетов по клиентской базе с фильтрацией и экспортом',
        steps: [
          'Откройте раздел "Отчеты" в главном меню',
          'Выберите тип отчета "Клиенты" из доступных шаблонов',
          'Настройте параметры фильтрации по дате, статусу, региону',
          'Добавьте необходимые колонки в отчет',
          'Настройте группировку и сортировку данных',
          'Предпросмотр отчета и корректировка параметров',
          'Сгенерируйте и экспортируйте отчет в нужном формате'
        ],
        estimatedTime: '10-15 минут',
        difficulty: 'medium',
        category: 'Отчеты',
        tags: ['отчеты', 'клиенты', 'экспорт', 'аналитика'],
        attachments: ['report-template.xlsx']
      },
      {
        id: '3',
        title: 'Интеграция с внешними системами',
        description: 'Настройка интеграции с CRM и другими системами через API',
        steps: [
          'Получите API ключи в разделе "Настройки API"',
          'Настройте webhook endpoints для входящих данных',
          'Сконфигурируйте аутентификацию и права доступа',
          'Проверьте соединение тестовыми запросами',
          'Настройте преобразование данных между системами',
          'Протестируйте полный цикл интеграции',
          'Запустите мониторинг и логирование процессов'
        ],
        estimatedTime: '30-45 минут',
        difficulty: 'hard',
        category: 'Интеграции',
        tags: ['API', 'интеграция', 'webhook', 'CRM'],
        attachments: ['api-documentation.pdf', 'integration-guide.docx']
      },
      {
        id: '4',
        title: 'Миграция данных из старой системы',
        description: 'Перенос данных из предыдущих версий или сторонних систем',
        steps: [
          'Подготовьте данные для миграции в требуемом формате',
          'Создайте резервную копию текущих данных',
          'Запустите инструмент миграции',
          'Проверьте целостность перенесенных данных',
          'Валидируйте связи и зависимости',
          'Проведите тестирование функциональности',
          'Подтвердите успешность миграции'
        ],
        estimatedTime: '1-2 часа',
        difficulty: 'hard',
        category: 'Данные',
        tags: ['миграция', 'данные', 'импорт', 'резервная копия']
      }
    ]
  },
  {
    id: 'chat',
    title: 'Онлайн-чат',
    description: 'Мгновенная помощь через онлайн-чат с нашими специалистами',
    icon: '💬',
    color: COLORS.emerald,
    features: [
      'Круглосуточная поддержка',
      'Мгновенные ответы',
      'Прикрепление файлов',
      'История диалогов',
      'Совместный просмотр экрана',
      'Перевод на специалиста',
      'Шаблоны ответов',
      'Рейтинг поддержки'
    ],
    actionText: 'Начать чат',
    stats: {
      responseTime: '2-3 минуты',
      satisfaction: 98,
      availability: '24/7',
      specialists: 12
    },
    examples: [
      {
        id: '1',
        title: 'Быстрое решение проблемы',
        description: 'Получите мгновенную помощь по текущей проблеме',
        steps: [
          'Опишите проблему кратко и понятно',
          'Укажите версию системы и браузер',
          'Прикрепите скриншоты или видео при необходимости',
          'Дождитесь ответа специалиста',
          'Следуйте предоставленным инструкциям',
          'Подтвердите решение проблемы'
        ],
        estimatedTime: '2-5 минут',
        difficulty: 'easy',
        category: 'Чат',
        tags: ['срочно', 'проблема', 'помощь']
      },
      {
        id: '2',
        title: 'Консультация по функциям',
        description: 'Получите разъяснение по работе конкретных функций системы',
        steps: [
          'Укажите интересующую функцию или раздел',
          'Задайте конкретные вопросы по использованию',
          'Получите демонстрацию от специалиста',
          'Попробуйте выполнить действия самостоятельно',
          'Задайте уточняющие вопросы при необходимости',
          'Сохраните историю диалога для будущего использования'
        ],
        estimatedTime: '10-15 минут',
        difficulty: 'easy',
        category: 'Консультация',
        tags: ['обучение', 'функции', 'консультация']
      }
    ]
  },
  {
    id: 'hotline',
    title: 'Телефон горячей линии',
    description: 'Позвоните нам для получения срочной помощи и консультаций',
    icon: '📞',
    color: COLORS.orange,
    features: [
      'Круглосуточная линия',
      'Квалифицированные специалисты',
      'Запись разговора',
      'Обратный звонок',
      'Срочная техническая помощь',
      'Консультации по продукту',
      'Эскалация сложных вопросов',
      'Многоязычная поддержка'
    ],
    actionText: 'Позвонить сейчас',
    stats: {
      responseTime: 'мгновенно',
      satisfaction: 95,
      availability: '24/7',
      specialists: 6
    },
    examples: [
      {
        id: '1',
        title: 'Экстренная техническая помощь',
        description: 'Решение срочных технических проблем, влияющих на работу системы',
        steps: [
          'Подготовьте номер договора или учетной записи',
          'Опишите проблему максимально детально',
          'Сообщите о уже предпринятых действиях',
          'Следуйте инструкциям оператора',
          'Предоставьте доступ для диагностики при необходимости',
          'Подтвердите решение проблемы и получите номер заявки'
        ],
        estimatedTime: '15-30 минут',
        difficulty: 'medium',
        category: 'Техподдержка',
        tags: ['срочно', 'техническая', 'проблема']
      },
      {
        id: '2',
        title: 'Консультация по тарифам',
        description: 'Подбор оптимального тарифного плана под ваши потребности',
        steps: [
          'Расскажите о ваших текущих потребностях и объеме работы',
          'Получите рекомендации по доступным тарифам',
          'Обсудите особенности каждого варианта',
          'Уточните условия подключения и миграции',
          'Запросите пробный период при необходимости',
          'Подтвердите выбор тарифа и оформите заявку'
        ],
        estimatedTime: '10-20 минут',
        difficulty: 'easy',
        category: 'Тарифы',
        tags: ['тарифы', 'консультация', 'подбор']
      }
    ]
  }
];

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'Как восстановить доступ к системе?',
    answer: 'Для восстановления доступа используйте функцию "Забыли пароль" на странице входа. Вам будет отправлена ссылка для сброса пароля на указанную при регистрации почту. Если у вас нет доступа к email, обратитесь в поддержку с документами, подтверждающими вашу личность.',
    category: 'help',
    popularity: 95,
    relatedExamples: ['1', '2']
  },
  {
    id: '2',
    question: 'Какие браузеры поддерживаются?',
    answer: 'Система поддерживает все современные браузеры: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. Рекомендуем использовать последние версии браузеров для максимальной производительности и безопасности. Мобильные приложения доступны для iOS 14+ и Android 10+.',
    category: 'help',
    popularity: 87,
    relatedExamples: ['1']
  },
  {
    id: '3',
    question: 'Как добавить нового пользователя?',
    answer: 'Перейдите в раздел "Пользователи", нажмите "Добавить пользователя", заполните необходимые поля (email, имя, должность) и назначьте права доступа. Новый пользователь получит приглашение по email со ссылкой для активации аккаунта.',
    category: 'help',
    popularity: 92,
    relatedExamples: ['2', '3']
  },
  {
    id: '4',
    question: 'В какое время работает онлайн-чат?',
    answer: 'Онлайн-чат доступен круглосуточно 7 дней в неделю. Среднее время ответа - 2-3 минуты в рабочее время (9:00-18:00 по МСК) и до 10 минут в нерабочее время. В часы пиковой нагрузки возможны небольшие задержки.',
    category: 'chat',
    popularity: 78,
    relatedExamples: ['1']
  },
  {
    id: '5',
    question: 'Можно ли получить консультацию по телефону?',
    answer: 'Да, горячая линия работает круглосуточно. Номер телефона: 8-800-555-35-35. Звонок бесплатный по всей России. Для международных звонков: +7-495-123-45-67. Среднее время ожидания ответа - менее 1 минуты.',
    category: 'hotline',
    popularity: 85,
    relatedExamples: ['1', '2']
  },
  {
    id: '6',
    question: 'Как обновить систему до новой версии?',
    answer: 'Обновления системы происходят автоматически в фоновом режиме. При выходе major-обновления мы уведомляем за 2 недели и предоставляем подробную инструкцию. Рекомендуем создавать резервные копии данных перед обновлением.',
    category: 'help',
    popularity: 76,
    relatedExamples: ['4']
  }
];

const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
  {
    id: '1',
    title: 'Полное руководство по началу работы',
    content: 'Подробное руководство для новых пользователей системы. Включает настройку аккаунта, базовые операции и лучшие практики.',
    category: 'Обучение',
    tags: ['начало работы', 'руководство', 'новые пользователи'],
    views: 1247,
    lastUpdated: '2024-01-15',
    author: 'Иван Петров',
    relatedArticles: ['2', '3'],
    readingTime: '15 мин'
  },
  {
    id: '2',
    title: 'Оптимизация производительности системы',
    content: 'Советы и рекомендации по повышению производительности работы с системой. Настройки кэширования, оптимизация запросов.',
    category: 'Производительность',
    tags: ['производительность', 'оптимизация', 'настройки'],
    views: 856,
    lastUpdated: '2024-01-10',
    author: 'Мария Сидорова',
    relatedArticles: ['1', '4'],
    readingTime: '12 мин'
  },
  {
    id: '3',
    title: 'Интеграция с популярными CRM системами',
    content: 'Пошаговое руководство по интеграции с AmoCRM, Bitrix24, Salesforce и другими популярными CRM системами.',
    category: 'Интеграции',
    tags: ['интеграция', 'CRM', 'API'],
    views: 943,
    lastUpdated: '2024-01-08',
    author: 'Алексей Козлов',
    relatedArticles: ['1', '5'],
    readingTime: '20 мин'
  },
  {
    id: '4',
    title: 'Безопасность и управление доступом',
    content: 'Рекомендации по настройке безопасности, управлению правами доступа и двухфакторной аутентификации.',
    category: 'Безопасность',
    tags: ['безопасность', 'доступ', 'аутентификация'],
    views: 672,
    lastUpdated: '2024-01-05',
    author: 'Сергей Иванов',
    relatedArticles: ['2', '6'],
    readingTime: '18 мин'
  },
  {
    id: '5',
    title: 'Автоматизация рабочих процессов',
    content: 'Создание и настройка автоматизированных рабочих процессов для повышения эффективности бизнес-процессов.',
    category: 'Автоматизация',
    tags: ['автоматизация', 'workflow', 'процессы'],
    views: 523,
    lastUpdated: '2024-01-03',
    author: 'Ольга Николаева',
    relatedArticles: ['3', '4'],
    readingTime: '25 мин'
  },
  {
    id: '6',
    title: 'Аналитика и отчетность',
    content: 'Настройка дашбордов, создание пользовательских отчетов и работа с аналитическими инструментами системы.',
    category: 'Аналитика',
    tags: ['аналитика', 'отчеты', 'дашборды'],
    views: 789,
    lastUpdated: '2024-01-01',
    author: 'Павел Семенов',
    relatedArticles: ['2', '5'],
    readingTime: '22 мин'
  }
];

const supportSpecialists: SupportSpecialist[] = [
  {
    id: '1',
    name: 'Анна Петрова',
    position: 'Старший специалист поддержки',
    avatar: 'AP',
    rating: 4.9,
    expertise: ['Настройки', 'Интеграции', 'Отчеты'],
    isOnline: true,
    currentChats: 3,
    languages: ['Русский', 'Английский'],
    experience: '5 лет'
  },
  {
    id: '2',
    name: 'Дмитрий Смирнов',
    position: 'Технический специалист',
    avatar: 'ДС',
    rating: 4.8,
    expertise: ['API', 'Базы данных', 'Производительность'],
    isOnline: true,
    currentChats: 2,
    languages: ['Русский', 'Английский', 'Немецкий'],
    experience: '7 лет'
  },
  {
    id: '3',
    name: 'Елена Ковалева',
    position: 'Консультант по продукту',
    avatar: 'ЕК',
    rating: 4.7,
    expertise: ['Обучение', 'Внедрение', 'Безопасность'],
    isOnline: false,
    currentChats: 0,
    languages: ['Русский', 'Французский'],
    experience: '4 года'
  },
  {
    id: '4',
    name: 'Михаил Орлов',
    position: 'Специалист технической поддержки',
    avatar: 'МО',
    rating: 4.9,
    expertise: ['Проблемы', 'Диагностика', 'Миграция'],
    isOnline: true,
    currentChats: 1,
    languages: ['Русский', 'Английский', 'Испанский'],
    experience: '6 лет'
  },
  {
    id: '5',
    name: 'Светлана Васнецова',
    position: 'Менеджер по работе с клиентами',
    avatar: 'СВ',
    rating: 4.8,
    expertise: ['Тарифы', 'Обучение', 'Консультации'],
    isOnline: true,
    currentChats: 2,
    languages: ['Русский', 'Английский', 'Китайский'],
    experience: '3 года'
  }
];

const supportTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    title: 'Проблема с интеграцией API',
    status: 'in_progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
    category: 'technical',
    assignedTo: 'Дмитрий Смирнов'
  },
  {
    id: 'TKT-002',
    title: 'Вопрос по тарифам',
    status: 'open',
    priority: 'medium',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
    category: 'billing'
  },
  {
    id: 'TKT-003',
    title: 'Настройка отчетов',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 86400000),
    category: 'configuration'
  }
];

const quickActions = [
  { 
    icon: '📚', 
    label: 'База знаний', 
    color: COLORS.blue,
    description: 'Полная документация' 
  },
  { 
    icon: '🎥', 
    label: 'Видеоуроки', 
    color: COLORS.purple,
    description: 'Обучающие материалы' 
  },
  { 
    icon: '📋', 
    label: 'Шаблоны', 
    color: COLORS.emerald,
    description: 'Готовые решения' 
  },
  { 
    icon: '🔔', 
    label: 'Сообщить о проблеме', 
    color: COLORS.orange,
    description: 'Техническая поддержка' 
  },
  { 
    icon: '💡', 
    label: 'Идеи и предложения', 
    color: COLORS.yellow,
    description: 'Предложить улучшение' 
  },
  { 
    icon: '📊', 
    label: 'Статус системы', 
    color: COLORS.cyan,
    description: 'Мониторинг работы' 
  }
];

// ========== УТИЛИТЫ ==========

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays < 7) return `${diffDays} д назад`;
  return formatDate(date.toISOString());
};

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'advanced-particle';
  el.style.cssText = `
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(${color}, 1) 0%, rgba(${color}, 0.3) 70%);
    box-shadow: 0 0 15px rgba(${color}, 0.9), 0 0 30px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    filter: blur(0.8px);
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.4,
  fadeDistance: radius * 0.7
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

// ========== КОМПОНЕНТЫ АНИМАЦИЙ ==========

const AdvancedParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  onCardClick?: () => void;
  intensity?: number;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = false,
  onCardClick,
  intensity = 1
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          particle.remove();
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    
    for (let i = 0; i < particleCount; i++) {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const particle = createParticleElement(x, y, glowColor);
        cardRef.current.appendChild(particle);
        particlesRef.current.push(particle);

        gsap.fromTo(particle, 
          { 
            scale: 0, 
            opacity: 0,
            x: 0,
            y: 0,
            rotation: 0
          }, 
          { 
            scale: 1.2, 
            opacity: 1, 
            duration: 0.6,
            ease: 'back.out(2)'
          }
        );

        const timeline = gsap.timeline();
        timeline.to(particle, {
          x: `+=${(Math.random() - 0.5) * 120 * intensity}`,
          y: `+=${(Math.random() - 0.5) * 120 * intensity}`,
          rotation: 720,
          duration: 4 + Math.random() * 3,
          ease: 'sine.inOut'
        })
        .to(particle, {
          opacity: 0.4,
          scale: 0.9,
          duration: 1.5,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        }, 0);

        setTimeout(() => {
          if (particle.parentNode) {
            gsap.to(particle, {
              opacity: 0,
              scale: 0,
              duration: 0.6,
              onComplete: () => particle.remove()
            });
          }
        }, 4000 + Math.random() * 3000);

      }, i * 100);

      timeoutsRef.current.push(timeoutId);
    }
  }, [particleCount, glowColor, intensity]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 4,
          rotateY: 4,
          scale: 1.03,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      gsap.to(element, {
        '--glow-intensity': 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }

      gsap.to(element, {
        '--glow-intensity': 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8 * intensity;
        const rotateY = ((x - centerX) / centerX) * 8 * intensity;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.15,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.04 * intensity;
        const magnetY = (y - centerY) * 0.04 * intensity;

        if (magnetismAnimationRef.current) {
          magnetismAnimationRef.current.kill();
        }
        
        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.6,
          ease: 'power2.out'
        });
      }

      element.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
      element.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    };

    const handleClick = (e: MouseEvent) => {
      if (clickEffect) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(${glowColor}, 0.8) 0%, 
            rgba(${glowColor}, 0.4) 40%, 
            rgba(${glowColor}, 0.2) 60%,
            transparent 80%
          );
          left: ${x - 60}px;
          top: ${y - 60}px;
          pointer-events: none;
          z-index: 1000;
          mix-blend-mode: screen;
        `;

        element.appendChild(ripple);

        gsap.fromTo(
          ripple,
          {
            scale: 0,
            opacity: 1
          },
          {
            scale: 5,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => ripple.remove()
          }
        );
      }

      if (onCardClick) {
        onCardClick();
      }
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
  }, [disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onCardClick, animateParticles, clearAllParticles, intensity]);

  return (
    <motion.div
      ref={cardRef}
      className={`advanced-particle-card ${className}`}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
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
      width: ${spotlightRadius * 2}px;
      height: ${spotlightRadius * 2}px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.25) 0%,
        rgba(${glowColor}, 0.15) 15%,
        rgba(${glowColor}, 0.08) 25%,
        rgba(${glowColor}, 0.04) 40%,
        rgba(${glowColor}, 0.02) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      filter: blur(25px);
      transition: opacity 0.4s ease;
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
          duration: 0.4,
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
        duration: 0.15,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.9
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.9
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.25 : 0.6,
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
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.remove();
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}> = ({ children, gridRef, className = '' }) => (
  <motion.div
    className={`bento-section grid gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 max-w-7xl 2xl:max-w-[1800px] mx-auto select-none relative ${className}`}
    ref={gridRef}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// ========== МОДАЛЬНЫЕ ОКНА ==========

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}> = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/20 shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 text-white/60 hover:text-white"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const HelpExamplesModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  category: SupportCategory;
  examples: SupportExample[];
}> = ({ isOpen, onClose, category, examples }) => {
  const [selectedExample, setSelectedExample] = useState<SupportExample | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | SupportExample['difficulty']>('all');

  const filteredExamples = examples.filter(example => 
    example.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (difficultyFilter === 'all' || example.difficulty === difficultyFilter)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Примеры решений: ${category.title}`} size="xl">
      <div className="space-y-6">
        {!selectedExample ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Поиск примеров..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
              />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="all">Все сложности</option>
                <option value="easy">Легкие</option>
                <option value="medium">Средние</option>
                <option value="hard">Сложные</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExamples.map((example) => (
                <motion.div
                  key={example.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300"
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setSelectedExample(example)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-white text-sm flex-grow mr-3">
                      {example.title}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      example.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      example.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {example.difficulty === 'easy' ? 'Легко' : 
                       example.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs mb-3">{example.description}</p>
                  <div className="flex justify-between items-center text-xs text-white/40">
                    <span>{example.estimatedTime}</span>
                    <span>{example.steps.length} шагов</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredExamples.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-white font-semibold text-lg mb-2">Примеры не найдены</h3>
                <p className="text-white/60">Попробуйте изменить параметры поиска</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedExample(null)}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              ← Назад к списку
            </button>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">{selectedExample.title}</h3>
              <p className="text-white/60">{selectedExample.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-white/60">Сложность</div>
                  <div className={`font-semibold ${
                    selectedExample.difficulty === 'easy' ? 'text-green-400' :
                    selectedExample.difficulty === 'medium' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {selectedExample.difficulty === 'easy' ? 'Легко' : 
                     selectedExample.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-white/60">Время</div>
                  <div className="text-white font-semibold">{selectedExample.estimatedTime}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-white/60">Шагов</div>
                  <div className="text-white font-semibold">{selectedExample.steps.length}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold">Пошаговая инструкция:</h4>
                {selectedExample.steps.map((step, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-white/80 text-sm">{step}</p>
                  </motion.div>
                ))}
              </div>

              {selectedExample.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedExample.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 backdrop-blur-sm border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {(selectedExample.videoUrl || selectedExample.attachments) && (
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-white font-semibold mb-3">Дополнительные материалы</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExample.videoUrl && (
                      <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm transition-colors">
                        📹 Видеоинструкция
                      </button>
                    )}
                    {selectedExample.attachments?.map((attachment, index) => (
                      <button key={index} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-colors">
                        📎 {attachment}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

const KnowledgeBaseModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  articles: KnowledgeBaseArticle[];
}> = ({ isOpen, onClose, articles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);

  const categories = [...new Set(articles.map(article => article.category))];
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || article.category === selectedCategory)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📚 База знаний" size="xl">
      <div className="space-y-6">
        {!selectedArticle ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Поиск в базе знаний..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="all">Все категории</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300"
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white text-sm flex-grow mr-3">{article.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-white/40 flex-shrink-0">
                      <span>{article.readingTime}</span>
                      <span>•</span>
                      <span>{article.views} просмотров</span>
                    </div>
                  </div>
                  <p className="text-white/60 text-xs mb-3 line-clamp-2">{article.content}</p>
                  <div className="flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-white/40 text-xs">
                      {formatDate(article.lastUpdated)} • {article.author}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-white font-semibold text-lg mb-2">Статьи не найдены</h3>
                <p className="text-white/60">Попробуйте изменить параметры поиска</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
            >
              ← Назад к списку статей
            </button>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">{selectedArticle.title}</h3>
              
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <span>👤</span>
                  <span>{selectedArticle.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{formatDate(selectedArticle.lastUpdated)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{selectedArticle.readingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👁️</span>
                  <span>{selectedArticle.views} просмотров</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedArticle.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 leading-relaxed">{selectedArticle.content}</p>
              </div>

              {selectedArticle.relatedArticles.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-white font-semibold mb-4">Связанные статьи</h4>
                  <div className="space-y-2">
                    {articles
                      .filter(article => selectedArticle.relatedArticles.includes(article.id))
                      .map(article => (
                        <div
                          key={article.id}
                          className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                          onClick={() => setSelectedArticle(article)}
                        >
                          <div className="text-white text-sm font-medium">{article.title}</div>
                          <div className="text-white/60 text-xs mt-1">{article.readingTime}</div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

const SpecialistsModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  specialists: SupportSpecialist[];
}> = ({ isOpen, onClose, specialists }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('all');

  const expertiseOptions = [...new Set(specialists.flatMap(s => s.expertise))];
  
  const filteredSpecialists = specialists.filter(specialist => 
    specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (expertiseFilter === 'all' || specialist.expertise.includes(expertiseFilter))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="👥 Наши специалисты" size="lg">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Поиск специалистов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
          />
          <select
            value={expertiseFilter}
            onChange={(e) => setExpertiseFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">Все направления</option>
            {expertiseOptions.map(expertise => (
              <option key={expertise} value={expertise}>{expertise}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSpecialists.map((specialist) => (
            <motion.div
              key={specialist.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {specialist.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    specialist.isOnline ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white text-sm">{specialist.name}</h4>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <span>★</span>
                      <span>{specialist.rating}</span>
                    </div>
                  </div>
                  <p className="text-white/60 text-xs mb-2">{specialist.position}</p>
                  <p className="text-white/50 text-xs mb-2">Опыт: {specialist.experience}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {specialist.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {specialist.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-lg text-xs bg-blue-500/20 text-blue-400"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-white/40">
                    <span>{specialist.isOnline ? '🟢 Онлайн' : '⚫ Оффлайн'}</span>
                    <span>{specialist.currentChats} активных чатов</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSpecialists.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-white font-semibold text-lg mb-2">Специалисты не найдены</h3>
            <p className="text-white/60">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

// ========== ВИДЖЕТЫ ==========

function SupportCategoryCard({ category, onCardClick }: { category: SupportCategory; onCardClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const baseClassName = `card flex flex-col justify-between relative min-h-[200px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow`;

  const cardStyle = {
    backgroundColor: '#060010',
    borderColor: 'var(--border-color)',
    color: 'var(--white)',
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': '250px',
    '--glow-color': category.color
  } as React.CSSProperties;

  const content = (
    <motion.div 
      className="h-full flex flex-col cursor-pointer"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-grow">
          <motion.div 
            className="text-3xl"
            animate={{ scale: isHovered ? 1.3 : 1, rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {category.icon}
          </motion.div>
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-white text-lg mb-2 leading-tight">
              {category.title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-white/70 text-sm mb-2">Основные возможности:</div>
        <div className="flex flex-wrap gap-1">
          {category.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/80 backdrop-blur-sm border border-white/5"
            >
              {feature}
            </span>
          ))}
          {category.features.length > 3 && (
            <span className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/60 backdrop-blur-sm border border-white/5">
              +{category.features.length - 3} еще
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div className="text-center p-2 rounded-lg bg-white/5">
          <div className="text-white font-bold">{category.stats.responseTime}</div>
          <div className="text-white/60">Ответ</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-white/5">
          <div className="text-white font-bold">{category.stats.satisfaction}%</div>
          <div className="text-white/60">Довольных</div>
        </div>
      </div>

      <motion.button
        className="w-full py-3 px-4 rounded-xl font-medium text-white text-sm backdrop-blur-sm border transition-all duration-300 mt-auto"
        style={{
          backgroundColor: `rgba(${category.color}, 0.2)`,
          borderColor: `rgba(${category.color}, 0.3)`
        }}
        whileHover={{ 
          scale: 1.02,
          backgroundColor: `rgba(${category.color}, 0.3)`
        }}
        whileTap={{ scale: 0.98 }}
      >
        {category.actionText}
      </motion.button>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${category.color}, 0.4) 0%, transparent 50%)`
        }}
      />

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium text-xs shadow-lg"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              👁️ Подробнее
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <AdvancedParticleCard
      className={baseClassName}
      style={cardStyle}
      particleCount={12}
      glowColor={category.color}
      enableTilt={true}
      clickEffect={true}
      enableMagnetism={true}
      intensity={1.2}
      onCardClick={onCardClick}
    >
      {content}
    </AdvancedParticleCard>
  );
}

function FAQCard({ faq }: { faq: FAQItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <AdvancedParticleCard
      className="card flex flex-col relative w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.blue,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={COLORS.blue}
      intensity={1.1}
    >
      <div className="h-full flex flex-col relative z-10">
        <div 
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-white text-sm flex-grow mr-3 leading-tight">
              {faq.question}
            </h4>
            <motion.div 
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-white/60 flex-shrink-0"
            >
              ▼
            </motion.div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-white/40 mb-2">
            <span className="px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/5">
              {faq.category === 'help' ? 'Помощь' : faq.category === 'chat' ? 'Чат' : 'Телефон'}
            </span>
            <span>Популярность: {faq.popularity}%</span>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-3 border-t border-white/10">
                <p className="text-white/70 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${COLORS.blue}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function QuickActionCard({ action, onCardClick }: { action: { icon: string; label: string; color: string; description?: string }, onCardClick: () => void }) {
  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[120px] w-full max-w-full p-4 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': action.color,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={action.color}
      intensity={1.0}
      onCardClick={onCardClick}
    >
      <div className="h-full flex flex-col items-center justify-center text-center p-2 cursor-pointer">
        <div className="text-2xl mb-2">
          {action.icon}
        </div>
        <h3 className="text-white font-semibold text-sm mb-1 leading-tight">
          {action.label}
        </h3>
        {action.description && (
          <p className="text-white/60 text-xs leading-tight">
            {action.description}
          </p>
        )}
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${action.color}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function ExampleCard({ example }: { example: SupportExample }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return COLORS.success;
      case 'medium': return COLORS.warning;
      case 'hard': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  const difficultyColor = getDifficultyColor(example.difficulty);

  return (
    <AdvancedParticleCard
      className="card flex flex-col relative w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': difficultyColor,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={difficultyColor}
      intensity={1.1}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-white text-sm flex-grow mr-3 leading-tight">
            {example.title}
          </h4>
          <span 
            className="px-2 py-1 rounded-full text-xs backdrop-blur-sm border flex-shrink-0"
            style={{
              backgroundColor: `rgba(${difficultyColor}, 0.15)`,
              color: `rgb(${difficultyColor})`,
              borderColor: `rgba(${difficultyColor}, 0.3)`
            }}
          >
            {example.difficulty === 'easy' ? 'Легко' : 
             example.difficulty === 'medium' ? 'Средне' : 'Сложно'}
          </span>
        </div>
        
        <p className="text-white/60 text-xs mb-4 leading-relaxed">
          {example.description}
        </p>
        
        <div className="space-y-2 mb-4">
          {example.steps.slice(0, 3).map((step, index) => (
            <div key={index} className="flex items-start gap-2 text-white/70 text-xs">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] mt-0.5">
                {index + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
          {example.steps.length > 3 && (
            <div className="text-white/40 text-xs text-center">
              ... и еще {example.steps.length - 3} шагов
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center text-xs text-white/40">
          <span>Время: {example.estimatedTime}</span>
          <span>{example.steps.length} шагов</span>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${difficultyColor}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

// Компонент статуса системы
const SystemStatusWidget: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    // Имитация данных статуса системы
    setIncidents([
      {
        id: 1,
        title: 'Плановое техническое обслуживание',
        status: 'completed',
        date: new Date(Date.now() - 86400000),
        description: 'Обновление системы безопасности'
      },
      {
        id: 2,
        title: 'Повышенная нагрузка на серверы',
        status: 'monitoring',
        date: new Date(Date.now() - 3600000),
        description: 'Ведется мониторинг производительности'
      }
    ]);
  }, []);

  return (
    <AdvancedParticleCard
      className="p-4 sm:p-6 rounded-2xl border border-white/10"
      glowColor={systemStatus === 'operational' ? COLORS.success : systemStatus === 'degraded' ? COLORS.warning : COLORS.error}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Статус системы</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          systemStatus === 'operational' ? 'bg-green-500/20 text-green-400' :
          systemStatus === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {systemStatus === 'operational' ? 'Работает' : 
           systemStatus === 'degraded' ? 'Нарушения' : 'Сбой'}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Веб-сайт</span>
          <span className="text-green-400">✓ Работает</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">API</span>
          <span className="text-green-400">✓ Работает</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">База данных</span>
          <span className="text-green-400">✓ Работает</span>
        </div>
      </div>

      {incidents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h4 className="text-white/80 text-sm mb-2">Последние инциденты</h4>
          <div className="space-y-2">
            {incidents.map(incident => (
              <div key={incident.id} className="text-xs text-white/60">
                <div className="flex justify-between">
                  <span>{incident.title}</span>
                  <span>{formatRelativeTime(incident.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdvancedParticleCard>
  );
};

// Компонент тикетов поддержки
const SupportTicketsWidget: React.FC<{ tickets: SupportTicket[] }> = ({ tickets }) => {
  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return COLORS.blue;
      case 'in_progress': return COLORS.orange;
      case 'resolved': return COLORS.success;
      case 'closed': return COLORS.gray;
      default: return COLORS.gray;
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'low': return COLORS.gray;
      case 'medium': return COLORS.blue;
      case 'high': return COLORS.orange;
      case 'urgent': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  return (
    <AdvancedParticleCard
      className="p-4 sm:p-6 rounded-2xl border border-white/10"
      glowColor={COLORS.blue}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Мои обращения</h3>
        <span className="text-white/60 text-sm">{tickets.length} тикетов</span>
      </div>
      
      <div className="space-y-3">
        {tickets.slice(0, 3).map(ticket => (
          <motion.div
            key={ticket.id}
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-white text-sm font-medium flex-1 mr-2">{ticket.title}</h4>
              <div className="flex gap-1 flex-shrink-0">
                <span 
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `rgba(${getStatusColor(ticket.status)}, 0.15)`,
                    color: `rgb(${getStatusColor(ticket.status)})`,
                    border: `1px solid rgba(${getStatusColor(ticket.status)}, 0.3)`
                  }}
                >
                  {ticket.status === 'open' ? 'Открыт' : 
                   ticket.status === 'in_progress' ? 'В работе' :
                   ticket.status === 'resolved' ? 'Решен' : 'Закрыт'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-white/60">
              <span>Создан: {formatRelativeTime(ticket.createdAt)}</span>
              <span 
                className="px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `rgba(${getPriorityColor(ticket.priority)}, 0.15)`,
                  color: `rgb(${getPriorityColor(ticket.priority)})`,
                  border: `1px solid rgba(${getPriorityColor(ticket.priority)}, 0.3)`
                }}
              >
                {ticket.priority === 'low' ? 'Низкий' :
                 ticket.priority === 'medium' ? 'Средний' :
                 ticket.priority === 'high' ? 'Высокий' : 'Срочный'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {tickets.length > 3 && (
        <button className="w-full mt-4 py-2 text-white/60 hover:text-white transition-colors text-sm border border-white/10 hover:border-white/20 rounded-lg">
          Показать все обращения
        </button>
      )}
    </AdvancedParticleCard>
  );
};

// Компонент прогресса обучения
const LearningProgressWidget: React.FC = () => {
  const [progress, setProgress] = useState([
    { title: 'Основы системы', progress: 100, completed: true },
    { title: 'Расширенные функции', progress: 75, completed: false },
    { title: 'Интеграции API', progress: 30, completed: false },
    { title: 'Автоматизация', progress: 10, completed: false }
  ]);

  return (
    <AdvancedParticleCard
      className="p-4 sm:p-6 rounded-2xl border border-white/10"
      glowColor={COLORS.purple}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Прогресс обучения</h3>
        <span className="text-white/60 text-sm">
          {progress.filter(p => p.completed).length}/{progress.length} завершено
        </span>
      </div>
      
      <div className="space-y-4">
        {progress.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/80">{item.title}</span>
              <span className="text-white/60">{item.progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div 
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-400 rounded-xl font-medium transition-all duration-300">
        Продолжить обучение
      </button>
    </AdvancedParticleCard>
  );
};

// ========== ОСНОВНОЙ КОМПОНЕНТ ==========

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export default function SupportPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('help');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [modalState, setModalState] = useState({
    helpExamples: false,
    knowledgeBase: false,
    specialists: false,
    newTicket: false
  });

  const stats = useMemo(() => ({
    totalSolutions: 156,
    averageResponseTime: '2.3 минуты',
    satisfactionRate: 96,
    activeSupport: 12,
    resolvedToday: 47,
    totalArticles: knowledgeBaseArticles.length,
    onlineSpecialists: supportSpecialists.filter(s => s.isOnline).length,
    activeTickets: 3,
    avgResolutionTime: '4.2 часа'
  }), []);

  const currentCategory = supportCategories.find(cat => cat.id === activeCategory);
  const categoryExamples = currentCategory?.examples || [];

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

  useEffect(() => {
    // Имитация начальных сообщений чата
    setChatMessages([
      {
        id: '1',
        type: 'support',
        content: 'Здравствуйте! Чем могу помочь?',
        timestamp: new Date(Date.now() - 300000),
        sender: 'Поддержка'
      }
    ]);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Имитация ответа поддержки
    setTimeout(() => {
      const supportMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'support',
        content: 'Спасибо за обращение! Я уже изучаю ваш вопрос и скоро предоставлю решение.',
        timestamp: new Date(),
        sender: 'Поддержка'
      };
      setChatMessages(prev => [...prev, supportMessage]);
    }, 2000);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setModalState(prev => ({ ...prev, helpExamples: true }));
  };

  const handleQuickActionClick = (actionLabel: string) => {
    switch (actionLabel) {
      case 'База знаний':
        setModalState(prev => ({ ...prev, knowledgeBase: true }));
        break;
      case 'Сообщить о проблеме':
        setModalState(prev => ({ ...prev, newTicket: true }));
        break;
      case 'Статус системы':
        // Открыть статус системы
        break;
      default:
        break;
    }
  };

  const closeModal = (modalName: keyof typeof modalState) => {
    setModalState(prev => ({ ...prev, [modalName]: false }));
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
          background: 
            radial-gradient(ellipse at var(--glow-x) var(--glow-y), 
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.4)) 0%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.2)) 25%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.08)) 50%,
              transparent 70%
            ),
            linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
        }
        
        .card--border-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.9)) 0%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.5)) 30%,
              transparent 60%);
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          pointer-events: none;
          z-index: 1;
        }
        
        .global-spotlight {
          mix-blend-mode: screen;
          pointer-events: none;
        }
        
        .advanced-particle {
          filter: blur(1px);
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <GlobalSpotlight
        gridRef={gridRef}
        disableAnimations={shouldDisableAnimations}
        enabled={true}
        spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
        glowColor={DEFAULT_GLOW_COLOR}
      />

      {/* Модальные окна */}
      <AnimatePresence>
        {modalState.helpExamples && currentCategory && (
          <HelpExamplesModal 
            isOpen={modalState.helpExamples} 
            onClose={() => closeModal('helpExamples')} 
            category={currentCategory}
            examples={categoryExamples}
          />
        )}
        
        {modalState.knowledgeBase && (
          <KnowledgeBaseModal 
            isOpen={modalState.knowledgeBase} 
            onClose={() => closeModal('knowledgeBase')} 
            articles={knowledgeBaseArticles}
          />
        )}
        
        {modalState.specialists && (
          <SpecialistsModal 
            isOpen={modalState.specialists} 
            onClose={() => closeModal('specialists')} 
            specialists={supportSpecialists}
          />
        )}
      </AnimatePresence>

      <main className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Основная статистика */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <motion.h1 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-2xl sm:text-3xl lg:text-4xl">🛟</span>
                  <span>Центр поддержки</span>
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Получите помощь и консультации по работе с системой • Быстрое решение вопросов
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{stats.activeSupport} специалистов онлайн</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Среднее время ответа: {stats.averageResponseTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{stats.satisfactionRate}% удовлетворенность</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-xl sm:text-2xl bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                  {stats.resolvedToday}
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Решено сегодня</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сейчас</div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-green-400 font-bold text-base sm:text-xl">{stats.totalSolutions}</div>
                <div className="text-white/60 text-xs">Решений в базе</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold text-base sm:text-xl">{stats.totalArticles}</div>
                <div className="text-white/60 text-xs">Статей в базе знаний</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold text-base sm:text-xl">{stats.onlineSpecialists}</div>
                <div className="text-white/60 text-xs">Специалистов онлайн</div>
              </div>
              <div className="text-center">
                <div className="text-cyan-400 font-bold text-base sm:text-xl">{stats.satisfactionRate}%</div>
                <div className="text-white/60 text-xs">Удовлетворенность</div>
              </div>
            </motion.div>
            
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 rounded-full blur-xl" />
          </div>
        </motion.section>

        {/* Основной контент с новой структурой */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8">
          {/* Основная колонка */}
          <div className="xl:col-span-3 space-y-6 sm:space-y-8">
            {/* Способы получения помощи */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Способы получения помощи</h2>
              <BentoCardGrid gridRef={gridRef} className="mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {supportCategories.map((category) => (
                    <SupportCategoryCard 
                      key={category.id} 
                      category={category} 
                      onCardClick={() => handleCategoryClick(category.id)} 
                    />
                  ))}
                </div>
              </BentoCardGrid>
            </motion.section>

            {/* Демо примеры и FAQ */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Демо примеры */}
                <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">💡</div>
                      <h2 className="text-xl font-bold text-white">
                        Демо примеры: {currentCategory?.title}
                      </h2>
                    </div>
                    <motion.button
                      onClick={() => setModalState(prev => ({ ...prev, helpExamples: true }))}
                      className="text-white/60 hover:text-white transition-colors text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      Все примеры →
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {categoryExamples.slice(0, 2).map((example) => (
                      <ExampleCard key={example.id} example={example} />
                    ))}
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">❓</div>
                      <h2 className="text-xl font-bold text-white">Частые вопросы</h2>
                    </div>
                    <span className="text-white/40 text-sm">{faqItems.length} вопросов</span>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {faqItems.slice(0, 3).map((faq) => (
                      <FAQCard key={faq.id} faq={faq} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Онлайн-чат демо */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💬</div>
                    <h2 className="text-xl font-bold text-white">Демо онлайн-чата</h2>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>Онлайн</span>
                  </div>
                </div>
                
                <div className="bg-black/40 rounded-2xl border border-white/10 p-4 sm:p-6 h-96 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chatMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md rounded-2xl p-3 sm:p-4 ${
                            message.type === 'user'
                              ? 'bg-blue-500/20 border border-blue-500/30'
                              : 'bg-white/10 border border-white/10'
                          }`}
                        >
                          {message.sender && (
                            <div className="text-xs text-white/60 mb-1">{message.sender}</div>
                          )}
                          <div className="text-white text-sm">{message.content}</div>
                          <div className="text-xs text-white/40 mt-1 text-right">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Введите ваш вопрос..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 rounded-xl font-medium transition-colors duration-300"
                    >
                      Ввод
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6 sm:space-y-8">
            {/* Быстрые действия */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="text-2xl">⚡</div>
                  <h2 className="text-xl font-bold text-white">Быстрые действия</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {quickActions.map((action, index) => (
                    <QuickActionCard 
                      key={index} 
                      action={action} 
                      onCardClick={() => handleQuickActionClick(action.label)}
                    />
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Статус системы */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SystemStatusWidget />
            </motion.section>

            {/* Мои обращения */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SupportTicketsWidget tickets={supportTickets} />
            </motion.section>

            {/* Прогресс обучения */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <LearningProgressWidget />
            </motion.section>

            {/* Специалисты онлайн */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">👥</div>
                    <h2 className="text-xl font-bold text-white">Специалисты онлайн</h2>
                  </div>
                  <motion.button
                    onClick={() => setModalState(prev => ({ ...prev, specialists: true }))}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    Все →
                  </motion.button>
                </div>
                
                <div className="space-y-3">
                  {supportSpecialists.filter(s => s.isOnline).slice(0, 3).map((specialist) => (
                    <motion.div
                      key={specialist.id}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer"
                      whileHover={{ y: -2 }}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {specialist.avatar}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-400 border border-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{specialist.name}</h4>
                          <div className="flex items-center gap-1 text-yellow-400 text-xs">
                            <span>★</span>
                            <span>{specialist.rating}</span>
                          </div>
                        </div>
                        <p className="text-white/60 text-xs">{specialist.position}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}