"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UsersFiltersBar() {
  const sp = useSearchParams();
  const router = useRouter();

  const initialQ = sp.get("q") ?? "";
  const [q, setQ] = React.useState(initialQ);

  const changed = q !== initialQ;

  const apply = React.useCallback(() => {
    const params = new URLSearchParams(sp.toString());
    q.trim() ? params.set("q", q.trim()) : params.delete("q");
    router.push(`/demo/admin/users/list?${params.toString()}`);
  }, [q, sp, router]);

  const reset = React.useCallback(() => {
    setQ("");
    router.push("/demo/admin/users/list");
  }, [router]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      apply();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      className="
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-3 md:p-4 flex flex-col sm:flex-row gap-2 sm:items-center
        w-full max-w-full min-w-0
      "
      aria-label="Панель фильтров пользователей"
    >
      {/* Поле поиска */}
      <div className="flex-1 min-w-0">
        <label htmlFor="user-search" className="sr-only">
          Поиск пользователей
        </label>
        <input
          id="user-search"
          type="search"
          className="
            flex-1 bg-transparent border border-white/20 rounded-lg
            px-3 py-2 text-sm text-white/90 outline-none w-full
            focus:ring-2 focus:ring-white/20
          "
          placeholder="Поиск (имя, email)…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKey}
          aria-label="Введите имя или email для поиска"
        />
      </div>

      {/* Кнопки управления */}
      <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
        <button
          type="submit"
          disabled={!changed}
          className={`flex-1 sm:flex-none rounded-lg border px-3 py-2 text-sm transition
            ${
              changed
                ? "border-white/20 hover:bg-white/[0.08]"
                : "border-white/10 text-white/40 cursor-not-allowed"
            }`}
          aria-disabled={!changed}
        >
          Применить
        </button>

        <button
          type="button"
          onClick={reset}
          disabled={!q}
          className={`flex-1 sm:flex-none rounded-lg border px-3 py-2 text-sm transition
            ${
              q
                ? "border-white/20 hover:bg-white/[0.08]"
                : "border-white/10 text-white/40 cursor-not-allowed"
            }`}
          aria-disabled={!q}
        >
          Сброс
        </button>
      </div>
    </form>
  );
}