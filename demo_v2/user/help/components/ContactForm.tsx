"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ topic: "Оплата", email: "", message: "", attach: false });
  const [sent, setSent] = useState(false);
  return (
    <div className="p-4 border rounded bg-white">
      <h4 className="font-semibold">Отправить запрос</h4>
      {!sent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="mt-2 space-y-2"
        >
          <select
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            className="border p-2 w-full"
          >
            <option>Оплата</option>
            <option>Бронирование</option>
            <option>Заказ/Доставка</option>
            <option>Аккаунт</option>
            <option>Другое</option>
          </select>
          <input
            className="border p-2 w-full"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <textarea
            className="border p-2 w-full"
            placeholder="Сообщение"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.attach}
              onChange={(e) => setForm({ ...form, attach: e.target.checked })}
            />{" "}
            Приложить скрин
          </label>
          <div>
            <button className="bg-blue-600 text-white px-3 py-2 rounded" type="submit">
              Отправить
            </button>
          </div>
        </form>
      ) : (
        <div className="text-green-600">Запрос отправлен. Мы ответим на указанный e-mail.</div>
      )}
    </div>
  );
}