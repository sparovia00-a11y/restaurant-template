import { getTranslations } from "next-intl/server";
import { getContent } from "@/content/store";
import type { Locale } from "@/i18n/routing";
import { Star, Clock, Heart, Home as HomeIcon, Award, MapPin, Phone } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import TypewriterText from "@/components/TypewriterText";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const content = await getContent(locale as Locale);

  return (
    <main>
      {/* Hero: imagen de fondo con zoom lento in/out, altura corta (no 100vh), tagline centrado */}
      <section className="relative h-[70vh] flex items-end justify-center pb-16 overflow-hidden bg-neutral-800">
        <div
          className="absolute inset-0 bg-cover bg-center animate-hero-zoom"
          style={{ backgroundImage: `url(${content.hero.backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative text-center text-white px-6 animate-fade-up">
          <h1 className="font-serif text-4xl md:text-6xl mb-4">
            {content.restaurantName}
          </h1>
          <p className="max-w-xl mx-auto text-lg opacity-90">
            {content.hero.tagline}
          </p>
        </div>
      </section>

      {/* Sobre nosotros: imagen a un lado, texto al otro (desktop); apilado (mobile) */}
      <section className="grid md:grid-cols-2 gap-0 mt-16 md:mt-24">
        <RevealOnScroll className="order-1">
          <img
            src={content.aboutUs.image}
            alt={content.restaurantName}
            className="w-full h-72 md:h-[36rem] object-cover"
          />
        </RevealOnScroll>
        <RevealOnScroll delay={150} className="flex items-center p-10 md:p-16 order-2">
          <div>
            <h2 className="font-serif text-2xl mb-4">
              {t("sections.aboutUs")}
            </h2>
            <TypewriterText
              text={content.aboutUs.text}
              className="text-neutral-700 leading-relaxed"
            />
          </div>
        </RevealOnScroll>
      </section>

      {/* Nuestra filosofía: intro + 4 fotos del restaurante */}
      <section className="px-6 md:px-16 py-20">
        <h2 className="font-serif text-2xl mb-4 text-center">
          {t("sections.ourPhilosophy")}
        </h2>
        <TypewriterText
          text={content.ourPhilosophy.intro}
          className="max-w-2xl mx-auto text-center text-neutral-700 mb-12"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {content.ourPhilosophy.cards.map((card, i) => (
            <RevealOnScroll
              key={card.id}
              delay={i * 100}
              className="relative h-64 sm:h-80 overflow-hidden rounded-sm"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 text-white">
                <h3 className="font-serif text-base sm:text-xl mb-1 sm:mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm opacity-90">{card.teaser}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Menú destacado: foto, categoría, nombre, descripción, precio + Discover */}
      <section className="px-6 md:px-16 py-20">
        <h2 className="font-serif text-2xl mb-12 text-center">
          {t("sections.featuredMenu")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-neutral-200">
          {content.featuredMenu.dishes.map((dish, i) => (
            <RevealOnScroll key={dish.id} delay={Math.min(i * 90, 360)}>
            <a
              href={`/${locale}/menu/${dish.id}`}
              className="group block"
              style={{ backgroundColor: "#FAF6EF" }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] uppercase tracking-wide text-amber-700/70 mb-2">
                  {dish.category}
                </p>
                <h3 className="font-serif text-lg mb-2">{dish.name}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  {dish.shortDescription}
                </p>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="text-amber-700 text-sm">{dish.price}</span>
                  <span className="text-[11px] uppercase tracking-wide flex items-center gap-1">
                    {t("common.discover")}
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </a>
            </RevealOnScroll>
          ))}
        </div>
      </section>
      {/* Galería: teaser oscuro tipo "exhibición" con mosaico superpuesto */}
      <section
        className="relative px-6 md:px-16 py-24 md:py-32 overflow-hidden text-white"
        style={{ backgroundColor: "#111010" }}
      >
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: "#B08A5A" }}>
              {t("gallery.eyebrow")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
              {t("gallery.title")}
            </h2>
            <div className="w-8 h-px mb-6" style={{ backgroundColor: "#B08A5A" }} />
            <TypewriterText
              text={t("gallery.description")}
              className="text-white/60 max-w-xs mb-10"
            />
            <a
              href={`/${locale}/gallery`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: "#B08A5A" }}
            >
              {t("gallery.enter")} →
            </a>
          </RevealOnScroll>

          <RevealOnScroll delay={150} className="relative h-72 sm:h-96 mt-8 md:mt-0">
            <img
              src={content.gallery.previewImages[2]}
              alt=""
              className="absolute top-0 right-0 w-40 h-32 sm:w-56 sm:h-44 object-cover rounded-sm shadow-xl"
            />
            <img
              src={content.gallery.previewImages[0]}
              alt=""
              className="absolute top-14 sm:top-20 left-2 sm:left-4 w-44 h-52 sm:w-64 sm:h-72 object-cover rounded-sm shadow-2xl"
            />
            <img
              src={content.gallery.previewImages[1]}
              alt=""
              className="absolute bottom-0 left-0 w-48 h-36 object-cover rounded-sm shadow-xl hidden sm:block"
            />
          </RevealOnScroll>
        </div>

        <p className="text-xs text-white/40 mt-16 tracking-wide">01 / 06</p>
      </section>
      {/* Historia / Concepto del chef */}
      <section className="grid md:grid-cols-2 gap-0">
        <RevealOnScroll className="flex items-center p-10 md:p-16 order-2 md:order-1">
          <div>
            <h2 className="font-serif text-2xl mb-2">
              {t("sections.chefStory")}
            </h2>
            <p className="text-sm uppercase tracking-wide text-neutral-500 mb-4">
              {content.chefStory.chefName}
            </p>
            <TypewriterText
              text={content.chefStory.text}
              className="text-neutral-700 leading-relaxed"
            />
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={150} className="order-1 md:order-2">
          <img
            src={content.chefStory.image}
            alt={content.chefStory.chefName}
            className="w-full h-72 md:h-[36rem] object-cover"
          />
        </RevealOnScroll>
      </section>

      {/* Awards: fondo crema, íconos circulares con label */}
      <section
        className="px-6 md:px-16 py-20 text-center"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/70 mb-3">
          {t("sections.awardsEyebrow")}
        </p>
        <h2 className="font-serif text-3xl mb-14">
          {t("sections.awardsTitle")}
        </h2>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-8">
          {content.awards.map((award, i) => (
            <RevealOnScroll key={award.id} delay={i * 80} className="flex flex-col items-center gap-3 w-28">
              <div className="w-14 h-14 rounded-full border border-amber-700/30 flex items-center justify-center text-amber-700/70">
                <AwardIcon name={award.icon} />
              </div>
              <p className="text-[11px] uppercase tracking-wide text-neutral-500">
                {award.label}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Testimonios: tarjetas beige con estrellas y avatar */}
      <section
        className="px-6 md:px-16 py-20 text-center"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/70 mb-3">
          {t("sections.testimonialsEyebrow")}
        </p>
        <h2 className="font-serif text-3xl mb-14">
          {t("sections.testimonialsTitle")}
        </h2>
        <RevealOnScroll className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-1 max-w-6xl mx-auto scroll-smooth [&::-webkit-scrollbar]:hidden">
          {content.testimonials.map((item) => (
            <div
              key={item.id}
              className="text-left p-8 border shrink-0 snap-start w-[85%] sm:w-[360px]"
              style={{ backgroundColor: "#F2EDE3", borderColor: "#E5DCC9" }}
            >
              <div className="text-amber-600 mb-4 text-sm">★★★★★</div>
              <p className="font-serif italic text-neutral-800 leading-relaxed mb-6">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-200/60 flex items-center justify-center font-serif text-amber-800">
                  {item.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.author}</p>
                  <p className="text-xs text-neutral-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </RevealOnScroll>
      </section>
      {/* Reservaciones: CTA fuerte con horarios */}
      <section className="grid md:grid-cols-2 gap-0">
        <RevealOnScroll>
          <img
            src={content.reservations.image}
            alt=""
            className="w-full h-72 md:h-[36rem] object-cover"
          />
        </RevealOnScroll>
        <RevealOnScroll delay={150} className="flex items-center p-10 md:p-16 bg-neutral-900 text-white">
          <div>
            <h2 className="font-serif text-2xl mb-4">
              {t("sections.reservations")}
            </h2>
            <TypewriterText
              text={content.reservations.text}
              className="leading-relaxed opacity-90 mb-6"
            />
            <p className="text-sm uppercase tracking-wide opacity-70 mb-8">
              {content.reservations.hours}
            </p>
            <a
              href={`/${locale}/reservations`}
              className="inline-block border border-white px-6 py-3 text-xs uppercase tracking-wide hover:bg-white hover:text-neutral-900 transition-colors"
            >
              {t("nav.reserve")}
            </a>
          </div>
        </RevealOnScroll>
      </section>

      {/* Ubicación / Contacto */}
      <section className="px-6 md:px-16 py-20 text-center">
        <h2 className="font-serif text-2xl mb-10">{t("sections.location")}</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <RevealOnScroll
            delay={0}
            className="p-8 border flex flex-col items-center gap-3"
            style={{ backgroundColor: "#F2EDE3", borderColor: "#E5DCC9" }}
          >
            <div className="w-12 h-12 rounded-full border border-amber-700/30 flex items-center justify-center text-amber-700/70">
              <MapPin size={20} strokeWidth={1.5} />
            </div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {t("location.addressLabel")}
            </p>
            <p>{content.location.address}</p>
          </RevealOnScroll>
          <RevealOnScroll
            delay={100}
            className="p-8 border flex flex-col items-center gap-3"
            style={{ backgroundColor: "#F2EDE3", borderColor: "#E5DCC9" }}
          >
            <div className="w-12 h-12 rounded-full border border-amber-700/30 flex items-center justify-center text-amber-700/70">
              <Phone size={20} strokeWidth={1.5} />
            </div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {t("location.phoneLabel")}
            </p>
            <p>{content.location.phone}</p>
          </RevealOnScroll>
          <RevealOnScroll
            delay={200}
            className="p-8 border flex flex-col items-center gap-3"
            style={{ backgroundColor: "#F2EDE3", borderColor: "#E5DCC9" }}
          >
            <div className="w-12 h-12 rounded-full border border-amber-700/30 flex items-center justify-center text-amber-700/70">
              <Clock size={20} strokeWidth={1.5} />
            </div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {t("location.hoursLabel")}
            </p>
            <p>{content.location.hours}</p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white px-6 md:px-16 py-14">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="font-serif text-lg mb-4">{content.restaurantName}</p>
            <div className="flex gap-4 text-sm opacity-80">
              <a href={content.footer.instagram}>Instagram</a>
              <a href={content.footer.facebook}>Facebook</a>
            </div>
          </div>
          <div className="max-w-xs">
            <p className="text-sm opacity-80 mb-3">
              {content.footer.newsletterText}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t("footer.newsletterPlaceholder")}
                className="flex-1 bg-transparent border border-white/30 px-3 py-2 text-sm"
              />
              <button className="border border-white px-4 py-2 text-xs uppercase">
                {t("footer.subscribe")}
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-xs opacity-50 mt-10">
          © {new Date().getFullYear()} {content.restaurantName}. {t("footer.rights")}
        </p>
      </footer>
    </main>
  );
}

function AwardIcon({ name }: { name: string }) {
  const props = { size: 22, strokeWidth: 1.5 };
  switch (name) {
    case "clock":
      return <Clock {...props} />;
    case "heart":
      return <Heart {...props} />;
    case "home":
      return <HomeIcon {...props} />;
    case "award":
      return <Award {...props} />;
    default:
      return <Star {...props} />;
  }
}
