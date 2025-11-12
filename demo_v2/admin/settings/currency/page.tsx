"use client";

import React, { useCallback, useEffect, useState } from "react";

import SettingsNav from "../components/SettingsNav";
import CurrencyForm from "../components/CurrencyForm";
import RatesTable from "../components/RatesTable";
import FormatPreview from "../components/FormatPreview";
import SaveBar from "../components/SaveBar";

import {
  defaultCurrency,
  defaultRates,
  defaultFormat,
} from "../data/mockSettingsCurrency";

/* localStorage keys */
const LS_KEY_BASE = "admin.settings.currency.base";
const LS_KEY_RATES = "admin.settings.currency.rates";
const LS_KEY_FORMAT = "admin.settings.currency.format";

export default function AdminSettingsCurrencyPage() {
  const [cur, setCur] = useState(defaultCurrency);
  const [rates, setRates] = useState(defaultRates);
  const [fmt, setFmt] = useState(defaultFormat);
  const [dirty, setDirty] = useState(false);

  // Load snapshots (client-only, SSR-safe)
  useEffect(() => {
    try {
      const c = localStorage.getItem(LS_KEY_BASE);
      const r = localStorage.getItem(LS_KEY_RATES);
      const f = localStorage.getItem(LS_KEY_FORMAT);
      if (c) setCur(JSON.parse(c));
      if (r) setRates(JSON.parse(r));
      if (f) setFmt(JSON.parse(f));
    } catch {
      /* ignore malformed data */
    }
  }, []);

  // Warn on tab close if there are unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const onSave = useCallback(() => {
    try {
      localStorage.setItem(LS_KEY_BASE, JSON.stringify(cur));
      localStorage.setItem(LS_KEY_RATES, JSON.stringify(rates));
      localStorage.setItem(LS_KEY_FORMAT, JSON.stringify(fmt));
      setDirty(false);
    } catch {
      alert("Не удалось сохранить настройки (localStorage).");
    }
  }, [cur, rates, fmt]);

  const onCancel = useCallback(() => {
    try {
      const c = localStorage.getItem(LS_KEY_BASE);
      const r = localStorage.getItem(LS_KEY_RATES);
      const f = localStorage.getItem(LS_KEY_FORMAT);
      setCur(c ? JSON.parse(c) : defaultCurrency);
      setRates(r ? JSON.parse(r) : defaultRates);
      setFmt(f ? JSON.parse(f) : defaultFormat);
      setDirty(false);
    } catch {
      setCur(defaultCurrency);
      setRates(defaultRates);
      setFmt(defaultFormat);
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
          title="Валюта и форматы"
          items={[
            { href: "#base", label: "Базовая валюта" },
            { href: "#rates", label: "Курсы" },
            { href: "#format", label: "Форматы" },
          ]}
        />
      </div>

      {/* Базовая валюта */}
      <section
        id="base"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6 min-w-0"
        aria-labelledby="currency-base-title"
      >
        <h2 id="currency-base-title" className="sr-only">
          Базовая валюта и отображение
        </h2>
        <CurrencyForm
          value={cur}
          onChange={(v) => {
            setCur(v);
            setDirty(true);
          }}
        />
      </section>

      {/* Курсы — собственный горизонтальный скролл */}
      <section id="rates" className="-mx-3 md:mx-0" aria-labelledby="currency-rates-title">
        <h2 id="currency-rates-title" className="sr-only">
          Курсы валют
        </h2>
        <div className="px-3 md:px-0 rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-6 min-w-0">
          <RatesTable
            rows={rates}
            onChange={(rows) => {
              setRates(rows);
              setDirty(true);
            }}
          />
        </div>
      </section>

      {/* Форматы */}
      <section
        id="format"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6 min-w-0"
        aria-labelledby="currency-format-title"
      >
        <h2 id="currency-format-title" className="sr-only">
          Форматы чисел и дат
        </h2>
        <FormatPreview
          value={fmt}
          onChange={(v) => {
            setFmt(v);
            setDirty(true);
          }}
        />
      </section>

      <SaveBar dirty={dirty} onSave={onSave} onCancel={onCancel} />
    </div>
  );
}