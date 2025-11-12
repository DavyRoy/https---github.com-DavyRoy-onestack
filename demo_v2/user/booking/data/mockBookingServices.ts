import { services } from "../../services/data/mockUserServices";

export const bookingServices = services.map((service) => ({
  ...service,
}));
