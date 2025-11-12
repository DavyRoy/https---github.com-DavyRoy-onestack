export type CartItemType = "retail" | "service" | "bookingDeposit";

export type CartItem = {
  id: string;
  type: CartItemType;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  unitPrice: number;
  quantity: number;
  status: "in_stock" | "pending" | "preorder";
  variant?: string;
  badge?: string;
  depositRatio?: number;
};

export type CartGroup = {
  id: CartItemType;
  label: string;
  items: CartItem[];
};

export type AppliedCoupon = {
  code: string;
  description: string;
  amount: number;
};

export type CartDelivery = {
  method: "delivery" | "pickup";
  service?: "courier" | "post" | "cdek";
  addressId?: string;
  price: number;
};

export type CartLoyalty = {
  available: number;
  currency: "RUB" | "KRW";
  applied: number;
  enabled: boolean;
};

export type CartUpsell = {
  id: string;
  title: string;
  price: number;
  href: string;
  image: string;
};

export type CartSnapshot = {
  id: string;
  groups: CartGroup[];
  coupons: AppliedCoupon[];
  delivery: CartDelivery;
  loyalty: CartLoyalty;
  upsell: CartUpsell[];
  notes?: string;
  taxRate: number;
};

export const mockCart: CartSnapshot = {
  id: "cart-1021",
  groups: [
    {
      id: "retail",
      label: "Товары",
      items: [
        {
          id: "cart-item-1",
          type: "retail",
          title: "Сыворотка 24/7 Glow",
          subtitle: "Витамин C + Niacinamide",
          image: "https://images.unsplash.com/photo-1584129012686-4d553ff279f4?auto=format&fit=crop&w=640&q=80",
          href: "/demo/user/shop/serum-247",
          unitPrice: 1490,
          quantity: 2,
          status: "in_stock",
          variant: "Объём 30 мл",
        },
        {
          id: "cart-item-2",
          type: "retail",
          title: "Аромасвеча Amber Rest",
          subtitle: "Амбра • Ваниль",
          image: "https://images.unsplash.com/photo-1512257751684-5a846902e845?auto=format&fit=crop&w=640&q=80",
          href: "/demo/user/shop/candle-amber",
          unitPrice: 980,
          quantity: 1,
          status: "pending",
          variant: "Размер Medium",
        },
      ],
    },
    {
      id: "service",
      label: "Услуги",
      items: [
        {
          id: "cart-item-3",
          type: "service",
          title: "Spa-комплекс на двоих",
          subtitle: "90 минут, будни",
          image: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=640&q=80",
          href: "/demo/user/booking?service=spa-complex",
          unitPrice: 6900,
          quantity: 1,
          status: "in_stock",
          badge: "Предоплата 30%",
          depositRatio: 0.3,
        },
      ],
    },
    {
      id: "bookingDeposit",
      label: "Бронирование",
      items: [
        {
          id: "cart-item-4",
          type: "bookingDeposit",
          title: "Депозит: зал yoga-пространства",
          subtitle: "Суббота, 19 октября, 10:00",
          image: "https://images.unsplash.com/photo-1526404428533-88b3db838397?auto=format&fit=crop&w=640&q=80",
          href: "/demo/user/booking/calendar?event=studio-rent",
          unitPrice: 3500,
          quantity: 1,
          status: "preorder",
          badge: "Залог",
        },
      ],
    },
  ],
  coupons: [
    { code: "WELCOME10", description: "-10% на первый заказ", amount: 1189 },
  ],
  delivery: {
    method: "delivery",
    service: "courier",
    addressId: "addr-home",
    price: 400,
  },
  loyalty: {
    available: 1250,
    currency: "RUB",
    applied: 500,
    enabled: true,
  },
  upsell: [
    {
      id: "upsell-1",
      title: "Скраб Citrus Energy",
      price: 1650,
      href: "/demo/user/shop/scrub-citrus",
      image: "https://images.unsplash.com/photo-1588285799003-765f5d4a41cf?auto=format&fit=crop&w=640&q=80",
    },
    {
      id: "upsell-2",
      title: "Подарочный сертификат 5 000 ₽",
      price: 5000,
      href: "/demo/user/shop/gift-card-5000",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=640&q=80",
    },
    {
      id: "upsell-3",
      title: "Массажное масло Warm Up",
      price: 1890,
      href: "/demo/user/shop/body-oil-warm",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=640&q=80",
    },
  ],
  notes: "Оставить заказ у ресепшн, клиент заберёт вечером.",
  taxRate: 0.1,
};
