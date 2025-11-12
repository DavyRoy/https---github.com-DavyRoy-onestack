import type { ElementType } from 'react';

export type RoleId = 'user' | 'manager' | 'owner';
export type Trend = 'up' | 'down' | 'stable';

export type KPI = { 
  label: string; 
  value: number; 
  suffix?: string; 
  delta?: number; 
  icon: ElementType | string;
  trend: 'up' | 'down' | 'stable';
  description?: string;
  link?: string;
  color?: string;
  target?: number;
  unit?: string;
  change?: number;
  details?: string;
  schedule?: Array<Record<string, any>>;
  items?: Array<{ label: string; value: number; target?: number }>;
  metrics?: Record<string, any>;
  chartData?: Array<{ name: string; value: number; color: string }>;
  stats?: Array<Record<string, any>>;
  format?: 'number' | 'currency' | 'percentage';
};

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionLink?: string;
  read?: boolean;
}

export type CardSize = 'sm' | 'md' | 'lg' | 'xl';
export type CardType = 'kpi' | 'chart' | 'progress' | 'list' | 'stats' | 'table' | 'timeline';

export interface DashboardCard {
  id: string;
  type: CardType;
  title: string;
  content: any;
  size: CardSize;
  position: number;
  removable: boolean;
  glowColor: string;
  category?: string;
  lastUpdated?: string;
}

export type RoleCard = {
  id: RoleId;
  title: string;
  subtitle: string;
  icon: ElementType;
  description: string;
  points: string[];
  tech: string[];
  benefits: string[];
  gradient: string;
  stats: Array<{ label: string; value: string; icon: ElementType }>;
  features: Array<{ title: string; description: string; icon: ElementType }>;
  path: string;
  badge?: string;
  metrics: { metric: string; value: string; improvement: string }[];
  demoVideo?: string;
  accessLevel: 'basic' | 'standard' | 'premium' | 'enterprise';
  trainingTime: string;
  links?: Array<{ label: string; href: string }>;
};

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  gradient: string;
  tech: string[];
  scenarios: string[];
  stats: { value: string; label: string; icon: ElementType }[];
  benchmarks: string[];
  documentation?: string;
  status: 'stable' | 'beta' | 'alpha' | 'planned';
  releaseDate?: string;
  details?: string[];
  metrics?: Array<{ label: string; value: string }>;
  badge?: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  client: string;
  industry: string;
  duration: string;
  budget?: string;
  challenge: string;
  solution: string;
  results: { metric: string; before: string; after: string; improvement: string }[];
  technologies: string[];
  team?: { role: string; count: number }[];
  testimonial: { text: string; author: string; position: string; avatar?: string; rating?: number };
  teamSize?: string;
  roi?: string;
  implementationHighlights?: string[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  avatar: string;
  experience: string;
  projects: number;
  tech: string[];
  bio?: string;
  education?: string[];
  certifications?: string[];
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  joinDate?: string;
  specialization?: string[];
  achievements?: string[];
};

export type ModalState =
  | { type: 'idle' }
  | { type: 'role'; payload: RoleCard }
  | { type: 'feature'; payload: Feature }
  | { type: 'contact' }
  | { type: 'success' }
  | { type: 'mobileMenu' }
  | { type: 'caseStudy'; payload: CaseStudy }
  | { type: 'teamMember'; payload: TeamMember }
  | { type: 'video'; payload: { url: string; title: string } };

export type Action =
  | { type: 'OPEN_ROLE'; payload: RoleCard }
  | { type: 'OPEN_FEATURE'; payload: Feature }
  | { type: 'OPEN_CONTACT' }
  | { type: 'SUBMIT_CONTACT' }
  | { type: 'CLOSE' }
  | { type: 'SUCCESS' }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'OPEN_CASE_STUDY'; payload: CaseStudy }
  | { type: 'OPEN_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'OPEN_VIDEO'; payload: { url: string; title: string } };
import type React from 'react';

export interface ModuleHeroAction {
  label: string;
  href?: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface ModuleHeroStat {
  label: string;
  value: string;
  change?: number;
  trend?: Trend;
}

export interface ModuleHero {
  badge: string;
  title: string;
  description: string;
  metadata: Array<{ label: string; value: string }>;
  stats: ModuleHeroStat[];
  actions: ModuleHeroAction[];
}

export interface ModuleMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: Trend;
  hint: string;
  target?: string;
}

export interface ModuleTable {
  title: string;
  subtitle: string;
  columns: string[];
  rows: Array<Record<string, string>>;
  footnote?: string;
}

export interface ModuleTimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  owner: string;
  status: 'done' | 'in_progress' | 'planned';
}

export interface ModuleUpdate {
  id: string;
  title: string;
  channel: string;
  timestamp: string;
  owner: string;
  summary: string;
}

export interface ModuleInsight {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: Trend;
  description: string;
}

export interface ModuleResource {
  id: string;
  label: string;
  type: string;
  updated: string;
  href?: string;
}

export interface ModuleContact {
  owner: string;
  role: string;
  email: string;
  phone: string;
  shift: string;
  responseTime: string;
  avatar: string;
}

export interface ModuleContent {
  id: string;
  role: RoleId;
  slug: string[];
  title: string;
  category: string;
  icon: string;
  hero: ModuleHero;
  metrics: ModuleMetric[];
  table: ModuleTable;
  timeline: ModuleTimelineItem[];
  updates: ModuleUpdate[];
  insights: ModuleInsight[];
  resources: ModuleResource[];
  contact: ModuleContact;
  status: 'stable' | 'beta' | 'internal';
  tags: string[];
}
