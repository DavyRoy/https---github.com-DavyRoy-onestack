"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import addDays from "date-fns/addDays";
import startOfDay from "date-fns/startOfDay";
import BookingBreadcrumbs from "./BookingBreadcrumbs";
import ServiceHeader from "./ServiceHeader";
import LocationPicker from "./LocationPicker";
import StaffPicker from "./StaffPicker";
import DateNavigator from "./DateNavigator";
import SlotsBoard from "./SlotsBoard";
import DurationBadge from "./DurationBadge";
import AddonsPicker from "./AddonsPicker";
import PriceBox from "./PriceBox";
import PolicyNote from "./PolicyNote";
import StickyBar from "./StickyBar";
import EmptyState from "./EmptyState";
import type { Service } from "../../services/data/mockUserServices";
import { services } from "../../services/data/mockUserServices";
import { bookingPolicies } from "../data/mockBookingPolicies";

const addonMap: Record<string, Array<{ id: string; title: string; price: number; duration: number; description?: string }>> = {
  "svc-spa-balance": [
    { id: "aroma", title: "Ароматическое масло", price: 900, duration: 10, description: "Индивидуальный подбор аромата" },
    { id: "tea", title: "Чайная церемония", price: 500, duration: 15 },
  ],
  "svc-facial-glow": [
    { id: "led", title: "Дополнительная LED-сессия", price: 1200, duration: 15 },
  ],
};

function getServiceFromParams(params: URLSearchParams): Service {
  const id = params.get("service");
  const fallback = services[0];
  if (!id) return fallback;
  return services.find((service) => service.id === id || service.slug === id) ?? fallback;
}

function filterSlots(service: Service, anchor: Date, location: string | null, staffId: string | null) {
  return service.slots.filter((slot) => {
    const date = new Date(slot.start);
    const inRange = date >= startOfDay(anchor) && date <= addDays(startOfDay(anchor), 6);
    if (!inRange) return false;
    if (location && slot.locationId !== location) return false;
    if (staffId && slot.staffId !== staffId) return false;
    return true;
  });
}

export default function BookingPageClient() {
  const params = useSearchParams();
  const router = useRouter();
  const service = getServiceFromParams(params);

  const [location, setLocation] = useState<string | null>(service.locations[0]?.id ?? null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<Date>(startOfDay(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [addons, setAddons] = useState<string[]>([]);

  const addonItems = addonMap[service.id] ?? [];
  const policy = bookingPolicies.find((item) => item.serviceId === service.id);

  const filteredSlots = useMemo(
    () => filterSlots(service, anchor, location, staffId),
    [service, anchor, location, staffId]
  );

  const basePrice = service.price;
  const addonsPrice = addons.reduce((sum, id) => sum + (addonItems.find((item) => item.id === id)?.price ?? 0), 0);
  const extraDuration = addons.reduce((sum, id) => sum + (addonItems.find((item) => item.id === id)?.duration ?? 0), 0);

  const handleContinue = () => {
    if (!selectedSlot) return;
    const slot = filteredSlots.find((item) => item.id === selectedSlot);
    const search = new URLSearchParams({
      service: service.id,
      slot: slot?.start ?? "",
      location: location ?? "",
      staff: staffId ?? "",
    });
    addons.forEach((addonId) => search.append("addons", addonId));
    router.push(`/demo/user/booking/confirm?${search.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0">
      <BookingBreadcrumbs />
      <ServiceHeader service={service} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="space-y-6 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
            <LocationPicker
              locations={service.locations}
              selected={location}
              onSelect={(id) => {
                setLocation(id);
                setSelectedSlot(null);
              }}
            />

            <StaffPicker
              staff={service.staff}
              selected={staffId}
              onSelect={(value) => {
                setStaffId(value);
                setSelectedSlot(null);
              }}
            />

            <DateNavigator anchor={anchor} onChange={(date) => {
              setAnchor(startOfDay(date));
              setSelectedSlot(null);
            }} />

            <div className="flex flex-wrap items-center gap-2">
              <DurationBadge base={service.duration} extra={extraDuration} />
            </div>

            {filteredSlots.length ? (
              <SlotsBoard slots={filteredSlots} anchor={anchor} selected={selectedSlot} onSelect={setSelectedSlot} />
            ) : (
              <EmptyState />
            )}
          </div>

          <AddonsPicker
            addons={addonItems}
            selected={addons}
            onToggle={(id) => {
              setAddons((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
            }}
          />

          {policy ? (
            <PolicyNote
              cancellation={policy.cancellation}
              depositPolicy={policy.depositPolicy}
              reminders={policy.reminders}
            />
          ) : null}
        </div>

        <PriceBox
          basePrice={basePrice}
          addonsPrice={addonsPrice}
          deposit={service.deposit}
          onContinue={handleContinue}
        />
      </div>

      <StickyBar amount={basePrice + addonsPrice} onContinue={handleContinue} />
    </div>
  );
}
