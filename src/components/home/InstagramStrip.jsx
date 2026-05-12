import React from 'react';
import { Instagram } from 'lucide-react';

const PLACEHOLDERS = [
  { caption: 'Tabla de manchego', tone: 'gold' },
  { caption: 'Cata privada', tone: 'accent' },
  { caption: 'Llegada de azules', tone: 'success' },
  { caption: 'Maridaje del finde', tone: 'gold' },
];

const TONE_GRADIENTS = {
  gold: 'linear-gradient(135deg, #2b2419 0%, #3a2a1e 100%)',
  accent: 'linear-gradient(135deg, #1E1C18 0%, #3A2A1E 100%)',
  success: 'linear-gradient(135deg, #1A1F14 0%, #2B3322 100%)',
};

export function InstagramStrip({ instagramUrl }) {
  return (
    <section
      aria-labelledby="instagram-heading"
      className="container-page py-12 md:py-16"
    >
      <header className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow text-gold mb-2">Día a día</p>
          <h2
            id="instagram-heading"
            className="font-display italic text-3xl md:text-4xl text-text-primary"
          >
            En Instagram
          </h2>
        </div>
        {instagramUrl ? (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
          >
            <Instagram size={16} aria-hidden="true" />
            @crudoquesos
          </a>
        ) : null}
      </header>
      <ul
        className="grid grid-cols-2 md:grid-cols-4 gap-2"
        aria-label="Placeholders de Instagram"
      >
        {PLACEHOLDERS.map((p, i) => (
          <li key={i}>
            <div
              className="rounded-md border border-border overflow-hidden flex items-end p-4"
              style={{
                aspectRatio: '1 / 1',
                background: TONE_GRADIENTS[p.tone] || TONE_GRADIENTS.gold,
              }}
              aria-hidden="true"
            >
              <span className="font-display italic text-text-secondary text-sm">
                {p.caption}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-text-muted italic">
        Vista previa editorial; la integración real con Instagram llegará más adelante.
      </p>
    </section>
  );
}
