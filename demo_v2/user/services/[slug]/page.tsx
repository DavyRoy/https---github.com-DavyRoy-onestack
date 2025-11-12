import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageClient from "../components/ServicePageClient";
import { services } from "../data/mockUserServices";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = services.find((item) => item.slug === params.slug);
  if (!service) return { title: "Услуга" };
  return {
    title: service.title,
    description: service.summary,
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = services.find((item) => item.slug === params.slug);
  if (!service) return notFound();
  return <ServicePageClient service={service} />;
}
