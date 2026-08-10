import { NextRequest, NextResponse } from "next/server";

const DADATA_TOKEN = process.env.DADATA_TOKEN;
const DADATA_SECRET = process.env.DADATA_SECRET;

export async function POST(req: NextRequest) {
  const { inn, bik, type } = await req.json();

  if (!DADATA_TOKEN) {
    return NextResponse.json({ error: "DaData не настроена" }, { status: 503 });
  }

  try {
    if (type === "bik") {
      const res = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/bank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Token ${DADATA_TOKEN}`,
        },
        body: JSON.stringify({ query: bik }),
      });
      const data = await res.json();
      const s = data.suggestions?.[0];
      if (!s) return NextResponse.json({ error: "Банк не найден" }, { status: 404 });
      return NextResponse.json({
        name:            s.value,
        correspondentAccount: s.data?.correspondent_account,
        address:         s.data?.address?.value,
      });
    }

    // ИНН — поиск компании или ИП
    const res = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Token ${DADATA_TOKEN}`,
        "X-Secret": DADATA_SECRET ?? "",
      },
      body: JSON.stringify({ query: inn }),
    });

    const data = await res.json();
    const s = data.suggestions?.[0];
    if (!s) return NextResponse.json({ error: "Организация не найдена" }, { status: 404 });

    return NextResponse.json({
      name:    s.value,
      inn:     s.data?.inn,
      kpp:     s.data?.kpp,
      ogrn:    s.data?.ogrn,
      address: s.data?.address?.value,
      type:    s.data?.type, // LEGAL или INDIVIDUAL
      status:  s.data?.state?.status,
    });
  } catch (err) {
    console.error("[dadata]", err);
    return NextResponse.json({ error: "Ошибка запроса" }, { status: 500 });
  }
}
