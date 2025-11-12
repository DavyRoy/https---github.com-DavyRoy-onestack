"use client";

import ServiceCard, { ServiceEntity } from "./ServiceCard";

type Props = {
  services?: (ServiceEntity | undefined | null)[];
  onBook?: (id: string) => void;
  onOpen?: (id: string) => void;
  onSchedule?: (id: string) => void;
};

export default function ServicesGrid({ services, onBook, onOpen, onSchedule }: Props) {
  // Жёсткая нормализация входных данных
  const items: ServiceEntity[] = (services ?? []).filter(
    (s): s is ServiceEntity => !!s && typeof s.id === "string"
  );

  if (items.length === 0) {
    // отдавать пустой контейнер — родитель покажет EmptyState
    return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <ServiceCard
          key={s.id}
          service={s}
          onBook={onBook}
          onOpen={onOpen}
          onSchedule={onSchedule}
        />
      ))}
    </div>
  );
}