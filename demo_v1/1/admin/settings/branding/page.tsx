"use client";

import { useEffect, useState } from "react";

import SettingsNav from "../components/SettingsNav";
import BrandingThemePicker from "../components/BrandingThemePicker";
import BrandingAssetsUploader from "../components/BrandingAssetsUploader";
import LivePreviewFrame from "../components/LivePreviewFrame";
import SaveBar from "../components/SaveBar";
import DangerZone from "../components/DangerZone";
import { defaultBranding } from "../data/mockSettingsBranding";

export default function AdminSettingsBrandingPage() {
  const [theme, setTheme] = useState(defaultBranding.theme);
  const [assets, setAssets] = useState(defaultBranding.assets);
  const [dirty, setDirty] = useState(false);

  // client-only загрузка snapshot'ов — безопасно для SSR/hydration
  useEffect(() => {
    try {
      const t = localStorage.getItem("admin.settings.branding.theme");
      const a = localStorage.getItem("admin.settings.branding.assets");
      if (t) setTheme(JSON.parse(t));
      if (a) setAssets(JSON.parse(a));
    } catch {}
  }, []);

  const onSave = () => {
    localStorage.setItem("admin.settings.branding.theme", JSON.stringify(theme));
    localStorage.setItem("admin.settings.branding.assets", JSON.stringify(assets));
    setDirty(false);
  };

  const onReset = () => {
    setTheme(defaultBranding.theme);
    setAssets(defaultBranding.assets);
    setDirty(true);
  };

  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      <SettingsNav
        title="Брендинг и тема"
        items={[
          { href: "#theme", label: "Тема" },
          { href: "#assets", label: "Активы" },
          { href: "#preview", label: "Предпросмотр" },
        ]}
      />

      {/* Тема */}
      <section
        id="theme"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6 min-w-0"
      >
        <BrandingThemePicker
          value={theme}
          onChange={(v) => {
            setTheme(v);
            setDirty(true);
          }}
        />
        <p className="mt-2 text-xs text-white/50">
          Подсказка: primary влияет на кнопки, акценты и бордеры в предпросмотре ниже.
        </p>
      </section>

      {/* Активы */}
      <section
        id="assets"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6 min-w-0"
      >
        <BrandingAssetsUploader
          value={assets}
          onChange={(v) => {
            setAssets(v);
            setDirty(true);
          }}
        />
      </section>

      {/* Предпросмотр (без горизонтального скролла) */}
      <section
        id="preview"
        className="
          rounded-2xl border border-white/15 bg-white/[0.05]
          p-0 overflow-hidden min-w-0
        "
        aria-label="Предпросмотр бренд-темы"
      >
        <LivePreviewFrame theme={theme} assets={assets} />
      </section>

      <DangerZone
        title="Сбросить тему к дефолту"
        actionText="Сбросить"
        onConfirm={onReset}
      />

      <SaveBar dirty={dirty} onSave={onSave} onCancel={() => window.location.reload()} />
    </div>
  );
}