import type { Metadata } from "next";
import MyOrdersPageClient from "./components/MyOrdersPageClient";

export const metadata: Metadata = {
  title: "Мои заказы",
  description: "История и статус заказов: доставка, оплата и документы.",
};

export default function MyOrdersPage() {
  return <MyOrdersPageClient />;
}
