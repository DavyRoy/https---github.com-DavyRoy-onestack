import type { Metadata } from "next";
import CalendarPageClient from "./components/CalendarPageClient";

export const metadata: Metadata = {
  title: "Календарь",
  description: "Личный календарь планов: записи, оплаты, заказы и напоминания в едином интерфейсе.",
};

export default function CalendarPage() {
  return <CalendarPageClient />;
}
