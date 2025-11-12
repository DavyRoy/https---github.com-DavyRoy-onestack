"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Plus } from "lucide-react";

import ServicesFiltersBar, {
  FiltersState,
} from "@/app/demo/manager/services/components/ServicesFiltersBar";
import ServicesGrid from "@/app/demo/manager/services/components/ServicesGrid";
import ServicesTable from "@/app/demo/manager/services/components/ServicesTable";
import EmptyState from "@/app/demo/manager/services/components/EmptyState";
import Skeletons from "@/app/demo/manager/services/components/Skeletons";
import { ServiceEntity } from "@/app/demo/manager/services/components/ServiceCard";

// ⬇️ МОК-ДАННЫЕ
import { services as rawServices } from "@/app/demo/manager/services/data/mockServices";

const T = {
  page: "grid gap-6",
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm shadow-xl",
  card:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm shadow-md",
  chip:
    "inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/80",
  btn:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-black hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/30",
  dim: "text-white/70",
};

function coerceArray(arr: any): ServiceEntity[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter(
    (s): s is ServiceEntity =>
      !!s &&
      typeof s.id === "string" &&
      typeof s.title === "string" &&
      typeof s.price === "number" &&
      typeof s.duration === "number"
  );
}

export default function ManagerServicesPage() {
  const router = useRouter();
  const search = useSearchParams();

  // чтобы не ловить hydration mismatch (разные локали/параметры)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // безопасно нормализуем мок-данные
  const servicesAll: ServiceEntity[] = useMemo(
    () => coerceArray(rawServices),
    []
  );

  // локальный режим списка (grid/table) храню в url (?view=grid|table), но читаю через эффект
  const [view, setView] = useState<"grid" | "table">("grid");
  useEffect(() => {
    const v = (search.get("view") || "grid").toLowerCase();
    setView(v === "table" ? "table" : "grid");
  }, [search]);

  // фильтры из строки запроса → объект
  const parsedFilters: FiltersState = useMemo(() => {
    // любой парсинг делаем детерминированно
    const obj: FiltersState = {
      q: search.get("q") || "",
      cat: search.get("cat") || "",
      dur_to: search.get("dur_to") || "",
      price_from: search.get("price_from") || "",
      price_to: search.get("price_to") || "",
      status: search.get("status") || "",
      staff: search.get("staff") || "",
      sort: search.get("sort") || "popular",
      popular: search.get("popular") === "1",
      seasonal: search.get("seasonal") === "1",
    };
    return obj;
  }, [search]);

  // функция смены фильтров → обновляет URL (и историю)
  const applyFilters = (next: Partial<FiltersState>) => {
    const current = new URLSearchParams(search.toString());

    const setOrDel = (key: string, val?: string | boolean) => {
      if (val === undefined || val === "" || val === false) current.delete(key);
      else current.set(key, String(val));
    };

    // переносим поля
    setOrDel("q", next.q ?? parsedFilters.q);
    setOrDel("cat", next.cat ?? parsedFilters.cat);
    setOrDel("dur_to", next.dur_to ?? parsedFilters.dur_to);
    setOrDel("price_from", next.price_from ?? parsedFilters.price_from);
    setOrDel("price_to", next.price_to ?? parsedFilters.price_to);
    setOrDel("status", next.status ?? parsedFilters.status);
    setOrDel("staff", next.staff ?? parsedFilters.staff);
    setOrDel("sort", next.sort ?? parsedFilters.sort);
    setOrDel("popular", (next.popular ?? parsedFilters.popular) ? "1" : "");
    setOrDel("seasonal", (next.seasonal ?? parsedFilters.seasonal) ? "1" : "");

    router.replace(`?${current.toString()}`);
  };

  const resetFilters = () => {
    router.replace("?"); // чистый URL
  };

  // фильтрация — СТРОГО boolean-возврат
  const filtered: ServiceEntity[] = useMemo(() => {
    const s = servicesAll;

    const byQuery = (x: ServiceEntity) => {
      const q = parsedFilters.q.trim().toLowerCase();
      if (!q) return true;
      return (
        x.title.toLowerCase().includes(q) ||
        (x.description || "").toLowerCase().includes(q) ||
        (x.category || "").toLowerCase().includes(q) ||
        (x.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    };

    const byCat = (x: ServiceEntity) =>
      parsedFilters.cat ? x.category === parsedFilters.cat : true;

    const byDur = (x: ServiceEntity) => {
      const to = Number(parsedFilters.dur_to || 0);
      return to > 0 ? x.duration <= to : true;
    };

    const byPrice = (x: ServiceEntity) => {
      const from = Number(parsedFilters.price_from || 0) || 0;
      const to = Number(parsedFilters.price_to || 0) || 0;
      if (from && x.price < from) return false;
      if (to && x.price > to) return false;
      return true;
    };

    const byStatus = (x: ServiceEntity) =>
      parsedFilters.status ? x.status === parsedFilters.status : true;

    const byStaff = (_x: ServiceEntity) => {
      // демо: у нас нет настоящего привязания к сотрудникам — пропускаем
      return true;
    };

    const byPopular = (x: ServiceEntity) =>
      parsedFilters.popular ? !!x.popular : true;

    const bySeasonal = (x: ServiceEntity) =>
      parsedFilters.seasonal ? !!x.seasonal : true;

    // сам фильтр
    let arr = s
      .filter(byQuery)
      .filter(byCat)
      .filter(byDur)
      .filter(byPrice)
      .filter(byStatus)
      .filter(byStaff)
      .filter(byPopular)
      .filter(bySeasonal);

    // сортировка
    const sort = parsedFilters.sort || "popular";
    const cmp = new Intl.Collator("ru-RU").compare;

    switch (sort) {
      case "price_asc":
        arr = [...arr].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        arr = [...arr].sort((a, b) => b.price - a.price);
        break;
      case "duration_asc":
        arr = [...arr].sort((a, b) => a.duration - b.duration);
        break;
      case "duration_desc":
        arr = [...arr].sort((a, b) => b.duration - a.duration);
        break;
      case "popular":
        arr = [...arr].sort((a, b) => Number(b.popular) - Number(a.popular) || cmp(a.title, b.title));
        break;
      default:
        // fallback по алфавиту
        arr = [...arr].sort((a, b) => cmp(a.title, b.title));
    }

    return arr;
  }, [servicesAll, parsedFilters]);

  // коллбеки для карточек
  const onBook = (id: string) => {
    window.location.href = `/demo/manager/booking/new?service=${id}`;
  };
  const onOpen = (id: string) => {
    window.location.href = `/demo/manager/services/${id}`;
  };
  const onSchedule = (id: string) => {
    const qs = new URLSearchParams();
    qs.set("service", id);
    window.location.href = `/demo/manager/services/schedule?${qs.toString()}`;
  };

  // --- РЕНДЕР ---

  // показываем скелет до монтирования, чтобы не было дерганья SSR/CSR
  if (!mounted) {
    return (
      <div className={T.page}>
        <header className={T.hero}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Услуги</h1>
              <p className={"mt-1 text-sm " + T.dim}>
                Управляйте перечнем услуг и расписанием.
              </p>
            </div>
          </div>
        </header>
        <Skeletons kind="grid" count={6} />
      </div>
    );
  }

  return (
    <div className={T.page}>
      {/* Header */}
      <header className={T.hero}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Услуги</h1>
            <p className={"mt-1 text-sm " + T.dim}>
              Управляйте перечнем услуг, ценами и доступностью.
            </p>

            {/* Debug мини-лейбл — можно удалить */}
            <div className="mt-2 text-[11px] text-white/60">
              всего: {servicesAll.length} • отфильтровано: {filtered.length}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/demo/manager/services/schedule"
              className={T.btn}
              title="Календарь расписания"
            >
              <CalendarDays width={16} height={16} /> Расписание
            </Link>
            <Link
              href="/demo/manager/services/new"
              className={T.btnPrimary}
              title="Создать услугу (демо)"
            >
              <Plus width={16} height={16} /> Новая услуга
            </Link>
          </div>
        </div>

        {/* Панель фильтров */}
        <div className="mt-4">
          <ServicesFiltersBar
            value={parsedFilters}
            onChange={applyFilters}
            onReset={resetFilters}
            view={view}
            onViewChange={(v) =>
              router.replace(`?${new URLSearchParams({ ...Object.fromEntries(search.entries()), view: v }).toString()}`)
            }
          />
        </div>
      </header>

      {/* Контент */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Услуги не найдены"
          subtitle="Измените фильтры или сбросьте их."
          onReset={resetFilters}
        />
      ) : view === "grid" ? (
        <ServicesGrid
          services={filtered}
          onBook={onBook}
          onOpen={onOpen}
          onSchedule={onSchedule}
        />
      ) : (
        <ServicesTable
          services={filtered}
          onBook={onBook}
          onSchedule={onSchedule}
        />
      )}
    </div>
  );
}