"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function Navbar({
  locale,
  restaurantName,
  logoUrl,
}: {
  locale: string;
  restaurantName: string;
  logoUrl?: string;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/story", label: t("story") },
    { href: "/menu", label: t("menu") },
    { href: "/gallery", label: t("gallery") },
  ];

  const isHome = pathname === "/";
  const solid = scrolled || !isHome;
  const textColor = solid ? "text-neutral-900" : "text-white";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-20 transition-colors duration-300 ${
        solid ? "shadow-sm" : ""
      }`}
      style={{ backgroundColor: solid ? "#FAF6EF" : "transparent" }}
    >
      <div className={`flex items-center justify-between px-6 md:px-12 py-5 ${textColor}`}>
        <Link href="/" className="flex items-center gap-2 font-serif text-lg tracking-wide">
          {logoUrl ? (
            <img src={logoUrl} alt={restaurantName} className="h-8 w-auto object-contain" />
          ) : null}
          {restaurantName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:opacity-70 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/reservations"
            className={`border px-4 py-2 text-xs uppercase tracking-wide transition-colors ${
              solid
                ? "border-neutral-900 hover:bg-neutral-900 hover:text-white"
                : "border-white hover:bg-white hover:text-neutral-900"
            }`}
          >
            {t("reserve")}
          </Link>
          <Link href="/contact" className="hover:opacity-70 transition-opacity">
            {t("contact")}
          </Link>
          <LangSwitch locale={locale} pathname={pathname} />
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-6"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`h-px w-full ${solid ? "bg-neutral-900" : "bg-white"}`} />
          <span className={`h-px w-full ${solid ? "bg-neutral-900" : "bg-white"}`} />
          <span className={`h-px w-full ${solid ? "bg-neutral-900" : "bg-white"}`} />
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 z-30 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile menu panel: slides in from the right */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-neutral-900 text-white px-8 py-8 flex flex-col gap-6 z-40 transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="self-end text-2xl mb-4"
        >
          ×
        </button>
        <Link href="/" onClick={() => setOpen(false)}>
          Home
        </Link>
        <Link href="/menu" onClick={() => setOpen(false)}>
          {t("menu")}
        </Link>
        <Link href="/story" onClick={() => setOpen(false)}>
          {t("story")}
        </Link>
        <Link href="/gallery" onClick={() => setOpen(false)}>
          {t("gallery")}
        </Link>
        <Link href="/reservations" onClick={() => setOpen(false)}>
          {t("reservations")}
        </Link>
        <Link href="/contact" onClick={() => setOpen(false)}>
          {t("contact")}
        </Link>
        <LangSwitch locale={locale} pathname={pathname} />
      </div>
    </header>
  );
}

function LangSwitch({ locale, pathname }: { locale: string; pathname: string }) {
  const locales = ["en", "es", "pt", "it"];
  return (
    <div className="flex items-center gap-2">
      {locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={`text-xs uppercase tracking-wide border-b ${
            l === locale ? "border-current" : "border-transparent opacity-60 hover:opacity-100"
          }`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
