import React from 'react';
import { MapPin, Clock, MessageCircle } from 'lucide-react';
import { trackMapsClick, trackWhatsAppClick } from '../../lib/analytics';
import { buildGenericUrl } from '../../lib/whatsapp';
import { RetroSign } from '../brand/RetroSign';
import { LifestylePhoto } from '../brand/LifestylePhoto';

const DAY_LABELS = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado',
  sun: 'Domingo',
};

export function VisitBlock({ siteConfig }) {
  const address = siteConfig?.address;
  const maps = siteConfig?.contact?.google_maps_url;
  const whatsapp = siteConfig?.contact?.whatsapp_public;
  const hours = siteConfig?.hours;
  const notes = hours?.notes;

  return (
    <section
      aria-labelledby="visit-heading"
      className="container-page py-12 md:py-20"
    >
      <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">
        <div>
          <RetroSign text="Visítanos" size="sm" className="mb-3" />
          <h2
            id="visit-heading"
            className="font-display italic text-3xl md:text-4xl text-text-primary"
          >
            Pásate por la tienda.
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-prose">
            Estamos en pleno centro de Madrid. Si vienes, te ayudamos a elegir y
            te montamos la tabla al momento. Si reservas online, la recoges en
            tienda y pagas allí.
          </p>
          <LifestylePhoto
            src="/img/lifestyle/bodegon-cartel-crudo-pro.jpg"
            alt="Botellas, copas y cartel retroiluminado de CRUDO en el local"
            aspectRatio="aspect-[4/3]"
            className="mt-6 rounded-md border border-border"
          />
          <div className="mt-7 flex flex-wrap gap-3">
            {maps ? (
              <a
                href={maps}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackMapsClick({ source: 'visit_block' })}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-md border border-border-strong text-text-primary hover:border-gold"
              >
                <MapPin size={16} aria-hidden="true" />
                Cómo llegar
              </a>
            ) : null}
            {whatsapp ? (
              <a
                href={buildGenericUrl(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ source: 'visit_block' })}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-md border border-border-strong text-text-primary hover:border-gold"
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
        <dl className="bg-bg-secondary border border-border rounded-md p-6 md:p-8 space-y-5">
          {address ? (
            <div>
              <dt className="eyebrow text-text-muted text-[0.65rem] mb-1 flex items-center gap-1.5">
                <MapPin size={13} aria-hidden="true" /> Dirección
              </dt>
              <dd className="text-text-primary">{address}</dd>
            </div>
          ) : null}
          {hours ? (
            <div>
              <dt className="eyebrow text-text-muted text-[0.65rem] mb-2 flex items-center gap-1.5">
                <Clock size={13} aria-hidden="true" /> Horario
              </dt>
              <dd>
                <ul className="text-sm space-y-1 font-mono text-text-secondary">
                  {Object.keys(DAY_LABELS).map((key) => {
                    const value = hours[key];
                    if (!value) return null;
                    return (
                      <li key={key} className="flex justify-between gap-4">
                        <span className="text-text-primary">{DAY_LABELS[key]}</span>
                        <span>{value}</span>
                      </li>
                    );
                  })}
                </ul>
                {notes ? (
                  <p className="mt-3 text-xs text-text-muted italic">{notes}</p>
                ) : null}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </section>
  );
}
