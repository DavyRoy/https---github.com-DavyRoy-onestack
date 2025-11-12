"use client";

export default function AccessHero() {
  return (
    <header
      className="
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-4 md:p-5 min-w-0
      "
    >
      <h1
        className="
          text-xl md:text-2xl font-semibold tracking-tight
          break-words
        "
      >
        Пользователи и роли
      </h1>

      <p
        className="
          text-white/70 mt-1 text-sm md:text-base
          break-words
        "
      >
        Управляйте доступом, двухфакторной аутентификацией и разрешениями.
      </p>
    </header>
  );
}