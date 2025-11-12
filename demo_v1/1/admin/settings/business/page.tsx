"use client";

import { useEffect, useMemo, useState } from "react";
import SettingsNav from "../components/SettingsNav";
import BusinessOrgForm from "../components/BusinessOrgForm";
import BusinessLocationsTable from "../components/BusinessLocationsTable";
import LocationForm from "../components/LocationForm";
import SaveBar from "../components/SaveBar";
import { defaultBusiness, defaultLocations } from "../data/mockSettingsBusiness";

type Org = typeof defaultBusiness;
type Loc = (typeof defaultLocations)[number];

export default function AdminSettingsBusinessPage() {
  const [org, setOrg] = useState<Org>(defaultBusiness);
  const [locations, setLocations] = useState<Loc[]>(defaultLocations);
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // Безопасная загрузка snapshot из localStorage (только на клиенте)
  useEffect(() => {
    try {
      const o = localStorage.getItem("admin.settings.business.org");
      const l = localStorage.getItem("admin.settings.business.locations");
      if (o) setOrg(JSON.parse(o));
      if (l) setLocations(JSON.parse(l));
    } catch {
      // no-op: остаёмся на значениях по умолчанию
    }
  }, []);

  const currentLocation = useMemo(
    () => locations.find((x) => x.id === editingLocation) ?? null,
    [locations, editingLocation]
  );

  const onSave = () => {
    try {
      localStorage.setItem("admin.settings.business.org", JSON.stringify(org));
      localStorage.setItem("admin.settings.business.locations", JSON.stringify(locations));
      setDirty(false);
    } catch {
      alert("Не удалось сохранить в localStorage (демо).");
    }
  };

  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      <div className="min-w-0">
        <SettingsNav
          title="Бизнес-настройки"
          items={[
            { href: "#org", label: "Организация" },
            { href: "#locations", label: "Локации" },
          ]}
        />
      </div>

      {/* Организация */}
      <section
        id="org"
        className="
          rounded-2xl border border-white/15 bg-white/[0.05]
          p-4 md:p-6 min-w-0
        "
      >
        <BusinessOrgForm
          value={org}
          onChange={(v) => {
            setOrg(v);
            setDirty(true);
          }}
        />
      </section>

      {/* Локации */}
      <section
        id="locations"
        className="
          rounded-2xl border border-white/15 bg-white/[0.05]
          p-4 md:p-6 min-w-0
        "
      >
        {/* Таблица — сама управляет своим горизонтальным скроллом */}
        <BusinessLocationsTable
          rows={locations}
          onEdit={(id) => setEditingLocation(id)}
          onToggleActive={(id) => {
            setLocations((prev) =>
              prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
            );
            setDirty(true);
          }}
          onCreate={() => {
            const id = `loc_${Date.now()}`;
            const draft: Loc = {
              id,
              name: "Новая локация",
              city: "",
              country: "",
              tz: "Asia/Seoul",
              phone: "",
              active: true,
              hours: {},
            };
            setLocations((prev) => [draft, ...prev]);
            setEditingLocation(id);
            setDirty(true);
          }}
        />

        {/* Карточка выбранной локации (адаптивная) */}
        {currentLocation && (
          <div className="mt-4 min-w-0">
            <LocationForm
              value={currentLocation}
              onCancel={() => setEditingLocation(null)}
              onChange={(val) => {
                setLocations((prev) => prev.map((r) => (r.id === val.id ? val : r)));
                setDirty(true);
              }}
              onArchive={(id) => {
                setLocations((prev) => prev.filter((r) => r.id !== id));
                setEditingLocation(null);
                setDirty(true);
              }}
            />
          </div>
        )}
      </section>

      {/* Панель сохранения (плавающая) */}
      <SaveBar dirty={dirty} onSave={onSave} onCancel={() => window.location.reload()} />
    </div>
  );
}