// детерминированные моки без рандома — чтобы не ловить гидрацию

export type AdminService = {
  id: string;
  name: string;
  categoryId?: string;
  status: "active" | "draft" | "archived";
  durationMin: number;
  price: number;               // базовая цена (RUB, демо)
  tags?: ("hit" | "season" | "vip")[];
  changedAt?: string;          // YYYY-MM-DD — дата последнего изменения цены
};

export type AdminServiceCategory = {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
};

export type AdminBundle = {
  id: string;
  name: string;
  type: "package" | "subscription";
  status: "active" | "draft" | "archived";
  price: number;
  periodDays?: number; // для subscription
  items: { serviceId: string; qty?: number }[];
  categoryId?: string;
};

export const SERVICE_CATEGORIES: AdminServiceCategory[] = [
  { id: "scat-hair", name: "Волосы", slug: "hair" },
  { id: "scat-nails", name: "Ногти", slug: "nails" },
  { id: "scat-spa", name: "SPA", slug: "spa" },
];

export const ADMIN_SERVICES: AdminService[] = [
  { id: "srv-001", name: "Стрижка женская", categoryId: "scat-hair", status: "active", durationMin: 60, price: 1800, tags: ["hit"], changedAt: "2025-09-01" },
  { id: "srv-002", name: "Укладка вечерняя", categoryId: "scat-hair", status: "active", durationMin: 45, price: 1600, tags: ["season"], changedAt: "2025-09-05" },
  { id: "srv-003", name: "Маникюр классический", categoryId: "scat-nails", status: "active", durationMin: 60, price: 1500 },
  { id: "srv-004", name: "Массаж спины 60 мин", categoryId: "scat-spa", status: "draft", durationMin: 60, price: 2500 },
  { id: "srv-005", name: "SPA-уход Relax 90 мин", categoryId: "scat-spa", status: "active", durationMin: 90, price: 3900, tags: ["vip"], changedAt: "2025-08-28" },
  { id: "srv-006", name: "Педикюр базовый", categoryId: "scat-nails", status: "active", durationMin: 60, price: 1700 },
];

export const ADMIN_BUNDLES: AdminBundle[] = [
  { id: "bndl-001", name: "5× Массаж 60 мин", type: "package", status: "active", price: 11000, items: [{ serviceId: "srv-004", qty: 5 }], categoryId: "scat-spa" },
  { id: "bndl-002", name: "Безлимит SPA 30 дней", type: "subscription", status: "draft", price: 29000, periodDays: 30, items: [{ serviceId: "srv-005" }], categoryId: "scat-spa" },
];