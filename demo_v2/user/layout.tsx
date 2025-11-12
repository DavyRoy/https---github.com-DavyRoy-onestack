// app/demo/user/layout.tsx
import type { ReactNode, CSSProperties } from "react";
import { Suspense } from "react";
import "./globals.css"; // общий стиль оболочки (admin-shell, admin-section и т.п.)

/* --------------------------- client components --------------------------- */
/* В App Router можно напрямую импортировать клиентские компоненты
   в серверный layout — они сами станут клиентскими «островками». */
import UserTopbar from "./components/UserTopbar";
import Sidebar from "./components/UserSidebar.client";
import Breadcrumbs from "./components/UserBreadcrumbs.client";
import MobileTabbar from "./components/UserMobileTabbar.client";

/* -------------------------------- skeletons ------------------------------ */

function SidebarSkeleton() {
  return (
    <div
      aria-hidden
      className="hidden lg:block w-[280px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.06] p-4 animate-pulse"
      style={{ minHeight: 360 }}
    />
  );
}

function BreadcrumbsSkeleton() {
  return (
    <div aria-hidden className="h-10 rounded-xl border border-white/10 bg-white/[0.06] animate-pulse" />
  );
}

function MobileTabbarSkeleton() {
  return <div className="h-[64px] sm:hidden" aria-hidden />;
}

/* ------------------------- CSS custom properties ------------------------- */

type ShellVars = CSSProperties & {
  ["--sat"]?: string;      // safe-area-top
  ["--sab"]?: string;      // safe-area-bottom
  ["--topbar-h"]?: string; // высота Topbar
  ["--tabbar-h"]?: string; // высота мобильного таббара
};

const shellWrap = "admin-shell";

/* --------------------------------- layout -------------------------------- */

export default function UserLayout({ children }: { children: ReactNode }) {
  const styleVars: ShellVars = {
    "--sat": "env(safe-area-inset-top, 0px)",
    "--sab": "env(safe-area-inset-bottom, 0px)",
    "--topbar-h": "64px",
    "--tabbar-h": "64px",
  };

  return (
    <div className={shellWrap} style={styleVars}>
      {/* Skip link для клавиатуры/скринридеров */}
      <a
        href="#user-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-[calc(var(--sat)+8px)] focus:z-[100] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-black"
      >
        Перейти к основному контенту
      </a>

      <div className="relative flex min-h-[100svh] min-h-dvh flex-col text-white">
        {/* Верхняя панель (зафиксирована в самом компоненте) */}
        <header role="banner" className="sticky top-0 z-40 print:hidden" style={{ paddingTop: "var(--sat)" }}>
          <Suspense fallback={null}>
            <UserTopbar />
          </Suspense>
        </header>

        {/* Основной контент с сайдбаром */}
        <div className="flex flex-1 flex-col">
          <div
            className="
              flex flex-1
              px-3 pt-4 pb-24
              sm:px-6 sm:pt-6
              md:px-8 lg:px-10 lg:gap-6
            "
            // отступ снизу под мобильный таб-бар + safe-area
            style={{ paddingBottom: "calc(var(--sab) + var(--tabbar-h) + 16px)" }}
          >
            {/* Сетка: фикс. колонка сайдбара и эластичный контент */}
            <div className="mx-auto grid w-full max-w-8xl grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
              {/* Сайдбар */}
              <nav aria-label="Боковая навигация" className="hidden lg:block">
                <Suspense fallback={<SidebarSkeleton />}>
                  <Sidebar />
                </Suspense>
              </nav>

              {/* Основная колонка */}
              <main
                id="user-main"
                role="main"
                className="min-w-0"
                // не прилипать под фикс. топ-бар при переходе по якорям
                style={{ scrollMarginTop: "calc(var(--topbar-h) + 12px)" }}
              >
                <div className="flex min-w-0 flex-col gap-4">
                  {/* Крошки в стеклянной плашке */}
                  <div
                    className="admin-glass admin-surface-bleed px-4 py-3 sm:px-5"
                    style={{ marginTop: "var(--sat)" }}
                  >
                    <Suspense fallback={<BreadcrumbsSkeleton />}>
                      <Breadcrumbs />
                    </Suspense>
                  </div>

                  {/* Страница */}
                  <div className="admin-page">{children}</div>
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Нижний мобильный таб-бар */}
        <footer
          role="contentinfo"
          className="fixed inset-x-0 bottom-0 z-40 sm:hidden print:hidden"
          style={{ paddingBottom: "var(--sab)" }}
        >
          <Suspense fallback={<MobileTabbarSkeleton />}>
            <MobileTabbar />
          </Suspense>
        </footer>

        {/* Spacer на случай, если таббар порендерится вне footer (страховка) */}
        <div className="sm:hidden print:hidden" style={{ height: "calc(var(--tabbar-h) + var(--sab))" }} aria-hidden />
      </div>
    </div>
  );
}