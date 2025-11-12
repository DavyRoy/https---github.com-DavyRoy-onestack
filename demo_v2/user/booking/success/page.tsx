import type { Metadata } from "next";
import SuccessPageClient from "../components/SuccessPageClient";

export const metadata: Metadata = {
  title: "Бронирование подтверждено",
};

export default function BookingSuccessPage() {
  return <SuccessPageClient />;
}
