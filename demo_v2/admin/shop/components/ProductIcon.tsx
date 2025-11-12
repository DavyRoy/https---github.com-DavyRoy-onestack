"use client";

import React, { useMemo } from "react";
import { CatalogIcon } from "@/app/lib/catalog/iconRegistry";

type ProductIconProps = {
  iconId?: string;
  size?: number;          // пиксели, без паддинга
  className?: string;
  title?: string;         // если нужен тултип/озвучка скринридером
  pad?: number;           // внутренний отступ контейнера в px
  interactive?: boolean;  // включает hover/focus стили
};

export function ProductIcon({
  iconId,
  size = 20,
  className = "",
  title,                 // по умолчанию декоративная
  pad = 8,
  interactive = true,
}: ProductIconProps) {
  const safeSize = Math.max(12, Math.round(size));
  const box = useMemo(() => Math.max(20, Math.round(safeSize + pad * 2)), [safeSize, pad]);

  const containerCls = cls(
    "inline-grid place-items-center rounded-lg border border-white/10 bg-white/10",
    interactive && "transition-colors hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
    className
  );

  return (
    <span
      className={containerCls}
      style={{ width: box, height: box }}
      // если title не задан — это чисто декоративный контейнер
      {...(title ? { role: "img", "aria-label": title, title } : { "aria-hidden": true })}
    >
      <SafeCatalogIcon id={iconId} size={safeSize} />
    </span>
  );
}

/* ——— безопасный рендер иконки с фоллбеком ——— */
function SafeCatalogIcon({ id, size = 20 }: { id?: string; size?: number }) {
  // Если реестр умеет проверку — лучше без try/catch:
  // if (id && CatalogIcon.has?.(id)) return <CatalogIcon id={id} size={size} aria-hidden="true" />;
  try {
    if (!id) return <FallbackIcon size={size} />;
    return <CatalogIcon id={id} size={size} aria-hidden="true" />;
  } catch {
    return <FallbackIcon size={size} />;
  }
}

function FallbackIcon({ size = 20 }: { size?: number }) {
  const s = Math.max(16, Math.round(size));
  const r = 4;
  const stroke = Math.max(1, Math.round(s / 16));
  const vb = `0 0 ${s} ${s}`;

  return (
    <svg width={s} height={s} viewBox={vb} aria-hidden="true" className="opacity-70">
      <rect x="0" y="0" width={s} height={s} rx={r} className="fill-white/20" />
      <path
        d={`M ${s * 0.25} ${s * 0.75} Q ${s * 0.5} ${s * 0.55}, ${s * 0.5} ${s * 0.4}
            Q ${s * 0.5} ${s * 0.25}, ${s * 0.4} ${s * 0.25}
            M ${s * 0.5} ${s * 0.85} L ${s * 0.5} ${s * 0.82}`}
        className="stroke-white/60"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ——— утилита классов ——— */
function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default React.memo(ProductIcon);