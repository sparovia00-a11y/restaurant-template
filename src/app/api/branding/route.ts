import { NextRequest, NextResponse } from "next/server";
import { getBranding, saveBranding } from "@/content/store";

function isAuthorized(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  const branding = await getBranding();
  return NextResponse.json(branding);
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await saveBranding(body);
  return NextResponse.json({ ok: true });
}
