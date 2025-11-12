import { Industry, IndustryId, industries } from '../config/industries';

/**
 * Утилиты для работы с отраслевыми решениями
 */

// ============================================================================
// BUSINESS CALCULATIONS
// ============================================================================

/** Рассчитать общий ROI для отрасли */
export const calculateROI = (industry: Industry): number => {
  const economicMetrics = industry.metrics.filter(metric => 
    metric.label.includes('Экономия') || 
    metric.label.includes('Рост') || 
    metric.label.includes('Снижение')
  );
  
  const totalImprovement = economicMetrics.reduce((sum, metric) => {
    let value = metric.value;
    // Нормализуем метрики роста (умножаем на коэффициент)
    if (metric.suffix === 'x' || metric.label.includes('Рост')) {
      value = (value - 1) * 100; // Конвертируем рост в проценты
    }
    return sum + value;
  }, 0);
  
  return Math.round(totalImprovement * 1.2); // Улучшенный расчет с коэффициентом
};

/** Рассчитать примерную стоимость проекта */
export const estimateProjectCost = (industry: Industry): { min: number; max: number; average: number } => {
  const baseHours = industry.implementation.timeline.development.includes('месяц') ? 
    parseInt(industry.implementation.timeline.development) * 160 : 800; // Примерные часы
  
  const hourlyRate = 2500; // Средняя ставка ₽/час
  const baseCost = baseHours * hourlyRate;
  
  return {
    min: Math.round(baseCost * 0.8),
    max: Math.round(baseCost * 1.3),
    average: Math.round(baseCost)
  };
};

/** Получить ключевые бизнес-преимущества */
export const getBusinessBenefits = (industry: Industry): Array<{ benefit: string; impact: string }> => {
  return industry.metrics.map(metric => ({
    benefit: metric.label,
    impact: `${metric.value}${metric.suffix} - ${metric.description}`
  }));
};

// ============================================================================
// TEAM & IMPLEMENTATION
// ============================================================================

/** Получить рекомендуемую команду для проекта */
export const getRecommendedTeam = (industry: Industry) => {
  return industry.implementation.team;
};

/** Рассчитать оптимальный размер команды */
export const calculateTeamSize = (industry: Industry): string => {
  const complexity = industry.tags.length + industry.features.length;
  if (complexity > 15) return '8-10 специалистов';
  if (complexity > 10) return '6-8 специалистов';
  return '4-6 специалистов';
};

/** Генерация временной шкалы проекта */
export const generateTimeline = (industry: Industry) => {
  return Object.entries(industry.implementation.timeline).map(([phase, description]) => ({
    phase: mapPhaseName(phase),
    description,
    duration: extractDuration(description),
    icon: getPhaseIcon(phase)
  }));
};

/** Получить рекомендуемую методологию */
export const getRecommendedMethodology = (industry: Industry): string => {
  return industry.implementation.methodology;
};

// ============================================================================
// TECHNOLOGY STACK
// ============================================================================

/** Получить технологии для отображения в UI */
export const getTechStackForDisplay = (industry: Industry) => {
  return Object.entries(industry.techStack).flatMap(([category, technologies]) =>
    technologies.map(tech => ({ 
      category: mapTechCategory(category), 
      tech,
      categoryIcon: getTechCategoryIcon(category)
    }))
  );
};

/** Получить основные технологии (для превью) */
export const getMainTechnologies = (industry: Industry, count: number = 4): string[] => {
  const allTech = [
    ...industry.techStack.frontend,
    ...industry.techStack.backend,
    ...industry.techStack.mobile
  ];
  return allTech.slice(0, count);
};

/** Проверить наличие конкретной технологии */
export const hasTechnology = (industry: Industry, technology: string): boolean => {
  const allTech = Object.values(industry.techStack).flat();
  return allTech.some(tech => 
    tech.toLowerCase().includes(technology.toLowerCase())
  );
};

/** Получить технологии по категории */
export const getTechnologiesByCategory = (
  industry: Industry, 
  category: keyof Industry['techStack']
): string[] => {
  return industry.techStack[category];
};

// ============================================================================
// VALIDATION & SEO
// ============================================================================

/** Валидация данных отрасли */
export const validateIndustry = (industry: Industry): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const requiredFields = [
    'id', 'title', 'description', 'icon', 'tags', 'href',
    'metrics', 'features', 'techStack', 'caseStudy', 'implementation'
  ] as const;

  requiredFields.forEach(field => {
    if (industry[field] === undefined || industry[field] === null) {
      errors.push(`Missing required field: ${field}`);
    } else if (Array.isArray(industry[field]) && (industry[field] as any[]).length === 0) {
      errors.push(`Empty array in field: ${field}`);
    }
  });

  // Проверка структуры techStack
  const techStackCategories = ['frontend', 'backend', 'mobile', 'devops', 'integrations'] as const;
  techStackCategories.forEach(category => {
    if (!industry.techStack[category] || !Array.isArray(industry.techStack[category])) {
      errors.push(`Invalid techStack category: ${category}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/** Генерация метаданных для страницы */
export const generateMetaData = (industry: Industry) => {
  return {
    title: `${industry.title} - Отраслевое решение | OneStack`,
    description: industry.seo.metaDescription,
    keywords: industry.seo.keywords.join(', '),
    openGraph: {
      ...industry.seo.openGraph,
      type: 'website',
      siteName: 'OneStack'
    }
  };
};

/** Генерация JSON-LD структурированных данных */
export const generateStructuredData = (industry: Industry) => {
  const costEstimate = estimateProjectCost(industry);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: industry.title,
    description: industry.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web-based, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: costEstimate.average.toString(),
      priceCurrency: 'RUB',
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    author: {
      '@type': 'Organization',
      name: 'OneStack',
      url: 'https://onestack24.ru'
    },
    timeRequired: `PT${Math.round(estimateProjectCost(industry).average / 2500)}H`, // Примерное время в часах
    featureList: industry.features.map(f => f.title)
  };
};

// ============================================================================
// FILTERING & SEARCH
// ============================================================================

/** Фильтрация отраслей по тегам */
export const filterIndustriesByTags = (selectedTags: string[]): Industry[] => {
  if (selectedTags.length === 0) return [...industries];
  
  return industries.filter(industry =>
    selectedTags.some(tag => industry.tags.includes(tag))
  );
};

/** Поиск отраслей по ключевым словам */
export const searchIndustries = (query: string): Industry[] => {
  const lowercaseQuery = query.toLowerCase();
  
  return industries.filter(industry =>
    industry.title.toLowerCase().includes(lowercaseQuery) ||
    industry.description.toLowerCase().includes(lowercaseQuery) ||
    industry.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    industry.features.some(feature => 
      feature.title.toLowerCase().includes(lowercaseQuery) ||
      feature.description.toLowerCase().includes(lowercaseQuery)
    )
  );
};

/** Получить все уникальные теги */
export const getAllUniqueTags = (): string[] => {
  const allTags = industries.flatMap(industry => industry.tags);
  return Array.from(new Set(allTags)).sort();
};

/** Получить отрасли по сложности */
export const getIndustriesByComplexity = (level: 'low' | 'medium' | 'high'): Industry[] => {
  return industries.filter(industry => {
    const featureCount = industry.features.length;
    const techCount = Object.values(industry.techStack).flat().length;
    const totalComplexity = featureCount + techCount;
    
    switch (level) {
      case 'low': return totalComplexity < 15;
      case 'medium': return totalComplexity >= 15 && totalComplexity < 25;
      case 'high': return totalComplexity >= 25;
      default: return true;
    }
  });
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const mapPhaseName = (phase: string): string => {
  const phaseMap: Record<string, string> = {
    discovery: 'Анализ и проектирование',
    development: 'Разработка',
    testing: 'Тестирование',
    launch: 'Запуск и внедрение'
  };
  return phaseMap[phase] || phase;
};

const extractDuration = (description: string): string => {
  const match = description.match(/(\d+)\s*(недел[ьи]|месяц[аев]?|дн[ейя])/i);
  return match ? match[0] : '1-2 недели';
};

const getPhaseIcon = (phase: string): string => {
  const iconMap: Record<string, string> = {
    discovery: '🔍',
    development: '⚙️',
    testing: '🧪',
    launch: '🚀'
  };
  return iconMap[phase] || '📋';
};

const mapTechCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    mobile: 'Mobile',
    devops: 'DevOps',
    integrations: 'Интеграции'
  };
  return categoryMap[category] || category;
};

const getTechCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    frontend: '🎨',
    backend: '⚙️',
    mobile: '📱',
    devops: '🐳',
    integrations: '🔗'
  };
  return iconMap[category] || '💻';
};

/** Получить отрасль по ID */
export const getIndustryById = (id: IndustryId): Industry | undefined => {
  return industries.find(industry => industry.id === id);
};

/** Получить связанные отрасли */
export const getRelatedIndustries = (currentIndustry: Industry, limit: number = 3): Industry[] => {
  return industries
    .filter(industry => 
      industry.id !== currentIndustry.id && 
      industry.tags.some(tag => currentIndustry.tags.includes(tag))
    )
    .slice(0, limit);
};

/** Рассчитать рейтинг сложности (1-5) */
export const calculateComplexityRating = (industry: Industry): number => {
  const factors = [
    industry.features.length / 10, // Количество фич
    Object.values(industry.techStack).flat().length / 15, // Размер техстека
    industry.tags.length / 5, // Количество тегов
    industry.metrics.length / 3 // Количество метрик
  ];
  
  const average = factors.reduce((sum, factor) => sum + Math.min(factor, 1), 0) / factors.length;
  return Math.min(5, Math.max(1, Math.round(average * 5)));
};