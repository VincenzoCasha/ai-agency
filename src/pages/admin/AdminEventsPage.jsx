import React, { useEffect, useState } from 'react';
import { adminResources } from '../../lib/adminApi';

function formatDate(iso) {
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

export default function AdminEventsPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Eventos · Admin CRUDO';
    let active = true;
    adminResources
      .events({ size: 50 })
      .then((d) => active && setItems(d.items || []))
      .catch((e) => active && setError(e?.detail || 'No se pudieron cargar los eventos.'));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl text-text-primary">Eventos</h1>
      {error ? <p role="alert" className="text-sm text-error">{error}</p> : null}
      {!items ? (
        <p className="text-sm text-text-muted">Cargando…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-text-muted">No hay eventos.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((ev) => (
            <li
              key={ev.id}
              className="bg-bg-secondary border border-border rounded-md p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-display text-lg text-text-primary truncate">{ev.title}</p>
                <p className="text-xs text-text-muted">{formatDate(ev.starts_at)}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-text-muted">
                {ev.is_active === false ? 'Oculto' : 'Publicado'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
