"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function UsersFiltersBar() {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get("q") ?? "");

  const apply = () => {
    const p = new URLSearchParams(sp.toString());
    q ? p.set("q", q) : p.delete("q");
    router.push(`/demo/admin/users/list?${p.toString()}`);
  };

  const reset = () => router.push("/demo/admin/users/list");

  return (
    <div
      className="
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-3 md:p-4 flex flex-col sm:flex-row gap-2 sm:items-center
        w-full max-w-full min-w-0
      "
    >
      {/* Поле поиска */}
      <input
        className="
          flex-1 bg-transparent border border-white/20 rounded-lg
          px-3 py-2 text-sm text-white/90 outline-none w-full
        "
        placeholder="Поиск (имя, email)…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* Кнопки управления */}
      <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
        <button
          onClick={apply}
          className="
            flex-1 sm:flex-none rounded-lg border border-white/20 px-3 py-2
            text-sm hover:bg-white/[0.08] transition
          "
        >
          Применить
        </button>

        <button
          onClick={reset}
          className="
            flex-1 sm:flex-none rounded-lg border border-white/20 px-3 py-2
            text-sm hover:bg-white/[0.08] transition
          "
        >
          Сброс
        </button>
      </div>
    </div>
  );
}