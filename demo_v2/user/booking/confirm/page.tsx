import type { Metadata } from "next";
import ConfirmPageClient from "../components/ConfirmPageClient";

export const metadata: Metadata = {
  title: "Подтверждение бронирования",
};

export default function BookingConfirmPage() {
  return <ConfirmPageClient />;
}
