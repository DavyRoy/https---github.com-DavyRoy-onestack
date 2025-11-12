"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upload, PackagePlus, FolderPlus } from "lucide-react";

type Role = "admin" | "manager" | "user";

type QuickActionsProps = {
  className?: string;
  role?: Role;
};

type Action =
  | { label: string; href: string; icon: React.ReactNode }
  | { label: string; onClick?: () => void; icon: React.ReactNode; disabled?: boolean };

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function getBase(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

export default function QuickActions({ className = "", role = "admin" }: QuickActionsProps) {
  const pathname = usePathname();
  const base = getBase(pathname);

  const [showImport, setShowImport] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Список действий с учётом роли
  const actions = useMemo<Action[]>(() => {
    const all: Action[] = [
      {
        label: "Создать товар",
        href: `${base}/shop/products/new`,
        icon: <PackagePlus className="w-4 h-4" aria-hidden="true" />,
      },
      {
        label: "Импорт CSV / XLSX",
        onClick: () => setShowImport(true),
        icon: <Upload className="w-4 h-4" aria-hidden="true" />,
      },
      {
        label: "Новая категория",
        href: `${base}/shop/categories/new`,
        icon: <FolderPlus className="w-4 h-4" aria-hidden="true" />,
      },
    ];

    if (role === "admin") return all;
    if (role === "manager") return all.slice(0, 2); // без категорий

    // user — только просмотр, импорт недоступен
    return [
      {
        label: "Список товаров",
        href: `${base}/shop/products`,
        icon: <PackagePlus className="w-4 h-4" aria-hidden="true" />,
      },
      {
        label: "Импорт CSV / XLSX (нет доступа)",
        onClick: undefined,
        disabled: true,
        icon: <Upload className="w-4 h-4" aria-hidden="true" />,
      },
    ];
  }, [base, role]);

  /* ===== Dialog a11y ===== */
  const openImport = useCallback(() => {
    lastActiveRef.current = document.activeElement as HTMLElement | null;
    setShowImport(true);
  }, []);
  const closeImport = useCallback(() => {
    setShowImport(false);
    // вернуть фокус к исходной кнопке
    queueMicrotask(() => lastActiveRef.current?.focus());
  }, []);

  // Замена onClick в экшене (чтобы помнить триггер)
  const actionsWithOpen = useMemo<Action[]>(
    () =>
      actions.map((a) =>
        "onClick" in a && a.onClick
          ? { ...a, onClick: openImport }
          : a
      ),
    [actions, openImport]
  );

  // Escape для закрытия
  useEffect(() => {
    if (!showImport) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeImport();
      if (e.key === "Tab" && dialogRef.current) {
        // focus trap
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter((el) => !el.hasAttribute("disabled"));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showImport, closeImport]);

  // Фокус на «Закрыть»
  useEffect(() => {
    if (showImport) {
      const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [showImport]);

  // Lock body scroll
  useEffect(() => {
    if (!showImport) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showImport]);

  return (
    <section
      className={cls(
        "admin-section rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="quick-shop-actions"
    >
      <div id="quick-shop-actions" className="text-sm font-medium text-white/85">
        Быстрые действия
      </div>

      <div className="mt-3 grid gap-2">
        {actionsWithOpen.map((a) =>
          "href" in a ? (
            <Link
              key={a.label}
              href={a.href}
              prefetch={false}
              className="group flex items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label={a.label}
            >
              <span className="opacity-80 group-hover:opacity-100">{a.icon}</span>
              <span className="truncate">{a.label}</span>
            </Link>
          ) : (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              disabled={a.disabled}
              className={cls(
                "group flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                a.disabled
                  ? "cursor-not-allowed border-white/10 bg-white/5 text-white/40"
                  : "border-white/12 bg-white/10 text-white/85 hover:border-white/18 hover:bg-white/16"
              )}
              aria-label={a.label}
              aria-disabled={a.disabled || undefined}
              tabIndex={a.disabled ? -1 : 0}
            >
              <span className={cls("opacity-80 group-hover:opacity-100", a.disabled && "opacity-50")}>
                {a.icon}
              </span>
              <span className="truncate">{a.label}</span>
            </button>
          )
        )}
      </div>

      {/* Модалка импорта */}
      {showImport && role !== "user" && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-dialog-title"
          aria-describedby="import-dialog-desc"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeImport();
          }}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* dialog */}
          <div
            ref={dialogRef}
            className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-black/70 p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="text-sm font-medium" id="import-dialog-title">
              Импорт товаров
            </div>
            <p className="text-xs text-white/70 mt-1 leading-snug" id="import-dialog-desc">
              Здесь появится мастер импорта CSV / XLSX с проверкой структуры и предпросмотром.
              Пока это демо-заглушка.
            </p>

            <ul className="mt-3 list-disc pl-5 text-xs text-white/70 space-y-1">
              <li>Поддерживаемые форматы: .csv, .xlsx</li>
              <li>Необязательные колонки: SKU, категория, бренд, цена, остаток</li>
              <li>Кодировка: UTF-8, разделитель — запятая или точка с запятой</li>
            </ul>

            <div className="mt-3 flex justify-end gap-2">
              <button
                ref={closeBtnRef}
                onClick={closeImport}
                className="rounded-lg bg-white px-3 py-1.5 text-sm text-black transition hover:bg-white/90"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-white/60">
        Набор действий зависит от роли: у менеджера меньше опций; у пользователя импорт недоступен.
      </div>
    </section>
  );
}