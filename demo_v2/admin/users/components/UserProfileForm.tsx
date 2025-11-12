"use client";

import React from "react";

type User = {
  name: string;
  phone?: string;
  tz?: string;
};

export default function UserProfileForm({ user }: { user: User }) {
  const [name, setName] = React.useState(user.name ?? "");
  const [phone, setPhone] = React.useState(user.phone ?? "");
  const [tz, setTz] = React.useState(user.tz ?? "Asia/Seoul");

  // простая валидация (минимум 2 символа имени, телефон — цифры/пробелы/+/-/() )
  const nameErr = name.trim().length < 2 ? "Введите не менее 2 символов" : "";
  const phoneErr =
    phone && !/^[\d\s()+\-]{5,}$/.test(phone)
      ? "Допустимы цифры, пробелы, +, -, ( )"
      : "";

  const dirty =
    name !== (user.name ?? "") ||
    phone !== (user.phone ?? "") ||
    tz !== (user.tz ?? "Asia/Seoul");

  const hasErrors = Boolean(nameErr || phoneErr);

  const save = () => {
    if (hasErrors) return;
    alert("Сохранено (демо)");
  };

  const reset = () => {
    setName(user.name ?? "");
    setPhone(user.phone ?? "");
    setTz(user.tz ?? "Asia/Seoul");
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0">
      <div className="text-sm text-white/70 mb-3">Профиль</div>

      <form
        className="grid gap-3 sm:grid-cols-2 md:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        noValidate
      >
        {/* Имя */}
        <div className="min-w-0">
          <label htmlFor="user-name" className="block text-xs text-white/60 mb-1">
            Имя
          </label>
          <input
            id="user-name"
            className={`w-full bg-transparent border rounded-lg px-3 py-2 text-sm text-white/90 outline-none focus:ring-2 focus:ring-white/20 ${
              nameErr ? "border-rose-400/60" : "border-white/20"
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя и фамилия"
            aria-invalid={!!nameErr}
            aria-describedby={nameErr ? "name-error" : undefined}
          />
          {nameErr && (
            <div id="name-error" className="mt-1 text-[11px] text-rose-300">
              {nameErr}
            </div>
          )}
        </div>

        {/* Телефон */}
        <div className="min-w-0">
          <label htmlFor="user-phone" className="block text-xs text-white/60 mb-1">
            Телефон
          </label>
          <input
            id="user-phone"
            inputMode="tel"
            className={`w-full bg-transparent border rounded-lg px-3 py-2 text-sm text-white/90 outline-none focus:ring-2 focus:ring-white/20 ${
              phoneErr ? "border-rose-400/60" : "border-white/20"
            }`}
            placeholder="+7 (999) 123-45-67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={!!phoneErr}
            aria-describedby={phoneErr ? "phone-error" : undefined}
          />
          {phoneErr && (
            <div id="phone-error" className="mt-1 text-[11px] text-rose-300">
              {phoneErr}
            </div>
          )}
        </div>

        {/* Часовой пояс */}
        <div className="min-w-0">
          <label htmlFor="user-tz" className="block text-xs text-white/60 mb-1">
            Часовой пояс
          </label>
          <select
            id="user-tz"
            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-white/90 outline-none focus:ring-2 focus:ring-white/20"
            value={tz}
            onChange={(e) => setTz(e.target.value)}
          >
            <option value="Asia/Seoul">Asia/Seoul</option>
            <option value="Europe/Moscow">Europe/Moscow</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        {/* Кнопки действий */}
        <div className="sm:col-span-2 md:col-span-3 flex flex-wrap gap-2 justify-end mt-1">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/[0.08] transition"
            disabled={!dirty}
          >
            Сбросить
          </button>
          <button
            type="submit"
            disabled={!dirty || hasErrors}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              !dirty || hasErrors
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-white/90 text-black hover:bg-white"
            }`}
            aria-disabled={!dirty || hasErrors}
          >
            Сохранить
          </button>
        </div>
      </form>
    </section>
  );
}