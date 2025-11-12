import type { Metadata } from "next";
import BookingPageClient from "./components/BookingPageClient";

export const metadata: Metadata = {
  title: "Бронирование",
  description: "Выберите дату и время, мастера и дополнительные услуги перед подтверждением записи.",
};

export default function BookingPage() {
  return <BookingPageClient />;
}
