import { NextRequest, NextResponse } from "next/server";
import { checkManagerCredentials, signManagerToken } from "@/lib/manager-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!checkManagerCredentials(email, password)) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }
    return NextResponse.json({ token: signManagerToken() });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
