// src/app/demo/(shared)/users/roles/index.ts
export const MODULES = [
  "shop.products",
  "shop.categories",
  "orders",
  "services",
  "booking",
  "calendar",
  "crm.clients",
  "crm.pipelines",
  "crm.segments",
  "payments",
  "reports",
  "users",
  "settings",
] as const;

export const ACTIONS = [
  "read",
  "create",
  "update",
  "delete",
  "export",
] as const;

export type Module = typeof MODULES[number];
export type Action = typeof ACTIONS[number];
export type PermissionType = "allow" | "deny" | "own" | "location";

export const PERMISSIONS: Record<
  Module,
  Partial<Record<Action, PermissionType>>
> = {
  "shop.products": {
    read: "allow",
    create: "allow",
    update: "allow",
    delete: "deny",
    export: "allow",
  },
  "shop.categories": {},
  orders: {
    read: "allow",
    create: "deny",
    update: "allow",
    delete: "deny",
    export: "allow",
  },
  services: {},
  booking: {},
  calendar: {},
  "crm.clients": {},
  "crm.pipelines": {},
  "crm.segments": {},
  payments: {
    read: "allow",
    create: "deny",
    update: "deny",
    delete: "deny",
    export: "allow",
  },
  reports: {},
  users: {
    read: "allow",
    create: "allow",
    update: "allow",
    delete: "deny",
    export: "allow",
  },
  settings: {},
};