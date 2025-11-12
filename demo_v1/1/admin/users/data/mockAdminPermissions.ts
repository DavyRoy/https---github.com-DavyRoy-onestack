export const MODULES = [
  "shop.products","shop.categories","orders","services","booking","calendar",
  "crm.clients","crm.pipelines","crm.segments","payments","reports","users","settings"
];

export const ACTIONS = ["read","create","update","delete","export"];

export const PERMISSIONS: Record<string, Record<string, "allow"|"deny"|"own"|"location">> = {
  "shop.products": { read:"allow", create:"allow", update:"allow", delete:"deny", export:"allow" },
  orders: { read:"allow", create:"deny", update:"allow", delete:"deny", export:"allow" },
  payments: { read:"allow", create:"deny", update:"deny", delete:"deny", export:"allow" },
  users: { read:"allow", create:"allow", update:"allow", delete:"deny", export:"allow" },
};