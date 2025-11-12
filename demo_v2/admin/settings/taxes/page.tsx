"use client";

import React, { useCallback, useEffect, useState } from "react";
import SettingsNav from "../components/SettingsNav";
import TaxesTable from "../components/TaxesTable";
import TaxRuleEditor from "../components/TaxRuleEditor";
import SaveBar from "../components/SaveBar";
import { defaultTaxes, defaultRules } from "../data/mockSettingsTaxes";

const RATES_KEY = "admin.settings.taxes.rates";
const RULES_KEY = "admin.settings.taxes.rules";

export default function AdminSettingsTaxesPage() {
  const [rates, setRates] = useState(defaultTaxes);
  const [rules, setRules] = useState(defaultRules);
  const [dirty, setDirty] = useState(false);

  // --- Load snapshots from localStorage (client-side only) ---
  useEffect(() => {
    try {
      const r = localStorage.getItem(RATES_KEY);
      const ru = localStorage.getItem(RULES_KEY);
      if (r) setRates(JSON.parse(r));
      if (ru) setRules(JSON.parse(ru));
    } catch {
      // ignore malformed data
    }
  }, []);

  // --- Warn user about unsaved changes before closing the page ---
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // --- Save changes to localStorage ---
  const onSave = useCallback(() => {
    try {
      localStorage.setItem(RATES_KEY, JSON.stringify(rates));
      localStorage.setItem(RULES_KEY, JSON.stringify(rules));
      setDirty(false);
    } catch {
      alert("Не удалось сохранить настройки (localStorage).");
    }
  }, [rates, rules]);

  // --- Cancel changes and restore last saved snapshot ---
  const onCancel = useCallback(() => {
    try {
      const r = localStorage.getItem(RATES_KEY);
      const ru = localStorage.getItem(RULES_KEY);
      setRates(r ? JSON.parse(r) : defaultTaxes);
      setRules(ru ? JSON.parse(ru) : defaultRules);
      setDirty(false);
    } catch {
      setRates(defaultTaxes);
      setRules(defaultRules);
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
      <div className="min-w-0">
        <SettingsNav
          title="Локализация и налоги"
          items={[
            { href: "#rates", label: "Ставки" },
            { href: "#rules", label: "Правила" },
          ]}
        />
      </div>

      {/* Налоговые ставки */}
      <section
        id="rates"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6 min-w-0"
        aria-labelledby="rates-title"
      >
        <h2 id="rates-title" className="sr-only">
          Налоговые ставки
        </h2>
        <TaxesTable
          rows={rates}
          onChange={(rows) => {
            setRates(rows);
            setDirty(true);
          }}
        />
      </section>

      {/* Правила применения налогов */}
      <section
        id="rules"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6 min-w-0"
        aria-labelledby="rules-title"
      >
        <h2 id="rules-title" className="sr-only">
          Правила применения налогов
        </h2>
        <TaxRuleEditor
          value={rules}
          onChange={(v) => {
            setRules(v);
            setDirty(true);
          }}
        />
      </section>

      {/* Панель сохранения */}
      <SaveBar dirty={dirty} onSave={onSave} onCancel={onCancel} />
    </div>
  );
}