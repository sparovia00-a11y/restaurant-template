import { NextRequest, NextResponse } from "next/server";
import {
  getNotificationSettings,
  saveNotificationSettings,
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
  const settings = await getNotificationSettings();
  return NextResponse.json({
    notifyEmail: settings?.notifyEmail ?? "",
    // Never send the real key back to the browser once it's saved —
    // only enough of it to confirm it's set.
    resendApiKey: settings?.resendApiKey
      ? `${MASK_PREFIX}${settings.resendApiKey.slice(-4)}`
      : "",
    hasKey: !!settings?.resendApiKey,
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { resendApiKey, notifyEmail } = body as {
    resendApiKey: string;
    notifyEmail: string;
  };

  // If the field still holds the masked placeholder, the admin didn't
  // change the key — keep the one already stored instead of overwriting
  // it with the mask itself.
  const existing = await getNotificationSettings();
  const finalKey = resendApiKey?.startsWith(MASK_PREFIX)
    ? existing?.resendApiKey ?? ""
    : resendApiKey ?? "";

  await saveNotificationSettings({ resendApiKey: finalKey, notifyEmail: notifyEmail ?? "" });
  return NextResponse.json({ ok: true });
}
