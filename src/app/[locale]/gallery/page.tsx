import { getContent } from "@/content/store";
import type { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import RevealOnScroll from "@/components/RevealOnScroll";
import TypewriterText from "@/components/TypewriterText";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const content = await getContent(locale as Locale);
  const gallery = content.gallery;

  return (
    <main className="text-white" style={{ backgroundColor: "#111010" }}>
      {/* Hero de la exhibición */}
      <section
        className="relative min-h-[85vh] flex items-end bg-cover bg-center"
        style={{ backgroundImage: `url(${gallery.heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        <div className="relative px-6 md:px-16 pt-32 pb-16 md:pb-24 max-w-lg animate-fade-up">
          <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: "#B08A5A" }}>
            {t("sections.gallery")}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
            {gallery.exhibitionTitle}
          </h1>
          <TypewriterText
            text={gallery.exhibitionSubtitle}
            className="text-white/70 mb-10"
          />
          <p className="text-xs uppercase tracking-wide flex items-center gap-2 opacity-70">
            {t("gallery.scroll")} +
          </p>
        </div>
      </section>

      {/* Capítulos 01-04: imagen horizontal con texto superpuesto, lado alternado */}
      {gallery.sections.slice(0, 4).map((section, i) => {
        const textOnLeft = i % 2 === 0;
        return (
          <section
            key={section.number}
            className="relative h-[70vh] sm:h-[60vh] md:h-[65vh] bg-cover bg-center flex items-center border-t"
            style={{ backgroundImage: `url(${section.images[0]})`, borderColor: "#2A2724" }}
          >
            <div
              className={`absolute inset-0 ${
                textOnLeft
                  ? "bg-gradient-to-r from-black/80 via-black/30 to-transparent"
                  : "bg-gradient-to-l from-black/80 via-black/30 to-transparent"
              }`}
            />
            <div
              className={`relative px-6 md:px-16 max-w-md ${
                textOnLeft ? "" : "ml-auto text-right"
              }`}
            >
              <RevealOnScroll delay={100}>
                <p className="font-serif text-2xl md:text-3xl mb-2" style={{ color: "#B08A5A" }}>
                  {section.number} —
                </p>
                <h2 className="font-serif text-2xl md:text-3xl mb-3">{section.title}</h2>
                <TypewriterText
                  text={section.tagline}
                  as="p"
                  className="text-white/70 mb-6 text-sm md:text-base"
                  wordDelay={25}
                />
                <a
                  href={`/${locale}/gallery`}
                  className={`inline-flex items-center gap-2 text-xs uppercase tracking-wide ${
                    textOnLeft ? "" : "flex-row-reverse"
                  }`}
                  style={{ color: "#B08A5A" }}
                >
                  {t("gallery.discover")} →
                </a>
              </RevealOnScroll>
            </div>
          </section>
        );
      })}

      {/* Capítulos 05-06: fila de 4 imágenes con descripción a la derecha */}
      {gallery.sections.slice(4, 6).map((section) => (
        <section
          key={section.number}
          className="grid md:grid-cols-[1fr_320px] gap-0 border-t items-stretch"
          style={{ borderColor: "#2A2724" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/20 p-2">
            {section.images.slice(0, 4).map((img, j) => (
              <RevealOnScroll key={j} delay={j * 100} className="flex items-center justify-center overflow-hidden max-h-56 md:max-h-72">
                <img
                  src={img}
                  alt=""
                  className="w-full h-auto max-h-56 md:max-h-72 object-contain"
                />
              </RevealOnScroll>
            ))}
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center" style={{ backgroundColor: "#1A1816" }}>
            <RevealOnScroll>
              <p className="font-serif text-2xl mb-2" style={{ color: "#B08A5A" }}>
                {section.number} —
              </p>
              <h2 className="font-serif text-xl mb-3">{section.title}</h2>
              <TypewriterText
              text={section.tagline}
              as="p"
              className="text-white/60 text-sm mb-6"
              wordDelay={25}
            />
              <a
                href={`/${locale}/gallery`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wide"
                style={{ color: "#B08A5A" }}
              >
                {t("gallery.discover")} →
              </a>
            </RevealOnScroll>
          </div>
        </section>
      ))}

      {/* CTA final con imagen de fondo */}
      <section
        className="relative px-6 md:px-16 py-28 text-center bg-cover bg-center border-t"
        style={{ backgroundImage: `url(${gallery.ctaImage})`, borderColor: "#2A2724" }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <RevealOnScroll className="relative">
          <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: "#B08A5A" }}>
            {t("gallery.ctaEyebrow")}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl mb-10 max-w-xl mx-auto leading-snug">
            {t("gallery.ctaTitle")}
          </h2>
          <a
            href={`/${locale}/reservations`}
            className="inline-flex items-center gap-2 border px-6 py-3 text-xs uppercase tracking-wide hover:bg-white hover:text-neutral-900 transition-colors"
            style={{ borderColor: "#B08A5A", color: "#B08A5A" }}
          >
            {t("nav.reserve")} →
          </a>
        </RevealOnScroll>
      </section>
    </main>
  );
}
