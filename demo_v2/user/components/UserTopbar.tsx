// app/demo/user/components/UserTopbar.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Home,
  User,
  User2,
  Briefcase,
  Shield,
  ChevronDown,
  Bell,
} from "lucide-react";
import { useUserStore } from "@/app/demo/store/userStore";
import { shallow } from "zustand/shallow";

/**
 * UserTopbar — верхний бар в стиле админки, адаптивный.
 * Содержит переключатель ролей (демо), уведомления и профиль.
 * Поведение и стили 1-в-1 с ManagerTopbar, но с пользовательскими роутами.
 */
export default function UserTopbar() {
  const router = useRouter();
  const pathname = usePathname();

  const unread = useUserStore(
    useCallback((s) => s.notifications.filter((n) => !n.read).length, []),
    shallow
  );

  const [rolesOpen, setRolesOpen] = useState(false);

  // Закрываем меню ролей при смене маршрута
  useEffect(() => setRolesOpen(false), [pathname]);

  // Текущая роль по URL
  const currentRole: "user" | "manager" | "admin" =
    pathname?.startsWith("/demo/admin")
      ? "admin"
      : pathname?.startsWith("/demo/manager")
      ? "manager"
      : "user";

  const roleLabel =
    currentRole === "admin"
      ? "Администратор"
      : currentRole === "manager"
      ? "Менеджер"
      : "Пользователь";

  const switchRole = useCallback(
    (role: "user" | "manager" | "admin") => {
      setRolesOpen(false);
      router.push(`/demo?role=${role}`);
    },
    [router]
  );

  // a11y + клики вне меню
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
      if (
        roleMenuRef.current &&
        !roleMenuRef.current.contains(t) &&
        !roleBtnRef.current?.contains(t)
      ) {
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
    <header className="sticky top-0 z-50">
      <div className="relative mx-auto flex h-[3.75rem] w-full items-center justify-between gap-3 px-3 sm:px-6 md:px-10">
        <span
          aria-hidden
          className="admin-glass absolute inset-0 -z-10 rounded-[1.15rem] sm:rounded-[1.4rem]"
          style={{ opacity: 0.88 }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-0 -z-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        {/* Левый блок: «домой» в раздел пользователя */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/demo/user/dashboard"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/12 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <Home width={16} height={16} className="hidden sm:block opacity-80" />
            <span className="sm:hidden">User</span>
            <span className="hidden sm:inline">Demo • User</span>
          </Link>
        </div>

        {/* Центр: заголовок на мобильном */}
        <div className="absolute left-1/2 block -translate-x-1/2 text-sm font-medium text-white/80 sm:hidden">
          Панель
        </div>

        {/* Правый блок: роли, уведомления, профиль */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Выбор роли (демо) */}
          <div className="relative">
            <button
              ref={roleBtnRef}
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              onClick={() => setRolesOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={rolesOpen}
              aria-controls={roleMenuId}
            >
              <User2 width={16} height={16} className="opacity-80" />
              <span className="hidden sm:inline">{roleLabel}</span>
              <ChevronDown
                width={14}
                height={14}
                className="hidden sm:inline opacity-60 transition-transform duration-150"
                style={{ transform: rolesOpen ? "rotate(180deg)" : undefined }}
              />
            </button>

            {rolesOpen && (
              <div
                ref={roleMenuRef}
                id={roleMenuId}
                role="menu"
                aria-label="Выбор роли"
                className="admin-surface absolute right-0 mt-2 min-w-48 rounded-2xl p-1 shadow-2xl"
              >
                <button
                  role="menuitem"
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    currentRole === "user"
                      ? "bg-white text-black"
                      : "text-white/80 hover:bg-white/12"
                  }`}
                  onClick={() => switchRole("user")}
                >
                  <User width={14} height={14} /> Пользователь
                </button>
                <button
                  role="menuitem"
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    currentRole === "manager"
                      ? "bg-white text-black"
                      : "text-white/80 hover:bg-white/12"
                  }`}
                  onClick={() => switchRole("manager")}
                >
                  <Briefcase width={14} height={14} /> Менеджер
                </button>
                <button
                  role="menuitem"
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    currentRole === "admin"
                      ? "bg-white text-black"
                      : "text-white/80 hover:bg-white/12"
                  }`}
                  onClick={() => switchRole("admin")}
                >
                  <Shield width={14} height={14} /> Администратор
                </button>
              </div>
            )}
          </div>

          {/* Уведомления (роут пользователя) */}
          <Link
            href="/demo/user/notifications"
            prefetch={false}
            className="relative inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Уведомления"
          >
            <Bell width={16} height={16} />
            {unread > 0 && (
              <span
                className="absolute -right-1.5 -top-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#ff4d67] px-1 text-[10px] font-semibold leading-5 text-white shadow-lg shadow-[#ff4d6755]"
                aria-live="polite"
              >
                {unread}
              </span>
            )}
          </Link>

          {/* Профиль (роут пользователя) */}
          <Link
            href="/demo/user/profile"
            prefetch={false}
            className="hidden items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:inline-flex"
          >
            <User width={16} height={16} /> Профиль
          </Link>
        </div>
      </div>
    </header>
  );
}