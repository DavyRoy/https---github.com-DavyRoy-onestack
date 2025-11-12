"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { USERS } from "@/app/demo/(shared)/users/data/index";
import UserHeader from "../../components/UserHeader";
import UserProfileForm from "../../components/UserProfileForm";
import UserSecurityCard from "../../components/UserSecurityCard";
import UserRolesCard from "../../components/UserRolesCard";
import UserActivityCard from "../../components/UserActivityCard";

export default function AdminUserCardPage() {
  const { id } = useParams<{ id: string }>();
  const user = USERS.find((u) => u.id === id);

  if (!user) {
    return (
      <div
        className="
          p-4 w-full max-w-full min-w-0
          supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
        "
      >
        <div className="mb-3">Пользователь не найден.</div>
        <Link className="underline" href="/demo/admin/users/list">
          ← Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      <div className="min-w-0">
        <UserHeader user={user} />
      </div>

      <div className="grid gap-4 md:grid-cols-3 min-w-0">
        <div className="md:col-span-2 grid gap-4 min-w-0">
          <UserProfileForm user={user} />
          <UserActivityCard userId={user.id} />
        </div>

        <div className="grid gap-4 min-w-0">
          <UserSecurityCard user={user} />
          <UserRolesCard user={user} />
        </div>
      </div>
    </div>
  );
}