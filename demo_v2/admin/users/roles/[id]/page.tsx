// app/demo/admin/users/roles/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import RoleEditor from "../../components/RoleEditor";
import RoleMembersTable from "../../components/RoleMembersTable";
import { ROLES } from "@/app/demo/(shared)/users/roles/roles";
import { USERS } from "@/app/demo/(shared)/users/data/index";

export default function AdminRoleCardPage() {
  const params = useParams<{ id: string | string[] }>();
  const roleId = Array.isArray(params.id) ? params.id[0] : params.id;

  const role = ROLES.find((r) => r.id === roleId);

  if (!role) {
    return (
      <div
        className="
          rounded-2xl border border-white/15 bg-white/[0.04]
          p-4 md:p-5 text-white/70
          w-full max-w-full min-w-0
        "
      >
        <div className="mb-2">Роль не найдена.</div>
        <Link className="underline" href="/demo/admin/users/roles">
          ← К списку ролей
        </Link>
      </div>
    );
  }

  const members = USERS.filter((u) => Array.isArray(u.roles) && u.roles.includes(role.id));

  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Заголовок */}
      <header
        className="
          flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2
          min-w-0
        "
      >
        <div className="min-w-0">
          <div className="text-sm text-white/60">
            <Link href="/demo/admin/users/roles" className="hover:underline">
              ← Роли
            </Link>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold mt-1 truncate">
            {role.name}
          </h1>
          {role.description && (
            <p className="text-white/60 text-sm mt-1 break-words">{role.description}</p>
          )}
        </div>

        <div
          className="text-sm text-white/60"
          aria-live="polite"
          aria-atomic="true"
        >
          Участников: <span className="text-white/85 font-medium">{members.length}</span>
        </div>
      </header>

      {/* Редактор роли */}
      <div className="min-w-0">
        <RoleEditor role={role} />
      </div>

      {/* Участники */}
      <div className="min-w-0">
        <RoleMembersTable members={members} />
      </div>
    </div>
  );
}