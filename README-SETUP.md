# Cómo correr la plantilla localmente

1. `npm install`
2. Copia `.env.local.example` a `.env.local` y cambia la contraseña de admin.
3. `npm run dev`
4. Sitio: http://localhost:3000 (redirige a /en). Otros idiomas: /es, /pt, /it
5. Admin: http://localhost:3000/admin (contraseña definida en .env.local)

Localmente, todo se guarda en los archivos JSON de `src/content/` — no necesitas
ninguna cuenta ni configuración extra para probarlo.

## Cómo subirlo a Vercel (con el admin funcionando de verdad)

1. Sube este proyecto a un repositorio de GitHub.
2. Entra a vercel.com, "Add New Project" y conecta ese repo.
3. En "Environment Variables" agrega `ADMIN_PASSWORD` con la contraseña que quieras.
4. Deploy.
5. Una vez desplegado: en el dashboard del proyecto en Vercel, ve a la pestaña
   **Storage** → **Create Database** → elige **Upstash Redis** (gratis en el
   plan Hobby) → conéctala al proyecto.
6. Vercel agrega automáticamente las variables `UPSTASH_REDIS_REST_URL` y
   `UPSTASH_REDIS_REST_TOKEN`. Con eso, el admin y las reservaciones/contacto
   empiezan a guardar en esa base de datos en vez de archivos — así los
   cambios sí persisten en producción.
7. Vuelve a desplegar (Vercel lo hace solo al agregar la variable, o dale
   "Redeploy" manualmente) para que tome las nuevas variables.

Sin el paso 5-7, el sitio funciona igual mostrando el contenido, pero
cualquier edición desde `/admin` (o un envío del formulario de reservaciones)
no se guardará permanentemente en Vercel.

## Cómo enterarte cuando alguien reserva o escribe

Hay dos formas, y no son excluyentes:

**1. Verlas en el admin** (siempre disponible, sin configurar nada extra):
entra a `/admin` → pestaña "Reservas y mensajes". Ahí aparecen todas,
más recientes primero.

**2. Recibir un correo automático** cada vez que llega una (recomendado):
1. Crea una cuenta gratis en resend.com (no pide tarjeta para el plan free).
2. En su dashboard, ve a "API Keys" → crea una → cópiala.
3. En Vercel, ve a Settings → Environment Variables de tu proyecto y agrega:
   - `RESEND_API_KEY` = la key que copiaste
   - `NOTIFY_EMAIL` = el correo del restaurante donde quieres recibir avisos
4. Redeploy. Desde ese momento, cada reserva o mensaje de contacto manda
   un correo automático a esa dirección.

Nota: el correo sale desde una dirección genérica de Resend
(`onboarding@resend.dev`) hasta que verifiques tu propio dominio en Resend
— eso es opcional y se hace después, cuando quieras que salga desde tu
propio dominio.

## Qué ya está listo
- Base multilingüe EN/ES/PT/IT con next-intl
- Home completo (10 secciones) + todas las páginas individuales (menú, cada
  plato, historia, galería/exhibición, reservaciones, contacto)
- Admin en /admin: edita todo el contenido, por idioma
- Almacenamiento que funciona local (archivos) y en Vercel (Redis) sin tocar código

## Qué sigue
- Reemplazar las fotos y videos de stock por los reales del restaurante
- Conectar el email de reservaciones/contacto a una notificación real (opcional)
