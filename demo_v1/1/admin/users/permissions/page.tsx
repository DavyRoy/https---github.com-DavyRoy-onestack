"use client";

import React from "react";
import PermissionMatrix from "../components/PermissionMatrix";
import PresetSelector from "../components/PresetSelector";
import { PERMISSIONS, MODULES, ACTIONS } from "@/app/demo/(shared)/users/roles/index";

export default function AdminPermissionsPage() {
  // Локальная копия матрицы — чтобы пресет можно было применить без SSR-расхождений
  const [matrix, setMatrix] = React.useState(PERMISSIONS);

  // Применение пресета: детерминированно формируем матрицу
  const handleApplyPreset = (preset: "Admin" | "Manager" | "User" | "ReadOnly") => {
    const next: Record<string, Record<string, "allow" | "deny" | "own" | "location">> = {};
    const fill = (rules: Partial<Record<string, "allow" | "deny" | "own" | "location">>) => {
      MODULES.forEach((m) => {
        next[m] = {};
        ACTIONS.forEach((a) => {
          next[m][a] = (rules[a] ?? "deny") as any;
        });
      });
    };

    switch (preset) {
      case "Admin":
        fill({ read: "allow", create: "allow", update: "allow", delete: "allow", export: "allow" });
        break;
      case "Manager":
        fill({ read: "allow", create: "allow", update: "allow", delete: "deny", export: "allow" });
        ["users", "settings"].forEach((m) => {
          if (next[m]) {
            next[m].create = "deny";
            next[m].update = "deny";
            next[m].delete = "deny";
            next[m].export = "deny";
          }
        });
        break;
      case "ReadOnly":
        fill({ read: "allow", create: "deny", update: "deny", delete: "deny", export: "deny" });
        ["reports", "orders", "payments"].forEach((m) => {
          if (next[m]) next[m].export = "allow";
        });
        break;
      case "User":
      default:
        fill({ read: "deny", create: "deny", update: "deny", delete: "deny", export: "deny" });
        ["shop.products", "shop.categories", "services", "booking", "reports"].forEach((m) => {
          if (next[m]) next[m].read = "allow";
        });
        break;
    }

    setMatrix(next);
  };

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

      {/* Матрица прав — компонент уже адаптивен (карточки на мобиле, таблица со скроллом на sm+) */}
      <div className="min-w-0">
        <PermissionMatrix modules={MODULES} actions={ACTIONS} matrix={matrix} />
      </div>
    </div>
  );
}