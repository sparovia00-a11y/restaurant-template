import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleReviewsSettings,
  saveGoogleReviewsSettings,
} from "@/content/store";

function isAuthorized(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_PASSWORD;
}

const MASK_PREFIX = "••••••••";

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await getGoogleReviewsSettings();
  return NextResponse.json({
    placeId: settings?.placeId ?? "",
    // Never send the real key back to the browser once it's saved —
    // only enough of it to confirm it's set.
    apiKey: settings?.apiKey
      ? `${MASK_PREFIX}${settings.apiKey.slice(-4)}`
      : "",
    hasKey: !!settings?.apiKey,
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { apiKey, placeId } = body as { apiKey: string; placeId: string };

  // If the field still holds the masked placeholder, the admin didn't
  // change the key — keep the one already stored instead of overwriting
  // it with the mask itself.
  const existing = await getGoogleReviewsSettings();
  const finalKey = apiKey?.startsWith(MASK_PREFIX)
    ? existing?.apiKey ?? ""
    : apiKey ?? "";

  await saveGoogleReviewsSettings({ apiKey: finalKey, placeId: placeId ?? "" });
  return NextResponse.json({ ok: true });
}
