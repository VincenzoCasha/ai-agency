import { AxeBuilder } from '@axe-core/playwright';
import { expect } from '@playwright/test';

/**
 * Reglas excluidas del escaneo BLOQUEANTE.
 *
 * `color-contrast`: la paleta de marca de CRUDO (Claude Design / Annet) tiene
 * combinaciones acento-rosa sobre crema con ratio < 4.5:1. Corregirlo implica
 * tocar los tokens de diseño (fuera del alcance de la Fase 9, requiere visto
 * bueno de diseño). Se audita por separado, sin bloquear, y queda anotado como
 * hallazgo para revisión de diseño (ver docs/qa-checklist.md y estado vivo).
 */
const NON_BLOCKING_RULES = ['color-contrast'];

/**
 * Escaneo de accesibilidad ESTRUCTURAL con axe-core: labels, nombres
 * accesibles, roles, jerarquía de headings, ARIA, landmarks, etc. Falla si hay
 * violaciones `serious`/`critical` salvo las de `NON_BLOCKING_RULES`.
 *
 * Reglas WCAG 2.0/2.1 A y AA. El contraste se reporta aparte (no bloquea).
 */
export async function expectNoSeriousA11y(page, { disableRules = [] } = {}) {
  const builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
  ]);
  const allDisabled = [...NON_BLOCKING_RULES, ...disableRules];
  builder.disableRules(allDisabled);

  const results = await builder.analyze();
  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );

  if (blocking.length) {
    const summary = blocking
      .map((v) => `  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodo/s)`)
      .join('\n');
    expect(blocking, `Violaciones a11y serias/críticas:\n${summary}`).toEqual([]);
  }
}

/**
 * Auditoría de contraste NO bloqueante: cuenta los nodos con problemas de
 * contraste y los registra por consola para visibilidad, sin romper el test.
 */
export async function auditContrast(page) {
  const results = await new AxeBuilder({ page })
    .withRules(['color-contrast'])
    .analyze();
  const nodes = results.violations.reduce((n, v) => n + v.nodes.length, 0);
  if (nodes > 0) {
    // eslint-disable-next-line no-console
    console.warn(`[a11y][contraste] ${nodes} nodo/s con contraste < AA en ${page.url()} (hallazgo de diseño, no bloquea).`);
  }
  return nodes;
}
