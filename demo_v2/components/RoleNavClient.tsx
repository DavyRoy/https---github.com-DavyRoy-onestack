// src/app/demo/components/RoleNavClient.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function RoleNavClient() {
  const role = (useSearchParams().get("role") || "user").toLowerCase();

  return (
    <nav
      aria-label="Быстрая навигация по ролям"
      className="sticky top-0 z-30 border-b border-white/[0.06] bg-[hsl(var(--bg))]/80 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--bg))]/70"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
        <ul className="flex flex-wrap items-center gap-2 text-sm">
          <li><RoleChip href="/demo?role=user" label="Пользователь" active={role==="user"} /></li>
          <li><RoleChip href="/demo?role=manager" label="Менеджер" active={role==="manager"} /></li>
          <li><RoleChip href="/demo?role=admin" label="Администратор" active={role==="admin"} /></li>
          <li className="ml-auto">
            <Link
              href="/contact"
              className="rounded-full bg-white text-black px-3 py-1.5 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))] transition"
            >
              Обсудить проект
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function RoleChip({ href, label, active }: { href: string; label: string; active?: boolean }) {
  const base =
    "rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))]";
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? `${base} border-white/[0.16] bg-white text-black font-medium`
          : `${base} border-white/[0.08] text-white/80 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.03]`
      }
    >
      {label}
    </Link>
  );
}