/**
 * Конфигурация отраслевых решений для демо-витрины
 * Включает метаданные для SEO, структурированные данные и контент для UI
 */

// ============================================================================
// TYPES
// ============================================================================

/** Метаданные для поисковых систем */
interface IndustrySEO {
  /** Мета-описание для страницы */
  readonly metaDescription: string;
  /** Ключевые слова для SEO */
  readonly keywords: readonly string[];
  /** Open Graph данные */
  readonly openGraph: {
    readonly title: string;
    readonly description: string;
    readonly image: string;
  };
}

/** Технологии и инструменты */
interface TechStack {
  readonly frontend: readonly string[];
  readonly backend: readonly string[];
  readonly mobile: readonly string[];
  readonly devops: readonly string[];
  readonly integrations: readonly string[];
}

/** Детали реализации */
interface ImplementationDetails {
  readonly timeline: {
    readonly discovery: string;
    readonly development: string;
    readonly testing: string;
    readonly launch: string;
  };
  readonly team: {
    readonly roles: readonly string[];
    readonly size: string;
  };
  readonly methodology: string;
}

/** Демо-доступ */
interface DemoAccess {
  readonly type: 'live' | 'video' | 'screenshots';
  readonly url?: string;
  readonly credentials?: {
    readonly login: string;
    readonly password: string;
  };
}

/** Основной интерфейс отрасли */
export interface Industry {
  // Базовые данные
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly tags: readonly string[];
  readonly href: string;
  
  // Визуальное представление
  readonly gradient: {
    readonly from: string;
    readonly to: string;
  };
  
  // Бизнес-метрики
  readonly metrics: readonly {
    readonly value: number;
    readonly suffix: string;
    readonly label: string;
    readonly description: string;
  }[];
  
  // Функциональность
  readonly features: readonly {
    readonly title: string;
    readonly description: string;
    readonly icon: string;
  }[];
  
  // Технологический стек
  readonly techStack: TechStack;
  
  // Кейс внедрения
  readonly caseStudy: {
    readonly client: string;
    readonly duration: string;
    readonly budget: string;
    readonly problem: string;
    readonly solution: string;
    readonly results: readonly {
      readonly metric: string;
      readonly value: string;
      readonly improvement: string;
    }[];
  };
  
  // Детали реализации
  readonly implementation: ImplementationDetails;
  
  // Демо-доступ
  readonly demo: DemoAccess;
  
  // SEO оптимизация
  readonly seo: IndustrySEO;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Конфигурация отраслевых решений */
export const industries: readonly Industry[] = [
  {
    id: 'medicine',
    title: 'Медицина',
    description: 'Комплексная цифровая трансформация медицинских учреждений с полной автоматизацией рабочих процессов и интеграцией медицинского оборудования',
    icon: '🏥',
    tags: ['Веб-платформа', 'Мобильное приложение', 'Интеграции', 'Безопасность', 'HL7/FHIR'],
    href: '/demo/medicine',
    
    gradient: {
      from: 'from-blue-500',
      to: 'to-cyan-500'
    },
    
    metrics: [
      { 
        value: 40, 
        suffix: '%', 
        label: 'Снижение нагрузки', 
        description: 'Автоматизация рутинных операций медицинского персонала' 
      },
      { 
        value: 85, 
        suffix: '%', 
        label: 'Онлайн-записей', 
        description: 'Пациенты записываются через мобильное приложение' 
      },
      { 
        value: 99.7, 
        suffix: '%', 
        label: 'Доступность', 
        description: 'Гарантированная доступность медицинской системы' 
      },
      { 
        value: 60, 
        suffix: '%', 
        label: 'Экономия времени', 
        description: 'Сокращение времени на административные задачи' 
      }
    ],
    
    features: [
      {
        title: 'Электронная медицинская карта',
        description: 'Полная цифровизация истории болезней с поддержкой HL7/FHIR стандартов',
        icon: '📋'
      },
      {
        title: 'Телемедицинские консультации',
        description: 'Видеоконсультации с интеграцией медицинских устройств',
        icon: '🎥'
      },
      {
        title: 'Интеграция с лабораториями',
        description: 'Автоматическая загрузка результатов анализов и диагностики',
        icon: '🔬'
      },
      {
        title: 'Умное расписание',
        description: 'AI-оптимизация расписания врачей и ресурсов клиники',
        icon: '⏰'
      },
      {
        title: 'Мобильное приложение',
        description: 'Полный функционал для пациентов: запись, чат, результаты',
        icon: '📱'
      },
      {
        title: 'Аналитика и отчетность',
        description: 'Dashboard с KPI и автоматической генерацией отчетов для Минздрава',
        icon: '📊'
      }
    ],
    
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      backend: ['Node.js', 'NestJS', 'PostgreSQL', 'Redis'],
      mobile: ['React Native', 'Expo', 'iOS/Android'],
      devops: ['Docker', 'Kubernetes', 'AWS', 'GitLab CI/CD'],
      integrations: ['HL7 FHIR', 'DICOM', '1C:Медицина', 'ГИС Здравоохранение']
    },
    
    caseStudy: {
      client: 'Сеть многопрофильных клиник "Медикал Групп"',
      duration: '6 месяцев',
      budget: 'от 2.5 млн ₽',
      problem: 'Ручная обработка 500+ ежедневных записей, 20% ошибок в расписании, потеря медицинских карт, отсутствие единой системы телемедицины',
      solution: 'Разработка единой цифровой платформы с онлайн-записью, телемедициной и интеграцией с существующими медицинскими системами',
      results: [
        { metric: 'Время записи', value: '2 минуты', improvement: '↓ 85%' },
        { metric: 'Точность расписания', value: '99.9%', improvement: '↑ 79.9%' },
        { metric: 'Доступность данных', value: '100%', improvement: '↑ 100%' },
        { metric: 'Удовлетворенность пациентов', value: '4.8/5', improvement: '↑ 1.2 пункта' }
      ]
    },
    
    implementation: {
      timeline: {
        discovery: '2 недели - анализ процессов и проектирование архитектуры',
        development: '4 месяца - итеративная разработка с weekly демо',
        testing: '3 недели - тестирование безопасности и нагрузочные тесты',
        launch: '2 недели - пилотное внедрение и обучение персонала'
      },
      team: {
        roles: ['Project Manager', 'UI/UX Designer', 'Frontend (2)', 'Backend (2)', 'Mobile', 'QA', 'DevOps'],
        size: '8 специалистов'
      },
      methodology: 'Гибкая методология (Scrum) с двухнедельными спринтами'
    },
    
    demo: {
      type: 'live',
      url: 'https://demo-medicine.onestack24.ru',
      credentials: {
        login: 'demo@onestack24.ru',
        password: 'Demo2024!'
      }
    },
    
    seo: {
      metaDescription: 'Цифровая трансформация медицинских учреждений. Электронная медкарта, телемедицина, онлайн-запись. Внедрение за 6 месяцев.',
      keywords: ['медицинская система', 'телемедицина', 'электронная карта', 'запись к врачу', 'медицинский софт'],
      openGraph: {
        title: 'Медицинская платформа - Цифровизация здравоохранения',
        description: 'Комплексное решение для автоматизации медицинских учреждений',
        image: '/demo/og/medicine.jpg'
      }
    }
  },
  
  {
    id: 'logistics',
    title: 'Логистика и Склад',
    description: 'Интеллектуальная система управления логистическими цепочками и складскими операциями с AI-оптимизацией маршрутов и прогнозированием спроса',
    icon: '🚚',
    tags: ['WMS', 'TMS', 'AI-аналитика', 'Мобильное ТСД', 'Интеграции'],
    href: '/demo/logistics',
    
    gradient: {
      from: 'from-orange-500',
      to: 'to-red-500'
    },
    
    metrics: [
      { 
        value: 25, 
        suffix: '%', 
        label: 'Оптимизация маршрутов', 
        description: 'AI-алгоритмы построения оптимальных маршрутов доставки' 
      },
      { 
        value: 99.5, 
        suffix: '%', 
        label: 'Точность инвентаризации', 
        description: 'Автоматический учет с помощью мобильных ТСД' 
      },
      { 
        value: 45, 
        suffix: '%', 
        label: 'Снижение простоев', 
        description: 'Оптимизация процессов погрузки/разгрузки' 
      },
      { 
        value: 30, 
        suffix: '%', 
        label: 'Экономия топлива', 
        description: 'Умные маршруты и контроль стиля вождения' 
      }
    ],
    
    features: [
      {
        title: 'Трекинг в реальном времени',
        description: 'GPS-мониторинг транспорта с прогнозированием времени доставки',
        icon: '📍'
      },
      {
        title: 'WMS система',
        description: 'Полный контроль складских операций: приемка, размещение, отбор, инвентаризация',
        icon: '🏭'
      },
      {
        title: 'TMS система',
        description: 'Управление перевозками: планирование, диспетчеризация, контроль исполнения',
        icon: '📦'
      },
      {
        title: 'Мобильное ТСД',
        description: 'Терминалы сбора данных для складских работников и водителей',
        icon: '📱'
      },
      {
        title: 'AI-аналитика',
        description: 'Прогнозирование спроса, оптимизация запасов, выявление аномалий',
        icon: '🤖'
      },
      {
        title: 'Интеграция с 1С/ERP',
        description: 'Автоматический обмен данными с учетными системами',
        icon: '🔗'
      }
    ],
    
    techStack: {
      frontend: ['Vue 3', 'TypeScript', 'Pinia', 'Leaflet Maps'],
      backend: ['Python', 'FastAPI', 'PostgreSQL', 'Celery', 'Redis'],
      mobile: ['Flutter', 'Dart', 'Android/iOS'],
      devops: ['Docker Swarm', 'Prometheus', 'Grafana', 'ELK Stack'],
      integrations: ['1C', 'SAP', 'ГИС МТ', 'Таксометр', 'API карт']
    },
    
    caseStudy: {
      client: 'Логистическая компания "ТрансЛогист"',
      duration: '5 месяцев',
      budget: 'от 1.8 млн ₽',
      problem: 'Ручной ввод 200+ накладных ежедневно, отсутствие реального трекинга, 15% ошибок в инвентаризации, простои транспорта 40% времени',
      solution: 'Внедрение автоматизированной системы WMS/TMS с мобильными ТСД, GPS-трекингом и AI-оптимизацией маршрутов',
      results: [
        { metric: 'Точность учета', value: '99.5%', improvement: '↑ 84.5%' },
        { metric: 'Время обработки заказа', value: '15 минут', improvement: '↓ 70%' },
        { metric: 'Простои транспорта', value: '15%', improvement: '↓ 25%' },
        { metric: 'ROI системы', value: '187%', improvement: 'за 8 месяцев' }
      ]
    },
    
    implementation: {
      timeline: {
        discovery: '3 недели - анализ логистических процессов и интеграций',
        development: '3.5 месяца - модульная разработка с поэтапным внедрением',
        testing: '1 месяц - тестирование на реальных данных и нагрузочные тесты',
        launch: '2 недели - обучение персонала и переходный период'
      },
      team: {
        roles: ['Project Manager', 'Business Analyst', 'Backend (3)', 'Frontend', 'Mobile', 'QA (2)', 'DevOps'],
        size: '9 специалистов'
      },
      methodology: 'Гибкая разработка с элементами Kanban для оперативных изменений'
    },
    
    demo: {
      type: 'live',
      url: 'https://demo-logistics.onestack24.ru',
      credentials: {
        login: 'logistics@onestack24.ru',
        password: 'Demo2024!'
      }
    },
    
    seo: {
      metaDescription: 'WMS/TMS системы для логистики. AI-оптимизация маршрутов, мобильные ТСД, интеграция с 1С. Внедрение за 5 месяцев.',
      keywords: ['WMS система', 'TMS система', 'логистический софт', 'управление складом', 'трекинг транспорта'],
      openGraph: {
        title: 'Логистическая платформа - AI-оптимизация перевозок',
        description: 'Комплексное решение для автоматизации логистики и складских операций',
        image: '/demo/og/logistics.jpg'
      }
    }
  },

  // Остальные отрасли с аналогичной детализацией...
  {
    id: 'social',
    title: 'Социальные услуги',
    description: 'Цифровая платформа для координации социальной помощи, управления волонтерами и автоматизации социальных служб',
    icon: '👥',
    tags: ['Веб-платформа', 'Мобильное приложение', 'Геолокация', 'Чат', 'Аналитика'],
    href: '/demo/social',
    
    gradient: {
      from: 'from-green-500',
      to: 'to-emerald-500'
    },
    
    metrics: [
      { 
        value: 3, 
        suffix: 'x', 
        label: 'Рост волонтеров', 
        description: 'Увеличение количества активных волонтеров за 6 месяцев' 
      },
      { 
        value: 60, 
        suffix: '%', 
        label: 'Скорость обработки', 
        description: 'Сокращение времени обработки заявок на помощь' 
      },
      { 
        value: 95, 
        suffix: '%', 
        label: 'Удовлетворенность', 
        description: 'Уровень удовлетворенности получателей помощи' 
      }
    ],
    
    features: [
      {
        title: 'Система заявок',
        description: 'Централизованный прием и распределение заявок на социальную помощь',
        icon: '📝'
      },
      {
        title: 'Геолокация волонтеров',
        description: 'Real-time отслеживание местоположения и автоматическая диспетчеризация',
        icon: '🗺️'
      },
      {
        title: 'Встроенный мессенджер',
        description: 'Безопасная коммуникация между волонтерами и координаторами',
        icon: '💬'
      },
      {
        title: 'Автоматическая маршрутизация',
        description: 'AI-алгоритмы построения оптимальных маршрутов помощи',
        icon: '🔄'
      },
      {
        title: 'Отчетность и аналитика',
        description: 'Автоматическая генерация отчетов и анализ эффективности помощи',
        icon: '📊'
      },
      {
        title: 'Мобильное приложение',
        description: 'Полный функционал для волонтеров: задачи, навигация, отчеты',
        icon: '📱'
      }
    ],
    
    techStack: {
      frontend: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Mapbox GL'],
      backend: ['Node.js', 'Express', 'MongoDB', 'Socket.io'],
      mobile: ['React Native', 'Expo', 'iOS/Android'],
      devops: ['Docker', 'AWS', 'GitHub Actions'],
      integrations: ['2GIS API', 'СМС-шлюзы', 'Почта России', 'Соц. службы']
    },
    
    caseStudy: {
      client: 'Благотворительный фонд "Помощь рядом"',
      duration: '4 месяца',
      budget: 'от 1.2 млн ₽',
      problem: 'Неэффективная координация между 50+ волонтерами, потеря 30% заявок, ручное ведение отчетности, отсутствие аналитики эффективности',
      solution: 'Разработка централизованной платформы с геолокацией, автоматической диспетчеризацией и встроенной аналитикой',
      results: [
        { metric: 'Время ответа на заявки', value: '30 минут', improvement: '↓ 87.5%' },
        { metric: 'Охват помощи', value: '3x больше', improvement: '↑ 200%' },
        { metric: 'Потери заявок', value: '0%', improvement: '↓ 100%' },
        { metric: 'Эффективность волонтеров', value: '2.5x', improvement: '↑ 150%' }
      ]
    },
    
    implementation: {
      timeline: {
        discovery: '2 недели - исследование процессов и интервью с волонтерами',
        development: '3 месяца - итеративная разработка с weekly демо',
        testing: '2 недели - тестирование usability и производительности',
        launch: '1 неделя - обучение координаторов и волонтеров'
      },
      team: {
        roles: ['Project Manager', 'UI/UX Designer', 'Fullstack (2)', 'Mobile', 'QA'],
        size: '6 специалистов'
      },
      methodology: 'Design Thinking + Agile с фокусом на пользовательский опыт'
    },
    
    demo: {
      type: 'live',
      url: 'https://demo-social.onestack24.ru',
      credentials: {
        login: 'social@onestack24.ru',
        password: 'Demo2024!'
      }
    },
    
    seo: {
      metaDescription: 'Платформа для социальных служб и волонтерских организаций. Геолокация, автоматическая диспетчеризация, аналитика. Внедрение за 4 месяца.',
      keywords: ['социальная платформа', 'волонтерство', 'координация помощи', 'социальные услуги', 'благотворительность'],
      openGraph: {
        title: 'Социальная платформа - Автоматизация помощи',
        description: 'Цифровое решение для координации социальной помощи и волонтерской деятельности',
        image: '/demo/og/social.jpg'
      }
    }
  }
] as const;

// ============================================================================
// UTILITIES
// ============================================================================

/** Тип для ID отрасли */
export type IndustryId = typeof industries[number]['id'];

/** Получить отрасль по ID */
export const getIndustryById = (id: IndustryId): Industry | undefined => {
  return industries.find(industry => industry.id === id);
};

/** Получить все теги для фильтрации */
export const getAllTags = (): string[] => {
  const tags = industries.flatMap(industry => industry.tags);
  return Array.from(new Set(tags)).sort();
};

/** Фильтрация отраслей по тегам */
export const filterIndustriesByTags = (selectedTags: string[]): readonly Industry[] => {
  if (selectedTags.length === 0) return industries;
  
  return industries.filter(industry =>
    selectedTags.every(tag => industry.tags.includes(tag))
  );
};

/** Генерация JSON-LD структурированных данных */
export const generateIndustryStructuredData = (industry: Industry) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: industry.title,
    description: industry.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web-based, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB'
    },
    author: {
      '@type': 'Organization',
      name: 'OneStack',
      url: 'https://onestack24.ru'
    }
  };
};

/** Конфигурация для фильтров */
export const FILTER_CONFIG = {
  tags: getAllTags(),
  complexity: ['Базовый', 'Стандартный', 'Продвинутый'] as const,
  timeline: ['1-3 месяца', '3-6 месяцев', '6+ месяцев'] as const
} as const;