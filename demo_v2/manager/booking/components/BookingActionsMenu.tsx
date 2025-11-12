// src/app/demo/manager/booking/components/BookingActionsMenu.tsx
"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  MoreHorizontal,
  Phone,
  Check,
  X,
  Calendar,
  CheckCheck,
  Ban,
} from "lucide-react";
import { toast } from "sonner";

type Status = "new" | "pending" | "confirmed" | "completed" | "cancelled" | "noshow";

type Props = {
  id: string;
  status: Status;
  onAction?: (nextStatus: Status) => void; // демо: сообщаем родителю
};

export default function BookingActionsMenu({ id, status, onAction }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  const act = (s: Status, msg: string) => {
    onAction?.(s);
    toast.success(msg);
    setOpen(false);
    btnRef.current?.focus();
  };

  // Закрытие по клику вне и по ESC
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // Клавиатура в самом меню (простая навигация Tab/Shift+Tab handled браузером)
  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      // делегируем клику по активному элементу
      const el = document.activeElement as HTMLElement | null;
      if (el && listRef.current?.contains(el)) {
        e.preventDefault();
        (el as HTMLButtonElement | HTMLAnchorElement).click?.();
      }
    }
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        className="rounded-lg border border-white/15 bg-white/10 p-2 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[36px] min-w-[36px]"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-label="Действия"
      >
        <MoreHorizontal width={16} height={16} />
      </button>

      {open && (
        <div
          ref={listRef}
          id={menuId}
          role="menu"
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 z-20 mt-1 w-56 rounded-xl border border-white/15 bg-black/75 p-1 shadow-xl backdrop-blur-md"
        >
          {(status === "new" || status === "pending") && (
            <button
              role="menuitem"
              className="menuitem"
              onClick={() => act("confirmed", "Запись подтверждена")}
            >
              <Check width={14} height={14} /> Подтвердить
            </button>
          )}

          {status !== "cancelled" && (
            <button
              role="menuitem"
              className="menuitem"
              onClick={() => act("cancelled", "Запись отменена")}
            >
              <Ban width={14} height={14} /> Отменить
            </button>
          )}

          <Link
            role="menuitem"
            href={`/demo/manager/booking/reschedule/${id}`}
            prefetch={false}
            className="menuitem"
            onClick={() => setOpen(false)}
          >
            <Calendar width={14} height={14} /> Перенести
          </Link>

          {status === "confirmed" && (
            <>
              <button
                role="menuitem"
                className="menuitem"
                onClick={() => act("completed", "Отмечено: состоялась")}
              >
                <CheckCheck width={14} height={14} /> Состоялась
              </button>
              <button
                role="menuitem"
                className="menuitem"
                onClick={() => act("noshow", "Отмечено: не явился")}
              >
                <X width={14} height={14} /> Не явился
              </button>
            </>
          )}

          <button
            role="menuitem"
            className="menuitem"
            onClick={() => {
              toast.message("Клиенту отправлено сообщение (демо).");
              setOpen(false);
              btnRef.current?.focus();
            }}
          >
            <Phone width={14} height={14} /> Связаться
          </button>
        </div>
      )}

      <style jsx>{`
        .menuitem {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 12px;
          font-size: 13px;
          line-height: 1;
          border-radius: 10px;
          color: white;
          text-align: left;
        }
        .menuitem:hover,
        .menuitem:focus-visible {
          background: rgba(255, 255, 255, 0.08);
          outline: none;
        }
      `}</style>
    </div>
  );
}