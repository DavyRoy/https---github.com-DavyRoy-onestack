"use client";
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

const BG    = "#07100e";
const WHITE = "#f4faf8";

/** Заголовок доступен скринридерам, но не показывается — он есть внутри контента. */
const srOnly: React.CSSProperties = {
  position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
  overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0,
};

/**
 * Полноэкранное окно с разделом сайта.
 *
 * Появление намеренно без анимации: она зависела бы от того, успеет ли
 * смениться состояние до отрисовки, а цена ошибки — панель, открытая с
 * нулевой прозрачностью.
 */
export default function FullScreenDialog({
  title, onClose, closeLabel, children, open = true,
}: {
  title: string;
  onClose: () => void;
  closeLabel: string;
  children: React.ReactNode;
  /**
   * Когда false, содержимое остаётся в разметке, но скрыто. Это важно для
   * поиска: если разделы монтировать только по клику, робот при обходе
   * видит пустую страницу.
   */
  open?: boolean;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  /* Esc закрывает */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  /* Блокировка прокрутки страницы под окном (безопасно для iOS) */
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${y}px`;
    style.width = "100%";
    style.overflow = "hidden";
    return () => {
      style.position = ""; style.top = ""; style.width = ""; style.overflow = "";
      window.scrollTo(0, y);
    };
  }, [open]);

  /* Фокус на кнопку закрытия, при закрытии — обратно на то, что его открыло */
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    return () => returnFocusRef.current?.focus();
  }, [open]);

  // Скрытая разметка не должна быть доступна с клавиатуры и скринридерам.
  if (!open) return <div hidden>{children}</div>;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{ position: "fixed", inset: 0, zIndex: 120, background: BG, overflowY: "auto" }}
    >
      <h2 id={titleId} style={srOnly}>{title}</h2>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        style={{
          position: "fixed", top: 18, right: 18,
          // Выше контента разделов (там встречается z-index 10), но ниже их
          // собственных модалок (999): те закрываются своей кнопкой, и
          // перекрывать их этой было бы неверно.
          zIndex: 100,
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 16px", borderRadius: 999, cursor: "pointer",
          background: "rgba(7,16,14,0.82)",
          border: "1px solid rgba(255,255,255,0.14)",
          color: WHITE, fontSize: 12, letterSpacing: "0.12em",
          textTransform: "uppercase", fontWeight: 500,
          backdropFilter: "blur(14px)",
        }}
      >
        <X size={15} />
        {closeLabel}
      </button>

      {children}
    </div>
  );
}
