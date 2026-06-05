# CRUDO V2 - Recordatorio rapido

Este archivo no es el plan tecnico ni el documento de fases. Es solo una libreta
para no olvidar decisiones, dudas y cambios que queremos llevar a V2.

## Idea general V2

- Mantener la web como herramienta de visibilidad, promocion, reservas y takeaway.
- No convertirla en ecommerce complejo si Annet no lo necesita.
- La base de datos debe servir para editar contenido y gestionar solicitudes, no
  para obligar a llevar inventario real.
- Implementar un nuevo frontend mobile-first basado en el diseño de Claude
  Design/Piscolabis.
- Referencia del nuevo diseño:
  `C:\Users\Vincenzo\Downloads\Crudo by Piscolabis`
- Cuando se prepare `V2-tecnico.md`, revisar ese ZIP/carpeta antes de definir
  componentes, rutas, tokens, layout y plan de migracion.

## Nuevo diseno frontend V2

- El rediseño de Claude Design es la referencia visual principal para V2.
- Tratarlo como mobile-first: primero experiencia movil, luego desktop.
- Usar el diseño para decidir:
  - home
  - navegacion
  - seleccion del mes
  - eventos
  - tablas/cajas/fromelier
  - merch
  - contacto
  - componentes reutilizables
  - tokens visuales
- No implementar V2 encima del diseño actual sin revisar antes el ZIP/carpeta.
- Comparar el nuevo diseño con la V1 actual para decidir que se reutiliza y que
  se reemplaza.

## Estado heredado desde V1Tecnico

Fuente principal: `docs/V1/V1Tecnico.md`, seccion `0.1 Estado vivo del proyecto`.

- Estado documentado de V1: `current_phase: 10.5`, `overall_status:
  REVIEW_READY`.
- Siguiente fase recomendada en V1: `Fase 11 - Admin frontend movil`.
- Fases 0-10.5 estan documentadas como implementadas/review-ready:
  - scaffold repo y backend
  - MariaDB/migraciones/seed
  - API publica
  - Mi Tabla backend con alcohol guard 422
  - admin backend con JWT
  - infra Plesk/Contabo documentada
  - frontend publico Home/Catalogo/PDP
  - Mi Tabla frontend
  - eventos/contacto/newsletter/sobre/mayoristas
  - feedback Annet 10.5 de branding/nav/tablas
- Despues de V1Tecnico hubo commits nuevos no sincronizados del todo en el
  estado vivo:
  - nav simplificada
  - `/seleccion` como ruta principal
  - `/merch`
  - EventCard con poster/foto
  - seleccion de Annet/fromelier
  - caja para llevar
  - copy de eventos con confirmacion por WhatsApp y link de pago manual
- Pendientes criticos que V2 no debe olvidar:
  - Admin frontend movil no esta implementado; `/admin` sigue como placeholder.
  - Legal/cookies/SEO/analytics/prerender no estan cerrados como launch-ready.
  - E2E/QA/performance/lighthouse/iPhone/Instagram browser pendientes.
  - Contenido real/carga inicial completa pendiente.
  - Launch/staging/production estable pendiente.
  - Notificaciones reales email/WhatsApp pendientes o no cerradas.
  - Brevo/cuenta email marketing pendiente o no validada.
  - Catalogo real de quesos, precios, textos y fotos finales pendiente.
  - Merch real pendiente.
  - Fotos producto 1:1 y fotos especificas de tablas/cajas pendiente.
  - Validacion legal del owner pendiente.
- Reglas V1 que siguen siendo importantes para V2 salvo decision explicita:
  - no venta online de alcohol
  - no pago online integrado sin decision/legal
  - vinos y maridajes por WhatsApp
  - Mi Tabla solo no alcohol
  - backend como red de seguridad, no confiar solo en UI
  - CRUDO se comunica como tienda de quesos primero, no como wine bar

## Mejoras/prioridades V2 detectadas

### Produccion Plesk / crudomov.es

- Estado actual segun owner/dev: Plesk ya se ha configurado casi todo.
- Tratar esto como "hecho pendiente de verificacion", no como blocker principal.
- Verificar que realmente queda cerrado:
  - `.env` real de produccion o variables Plesk correctas.
  - DB real configurada (`DB_NAME`, `DB_USER`, `DB_PASSWORD`).
  - `JWT_SECRET` y `COOKIE_SECRET` reales, largos y distintos.
  - `npm install` / `npm ci` ejecutado.
  - `npm run build` ejecutado tras el ultimo pull.
  - `npm run db:migrate` ejecutado.
  - seed demo solo si se decide expresamente y nunca como seed dev inseguro en
    produccion.
  - app Node reiniciada en Plesk.
  - SSL Let's Encrypt activo.
  - Git deploy sin `nodenv` roto.
  - revisar si document root `/httpdocs/dist` esta bien para el modo actual o si
    conviene que Node sirva desde `/httpdocs` con `server.js`.
- Smoke/verificacion:
  - `https://crudomov.es`
  - `/api/v1/health`
  - `/api/v1/site/config`
  - eventos/catalogo
  - assets e imagenes.

### Performance / bundle

- El build avisa que el JS esta por encima de 500KB.
- Implementar code splitting/lazy loading por rutas.
- Priorizar que la home cargue rapido en movil.
- Separar admin, paginas legales, eventos detalle, producto detalle y merch en
  chunks bajo demanda.

### SEO basico

- Fase 12 parcial sin depender de Annet:
  - `robots.txt`
  - `sitemap.xml`
  - canonical URLs
  - meta title/description por pagina
  - Open Graph/Twitter cards por pagina
  - JSON-LD para LocalBusiness/Store y Event.
- Usar `Store`/`LocalBusiness` antes que comunicar CRUDO como restaurante/wine
  bar.

### Image pipeline

- Implementar pipeline con Sharp o equivalente.
- Convertir fotos elegidas a WebP.
- Generar thumbnails.
- Generar variantes responsive (`srcset`) para:
  - hero desktop
  - hero mobile
  - cards 1:1
  - posters/eventos
  - lifestyle horizontal.
- No servir originales pesados directamente en la web.

### Admin movil

- Fase 11 sigue pendiente y debe entrar en V2 si Annet necesita editar sin dev.
- Backend admin ya existe; falta UI mobile-first.
- Objetivo: que Annet pueda gestionar desde movil:
  - seleccion del mes
  - productos/quesos visibles
  - disponibilidad simple
  - eventos y carteles
  - pedidos/takeaway
  - consultas
  - newsletter/leads
  - textos/fotos basicos si se decide.
- Mantener admin simple, menos de 5 minutos al dia.

### E2E / QA

- Añadir Playwright para flujos completos:
  - home carga
  - seleccion del mes
  - producto no alcohol -> Mi Tabla
  - pickup -> confirmacion
  - tabla con vino -> WhatsApp
  - eventos -> reserva
  - contacto/newsletter
  - cookie banner
  - legal pages
  - admin login cuando exista UI.
- Probar mobile, iPhone Safari e Instagram in-app browser si es posible.

## Dependencias de Annet / owner

- No bloquear codigo por esto, pero no marcar launch-ready sin cerrarlo:
  - URL real de merch.
  - Productos merch reales/fotos.
  - Precios de tablas/cajas.
  - Lista real de quesos de la seleccion del mes.
  - Eventos reales futuros y textos definitivos.
  - GA4 ID.
  - Brevo/cuenta email.
  - Revision legal final.
  - Fotos producto 1:1 si se quiere catalogo completo.

## Cambios de base de datos / admin

- Simplificar el concepto de stock.
- No plantear stock como unidades exactas ni inventario de tienda.
- Usar estados editoriales/comerciales:
  - disponible
  - pocas unidades
  - agotado
  - oculto / no publicado
- El admin debe sentirse como panel de contenido y operativa, no como ERP.
- Priorizar que Annet pueda cambiar rapido:
  - seleccion del mes
  - fotos
  - textos
  - eventos
  - cajas / tablas
  - opciones de merch
  - estados visibles de disponibilidad
- Revisar si `product_variant` sigue teniendo sentido para tablas con maridaje o
  si V2 lo trata como configuracion por WhatsApp.
- Mantener DB para:
  - eventos y reservas
  - solicitudes de takeaway / Mi Tabla
  - newsletter
  - formularios de contacto
  - consentimiento cookies
  - textos/fotos/configuracion editable

## Feedback P.O. / Annet a tener en cuenta

- Anadir boton/enlace de merch.
- Cambiar "Catalogo" por "Seleccion del mes".
- En eventos, mostrar cartel/foto en la card cuando exista, no solo fecha.
- Boton de proximos eventos: usar texto mas directo, tipo "Eventos".
- Crear opcion clara para pedir:
  - tabla con seleccion del fromelier
  - caja para pickup en tienda
- Aclarar que textos, fotos, productos y datos actuales son sample/editables.
- En eventos: copy operativo de confirmacion por WhatsApp y envio de link de pago.

## Fotos disponibles para V2

- Usar por ahora las fotos existentes en `docs/V1/Photos` como base visual de V2.
- Hay material suficiente para una web editorial/promocional:
  - home / hero
  - ambiente del local
  - quesos en general
  - maridajes / vino / catas
  - eventos
  - seleccion de Annet / fromelier
  - tablas o cajas en enfoque generico/editorial
- En V2 conviene plantear "Seleccion del mes" como seleccion editorial, no como
  catalogo ecommerce que exige foto perfecta por cada SKU.
- Antes de implementar, hacer una curacion de assets:
  - elegir fotos por seccion
  - recortar versiones hero, mobile, card 1:1 y poster/evento
  - optimizar peso para web
  - copiar solo las finales a `public/img`
- Probablemente siguen faltando fotos especificas si queremos producto completo:
  - una foto por queso individual
  - fotos reales de tabla 3/6/8 quesos
  - caja para llevar con packaging
  - merch real
  - cartel/foto por cada evento futuro
- Decision provisional: no bloquear V2 por fotos perfectas de producto. Usar
  fotos actuales con fallback editorial y sustituir cuando Annet entregue fotos
  mas sistematicas.

## Merch

- Decidir si merch sera:
  - pagina interna `/merch`
  - enlace externo
  - placeholder "proximamente"
  - productos reales editables desde admin
- Si no hay merch real aun, que no parezca una tienda rota.

## Preguntas abiertas

- Quiere Annet gestionar pedidos desde admin o prefiere que casi todo vaya a WhatsApp?
- Las cajas/tablas sin vino deben entrar en Mi Tabla o tambien ir por WhatsApp?
- Habra precios fijos para tablas/cajas o se confirma todo manualmente?
- La seleccion del mes se actualiza semanal o mensual?
- El link de pago para eventos es PayGold/manual fuera de la web o algo integrado en V2?
- Hasta donde queremos llegar con admin editable sin hacerlo pesado?

## Riesgos a vigilar

- No reintroducir venta online de alcohol por accidente.
- No meter pagos online si no esta decidido y validado.
- No convertir el admin en un ecommerce/ERP.
- No pedirle a Annet mantenimiento diario que no va a hacer.
- No dejar docs diciendo una cosa y codigo haciendo otra.
