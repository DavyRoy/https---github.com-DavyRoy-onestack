// app/demo/admin/users/list/[id]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { USERS } from "@/app/demo/(shared)/users/data/index";
import UserHeader from "../../components/UserHeader";
import UserProfileForm from "../../components/UserProfileForm";
import UserSecurityCard from "../../components/UserSecurityCard";
import UserRolesCard from "../../components/UserRolesCard";
import UserActivityCard from "../../components/UserActivityCard";

export default function AdminUserCardPage() {
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const user = React.useMemo(
    () => USERS.find((u) => u.id === id),
    [id]
  );

  if (!id || !user) {
    return (
      <section className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 md:p-5 w-full max-w-full min-w-0">
        <div className="text-white/80 mb-2">Пользователь не найден.</div>
        <Link
          className="inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline text-sm text-white/90"
          href="/demo/admin/users/list"
          aria-label="Вернуться к списку пользователей"
        >
          ← Вернуться к списку
        </Link>
      </section>
    );
  }

  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Заголовок */}
      <div className="min-w-0">
        <UserHeader user={user} />
      </div>

      {/* Контент */}
      <div className="grid gap-4 md:grid-cols-3 min-w-0">
        {/* Левая колонка */}
        <div className="md:col-span-2 grid gap-4 min-w-0">
          <UserProfileForm user={user} />
          <UserActivityCard userId={user.id} />
        </div>

        {/* Правая колонка */}
        <div className="grid gap-4 min-w-0">
          <UserSecurityCard user={user} />
          <UserRolesCard user={user} />
        </div>
      </div>
    </div>
  );
}