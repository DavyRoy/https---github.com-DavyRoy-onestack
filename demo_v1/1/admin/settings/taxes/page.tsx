"use client";

import { useEffect, useState } from "react";
import SettingsNav from "../components/SettingsNav";
import TaxesTable from "../components/TaxesTable";
import TaxRuleEditor from "../components/TaxRuleEditor";
import SaveBar from "../components/SaveBar";
import { defaultTaxes, defaultRules } from "../data/mockSettingsTaxes";

export default function AdminSettingsTaxesPage() {
  const [rates, setRates] = useState(defaultTaxes);
  const [rules, setRules] = useState(defaultRules);
  const [dirty, setDirty] = useState(false);

  // Загрузка снапшота (клиент)
  useEffect(() => {
    try {
      const r = localStorage.getItem("admin.settings.taxes.rates");
      const ru = localStorage.getItem("admin.settings.taxes.rules");
      if (r) setRates(JSON.parse(r));
      if (ru) setRules(JSON.parse(ru));
    } catch {
      /* no-op */
    }
  }, []);

  const onSave = () => {
    try {
      localStorage.setItem("admin.settings.taxes.rates", JSON.stringify(rates));
      localStorage.setItem("admin.settings.taxes.rules", JSON.stringify(rules));
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
          title="Локализация и налоги"
          items={[
            { href: "#rates", label: "Ставки" },
            { href: "#rules", label: "Правила" },
          ]}
        />
      </div>

      <section
        id="rates"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6 min-w-0"
      >
        <TaxesTable
          rows={rates}
          onChange={(rows) => {
            setRates(rows);
            setDirty(true);
          }}
        />
      </section>

      <section
        id="rules"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6 min-w-0"
      >
        <TaxRuleEditor
          value={rules}
          onChange={(v) => {
            setRules(v);
            setDirty(true);
          }}
        />
      </section>

      <SaveBar dirty={dirty} onSave={onSave} onCancel={() => window.location.reload()} />
    </div>
  );
}