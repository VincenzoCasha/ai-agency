import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { trackWhatsAppClick } from '../../lib/analytics';

const CAJITAS = [
  {
    id: 'c2',
    label: 'Cajita 2 quesos',
    cheeses: 2,
    price: 20,
    description: 'Perfecta para el día a día.',
  },
  {
    id: 'c3',
    label: 'Cajita 3 quesos',
    cheeses: 3,
    price: 30,
    description: 'Una selección variada para compartir.',
  },
  {
    id: 'c4',
    label: 'Cajita 4 quesos',
    cheeses: 4,
    price: 45,
    description: 'Para los que quieren probar más.',
  },
  {
    id: 'c6',
    label: 'Cajita 6 quesos',
    cheeses: 6,
    price: 60,
    description: 'El detalle perfecto para tus seres queridos.',
  },
];

function buildWhatsappUrl(number, cajita) {
  const clean = (number || '').replace(/[^0-9]/g, '');
  const text = encodeURIComponent(
    `Hola, quiero reservar una ${cajita.label} (${cajita.price}€) para pasar a elegir los quesos en tienda.`,
  );
  return `https://wa.me/${clean}?text=${text}`;
}

function buildTablaUrl(number) {
  const clean = (number || '').replace(/[^0-9]/g, '');
  const text = encodeURIComponent(
    'Hola, me gustaría información sobre una tabla de quesos artesanales personalizada.',
  );
  return `https://wa.me/${clean}?text=${text}`;
}

export function CajitasSection() {
  const { config } = useSiteConfig();
  const whatsapp = config?.contact?.whatsapp_public || '+34 650 13 18 61';

  return (
    <section aria-labelledby="cajitas-heading" className="pt-12 pb-16 border-t border-border">
      <header className="mb-8 max-w-prose">
        <p className="eyebrow mb-3">Para llevar</p>
        <h2
          id="cajitas-heading"
          className="font-display text-3xl md:text-4xl text-text-primary leading-tight"
        >
          Para el día a día o un detalle para tus seres queridos.
        </h2>
        <p className="mt-4 text-text-secondary">
          Elige el tamaño, resérvala por WhatsApp y pasa a elegir tus quesos directamente en
          tienda. Todas las cajitas incluyen frutos secos de acompañamiento.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CAJITAS.map((cajita) => (
          <a
            key={cajita.id}
            href={buildWhatsappUrl(whatsapp, cajita)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ source: 'cajitas', label: cajita.id })}
            className="group flex flex-col gap-4 rounded-lg border border-border bg-bg-elevated p-5 hover:border-gold transition-colors min-h-[44px]"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">
                {cajita.cheeses} quesos · frutos secos
              </p>
              <h3 className="mt-1 font-semibold text-text-primary text-lg">{cajita.label}</h3>
              <p className="mt-1 text-sm text-text-secondary">{cajita.description}</p>
            </div>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-display text-3xl text-text-primary">{cajita.price}€</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold group-hover:underline">
                <MessageCircle size={14} aria-hidden="true" />
                Pedir
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* CTA tabla artesanal */}
      <div className="mt-6 rounded-lg bg-bg-elevated border border-border p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="max-w-prose">
          <p className="font-semibold text-text-primary">
            ¿Quieres una tabla de quesos artesanales?
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Si quieres una tabla con mayor variedad y selección personalizada, cuéntanos qué
            buscas por WhatsApp y te ayudamos.
          </p>
        </div>
        <a
          href={buildTablaUrl(whatsapp)}
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
