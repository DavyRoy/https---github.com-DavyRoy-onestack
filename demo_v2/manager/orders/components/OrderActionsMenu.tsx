"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import type { OrderStatus } from "@/app/demo/manager/orders/data/mockOrders";

type Action = {
  id: string;
  label: string;
  onClick: () => void;
  hidden?: boolean;
};

export default function OrderActionsMenu({
  status,
  onOpen,
  onConfirm,
  onMarkPaid,
  onComplete,
  onCancel,
  onInvoice,
  onContact,
}: {
  status: OrderStatus;
  onOpen: () => void;
  onConfirm: () => void;
  onMarkPaid: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onInvoice: () => void;
  onContact: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();

  const actions = useMemo<Action[]>(
    () => [
      { id: "open",    label: "Открыть",                    onClick: onOpen },
      { id: "confirm", label: "Подтвердить",                onClick: onConfirm,   hidden: status !== "new" },
      { id: "paid",    label: "Отметить как оплаченный",    onClick: onMarkPaid,  hidden: status !== "confirmed" },
      { id: "done",    label: "Завершить",                  onClick: onComplete,  hidden: status !== "paid" },
      { id: "cancel",  label: "Отменить",                   onClick: onCancel,    hidden: !(status === "new" || status === "confirmed") },
      { id: "invoice", label: "Выставить счёт (демо)",      onClick: onInvoice },
      { id: "contact", label: "Связаться с клиентом",       onClick: onContact },
    ],
    [status, onOpen, onConfirm, onMarkPaid, onComplete, onCancel, onInvoice, onContact]
  );

  const visible = actions.filter((a) => !a.hidden);

  // Закрыть по клику вне и по ESC
  useEffect(() => {
    if (!isOpen) return;

    const onDocClick = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      if (!menuRef.current || !btnRef.current) return;
      if (menuRef.current.contains(t) || btnRef.current.contains(t)) return;
      setIsOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsOpen(false);
        btnRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick, { passive: true });
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  // Фокус на первый пункт при открытии
  useEffect(() => {
    if (isOpen) {
      // небольшая задержка, чтобы меню попало в DOM
      const t = setTimeout(() => firstItemRef.current?.focus(), 1);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const toggle = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  const onButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const onItemKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    if (!items || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
      btnRef.current?.focus();
    }
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        className="rounded-xl border border-white/15 bg-white/10 p-2 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-h-[40px] min-w-[40px] inline-flex items-center justify-center"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={toggle}
        onKeyDown={onButtonKeyDown}
        title="Действия с заказом"
      >
        <MoreHorizontal width={16} height={16} />
        <span className="sr-only">Действия</span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Действия с заказом"
          className="
            absolute right-0 top-[calc(100%+6px)]
            z-30 w-56 max-h-[60vh] overflow-auto
            rounded-xl border border-white/15 bg-white/10 backdrop-blur
            p-1 text-sm shadow-[0_20px_80px_-40px_rgba(12,18,32,0.9)]
          "
        >
          {visible.map((a, i) => (
            <button
              key={a.id}
              role="menuitem"
              ref={i === 0 ? firstItemRef : undefined}
              className="
                block w-full text-left rounded-lg px-2 py-2
                hover:bg-white/15 focus:bg-white/15
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20
              "
              onClick={() => {
                close();
                a.onClick();
              }}
              onKeyDown={(e) => onItemKeyDown(e, i)}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}