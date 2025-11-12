// src/app/demo/manager/booking/page.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Plus, Upload, CalendarDays } from "lucide-react";
import { toast } from "sonner";

import BookingFiltersBar from "@/app/demo/manager/booking/components/BookingFiltersBar";
import BookingsTable from "@/app/demo/manager/booking/components/BookingsTable";
import { useBookingsData } from "@/app/demo/manager/booking/hooks/useBookingsData";

const T = {
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm shadow-xl",
  btn:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[38px] whitespace-nowrap",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[38px] whitespace-nowrap",
  dim: "text-white/70",
};

export default function BookingListPage() {
  const router = useRouter();
  const search = useSearchParams();

  const {
    loading,
    data,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    filters,
    setFilters,
    refresh,
    updateStatus,
    assignStaff,
  } = useBookingsData({
    sort: (search.get("sort") as any) || "startAt_asc",
  });

  // Выбор строк (для массовых действий)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const onToggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)
    );
  };
  const onToggleAll = (ids: string[], checked: boolean) => {
    if (!Array.isArray(ids) || ids.length === 0) return;
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, ...ids])) : prev.filter((x) => !ids.includes(x))
    );
  };
  const clearSelection = () => setSelectedIds([]);

  // Массовые операции (демо)
  const bulkConfirm = () => {
    selectedIds.forEach((id) => updateStatus(id, "confirmed"));
    toast.success(`Подтверждено: ${selectedIds.length}`);
    clearSelection();
  };
  const bulkCancel = () => {
    selectedIds.forEach((id) => updateStatus(id, "cancelled"));
    toast.success(`Отменено: ${selectedIds.length}`);
    clearSelection();
  };
  const bulkExport = () => {
    toast.message(`Экспортировано: ${selectedIds.length} (демо)`);
  };

  // Безопасные дефолты пагинации
  const safeTotal = typeof total === "number" ? total : (data?.length ?? 0);
  const safePage = typeof page === "number" && page > 0 ? page : 1;
  const safePageSize = typeof pageSize === "number" && pageSize > 0 ? pageSize : 25;

  // IDs текущей страницы (для «выбрать все»)
  const currentPageIds = useMemo(() => (Array.isArray(data) ? data.map((r: any) => r.id) : []), [data]);

  return (
    <div className="grid gap-6">
      {/* Хедер */}
      <header className={T.hero} aria-labelledby="booking-title">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 id="booking-title" className="text-2xl md:text-3xl font-semibold tracking-tight">
              Бронирование
            </h1>
            <p className={"mt-1 text-sm " + T.dim}>
              Список записей: подтверждение, перенос, отмена, массовые действия
            </p>
          </div>

          {/* Десктопные действия */}
          <div className="hidden md:flex gap-2">
            <Link
              href="/demo/manager/booking/new"
              prefetch={false}
              className={T.btnPrimary}
              aria-label="Создать запись"
            >
              <Plus width={16} height={16} />
              Создать запись
            </Link>
            <Link
              href="/demo/manager/calendar"
              prefetch={false}
              className={T.btn}
              aria-label="Открыть календарь"
            >
              <CalendarDays width={16} height={16} />
              Календарь
            </Link>
            <button
              className={T.btn}
              onClick={() => toast.message("CSV сформирован (демо)")}
              aria-label="Экспорт в CSV"
            >
              <Upload width={16} height={16} />
              Экспорт
            </button>
          </div>
        </div>
      </header>

      {/* Панель фильтров */}
      <BookingFiltersBar
        value={filters as any}
        onChange={(next: any) => {
          setFilters(next);
          // при смене фильтров очищаем выделение
          clearSelection();
        }}
        onReset={() => {
          setFilters({});
          clearSelection();
        }}
        onRefresh={() => {
          refresh();
          toast.success("Обновлено");
        }}
      />

      {/* Таблица */}
      <BookingsTable
        loading={!!loading}
        rows={(data as any) || []}
        // выбор строк
        selectedIds={selectedIds}
        onToggleRow={onToggleRow}
        onToggleAll={(checked: boolean) => onToggleAll(currentPageIds, checked)}
        onClearSelection={clearSelection}
        // пагинация/сортировка
        page={safePage}
        pageSize={safePageSize}
        total={safeTotal}
        onPageChange={(p: number) => setPage?.(p)}
        onPageSizeChange={(ps: number) => setPageSize?.(ps)}
        sort={(filters.sort as string) || "startAt_asc"}
        onSortChange={(s: string) => setFilters({ ...filters, sort: s })}
        // действия по строкам
        onOpen={(id: string) => router.push(`/demo/manager/booking/${id}`)}
        onReschedule={(id: string) => router.push(`/demo/manager/booking/reschedule/${id}`)}
        onConfirm={(id: string) => updateStatus(id, "confirmed")}
        onCancel={(id: string) => updateStatus(id, "cancelled")}
        onComplete={(id: string) => updateStatus(id, "completed")}
        onNoShow={(id: string) => updateStatus(id, "noshow")}
        onAssignStaff={(id: string, staffId: string, staffName?: string) =>
          assignStaff(id, staffId, staffName)
        }
        // массовые действия (для нижней панели таблицы)
        bulkActions={{
          onConfirm: bulkConfirm,
          onCancel: bulkCancel,
          onExport: bulkExport,
        }}
      />

      {/* Мобильные действия (дубли сверху) */}
      <div className="md:hidden sticky bottom-3 z-10 grid grid-cols-3 gap-2 px-1">
        <Link
          href="/demo/manager/booking/new"
          prefetch={false}
          className={T.btnPrimary + " col-span-2"}
          aria-label="Создать запись"
        >
          <Plus width={16} height={16} />
          Новая запись
        </Link>
        <Link
          href="/demo/manager/calendar"
          prefetch={false}
          className={T.btn}
          aria-label="Открыть календарь"
        >
          <CalendarDays width={16} height={16} />
          Календарь
        </Link>
        {/* Вторая строка — только экспорт, если нужен */}
        <button
          className={T.btn + " col-span-3"}
          onClick={() => toast.message("CSV сформирован (демо)")}
          aria-label="Экспорт в CSV"
        >
          <Upload width={16} height={16} />
          Экспорт
        </button>
      </div>
    </div>
  );
}