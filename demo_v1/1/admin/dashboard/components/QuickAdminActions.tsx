// app/demo/admin/dashboard/components/QuickAdminActions.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plug, UserPlus, Webhook, CreditCard, Zap } from "lucide-react";

type QuickAdminActionsProps = {
  className?: string;
  /** Явно указать роль; если не указано — определяется по URL */
  role?: "admin" | "manager" | "user";
  /** Дополнительные действия (для расширения) */
  extraActions?: Array<{ label: string; href: string; icon?: React.ReactNode }>;
};

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function getRole(path: string | null): "admin" | "manager" | "user" {
  if (!path) return "user";
  if (path.startsWith("/demo/manager")) return "manager";
  if (path.startsWith("/demo/admin")) return "admin";
  return "user";
}
function isValidHref(h?: string) {
  return typeof h === "string" && h.length > 0 && h.startsWith("/");
}

export default function QuickAdminActions({
  className = "",
  role: roleProp,
  extraActions = [],
}: QuickAdminActionsProps) {
  const pathname = usePathname();
  const role = roleProp ?? getRole(pathname);
  const base = `/demo/${role}`;

  // Базовые экшены по роли
  const baseActions: Array<{ label: string; href: string; icon: React.ReactNode }> = [
    {
      label: "Пригласить пользователя",
      href: `${base}/access/invite`,
      icon: <UserPlus width={16} height={16} />,
    },
    {
      label: "Подключить интеграцию",
      href: `${base}/integrations`,
      icon: <Plug width={16} height={16} />,
    },
    {
      label: "Проверить вебхуки",
      href: `${base}/integrations/webhooks`,
      icon: <Webhook width={16} height={16} />,
    },
    {
      label: "Открыть тариф / лимиты",
      href: `${base}/billing`,
      icon: <CreditCard width={16} height={16} />,
    },
  ];

  // Экстра-экшены (приоритет у пользователя), фильтруем дубликаты по href и битые ссылки
  const merged = [...extraActions, ...baseActions]
    .filter((a) => isValidHref(a.href))
    .reduce<Array<{ label: string; href: string; icon?: React.ReactNode }>>((acc, a) => {
      if (!acc.some((x) => x.href === a.href)) acc.push(a);
      return acc;
    }, []);

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] via-white/[0.045] to-white/[0.06] p-3 md:p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="quick-actions-title"
    >
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/10">
            <Zap width={16} height={16} />
          </span>
          <div id="quick-actions-title" className="text-sm font-medium">
            Быстрые действия
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {merged.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            prefetch={false}
            className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
            aria-label={a.label}
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/80 group-hover:text-white transition">
              {a.icon ?? <Zap width={16} height={16} />}
            </span>
            <span className="truncate">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-2 text-xs text-white/60">
        Действия адаптируются под роль: у менеджера и пользователя набор отличается
      </div>
    </section>
  );
}