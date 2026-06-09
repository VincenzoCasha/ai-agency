import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PickupSuccess } from '../components/tabla/PickupSuccess';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { clearDraft } from '../lib/tablaDraft';

export default function MyTablaConfirmationPage() {
  const { state } = useLocation();
  const { config } = useSiteConfig();
  const confirmation = state?.confirmation;

  useEffect(() => {
    document.title = 'Reserva recibida · CRUDO';
    if (confirmation) clearDraft();
  }, [confirmation]);

  if (!confirmation) {
    return (
      <article className="container-page py-12 md:py-16 max-w-2xl">
        <h1 className="font-display text-3xl md:text-4xl text-text-primary leading-tight">
          No encontramos tu reserva.
        </h1>
        <p className="mt-4 text-text-secondary text-lg">
          Si acabas de hacer una reserva, ya te confirmaremos por WhatsApp. Si
          aún no has reservado, vuelve a montar tu cesta.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/mi-tabla" className="underline text-text-primary">
            Volver a Mi Cesta
          </Link>
          <Link to="/catalogo" className="underline text-text-primary">
            Ver catálogo
          </Link>
        </div>
      </article>
    );
  }

  return <PickupSuccess confirmation={confirmation} siteConfig={config} />;
}
