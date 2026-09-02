import { getTranslations } from "next-intl/server";
import { getContent } from "@/content/store";
import type { Locale } from "@/i18n/routing";
import ClickableImage from "@/components/ClickableImage";
import RevealOnScroll from "@/components/RevealOnScroll";
import TypewriterText from "@/components/TypewriterText";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const content = await getContent(locale as Locale);

  return (
    <main>
      {/* Hero con descripción */}
      <section className="pt-40 pb-16 px-6 md:px-16 text-center max-w-2xl mx-auto animate-fade-up">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/70 mb-4">
          {t("sections.featuredMenu")}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl mb-6">
          {t("menuPage.heroTitle")}
        </h1>
        <TypewriterText
          text={t("menuPage.heroSubtitle")}
          className="text-neutral-600 leading-relaxed"
        />
      </section>

      {/* Lista de platos: foto grande + descripción/precio/botón al lado */}
      <section className="px-6 md:px-16 pb-24 max-w-4xl mx-auto space-y-10">
        {content.featuredMenu.dishes.map((dish, i) => (
          <RevealOnScroll
            key={dish.id}
            delay={Math.min(i * 90, 360)}
            className="grid sm:grid-cols-[240px_1fr] gap-6 items-center border-b pb-10 last:border-b-0"
            style={{ borderColor: "#E5DCC9" }}
          >
            <ClickableImage
              src={dish.image}
              alt={dish.name}
              className="w-full h-48 sm:h-40 object-cover rounded-sm"
            />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-amber-700/70 mb-2">
                {dish.category}
              </p>
              <h3 className="font-serif text-2xl mb-2">{dish.name}</h3>
              <TypewriterText
                text={dish.shortDescription}
                className="text-sm text-neutral-600 leading-relaxed mb-4"
                wordDelay={25}
              />
              <div className="flex items-center gap-6">
                <span className="text-amber-700 font-serif text-lg">
                  {dish.price}
                </span>
                <a
                  href={`/${locale}/menu/${dish.id}`}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wide border-b pb-0.5 hover:opacity-70 transition-opacity"
                  style={{ borderColor: "#171717" }}
                >
                  {t("menuPage.viewDish")} →
                </a>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </section>
    </main>
  );
}
