import React from 'react';
import { Clock } from 'lucide-react';
import { RetroSign } from '../components/brand/RetroSign';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import { ContactForm } from '../components/forms/ContactForm';
import { ContactCtas } from '../components/contact/ContactCtas';
import { MapBlock } from '../components/contact/MapBlock';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { useSeo } from '../hooks/useSeo';

const DAY_LABELS = {
  mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves',
  fri: 'Viernes', sat: 'Sábado', sun: 'Domingo',
};

export default function ContactPage() {
  const { config } = useSiteConfig();
  const hours = config?.hours || {};

  useSeo({
    title: 'Contacto',
    description:
      'Visítanos en Calle Ortega y Gasset 81, Madrid. Horario, WhatsApp, email e Instagram de CRUDO.',
    path: '/contacto',
  });

  return (
    <main>
      <section
        aria-labelledby="contact-heading"
        className="relative isolate overflow-hidden border-b border-border"
        style={{ minHeight: '45vh' }}
      >
        <ResponsiveImage
          assetId="contacto-local"
          sizes="100vw"
          eager
          decorative
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          style={{ filter: 'brightness(1.08) contrast(1.06) saturate(1.05)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(180deg, rgba(26,31,20,0.15) 0%, rgba(26,31,20,0.45) 55%, rgba(26,31,20,0.78) 100%)' }}
        />
        <div className="container-page flex flex-col justify-end pt-20 pb-12 md:min-h-[45vh] md:py-16">
          <RetroSign text="Visítanos" size="sm" className="self-start mb-4" />
          <h1
            id="contact-heading"
            className="font-display text-4xl md:text-6xl text-text-inverse leading-[1.05] max-w-2xl"
          >
            Pásate por la tienda o escríbenos.
          </h1>
          <p className="mt-4 text-text-inverse opacity-90 text-lg max-w-prose">
            Estamos en pleno centro de Madrid. Si vienes, te ayudamos a elegir
            y te montamos la tabla al momento.
          </p>
        </div>
      </section>

      <section className="container-page py-12 md:py-16 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 items-start">
        <div>
          <h2 className="text-sm uppercase tracking-eyebrow text-text-muted mb-4">
            Escríbenos
          </h2>
          <ContactForm />
        </div>

        <aside className="space-y-6">
          <ContactCtas siteConfig={config} source="contact_page_aside" />
          <MapBlock siteConfig={config} />
          <div className="rounded-md border border-border bg-bg-secondary p-5">
            <p className="text-sm uppercase tracking-eyebrow text-text-muted mb-3 flex items-center gap-1.5">
              <Clock size={14} aria-hidden="true" /> Horario
            </p>
            <ul className="text-sm space-y-1 font-mono text-text-secondary">
              {Object.entries(DAY_LABELS).map(([key, label]) => (
                <li key={key} className="flex justify-between gap-4">
                  <span className="text-text-primary">{label}</span>
                  <span>{hours[key] || '—'}</span>
                </li>
              ))}
            </ul>
            {hours.notes ? (
              <p className="mt-3 text-xs text-text-muted italic">{hours.notes}</p>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
