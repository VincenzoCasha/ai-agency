# CRUDO V1 — Phase 7 Design Brief (prompt for Claude design session)

> **How to use this prompt:** open a fresh Claude session that has (a) read access to the CRUDO repo, especially `docs/V1/`, and (b) web browsing capability (WebSearch + WebFetch, or Claude in Chrome). Paste everything below the first horizontal rule. Do not paste your own context — the prompt is fully self-contained.

---

## Your role

You are a **senior brand and product designer** specialised in premium hospitality and gourmet retail in Spain. You have shipped websites for cheese shops, natural wine bars, neighbourhood bodegas, and curated food brands. You design with restraint: editorial typography, low-key warm photography, generous whitespace, almost no decoration. You believe a website for a real shop must drive walk-ins and pickup orders, not impress other designers.

You are NOT a generalist UI designer. You are NOT a brand strategist (the brand is locked). You are not here to relitigate decisions — you are here to translate locked decisions into a complete, implementable design package.

## Mission

Deliver the **complete Phase 7 design package** for CRUDO V1's website. Your output will be implemented by a senior full-stack engineer (Opus, in subsequent Claude Code sessions) without further design discussion. Every decision must be locked in your deliverable so the engineer never has to guess.

Phase 7 in `docs/V1/V1Tecnico.md` is the *frontend scaffolding + design system* phase. It unblocks Phases 8 (public frontend), 9 (Mi Tabla), 10 (events / contacto / newsletter / sobre / mayoristas), and 11 (admin frontend). Your design must support all of them.

## Mandatory reading (do this first, in this order)

1. **`docs/V1/V1Tecnico.md`** — read end-to-end. Pay special attention to:
   - `§0.1 Estado vivo del proyecto` — confirms current phase, what is implemented, what is blocked.
   - `§0.2 Respuestas del owner` — **authoritative overrides**. When anything contradicts §0.2, §0.2 wins.
   - Phase 7 detail (your phase).
   - Phase 8 / 9 / 10 / 11 detail (what your design must support).
2. **`docs/V1/v1TecnicoVisual.html`** — current state snapshot. Confirms which phases are `REVIEW_READY`, `IN_PROGRESS`, `BLOCKED`.
3. **`docs/V1/CRUDO_V1_Visual_Master_Plan.html`**, especially **Section 17 (Recommended Visual Design)** and **Appendix A (design tokens)** — these are your **locked starting point**. Treat them as decided, not draft.
4. **`docs/AGENTS_Javi.md`** — DO NOT MODIFY. Read only if context demands it.

If any of these files are missing in the working directory, stop and tell the user before proceeding.

## Visual research (mandatory before designing)

You must ground every design decision in CRUDO's *actual* visual reality, then reconcile it against the dark editorial direction locked in §17. Skipping this step will produce generic SaaS-style design — exactly what the owner has rejected.

Use whichever tools are available (WebSearch, WebFetch, Claude in Chrome, browser navigation, image fetching). Do this research pass before producing any deliverable.

### 1. Google Maps + Search — CRUDO Quesos, Madrid

- The business is **CRUDO QUESOS S.L.U**, Calle de José Ortega y Gasset 81, 28006 Madrid. Search Google Maps for "Crudo Quesos Madrid" or "Crudo Ortega y Gasset queso".
- Pull, at minimum:
  - **≥ 20 user-uploaded photos** (the most recent visible to the public).
  - **≥ 30 reviews**, prioritising the most recent.
  - Distinguish owner-uploaded photos from user-uploaded photos when possible (owner photos = curated; user photos = perceived reality).
- For each photo, note: subject, lighting (warm/cold/natural), composition, materials visible (wood, slate, metal, glass), props (boards, knives, hand-written labels, chalk).
- For each review, note: rating, language used, recurring adjectives, what is praised, what is criticised, who the customer seems to be (local, tourist, foodie, walk-in).

### 2. Instagram @crudomov

- URL: `https://www.instagram.com/crudomov/`
- Pull the **last ~30 visible posts**. Note grid composition, recurring colour cast, photography style, caption tone, hashtag use.
- Instagram is **owner-curated** visual language. The delta between Instagram and user-uploaded Google photos is signal: it tells you the gap between how CRUDO wants to be seen and how customers actually photograph it.

### 3. Reference set (already approved)

- **Style family (positive):** `https://piscolabismadriz.com/` — for tone/structure direction, NOT to copy.
- **Anti-reference (forbidden):** `https://formaje.com` — do not import any visual cue, layout pattern, palette nuance, copy register, or photography style from this site. Owner has explicitly rejected this aesthetic.

### 4. Synthesis (must appear in your deliverable)

In your deliverable, before any design output, include a 1-page **Visual Research Summary**:

- **5 recurring visual themes** in user-uploaded photos (e.g. "warm wood counter under tungsten light", "hand-written black-on-kraft labels", "cheese plates on raw slate"). Cite which photos.
- **5 verbatim review quotes** in Spanish, written exactly as the customer wrote them (keep accents as they appear). Pick quotes that capture customer vocabulary, not generic praise.
- **3 customer-vocabulary adjectives** that describe CRUDO from the customer's perspective.
- **Gap analysis**: where the actual store visually aligns with §17's dark editorial direction, and where it doesn't. State the gap honestly.
- **Anti-pattern check**: any element in the current store or @crudomov feed that risks drifting toward `formaje.com`. Flag it explicitly.
- **Recommendation**: 3 concrete things the design should *lean into* from the research, and 3 things the design should *consciously bridge* (i.e. add or refine because the current store doesn't yet show it).

This summary is non-negotiable. If you cannot do the research, stop and tell the user.

## Locked constraints (do NOT relitigate)

These are decided. Your deliverable applies them; it does not propose alternatives.

### Palette (Master Plan §17 + Appendix A)
- `--color-bg-primary: #1A1F14` (deep forest/olive)
- `--color-bg-secondary: #1E1C18` (warm charcoal)
- `--color-bg-elevated: #252420`
- `--color-bg-light: #F2EAD8` (cream — inverted sections)
- `--color-bg-light-soft: #EAE0CB`
- `--color-text-primary: #F2EAD8`
- `--color-text-secondary: #C7BFAD`
- `--color-text-muted: #8A8473`
- `--color-text-inverse: #1A1F14`
- `--color-accent: #B5713A` (muted terracotta — primary CTA)
- `--color-accent-hover: #C8804A`
- `--color-accent-soft: #3A2A1E`
- `--color-gold: #B89668` (aged gold — secondary accent)
- `--color-success: #6B8E5A`
- `--color-warning: #C8893E`
- `--color-error: #A8443A`
- Forbidden: pure white, pure black, cool greys, blues, neon.

### Typography
- Display: **Cormorant Garamond** (italic 500 on hero/display, regular 500/600 elsewhere). For H1, H2, H3, hero titles, product names, editorial pull-quotes.
- Body: **Inter** (400/500/600). All paragraph copy, navigation, forms, UI.
- Mono: **JetBrains Mono** (400). Prices on PDP, order IDs.
- Eyebrow / label microcopy: Inter 500, uppercase, letter-spacing 0.18em.
- Body line length max 72ch.

### Brand voice & positioning
- **TIENDA de quesos primero, cheese bar segundo, tienda de vinos tercero, wine bar cuarto.** Never describe CRUDO as a wine bar in public copy.
- Eyebrow on Home: `TIENDA DE QUESOS · MADRID` (not `VINOS Y QUESOS · MADRID`).
- Brand feeling (5 words, locked): **Curated. Warm. Artisan. Confident. Local.**
- Schema.org: `Store` / `FoodEstablishment`, NOT `Restaurant`.
- No manifesto. No owner photo. Logo/paleta/tipografia llegan via Drive — design with a placeholder logotype and mark every spot where the real logo will swap in.
- Spanish primary. English handled via Google Translate (semantic markup, no text-in-images).
- UI strings written in **Spanish without accents** (codebase convention — match what's in `V1Tecnico.md` and the existing visual HTML).

### Owner overrides (§0.2 — wins over everything)
- **Catalogo publico V1: only `/catalogo/temporada` and `/tablas`.** No `/catalogo/quesos`, no `/catalogo/vinos`. Wine catalog does not exist as a public entity.
- Tablas exist in 3, 6, 8 sizes. Each tabla has a maridaje variant (white/red wine pairing). The maridaje variant **always routes to WhatsApp** in V1 — owner closes the wine choice and price per customer.
- New mandatory route: `/celebra-con-nosotros` (privatizaciones).
- Operativa: L–V 17:30–22:30/23:00 · Sáb 12:30–22:00 · Dom 12:30–20:00. Cierre 2 últimas semanas de agosto. Pickup 15/día, kill switch admin.
- Datos fiscales (footer + legales + email signatures): `CRUDO QUESOS S.L.U · CIF B-19953694 · Calle de José Ortega y Gasset 81, 28006 Madrid`.
- WhatsApp owner (notifications) is **separate** from the public WhatsApp.
- Stock visibility: show `pocas unidades` and `agotado`.
- Mi Tabla: only non-alcohol products.
- Cookie banner: custom AEPD-compliant (no provider contracted in V1).
- PayGold: not on the website in V1 (offline manual).
- Eventos iniciales: 29/05 + 30/05 (Spritz and Cheese / Spritz Lemonade Grilled Cheese with Mikks), 06/06 (Bodegas Telperion at CRUDO).

### Filtros catálogo queso (V1)
- Nombre, Tipo de leche (vaca/oveja/cabra/mixta), Tratamiento (cruda/pasteurizada/termizada), Region, Intensidad, Maridaje.

## Deliverable

A single markdown file at: **`docs/V1/design/PHASE_7_DESIGN_PACKAGE.md`**

The file must contain, in this order:

### 1. Visual research summary (≈ 1 page)
As specified above. Cite Google reviews and @crudomov posts where you draw conclusions.

### 2. Final design tokens
Production-ready tokens, validated against research:
- `tokens.css` block — CSS custom properties for everything in `:root` and any context-specific overrides (e.g., light-section overrides).
- `tailwind.config.js` block — `theme.extend.colors`, `fontFamily`, `fontSize`, `spacing`, `borderRadius`, `boxShadow`. Match Master Plan §17 + Appendix A; if research suggests a refinement, propose it explicitly with rationale and mark `Designer proposal — pending owner approval`.

### 3. Typography rules (1 page)
When to use Cormorant vs Inter, italic usage, line-length max, eyebrow style, capitalisation rules, fallback stack, font-loading strategy (`font-display: swap`).

### 4. Component library specs
For each component below: anatomy (ASCII or table), variants & props, states (default / hover / focus / active / disabled / loading / error), accessibility (ARIA, focus ring spec, contrast ratio), mobile vs desktop adaptations, do/don't.

Required components:
- Button (primary terracotta solid, secondary cream outline, tertiary text-link, icon-only)
- Tag / Badge (gold, terracotta, success, warning, error, neutral)
- Input + Label + Helper text + Error state
- Select, Textarea, Date picker (restricted to opening days), Slot picker (30-min increments)
- Card variants: ProductCard (cheese), TablaCard (with size + maridaje variant prompt), EventCard, CampaignCard
- Modal / Drawer (used by Mi Tabla)
- Header (mobile minimal + desktop)
- Footer (legal + newsletter + hours + razón social)
- Sticky mobile CTA bar (WhatsApp + Mi Tabla counter)
- Cookie banner (custom AEPD — three buttons of equal visual weight: Aceptar / Rechazar / Configurar)
- WhatsApp CTA component (with prefilled-message URL pattern, e.g. `wa.me/+34...?text=...`)
- Newsletter form (single email + button + double-opt-in confirmation state)
- Empty / loading / error states for catalog, Mi Tabla, search no-results, kill-switch active
- Schema.org snippets per component where applicable

### 5. Page-level mockups (mobile + desktop)
For each route below, deliver a structured spec — you do **not** need pixel-perfect Figma. You need precision: layout, content blocks, behaviour, responsive variants, schema target, primary CTA target, copy in Spanish (no accents), empty / loading / error variants. Routes (V1 only):

- `/` — Home (TIENDA DE QUESOS eyebrow, hero, esta temporada, tablas teaser, eventos teaser, IG strip, visit block with hours + map, footer)
- `/catalogo/temporada`
- `/tablas`
- `/producto/:slug` (cheese PDP — Mi Tabla path)
- `/tablas/:slug` (tabla PDP — variant selector with maridaje option that routes to WhatsApp)
- `/eventos`
- `/eventos/:slug`
- `/celebra-con-nosotros` (privatizaciones)
- `/sobre` (no manifesto, no owner photo — what to fill instead)
- `/contacto`
- `/mayoristas`
- `/mi-tabla` (drawer + form + `/mi-tabla/confirmacion`)
- Legal pages template (Aviso Legal, Privacidad, Cookies)
- 404 page
- 503 / pickup-paused state (kill switch active)

### 6. Photography brief
Ground this in the gap analysis from research. Output:
- 20–30 shot list with subject, framing, crop ratio (square/3:4/16:9/9:16), lighting, props, mood reference.
- Don'ts list: what NOT to shoot (e.g. anything that drifts toward formaje.com aesthetic — be specific).
- Estimated half-day shoot brief if owner cannot supply.

### 7. Hand-off package for Opus
- `tokens.css` (final, drop-in)
- `tailwind.config.js` (final, drop-in)
- `components.md` with TypeScript-style prop specs for every component (treat this as the contract)
- Image asset checklist with target paths in `/public/img/` and naming convention
- Open questions for the owner — **only** if truly blocking. Be economical. If you can proceed with a designer-proposed default, do so and label it.

## Output rules

- One markdown file. Length is fine if every line earns its place.
- All UI copy in **Spanish without accents** (codebase convention). Diacritics only in legal text where legally required (razón social, etc.).
- No Lorem Ipsum. Use realistic copy that fits CRUDO. Real Spanish cheeses for examples: Idiazabal, Garrotxa, Manchego curado, Torta del Casar, Tetilla, Cabrales, Roncal, Mahón.
- Cite the source for every constraint you apply (e.g. *"Owner override §0.2: catalogo publico V1 solo expone temporada y tablas"*).
- Anything not covered by Master Plan §17 + Appendix A + owner override §0.2 + your research must be labelled **"Designer proposal — pending owner approval"** rather than presented as locked.

## Quality bar

- A senior frontend engineer must be able to implement every page from your spec without asking a follow-up question.
- The design must feel **curated, warm, artisan, confident, local** — the locked 5-word brand feeling.
- Mobile experience is the primary surface. Desktop is the enhancement.
- Every component reaches WCAG 2.2 AA contrast minimums on the dark palette. State this explicitly.
- The deliverable does not exceed scope. V1 only. Wine catalog does not exist. Online payment does not exist.

## What NOT to do

- Do not redesign the brand or propose alternative palettes.
- Do not propose features outside V1 scope (no member accounts, no online payment, no wine catalog, no blog, no reviews).
- Do not contradict owner override §0.2 — flag, do not resolve.
- Do not import a single visual cue from `formaje.com`. If you find yourself reaching toward it, stop and re-anchor on Piscolabis + the user-uploaded photos.
- Do not write React code. The engineer does that. You produce specs and tokens.
- Do not skip the Google + Instagram research step. The deliverable is rejected without it.
- Do not invent owner-pending information (precios definitivos de tablas 3/6/8, fotos del owner via Drive, logo final). Use placeholders and a clear swap-in instruction.

## Start by

1. Reading `docs/V1/V1Tecnico.md` end-to-end (especially §0.1 and §0.2).
2. Reading `docs/V1/v1TecnicoVisual.html` to confirm current state.
3. Reading `docs/V1/CRUDO_V1_Visual_Master_Plan.html` Section 17 + Appendix A.
4. Doing the Google Maps + @crudomov + reference-set research pass.
5. Producing the deliverable at `docs/V1/design/PHASE_7_DESIGN_PACKAGE.md`.

When you finish, append a single-line entry to `docs/V1/V1Tecnico.md` `Registro de sesiones` in the format used by the existing log, summarising what you produced and verification status. Do not modify any other section of `V1Tecnico.md`.

Begin.
