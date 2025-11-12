import type { Metadata } from "next";
import MyBookingsPageClient from "./components/MyBookingsPageClient";

export const metadata: Metadata = {
  title: "Мои записи",
  description: "Управляйте своими бронированиями: перенос, отмена, оплаты и календарь.",
};

export default function MyBookingsPage() {
  return <MyBookingsPageClient />;
}
