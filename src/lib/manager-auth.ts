import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET  = process.env.JWT_SECRET ?? "dev-secret";
const MGR_EMAIL = process.env.MANAGER_EMAIL ?? "manager@onestack.ru";
const MGR_PASS  = process.env.MANAGER_PASSWORD ?? "OneStack2024!";

export function checkManagerCredentials(email: string, password: string) {
  return email === MGR_EMAIL && password === MGR_PASS;
}

export function signManagerToken() {
  return jwt.sign({ role: "manager" }, SECRET, { expiresIn: "7d" });
}

export function requireManager(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) throw new Error("Unauthorized");
  const payload = jwt.verify(token, SECRET) as { role?: string };
  if (payload.role !== "manager") throw new Error("Forbidden");
}

export function getManagerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  return auth?.startsWith("Bearer ") ? auth.slice(7) : null;
}
