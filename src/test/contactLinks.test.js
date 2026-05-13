import { describe, it, expect } from 'vitest';
import { getContactLinks } from '../lib/contactLinks';

describe('getContactLinks', () => {
  it('returns null fields when siteConfig is empty', () => {
    const links = getContactLinks({});
    expect(links.whatsapp).toBeNull();
    expect(links.maps).toBeNull();
    expect(links.instagram).toBeNull();
  });

  it('builds whatsapp wa.me URL when whatsapp_public is set', () => {
    const links = getContactLinks({ contact: { whatsapp_public: '+34600111222' } });
    expect(links.whatsapp).toMatch(/wa\.me\/34600111222/);
  });

  it('whatsappWithText prefills text', () => {
    const links = getContactLinks({ contact: { whatsapp_public: '+34600111222' } });
    const url = links.whatsappWithText('Hola CRUDO');
    expect(decodeURIComponent(url)).toContain('Hola CRUDO');
  });

  it('passes maps and instagram through', () => {
    const links = getContactLinks({
      contact: {
        google_maps_url: 'https://maps.example/crudo',
        instagram: 'https://instagram.com/crudomov',
      },
    });
    expect(links.maps).toBe('https://maps.example/crudo');
    expect(links.instagram).toBe('https://instagram.com/crudomov');
  });
});
