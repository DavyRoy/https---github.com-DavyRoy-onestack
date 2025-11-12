// app/demo/admin/users/permissions/page.tsx
"use client";

import React from "react";
import PermissionMatrix from "../components/PermissionMatrix";
import PresetSelector from "../components/PresetSelector";
import { PERMISSIONS, MODULES, ACTIONS } from "@/app/demo/(shared)/users/roles";

type Rule = "allow" | "deny" | "own" | "location";
type Matrix = Record<string, Record<string, Rule>>;

const cloneMatrix = (m: Matrix): Matrix => {
  try {
    // @ts-ignore
    return typeof structuredClone === "function" ? structuredClone(m) : JSON.parse(JSON.stringify(m));
  } catch {
    return JSON.parse(JSON.stringify(m));
  }
};

const buildMatrix = (rules: Partial<Record<string, Rule>>): Matrix => {
  const next: Matrix = {};
  for (const m of MODULES) {
    next[m] = {};
    for (const a of ACTIONS) next[m][a] = (rules[a] ?? "deny") as Rule;
  }
  return next;
};

export default function AdminPermissionsPage() {
  // Локальная копия, чтобы не мутировать импорт
  const [matrix, setMatrix] = React.useState<Matrix>(() => cloneMatrix(PERMISSIONS as Matrix));

  // Применение пресета: детерминированно формируем матрицу
  const handleApplyPreset = React.useCallback(
    (preset: "Admin" | "Manager" | "User" | "ReadOnly") => {
      let next = buildMatrix({});
      switch (preset) {
        case "Admin":
          next = buildMatrix({
            read: "allow",
            create: "allow",
            update: "allow",
            delete: "allow",
            export: "allow",
          });
          break;

        case "Manager":
          next = buildMatrix({
            read: "allow",
            create: "allow",
            update: "allow",
            delete: "deny",
            export: "allow",
          });
          for (const m of ["users", "settings"]) {
            if (!next[m]) continue;
            next[m].create = "deny";
            next[m].update = "deny";
            next[m].delete = "deny";
            next[m].export = "deny";
          }
          break;

        case "ReadOnly":
          next = buildMatrix({
            read: "allow",
            create: "deny",
            update: "deny",
            delete: "deny",
            export: "deny",
          });
          for (const m of ["reports", "orders", "payments"]) {
            if (next[m]) next[m].export = "allow";
          }
          break;

        case "User":
        default:
          next = buildMatrix({
            read: "deny",
            create: "deny",
            update: "deny",
            delete: "deny",
            export: "deny",
          });
          for (const m of ["shop.products", "shop.categories", "services", "booking", "reports"]) {
            if (next[m]) next[m].read = "allow";
          }
          break;
      }
      setMatrix(next);
    },
    []
  );

  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Хедер: адаптивный */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
        <h1 className="text-xl md:text-2xl font-semibold">Права (RBAC)</h1>
        <div className="min-w-0 sm:min-w-[unset]">
          <PresetSelector onApply={handleApplyPreset} />
        </div>
      </header>

      {/* Матрица прав — карточки на мобиле, таблица со скроллом на sm+ */}
      <div className="min-w-0">
        <PermissionMatrix modules={MODULES} actions={ACTIONS} matrix={matrix} />
      </div>
    </div>
  );
}