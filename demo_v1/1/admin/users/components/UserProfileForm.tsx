"use client";

import { useState } from "react";

type User = {
  name: string;
  phone?: string;
  tz?: string;
};

export default function UserProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [tz, setTz] = useState(user.tz ?? "Asia/Seoul");

  const save = () => alert("Сохранено (демо)");

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0">
      <div className="text-sm text-white/70 mb-3">Профиль</div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <input
          className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-white/90 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя"
        />
        <input
          className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-white/90 w-full"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-white/90 w-full"
          value={tz}
          onChange={(e) => setTz(e.target.value)}
        >
          <option value="Asia/Seoul">Asia/Seoul</option>
          <option value="Europe/Moscow">Europe/Moscow</option>
          <option value="UTC">UTC</option>
        </select>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={save}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/[0.08] transition"
        >
          Сохранить
        </button>
      </div>
    </section>
  );
}