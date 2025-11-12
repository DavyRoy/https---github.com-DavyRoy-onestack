"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SettingsNav from "../components/SettingsNav";
import BusinessOrgForm from "../components/BusinessOrgForm";
import BusinessLocationsTable from "../components/BusinessLocationsTable";
import LocationForm from "../components/LocationForm";
import SaveBar from "../components/SaveBar";
import { defaultBusiness, defaultLocations } from "../data/mockSettingsBusiness";

type Org = typeof defaultBusiness;
type Loc = (typeof defaultLocations)[number];

const ORG_KEY = "admin.settings.business.org";
const LOC_KEY = "admin.settings.business.locations";

export default function AdminSettingsBusinessPage() {
  const [org, setOrg] = useState<Org>(defaultBusiness);
  const [locations, setLocations] = useState<Loc[]>(defaultLocations);
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);

  // ---- Load snapshot from localStorage on client (SSR-safe) ----
  useEffect(() => {
    try {
      const o = localStorage.getItem(ORG_KEY);
      const l = localStorage.getItem(LOC_KEY);

      if (o) {
        const parsedOrg = JSON.parse(o);
        if (parsedOrg && typeof parsedOrg === "object") setOrg(parsedOrg);
      }
      if (l) {
        const parsedLoc = JSON.parse(l);
        if (Array.isArray(parsedLoc)) setLocations(parsedLoc);
      }
    } catch {
      // stay with defaults
    }
  }, []);

  const currentLocation = useMemo(
    () => locations.find((x) => x.id === editingLocation) ?? null,
    [locations, editingLocation]
  );

  // ---- Warn on close when there are unsaved changes ----
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // ---- Optional: lightweight autosnapshot (does not clear `dirty`) ----
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(ORG_KEY, JSON.stringify(org));
        localStorage.setItem(LOC_KEY, JSON.stringify(locations));
      } catch {
        // ignore
      }
    }, 400);
    return () => clearTimeout(t);
  }, [org, locations, dirty]);

  // ---- Save explicitly (clears `dirty`) ----
  const onSave = useCallback(() => {
    try {
      localStorage.setItem(ORG_KEY, JSON.stringify(org));
      localStorage.setItem(LOC_KEY, JSON.stringify(locations));
      setDirty(false);
    } catch {
      alert("Не удалось сохранить в localStorage (демо).");
    }
  }, [org, locations]);

  // ---- Cancel reverts to last saved snapshot (no reload) ----
  const onCancel = useCallback(() => {
    try {
      const o = localStorage.getItem(ORG_KEY);
      const l = localStorage.getItem(LOC_KEY);

      setOrg(o ? JSON.parse(o) : defaultBusiness);
      setLocations(l ? JSON.parse(l) : defaultLocations);
    } catch {
      setOrg(defaultBusiness);
      setLocations(defaultLocations);
    } finally {
      setEditingLocation(null);
      setDirty(false);
    }
  }, []);

  const toggleActive = useCallback((id: string) => {
    setLocations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
    setDirty(true);
  }, []);

  const createLocation = useCallback(() => {
    const newId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `loc_${Date.now().toString(36)}`;

    const draft: Loc = {
      id: newId,
      name: "Новая локация",
      city: "",
      country: "",
      tz: "Asia/Seoul",
      phone: "",
      active: true,
      hours: {},
    };
    setLocations((prev) => [draft, ...prev]);
    setEditingLocation(newId);
    setDirty(true);

    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const onEditLocation = useCallback((id: string) => {
    setEditingLocation(id);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

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
        aria-labelledby="org-title"
      >
        <h2 id="org-title" className="sr-only">
          Организация
        </h2>
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
        aria-labelledby="locations-title"
      >
        <h2 id="locations-title" className="sr-only">
          Локации
        </h2>

        {/* Таблица — сама управляет своим горизонтальным скроллом */}
        <BusinessLocationsTable
          rows={locations}
          onEdit={onEditLocation}
          onToggleActive={toggleActive}
          onCreate={createLocation}
        />

        {/* Карточка выбранной локации (адаптивная) */}
        {currentLocation && (
          <div ref={formRef} className="mt-4 min-w-0">
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
      <SaveBar dirty={dirty} onSave={onSave} onCancel={onCancel} />
    </div>
  );
}