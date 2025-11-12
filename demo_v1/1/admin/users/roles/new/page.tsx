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

export default function AdminRoleNewPage() {
  // Демо-заготовка новой роли
  const draftRole = { id: "", name: "Новая роль", description: "" };

  // Локальная матрица прав
  const [matrix, setMatrix] = React.useState<
    Record<string, Record<string, Rule>>
  >(PERMISSIONS);

  const applyPreset = (presetId: "Admin" | "Manager" | "ReadOnly" | "User") => {
    const next: Record<string, Record<string, Rule>> = {};
    const fill = (ruleByAction: Partial<Record<string, Rule>>) => {
      MODULES.forEach((m) => {
        next[m] = {};
        ACTIONS.forEach((a) => {
          next[m][a] = (ruleByAction[a] ?? "deny") as Rule;
        });
      });
    };

    switch (presetId) {
      case "Admin":
        fill({
          read: "allow",
          create: "allow",
          update: "allow",
          delete: "allow",
          export: "allow",
        });
        break;
      case "Manager":
        fill({
          read: "allow",
          create: "allow",
          update: "allow",
          delete: "deny",
          export: "allow",
        });
        ["users", "settings"].forEach((m) => {
          if (!next[m]) return;
          next[m].create = "deny";
          next[m].update = "deny";
          next[m].delete = "deny";
          next[m].export = "deny";
        });
        break;
      case "ReadOnly":
        fill({
          read: "allow",
          create: "deny",
          update: "deny",
          delete: "deny",
          export: "deny",
        });
        ["reports", "orders", "payments"].forEach((m) => {
          if (next[m]) next[m].export = "allow";
        });
        break;
      case "User":
      default:
        fill({
          read: "deny",
          create: "deny",
          update: "deny",
          delete: "deny",
          export: "deny",
        });
        ["shop.products", "shop.categories", "services", "booking", "reports"].forEach(
          (m) => {
            if (next[m]) next[m].read = "allow";
          }
        );
        break;
    }
    setMatrix(next);
  };

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
            Название и описание роли. Ниже — пресет прав и матрица, прокручиваемая по
            горизонтали на узких экранах.
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