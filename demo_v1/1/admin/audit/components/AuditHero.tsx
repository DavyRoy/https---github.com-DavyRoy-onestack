"use client";

export default function AuditHero() {
  return (
    <section
      className="
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-4 sm:p-5 md:p-6
        w-full max-w-full min-w-0
      "
      aria-labelledby="audit-hero-title"
    >
      <h1
        id="audit-hero-title"
        className="text-xl sm:text-2xl font-semibold leading-snug break-words"
      >
        Аудит и здоровье системы
      </h1>
      <p className="text-sm text-white/70 mt-1 leading-relaxed">
        События по всем модулям, статусы интеграций и&nbsp;SLO.
      </p>
    </section>
  );
}