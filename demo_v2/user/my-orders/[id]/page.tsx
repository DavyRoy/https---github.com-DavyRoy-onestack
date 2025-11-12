import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { orders } from "../data/mockUserMyOrders";
import OrderDetailPageClient from "../components/OrderDetailPageClient";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const order = orders.find((item) => item.id === params.id);
  if (!order) return { title: "Заказ" };
  return {
    title: `Заказ ${order.number}`,
    description: `Статус ${order.status}, сумма ${order.total.toLocaleString("ru-RU")} ₽`,
  };
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = orders.find((item) => item.id === params.id);
  if (!order) return notFound();
  return <OrderDetailPageClient />;
}
