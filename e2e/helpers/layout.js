import { expect } from '@playwright/test';

/**
 * Proxy de "no hay solapes/overflow obvios en móvil": el documento no debe
 * desbordar horizontalmente el viewport. Un overflow lateral suele delatar
 * elementos que se salen o se solapan en pantallas pequeñas.
 *
 * Se permite 1px de tolerancia por redondeos de subpíxel.
 */
export async function expectNoHorizontalScroll(page) {
  const overflow = await page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
  expect(overflow, 'El contenido desborda horizontalmente el viewport (posible solape móvil)').toBeLessThanOrEqual(1);
}

/**
 * Tap targets: los enlaces de navegación de la cabecera deben medir al menos
 * `min` px de alto (CRUDO usa min-h-[44px] en el header). Comprobamos solo la
 * navegación principal — es estable y representativa del estándar de toque.
 */
export async function expectNavTapTargets(page, min = 44) {
  const banner = page.getByRole('banner');
  const links = banner.getByRole('link');
  const count = await links.count();
  expect(count, 'La cabecera no expone enlaces de navegación').toBeGreaterThan(0);

  for (let i = 0; i < count; i += 1) {
    const link = links.nth(i);
    if (!(await link.isVisible())) continue;
    const box = await link.boundingBox();
    if (!box) continue;
    expect(
      Math.round(box.height),
      `Enlace de navegación #${i} mide ${Math.round(box.height)}px (< ${min}px)`,
    ).toBeGreaterThanOrEqual(min);
  }
}
