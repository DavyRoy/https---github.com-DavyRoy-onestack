export const USERS_SUMMARY = { total: 12, created30d: 3, no2fa: 5, invited: 2 };

export const USERS = [
  { id: "u1", name: "Иван Петров", email: "ivan@example.com", roles: ["Manager"], status: "active", twoFA: true, lastSeen: "2025-01-09 10:00" },
  { id: "u2", name: "Анна Ким", email: "anna@example.com", roles: ["Admin"], status: "active", twoFA: false, lastSeen: "2025-01-07 18:20" },
  { id: "u3", name: "Lee Min", email: "min@example.com", roles: ["ReadOnly"], status: "invited", twoFA: false, lastSeen: null },
];