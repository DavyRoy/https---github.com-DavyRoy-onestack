// app/demo/admin/layout.tsx — full-width desktop + мобильный spacer под таб-бар
import AdminTopbar from "./components/AdminTopbar";
import Sidebar from "./components/AdminSidebar.client";
import Breadcrumbs from "./components/AdminBreadcrumbs.client";
import MobileTabbar from "./components/MobileTabbar.client";
import "./globals.css";

const shellWrap =
  "admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={shellWrap}>
      <div className="relative flex min-h-screen flex-col">
        <AdminTopbar />

        {/* full-width layout with responsive gutters */}
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 gap-4 px-3 pb-24 pt-6 sm:px-6 sm:pt-8 md:px-10 lg:gap-6">
            <Sidebar />

            <main className="flex-1 min-w-0">
              <div className="flex flex-col gap-4 min-w-0">
                <div className="admin-glass admin-surface-bleed px-4 py-3 sm:px-5">
                  <Breadcrumbs />
                </div>

                <div className="admin-page">{children}</div>
              </div>
            </main>
          </div>
        </div>

        {/* Мобильный таб-бар */}
        <MobileTabbar />

        {/* Spacer, чтобы контент не уезжал под таб-бар (только на мобилках) */}
        <div className="h-20 sm:hidden" />
      </div>
    </div>
  );
}
