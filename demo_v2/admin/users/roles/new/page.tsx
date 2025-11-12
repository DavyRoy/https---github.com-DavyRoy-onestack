// app/demo/admin/users/roles/new/page.tsx
"use client";

import React from "react";
import Link from "next/link";

/* Components */
import RoleEditor from "../../components/RoleEditor";
import PermissionMatrix from "../../components/PermissionMatrix";
import PresetSelector from "../../components/PresetSelector";

/* RBAC data */
import {
  MODULES,
  ACTIONS,
  PERMISSIONS,
} from "@/app/demo/(shared)/users/roles";

type Rule = "allow" | "deny" | "own" | "location";
type Matrix = Record<string, Record<string, Rule>>;

// безопасное глубокое копирование исходной матрицы,
// чтобы не мутировать импортированный объект
const cloneMatrix = (m: Matrix): Matrix => {
  // structuredClone доступен в современных окружениях; fallback — JSON
  try {
    // @ts-ignore
    return typeof structuredClone === "function" ? structuredClone(m) : JSON.parse(JSON.stringify(m));
  } catch {
    return JSON.parse(JSON.stringify(m));
  }
};

// заполняем матрицу для всех модулей/действий
const buildMatrix = (ruleByAction: Partial<Record<string, Rule>>): Matrix => {
  const next: Matrix = {};
  for (const mod of MODULES) {
    next[mod] = {};
    for (const act of ACTIONS) {
      next[mod][act] = (ruleByAction[act] ?? "deny") as Rule;
    }
  }
  return next;
};

export default function AdminRoleNewPage() {
  // Демо-заготовка новой роли
  const draftRole = React.useMemo(() => ({ id: "", name: "Новая роль", description: "" }), []);

  // Локальная матрица прав
  const [matrix, setMatrix] = React.useState<Matrix>(() => cloneMatrix(PERMISSIONS as Matrix));

  const applyPreset = React.useCallback(
    (presetId: "Admin" | "Manager" | "ReadOnly" | "User") => {
      let base = buildMatrix({});
      switch (presetId) {
        case "Admin": {
          base = buildMatrix({
            read: "allow",
            create: "allow",
            update: "allow",
            delete: "allow",
            export: "allow",
          });
          break;
        }
        case "Manager": {
          base = buildMatrix({
            read: "allow",
            create: "allow",
            update: "allow",
            delete: "deny",
            export: "allow",
          });
          // ограничим чувствительные модули
          for (const m of ["users", "settings"]) {
            if (!base[m]) continue;
            base[m].create = "deny";
            base[m].update = "deny";
            base[m].delete = "deny";
            base[m].export = "deny";
          }
          break;
        }
        case "ReadOnly": {
          base = buildMatrix({
            read: "allow",
            create: "deny",
            update: "deny",
            delete: "deny",
            export: "deny",
          });
          // позволим экспорт в наблюдательных модулях
          for (const m of ["reports", "orders", "payments"]) {
            if (base[m]) base[m].export = "allow";
          }
          break;
        }
        case "User":
        default: {
          base = buildMatrix({
            read: "deny",
            create: "deny",
            update: "deny",
            delete: "deny",
            export: "deny",
          });
          for (const m of ["shop.products", "shop.categories", "services", "booking", "reports"]) {
            if (base[m]) base[m].read = "allow";
          }
          break;
        }
      }
      setMatrix(base);
    },
    []
  );

  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Заголовок */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <div className="text-sm text-white/60">
            <Link href="/demo/admin/users/roles" className="hover:underline">
              ← Роли
            </Link>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold mt-1">Создать роль</h1>
          <p className="text-white/60 text-sm mt-1">
            Название и описание роли. Ниже — пресет прав и матрица (на узких экранах
            прокручивается горизонтально).
          </p>
        </div>
      </header>

      {/* Форма новой роли */}
      <div className="min-w-0">
        <RoleEditor role={draftRole} />
      </div>

      {/* Пресеты + Матрица прав */}
      <section className="grid gap-3 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-sm text-white/70">Разрешения (RBAC)</div>
          <PresetSelector onApply={applyPreset} />
        </div>

        {/* Внешний контейнер, чтобы исключить «проталкивание» вьюпорта */}
        <div className="-mx-3 md:mx-0">
          <div className="px-3 md:px-0">
            <PermissionMatrix modules={MODULES} actions={ACTIONS} matrix={matrix} />
          </div>
        </div>
      </section>

      {/* Кнопки действий */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => alert("Сохранено (демо)")}
          className="rounded-lg bg-white/90 text-black px-3 py-2 text-sm hover:bg-white"
        >
          Создать роль
        </button>
        <Link
          href="/demo/admin/users/roles"
          className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/[0.08] text-center"
        >
          Отмена
        </Link>
      </div>
    </div>
  );
}