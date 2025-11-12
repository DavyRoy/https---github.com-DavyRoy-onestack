import type { Metadata } from "next";
import CartPageClient from "./components/CartPageClient";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Проверка заказа, купоны, бонусы и выбор доставки перед оплатой.",
};

export default function CartPage() {
  return <CartPageClient />;
}
