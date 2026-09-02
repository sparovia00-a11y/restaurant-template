"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/content/schema";

const LOCALES = ["en", "es", "pt", "it"] as const;

type Branding = { restaurantName: string; logoUrl: string };
type ReservationEntry = Record<string, string> & { receivedAt: string };

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [view, setView] = useState<"content" | "reservations" | "notifications">(
    "content"
  );
  const [locale, setLocale] = useState<(typeof LOCALES)[number]>("en");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [branding, setBranding] = useState<Branding | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [brandingStatus, setBrandingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!unlocked) return;
    fetch(`/api/content?locale=${locale}`)
      .then((r) => r.json())
      .then(setContent);
  }, [unlocked, locale]);

  useEffect(() => {
    if (!unlocked) return;
    fetch(`/api/branding`)
      .then((r) => r.json())
      .then(setBranding);
  }, [unlocked]);

  async function save() {
    setStatus("Guardando...");
    const res = await fetch(`/api/content?locale=${locale}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify(content),
    });
    setStatus(res.ok ? "Guardado ✓" : "Error al guardar");
  }

  async function saveBranding() {
    setBrandingStatus("Guardando...");
    const res = await fetch(`/api/branding`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify(branding),
    });
    setBrandingStatus(res.ok ? "Guardado ✓" : "Error al guardar");
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="bg-white p-8 rounded-sm shadow-sm w-full max-w-sm">
          <h1 className="font-serif text-xl mb-6">Admin</h1>
          <input
            type="password"
            placeholder="Contraseña"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full border px-3 py-2 mb-4 rounded-sm"
          />
          <button
            onClick={() => setUnlocked(true)}
            className="w-full bg-neutral-900 text-white py-2 rounded-sm"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  if (!content) return <div className="p-10">Cargando...</div>;

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setView("content")}
            className={`px-4 py-2 text-sm rounded-sm border ${
              view === "content" ? "bg-neutral-900 text-white" : "bg-white"
            }`}
          >
            Contenido
          </button>
          <button
            onClick={() => setView("reservations")}
            className={`px-4 py-2 text-sm rounded-sm border ${
              view === "reservations" ? "bg-neutral-900 text-white" : "bg-white"
            }`}
          >
            Reservas y mensajes
          </button>
          <button
            onClick={() => setView("notifications")}
            className={`px-4 py-2 text-sm rounded-sm border ${
              view === "notifications" ? "bg-neutral-900 text-white" : "bg-white"
            }`}
          >
            Notificaciones
          </button>
        </div>

        {view === "reservations" ? (
          <ReservationsView adminKey={key} />
        ) : view === "notifications" ? (
          <NotificationSettingsView adminKey={key} />
        ) : (
          <>
        <h1 className="font-serif text-2xl mb-8">Editar contenido</h1>

        {branding && (
          <div className="bg-white p-6 rounded-sm shadow-sm mb-8">
            <h2 className="font-serif text-lg mb-1">Marca del restaurante</h2>
            <p className="text-xs text-neutral-500 mb-4">
              Nombre y logo — se aplican a los 4 idiomas por igual.
            </p>
            <Field
              label="Nombre del restaurante"
              value={branding.restaurantName}
              onChange={(v) => setBranding({ ...branding, restaurantName: v })}
            />
            <Field
              label="Logo (URL, opcional)"
              value={branding.logoUrl}
              onChange={(v) => setBranding({ ...branding, logoUrl: v })}
            />
            <div className="flex items-center gap-4">
              <button
                onClick={saveBranding}
                className="bg-neutral-900 text-white px-5 py-2 text-sm rounded-sm"
              >
                Guardar marca
              </button>
              {brandingStatus && (
                <span className="text-sm text-neutral-600">{brandingStatus}</span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-lg">Contenido por idioma</h2>
          <div className="flex gap-2">
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-3 py-1 rounded-sm border text-sm ${
                  locale === l ? "bg-neutral-900 text-white" : "bg-white"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <Section title="Hero">
          <Field
            label="Tagline"
            value={content.hero.tagline}
            onChange={(v) =>
              setContent({ ...content, hero: { ...content.hero, tagline: v } })
            }
          />
          <Field
            label="Imagen de fondo (URL)"
            value={content.hero.backgroundImage}
            onChange={(v) =>
              setContent({
                ...content,
                hero: { ...content.hero, backgroundImage: v },
              })
            }
          />
        </Section>

        <Section title="Sobre nosotros">
          <TextArea
            label="Texto"
            value={content.aboutUs.text}
            onChange={(v) =>
              setContent({ ...content, aboutUs: { ...content.aboutUs, text: v } })
            }
          />
          <Field
            label="Imagen (URL)"
            value={content.aboutUs.image}
            onChange={(v) =>
              setContent({
                ...content,
                aboutUs: { ...content.aboutUs, image: v },
              })
            }
          />
        </Section>

        <Section title="Our Philosophy">
          <TextArea
            label="Introducción"
            value={content.ourPhilosophy.intro}
            onChange={(v) =>
              setContent({
                ...content,
                ourPhilosophy: { ...content.ourPhilosophy, intro: v },
              })
            }
          />
          {content.ourPhilosophy.cards.map((card, i) => (
            <div key={card.id} className="border-t pt-4 mt-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
                {card.id}
              </p>
              <Field
                label="Título"
                value={card.title}
                onChange={(v) => {
                  const cards = [...content.ourPhilosophy.cards];
                  cards[i] = { ...card, title: v };
                  setContent({
                    ...content,
                    ourPhilosophy: { ...content.ourPhilosophy, cards },
                  });
                }}
              />
              <TextArea
                label="Teaser"
                value={card.teaser}
                onChange={(v) => {
                  const cards = [...content.ourPhilosophy.cards];
                  cards[i] = { ...card, teaser: v };
                  setContent({
                    ...content,
                    ourPhilosophy: { ...content.ourPhilosophy, cards },
                  });
                }}
              />
              <Field
                label="Imagen (URL)"
                value={card.image}
                onChange={(v) => {
                  const cards = [...content.ourPhilosophy.cards];
                  cards[i] = { ...card, image: v };
                  setContent({
                    ...content,
                    ourPhilosophy: { ...content.ourPhilosophy, cards },
                  });
                }}
              />
            </div>
          ))}
        </Section>

        <Section title="Menú destacado">
          {content.featuredMenu.dishes.map((dish, i) => (
            <div key={dish.id} className="border-t pt-4 mt-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
                {dish.id}
              </p>
              <Field
                label="Categoría"
                value={dish.category}
                onChange={(v) => {
                  const dishes = [...content.featuredMenu.dishes];
                  dishes[i] = { ...dish, category: v };
                  setContent({
                    ...content,
                    featuredMenu: { dishes },
                  });
                }}
              />
              <Field
                label="Nombre"
                value={dish.name}
                onChange={(v) => {
                  const dishes = [...content.featuredMenu.dishes];
                  dishes[i] = { ...dish, name: v };
                  setContent({
                    ...content,
                    featuredMenu: { dishes },
                  });
                }}
              />
              <Field
                label="Descripción corta"
                value={dish.shortDescription}
                onChange={(v) => {
                  const dishes = [...content.featuredMenu.dishes];
                  dishes[i] = { ...dish, shortDescription: v };
                  setContent({
                    ...content,
                    featuredMenu: { dishes },
                  });
                }}
              />
              <Field
                label="Precio"
                value={dish.price}
                onChange={(v) => {
                  const dishes = [...content.featuredMenu.dishes];
                  dishes[i] = { ...dish, price: v };
                  setContent({
                    ...content,
                    featuredMenu: { dishes },
                  });
                }}
              />
              <Field
                label="Imagen (URL)"
                value={dish.image}
                onChange={(v) => {
                  const dishes = [...content.featuredMenu.dishes];
                  dishes[i] = { ...dish, image: v };
                  setContent({
                    ...content,
                    featuredMenu: { dishes },
                  });
                }}
              />
              <Field
                label="Etiqueta (página del plato)"
                value={dish.tagline}
                onChange={(v) => {
                  const dishes = [...content.featuredMenu.dishes];
                  dishes[i] = { ...dish, tagline: v };
                  setContent({ ...content, featuredMenu: { dishes } });
                }}
              />
              <TextArea
                label="Historia completa (página del plato)"
                value={dish.fullDescription}
                onChange={(v) => {
                  const dishes = [...content.featuredMenu.dishes];
                  dishes[i] = { ...dish, fullDescription: v };
                  setContent({ ...content, featuredMenu: { dishes } });
                }}
              />
              <TextArea
                label="Cita del chef (página del plato)"
                value={dish.chefQuote}
                onChange={(v) => {
                  const dishes = [...content.featuredMenu.dishes];
                  dishes[i] = { ...dish, chefQuote: v };
                  setContent({ ...content, featuredMenu: { dishes } });
                }}
              />
            </div>
          ))}
        </Section>

        <Section title="Galería / Exhibición">
          <Field
            label="Título de la exhibición"
            value={content.gallery.exhibitionTitle}
            onChange={(v) =>
              setContent({
                ...content,
                gallery: { ...content.gallery, exhibitionTitle: v },
              })
            }
          />
          <TextArea
            label="Subtítulo de la exhibición"
            value={content.gallery.exhibitionSubtitle}
            onChange={(v) =>
              setContent({
                ...content,
                gallery: { ...content.gallery, exhibitionSubtitle: v },
              })
            }
          />
          {content.gallery.sections.map((section, i) => (
            <div key={section.number} className="border-t pt-4 mt-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
                Capítulo {section.number}
              </p>
              <Field
                label="Título"
                value={section.title}
                onChange={(v) => {
                  const sections = [...content.gallery.sections];
                  sections[i] = { ...section, title: v };
                  setContent({ ...content, gallery: { ...content.gallery, sections } });
                }}
              />
              <Field
                label="Frase"
                value={section.tagline}
                onChange={(v) => {
                  const sections = [...content.gallery.sections];
                  sections[i] = { ...section, tagline: v };
                  setContent({ ...content, gallery: { ...content.gallery, sections } });
                }}
              />
            </div>
          ))}
        </Section>

        <Section title="Historia del chef">
          <Field
            label="Nombre del chef"
            value={content.chefStory.chefName}
            onChange={(v) =>
              setContent({
                ...content,
                chefStory: { ...content.chefStory, chefName: v },
              })
            }
          />
          <TextArea
            label="Historia"
            value={content.chefStory.text}
            onChange={(v) =>
              setContent({
                ...content,
                chefStory: { ...content.chefStory, text: v },
              })
            }
          />
          <Field
            label="Imagen (URL)"
            value={content.chefStory.image}
            onChange={(v) =>
              setContent({
                ...content,
                chefStory: { ...content.chefStory, image: v },
              })
            }
          />
        </Section>

        <Section title="Awards">
          {content.awards.map((award, i) => (
            <Field
              key={award.id}
              label={`Nombre del premio ${i + 1}`}
              value={award.label}
              onChange={(v) => {
                const awards = [...content.awards];
                awards[i] = { ...award, label: v };
                setContent({ ...content, awards });
              }}
            />
          ))}
        </Section>

        <Section title="Testimonios">
          {content.testimonials.map((item, i) => (
            <div key={item.id} className="border-t pt-4 mt-4">
              <TextArea
                label="Cita"
                value={item.quote}
                onChange={(v) => {
                  const testimonials = [...content.testimonials];
                  testimonials[i] = { ...item, quote: v };
                  setContent({ ...content, testimonials });
                }}
              />
              <Field
                label="Autor"
                value={item.author}
                onChange={(v) => {
                  const testimonials = [...content.testimonials];
                  testimonials[i] = { ...item, author: v };
                  setContent({ ...content, testimonials });
                }}
              />
              <Field
                label="Rol / cargo"
                value={item.role}
                onChange={(v) => {
                  const testimonials = [...content.testimonials];
                  testimonials[i] = { ...item, role: v };
                  setContent({ ...content, testimonials });
                }}
              />
              <Field
                label="Fuente"
                value={item.source}
                onChange={(v) => {
                  const testimonials = [...content.testimonials];
                  testimonials[i] = { ...item, source: v };
                  setContent({ ...content, testimonials });
                }}
              />
            </div>
          ))}
        </Section>

        <Section title="Reservaciones">
          <TextArea
            label="Texto"
            value={content.reservations.text}
            onChange={(v) =>
              setContent({
                ...content,
                reservations: { ...content.reservations, text: v },
              })
            }
          />
          <Field
            label="Horario"
            value={content.reservations.hours}
            onChange={(v) =>
              setContent({
                ...content,
                reservations: { ...content.reservations, hours: v },
              })
            }
          />
          <Field
            label="Imagen (URL)"
            value={content.reservations.image}
            onChange={(v) =>
              setContent({
                ...content,
                reservations: { ...content.reservations, image: v },
              })
            }
          />
        </Section>

        <Section title="Ubicación / Contacto">
          <Field
            label="Dirección"
            value={content.location.address}
            onChange={(v) =>
              setContent({
                ...content,
                location: { ...content.location, address: v },
              })
            }
          />
          <Field
            label="Teléfono"
            value={content.location.phone}
            onChange={(v) =>
              setContent({
                ...content,
                location: { ...content.location, phone: v },
              })
            }
          />
          <Field
            label="Horario"
            value={content.location.hours}
            onChange={(v) =>
              setContent({
                ...content,
                location: { ...content.location, hours: v },
              })
            }
          />
        </Section>

        <Section title="Footer">
          <Field
            label="Instagram (URL)"
            value={content.footer.instagram}
            onChange={(v) =>
              setContent({ ...content, footer: { ...content.footer, instagram: v } })
            }
          />
          <Field
            label="Facebook (URL)"
            value={content.footer.facebook}
            onChange={(v) =>
              setContent({ ...content, footer: { ...content.footer, facebook: v } })
            }
          />
          <TextArea
            label="Texto del newsletter"
            value={content.footer.newsletterText}
            onChange={(v) =>
              setContent({
                ...content,
                footer: { ...content.footer, newsletterText: v },
              })
            }
          />
        </Section>

        <Section title="Cocina">
          <TextArea
            label="Introducción"
            value={content.kitchen.intro}
            onChange={(v) =>
              setContent({ ...content, kitchen: { ...content.kitchen, intro: v } })
            }
          />
          <Field
            label="Imagen (URL)"
            value={content.kitchen.image}
            onChange={(v) =>
              setContent({ ...content, kitchen: { ...content.kitchen, image: v } })
            }
          />
          <TextArea
            label="Texto del equipo"
            value={content.kitchen.teamText}
            onChange={(v) =>
              setContent({
                ...content,
                kitchen: { ...content.kitchen, teamText: v },
              })
            }
          />
          <TextArea
            label="Texto de ingredientes"
            value={content.kitchen.ingredientsText}
            onChange={(v) =>
              setContent({
                ...content,
                kitchen: { ...content.kitchen, ingredientsText: v },
              })
            }
          />
        </Section>

        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={save}
            className="bg-neutral-900 text-white px-6 py-2 rounded-sm"
          >
            Guardar cambios
          </button>
          {status && <span className="text-sm text-neutral-600">{status}</span>}
        </div>
          </>
        )}
      </div>
    </div>
  );
}

function NotificationSettingsView({ adminKey }: { adminKey: string }) {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [resendApiKey, setResendApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await fetch("/api/notification-settings", {
      headers: { "x-admin-key": adminKey },
    });
    if (!res.ok) {
      setError("No se pudo cargar (revisa la contraseña).");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setNotifyEmail(data.notifyEmail);
    setResendApiKey(data.resendApiKey);
    setHasKey(data.hasKey);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setStatus("Guardando...");
    const res = await fetch("/api/notification-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ resendApiKey, notifyEmail }),
    });
    if (res.ok) {
      setStatus("Guardado ✓");
      load(); // re-fetch so the key shows masked again
    } else {
      setStatus("Error al guardar");
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Cargando...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl mb-2">Notificaciones</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Recibe un correo cada vez que llegue una reserva o un mensaje de contacto.
      </p>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white p-6 rounded-sm shadow-sm max-w-md">
        <Field
          label="Correo para notificaciones"
          value={notifyEmail}
          onChange={setNotifyEmail}
        />
        <Field
          label="Resend API Key"
          value={resendApiKey}
          onChange={setResendApiKey}
        />
        <p className="text-xs text-neutral-400 -mt-3 mb-4">
          {hasKey
            ? "Ya hay una key guardada — solo se muestran sus últimos caracteres. Escribe una nueva para reemplazarla."
            : "Consíguela gratis en resend.com y pégala aquí."}
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={save}
            className="bg-neutral-900 text-white px-5 py-2 text-sm rounded-sm"
          >
            Guardar
          </button>
          {status && <span className="text-sm text-neutral-600">{status}</span>}
        </div>
      </div>
    </div>
  );
}

function ReservationsView({ adminKey }: { adminKey: string }) {
  const [entries, setEntries] = useState<ReservationEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await fetch("/api/reservations", {
      headers: { "x-admin-key": adminKey },
    });
    if (!res.ok) {
      setError("No se pudo cargar (revisa la contraseña).");
      return;
    }
    setEntries(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl">Reservas y mensajes</h1>
        <button
          onClick={load}
          className="text-sm border px-3 py-1.5 rounded-sm bg-white"
        >
          Actualizar
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {!entries && !error && <p className="text-sm text-neutral-500">Cargando...</p>}
      {entries && entries.length === 0 && (
        <p className="text-sm text-neutral-500">Todavía no hay ninguna.</p>
      )}

      <div className="space-y-3">
        {entries?.map((entry, i) => (
          <div key={i} className="bg-white p-4 rounded-sm shadow-sm text-sm">
            <p className="text-xs text-neutral-400 mb-2">
              {new Date(entry.receivedAt).toLocaleString()}
              {entry.type === "contact" ? " · Mensaje de contacto" : " · Reserva"}
            </p>
            {Object.entries(entry)
              .filter(([k]) => k !== "receivedAt" && k !== "type")
              .map(([k, v]) => (
                <p key={k}>
                  <span className="text-neutral-500">{k}:</span> {v}
                </p>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
      <h2 className="font-serif text-lg mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-sm text-neutral-600 mb-1">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded-sm text-sm"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-sm text-neutral-600 mb-1">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full border px-3 py-2 rounded-sm text-sm"
      />
    </label>
  );
}
