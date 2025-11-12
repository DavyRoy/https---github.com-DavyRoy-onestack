"use client";

import { useEffect, useState } from "react";
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

export default function AdminSettingsCurrencyPage() {
  const [cur, setCur] = useState(defaultCurrency);
  const [rates, setRates] = useState(defaultRates);
  const [fmt, setFmt] = useState(defaultFormat);
  const [dirty, setDirty] = useState(false);

  // Загрузка снапшотов (клиент)
  useEffect(() => {
    try {
      const c = localStorage.getItem("admin.settings.currency.base");
      const r = localStorage.getItem("admin.settings.currency.rates");
      const f = localStorage.getItem("admin.settings.currency.format");
      if (c) setCur(JSON.parse(c));
      if (r) setRates(JSON.parse(r));
      if (f) setFmt(JSON.parse(f));
    } catch {
      /* no-op */
    }
  }, []);

  const onSave = () => {
    try {
      localStorage.setItem("admin.settings.currency.base", JSON.stringify(cur));
      localStorage.setItem("admin.settings.currency.rates", JSON.stringify(rates));
      localStorage.setItem("admin.settings.currency.format", JSON.stringify(fmt));
      setDirty(false);
    } catch {
      alert("Не удалось сохранить настройки (демо).");
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
          title="Валюта и форматы"
          items={[
            { href: "#base", label: "Базовая валюта" },
            { href: "#rates", label: "Курсы" },
            { href: "#format", label: "Форматы" },
          ]}
        />
      </div>

      <section
        id="base"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6 min-w-0"
      >
        <CurrencyForm
          value={cur}
          onChange={(v) => {
            setCur(v);
            setDirty(true);
          }}
        />
      </section>

      {/* Таблица со своим горизонтальным скроллом — слегка «выпускаем» края на мобиле */}
      <section className="-mx-3 md:mx-0" id="rates">
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

      <section
        id="format"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6 min-w-0"
      >
        <FormatPreview
          value={fmt}
          onChange={(v) => {
            setFmt(v);
            setDirty(true);
          }}
        />
      </section>

      <SaveBar
        dirty={dirty}
        onSave={onSave}
        onCancel={() => window.location.reload()}
      />
    </div>
  );
}