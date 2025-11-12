// app/demo/admin/payments/components/ProviderKeysForm.tsx
"use client";

import * as React from "react";
import { Eye, EyeOff, Link2, KeyRound, Send } from "lucide-react";

export default function ProviderKeysForm() {
  const [showSecret, setShowSecret] = React.useState(false);

  const handleTestWebhook = () => {
    alert("Отправлен тестовый вебхук (демо)");
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="text-sm text-white/70 mb-3 flex items-center gap-2 font-medium">
        <KeyRound className="w-4 h-4 opacity-70" />
        Ключи и вебхуки
      </div>

      <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
        {/* Public key */}
        <div className="grid gap-1">
          <label htmlFor="publicKey" className="text-xs text-white/60">
            Public key
          </label>
          <input
            id="publicKey"
            type="text"
            defaultValue="pk_live_****************"
            readOnly
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white/90 placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        {/* Secret key */}
        <div className="grid gap-1">
          <label htmlFor="secretKey" className="text-xs text-white/60">
            Secret key
          </label>
          <div className="relative">
            <input
              id="secretKey"
              type={showSecret ? "text" : "password"}
              defaultValue="sk_live_************************"
              readOnly
              className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 pr-10 text-sm text-white/90 placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              type="button"
              onClick={() => setShowSecret((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
              aria-label={showSecret ? "Скрыть ключ" : "Показать ключ"}
            >
              {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Webhook URL */}
        <div className="grid gap-1">
          <label htmlFor="webhookUrl" className="text-xs text-white/60">
            Webhook URL
          </label>
          <div className="relative">
            <input
              id="webhookUrl"
              type="url"
              defaultValue="https://example.com/webhooks/payments"
              className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 pr-10 text-sm text-white/90 placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20"
            />
            <Link2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" aria-hidden="true" />
          </div>
        </div>

        {/* Actions */}
        <button
          type="button"
          onClick={handleTestWebhook}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/90 text-black px-3 py-2 text-sm font-medium hover:bg-white focus:ring-2 focus:ring-white/30 transition"
        >
          <Send className="w-4 h-4" />
          Тестовый вебхук
        </button>
      </form>
    </section>
  );
}