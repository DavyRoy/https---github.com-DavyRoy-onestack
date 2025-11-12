// app/demo/manager/layout.tsx
import ManagerTopbar from "./components/ManagerTopbar";
import Sidebar from "./components/ManagerSidebar.client";
import Breadcrumbs from "./components/ManagerBreadcrumbs.client";
import MobileTabbar from "./components/MobileTabbar.client";
import "../admin/globals.css"; // общий стиль оболочки (admin-shell, admin-section и т.п.)
import type { ReactNode } from "react";

const shellWrap = "admin-shell";

export default function ManagerLayout({ children }: { children: ReactNode }) {
  // Безопасные переменные для safe-area (iOS) с фолбэком
  // Используем через inline style, чтобы не зависеть от внешних стилей.
  const styleVars: React.CSSProperties = {
    // top / bottom safe-area
    // @ts-expect-error CSS var runtime
    "--sat": "env(safe-area-inset-top, 0px)",
    // @ts-expect-error CSS var runtime
    "--sab": "env(safe-area-inset-bottom, 0px)",
    // высота закреплённого топ-бара (держим в одном месте)
    // подгоните под ваш ManagerTopbar, если у него иная высота
    // @ts-expect-error CSS var runtime
    "--topbar-h": "64px",
    // высота моб. таб-бара (если меняется в компоненте — обновите тут)
    // @ts-expect-error CSS var runtime
    "--tabbar-h": "64px",
  };

  return (
    <div className={shellWrap} style={styleVars}>
      {/* Skip link для клавиатуры/скринридеров */}
      <a
        href="#manager-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-[calc(var(--sat)+8px)] focus:z-[100] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-black"
      >
        Перейти к основному контенту
      </a>

      <div className="relative flex min-h-[100svh] min-h-dvh flex-col text-white">
        {/* Верхняя панель (закреплённая в своём компоненте или просто сверху) */}
        <header
          role="banner"
          className="sticky top-0 z-40"
          style={{ paddingTop: "var(--sat)" }}
        >
          <ManagerTopbar />
        </header>

        {/* Контейнер раскладки */}
        <div className="flex flex-1 flex-col">
          {/* Основная рабочая область */}
          <div
            className="
              flex flex-1 gap-4
              px-3 pb-24 pt-4
              sm:px-6 sm:pt-6
              md:px-10 lg:gap-6
            "
            // отступ снизу под мобильный таб-бар + safe-area
            style={{
              paddingBottom: "calc(var(--sab) + var(--tabbar-h) + 16px)",
            }}
          >
            {/* Сайдбар: в компонентах уже заложена desktop-only логика.
                Если нет — можно скрыть на мобилках классом 'hidden lg:block' в самом Sidebar. */}
            <nav aria-label="Боковая навигация" className="hidden lg:block">
              <Sidebar />
            </nav>

            {/* Основная колонка */}
            <main
              id="manager-main"
              role="main"
              className="
                flex-1 min-w-0
                scroll-mt-[calc(var(--topbar-h)+12px)]
              "
            >
              <div className="flex min-w-0 flex-col gap-4">
                {/* Крошки в стеклянной плашке — как у админа */}
                <div
                  className="admin-glass admin-surface-bleed px-4 py-3 sm:px-5"
                  // чтобы крошки не прилипали под фикс. топ-бар при якорях
                  style={{ marginTop: "calc(var(--sat))" }}
                >
                  <Breadcrumbs />
                </div>

                {/* Страница */}
                <div className="admin-page">{children}</div>
              </div>
            </main>
          </div>
        </div>

        {/* Нижний мобильный таб-бар (категории менеджера) */}
        <footer
          role="contentinfo"
          className="sm:hidden fixed inset-x-0 bottom-0 z-40"
          // прибираем врез внизу
          style={{ paddingBottom: "var(--sab)" }}
        >
          <MobileTabbar />
        </footer>

        {/* Spacer, если таб-бар рендерится не фиксированным внутри <footer>.
            На всякий случай оставляю, но делаю динамическим и скрытым на sm+ */}
        <div
          className="sm:hidden"
          style={{ height: "calc(var(--tabbar-h) + var(--sab))" }}
          aria-hidden
        />
      </div>
    </div>
  );
}