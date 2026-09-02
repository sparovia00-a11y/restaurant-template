import { getContent } from "@/content/store";
import type { Locale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ClickableImage from "@/components/ClickableImage";

const ACCENTS: Record<string, string> = {
  seafood: "#B08A5A",
  meat: "#A2483A",
  vegetarian: "#6E7F5C",
  dessert: "#8C6A9C",
  default: "#B08A5A",
};

function accentFor(dishId: string) {
  if (dishId === "dish-1" || dishId === "dish-4") return ACCENTS.seafood;
  if (dishId === "dish-2" || dishId === "dish-5") return ACCENTS.meat;
  if (dishId === "dish-3") return ACCENTS.vegetarian;
  if (dishId === "dish-6") return ACCENTS.dessert;
  return ACCENTS.default;
}

export default async function DishPage({
  params,
}: {
  params: Promise<{ locale: string; dishId: string }>;
}) {
  const { locale, dishId } = await params;
  const t = await getTranslations({ locale });
  const content = await getContent(locale as Locale);
  const dish = content.featuredMenu.dishes.find((d) => d.id === dishId);
  if (!dish) notFound();

  const accent = accentFor(dish.id);


  return (
    <main className="text-neutral-900">
      <section
        className="relative min-h-screen flex items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${dish.image})` }}
      >
        {dish.heroVideo && (
          <video
            className="md:hidden absolute inset-0 w-full h-full object-cover"
            src={dish.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            poster={dish.image}
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative px-6 md:px-16 pt-28 pb-24 max-w-2xl text-white">
          <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: accent }}>
            {dish.tagline}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-6">{dish.name}</h1>
          <p className="text-white/80 mb-6">{dish.shortDescription}</p>
          <p className="font-serif text-2xl" style={{ color: accent }}>
            {dish.price}
          </p>
          <p className="text-xs uppercase tracking-wide mt-24 flex items-center gap-2 opacity-80">
            ↓ {t("dishPage.discoverDish")}
          </p>
        </div>
      </section>

      <section className="my-10 md:my-16 grid md:grid-cols-2">
        <div className="flex items-center p-10 md:p-24" style={{ backgroundColor: "#F2EDE3" }}>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: accent }}>
              {t("dishPage.theDish")}
            </p>
            <p className="font-serif text-2xl md:text-3xl leading-snug">
              {dish.fullDescription}
            </p>
          </div>
        </div>
        <img
          src={dish.composition[0]?.image}
          alt=""
          className="w-full h-72 md:h-auto object-cover"
        />
      </section>

      <section className="my-10 md:my-16 px-6 md:px-16 py-28 text-center text-white" style={{ backgroundColor: "#1C1A17" }}>
        <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: accent }}>
          {t("dishPage.theComposition")}
        </p>
        <div className="w-8 h-px mx-auto mb-20" style={{ backgroundColor: accent }} />
        <div className="flex flex-wrap justify-center gap-14 md:gap-20">
          {dish.composition.map((item) => (
            <div key={item.id} className="w-32 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border" style={{ borderColor: `${accent}66` }}>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs uppercase tracking-wide">{item.name}</p>
              <p className="text-[11px] italic text-white/50">{item.descriptor}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="my-10 md:my-16 grid md:grid-cols-2" style={{ backgroundColor: "#1C1A17" }}>
        <img src={dish.image} alt={dish.name} className="w-full h-80 md:h-auto object-cover" />
        <div className="text-white p-10 md:p-24">
          <p className="text-xs uppercase tracking-[0.2em] mb-8" style={{ color: accent }}>
            {t("dishPage.theCraft")}
          </p>
          <div className="space-y-10">
            {dish.craftSteps.map((step) => (
              <div key={step.number} className="flex gap-5">
                <span className="font-serif text-xl" style={{ color: accent }}>
                  {step.number}
                </span>
                <p className="text-white/80 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="my-10 md:my-16 grid md:grid-cols-2">
        <div className="flex items-center p-10 md:p-24" style={{ backgroundColor: "#F2EDE3" }}>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: accent }}>
              {t("dishPage.fromTheChef")}
            </p>
            <p className="font-serif italic text-xl leading-relaxed mb-4">
              &ldquo;{dish.chefQuote}&rdquo;
            </p>
            <p className="text-sm text-neutral-500">— {content.chefStory.chefName}</p>
          </div>
        </div>
        <img
          src={dish.chefPhoto}
          alt={content.chefStory.chefName}
          className="w-full h-72 md:h-auto object-cover grayscale"
        />
      </section>

      <section className="my-10 md:my-16 grid md:grid-cols-2 text-white" style={{ backgroundColor: "#1C1A17" }}>
        <div className="p-10 md:p-24 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: accent }}>
            {t("dishPage.perfectPairing")}
          </p>
          <h3 className="font-serif text-2xl mb-1">{dish.winePairing.name}</h3>
          <p className="text-white/60 text-sm mb-4">{dish.winePairing.origin}</p>
          <p className="text-sm mb-8">
            {t("dishPage.glass")} {dish.winePairing.glassPrice} · {t("dishPage.bottle")} {dish.winePairing.bottlePrice}
          </p>
        </div>
        <div
          className="h-56 md:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${dish.winePairing.backgroundImage})` }}
        />
      </section>

      <section className="my-10 md:my-16 px-6 md:px-16 py-28 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-16">
          {t("dishPage.moreOfThisDish")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[dish.image, ...dish.composition.map((c) => c.image)].map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/4] overflow-hidden rounded-sm"
            >
              <ClickableImage
                src={img}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="my-10 md:my-16 px-6 md:px-16 py-28 text-center text-white" style={{ backgroundColor: "#1C1A17" }}>
        <h2 className="font-serif text-2xl mb-2">
          {t("dishPage.experienceTitle")}
        </h2>
        <p className="text-white/60 mb-8">
          {t("dishPage.experienceSubtitle")}
        </p>
        <a
          href={`/${locale}/reservations`}
          className="inline-block border px-6 py-3 text-xs uppercase tracking-wide transition-colors hover:bg-white hover:text-neutral-900"
          style={{ borderColor: accent }}
        >
          {t("nav.reserve")}
        </a>
      </section>
    </main>
  );
}
