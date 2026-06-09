import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { trackWhatsAppClick } from '../../lib/analytics';

export function CajitasSection() {
  const { config } = useSiteConfig();
  const whatsapp = config?.contact?.whatsapp_public || '+34 650 13 18 61';
  const clean = whatsapp.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${clean}?text=${encodeURIComponent(
    'Hola, me gustaría información sobre una tabla de quesos artesanales personalizada.',
  )}`;

  return (
    <section aria-labelledby="tabla-artesanal-heading" className="pt-10 pb-16 border-t border-border">
      <div className="rounded-lg bg-bg-elevated border border-border p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="max-w-prose">
          <p id="tabla-artesanal-heading" className="font-semibold text-text-primary">
            ¿Quieres una tabla de quesos artesanales?
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Si quieres una tabla con mayor variedad y selección personalizada, cuéntanos qué
            buscas por WhatsApp y te ayudamos.
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick({ source: 'tabla-artesanal' })}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-text-primary text-bg-primary text-sm font-semibold hover:opacity-90 transition-opacity min-h-[44px]"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Hablar por WhatsApp
        </a>
      </div>
    </section>
  );
}
