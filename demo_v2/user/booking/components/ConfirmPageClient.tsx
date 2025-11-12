"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmSummary from "./ConfirmSummary";
import PolicyNote from "./PolicyNote";
import { services } from "../../services/data/mockUserServices";
import { bookingPolicies } from "../data/mockBookingPolicies";

const addonMap: Record<string, Array<{ id: string; title: string; price: number; duration: number }>> = {
  "svc-spa-balance": [
    { id: "aroma", title: "Ароматическое масло", price: 900, duration: 10 },
    { id: "tea", title: "Чайная церемония", price: 500, duration: 15 },
  ],
  "svc-facial-glow": [
    { id: "led", title: "Дополнительная LED-сессия", price: 1200, duration: 15 },
  ],
};

export default function ConfirmPageClient() {
  const params = useSearchParams();
  const router = useRouter();
  const service = useMemo(() => {
    const id = params.get("service");
    if (!id) return services[0];
    return services.find((item) => item.id === id || item.slug === id) ?? services[0];
  }, [params]);

  const slotStart = params.get("slot");
  const slot = slotStart
    ? {
        start: slotStart,
        staffName: service.staff.find((staff) => staff.id === params.get("staff"))?.name,
        locationLabel: service.locations.find((loc) => loc.id === params.get("location"))?.label,
      }
    : null;
  const addonsParam = params.getAll("addons");
  const availableAddons = addonMap[service.id] ?? [];
  const addons = availableAddons.filter((addon) => addonsParam.includes(addon.id));

  const total = service.price + addons.reduce((sum, addon) => sum + addon.price, 0);
  const policy = bookingPolicies.find((item) => item.serviceId === service.id);

  const [form, setForm] = useState({ name: "Анна Клиент", phone: "+7 (900) 000-00-00", email: "anna@example.com", comment: "", notifyEmail: true, notifySms: true });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bookingId = `bk-${Date.now()}`;
    const deposit = service.deposit ?? 0;
    if (deposit > 0) {
      router.push(`/demo/user/payments/checkout?bookingId=${bookingId}&deposit=${deposit}`);
    } else {
      router.push(`/demo/user/booking/success?bookingId=${bookingId}&service=${service.id}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0">
      <ConfirmSummary service={service} slot={slot} addons={addons} total={total} deposit={service.deposit} />

      <form className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Контактные данные</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col text-xs text-[hsl(var(--muted))]">
                Имя
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/60 px-3 py-2 text-sm text-[hsl(var(--fg))]"
                  required
                />
              </label>
              <label className="flex flex-col text-xs text-[hsl(var(--muted))]">
                Телефон
                <input
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  className="mt-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/60 px-3 py-2 text-sm text-[hsl(var(--fg))]"
                  required
                />
              </label>
              <label className="flex flex-col text-xs text-[hsl(var(--muted))] sm:col-span-2">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="mt-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/60 px-3 py-2 text-sm text-[hsl(var(--fg))]"
                  required
                />
              </label>
              <label className="flex flex-col text-xs text-[hsl(var(--muted))] sm:col-span-2">
                Комментарий для мастера (необязательно)
                <textarea
                  value={form.comment}
                  onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
                  className="mt-1 min-h-[96px] rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/60 px-3 py-2 text-sm text-[hsl(var(--fg))]"
                />
              </label>
            </div>
          </section>

          <section className="space-y-2 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Напоминания</h3>
            <label className="flex items-center gap-2 text-sm text-[hsl(var(--fg))]">
              <input
                type="checkbox"
                checked={form.notifyEmail}
                onChange={(event) => setForm((prev) => ({ ...prev, notifyEmail: event.target.checked }))}
                className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
              />
              Получать email-напоминания
            </label>
            <label className="flex items-center gap-2 text-sm text-[hsl(var(--fg))]">
              <input
                type="checkbox"
                checked={form.notifySms}
                onChange={(event) => setForm((prev) => ({ ...prev, notifySms: event.target.checked }))}
                className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
              />
              Получать SMS-напоминания
            </label>
          </section>

          {policy ? (
            <PolicyNote
              cancellation={policy.cancellation}
              depositPolicy={policy.depositPolicy}
              reminders={policy.reminders}
            />
          ) : null}
        </div>

        <aside className="space-y-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-6 shadow-lg">
          <div className="space-y-2 text-sm text-[hsl(var(--muted))]">
            <p>Итого к оплате сейчас: {service.deposit ? `${service.deposit.toLocaleString("ru-RU")} ₽` : "0 ₽"}</p>
            <p>Стоимость после визита: {service.deposit ? `${(total - service.deposit).toLocaleString("ru-RU")} ₽` : `${total.toLocaleString("ru-RU")} ₽`}</p>
            <p className="text-xs text-[hsl(var(--muted))]">Промокоды и баллы можно применить на шаге оплаты.</p>
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Подтвердить бронь
          </button>
        </aside>
      </form>
    </div>
  );
}
