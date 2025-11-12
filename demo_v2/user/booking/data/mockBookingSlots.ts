import { services } from "../../services/data/mockUserServices";

export type BookingSlot = {
  id: string;
  serviceId: string;
  staffId: string;
  locationId: string;
  start: string;
  duration: number;
  price: number;
};

export const bookingSlots: BookingSlot[] = services.flatMap((service) =>
  service.slots.map((slot) => ({
    id: slot.id,
    serviceId: service.id,
    staffId: slot.staffId,
    locationId: slot.locationId,
    start: slot.start,
    duration: slot.duration,
    price: service.price,
  }))
);
