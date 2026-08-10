// src/app/components/PolicyLayout.tsx
"use client";

import Link from "next/link";
import { X } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useReducedMotion } from "framer-motion";

type TocItem = { href: string; label: string };

export default function PolicyLayout({
  title,
  subtitle,
  updatedAt,
  backHref = "/",
  toc,
  langToggle,
  children,
}: {
  title: string;
  subtitle?: string;
  updatedAt?: string;
  backHref?: string;
  toc?: TocItem[];
  langToggle?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => setMounted(true), []);

  // ---- статья и авто-TOC ----
  const articleRef = useRef<HTMLElement | null>(null);
  const autoToc = useAutoToc(articleRef, toc);

  // ---- scroll spy + плавный скролл с оффсетом ----
  const headerOffset = 72; // высота липкой шапки
  const { activeId, onTocClick } = useScrollSpy({
    containerRef: articleRef,
    headerOffset,
  });

  // ---- локализация даты ----
  const updatedText = useMemo(() => {
    if (!updatedAt) return null;
    // если похоже на ISO-день — форматнём по ru-RU
    if (/^\d{4}-\d{2}-\d{2}$/.test(updatedAt)) {
      try {
        const d = new Date(updatedAt + "T00:00:00Z");
        return d.toLocaleDateString("ru-RU", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return updatedAt;
      }
    }
    return updatedAt;
  }, [updatedAt]);

  // ---- переход к якорю при загрузке (учёт оффсета) ----
  useEffect(() => {
    if (!mounted) return;
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const el = document.getElementById(id);
    if (!el) return;
    // отложим до отрисовки
    setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    }, 0);
  }, [mounted, reduce, headerOffset]);

  return (
    <div className="relative min-h-screen text-white" style={{ background: "#07100e" }}>
      {/* top bar */}
      <div className="sticky top-0 z-50 border-b border-white/10 backdrop-blur px-6 md:px-10" style={{ background: "rgba(7,16,14,0.85)" }}>
        <div className="mx-auto max-w-7xl h-14 flex items-center justify-between gap-3">
          <div className="flex flex-col leading-tight min-w-0">
            <div className="text-base md:text-lg font-semibold truncate">{title}</div>
            {subtitle ? <div className="text-xs text-white/50 truncate">{subtitle}</div> : null}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {langToggle}
            <Link
              href={backHref}
              aria-label="Закрыть"
              className="rounded-full p-2 border border-white/15 bg-white/[0.06] hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <main
        className={`mx-auto max-w-7xl px-6 md:px-10 py-8 md:py-12 transition-opacity ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Mobile TOC */}
        {autoToc.length > 0 && (
          <details className="lg:hidden mb-6 rounded-xl border border-white/10 overflow-hidden">
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-white/70 select-none list-none [&::-webkit-details-marker]:hidden">
              <span>Оглавление</span>
              <span className="text-white/40 text-xs">▼</span>
            </summary>
            <nav className="px-4 pb-4 border-t border-white/10 pt-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <ul className="space-y-2">
                {autoToc.map((i) => (
                  <li key={i.href}>
                    <a href={i.href} onClick={(e) => { onTocClick(e, i.href); (e.currentTarget.closest("details") as HTMLDetailsElement).removeAttribute("open"); }}
                      className="block text-sm text-white/60 hover:text-white transition py-0.5">
                      {i.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* TOC */}
          <aside className="hidden lg:block">
            {autoToc.length ? (
              <nav className="sticky top-20" aria-label="Оглавление">
                <div className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
                  Оглавление
                </div>
                <ul className="space-y-2">
                  {autoToc.map((i) => {
                    const isActive = activeId === i.href.replace("#", "");
                    return (
                      <li key={i.href}>
                        <a
                          href={i.href}
                          onClick={(e) => onTocClick(e, i.href)}
                          className={`block text-sm transition ${
                            isActive
                              ? "text-white"
                              : "text-white/70 hover:text-white"
                          }`}
                          aria-current={isActive ? "true" : undefined}
                        >
                          {i.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ) : null}
          </aside>

          {/* Content */}
          <article
            ref={articleRef as React.RefObject<HTMLElement>}
            className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-p:leading-relaxed prose-li:leading-relaxed prose-hr:border-white/10"
          >
            <header className="mb-6">
              {updatedText ? (
                <div className="text-xs text-white/50" suppressHydrationWarning>
                  Последнее обновление: {updatedText}
                </div>
              ) : null}
            </header>

            {children}

            <hr className="my-8 border-white/10" />
            <p className="text-xs text-white/50">
              Примечание: текст носит информационный характер и требует адаптации
              под ваши реквизиты и юрисдикцию.
            </p>
          </article>
        </div>
      </main>

      {/* print-friendly мелочи */}
      <style jsx global>{`
        @media print {
          html,
          body {
            background: #fff !important;
            color: #000 !important;
          }
          .prose :where(h1, h2, h3, h4, h5, h6) {
            color: #000 !important;
          }
          a,
          a * {
            color: #000 !important;
            text-decoration: underline;
          }
          .backdrop-blur,
          .border-white\\/10,
          .bg-black\\/70 {
            backdrop-filter: none !important;
            border-color: #000 !important;
            background: transparent !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ===================== hooks ===================== */
function useAutoToc(
  articleRef: React.MutableRefObject<HTMLElement | null>,
  provided?: TocItem[]
) {
  const [auto, setAuto] = useState<TocItem[]>([]);
  useEffect(() => {
    if (provided?.length) return setAuto(provided), () => {};
    const root = articleRef.current;
    if (!root) return;

    // Берём h2/h3 с id; если id нет — выставим из текста
    const hs = Array.from(root.querySelectorAll<HTMLElement>("h2, h3"));
    const items: TocItem[] = hs.map((h) => {
      if (!h.id) {
        const slug = slugify(h.textContent || "");
        h.id = slug;
      }
      return { href: `#${h.id}`, label: h.textContent || "" };
    });
    setAuto(items);
  }, [articleRef, provided]);
  return provided?.length ? provided : auto;
}

function useScrollSpy({
  containerRef,
  headerOffset = 0,
}: {
  containerRef: React.MutableRefObject<HTMLElement | null>;
  headerOffset?: number;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const heads = Array.from(root.querySelectorAll<HTMLElement>("h2, h3")).filter(
      (h) => !!h.id
    );
    if (!heads.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // берём ближайший к верхнему краю видимый заголовок
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target) setActiveId((visible.target as HTMLElement).id);
      },
      {
        // небольшой отрицательный rootMargin, чтобы учитывать липкий бар
        root: null,
        rootMargin: `-${headerOffset + 8}px 0px -60% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [containerRef, headerOffset]);

  const onTocClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // собственный smooth-scroll с учётом offset
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (!el) {
        // fallback — пусть браузер попытается перейти
        window.location.hash = href;
        return;
      }
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
      window.history.replaceState(null, "", `#${id}`);
      window.scrollTo({ top, behavior: "smooth" });
    },
    [headerOffset]
  );

  return { activeId, onTocClick };
}

/* ===================== utils ===================== */
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    // быстрая транслитерация для заголовков на русском
    .replace(/[ъь]+/g, "")
    .replace(/й/g, "i")
    .replace(/ц/g, "c")
    .replace(/у/g, "u")
    .replace(/к/g, "k")
    .replace(/е/g, "e")
    .replace(/н/g, "n")
    .replace(/г/g, "g")
    .replace(/ш/g, "sh")
    .replace(/щ/g, "sch")
    .replace(/з/g, "z")
    .replace(/х/g, "h")
    .replace(/ф/g, "f")
    .replace(/ы/g, "y")
    .replace(/в/g, "v")
    .replace(/а/g, "a")
    .replace(/п/g, "p")
    .replace(/р/g, "r")
    .replace(/о/g, "o")
    .replace(/л/g, "l")
    .replace(/д/g, "d")
    .replace(/ж/g, "zh")
    .replace(/э/g, "e")
    .replace(/я/g, "ya")
    .replace(/ч/g, "ch")
    .replace(/с/g, "s")
    .replace(/м/g, "m")
    .replace(/и/g, "i")
    .replace(/т/g, "t")
    .replace(/б/g, "b")
    .replace(/ю/g, "yu")
    // общие
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}