// app/demo/admin/booking/policies/[id]/page.tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { loadPolicies } from "@/app/demo/(shared)/booking";
import PoliciesForm from "@/app/demo/admin/booking/components/PoliciesForm";

function TypeBadge({ v }: { v: string }) {
  const map: Record<string, string> = {
    cancel: "Отмена",
    deposit: "Предоплата",
    leadtime: "Lead-time",
    buffer: "Буферы",
    overbooking: "Овербукинг",
    overbook: "Овербукинг",
  };
  return <span className="rounded px-2 py-0.5 text-xs bg-white/10">{map[v] ?? v}</span>;
}

function LevelBadge({ v }: { v: string }) {
  const map: Record<string, string> = {
    org: "Орг.",
    location: "Локация",
    category: "Категория",
    service: "Услуга",
    resource: "Ресурс",
  };
  return <span className="rounded px-2 py-0.5 text-xs bg-white/10">{map[v] ?? v}</span>;
}

export default function AdminPolicyEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // грузим и ищем
  const rows = loadPolicies();
  const found = rows.find((p) => p.id === id);

  if (!found) {
    return (
      <div className="grid gap-4">
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="text-sm">Политика не найдена</div>
          <button
            onClick={() => router.push("/demo/admin/booking/policies")}
            className="mt-3 rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06] text-sm"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  // 🔧 Совместимость: PoliciesForm ожидает `scope`, данные хранят `level`
  const initialForForm = React.useMemo(() => {
    const scope = (found as any).scope ?? (found as any).level ?? "org";
    // гарантируем объект params
    const params = found.params && typeof found.params === "object" ? found.params : {};
    return { ...found, scope, params } as any;
  }, [found]);

  const level = (found as any).level ?? (found as any).scope ?? "org";

  return (
    <div className="grid gap-6">
      {/* header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs text-white/60">Политики</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            {found.name}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-white/70">
            <TypeBadge v={found.type as string} />
            <LevelBadge v={level as string} />
            <span
              className={`rounded px-2 py-0.5 ${
                found.active ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/70"
              }`}
            >
              {found.active ? "Активна" : "Отключена"}
            </span>
          </div>
        </div>
        <button
          onClick={() => router.push("/demo/admin/booking/policies")}
          className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06] text-sm"
        >
          К списку
        </button>
      </header>

      {/* form */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <PoliciesForm
          initial={initialForForm}
          onSaved={(savedId) => router.push(`/demo/admin/booking/policies/${savedId}`)}
        />
      </section>
    </div>
  );
}