"use client";

import React from "react";

export default function AccessHero() {
  return (
    <header
      aria-label="Раздел управления пользователями и ролями"
      className="
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-4 md:p-5 min-w-0
        shadow-sm backdrop-blur-sm
      "
    >
      <h1
        className="
          text-xl md:text-2xl font-semibold tracking-tight
          text-white leading-tight break-words
        "
      >
        Пользователи и роли
      </h1>

      <p
        className="
          text-white/70 mt-2 text-sm md:text-base
          leading-relaxed break-words max-w-prose
        "
      >
        Управляйте доступом, двухфакторной аутентификацией и разрешениями
        пользователей вашей организации.
      </p>

      <span className="sr-only">
        Основной раздел для администраторов: управление пользователями, ролями и правами доступа.
      </span>
    </header>
  );
}