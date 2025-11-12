// src/app/demo/ui/Modal.tsx
"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg";

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  /** опционально: передайте ref кнопки-открывалки, чтобы вернуть на неё фокус */
  returnFocusTo,
  /** aria-describedby: id блока внутри children (или строка-описание) */
  description,
  /** размеры контейнера */
  size = "md",
  /** закрывать ли по клику на подложку */
  closeOnOverlayClick = true,
  /** показывать ли крестик */
  showClose = true,
  /** на мобильных переключиться в полноэкранный режим листа */
  fullScreenOnMobile = true,
  /** селектор/узел для первичного фокуса внутри модалки */
  initialFocus,
  /** отключить focus trap (по умолчанию включён) */
  trapFocus = true,
  /** кастомные классы внешнего контейнера (обёртка диалога) */
  containerClassName = "",
  /** кастомные классы контента (внутренняя «белая» карточка) */
  contentClassName = "",
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  returnFocusTo?: HTMLElement | null;
  description?: string | { id: string };
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  showClose?: boolean;
  fullScreenOnMobile?: boolean;
  initialFocus?: string | HTMLElement | null;
  trapFocus?: boolean;
  containerClassName?: string;
  contentClassName?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const titleId = useMemo(
    () => `modal-title-${Math.random().toString(36).slice(2, 8)}`,
    []
  );
  const descId =
    typeof description === "string"
      ? `modal-desc-${Math.random().toString(36).slice(2, 8)}`
      : description?.id;

  // ——— блокируем прокрутку body, когда модалка открыта + компенсация скроллбара
  useLayoutEffect(() => {
    if (!open) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPadRight = body.style.paddingRight;

    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarW > 0) {
      body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight || "0") + scrollbarW}px`;
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadRight;
    };
  }, [open]);

  // ——— закрытие по Esc
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // ——— переводим фокус внутрь и делаем focus trap
  useEffect(() => {
    if (!open || !dialogRef.current || !trapFocus) return;

    // первичный фокус
    const focusPrimarily = () => {
      if (!dialogRef.current) return;
      let target: HTMLElement | null = null;
      if (typeof initialFocus === "string") {
        target = dialogRef.current.querySelector<HTMLElement>(initialFocus);
      } else if (initialFocus instanceof HTMLElement) {
        target = initialFocus;
      }
      if (!target) {
        target =
          dialogRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) ?? dialogRef.current;
      }
      target?.focus({ preventScroll: true });
    };
    const t = setTimeout(focusPrimarily, 0);

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

      if (focusables.length === 0) {
        e.preventDefault();
        (dialogRef.current as HTMLElement).focus({ preventScroll: true });
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus({ preventScroll: true });
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", handleTab);
    };
  }, [open, trapFocus, initialFocus]);

  // ——— возврат фокуса к триггеру после закрытия
  useEffect(() => {
    if (open) return;
    if (returnFocusTo && typeof returnFocusTo.focus === "function") {
      const t = setTimeout(() => {
        // элемент мог быть удалён
        if (document.contains(returnFocusTo)) {
          returnFocusTo.focus();
        }
      }, 0);
      return () => clearTimeout(t);
    }
  }, [open, returnFocusTo]);

  const widthCls =
    size === "sm" ? "sm:max-w-md" : size === "lg" ? "sm:max-w-3xl" : "sm:max-w-2xl";

  const mobileSheetCls = fullScreenOnMobile
    ? "max-h-[92dvh] sm:max-h-[85dvh] sm:rounded-2xl sm:border sm:border-white/10"
    : "max-h-[85dvh] rounded-2xl border border-white/10";

  // Анимации учитывают reduce motion
  const overlayAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: reduced ? 0 : 0.18 },
  } as const;

  const dialogAnim = {
    initial: { opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: reduced ? 1 : 0.98, y: reduced ? 0 : 10 },
    transition: { duration: reduced ? 0 : 0.2, ease: "easeOut" },
  } as const;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 ${containerClassName}`}
          {...overlayAnim}
          aria-hidden={false}
        >
          {/* Подложка (нефокусируемая) */}
          <motion.div
            ref={overlayRef}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            {...overlayAnim}
            aria-hidden="true"
            role="presentation"
            tabIndex={-1}
            onClick={() => {
              if (closeOnOverlayClick) onClose();
            }}
          />

          {/* Диалог */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={typeof description === "string" ? descId : descId || undefined}
            className={[
              "relative z-10 w-full bg-white/[0.05] shadow-[0_30px_120px_rgba(0,0,0,0.6)] focus:outline-none",
              "sm:w-full sm:rounded-2xl",
              widthCls,
              mobileSheetCls,
              contentClassName,
            ].join(" ")}
            {...dialogAnim}
            // клики внутри не пробрасываем на подложку
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <div id={titleId} className="text-sm font-semibold">
                {title}
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  aria-label="Закрыть"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Описание как текст (если передали строку) */}
            {typeof description === "string" && (
              <div id={descId} className="px-5 pt-3 text-sm text-white/70">
                {description}
              </div>
            )}

            {/* Контент: прокрутка внутри при высокой модалке */}
            <div className="p-5 overflow-y-auto">
              {children}
            </div>

            {footer && (
              <div className="px-5 py-3 border-t border-white/10">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}