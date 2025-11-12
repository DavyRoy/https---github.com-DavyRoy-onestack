import { User, Order, Task, Transaction, EventLog } from "./types";

// В реальном проекте можно подключить faker.js, но пока сделаем вручную

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Администратор",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    lastLoginAt: "2025-09-01T09:30:00Z",
  },
  {
    id: "u2",
    name: "Иван Иванов",
    email: "ivanov@example.com",
    role: "user",
    status: "active",
    lastLoginAt: "2025-08-31T15:10:00Z",
  },
];

export const mockOrders: Order[] = [
  {
    id: "o1",
    number: "#1001",
    client: "ООО «Альфа»",
    status: "Оплачен",
    amount: 120000,
    createdAt: "2025-08-20T10:00:00Z",
    updatedAt: "2025-08-21T14:30:00Z",
  },
  {
    id: "o2",
    number: "#1002",
    client: "ИП Петров",
    status: "В обработке",
    amount: 80000,
    createdAt: "2025-08-25T09:15:00Z",
    updatedAt: "2025-08-25T10:00:00Z",
  },
];

export const mockTasks: Task[] = [
  {
    id: "t1",
    orderId: "o2",
    title: "Сверстать лендинг",
    assigneeId: "u2",
    priority: "high",
    status: "in_progress",
    dueAt: "2025-09-05T00:00:00Z",
    tags: ["frontend"],
  },
  {
    id: "t2",
    orderId: "o2",
    title: "Настроить домен",
    assigneeId: "u2",
    priority: "medium",
    status: "todo",
    tags: ["devops"],
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "tr1",
    orderId: "o1",
    amount: 120000,
    currency: "RUB",
    type: "payment",
    status: "success",
    createdAt: "2025-08-21T14:00:00Z",
  },
];

export const mockEvents: EventLog[] = [
  {
    id: "e1",
    actorId: "u1",
    entityType: "order",
    entityId: "o2",
    action: "update_status",
    createdAt: "2025-08-25T10:05:00Z",
    meta: { from: "Новый", to: "В обработке" },
  },
];