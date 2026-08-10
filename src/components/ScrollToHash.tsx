"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Плавно скроллит к якорю при переходах между страницами и хэшами.
 * Работает для ссылок вида /route#id и внутренних переходов.
 */
export default function ScrollToHash() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (!hash) return;

    const el = document.getElementById(hash);
    if (!el) return;

    // Небольшая задержка, чтобы дождаться отрисовки секции
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => window.clearTimeout(t);
  }, [pathname, searchParams]);

  return null;
}
