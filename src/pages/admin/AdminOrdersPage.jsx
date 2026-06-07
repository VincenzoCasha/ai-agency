import React, { useEffect, useState } from 'react';
import { adminResources } from '../../lib/adminApi';

const STATUS_LABEL = {
  NEW: 'Nuevo',
  CONFIRMED: 'Confirmado',
  READY: 'Listo',
  PICKED_UP: 'Recogido',
  CANCELLED: 'Cancelado',
};

// Siguiente acción natural por estado (flujo operativo simple).
const NEXT_ACTION = {
  NEW: [{ to: 'CONFIRMED', label: 'Confirmar' }, { to: 'CANCELLED', label: 'Cancelar' }],
  CONFIRMED: [{ to: 'READY', label: 'Listo' }, { to: 'CANCELLED', label: 'Cancelar' }],
  READY: [{ to: 'PICKED_UP', label: 'Recogido' }],
  PICKED_UP: [],
  CANCELLED: [],
};

function formatWhen(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

export default function AdminOrdersPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  function load() {
    setError(null);
    adminResources
      .pickupOrders({ size: 50 })
      .then((d) => setItems(d.items || []))
      .catch((e) => setError(e?.detail || 'No se pudieron cargar los pedidos.'));
  }

  useEffect(() => {
    document.title = 'Pedidos · Admin CRUDO';
    load();
  }, []);

  async function changeStatus(order, status) {
    setSavingId(order.id);
    try {
      await adminResources.setPickupStatus(order.id, status);
      setItems((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    } catch (e) {
      setError(e?.detail || 'No se pudo actualizar el pedido.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl text-text-primary">Pedidos</h1>
      {error ? <p role="alert" className="text-sm text-error">{error}</p> : null}
      {!items ? (
        <p className="text-sm text-text-muted">Cargando…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-text-muted">No hay pedidos.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((o) => {
            const actions = NEXT_ACTION[o.status] || [];
            return (
              <li key={o.id} className="bg-bg-secondary border border-border rounded-md p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-lg text-text-primary truncate">
                      {o.customer_name || o.code || `Pedido ${o.id}`}
                    </p>
                    <p className="text-xs text-text-muted">
                      {o.code ? `${o.code} · ` : ''}
                      {formatWhen(o.pickup_at || o.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-text-secondary">
                    {STATUS_LABEL[o.status] || o.status}
                  </span>
                </div>
                {actions.length ? (
                  <div className="flex gap-2 flex-wrap">
                    {actions.map((a) => (
                      <button
                        key={a.to}
                        type="button"
                        disabled={savingId === o.id}
                        onClick={() => changeStatus(o, a.to)}
                        className={[
                          'min-h-[40px] px-3 rounded-md text-sm font-semibold border transition-colors disabled:opacity-50',
                          a.to === 'CANCELLED'
                            ? 'border-border text-text-secondary hover:border-error hover:text-error'
                            : 'bg-accent text-text-inverse border-accent hover:bg-accent-hover',
                        ].join(' ')}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
