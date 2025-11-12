"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SDPHeader from "./SDPHeader";
import SDPDetails from "./SDPDetails";
import SDPStaffPicker from "./SDPStaffPicker";
import SDPTimePicker from "./SDPTimePicker";
import SDPPriceBox from "./SDPPriceBox";
import SDPUpsell from "./SDPUpsell";
import StickyBookBar from "./StickyBookBar";
import type { Service } from "../data/mockUserServices";
import { services } from "../data/mockUserServices";

export default function ServicePageClient({ service }: { service: Service }) {
  const router = useRouter();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(service.staff[0]?.id ?? null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(service.locations[0]?.id ?? null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const related = useMemo(
    () => services.filter((item) => item.id !== service.id && item.categoryId === service.categoryId).slice(0, 3),
    [service]
  );

  const selectedSlotData = useMemo(() => service.slots.find((slot) => slot.id === selectedSlot) ?? null, [service.slots, selectedSlot]);

  const handleBook = () => {
    const base = new URLSearchParams({ service: service.id });
    if (selectedSlotData) base.set("slot", selectedSlotData.start);
    router.push(`/demo/user/booking?${base.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Image src={service.image} alt={service.title} width={960} height={540} className="h-auto w-full rounded-3xl object-cover" unoptimized />
          <SDPHeader service={service} />
          <SDPDetails description={service.description} highlights={service.highlights} contraindications={service.contraindications} />

          <div className="space-y-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-[hsl(var(--fg))]">Локация</label>
              <div className="flex flex-wrap gap-2">
                {service.locations.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setSelectedLocation(loc.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      selectedLocation === loc.id
                        ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))]/15 text-[hsl(var(--fg))]"
                        : "border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]/80"
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>

            <SDPStaffPicker staff={service.staff} selected={selectedStaff} onSelect={setSelectedStaff} />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Свободные слоты</h3>
              <SDPTimePicker
                slots={service.slots}
                selected={selectedSlot}
                onSelect={setSelectedSlot}
                selectedStaff={selectedStaff}
                selectedLocation={selectedLocation}
              />
            </div>
          </div>

          <SDPUpsell services={related} />
        </div>

        <SDPPriceBox
          serviceId={service.id}
          price={service.price}
          oldPrice={service.oldPrice}
          duration={service.duration}
          deposit={service.deposit}
          onBook={handleBook}
        />
      </div>

      <StickyBookBar amount={service.price} serviceId={service.id} slotId={selectedSlotData?.start ?? null} />
    </div>
  );
}
