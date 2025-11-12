"use client";

import React from "react";

type Location = {
  id?: string;
  name?: string;
  tz?: string;
  city?: string;
  country?: string;
  address?: string;
  phone?: string;
  active?: boolean;
};

type Props = {
  value: Location;
  onChange: (v: Location) => void;
  onCancel: () => void;
  onArchive: (id: string) => void;
};

export default function LocationForm({ value, onChange, onCancel, onArchive }: Props) {
  const v: Location = value || {};
  const set = <K extends keyof Location,>(k: K, val: Location[K]) =>
    onChange({ ...v, [k]: val });

  const tzOptions = ["Europe/Moscow", "Asia/Seoul", "Europe/London", "America/New_York"];

  const handleArchive = () => {
    if (!v?.id) {
      onCancel();
      return;
    }
    if (confirm("Точно архивировать эту локацию?")) onArchive(v.id);
  };

  const nameId = React.useId();
  const tzId = React.useId();
  const cityId = React.useId();
  const countryId = React.useId();
  const addressId = React.useId();
  const phoneId = React.useId();

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 md:p-5 w-full max-w-full min-w-0">
      {/* Хедер карточки */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 min-w-0">
        <div className="font-medium text-base">Карточка локации</div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/[0.08] transition"
          >
            Закрыть
          </button>

          <button
            type="button"
            onClick={handleArchive}
            className="w-full sm:w-auto rounded-lg border border-rose-400/40 text-rose-200 px-3 py-2 text-sm hover:bg-rose-500/10 transition"
          >
            Архивировать
          </button>
        </div>
      </div>

      {/* Форма */}
      <div className="grid gap-3 md:grid-cols-2 mt-4 min-w-0">
        {/* Название */}
        <label htmlFor={nameId} className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Название</span>
          <input
            id={nameId}
            className="w-full rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.name ?? ""}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Напр. «Центр»"
          />
        </label>

        {/* Часовой пояс */}
        <label htmlFor={tzId} className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Часовой пояс</span>
          <select
            id={tzId}
            className="w-full rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.tz ?? ""}
            onChange={(e) => set("tz", e.target.value)}
          >
            <option value="" disabled>
              Выберите часовой пояс
            </option>
            {tzOptions.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </label>

        {/* Город */}
        <label htmlFor={cityId} className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Город</span>
          <input
            id={cityId}
            className="w-full rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.city ?? ""}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Москва"
          />
        </label>

        {/* Страна */}
        <label htmlFor={countryId} className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Страна</span>
          <input
            id={countryId}
            className="w-full rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.country ?? ""}
            onChange={(e) => set("country", e.target.value)}
            placeholder="RU"
            maxLength={2}
          />
        </label>

        {/* Адрес */}
        <label htmlFor={addressId} className="grid gap-1 text-sm md:col-span-2 min-w-0">
          <span className="text-white/80">Адрес</span>
          <input
            id={addressId}
            className="w-full rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 break-words"
            value={v.address ?? ""}
            onChange={(e) => set("address", e.target.value)}
            placeholder="ул. Пример, 1"
          />
        </label>

        {/* Телефон */}
        <label htmlFor={phoneId} className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Телефон</span>
          <input
            id={phoneId}
            type="tel"
            inputMode="tel"
            className="w-full rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+7 000 000-00-00"
          />
        </label>

        {/* Активна */}
        <label className="inline-flex items-center gap-2 text-sm mt-2 md:mt-6">
          <input
            type="checkbox"
            checked={!!v.active}
            onChange={(e) => set("active", e.target.checked)}
            aria-label="Локация активна"
          />
          Активна
        </label>
      </div>
    </section>
  );
}