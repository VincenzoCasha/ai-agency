import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RetroSign } from '../components/brand/RetroSign';
import { TablaSummary } from '../components/tabla/TablaSummary';
import { TablaEmptyState } from '../components/tabla/TablaEmptyState';
import { AlcoholBlockedNotice } from '../components/tabla/AlcoholBlockedNotice';
import { PickupForm } from '../components/tabla/PickupForm';
import { useTablaDraft } from '../hooks/useTablaDraft';
import { useSiteConfig } from '../hooks/useSiteConfig';
import {
  hydrate as hydrateDraft,
  getPayloadItems,
} from '../lib/tablaDraft';

export default function MyTablaPage() {
  const navigate = useNavigate();
  const {
    items,
    count,
    totalCents,
    removeItem,
    setQuantity,
  } = useTablaDraft();
  const { config } = useSiteConfig();

  const [removedAlcohol, setRemovedAlcohol] = useState([]);

  useEffect(() => {
    document.title = 'Mi Tabla · CRUDO';
    // Sanitiza al entrar — alcohol guard a la entrada de la página.
    const before = (items || []).filter((i) => i?.is_alcohol === true);
    hydrateDraft();
    if (before.length > 0) setRemovedAlcohol(before);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSuccess = ({ confirmation, request }) => {
    // Limpia tabla y navega a confirmación con state.
    // No persistimos al servidor desde aquí: confirmation viene de POST 201.
    navigate('/mi-tabla/confirmacion', {
      replace: true,
      state: { confirmation, request },
    });
  };

  const hasAlcohol = useMemo(() => items.some((i) => i?.is_alcohol === true), [items]);

  return (
    <main className="container-page py-10 md:py-16">
      <header className="max-w-prose">
        <RetroSign text="Mi Tabla" size="sm" className="mb-3" />
        <h1 className="font-display italic text-4xl sm:text-5xl text-text-primary leading-tight">
          Tu selección para llevar.
        </h1>
        <p className="mt-3 text-text-secondary text-lg">
          Reserva tu tabla aquí y la pagas en CRUDO al recoger. Te confirmamos
          por WhatsApp en menos de 24 horas.
        </p>
      </header>

      {removedAlcohol.length > 0 || hasAlcohol ? (
        <div className="mt-6">
          <AlcoholBlockedNotice removed={removedAlcohol} />
        </div>
      ) : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 items-start">
        <section
          aria-labelledby="tabla-resumen-heading"
          className="bg-bg-secondary border border-border rounded-md p-5 md:p-6"
        >
          <h2 id="tabla-resumen-heading" className="text-sm uppercase tracking-eyebrow text-text-muted mb-4">
            Tu tabla ({count})
          </h2>
          {count === 0 ? (
            <TablaEmptyState />
          ) : (
            <TablaSummary
              items={items}
              totalCents={totalCents}
              onRemove={(it) => removeItem(it.id)}
              onIncrement={(it) => setQuantity(it.id, (it.quantity || 1) + 1)}
              onDecrement={(it) => setQuantity(it.id, Math.max(1, (it.quantity || 1) - 1))}
            />
          )}
        </section>

        <section aria-labelledby="tabla-pickup-heading">
          <h2 id="tabla-pickup-heading" className="text-sm uppercase tracking-eyebrow text-text-muted mb-4">
            Datos de recogida
          </h2>
          {count === 0 ? (
            <p className="text-text-secondary">
              Añade algún queso a la tabla para poder reservar.
            </p>
          ) : (
            <PickupForm
              items={items}
              totalCents={totalCents}
              hours={config?.hours}
              getPayloadItems={getPayloadItems}
              onSuccess={onSuccess}
            />
          )}
        </section>
      </div>
    </main>
  );
}
