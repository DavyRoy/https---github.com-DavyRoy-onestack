"use client";

export default function AuditHero() {
  return (
    <section
      role="banner"
      aria-labelledby="audit-hero-title"
      className="
        admin-section border-white/12 bg-white/8
        p-4 sm:p-5 md:p-6 rounded-2xl
      "
    >
      <h1
        id="audit-hero-title"
        className="text-xl sm:text-2xl font-semibold leading-snug break-words"
      >
        Аудит и здоровье системы
      </h1>

      <p
        className="
          text-sm text-white/70 mt-1 leading-relaxed max-w-prose
        "
      >
        События по всем модулям, статусы интеграций и&nbsp;SLO.
      </p>
    </section>
  );
}