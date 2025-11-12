// src/app/demo/(shared)/users/roles/roles.ts

export type Role = {
  id: string;
  name: string;
  description: string;
  members: number;
};

export const ROLES: Role[] = [
  {
    id: "Admin",
    name: "Admin",
    description: "Полные права",
    members: 2,
  },
  {
    id: "Manager",
    name: "Manager",
    description: "Операции и CRM",
    members: 6,
  },
  {
    id: "ReadOnly",
    name: "ReadOnly",
    description: "Просмотр без изменений",
    members: 4,
  },
];