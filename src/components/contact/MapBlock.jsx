import React from 'react';
import { MapPin } from 'lucide-react';

/**
 * Bloque de mapa. Si `siteConfig.contact.google_maps_embed_url` existe
 * (formato src del iframe), se muestra; si no, fallback a un link al mapa
 * con iconografía clara. Nunca renderiza un iframe sin URL.
 */
export function MapBlock({ siteConfig }) {
  const embed = siteConfig?.contact?.google_maps_embed_url || null;
  const link = siteConfig?.contact?.google_maps_url || null;
  const address = siteConfig?.address || null;

  if (embed) {
    return (
      <div className="rounded-md overflow-hidden border border-border" style={{ aspectRatio: '16 / 9' }}>
        <iframe
          src={embed}
          title="Mapa de CRUDO en Madrid"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    );
  }

  if (!link && !address) return null;

  return (
    <div className="rounded-md border border-border bg-bg-secondary p-5">
      <p className="text-sm uppercase tracking-eyebrow text-text-muted mb-2 flex items-center gap-1.5">
        <MapPin size={14} aria-hidden="true" /> Dirección
      </p>
      {address ? (
        <p className="text-text-primary">{address}</p>
      ) : null}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-gold hover:underline"
        >
          Abrir en Google Maps
        </a>
      ) : null}
    </div>
  );
}
