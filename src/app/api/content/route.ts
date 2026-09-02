import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/content/store";
import { routing, type Locale } from "@/i18n/routing";

// Auth simple para sentar la base. Antes de vender la plantilla real,
// esto se reemplaza por sesiones/usuarios propios por restaurante.
function isAuthorized(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") as Locale | null;
  if (!locale || !routing.locales.includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  const content = await getContent(locale);
  return NextResponse.json(content);
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const locale = req.nextUrl.searchParams.get("locale") as Locale | null;
  if (!locale || !routing.locales.includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  const body = await req.json();
  await saveContent(locale, body);
  return NextResponse.json({ ok: true });
}
