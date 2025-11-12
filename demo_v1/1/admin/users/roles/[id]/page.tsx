"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import RoleEditor from "../../components/RoleEditor";
import RoleMembersTable from "../../components/RoleMembersTable";
import { ROLES } from "@/app/demo/(shared)/users/roles/roles";
import { USERS } from "@/app/demo/(shared)/users/data/index";

export default function AdminRoleCardPage() {
  const { id } = useParams<{ id: string }>();
  const role = ROLES.find((r) => r.id === id);

  if (!role) {
    return (
      <div className="p-4">
        <div className="mb-2">Роль не найдена.</div>
        <Link className="underline" href="/demo/admin/users/roles">
          ← К списку ролей
        </Link>
      </div>
    );
  }

  const members = USERS.filter((u) => u.roles.includes(role.id));

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
          <h1 className="text-xl md:text-2xl font-semibold mt-1 truncate">
            {role.name}
          </h1>
          {role.description && (
            <p className="text-white/60 text-sm mt-1 break-words">
              {role.description}
            </p>
          )}
        </div>
        <div className="text-sm text-white/60">
          Участников: <span className="text-white/85">{members.length}</span>
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