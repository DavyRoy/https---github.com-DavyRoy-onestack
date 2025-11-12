"use client";

import React from "react";
import { Eye, EyeOff, Link2, KeyRound, Send } from "lucide-react";

export default function ProviderKeysForm() {
  const [show, setShow] = React.useState(false);

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
      <div className="text-sm text-white/70 mb-3 flex items-center gap-2">
        <KeyRound className="w-4 h-4 opacity-70" />
        Ключи и вебхуки
      </div>

      <div className="grid gap-3">
        {/* Public key */}
        <label className="text-xs text-white/60">Public key</label>
        <input
          defaultValue="pk_live_****************"
          className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20"
        />

        {/* Secret key */}
        <label className="text-xs text-white/60">Secret key</label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            defaultValue="sk_live_************************"
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20 pr-10"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Webhook URL */}
        <label className="text-xs text-white/60">Webhook URL</label>
        <div className="relative">
          <input
            defaultValue="https://example.com/webhooks/payments"
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20 pr-10"
          />
          <Link2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        </div>

        {/* Actions */}
        <button
          onClick={() => alert("Отправлен тестовый вебхук (демо)")}
          className="mt-2 flex items-center gap-2 rounded-lg bg-white/90 text-black px-3 py-2 text-sm hover:bg-white transition w-max"
        >
          <Send className="w-4 h-4" />
          Тестовый вебхук
        </button>
      </div>
    </section>
  );
}