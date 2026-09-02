import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getNotificationSettings } from "@/content/store";

const filePath = path.join(process.cwd(), "src", "content", "reservation-requests.json");

const hasRedis =
  !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

function isAuthorized(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_PASSWORD;
}

async function notifyByEmail(entry: Record<string, unknown>) {
  // Each restaurant configures its own Resend key + notification email
  // from the admin panel (Notificaciones tab) — that takes priority.
  // Env vars are kept as a fallback for backward compatibility.
  const settings = await getNotificationSettings();
  const apiKey = settings?.resendApiKey || process.env.RESEND_API_KEY;
  const notifyTo = settings?.notifyEmail || process.env.NOTIFY_EMAIL;
  if (!apiKey || !notifyTo) return; // Not configured — skip silently.

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const isReservation = "date" in entry;
  const subject = isReservation
    ? `New reservation request — ${entry.name ?? ""}`
    : `New contact message — ${entry.name ?? ""}`;

  const lines = Object.entries(entry)
    .filter(([k]) => k !== "type")
    .map(([k, v]) => `<b>${k}:</b> ${v}`)
    .join("<br/>");

  try {
    await resend.emails.send({
      // "onboarding@resend.dev" works out of the box with no domain setup.
      // Once you verify your own domain in Resend, switch this to your address.
      from: "Restaurant Website <onboarding@resend.dev>",
      to: notifyTo,
      subject,
      html: lines,
    });
  } catch (err) {
    console.error("Failed to send notification email:", err);
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (hasRedis) {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
    const raw = await redis.lrange("reservation-requests", 0, 99);
    const entries = raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
    return NextResponse.json(entries);
  }

  try {
    const existing = JSON.parse(await fs.readFile(filePath, "utf-8"));
    return NextResponse.json([...existing].reverse());
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry = { ...body, receivedAt: new Date().toISOString() };

  if (hasRedis) {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
    await redis.lpush("reservation-requests", JSON.stringify(entry));
    await notifyByEmail(entry);
    return NextResponse.json({ ok: true });
  }

  let existing: unknown[] = [];
  try {
    existing = JSON.parse(await fs.readFile(filePath, "utf-8"));
  } catch {
    existing = [];
  }
  existing.push(entry);
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
  await notifyByEmail(entry);

  return NextResponse.json({ ok: true });
}
