export interface Resource {
  id: string;
  title: string;
  type: 'protocol' | 'guideline' | 'reference' | 'form' | 'template' | 'calculator' | 'article' | 'video';
  category: string;
  description: string;
  specialty: string[];
  tags: string[];
  fileType: 'pdf' | 'doc' | 'xls' | 'ppt' | 'video' | 'web' | 'image' | 'calculator';
  fileSize?: string;
  url?: string;
  downloadUrl?: string;
  author: string;
  organization: string;
  publishedDate: string;
  lastUpdated: string;
  version?: string;
  rating: number;
  downloads: number;
  views: number;
  isFeatured: boolean;
  isNew: boolean;
  accessLevel: 'public' | 'internal' | 'restricted';
  requiredTraining?: string[];
  relatedResources: string[];
}

export interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
  specialty: string[];
}

// Демо данные ресурсов
export const resources: Resource[] = [
  {
    id: 'res-001',
    title: 'Клинические рекомендации по артериальной гипертензии',
    type: 'guideline',
    category: 'Кардиология',
    description: 'Актуальные клинические рекомендации по диагностике и лечению артериальной гипертензии 2024 года',
    specialty: ['Кардиология', 'Терапия', 'Семейная медицина'],
    tags: ['гипертензия', 'кардиология', 'лечение', 'диагностика'],
    fileType: 'pdf',
    fileSize: '2.4 MB',
    downloadUrl: '/resources/guidelines/hypertension-2024.pdf',
    author: 'Российское кардиологическое общество',
    organization: 'РКО',
    publishedDate: '2024-01-15',
    lastUpdated: '2024-01-15',
    version: '2.1',
    rating: 4.8,
    downloads: 1247,
    views: 3560,
    isFeatured: true,
    isNew: false,
    accessLevel: 'public',
    relatedResources: ['res-002', 'res-003']
  },
  {
    id: 'res-002',
    title: 'Алгоритм выбора антигипертензивной терапии',
    type: 'protocol',
    category: 'Кардиология',
    description: 'Пошаговый алгоритм выбора и коррекции антигипертензивной терапии с учетом коморбидности',
    specialty: ['Кардиология', 'Терапия'],
    tags: ['алгоритм', 'терапия', 'антигипертензивные', 'схемы'],
    fileType: 'pdf',
    fileSize: '1.2 MB',
    downloadUrl: '/resources/protocols/antihypertensive-algorithm.pdf',
    author: 'Национальный медицинский исследовательский центр кардиологии',
    organization: 'НМИЦ Кардиологии',
    publishedDate: '2024-01-20',
    lastUpdated: '2024-01-20',
    version: '1.0',
    rating: 4.6,
    downloads: 892,
    views: 2100,
    isFeatured: true,
    isNew: true,
    accessLevel: 'internal',
    relatedResources: ['res-001', 'res-004']
  },
  {
    id: 'res-003',
    title: 'Калькулятор сердечно-сосудистого риска SCORE2',
    type: 'calculator',
    category: 'Кардиология',
    description: 'Интерактивный калькулятор для оценки 10-летнего риска фатальных сердечно-сосудистых событий',
    specialty: ['Кардиология', 'Терапия', 'Профилактика'],
    tags: ['калькулятор', 'риск', 'score2', 'профилактика'],
    fileType: 'web',
    url: '/calculators/score2',
    author: 'Европейское общество кардиологов',
    organization: 'ESC',
    publishedDate: '2023-12-10',
    lastUpdated: '2023-12-10',
    version: '1.2',
    rating: 4.9,
    downloads: 0,
    views: 4780,
    isFeatured: true,
    isNew: false,
    accessLevel: 'public',
    relatedResources: ['res-001', 'res-005']
  },
  {
    id: 'res-004',
    title: 'Форма информированного согласия при гипертензии',
    type: 'form',
    category: 'Документация',
    description: 'Стандартная форма информированного согласия для пациентов с артериальной гипертензией',
    specialty: ['Кардиология', 'Терапия', 'Все специальности'],
    tags: ['форма', 'согласие', 'документация', 'юридический'],
    fileType: 'doc',
    fileSize: '0.8 MB',
    downloadUrl: '/resources/forms/hypertension-consent-form.docx',
    author: 'Юридический отдел',
    organization: 'Медицинский центр',
    publishedDate: '2024-01-08',
    lastUpdated: '2024-01-08',
    version: '3.0',
    rating: 4.3,
    downloads: 567,
    views: 1200,
    isFeatured: false,
    isNew: false,
    accessLevel: 'internal',
    relatedResources: ['res-002']
  },
  {
    id: 'res-005',
    title: 'Шаблон протокола ЭхоКГ исследования',
    type: 'template',
    category: 'Диагностика',
    description: 'Стандартизированный шаблон для заполнения протокола эхокардиографического исследования',
    specialty: ['Кардиология', 'Функциональная диагностика'],
    tags: ['эхокг', 'шаблон', 'протокол', 'диагностика'],
    fileType: 'doc',
    fileSize: '1.1 MB',
    downloadUrl: '/resources/templates/echo-protocol-template.docx',
    author: 'Отдел функциональной диагностики',
    organization: 'НМИЦ Кардиологии',
    publishedDate: '2024-01-12',
    lastUpdated: '2024-01-12',
    version: '2.2',
    rating: 4.7,
    downloads: 723,
    views: 1850,
    isFeatured: false,
    isNew: true,
    accessLevel: 'internal',
    relatedResources: ['res-003']
  },
  {
    id: 'res-006',
    title: 'Справочник лекарственных взаимодействий',
    type: 'reference',
    category: 'Фармакология',
    description: 'Полный справочник лекарственных взаимодействий кардиологических препаратов',
    specialty: ['Кардиология', 'Терапия', 'Фармакология'],
    tags: ['лекарства', 'взаимодействия', 'фармакология', 'справочник'],
    fileType: 'pdf',
    fileSize: '3.8 MB',
    downloadUrl: '/resources/references/drug-interactions-guide.pdf',
    author: 'Кафедра клинической фармакологии',
    organization: 'Первый МГМУ',
    publishedDate: '2024-01-05',
    lastUpdated: '2024-01-05',
    version: '4.0',
    rating: 4.8,
    downloads: 945,
    views: 2900,
    isFeatured: true,
    isNew: false,
    accessLevel: 'public',
    relatedResources: ['res-001', 'res-002']
  },
  {
    id: 'res-007',
    title: 'Видео: Техника измерения АД',
    type: 'video',
    category: 'Обучение',
    description: 'Обучающее видео по правильной технике измерения артериального давления',
    specialty: ['Кардиология', 'Терапия', 'Сестринское дело'],
    tags: ['видео', 'обучение', 'ад', 'техника'],
    fileType: 'video',
    fileSize: '45.2 MB',
    downloadUrl: '/resources/videos/bp-measurement-technique.mp4',
    author: 'Образовательный центр',
    organization: 'Российское медицинское общество',
    publishedDate: '2024-01-18',
    lastUpdated: '2024-01-18',
    version: '1.0',
    rating: 4.5,
    downloads: 234,
    views: 1670,
    isFeatured: false,
    isNew: true,
    accessLevel: 'internal',
    requiredTraining: ['basic-training'],
    relatedResources: ['res-001']
  },
  {
    id: 'res-008',
    title: 'Протокол ведения пациентов с ХСН',
    type: 'protocol',
    category: 'Кардиология',
    description: 'Стандартизированный протокол ведения пациентов с хронической сердечной недостаточностью',
    specialty: ['Кардиология', 'Терапия'],
    tags: ['хсн', 'протокол', 'ведение', 'лечение'],
    fileType: 'pdf',
    fileSize: '2.1 MB',
    downloadUrl: '/resources/protocols/chf-management-protocol.pdf',
    author: 'Российское кардиологическое общество',
    organization: 'РКО',
    publishedDate: '2024-01-22',
    lastUpdated: '2024-01-22',
    version: '3.1',
    rating: 4.7,
    downloads: 678,
    views: 1950,
    isFeatured: false,
    isNew: true,
    accessLevel: 'public',
    relatedResources: ['res-001', 'res-006']
  },
  {
    id: 'res-009',
    title: 'Калькулятор доз антикоагулянтов',
    type: 'calculator',
    category: 'Гематология',
    description: 'Инструмент для расчета доз варфарина и NOACs на основе клинических параметров',
    specialty: ['Кардиология', 'Гематология', 'Терапия'],
    tags: ['калькулятор', 'антикоагулянты', 'дозировка', 'варфарин'],
    fileType: 'web',
    url: '/calculators/anticoagulant-dosing',
    author: 'Отдел клинической фармакологии',
    organization: 'НМИЦ Гематологии',
    publishedDate: '2024-01-14',
    lastUpdated: '2024-01-14',
    version: '2.0',
    rating: 4.9,
    downloads: 0,
    views: 3250,
    isFeatured: true,
    isNew: false,
    accessLevel: 'internal',
    relatedResources: ['res-006']
  },
  {
    id: 'res-010',
    title: 'Шаблон выписки из стационара',
    type: 'template',
    category: 'Документация',
    description: 'Унифицированный шаблон для оформления выписки из кардиологического стационара',
    specialty: ['Кардиология', 'Терапия', 'Все специальности'],
    tags: ['выписка', 'шаблон', 'документация', 'стационар'],
    fileType: 'doc',
    fileSize: '0.9 MB',
    downloadUrl: '/resources/templates/discharge-summary-template.docx',
    author: 'Отдел медицинской документации',
    organization: 'Медицинский центр',
    publishedDate: '2024-01-09',
    lastUpdated: '2024-01-09',
    version: '4.2',
    rating: 4.4,
    downloads: 812,
    views: 2100,
    isFeatured: false,
    isNew: false,
    accessLevel: 'internal',
    relatedResources: ['res-004']
  },
  {
    id: 'res-011',
    title: 'Научная статья: Новые подходы в лечении аритмий',
    type: 'article',
    category: 'Кардиология',
    description: 'Обзор современных методов лечения сердечных аритмий и новых препаратов',
    specialty: ['Кардиология', 'Аритмология'],
    tags: ['статья', 'аритмии', 'лечение', 'исследования'],
    fileType: 'pdf',
    fileSize: '1.5 MB',
    downloadUrl: '/resources/articles/arrhythmia-treatment-2024.pdf',
    author: 'Проф. Иванов А.В.',
    organization: 'НМИЦ Кардиологии',
    publishedDate: '2024-01-25',
    lastUpdated: '2024-01-25',
    version: '1.0',
    rating: 4.6,
    downloads: 456,
    views: 1340,
    isFeatured: false,
    isNew: true,
    accessLevel: 'restricted',
    requiredTraining: ['arrhythmia-training'],
    relatedResources: ['res-008']
  },
  {
    id: 'res-012',
    title: 'Презентация: Диагностика ИБС',
    type: 'reference',
    category: 'Обучение',
    description: 'Учебная презентация по современным методам диагностики ишемической болезни сердца',
    specialty: ['Кардиология', 'Терапия', 'Студенты'],
    tags: ['презентация', 'ибс', 'диагностика', 'обучение'],
    fileType: 'ppt',
    fileSize: '8.7 MB',
    downloadUrl: '/resources/references/ihd-diagnosis-presentation.pptx',
    author: 'Кафедра кардиологии',
    organization: 'РНИМУ',
    publishedDate: '2024-01-16',
    lastUpdated: '2024-01-16',
    version: '1.1',
    rating: 4.5,
    downloads: 389,
    views: 1560,
    isFeatured: false,
    isNew: false,
    accessLevel: 'public',
    relatedResources: ['res-001', 'res-003']
  },
  {
    id: 'res-013',
    title: 'Калькулятор индекса массы тела',
    type: 'calculator',
    category: 'Общая практика',
    description: 'Простой калькулятор для расчета индекса массы тела и оценки весовой категории',
    specialty: ['Терапия', 'Семейная медицина', 'Все специальности'],
    tags: ['калькулятор', 'имт', 'вес', 'антропометрия'],
    fileType: 'web',
    url: '/calculators/bmi',
    author: 'Отдел профилактической медицины',
    organization: 'Минздрав',
    publishedDate: '2023-11-20',
    lastUpdated: '2023-11-20',
    version: '1.0',
    rating: 4.7,
    downloads: 0,
    views: 5890,
    isFeatured: true,
    isNew: false,
    accessLevel: 'public',
    relatedResources: ['res-003']
  },
  {
    id: 'res-014',
    title: 'Форма направления на консультацию',
    type: 'form',
    category: 'Документация',
    description: 'Унифицированная форма для направления пациента на консультацию к специалисту',
    specialty: ['Все специальности'],
    tags: ['форма', 'направление', 'консультация', 'документация'],
    fileType: 'doc',
    fileSize: '0.6 MB',
    downloadUrl: '/resources/forms/referral-form-template.docx',
    author: 'Организационно-методический отдел',
    organization: 'Медицинский центр',
    publishedDate: '2024-01-07',
    lastUpdated: '2024-01-07',
    version: '2.3',
    rating: 4.2,
    downloads: 1023,
    views: 2780,
    isFeatured: false,
    isNew: false,
    accessLevel: 'internal',
    relatedResources: ['res-004', 'res-010']
  },
  {
    id: 'res-015',
    title: 'Гайдлайн по COVID-19 и сердечно-сосудистым заболеваниям',
    type: 'guideline',
    category: 'Инфекции',
    description: 'Рекомендации по ведению пациентов с сердечно-сосудистыми заболеваниями и COVID-19',
    specialty: ['Кардиология', 'Терапия', 'Инфектология'],
    tags: ['covid-19', 'рекомендации', 'ссз', 'инфекции'],
    fileType: 'pdf',
    fileSize: '1.8 MB',
    downloadUrl: '/resources/guidelines/covid-cardio-2024.pdf',
    author: 'Российское кардиологическое общество',
    organization: 'РКО',
    publishedDate: '2024-01-28',
    lastUpdated: '2024-01-28',
    version: '2.0',
    rating: 4.7,
    downloads: 567,
    views: 1890,
    isFeatured: true,
    isNew: true,
    accessLevel: 'public',
    relatedResources: ['res-001', 'res-008']
  }
];

// Демо данные категорий
export const categories: ResourceCategory[] = [
  {
    id: 'cat-001',
    name: 'Кардиология',
    description: 'Ресурсы по кардиологии и сердечно-сосудистым заболеваниям',
    icon: '❤️',
    color: 'from-red-400 to-pink-500',
    count: 8,
    specialty: ['Кардиология', 'Терапия']
  },
  {
    id: 'cat-002',
    name: 'Документация',
    description: 'Шаблоны документов, формы и бланки',
    icon: '📄',
    color: 'from-blue-400 to-cyan-500',
    count: 4,
    specialty: ['Все специальности']
  },
  {
    id: 'cat-003',
    name: 'Фармакология',
    description: 'Справочники по лекарствам и взаимодействиям',
    icon: '💊',
    color: 'from-green-400 to-emerald-500',
    count: 2,
    specialty: ['Все специальности']
  },
  {
    id: 'cat-004',
    name: 'Диагностика',
    description: 'Протоколы и шаблоны диагностических исследований',
    icon: '🔍',
    color: 'from-purple-400 to-purple-500',
    count: 2,
    specialty: ['Кардиология', 'Функциональная диагностика']
  },
  {
    id: 'cat-005',
    name: 'Обучение',
    description: 'Обучающие материалы и презентации',
    icon: '🎓',
    color: 'from-orange-400 to-orange-500',
    count: 3,
    specialty: ['Все специальности']
  },
  {
    id: 'cat-006',
    name: 'Калькуляторы',
    description: 'Интерактивные медицинские калькуляторы',
    icon: '🧮',
    color: 'from-indigo-400 to-indigo-500',
    count: 3,
    specialty: ['Все специальности']
  },
  {
    id: 'cat-007',
    name: 'Инфекции',
    description: 'Ресурсы по инфекционным заболеваниям',
    icon: '🦠',
    color: 'from-yellow-400 to-yellow-500',
    count: 1,
    specialty: ['Инфектология', 'Терапия']
  },
  {
    id: 'cat-008',
    name: 'Общая практика',
    description: 'Ресурсы для общей медицинской практики',
    icon: '🏥',
    color: 'from-gray-400 to-gray-500',
    count: 1,
    specialty: ['Семейная медицина', 'Терапия']
  }
];

// Вспомогательные функции
export const getResourceById = (id: string): Resource | undefined => {
  return resources.find(resource => resource.id === id);
};

export const getResourcesByCategory = (category: string): Resource[] => {
  return resources.filter(resource => resource.category === category);
};

export const getResourcesByType = (type: Resource['type']): Resource[] => {
  return resources.filter(resource => resource.type === type);
};

export const getFeaturedResources = (): Resource[] => {
  return resources.filter(resource => resource.isFeatured);
};

export const getNewResources = (): Resource[] => {
  return resources.filter(resource => resource.isNew);
};

export const getPopularResources = (limit: number = 5): Resource[] => {
  return resources
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

export const getRecentResources = (limit: number = 5): Resource[] => {
  return resources
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit);
};

export const searchResources = (query: string): Resource[] => {
  const lowerQuery = query.toLowerCase();
  return resources.filter(resource => 
    resource.title.toLowerCase().includes(lowerQuery) ||
    resource.description.toLowerCase().includes(lowerQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    resource.specialty.some(spec => spec.toLowerCase().includes(lowerQuery))
  );
};

export const getTypeConfig = (type: Resource['type']) => {
  const configs = {
    protocol: { icon: '📋', label: 'Протокол', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    guideline: { icon: '⭐', label: 'Рекомендации', color: 'text-green-400', bgColor: 'bg-green-500/20' },
    reference: { icon: '📚', label: 'Справочник', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    form: { icon: '📝', label: 'Форма', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    template: { icon: '📄', label: 'Шаблон', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
    calculator: { icon: '🧮', label: 'Калькулятор', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
    article: { icon: '📖', label: 'Статья', color: 'text-red-400', bgColor: 'bg-red-500/20' },
    video: { icon: '🎥', label: 'Видео', color: 'text-pink-400', bgColor: 'bg-pink-500/20' }
  };
  return configs[type];
};

export const getFileTypeConfig = (fileType: Resource['fileType']) => {
  const configs = {
    pdf: { icon: '📕', label: 'PDF', color: 'text-red-400' },
    doc: { icon: '📘', label: 'Word', color: 'text-blue-400' },
    xls: { icon: '📗', label: 'Excel', color: 'text-green-400' },
    ppt: { icon: '📙', label: 'PowerPoint', color: 'text-orange-400' },
    video: { icon: '🎬', label: 'Видео', color: 'text-purple-400' },
    web: { icon: '🌐', label: 'Веб', color: 'text-cyan-400' },
    image: { icon: '🖼️', label: 'Изображение', color: 'text-pink-400' },
    calculator: { icon: '🧮', label: 'Калькулятор', color: 'text-indigo-400' }
  };
  return configs[fileType];
};

export const getAccessLevelConfig = (accessLevel: Resource['accessLevel']) => {
  const configs = {
    public: { color: 'bg-green-500/20 text-green-400', label: 'Публичный', icon: '🌐' },
    internal: { color: 'bg-blue-500/20 text-blue-400', label: 'Внутренний', icon: '🏢' },
    restricted: { color: 'bg-orange-500/20 text-orange-400', label: 'Ограниченный', icon: '🔒' }
  };
  return configs[accessLevel];
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  return '⭐'.repeat(fullStars) + (halfStar ? '✨' : '') + '☆'.repeat(emptyStars);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};