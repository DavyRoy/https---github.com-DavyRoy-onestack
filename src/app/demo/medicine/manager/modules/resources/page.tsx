'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';

// Types
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'protocol' | 'guideline' | 'reference' | 'form' | 'template' | 'calculator' | 'article' | 'video';
  category: string;
  fileType: 'pdf' | 'doc' | 'xls' | 'ppt' | 'video' | 'web' | 'tool';
  fileSize: string;
  accessLevel: 'free' | 'premium' | 'restricted';
  publishedDate: string;
  lastUpdated: string;
  author: string;
  organization: string;
  rating: number;
  ratingCount: number;
  downloads: number;
  views: number;
  tags: string[];
  featured: boolean;
  isNew: boolean;
  downloadUrl: string;
  previewUrl?: string;
  relatedResources?: string[];
  version?: string;
  language: string;
  specialty: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  resourceCount: number;
  color: string;
}

export type ViewType = 'grid' | 'list';
export type ResourceType = 'all' | 'protocol' | 'guideline' | 'reference' | 'form' | 'template' | 'calculator' | 'article' | 'video';
export type CategoryFilter = 'all' | string;
export type SortField = 'title' | 'publishedDate' | 'rating' | 'downloads' | 'views' | 'lastUpdated';

// Demo Data
export const categories: Category[] = [
  {
    id: 'cardiology',
    name: 'Кардиология',
    description: 'Протоколы и рекомендации по сердечно-сосудистым заболеваниям',
    icon: '❤️',
    resourceCount: 45,
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'neurology',
    name: 'Неврология',
    description: 'Ресурсы по заболеваниям нервной системы',
    icon: '🧠',
    resourceCount: 38,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'pediatrics',
    name: 'Педиатрия',
    description: 'Материалы для детской и подростковой медицины',
    icon: '👶',
    resourceCount: 52,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'surgery',
    name: 'Хирургия',
    description: 'Хирургические протоколы и методики',
    icon: '🔪',
    resourceCount: 67,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'emergency',
    name: 'Неотложная помощь',
    description: 'Ресурсы для экстренной медицины',
    icon: '🚑',
    resourceCount: 29,
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'diagnostics',
    name: 'Диагностика',
    description: 'Методы и инструменты диагностики',
    icon: '🔍',
    resourceCount: 41,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'pharmacology',
    name: 'Фармакология',
    description: 'Лекарственные препараты и схемы лечения',
    icon: '💊',
    resourceCount: 63,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'rehabilitation',
    name: 'Реабилитация',
    description: 'Программы восстановления и физиотерапии',
    icon: '🏃',
    resourceCount: 34,
    color: 'from-teal-500 to-teal-600'
  }
];

export const resources: Resource[] = [
  {
    id: 'RES-001',
    title: 'Клинические рекомендации по артериальной гипертензии 2024',
    description: 'Актуальные рекомендации по диагностике и лечению артериальной гипертензии с учетом последних исследований',
    type: 'guideline',
    category: 'cardiology',
    fileType: 'pdf',
    fileSize: '2.8 MB',
    accessLevel: 'free',
    publishedDate: '2024-01-15T00:00:00Z',
    lastUpdated: '2024-01-15T00:00:00Z',
    author: 'Российское кардиологическое общество',
    organization: 'РКО',
    rating: 4.8,
    ratingCount: 124,
    downloads: 2847,
    views: 5678,
    tags: ['гипертензия', 'кардиология', 'рекомендации', '2024'],
    featured: true,
    isNew: true,
    downloadUrl: '/resources/guidelines/hypertension-2024.pdf',
    previewUrl: '/resources/previews/hypertension-2024.jpg',
    version: '2.1',
    language: 'ru',
    specialty: ['cardiology', 'therapy']
  },
  {
    id: 'RES-002',
    title: 'Протокол неотложной помощи при ОКС',
    description: 'Пошаговый алгоритм действий при остром коронарном синдроме для медицинского персонала',
    type: 'protocol',
    category: 'emergency',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    accessLevel: 'free',
    publishedDate: '2024-01-10T00:00:00Z',
    lastUpdated: '2024-01-10T00:00:00Z',
    author: 'Национальная ассоциация скорой помощи',
    organization: 'НАСП',
    rating: 4.9,
    ratingCount: 89,
    downloads: 1567,
    views: 3124,
    tags: ['ОКС', 'неотложка', 'кардиология', 'протокол'],
    featured: true,
    isNew: false,
    downloadUrl: '/resources/protocols/acs-emergency.pdf',
    version: '1.0',
    language: 'ru',
    specialty: ['cardiology', 'emergency']
  },
  {
    id: 'RES-003',
    title: 'Калькулятор индекса массы тела и рисков',
    description: 'Интерактивный калькулятор для расчета ИМТ и оценки связанных рисков для здоровья',
    type: 'calculator',
    category: 'diagnostics',
    fileType: 'tool',
    fileSize: '0.5 MB',
    accessLevel: 'free',
    publishedDate: '2024-01-08T00:00:00Z',
    lastUpdated: '2024-01-08T00:00:00Z',
    author: 'Институт питания РАМН',
    organization: 'РАМН',
    rating: 4.6,
    ratingCount: 203,
    downloads: 3241,
    views: 7890,
    tags: ['ИМТ', 'калькулятор', 'диагностика', 'ожирение'],
    featured: false,
    isNew: true,
    downloadUrl: '/resources/tools/bmi-calculator.html',
    version: '3.2',
    language: 'ru',
    specialty: ['endocrinology', 'therapy']
  },
  {
    id: 'RES-004',
    title: 'Шаблоны медицинской документации',
    description: 'Набор готовых шаблонов для ведения медицинской документации и отчетности',
    type: 'template',
    category: 'administration',
    fileType: 'doc',
    fileSize: '3.1 MB',
    accessLevel: 'premium',
    publishedDate: '2024-01-05T00:00:00Z',
    lastUpdated: '2024-01-05T00:00:00Z',
    author: 'Минздрав РФ',
    organization: 'Минздрав',
    rating: 4.7,
    ratingCount: 67,
    downloads: 892,
    views: 2345,
    tags: ['документация', 'шаблоны', 'отчетность', 'администрирование'],
    featured: false,
    isNew: false,
    downloadUrl: '/resources/templates/medical-docs.zip',
    version: '1.5',
    language: 'ru',
    specialty: ['administration']
  },
  {
    id: 'RES-005',
    title: 'Видео: Современные методы ЭХО-КГ',
    description: 'Обучающее видео по проведению и интерпретации эхокардиографии с клиническими случаями',
    type: 'video',
    category: 'cardiology',
    fileType: 'video',
    fileSize: '156 MB',
    accessLevel: 'premium',
    publishedDate: '2024-01-03T00:00:00Z',
    lastUpdated: '2024-01-03T00:00:00Z',
    author: 'Проф. Иванов А.В.',
    organization: 'МГМУ',
    rating: 4.9,
    ratingCount: 45,
    downloads: 567,
    views: 1234,
    tags: ['ЭХО-КГ', 'видео', 'обучение', 'кардиология'],
    featured: true,
    isNew: true,
    downloadUrl: '/resources/videos/echo-kg-guide.mp4',
    previewUrl: '/resources/previews/echo-kg.jpg',
    version: '1.0',
    language: 'ru',
    specialty: ['cardiology', 'diagnostics']
  },
  {
    id: 'RES-006',
    title: 'Справочник лекарственных взаимодействий',
    description: 'Полный справочник по лекарственным взаимодействиям и противопоказаниям',
    type: 'reference',
    category: 'pharmacology',
    fileType: 'pdf',
    fileSize: '4.2 MB',
    accessLevel: 'free',
    publishedDate: '2023-12-28T00:00:00Z',
    lastUpdated: '2023-12-28T00:00:00Z',
    author: 'Фармакологический комитет',
    organization: 'ФК РФ',
    rating: 4.8,
    ratingCount: 178,
    downloads: 2134,
    views: 4567,
    tags: ['фармакология', 'взаимодействия', 'справочник', 'лекарства'],
    featured: false,
    isNew: false,
    downloadUrl: '/resources/references/drug-interactions.pdf',
    version: '2.3',
    language: 'ru',
    specialty: ['pharmacology', 'therapy']
  },
  {
    id: 'RES-007',
    title: 'Формы информированного согласия',
    description: 'Стандартизированные формы информированного согласия для различных медицинских процедур',
    type: 'form',
    category: 'administration',
    fileType: 'doc',
    fileSize: '1.8 MB',
    accessLevel: 'free',
    publishedDate: '2023-12-25T00:00:00Z',
    lastUpdated: '2023-12-25T00:00:00Z',
    author: 'Юридический отдел Минздрава',
    organization: 'Минздрав',
    rating: 4.5,
    ratingCount: 92,
    downloads: 1456,
    views: 2987,
    tags: ['согласие', 'формы', 'юридические', 'документы'],
    featured: false,
    isNew: false,
    downloadUrl: '/resources/forms/informed-consent.zip',
    version: '1.2',
    language: 'ru',
    specialty: ['administration', 'legal']
  },
  {
    id: 'RES-008',
    title: 'Протокол ведения пациентов с инсультом',
    description: 'Детальный протокол диагностики и лечения пациентов с острым нарушением мозгового кровообращения',
    type: 'protocol',
    category: 'neurology',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    accessLevel: 'free',
    publishedDate: '2023-12-20T00:00:00Z',
    lastUpdated: '2023-12-20T00:00:00Z',
    author: 'Ассоциация неврологов',
    organization: 'АНР',
    rating: 4.7,
    ratingCount: 134,
    downloads: 1876,
    views: 3654,
    tags: ['инсульт', 'неврология', 'протокол', 'ОНМК'],
    featured: true,
    isNew: false,
    downloadUrl: '/resources/protocols/stroke-management.pdf',
    version: '1.8',
    language: 'ru',
    specialty: ['neurology', 'emergency']
  }
];

// Utility Functions
export const getTypeConfig = (type: string) => {
  switch (type) {
    case 'protocol':
      return { 
        label: 'Протокол', 
        icon: '📋', 
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20'
      };
    case 'guideline':
      return { 
        label: 'Рекомендации', 
        icon: '⭐', 
        color: 'text-green-400',
        bgColor: 'bg-green-500/20'
      };
    case 'reference':
      return { 
        label: 'Справочник', 
        icon: '📚', 
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20'
      };
    case 'form':
      return { 
        label: 'Форма', 
        icon: '📝', 
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20'
      };
    case 'template':
      return { 
        label: 'Шаблон', 
        icon: '🎨', 
        color: 'text-pink-400',
        bgColor: 'bg-pink-500/20'
      };
    case 'calculator':
      return { 
        label: 'Калькулятор', 
        icon: '🧮', 
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/20'
      };
    case 'article':
      return { 
        label: 'Статья', 
        icon: '📄', 
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20'
      };
    case 'video':
      return { 
        label: 'Видео', 
        icon: '🎥', 
        color: 'text-red-400',
        bgColor: 'bg-red-500/20'
      };
    default:
      return { 
        label: 'Ресурс', 
        icon: '📁', 
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20'
      };
  }
};

export const getFileTypeConfig = (fileType: string) => {
  switch (fileType) {
    case 'pdf':
      return { 
        label: 'PDF', 
        icon: '📄', 
        color: 'text-red-400'
      };
    case 'doc':
      return { 
        label: 'Word', 
        icon: '📝', 
        color: 'text-blue-400'
      };
    case 'xls':
      return { 
        label: 'Excel', 
        icon: '📊', 
        color: 'text-green-400'
      };
    case 'ppt':
      return { 
        label: 'PowerPoint', 
        icon: '📽️', 
        color: 'text-orange-400'
      };
    case 'video':
      return { 
        label: 'Видео', 
        icon: '🎥', 
        color: 'text-purple-400'
      };
    case 'web':
      return { 
        label: 'Веб-страница', 
        icon: '🌐', 
        color: 'text-cyan-400'
      };
    case 'tool':
      return { 
        label: 'Инструмент', 
        icon: '🛠️', 
        color: 'text-yellow-400'
      };
    default:
      return { 
        label: 'Файл', 
        icon: '📁', 
        color: 'text-gray-400'
      };
  }
};

export const getAccessLevelConfig = (accessLevel: string) => {
  switch (accessLevel) {
    case 'free':
      return { 
        label: 'Бесплатно', 
        icon: '🆓', 
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-400'
      };
    case 'premium':
      return { 
        label: 'Премиум', 
        icon: '⭐', 
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        textColor: 'text-yellow-400'
      };
    case 'restricted':
      return { 
        label: 'Ограниченный', 
        icon: '🔒', 
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400'
      };
    default:
      return { 
        label: 'Неизвестно', 
        icon: '❓', 
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        textColor: 'text-gray-400'
      };
  }
};

export const getFeaturedResources = (): Resource[] => {
  return resources.filter(r => r.featured);
};

export const getNewResources = (): Resource[] => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return resources.filter(r => new Date(r.publishedDate) > thirtyDaysAgo);
};

export const getPopularResources = (count: number = 10): Resource[] => {
  return resources
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, count);
};

export const getRecentResources = (count: number = 10): Resource[] => {
  return resources
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, count);
};

export const searchResources = (query: string): Resource[] => {
  const lowercaseQuery = query.toLowerCase();
  return resources.filter(resource => 
    resource.title.toLowerCase().includes(lowercaseQuery) ||
    resource.description.toLowerCase().includes(lowercaseQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    resource.author.toLowerCase().includes(lowercaseQuery) ||
    resource.specialty.some(spec => spec.toLowerCase().includes(lowercaseQuery))
  );
};

export const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  return '★'.repeat(fullStars) + '½'.repeat(halfStar) + '☆'.repeat(emptyStars);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Main Component
export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ResourceType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortField>('publishedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [view, setView] = useState<ViewType>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'new' | 'popular'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Получение ресурсов в зависимости от активной вкладки
  const getTabResources = () => {
    switch (activeTab) {
      case 'featured': return getFeaturedResources();
      case 'new': return getNewResources();
      case 'popular': return getPopularResources(20);
      default: return resources;
    }
  };

  // Фильтрация и сортировка ресурсов
  const filteredResources = useMemo(() => {
    let filtered = getTabResources();

    // Поиск
    if (searchQuery) {
      filtered = searchResources(searchQuery);
    }

    // Фильтрация по типу
    if (typeFilter !== 'all') {
      filtered = filtered.filter(resource => resource.type === typeFilter);
    }

    // Фильтрация по категории
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(resource => resource.category === categoryFilter);
    }

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'publishedDate':
          aValue = new Date(a.publishedDate).getTime();
          bValue = new Date(b.publishedDate).getTime();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'downloads':
          aValue = a.downloads;
          bValue = b.downloads;
          break;
        case 'views':
          aValue = a.views;
          bValue = b.views;
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated).getTime();
          bValue = new Date(b.lastUpdated).getTime();
          break;
        default:
          aValue = new Date(a.publishedDate).getTime();
          bValue = new Date(b.publishedDate).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [activeTab, searchQuery, typeFilter, categoryFilter, sortBy, sortDirection]);

  // Статистика
  const stats = useMemo(() => {
    const featured = getFeaturedResources();
    const newResources = getNewResources();
    const popular = getPopularResources(5);
    
    return {
      total: resources.length,
      featured: featured.length,
      new: newResources.length,
      popular: popular.length,
      categories: categories.length,
      downloads: resources.reduce((sum, res) => sum + res.downloads, 0),
      protocols: resources.filter(r => r.type === 'protocol').length,
      calculators: resources.filter(r => r.type === 'calculator').length,
      free: resources.filter(r => r.accessLevel === 'free').length,
      premium: resources.filter(r => r.accessLevel === 'premium').length,
    };
  }, []);

  const handleFilterReset = useCallback(() => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setShowFilters(false);
  }, []);

  const handleResourceSelect = useCallback((resource: Resource) => {
    setSelectedResource(resource);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedResource(null);
  }, []);

  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const statsData = [
    { label: 'Всего ресурсов', value: stats.total, icon: '📚', color: 'from-blue-500 to-cyan-500' },
    { label: 'Бесплатные', value: stats.free, icon: '🆓', color: 'from-green-500 to-emerald-500' },
    { label: 'Премиум', value: stats.premium, icon: '⭐', color: 'from-yellow-500 to-yellow-600' },
    { label: 'Протоколы', value: stats.protocols, icon: '📋', color: 'from-purple-500 to-purple-600' },
    { label: 'Калькуляторы', value: stats.calculators, icon: '🧮', color: 'from-orange-500 to-orange-600' },
    { label: 'Загрузок', value: formatNumber(stats.downloads), icon: '📥', color: 'from-red-500 to-pink-600' }
  ];

  const resourceTypes = [
    { value: 'all' as ResourceType, label: 'Все типы', icon: '📁' },
    { value: 'protocol' as ResourceType, label: 'Протоколы', icon: '📋' },
    { value: 'guideline' as ResourceType, label: 'Рекомендации', icon: '⭐' },
    { value: 'reference' as ResourceType, label: 'Справочники', icon: '📚' },
    { value: 'form' as ResourceType, label: 'Формы', icon: '📝' },
    { value: 'template' as ResourceType, label: 'Шаблоны', icon: '🎨' },
    { value: 'calculator' as ResourceType, label: 'Калькуляторы', icon: '🧮' },
    { value: 'article' as ResourceType, label: 'Статьи', icon: '📄' },
    { value: 'video' as ResourceType, label: 'Видео', icon: '🎥' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4 sm:mt-6 gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Медицинские ресурсы</h1>
              <p className="text-white/60 text-xs sm:text-sm lg:text-base">
                Библиотека клинических рекомендаций, протоколов, шаблонов и инструментов
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1 sm:max-w-xs">
                <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                </div>
              </div>
              
              <Link
                href="/demo/medicine/doctor"
                className="px-3 sm:px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2 min-w-[120px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Назад</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {statsData.map((stat, index) => (
            <motion.div 
              key={stat.label}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                  <span className="text-sm sm:text-base">{stat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg sm:text-xl font-bold text-white truncate">{stat.value}</div>
                  <div className="text-white/60 text-xs truncate">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex mb-6"
        >
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 overflow-x-auto">
            {[
              { id: 'all' as const, label: 'Все ресурсы', icon: '📚', count: stats.total },
              { id: 'featured' as const, label: 'Рекомендуемые', icon: '⭐', count: stats.featured },
              { id: 'new' as const, label: 'Новые', icon: '🆕', count: stats.new },
              { id: 'popular' as const, label: 'Популярные', icon: '🔥', count: stats.popular }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="px-1.5 py-0.5 rounded-full text-xs bg-white/10">
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-4 mb-6"
        >
          <div className="flex flex-col gap-3 flex-1">
            {/* Mobile Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Фильтры {showFilters ? '▲' : '▼'}</span>
            </motion.button>

            {/* Filters */}
            <div className={`${showFilters ? 'grid' : 'hidden lg:grid'} grid-cols-1 sm:grid-cols-3 gap-3 flex-1 transition-all duration-300`}>
              {/* Type Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-white/60 mb-1 font-medium">Тип ресурса</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as ResourceType)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm"
                >
                  {resourceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-white/60 mb-1 font-medium">Категория</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm"
                >
                  <option value="all">Все категории</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.resourceCount})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <div className="flex flex-col flex-1">
                  <label className="text-xs text-white/60 mb-1 font-medium">Сортировка</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortField)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm"
                  >
                    <option value="publishedDate">По дате публикации</option>
                    <option value="lastUpdated">По обновлению</option>
                    <option value="title">По названию</option>
                    <option value="rating">По рейтингу</option>
                    <option value="downloads">По загрузкам</option>
                    <option value="views">По просмотрам</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-white/60 mb-1 font-medium">&nbsp;</label>
                  <button
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="h-full px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-white text-sm flex items-center justify-center min-w-[44px]"
                  >
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <div className="text-xs text-white/60 hidden sm:block">Вид:</div>
            <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
              {[
                { value: 'grid' as ViewType, label: 'Сетка', icon: '▦' },
                { value: 'list' as ViewType, label: 'Список', icon: '☰' }
              ].map(({ value, label, icon }) => (
                <motion.button
                  key={value}
                  onClick={() => setView(value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    view === value
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm">{icon}</span>
                  <span className="hidden sm:inline text-sm">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-4 flex items-center justify-between"
        >
          <p className="text-white/60 text-sm">
            Найдено ресурсов: <span className="text-white font-medium">{filteredResources.length}</span>
          </p>
          {filteredResources.length === 0 && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFilterReset}
              className="px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm"
            >
              Сбросить фильтры
            </motion.button>
          )}
        </motion.div>

        {/* Resources Grid/List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={view === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            : "flex flex-col gap-3"
          }
        >
          <AnimatePresence>
            {filteredResources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                view={view}
                index={index}
                onSelect={handleResourceSelect}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 sm:py-12"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl sm:text-3xl mb-4 mx-auto">
              📚
            </div>
            <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Ресурсы не найдены</h3>
            <p className="text-white/60 text-sm sm:text-base mb-6 max-w-md mx-auto">
              Попробуйте изменить параметры фильтрации или поисковый запрос
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFilterReset}
              className="px-6 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
            >
              Сбросить все фильтры
            </motion.button>
          </motion.div>
        )}

        {/* Resource Detail Modal */}
        <AnimatePresence>
          {selectedResource && (
            <ResourceDetailModal
              resource={selectedResource}
              onClose={handleModalClose}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Resource Card Component
function ResourceCard({ resource, view, index, onSelect }: any) {
  const typeConfig = getTypeConfig(resource.type);
  const fileTypeConfig = getFileTypeConfig(resource.fileType);
  const accessConfig = getAccessLevelConfig(resource.accessLevel);

  const handleClick = useCallback(() => {
    onSelect(resource);
  }, [onSelect, resource]);

  const handleActionClick = useCallback((e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`${action} clicked for resource ${resource.id}`);
  }, [resource.id]);

  if (view === 'grid') {
    return (
      <motion.div
        variants={{
          hidden: { scale: 0.9, opacity: 0 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: {
              duration: 0.4,
              ease: "easeOut"
            }
          }
        }}
        custom={index}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200 overflow-hidden group cursor-pointer"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && handleClick()}
      >
        {/* Header */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`p-2 rounded-lg ${typeConfig.bgColor} flex-shrink-0`}>
                <span className="text-sm">{typeConfig.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors truncate">
                  {resource.title}
                </h3>
                <p className="text-white/40 text-xs mt-1">
                  {typeConfig.label}
                </p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs ${accessConfig.bgColor} ${accessConfig.textColor} flex-shrink-0 ml-2`}>
              {accessConfig.icon}
            </div>
          </div>

          {/* Description */}
          <p className="text-white/60 text-xs line-clamp-2 mb-3 min-h-[2.5rem]">
            {resource.description}
          </p>

          {/* File Info */}
          <div className="flex items-center justify-between text-xs text-white/40 mb-3">
            <div className="flex items-center gap-1">
              <span className={fileTypeConfig.color}>{fileTypeConfig.icon}</span>
              <span>{fileTypeConfig.label}</span>
            </div>
            <span>{resource.fileSize}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-white/40">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span>{resource.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">📥</span>
                <span>{formatNumber(resource.downloads)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-400">👁️</span>
                <span>{formatNumber(resource.views)}</span>
              </div>
            </div>
            <div className="text-xs text-white/60">
              {new Date(resource.publishedDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
        </div>

        {/* Footer with tags */}
        <div className="px-4 py-3 border-t border-white/10 bg-white/2">
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 2).map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/60">
                #{tag}
              </span>
            ))}
            {resource.tags.length > 2 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/60">
                +{resource.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // List View
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
      custom={index}
      className="bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200 overflow-hidden group cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${typeConfig.bgColor} flex-shrink-0`}>
            <span className="text-base">{typeConfig.icon}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors truncate flex-1 min-w-0">
                {resource.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={`px-2 py-1 rounded-full text-xs ${accessConfig.bgColor} ${accessConfig.textColor}`}>
                  {accessConfig.icon}
                </div>
                {resource.featured && (
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
                    ⭐
                  </span>
                )}
                {resource.isNew && (
                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                    🆕
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-white/60 text-xs mb-2 line-clamp-1">
              {resource.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-white/40 flex-wrap">
              <span>{typeConfig.label}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className={fileTypeConfig.color}>{fileTypeConfig.icon}</span>
                <span>{fileTypeConfig.label}</span>
              </div>
              <span>•</span>
              <span>{resource.fileSize}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span>{resource.rating}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="text-green-400">📥</span>
                <span>{formatNumber(resource.downloads)}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right text-xs text-white/40 flex-shrink-0 hidden sm:block">
            <div>{new Date(resource.publishedDate).toLocaleDateString('ru-RU')}</div>
            <div className="mt-1">{formatNumber(resource.views)} просмотров</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Resource Detail Modal Component
function ResourceDetailModal({ resource, onClose }: any) {
  const typeConfig = getTypeConfig(resource.type);
  const fileTypeConfig = getFileTypeConfig(resource.fileType);
  const accessConfig = getAccessLevelConfig(resource.accessLevel);
  const category = categories.find(c => c.id === resource.category);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleDownload = useCallback(() => {
    console.log(`Downloading resource: ${resource.id}`);
    // Здесь будет логика скачивания
  }, [resource.id]);

  const handlePreview = useCallback(() => {
    console.log(`Previewing resource: ${resource.id}`);
    // Здесь будет логика предпросмотра
  }, [resource.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`p-3 rounded-xl ${typeConfig.bgColor} flex-shrink-0`}>
                <span className="text-2xl">{typeConfig.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">{resource.title}</h2>
                <p className="text-white/60 text-sm mt-1">
                  {typeConfig.label} • {category?.name} • {resource.author}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white flex-shrink-0 ml-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
              <div className="text-white/60 text-xs mb-1">Тип файла</div>
              <div className="text-white text-sm font-medium flex items-center gap-2">
                <span className={fileTypeConfig.color}>{fileTypeConfig.icon}</span>
                {fileTypeConfig.label}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
              <div className="text-white/60 text-xs mb-1">Размер</div>
              <div className="text-white text-sm font-medium">{resource.fileSize}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
              <div className="text-white/60 text-xs mb-1">Доступ</div>
              <div className={`text-sm font-medium ${accessConfig.textColor} flex items-center gap-1`}>
                {accessConfig.icon} {accessConfig.label}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
              <div className="text-white/60 text-xs mb-1">Опубликовано</div>
              <div className="text-white text-sm font-medium">
                {new Date(resource.publishedDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-3">Описание</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold text-sm mb-2">Детали</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Автор:</span>
                    <span className="text-white">{resource.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Организация:</span>
                    <span className="text-white">{resource.organization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Версия:</span>
                    <span className="text-white">{resource.version || '1.0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Язык:</span>
                    <span className="text-white">{resource.language.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Обновлено:</span>
                    <span className="text-white">{new Date(resource.lastUpdated).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold text-sm mb-2">Статистика</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Рейтинг:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">⭐ {resource.rating}</span>
                      <span className="text-white/60">({resource.ratingCount} оценок)</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Загрузки:</span>
                    <span className="text-white font-medium">{formatNumber(resource.downloads)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Просмотры:</span>
                    <span className="text-white font-medium">{formatNumber(resource.views)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold text-sm mb-2">Теги</h4>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10">
            <button 
              onClick={handleDownload}
              className="flex-1 px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Скачать ресурс
            </button>
            
            {resource.previewUrl && (
              <button 
                onClick={handlePreview}
                className="px-4 sm:px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Предпросмотр
              </button>
            )}
            
            <button className="px-4 sm:px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              В закладки
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}