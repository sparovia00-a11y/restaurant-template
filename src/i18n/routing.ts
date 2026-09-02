import { defineRouting } from "next-intl/routing";

// Inglés primero (mercado angloparlante), español como segundo idioma.
// Portugués e italiano se agregan después siguiendo el mismo patrón.
export const routing = defineRouting({
  locales: ["en", "es", "pt", "it"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];
