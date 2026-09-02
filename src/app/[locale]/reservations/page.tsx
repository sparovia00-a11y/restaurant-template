"use client";

import { useState, useEffect, use } from "react";
import { useTranslations } from "next-intl";
import { getContentClient } from "@/content/client";
import type { SiteContent } from "@/content/schema";

export default function ReservationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  return <ReservationsForm locale={locale} />;
}

function ReservationsForm({ locale }: { locale: string }) {
  const t = useTranslations();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", date: "", time: "", guests: "" });

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
      body: JSON.stringify({ ...form, locale }),
    });
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <main className="pt-32 pb-20 px-6 md:px-16 max-w-lg mx-auto text-center">
        <h1 className="font-serif text-3xl mb-4">
          {t("reservationsPage.requestSent")}
        </h1>
        <p className="text-neutral-600">
          {t("reservationsPage.confirmShortly")}
        </p>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6 md:px-16 max-w-lg mx-auto">
      <h1 className="font-serif text-3xl mb-4 text-center">
        {t("sections.reservations")}
      </h1>
      <p className="text-center text-neutral-600 mb-2">{content.reservations.text}</p>
      <p className="text-center text-sm uppercase tracking-wide text-neutral-500 mb-10">
        {content.reservations.hours}
      </p>

      <form className="space-y-4" onSubmit={submit}>
        <input
          required
          type="text"
          placeholder={t("reservationsPage.fullName")}
          className="w-full border px-4 py-3 rounded-sm text-sm"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          type="email"
          placeholder={t("reservationsPage.email")}
          className="w-full border px-4 py-3 rounded-sm text-sm"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            required
            type="date"
            className="w-full border px-4 py-3 rounded-sm text-sm"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            required
            type="time"
            className="w-full border px-4 py-3 rounded-sm text-sm"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>
        <input
          required
          type="number"
          min={1}
          placeholder={t("reservationsPage.partySize")}
          className="w-full border px-4 py-3 rounded-sm text-sm"
          value={form.guests}
          onChange={(e) => setForm({ ...form, guests: e.target.value })}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-neutral-900 text-white py-3 text-xs uppercase tracking-wide disabled:opacity-50"
        >
          {status === "sending" ? t("reservationsPage.sending") : t("nav.reserve")}
        </button>
      </form>
    </main>
  );
}

