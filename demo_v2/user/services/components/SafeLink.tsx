// app/demo/(shared)/components/SafeLink.tsx
"use client";

import Link from "next/link";

type HrefObject = {
  pathname: string; // может содержать [slug]/[id]
  query?: Record<string, string | number>;
};

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string | HrefObject;
  /** Подпись по умолчанию (если children не передан) */
  fallbackLabel?: string;
  /** Текст тултипа, когда линк не может быть срендерен (нет параметров для [slug]) */
  disabledTitle?: string;
  /** Доп. класс для неактивного состояния */
  disabledClassName?: string;
};

const DYNAMIC_SEGMENT_RE = /\[[^/]+?\]/g;

function hasDynamicSegments(path: string) {
  return DYNAMIC_SEGMENT_RE.test(path);
}

/** Подставить query в pathname с [slug] → финальный путь. Если чего-то не хватает — вернёт null. */
function fillParams(pathname: string, query?: Record<string, string | number>) {
  if (!hasDynamicSegments(pathname)) return pathname;
  if (!query) return null;

  let out = pathname;
  for (const [k, v] of Object.entries(query)) {
    const val = encodeURIComponent(String(v));
    out = out.replace(new RegExp(`\$begin:math:display$${k}\\$end:math:display$`, "g"), val);
  }
  return hasDynamicSegments(out) ? null : out;
}

/** Безопасная ссылка для App Router.
 *  - Строковый href с [slug] НЕ рендерится (span disabled).
 *  - Объектный href { pathname:"/x/[slug]", query:{slug:"y"} } — всегда ок.
 */
export default function SafeLink({
  href,
  children,
  className,
  fallbackLabel = "",
  disabledTitle = "Недоступно: требуется выбрать конкретный элемент",
  disabledClassName = "cursor-not-allowed opacity-50",
  prefetch = false,
  ...rest
}: Props) {
  // Вариант 1: href — объект { pathname, query }
  if (typeof href !== "string") {
    const resolved = fillParams(href.pathname, href.query);
    if (!resolved) {
      return (
        <span
          className={`${disabledClassName} ${className ?? ""}`}
          aria-disabled="true"
          title={disabledTitle}
        >
          {children ?? fallbackLabel}
        </span>
      );
    }
    return (
      <Link href={resolved} prefetch={prefetch} className={className} {...rest}>
        {children ?? fallbackLabel}
      </Link>
    );
  }

  // Вариант 2: href — строка
  if (hasDynamicSegments(href)) {
    // Строка-шаблон с [slug] — рендерим disabled, чтобы не падало
    return (
      <span
        className={`${disabledClassName} ${className ?? ""}`}
        aria-disabled="true"
        title={disabledTitle}
      >
        {children ?? fallbackLabel}
      </span>
    );
  }

  return (
    <Link href={href} prefetch={prefetch} className={className} {...rest}>
      {children ?? fallbackLabel}
    </Link>
  );
}

/** Экспортируй, если хочешь собирать href заранее в данных/утилитах */
export function buildHref(pathname: string, query?: Record<string, string | number>) {
  return fillParams(pathname, query);
}