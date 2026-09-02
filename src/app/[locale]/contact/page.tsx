"use client";

import { useState, useEffect, use } from "react";
import { useTranslations } from "next-intl";
import { getContentClient } from "@/content/client";
import type { SiteContent } from "@/content/schema";

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  return <ContactForm locale={locale} />;
}

function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    getContentClient(locale).then(setContent);
  }, [locale]);

  if (!content) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, type: "contact", locale }),
    });
    setStatus("sent");
  }

  return (
    <main className="pt-32 pb-24 px-6 md:px-16 max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/70 mb-4">
          {t("nav.contact")}
        </p>
        <h1 className="font-serif text-3xl mb-4">{t("contactPage.title")}</h1>
        <p className="text-neutral-600 mb-10">{t("contactPage.subtitle")}</p>

        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
              {t("location.addressLabel")}
            </p>
            <p>{content.location.address}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
              {t("location.phoneLabel")}
            </p>
            <p>{content.location.phone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
              {t("location.hoursLabel")}
            </p>
            <p>{content.location.hours}</p>
          </div>
        </div>
      </div>

      <div>
        {status === "sent" ? (
          <div className="p-8 border rounded-sm" style={{ backgroundColor: "#F2EDE3", borderColor: "#E5DCC9" }}>
            <h2 className="font-serif text-xl mb-2">{t("contactPage.sent")}</h2>
            <p className="text-neutral-600 text-sm">{t("contactPage.sentSubtitle")}</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <input
              required
              type="text"
              placeholder={t("contactPage.nameLabel")}
              className="w-full border px-4 py-3 rounded-sm text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder={t("contactPage.emailLabel")}
              className="w-full border px-4 py-3 rounded-sm text-sm"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <textarea
              required
              rows={5}
              placeholder={t("contactPage.messageLabel")}
              className="w-full border px-4 py-3 rounded-sm text-sm"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-neutral-900 text-white py-3 text-xs uppercase tracking-wide disabled:opacity-50"
            >
              {t("contactPage.send")}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
