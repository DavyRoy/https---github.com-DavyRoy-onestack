// app/demo/admin/components/AdminTopbar.tsx — без бургера, красивый mobile topbar + full-width desktop
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Home, User, User2, Briefcase, Shield, ChevronDown, Bell } from "lucide-react";
import { useUserStore } from "@/app/demo/store/userStore";
import { shallow } from "zustand/shallow";

export default function AdminTopbar() {
  const router = useRouter();
  const pathname = usePathname();
  const unread = useUserStore(
    useCallback((s) => s.notifications.filter((n) => !n.read).length, []),
    shallow
  );

  const [rolesOpen, setRolesOpen] = useState(false);

  useEffect(() => setRolesOpen(false), [pathname]);

  const currentRole: "user" | "manager" | "admin" =
    pathname?.startsWith("/demo/manager")
      ? "manager"
      : pathname?.startsWith("/demo/admin")
      ? "admin"
      : "user";

  const roleLabel =
    currentRole === "admin" ? "Администратор" : currentRole === "manager" ? "Менеджер" : "Пользователь";

  const switchRole = useCallback(
    (role: "user" | "manager" | "admin") => {
      setRolesOpen(false);
      router.push(`/demo?role=${role}`);
    },
    [router]
  );

  // a11y для меню ролей
  const roleBtnRef = useRef<HTMLButtonElement | null>(null);
  const roleMenuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setRolesOpen(false);
        roleBtnRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      if (!rolesOpen) return;
      const t = e.target as Node;
      if (roleMenuRef.current && !roleMenuRef.current.contains(t) && !roleBtnRef.current?.contains(t)) {
        setRolesOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [rolesOpen]);
  const roleMenuId = useId();

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      {/* full-width контейнер */}
      <div className="mx-auto flex h-14 w-full items-center justify-between px-3 sm:px-6 md:px-8">
        {/* Левый блок: логотип/домой */}
        <div className="flex items-center gap-2">
          <Link
            href="/demo/admin/dashboard"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold"
          >
            <Home width={16} height={16} className="hidden sm:block" />
            <span className="sm:hidden">Admin</span>
            <span className="hidden sm:inline">Demo • Admin</span>
          </Link>
        </div>

        {/* Центр: заголовок на мобильном */}
        <div className="absolute left-1/2 block -translate-x-1/2 text-sm font-medium sm:hidden">
          Панель
        </div>

        {/* Правый блок */}
        <div className="flex items-center gap-2">
          {/* Выбор роли — иконка + лейбл на >=sm, только иконка на xs */}
          <div className="relative">
            <button
              ref={roleBtnRef}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              onClick={() => setRolesOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={rolesOpen}
              aria-controls={roleMenuId}
            >
              <User2 width={16} height={16} />
              <span className="hidden sm:inline">{roleLabel}</span>
              <ChevronDown width={14} height={14} className="hidden sm:inline" />
            </button>

            {rolesOpen && (
              <div
                ref={roleMenuRef}
                id={roleMenuId}
                role="menu"
                aria-label="Выбор роли"
                className="absolute right-0 mt-2 min-w-44 rounded-xl border border-white/15 bg-black/80 p-1 shadow-xl"
              >
                <button
                  role="menuitem"
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    currentRole === "user" ? "bg-white text-black" : "hover:bg-white/10"
                  }`}
                  onClick={() => switchRole("user")}
                >
                  <User width={14} height={14} /> Пользователь
                </button>
                <button
                  role="menuitem"
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    currentRole === "manager" ? "bg-white text-black" : "hover:bg-white/10"
                  }`}
                  onClick={() => switchRole("manager")}
                >
                  <Briefcase width={14} height={14} /> Менеджер
                </button>
                <button
                  role="menuitem"
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    currentRole === "admin" ? "bg-white text-black" : "hover:bg-white/10"
                  }`}
                  onClick={() => switchRole("admin")}
                >
                  <Shield width={14} height={14} /> Администратор
                </button>
              </div>
            )}
          </div>

          {/* Уведомления */}
          <Link
            href="/demo/admin/notifications"
            prefetch={false}
            className="relative inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Уведомления"
          >
            <Bell width={16} height={16} />
            {unread > 0 && (
              <span
                className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] leading-5 text-white"
                aria-live="polite"
              >
                {unread}
              </span>
            )}
          </Link>

          {/* Профиль */}
          <Link
            href="/demo/admin/profile"
            prefetch={false}
            className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:inline-flex"
          >
            <User width={16} height={16} /> Профиль
          </Link>
        </div>
      </div>
    </div>
  );
}