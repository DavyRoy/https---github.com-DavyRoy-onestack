import type { Metadata } from "next";
import ServicesPageClient from "./components/ServicesPageClient";

export const metadata: Metadata = {
  title: "Услуги",
  description: "Каталог услуг OneStack: SPA, beauty, фитнес и корпоративные программы с записью онлайн.",
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
