import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { RetroSign } from '../brand/RetroSign';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import { trackWhatsAppClick, trackGenerateLead } from '../../lib/analytics';

const PRIVATE_EVENT_WHATSAPP_TEXT =
  'Hola CRUDO, me interesa hacer un evento privado. ¿Podemos hablar?';

export function CelebraStrip({ siteConfig }) {
  const email = siteConfig?.contact?.email || 'crudomov@gmail.com';
  const whatsapp = siteConfig?.contact?.whatsapp_public;
  const mailto = `mailto:${email}?subject=${encodeURIComponent('Evento privado en CRUDO')}`;

  return (
    <section
      aria-labelledby="celebra-heading"
      className="border-t border-border bg-bg-secondary"
    >
      <div className="container-page py-12 md:py-16 max-w-2xl">
        <RetroSign text="Privatizaciones" size="sm" className="mb-3" />
        <h2
          id="celebra-heading"
          className="font-display italic text-3xl md:text-4xl text-text-primary leading-tight"
        >
          Si tienes un evento y quieres hacerlo en CRUDO, ponte en contacto.
        </h2>
        <p className="mt-3 text-text-secondary">
          Cumpleaños, reuniones de equipo, catas privadas. Escríbenos por email
          o WhatsApp y te contamos disponibilidad y opciones.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            as="a"
            href={mailto}
            onClick={() => trackGenerateLead({ form: 'private_event_email' })}
            variant="primary"
            size="lg"
          >
            <Mail size={18} aria-hidden="true" />
            {email}
          </Button>
          {whatsapp ? (
            <Button
              as="a"
              href={buildWhatsAppUrl(whatsapp, PRIVATE_EVENT_WHATSAPP_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ source: 'private_event' })}
              variant="secondary"
              size="lg"
            >
              <MessageCircle size={18} aria-hidden="true" />
              WhatsApp
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
