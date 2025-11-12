"use client";

import React, { useEffect, useState, useCallback } from "react";
import SettingsNav from "../components/SettingsNav";
import BrandingThemePicker from "../components/BrandingThemePicker";
import BrandingAssetsUploader from "../components/BrandingAssetsUploader";
import LivePreviewFrame from "../components/LivePreviewFrame";
import SaveBar from "../components/SaveBar";
import DangerZone from "../components/DangerZone";
import { defaultBranding } from "../data/mockSettingsBranding";

const THEME_KEY = "admin.settings.branding.theme";
const ASSETS_KEY = "admin.settings.branding.assets";

export default function AdminSettingsBrandingPage() {
  const [theme, setTheme] = useState(defaultBranding.theme);
  const [assets, setAssets] = useState(defaultBranding.assets);
  const [dirty, setDirty] = useState(false);

  // ---- Load from localStorage (client-only, SSR-safe) ----
  useEffect(() => {
    try {
      const t = localStorage.getItem(THEME_KEY);
      const a = localStorage.getItem(ASSETS_KEY);
      if (t) {
        const parsed = JSON.parse(t);
        if (parsed && typeof parsed === "object") setTheme(parsed);
      }
      if (a) {
        const parsed = JSON.parse(a);
        if (parsed && typeof parsed === "object") setAssets(parsed);
      }
    } catch {
      // ignore malformed data
    }
  }, []);

  // ---- Warn about unsaved changes before closing tab ----
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // ---- Save handler ----
  const onSave = useCallback(() => {
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(theme));
      localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
      setDirty(false);
    } catch {
      alert("Не удалось сохранить настройки (localStorage).");
    }
  }, [theme, assets]);

  // ---- Reset to defaults ----
  const onReset = useCallback(() => {
    setTheme(defaultBranding.theme);
    setAssets(defaultBranding.assets);
    setDirty(true);
  }, []);

  // ---- Cancel (revert to saved snapshot) ----
  const onCancel = useCallback(() => {
    try {
      const t = localStorage.getItem(THEME_KEY);
      const a = localStorage.getItem(ASSETS_KEY);
      if (t) setTheme(JSON.parse(t));
      else setTheme(defaultBranding.theme);
      if (a) setAssets(JSON.parse(a));
      else setAssets(defaultBranding.assets);
      setDirty(false);
    } catch {
      setTheme(defaultBranding.theme);
      setAssets(defaultBranding.assets);
      setDirty(false);
    }
  }, []);

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
        aria-labelledby="theme-title"
      >
        <h2 id="theme-title" className="sr-only">
          Тема оформления
        </h2>
        <BrandingThemePicker
          value={theme}
          onChange={(v) => {
            setTheme(v);
            setDirty(true);
          }}
        />
        <p className="mt-2 text-xs text-white/50">
          Подсказка: основной цвет влияет на кнопки, акценты и бордеры в
          предпросмотре ниже.
        </p>
      </section>

      {/* Активы */}
      <section
        id="assets"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6 min-w-0"
        aria-labelledby="assets-title"
      >
        <h2 id="assets-title" className="sr-only">
          Бренд-активы
        </h2>
        <BrandingAssetsUploader
          value={assets}
          onChange={(v) => {
            setAssets(v);
            setDirty(true);
          }}
        />
      </section>

      {/* Предпросмотр */}
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

      {/* Danger Zone */}
      <DangerZone
        title="Сбросить тему к настройкам по умолчанию"
        actionText="Сбросить"
        onConfirm={onReset}
      />

      {/* Save Bar */}
      <SaveBar dirty={dirty} onSave={onSave} onCancel={onCancel} />
    </div>
  );
}