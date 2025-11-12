"use client";
import CatalogGrid from "../components/CatalogGrid";

export default function IntegrationsCatalogPage() {
  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold">Каталог интеграций</h1>
          <p className="text-sm text-white/60 mt-1">
            Подключайте почту, SMS, мессенджеры и другие сервисы.
          </p>
        </div>
      </header>

      <div className="min-w-0">
        <CatalogGrid />
      </div>
    </div>
  );
}