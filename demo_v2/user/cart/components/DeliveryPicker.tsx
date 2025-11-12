"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Truck, Building, Navigation, MapPin, Home, CalendarClock } from "lucide-react";
import type { CartDelivery } from "../data/mockUserCart";
import { cn, CARD_SOFT, CHIP, BTN_GHOST, BADGE_INFO, TEXT_BALANCE } from "./_shared";

export type DeliveryPickerProps = {
  value: CartDelivery;
  addresses: Array<{ id: string; label: string }>;
  onChange: (delivery: CartDelivery) => void;
};

const deliveryServices: Array<{ value: CartDelivery["service"]; label: string; description: string }> = [
  { value: "courier", label: "Курьер OneStack", description: "в течение 2 часов" },
  { value: "cdek", label: "СДЭК (демо)", description: "1–2 дня" },
  { value: "post", label: "Почта", description: "3–5 дней" },
];

export default function DeliveryPicker({ value, addresses, onChange }: DeliveryPickerProps) {
  const isDelivery = value.method === "delivery";

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(CARD_SOFT, "space-y-5 border-white/12 bg-white/8 px-5 py-6")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/14 bg-white/8">
            <Truck className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white/90">Способ получения</h3>
            <p className={cn(TEXT_BALANCE, "text-xs text-white/60")}>
              Выбирайте доставку курьером или забирайте заказ самовывозом.
            </p>
          </div>
        </div>
        <span className={cn(CHIP, "border-white/12 bg-white/6 text-white/65")}>
          {isDelivery ? "Доставка" : "Самовывоз"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DeliveryOption
          icon={<Truck className="h-5 w-5" />}
          label="Доставка"
          description="Привезём в удобное время"
          active={isDelivery}
          onClick={() => onChange({ ...value, method: "delivery" })}
        />
        <DeliveryOption
          icon={<Building className="h-5 w-5" />}
          label="Самовывоз"
          description="Из фирменного салона"
          active={value.method === "pickup"}
          onClick={() => onChange({ ...value, method: "pickup", service: undefined, price: 0 })}
        />
      </div>

      <AnimatePresence initial={false}>
        {isDelivery ? (
          <motion.div
            key="delivery-form"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid gap-4 rounded-2xl border border-white/12 bg-black/45 p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
                <span className="inline-flex items-center gap-2 text-white/70">
                  <Navigation className="h-4 w-4" />
                  Служба доставки
                </span>
                <select
                  value={value.service ?? "courier"}
                  onChange={(event) =>
                    onChange({ ...value, method: "delivery", service: event.target.value as CartDelivery["service"] })
                  }
                  className="h-11 rounded-2xl border border-white/14 bg-white/6 px-3 text-sm font-medium text-white/90"
                >
                  {deliveryServices.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label} · {service.description}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
                <span className="inline-flex items-center gap-2 text-white/70">
                  <MapPin className="h-4 w-4" />
                  Адрес
                </span>
                <select
                  value={value.addressId ?? "addr-home"}
                  onChange={(event) => onChange({ ...value, addressId: event.target.value, method: "delivery" })}
                  className="h-11 rounded-2xl border border-white/14 bg-white/6 px-3 text-sm font-medium text-white/90"
                >
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.label}
                    </option>
                  ))}
                  <option value="new">Новый адрес…</option>
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs text-white/60">
              <span className="inline-flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                Дата и слот уточним после подтверждения
              </span>
              <span className={cn(BADGE_INFO, "border-none bg-white/10 text-white/60")}>
                Стоимость рассчитает checkout
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="pickup-info"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl border border-white/12 bg-black/45 p-4 text-sm text-white/65"
          >
            <div className="flex items-start gap-3">
              <Home className="mt-1 h-5 w-5 text-blue-300" />
              <div className="space-y-1">
                <p className="font-semibold text-white/85">OneStack HUB, Пресненская наб. 6</p>
                <p>Ежедневно с 10:00 до 22:00. Поддерживаем экспресс-выдачу и установку на месте.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

type DeliveryOptionProps = {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
};

function DeliveryOption({ icon, label, description, active, onClick }: DeliveryOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        BTN_GHOST,
        "flex items-start gap-3 rounded-2xl border-white/12 bg-white/6 px-4 py-4 text-left text-sm text-white/70 hover:border-white/20",
        active && "border-cyan-300/50 bg-cyan-500/10 text-white shadow-[0_25px_50px_-40px_rgba(6,182,212,0.8)]"
      )}
      aria-pressed={active}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/14 bg-black/40 text-white/70">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-base font-semibold">{label}</span>
        <span className="text-xs text-white/55">{description}</span>
      </span>
    </button>
  );
}
