import { buildGenericUrl, buildWhatsAppUrl } from './whatsapp';

/**
 * Construye URLs de contacto consistentes desde `siteConfig`. Si el campo
 * correspondiente no está, devuelve `null` para que la UI no renderice el CTA.
 */
export function getContactLinks(siteConfig) {
  const whatsapp = siteConfig?.contact?.whatsapp_public || null;
  const maps = siteConfig?.contact?.google_maps_url || null;
  const instagram = siteConfig?.contact?.instagram || null;

  return {
    whatsapp: whatsapp ? buildGenericUrl(whatsapp) : null,
    whatsappWithText: (text) => (whatsapp ? buildWhatsAppUrl(whatsapp, text) : null),
    maps,
    instagram,
  };
}
