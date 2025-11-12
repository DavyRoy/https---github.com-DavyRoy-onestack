"use client";

import React from "react";
import { ROLES } from "@/app/demo/(shared)/users/roles/roles";

type User = { id?: string; roles?: string[] };

export default function UserRolesCard({
  user,
  onChange,
}: {
  user: User;
  onChange?: (nextRoles: string[]) => void;
}) {
  const all = ROLES; // [{ id, name }]
  const [assigned, setAssigned] = React.useState<string[]>(user.roles ?? []);
  const [selected, setSelected] = React.useState<string>("");

  // если родитель поменял список ролей — синхронизируемся
  React.useEffect(() => {
    setAssigned(user.roles ?? []);
  }, [user.roles]);

  const byId = React.useMemo(
    () => Object.fromEntries(all.map((r: any) => [r.id, r])),
    [all]
  );

  const available = all.filter((r: any) => !assigned.includes(r.id));

  function commit(next: string[]) {
    setAssigned(next);
    if (onChange) onChange(next);
    else alert("Демо: роли обновлены");
  }

  function addRole() {
    const id = selected || available[0]?.id;
    if (!id) return;
    if (assigned.includes(id)) return;
    commit([...assigned, id]);
    setSelected("");
  }

  function removeRole(id: string) {
    commit(assigned.filter((x) => x !== id));
  }

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0">
      <div className="text-sm text-white/70 mb-3">Роли</div>

      {/* Текущие роли */}
      {assigned.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {assigned.map((rid) => {
            const r = byId[rid];
            return (
              <span
                key={rid}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-white/20 bg-white/[0.03] text-white/80"
                title={r ? r.name : rid}
              >
                {r ? r.name : `#${rid}`}
                <button
                  type="button"
                  onClick={() => removeRole(rid)}
                  className="ml-1 opacity-70 hover:opacity-100"
                  aria-label={`Удалить роль ${r ? r.name : rid}`}
                  title="Удалить"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-white/50 italic">Нет назначенных ролей</div>
      )}

      {/* Добавление новой роли */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <label className="sr-only" htmlFor="role-select">
          Роль
        </label>
        <select
          id="role-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full sm:w-auto bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-white/90 outline-none focus:ring-2 focus:ring-white/20"
        >
          {/* показываем placeholder, если ничего не выбрано */}
          <option value="" disabled={available.length === 0}>
            {available.length ? "Выберите роль…" : "Все роли назначены"}
          </option>
          {available.map((r: any) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={addRole}
          disabled={available.length === 0}
          className={`w-full sm:w-auto rounded-lg border px-4 py-2 text-sm transition
            ${
              available.length === 0
                ? "border-white/10 text-white/40 bg-white/[0.04] cursor-not-allowed"
                : "border-white/20 hover:bg-white/[0.08]"
            }`}
        >
          Добавить
        </button>
      </div>
    </section>
  );
}