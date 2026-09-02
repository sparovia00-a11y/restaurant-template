import type { SiteContent } from "./schema";

export async function getContentClient(locale: string): Promise<SiteContent> {
  const res = await fetch(`/api/content?locale=${locale}`);
  return res.json();
}
