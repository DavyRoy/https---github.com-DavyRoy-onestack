// Общие типы для демо-приложения

export type UserRole = "admin" | "manager" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  lastLoginAt: string;
}

export interface Order {
  id: string;
  number: string;
  client: string;
  clientId?: string;
  status: "Оплачен" | "В обработке" | "Просрочен";
  amount: number; // в рублях
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  orderId?: string;
  title: string;
  assigneeId: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  dueAt?: string;
  tags?: string[];
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  currency: "RUB" | "USD";
  type: "invoice" | "refund" | "payment";
  status: "success" | "pending" | "failed";
  createdAt: string;
}

export interface EventLog {
  id: string;
  actorId: string;
  entityType: "user" | "order" | "task" | "transaction" | "security";
  entityId: string;
  action: string;
  createdAt: string;
  meta?: Record<string, any>;
}