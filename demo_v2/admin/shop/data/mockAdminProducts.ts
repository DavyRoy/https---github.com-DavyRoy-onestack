// app/demo/admin/shop/data/mockAdminProducts.ts
import { CATEGORIES } from "./mockAdminCategories";

export type ProductStatus = "active" | "draft" | "archived";

/** Идентификатор иконки; сами иконки рисуем в UI (lucide-react), а в данных храним только id */
export type IconId =
  | "droplets" | "sparkles" | "spray" | "brush" | "wind" | "candle" | "sun"
  | "scissors" | "thermometer" | "gift" | "graduation" | "hammer";

export type Product = {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  categoryId?: string | null;
  categoryName?: string | null;
  price: number;          // RUB (демо)
  stockTotal: number;
  status: ProductStatus;
  iconId?: IconId;        // <— вместо JSX-иконки храним строковый id
  updatedAt: string;      // ISO YYYY-MM-DD
};

const withCat = (id?: string | null) =>
  id
    ? { categoryId: id, categoryName: CATEGORIES.find(c => c.id === id)?.name || null }
    : { categoryId: null, categoryName: null };

const today = "2025-09-28";

export const PRODUCTS: Product[] = [
  // 🧴 Волосы
  { id: "p-001", name: "Шампунь Nutrition 250мл", sku: "SH-NUTR-250", ...withCat("cat-hair-care"), price: 690,  stockTotal: 42, status: "active",   iconId: "droplets",   updatedAt: today },
  { id: "p-002", name: "Маска Recovery 200мл",   sku: "MS-RECV-200",   ...withCat("cat-hair-care"), price: 990,  stockTotal: 15, status: "active",   iconId: "sparkles",   updatedAt: today },
  { id: "p-003", name: "Краска RichTone 6.3",    sku: "CL-RT-63",      ...withCat("cat-hair-color"), price: 450,  stockTotal: 33, status: "active",   iconId: "spray",      updatedAt: today },
  { id: "p-004", name: "Мусс Volume+",           sku: "ST-VOLM",       ...withCat("cat-hair-styling"), price: 820, stockTotal: 18, status: "active", iconId: "wind",       updatedAt: today },

  // 💅 Ногти
  { id: "p-010", name: "Лак Scarlet",            sku: "NL-SCARLET",    ...withCat("cat-nails-design"), price: 450, stockTotal: 120, status: "active", iconId: "brush",   updatedAt: "2025-09-10" },
  { id: "p-011", name: "База Strong",            sku: "NL-BASE-S",     ...withCat("cat-nails-manicure"), price: 590, stockTotal: 80, status: "active", iconId: "sparkles", updatedAt: "2025-09-16" },
  { id: "p-012", name: "Топ без липкости",       sku: "NL-TOP-NSTICK", ...withCat("cat-nails-manicure"), price: 640, stockTotal: 60, status: "active", iconId: "droplets", updatedAt: "2025-09-24" },
  { id: "p-014", name: "Набор маникюрный Pro",   sku: "NAILS-PROKIT",  ...withCat("cat-nails"), price: 3290, stockTotal: 5, status: "active", iconId: "scissors", updatedAt: "2025-09-27" },

  // 💆‍♀️ SPA
  { id: "p-020", name: "SPA-набор Relax",        sku: "SPA-RELAX",     ...withCat("cat-spa"), price: 2490, stockTotal: 8, status: "draft", iconId: "candle", updatedAt: "2025-09-25" },
  { id: "p-021", name: "Масло Citrus",           sku: "SPA-OIL-CT",    ...withCat("cat-spa-massage"), price: 1490, stockTotal: 25, status: "active", iconId: "droplets", updatedAt: today },
  { id: "p-023", name: "Соль Sea Breeze",        sku: "SPA-SALT-SB",   ...withCat("cat-spa-bath"), price: 490, stockTotal: 45, status: "active", iconId: "sparkles", updatedAt: "2025-09-21" },

  // 💆‍♂️ Лицо
  { id: "p-030", name: "Сыворотка Hydra",        sku: "FC-HYDRA",      ...withCat("cat-face-care"), price: 1890, stockTotal: 0, status: "active", iconId: "droplets", updatedAt: "2025-09-12" },
  { id: "p-031", name: "Патчи под глаза",        sku: "EYE-PATCH-30",  ...withCat("cat-face-masks"), price: 790, stockTotal: 48, status: "active", iconId: "sparkles", updatedAt: "2025-09-22" },
  { id: "p-033", name: "Крем дневной SPF15",     sku: "FC-CRM-DAY",    ...withCat("cat-face-care"), price: 1490, stockTotal: 18, status: "active", iconId: "sun", updatedAt: today },

  // 👁️ Брови/ресницы
  { id: "p-040", name: "Гель для бровей Hold",   sku: "BR-HOLD",       ...withCat("cat-brows-shape"), price: 590, stockTotal: 67, status: "archived", iconId: "brush", updatedAt: "2025-08-30" },
  { id: "p-042", name: "Состав для ламинирования", sku: "LS-STEP1",    ...withCat("cat-brows-lashes"), price: 870, stockTotal: 35, status: "active", iconId: "sparkles", updatedAt: today },

  // ⚙️ Инструменты/оборудование
  { id: "p-060", name: "Фен ProAir",             sku: "EQ-DRY-PA",     ...withCat("cat-equipment"), price: 6490, stockTotal: 12, status: "active", iconId: "wind", updatedAt: "2025-09-15" },
  { id: "p-061", name: "Лампа UV360",            sku: "EQ-LAMP-UV",    ...withCat("cat-tools"), price: 4590, stockTotal: 9, status: "active", iconId: "thermometer", updatedAt: today },
  { id: "p-063", name: "Фартук мастера",         sku: "EQ-APR-CLS",    ...withCat("cat-uniform"), price: 990, stockTotal: 30, status: "active", iconId: "hammer", updatedAt: today },

  // 🎓 Обучение/сертификаты
  { id: "p-070", name: "Онлайн-курс по маникюру", sku: "ED-MAN-ONL",   ...withCat("cat-education"), price: 7900, stockTotal: 9999, status: "active", iconId: "graduation", updatedAt: "2025-09-10" },
  { id: "p-072", name: "Подарочный сертификат 3000₽", sku: "CR-GIFT-3K", ...withCat("cat-certs"), price: 3000, stockTotal: 100, status: "active", iconId: "gift", updatedAt: today },

  // Без категории
  { id: "p-099", name: "Кисть универсальная №12", sku: "BRUSH-12",     ...withCat(null), price: 390, stockTotal: 200, status: "active", iconId: "brush", updatedAt: "2025-09-05" },
];