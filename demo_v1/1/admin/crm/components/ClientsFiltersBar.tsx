"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ClientsFiltersBar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // локальное состояние берём из URL; при смене URL синхронизируем
  const [q, setQ] = React.useState<string>(sp.get("q") ?? "");
  React.useEffect(() => {
    setQ(sp.get("q") ?? "");
  }, [sp]);

  function apply() {
    const next = new URLSearchParams(sp.toString());
    if (q && q.trim()) next.set("q", q.trim());
    else next.delete("q");
    // при изменении фильтров сбрасываем пагинацию (если есть)
    next.delete("page");
    const url = `${pathname}?${next.toString()}`;
    router.replace(url);
  }

  function reset() {
    const next = new URLSearchParams(sp.toString());
    ["q", "tag", "segment", "created", "active", "churn", "sort", "page"].forEach((k) =>
      next.delete(k)
    );
    setQ("");
    const url = next.toString() ? `${pathname}?${next.toString()}` : pathname;
    router.replace(url);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 flex flex-col sm:flex-row sm:items-center gap-2"
      role="search"
      aria-label="Фильтры клиентов"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск: имя / e-mail / телефон"
        className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm flex-1 min-w-[220px]"
        aria-label="Строка поиска клиентов"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-3 py-2 text-sm rounded-lg border border-white/20 hover:bg-white/10"
          disabled={(sp.get("q") ?? "") === (q ?? "")}
          aria-disabled={(sp.get("q") ?? "") === (q ?? "")}
          title="Применить фильтр"
        >
          Применить
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-3 py-2 text-sm rounded-lg border border-white/20 hover:bg-white/10"
          title="Сбросить все фильтры"
        >
          Сброс
        </button>
      </div>
    </form>
  );
}