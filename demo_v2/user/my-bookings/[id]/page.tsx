import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingDetailPageClient from "../components/BookingDetailPageClient";
import { myBookings } from "../data/mockUserMyBookings";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const booking = myBookings.find((item) => item.id === params.id);
  if (!booking) return { title: "Запись" };
  return {
    title: booking.serviceTitle,
    description: `Бронирование ${booking.serviceTitle} — ${new Date(booking.start).toLocaleString("ru-RU")}`,
  };
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const booking = myBookings.find((item) => item.id === params.id);
  if (!booking) return notFound();
  return <BookingDetailPageClient />;
}
