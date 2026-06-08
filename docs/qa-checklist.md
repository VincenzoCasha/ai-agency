# CRUDO V2 — Checklist de QA manual (Fase 9)

Complementa la suite E2E automatizada (`npm run test:e2e`, Playwright + axe) y
el presupuesto de bundle (`npm run check:bundle`). Lo automatizable ya está
cubierto; aquí queda lo que conviene comprobar a mano antes de cada launch o
cambio grande de UI.

> La suite E2E corre con la **API mockeada** (no toca backend ni DB). El alcohol
> guard de **backend** (HTTP 422) está cubierto por los tests de servidor en
> `tests/` (`products.validator`, `pickup-orders.validator`). La QA manual valida
> render real, navegadores reales y matices que axe no puede medir.

## Navegadores / dispositivos

- [ ] **Chrome desktop** (última versión).
- [ ] **iPhone Safari** (real o simulador) — el diseño es mobile-first; webkit
      no está en la suite automatizada (solo chromium), así que esta pasada es
      importante.
- [ ] **Instagram in-app browser** (abrir un enlace a crudomov.es desde un DM/bio
      de Instagram) — comprobar que la SPA carga, el cookie banner aparece y los
      CTA de WhatsApp abren la app.
- [ ] Android Chrome (opcional).

## Flujos de negocio (smoke manual)

- [ ] Home carga, hero visible, navegación funciona.
- [ ] Selección del mes lista quesos; **vino muestra solo "WhatsApp", nunca
      "Añadir"** (alcohol guard frontend).
- [ ] Añadir queso → Mi Tabla → reservar recogida → pantalla de confirmación.
- [ ] Mi Tabla **nunca** acepta alcohol (ni desde catálogo ni manipulando).
- [ ] Eventos → detalle → solicitar reserva.
- [ ] Contacto: enviar consulta + suscripción a newsletter (footer).
- [ ] Cookie banner: aceptar / rechazar / configurar y que la decisión persista.
- [ ] Rutas legales (`/aviso-legal`, `/privacidad`, `/cookies`) renderizan.
- [ ] Admin: login en `/admin` y panel (requiere backend+DB reales con seed).

## Accesibilidad (lo que axe no cubre)

- [ ] Navegación completa **solo con teclado** (Tab/Shift+Tab/Enter); foco
      visible en cada control.
- [ ] Lectura con lector de pantalla en los formularios clave (pickup, contacto).
- [ ] Zoom del navegador al 200% sin pérdida de contenido ni solapes.

### Hallazgo abierto — contraste de color (para diseño)

axe detecta combinaciones de la paleta de marca (acento rosa `#ee769c` sobre
crema `#f6f1e4`, ratio ≈ 2.41) por debajo del mínimo AA (4.5:1). La regla
`color-contrast` está **excluida del fallo automático** (corregirla implica tocar
los tokens de diseño, requiere visto bueno de diseño). La suite la **audita y
reporta** sin bloquear (ver `auditContrast` en `e2e/helpers/a11y.js`).
- [ ] Decisión de diseño sobre ajustar tokens de acento/crema o documentar
      excepción.

## Performance (manual)

- [ ] `npm run check:bundle` en verde (chunk principal y peso de imágenes).
- [ ] **Lighthouse mobile** (Chrome DevTools) sobre Home y Selección — revisar
      Performance/SEO/Best Practices/Accessibility. (No automatizado en CI.)
- [ ] Imágenes hero cargan nítidas y sin saltos de layout perceptibles.

## Cómo correr lo automatizado

```bash
npm run test:e2e        # Playwright (chromium: proyectos mobile + desktop)
npm run test:e2e:ui     # modo interactivo
npm run check:bundle    # presupuesto de bundle (tras npm run build)
```
