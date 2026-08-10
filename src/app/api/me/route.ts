import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const USER_SELECT = {
  id: true, email: true, name: true, phone: true, company: true,
  balance: true, createdAt: true,
  payerType: true, inn: true, orgName: true, kpp: true, ogrn: true,
  legalAddress: true, bik: true, bankName: true, bankAccount: true,
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = requireAuth(req);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: USER_SELECT });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  let userId: string;
  try {
    ({ userId } = requireAuth(req));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const {
      name, phone, company, pushToken,
      payerType, inn, orgName, kpp, ogrn, legalAddress, bik, bankName, bankAccount,
    } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name         !== undefined && { name:         name?.trim()         }),
        ...(phone        !== undefined && { phone:        phone?.trim()        }),
        ...(company      !== undefined && { company:      company?.trim()      }),
        ...(pushToken    !== undefined && { pushToken                          }),
        ...(payerType    !== undefined && { payerType                          }),
        ...(inn          !== undefined && { inn:          inn?.trim()          }),
        ...(orgName      !== undefined && { orgName:      orgName?.trim()      }),
        ...(kpp          !== undefined && { kpp:          kpp?.trim()          }),
        ...(ogrn         !== undefined && { ogrn:         ogrn?.trim()         }),
        ...(legalAddress !== undefined && { legalAddress: legalAddress?.trim() }),
        ...(bik          !== undefined && { bik:          bik?.trim()          }),
        ...(bankName     !== undefined && { bankName:     bankName?.trim()     }),
        ...(bankAccount  !== undefined && { bankAccount:  bankAccount?.trim()  }),
      },
      select: USER_SELECT,
    });
    return NextResponse.json(user);
  } catch (e: any) {
    console.error("[PATCH /me]", e);
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message ?? "Ошибка сохранения" }, { status: 500 });
  }
}
