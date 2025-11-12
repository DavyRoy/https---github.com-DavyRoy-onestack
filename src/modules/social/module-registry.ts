import { SOCIAL_NAVIGATION } from '@/app/demo/social/config';
import type {
  ModuleContent,
  ModuleHeroAction,
  ModuleMetric,
  RoleId,
  Trend,
} from '@/app/demo/social/types';

const ROLE_COLORS: Record<RoleId, string> = {
  owner: 'from-purple-500/20 via-blue-500/10 to-cyan-500/20',
  manager: 'from-emerald-500/20 via-teal-500/10 to-sky-500/20',
  user: 'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
};

const PEOPLE = [
  'Мария Кузнецова',
  'Иван Лаптев',
  'Дарья Трофимова',
  'Алексей Смирнов',
  'Олег Титов',
  'Наталья Жукова',
];

const CHANNELS = ['Portal', 'Email', 'Mobile App', 'API', 'Call Center'];

const STATUS: Array<'stable' | 'beta' | 'internal'> = ['stable', 'beta', 'stable', 'internal'];

const moduleMap = new Map<string, ModuleContent>();

const now = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
});

function trend(value: number): Trend {
  if (value > 2) return 'up';
  if (value < -2) return 'down';
  return 'stable';
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value);
}

function buildMetrics(id: string, category: string): ModuleMetric[] {
  return Array.from({ length: 3 }).map((_, idx) => {
    const change = Number((Math.random() * 6 - 2).toFixed(1));
    return {
      id: `${id}-metric-${idx}`,
      label:
        idx === 0
          ? `${category} KPI`
          : idx === 1
          ? 'Срок исполнения'
          : 'Удовлетворенность',
      value:
        idx === 1
          ? `${(Math.random() * 5 + 2).toFixed(1)} дн.`
          : `${formatNumber(Math.floor(Math.random() * 5000) + 120)}`,
      change,
      trend: trend(change),
      hint: idx === 1 ? 'Сред. длительность' : 'Текущий период',
      target: idx === 1 ? '4 дн.' : undefined,
    };
  });
}

function buildTable(title: string) {
  const columns = ['ID', 'Категория', 'Статус', 'Ответственный', 'Обновлено'];
  const rows = Array.from({ length: 5 }).map((_, idx) => ({
    ID: `${title.slice(0, 3).toUpperCase()}-${100 + idx}`,
    Категория: ['Проекты', 'Случаи', 'Финансы', 'Отчеты'][idx % 4],
    Статус: ['Черновик', 'В работе', 'На проверке', 'Готово'][idx % 4],
    Ответственный: PEOPLE[idx % PEOPLE.length],
    Обновлено: now.format(new Date(Date.now() - idx * 86400000)),
  }));

  return {
    title: `${title}: рабочая таблица`,
    subtitle: 'Данные обновляются автоматически каждые 15 минут',
    columns,
    rows,
    footnote: 'Демо-данные синхронизированы',
  };
}

function buildTimeline(id: string) {
  const statuses: Array<'done' | 'in_progress' | 'planned'> = ['done', 'in_progress', 'planned'];
  return Array.from({ length: 3 }).map((_, idx) => ({
    id: `${id}-timeline-${idx}`,
    time: now.format(new Date(Date.now() - idx * 3600000)),
    title: ['Синхронизация данных', 'Утвержден план', 'Обновление SLA'][idx],
    description: ['Данные выровнены', 'План подтвержден', 'Новые SLA опубликованы'][idx],
    owner: PEOPLE[idx % PEOPLE.length],
    status: statuses[idx],
  }));
}

function buildUpdates(id: string) {
  return Array.from({ length: 3 }).map((_, idx) => ({
    id: `${id}-update-${idx}`,
    title: ['Обновлен регламент', 'Запущен экспорт', 'Новый отчёт'][idx],
    channel: CHANNELS[idx % CHANNELS.length],
    timestamp: now.format(new Date(Date.now() - idx * 7200000)),
    owner: PEOPLE[(idx + 2) % PEOPLE.length],
    summary: 'Демо-описание изменения в системе',
  }));
}

function buildInsights(metrics: ModuleMetric[]) {
  return metrics.map(metric => ({
    id: `${metric.id}-insight`,
    title: metric.label,
    value: metric.value,
    change: metric.change,
    trend: metric.trend,
    description: `Сравнение с целью ${metric.target ?? 'н/д'}`,
  }));
}

function buildResources(id: string, title: string) {
  return Array.from({ length: 3 }).map((_, idx) => ({
    id: `${id}-resource-${idx}`,
    label: `${title} • материал ${idx + 1}`,
    type: ['PDF', 'Notion', 'Confluence'][idx % 3],
    updated: now.format(new Date(Date.now() - idx * 86400000)),
    href: '#',
  }));
}

function buildActions(baseHref?: string): ModuleHeroAction[] {
  return [
    { label: 'Создать запись', variant: 'primary', href: baseHref },
    { label: 'Экспортировать', variant: 'secondary', href: baseHref },
  ];
}

function buildContact() {
  const owner = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
  return {
    owner,
    role: 'Ответственный',
    email: `${owner.split(' ')[0].toLowerCase()}@demo.gov`,
    phone: `+7 (999) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 90 + 10)}-${Math.floor(
      Math.random() * 90 + 10,
    )}`,
    shift: '09:00-18:00',
    responseTime: 'до 30 мин',
    avatar: owner
      .split(' ')
      .map(part => part[0])
      .join(''),
  };
}

function extractSlug(role: RoleId, href: string | undefined): string[] | null {
  if (!href) return null;
  const token = `/demo/social/${role}/modules/`;
  const index = href.indexOf(token);
  if (index === -1) return null;
  const slugPart = href.slice(index + token.length);
  return slugPart.split('/').filter(Boolean);
}

function ensureModule(role: RoleId, slug: string[], label: string, section: string, icon = '📁'): ModuleContent {
  const key = `${role}:${slug.join('/')}`;
  if (moduleMap.has(key)) {
    return moduleMap.get(key)!;
  }

  const id = key.replace(/:/g, '-');
  const metrics = buildMetrics(id, section);

  const content: ModuleContent = {
    id,
    role,
    slug,
    title: label,
    category: section,
    icon,
    hero: {
      badge: section,
      title: label,
      description: `${label}: демо-модуль социальной платформы`,
      metadata: [
        { label: 'Сегмент', value: section },
        { label: 'Статус', value: 'В работе' },
        { label: 'Обновлено', value: now.format(new Date()) },
      ],
      stats: metrics.map(metric => ({
        label: metric.label,
        value: metric.value,
        change: metric.change,
        trend: metric.trend,
      })),
      actions: buildActions(`/demo/social/${role}/modules/${slug.join('/')}`),
    },
    metrics,
    table: buildTable(label),
    timeline: buildTimeline(id),
    updates: buildUpdates(id),
    insights: buildInsights(metrics),
    resources: buildResources(id, label),
    contact: buildContact(),
    status: STATUS[Math.floor(Math.random() * STATUS.length)],
    tags: [section.toLowerCase(), label.toLowerCase()],
  };

  moduleMap.set(key, content);
  return content;
}

(['owner', 'manager', 'user'] as RoleId[]).forEach(role => {
  SOCIAL_NAVIGATION[role].forEach(section => {
    section.items.forEach(item => {
      const baseSlug = extractSlug(role, item.href);
      if (baseSlug) {
        ensureModule(role, baseSlug, item.label, section.title, item.icon);
      }
      item.children?.forEach(child => {
        const childSlug = extractSlug(role, child.href);
        if (childSlug) {
          ensureModule(role, childSlug, child.label, section.title, item.icon);
        }
      });
    });
  });
});

export function getModuleContent(role: RoleId, slug: string[]): ModuleContent | null {
  return moduleMap.get(`${role}:${slug.join('/')}`) ?? null;
}

export function listModuleSlugs(role: RoleId): string[][] {
  return Array.from(moduleMap.values())
    .filter(module => module.role === role)
    .map(module => module.slug);
}
