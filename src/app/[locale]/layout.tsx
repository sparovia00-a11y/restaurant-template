import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import { getBranding } from "@/content/store";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const branding = await getBranding();
  const { accent, background, surface, textPrimary, textMuted } = branding.colors;

  return (
    <NextIntlClientProvider>
      {/* Overrides the default palette in globals.css with this
          restaurant's saved colors. A <style> tag targeting :root applies
          to the whole document regardless of where it's rendered in the
          tree, but /admin (outside this layout) never renders it, so the
          admin panel's own look stays fixed no matter what a restaurant
          picks here. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{--color-accent:${accent};--color-background:${background};--color-surface:${surface};--color-text-primary:${textPrimary};--color-text-muted:${textMuted};}`,
        }}
      />
      <Navbar
        locale={locale}
        restaurantName={branding.restaurantName}
        logoUrl={branding.logoUrl}
      />
      {children}
    </NextIntlClientProvider>
  );
}
