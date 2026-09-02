import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // No aplicar a rutas internas de Next, archivos estáticos, ni /admin o /api
  // (el admin y la API de contenido son neutrales de idioma de interfaz)
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
