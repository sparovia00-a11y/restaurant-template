import { getTranslations } from "next-intl/server";
import { getContent } from "@/content/store";
import type { Locale } from "@/i18n/routing";
import RevealOnScroll from "@/components/RevealOnScroll";
import TypewriterText from "@/components/TypewriterText";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const content = await getContent(locale as Locale);

  return (
    <main>
      {/* Hero */}
      <section
        className="relative h-[60vh] flex items-end bg-cover bg-center"
        style={{ backgroundImage: `url(${content.aboutUs.image})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative px-6 md:px-16 pb-14 text-white animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] mb-4 text-amber-300/80">
            {t("storyPage.eyebrow")}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl">
            {content.restaurantName}
          </h1>
        </div>
      </section>

      {/* Cómo empezamos */}
      <section className="grid md:grid-cols-2 mt-16 md:mt-24">
        <RevealOnScroll className="flex items-center p-10 md:p-16 order-2 md:order-1">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700/70 mb-4">
              {t("storyPage.beginning")}
            </p>
            <TypewriterText
              text={content.aboutUs.text}
              as="p"
              className="font-serif text-2xl md:text-3xl leading-snug"
            />
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={150} className="order-1 md:order-2">
          <img
            src={content.aboutUs.image}
            alt={content.restaurantName}
            className="w-full h-72 md:h-[30rem] object-cover"
          />
        </RevealOnScroll>
      </section>

      {/* El chef */}
      <section className="grid md:grid-cols-2 mt-16 md:mt-24">
        <RevealOnScroll>
          <img
            src={content.chefStory.image}
            alt={content.chefStory.chefName}
            className="w-full h-72 md:h-[30rem] object-cover"
          />
        </RevealOnScroll>
        <RevealOnScroll delay={150} className="flex items-center p-10 md:p-16">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700/70 mb-4">
              {t("sections.chefStory")}
            </p>
            <h2 className="font-serif text-2xl mb-2">{content.chefStory.chefName}</h2>
            <TypewriterText
              text={content.chefStory.text}
              className="text-neutral-700 leading-relaxed"
            />
          </div>
        </RevealOnScroll>
      </section>

      {/* Los platos detrás del menú */}
      <section className="px-6 md:px-16 py-20 mt-16 md:mt-24 text-center">
        <RevealOnScroll>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-700/70 mb-3">
            {t("storyPage.dishesTitle")}
          </p>
          <p className="max-w-xl mx-auto text-neutral-600 mb-14">
            {t("storyPage.dishesSubtitle")}
          </p>
        </RevealOnScroll>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {content.featuredMenu.dishes.map((dish, i) => (
            <RevealOnScroll key={dish.id} delay={Math.min(i * 100, 300)} className="flex gap-5">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-28 h-28 object-cover rounded-sm shrink-0"
              />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-amber-700/70 mb-1">
                  {dish.category}
                </p>
                <h3 className="font-serif text-lg mb-2">{dish.name}</h3>
                <TypewriterText
                  text={dish.fullDescription}
                  as="p"
                  className="text-sm text-neutral-600 leading-relaxed mb-2"
                  wordDelay={20}
                />
                <a
                  href={`/${locale}/menu/${dish.id}`}
                  className="text-xs uppercase tracking-wide underline underline-offset-4"
                >
                  {t("menuPage.viewDish")} →
                </a>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Video: recorrido más largo por la cocina */}
      <section className="px-6 md:px-16 py-20 text-center text-white" style={{ backgroundColor: "#1C1A17" }}>
        <RevealOnScroll>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400/80 mb-3">
            {t("storyPage.videoTitle")}
          </p>
          <TypewriterText
            text={t("storyPage.videoSubtitle")}
            className="max-w-xl mx-auto text-white/60 mb-10"
          />
          <div className="max-w-3xl mx-auto aspect-video">
            <video
              className="w-full h-full object-cover rounded-sm"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              controls
              poster={content.chefStory.image}
            />
          </div>
        </RevealOnScroll>
      </section>

      {/* Lo que nos guía: recap de Our Philosophy */}
      <section className="px-6 md:px-16 py-20 mt-16 md:mt-24 text-center" style={{ backgroundColor: "#F2EDE3" }}>
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/70 mb-3">
          {t("storyPage.philosophyRecap")}
        </p>
        <h2 className="font-serif text-2xl mb-4">{t("sections.ourPhilosophy")}</h2>
        <TypewriterText
          text={content.ourPhilosophy.intro}
          className="max-w-xl mx-auto text-neutral-700 mb-12"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {content.ourPhilosophy.cards.map((card, i) => (
            <RevealOnScroll key={card.id} delay={i * 80} className="relative h-48 sm:h-64 overflow-hidden rounded-sm">
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 text-white text-left">
                <h3 className="font-serif text-sm sm:text-lg">{card.title}</h3>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Reconocimientos */}
      <section className="px-6 md:px-16 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/70 mb-10">
          {t("storyPage.awardsRecap")}
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-6">
          {content.awards.map((award, i) => (
            <RevealOnScroll key={award.id} delay={i * 80}>
              <p className="text-sm uppercase tracking-wide text-neutral-500">
                {award.label}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-16 py-20 text-center text-white" style={{ backgroundColor: "#1C1A17" }}>
        <RevealOnScroll>
          <h2 className="font-serif text-2xl mb-8">{t("nav.reserve")}</h2>
          <a
            href={`/${locale}/reservations`}
            className="inline-block border border-white px-6 py-3 text-xs uppercase tracking-wide hover:bg-white hover:text-neutral-900 transition-colors"
          >
            {t("nav.reserve")} →
          </a>
        </RevealOnScroll>
      </section>
    </main>
  );
}
