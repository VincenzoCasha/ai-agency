import { describe, it, expect } from 'vitest';
import {
  buildWhatsAppUrl,
  buildProductInquiryUrl,
  buildTableInquiryUrl,
  buildGenericUrl,
} from '../lib/whatsapp';

describe('whatsapp helpers', () => {
  it('builds a wa.me URL with the phone number and encoded text', () => {
    const url = buildWhatsAppUrl('+34 600 123 456', 'Hola, ¿abrís hoy?');
    expect(url).toMatch(/^https:\/\/wa\.me\/34600123456\?text=/);
    expect(url).toContain(encodeURIComponent('Hola, ¿abrís hoy?'));
  });

  it('falls back to no-number wa.me when phone is missing', () => {
    const url = buildWhatsAppUrl('', 'Hola');
    expect(url).toMatch(/^https:\/\/wa\.me\/\?text=/);
  });

  it('buildProductInquiryUrl includes the product name in the message', () => {
    const url = buildProductInquiryUrl('Cabra payoyo', '+34600123456');
    expect(decodeURIComponent(url)).toContain('Cabra payoyo');
    expect(decodeURIComponent(url)).toContain('disponible en CRUDO');
  });

  it('buildTableInquiryUrl and buildGenericUrl produce wa.me links', () => {
    expect(buildTableInquiryUrl('+34600123456')).toMatch(/wa\.me\/34600123456/);
    expect(buildGenericUrl('+34600123456')).toMatch(/wa\.me\/34600123456/);
  });
});
