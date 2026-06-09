import React from 'react';
import { Link } from 'react-router-dom';
import { BrandSticker } from '../brand/BrandSticker';
import { NewsletterForm } from '../forms/NewsletterForm';

const HOURS_LABELS = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miercoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sabado',
  sun: 'Domingo',
};

export function Footer({ siteConfig }) {
  const cfg = siteConfig || {};
  const hours = cfg.hours || {};
  return (
    <footer className="relative border-t border-border bg-bg-secondary mt-16">
      <div
        aria-hidden="true"
        className="hidden md:block absolute right-8 -top-10 pointer-events-none"
        title="Hecho con queso en Madrid"
      >
        <BrandSticker rotation={-12} size={84} />
      </div>
      <div className="container-page py-10 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl">CRUDO</h3>
          <p className="mt-2 text-sm text-text-secondary max-w-prose">
            {cfg.legal_name || 'CRUDO QUESOS S.L.U'}
          </p>
          <p className="mt-3 text-sm text-text-secondary">
            {cfg.address || 'Calle Jose Ortega y Gasset 81, 28006 Madrid'}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-eyebrow text-gold">Horario</h4>
          <ul className="mt-3 text-sm text-text-secondary space-y-1">
            {Object.entries(HOURS_LABELS).map(([key, label]) => (
              <li key={key} className="flex justify-between gap-4">
                <span>{label}</span>
                <span className="text-text-muted">{hours[key] || '—'}</span>
              </li>
            ))}
          </ul>
          {hours.notes ? (
            <p className="mt-3 text-xs text-text-muted">{hours.notes}</p>
          ) : null}
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-eyebrow text-gold">Visitanos</h4>
          <ul className="mt-3 text-sm text-text-secondary space-y-2">
            {cfg.contact?.google_maps_url ? (
              <li>
                <a
                  href={cfg.contact.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Como llegar
                </a>
              </li>
            ) : null}
            {cfg.contact?.whatsapp_public ? (
              <li>
                <a
                  href={`https://wa.me/${cfg.contact.whatsapp_public.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            ) : null}
            {cfg.contact?.instagram ? (
              <li>
                <a
                  href={cfg.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-eyebrow text-gold">Legal</h4>
          <ul className="mt-3 text-sm text-text-secondary space-y-2">
            <li><Link to="/aviso-legal">Aviso legal</Link></li>
            <li><Link to="/privacidad">Privacidad</Link></li>
            <li><Link to="/cookies">Cookies</Link></li>
          </ul>
          <p className="mt-4 text-xs text-text-muted">
            Consumo responsable. La venta de bebidas alcoholicas a menores de 18 años esta prohibida.
            CRUDO no vende alcohol online; los maridajes con vino se gestionan exclusivamente por WhatsApp.
          </p>
        </div>
      </div>

      <div className="border-t border-border bg-bg-elevated/40">
        <div className="container-page py-8 md:py-10 grid gap-4 md:grid-cols-[1fr_1.4fr] md:items-end">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-eyebrow text-gold">Newsletter</h4>
            <p className="mt-2 text-sm text-text-secondary max-w-prose">
              Sin spam: solo eventos, llegadas y temporada.
            </p>
          </div>
          <NewsletterForm source="footer" />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
          <span>© {new Date().getFullYear()} {cfg.legal_name || 'CRUDO QUESOS S.L.U'}. Todos los derechos reservados.</span>
          {cfg.vat_id ? <span className="opacity-50 font-mono">CIF {cfg.vat_id}</span> : null}
        </div>
      </div>
    </footer>
  );
}
