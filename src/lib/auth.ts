import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-prod";

export function signToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): { userId: string; email: string } {
  return jwt.verify(token, SECRET) as { userId: string; email: string };
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function requireAuth(req: NextRequest): { userId: string; email: string } {
  // Accept token from header OR query param (for direct file download links)
  let token = getTokenFromRequest(req);
  if (!token) token = req.nextUrl.searchParams.get("token");
  if (!token) throw new Error("Unauthorized");
  return verifyToken(token);
}
