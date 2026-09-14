import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "./schema";
import type { Locale } from "@/i18n/routing";

// Storage strategy:
// - Locally (or anywhere without the KV env vars set): reads/writes the
//   JSON files in src/content/. Zero setup, works out of the box.
// - On Vercel, once you connect an Upstash Redis integration (Storage tab
//   in the Vercel dashboard), KV_REST_API_URL and KV_REST_API_TOKEN are
//   injected automatically, and this switches to Redis so admin edits
//   actually persist in production.
const hasRedis =
  !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

function contentPath(locale: Locale) {
  return path.join(process.cwd(), "src", "content", `${locale}.json`);
}

function globalPath() {
  return path.join(process.cwd(), "src", "content", "global.json");
}

async function getRedis() {
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

export type ThemeColors = {
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textMuted: string;
};

export const DEFAULT_THEME_COLORS: ThemeColors = {
  accent: "#b08a5a",
  background: "#faf6ef",
  surface: "#f2ede3",
  textPrimary: "#171717",
  textMuted: "#6b6259",
};

export type GlobalBranding = {
  restaurantName: string;
  logoUrl: string;
  colors: ThemeColors;
};

// Name, logo and colors are shared across every language (they're brand
// identity — changing them in one language shouldn't require repeating the
// change in the other three). Everything else in SiteContent stays fully
// independent per locale, since a restaurant may want different
// photos/copy per market.
async function getGlobalBranding(): Promise<GlobalBranding | null> {
  if (hasRedis) {
    const redis = await getRedis();
    const stored = await redis.get<GlobalBranding>("content:global");
    return stored ? withColorDefaults(stored) : null;
  }
  try {
    const raw = await fs.readFile(globalPath(), "utf-8");
    return withColorDefaults(JSON.parse(raw) as GlobalBranding);
  } catch {
    return null;
  }
}

// Restaurants that saved their branding before the color-theming feature
// existed won't have a `colors` field yet — fill in the original look as
// defaults so nothing changes for them until they visit the new tab.
function withColorDefaults(branding: GlobalBranding): GlobalBranding {
  return { ...branding, colors: { ...DEFAULT_THEME_COLORS, ...branding.colors } };
}

async function saveGlobalBranding(branding: GlobalBranding) {
  if (hasRedis) {
    const redis = await getRedis();
    await redis.set("content:global", branding);
    return;
  }
  await fs.writeFile(globalPath(), JSON.stringify(branding, null, 2), "utf-8");
}

export async function getBranding(): Promise<GlobalBranding> {
  const stored = await getGlobalBranding();
  if (stored) return stored;
  // Fall back to English content the very first time, before anything's
  // been saved globally yet.
  const raw = await fs.readFile(contentPath("en"), "utf-8");
  const en = JSON.parse(raw) as SiteContent;
  return { restaurantName: en.restaurantName, logoUrl: "", colors: DEFAULT_THEME_COLORS };
}

export async function getContent(locale: Locale): Promise<SiteContent> {
  let content: SiteContent;

  if (hasRedis) {
    const redis = await getRedis();
    const stored = await redis.get<SiteContent>(`content:${locale}`);
    if (stored) {
      content = stored;
    } else {
      // First run on a fresh Redis store: seed it from the bundled JSON.
      const raw = await fs.readFile(contentPath(locale), "utf-8");
      content = JSON.parse(raw) as SiteContent;
      await redis.set(`content:${locale}`, content);
    }
  } else {
    const raw = await fs.readFile(contentPath(locale), "utf-8");
    content = JSON.parse(raw) as SiteContent;
  }

  const branding = await getGlobalBranding();
  if (branding) content.restaurantName = branding.restaurantName;
  return content;
}

export async function saveContent(locale: Locale, content: SiteContent) {
  // Any locale's save updates the shared name (logo is saved separately
  // via saveBranding, called from the admin's branding form).
  const existing = await getGlobalBranding();
  await saveGlobalBranding({
    restaurantName: content.restaurantName,
    logoUrl: existing?.logoUrl ?? "",
    colors: existing?.colors ?? DEFAULT_THEME_COLORS,
  });

  if (hasRedis) {
    const redis = await getRedis();
    await redis.set(`content:${locale}`, content);
    return;
  }

  await fs.writeFile(
    contentPath(locale),
    JSON.stringify(content, null, 2),
    "utf-8"
  );
}

export async function saveBranding(branding: GlobalBranding) {
  await saveGlobalBranding(branding);
}

export type NotificationSettings = {
  resendApiKey: string;
  notifyEmail: string;
};

function notificationSettingsPath() {
  return path.join(process.cwd(), "src", "content", "notification-settings.json");
}

// Per-restaurant config for the reservation/contact email alerts. Each
// deployment (each restaurant's own Vercel project) configures its own
// Resend API key + notification email from the admin — no env vars needed.
export async function getNotificationSettings(): Promise<NotificationSettings | null> {
  if (hasRedis) {
    const redis = await getRedis();
    const stored = await redis.get<NotificationSettings>(
      "content:notification-settings"
    );
    return stored ?? null;
  }
  try {
    const raw = await fs.readFile(notificationSettingsPath(), "utf-8");
    return JSON.parse(raw) as NotificationSettings;
  } catch {
    return null;
  }
}

export async function saveNotificationSettings(settings: NotificationSettings) {
  if (hasRedis) {
    const redis = await getRedis();
    await redis.set("content:notification-settings", settings);
    return;
  }
  await fs.writeFile(
    notificationSettingsPath(),
    JSON.stringify(settings, null, 2),
    "utf-8"
  );
}

export type GoogleReviewsSettings = {
  apiKey: string;
  placeId: string;
};

function googleReviewsSettingsPath() {
  return path.join(process.cwd(), "src", "content", "google-reviews-settings.json");
}

// Per-restaurant config for pulling real Google reviews into the
// testimonials section. Each deployment configures its own API key +
// Place ID from the admin — no env vars needed.
export async function getGoogleReviewsSettings(): Promise<GoogleReviewsSettings | null> {
  if (hasRedis) {
    const redis = await getRedis();
    const stored = await redis.get<GoogleReviewsSettings>(
      "content:google-reviews-settings"
    );
    return stored ?? null;
  }
  try {
    const raw = await fs.readFile(googleReviewsSettingsPath(), "utf-8");
    return JSON.parse(raw) as GoogleReviewsSettings;
  } catch {
    return null;
  }
}

export async function saveGoogleReviewsSettings(settings: GoogleReviewsSettings) {
  if (hasRedis) {
    const redis = await getRedis();
    await redis.set("content:google-reviews-settings", settings);
    return;
  }
  await fs.writeFile(
    googleReviewsSettingsPath(),
    JSON.stringify(settings, null, 2),
    "utf-8"
  );
}
