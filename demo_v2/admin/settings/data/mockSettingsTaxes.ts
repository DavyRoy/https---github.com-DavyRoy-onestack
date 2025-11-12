export type TaxRate = {
  id: string;
  name: string;
  rate: number; // процент
  type: "vat" | "sales" | "service" | "none";
  scope: string; // страна или зона действия
  active: boolean;
  description?: string;
};

export type TaxRule = {
  level: "category" | "product" | "currency" | "region";
  match: string;
  rateRef: string; // ссылка на id налога
  priority: number; // чем выше — тем раньше применяется
  condition?: string; // для будущих условий (например, minAmount > 100)
};

export const defaultTaxes: TaxRate[] = [
  {
    id: "vat20",
    name: "НДС 20%",
    rate: 20,
    type: "vat",
    scope: "RU",
    active: true,
    description: "Стандартный НДС для РФ",
  },
  {
    id: "none",
    name: "Без налога",
    rate: 0,
    type: "none",
    scope: "*",
    active: true,
  },
];

export const defaultRules: TaxRule[] = [
  {
    level: "category",
    match: "services",
    rateRef: "vat20",
    priority: 10,
  },
  {
    level: "category",
    match: "goods",
    rateRef: "vat20",
    priority: 10,
  },
  {
    level: "currency",
    match: "KRW",
    rateRef: "none",
    priority: 100,
  },
];