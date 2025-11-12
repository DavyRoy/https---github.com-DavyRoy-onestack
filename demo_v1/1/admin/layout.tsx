// app/demo/admin/layout.tsx — full-width desktop + мобильный spacer под таб-бар
import AdminTopbar from "./components/AdminTopbar";
import Sidebar from "./components/AdminSidebar.client";
import Breadcrumbs from "./components/AdminBreadcrumbs.client";
import MobileTabbar from "./components/MobileTabbar.client";
import "./globals.css";

const shellWrap =
  "min-h-screen bg-gradient-to-br from-[#0B0E17] via-[#0F1325] to-black text-white";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={shellWrap}>
      <AdminTopbar />
      {/* full-width layout, без max-w; только горизонтальные паддинги */}
      <div className="mx-auto flex w-full gap-4 px-3 pb-12 sm:px-6 md:px-8">
        <Sidebar />
        <main className="min-h-screen flex-1 py-6">
          <div className="mx-auto w-full">
            <Breadcrumbs />
            <div className="mt-4">{children}</div>
          </div>
        </main>
      </div>

      {/* Мобильный таб-бар */}
      <MobileTabbar />

      {/* Spacer, чтобы контент не уезжал под таб-бар (только на мобилках) */}
      <div className="h-20 sm:hidden" />
    </div>
  );
}