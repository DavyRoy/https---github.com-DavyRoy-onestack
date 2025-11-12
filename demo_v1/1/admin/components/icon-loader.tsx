// app/demo/admin/components/icon-loader.tsx
"use client";

import { Suspense, lazy, ComponentType, HTMLAttributes, memo } from "react";

// Нормализуем название из JSON (kebab-case) → путь к иконке
function toPath(name: string) {
  return name.trim().toLowerCase();
}

/**
 * Динамический импорт иконок по имени из JSON.
 * Мы импортируем ESM-иконки по конкретному пути, чтобы не тащить всю библиотеку.
 * Примеры путей: lucide-react/dist/esm/icons/store, calendar-days, shield-check, etc.
 */
function loadIcon(name: string) {
  const mod = import(
    /* webpackChunkName: "icon-[request]" */
    // @ts-ignore — динамический сегмент корректен для lucide
    `lucide-react/dist/esm/icons/${toPath(name)}.js`
  );
  return mod.then((m) => ({ default: (m as any).default as ComponentType<any> }));
}

export type IconProps = HTMLAttributes<SVGElement> & { name: string; size?: number };

function IconLazyInner({ name, size = 16, ...rest }: IconProps) {
  const Icon = lazy(() => loadIcon(name));
  return (
    <Suspense
      fallback={
        <span
          aria-hidden
          className="inline-block rounded-sm bg-white/15"
          style={{ width: size, height: size }}
        />
      }
    >
      {/* lucide по умолчанию принимает size */}
      {/* @ts-ignore */}
      <Icon width={size} height={size} {...rest} />
    </Suspense>
  );
}

export const IconLazy = memo(IconLazyInner);