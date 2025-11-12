"use client";

import type { Service } from "../data/mockUserServices";
import ServiceCard from "./ServiceCard";

export type ServicesGridProps = {
  services: Service[];
  onQuickView: (service: Service) => void;
};

export default function ServicesGrid({ services, onQuickView }: ServicesGridProps) {
  if (!services.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
