import React, { useEffect, useState } from 'react';
import { adminResources } from '../../lib/adminApi';
import { OWNER_AVAILABILITY_OPTIONS } from '../../lib/availability';

function ProductRow({ product, onSetStock, saving }) {
  const isWine = product.is_alcohol === true || (product.type || '').toUpperCase() === 'WINE';
  return (
    <li className="bg-bg-secondary border border-border rounded-md p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-lg text-text-primary truncate">{product.name}</p>
          <p className="text-xs text-text-muted truncate">
            {[product.producer, product.region].filter(Boolean).join(' · ') || product.slug}
          </p>
        </div>
        {isWine ? (
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] bg-gold/15 text-gold px-2 py-1 rounded-pill">
            Vino · solo WhatsApp
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-eyebrow text-text-muted">Disponibilidad</span>
        <div className="flex gap-1.5 flex-wrap">
          {OWNER_AVAILABILITY_OPTIONS.map((opt) => {
            const active = (product.stock_status || 'IN_STOCK') === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={saving}
                onClick={() => onSetStock(product, opt.value)}
                className={[
                  'min-h-[40px] px-3 rounded-md text-sm font-semibold border transition-colors disabled:opacity-50',
                  active
                    ? 'bg-accent text-text-inverse border-accent'
                    : 'bg-transparent text-text-secondary border-border hover:border-border-strong',
                ].join(' ')}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </li>
  );
}

export default function AdminProductsPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [q, setQ] = useState('');

  function load(query) {
    setError(null);
    adminResources
      .products({ size: 50, q: query || undefined })
      .then((d) => setItems(d.items || []))
      .catch((e) => setError(e?.detail || 'No se pudo cargar el catálogo.'));
  }

  useEffect(() => {
    document.title = 'Catálogo · Admin CRUDO';
    load('');
  }, []);

  async function handleSetStock(product, stock_status) {
    setSavingId(product.id);
    try {
      await adminResources.setProductStock(product.id, stock_status);
      setItems((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock_status } : p)),
      );
    } catch (e) {
      setError(e?.detail || 'No se pudo actualizar la disponibilidad.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl text-text-primary">Catálogo</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(q);
        }}
        className="flex gap-2"
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar queso…"
          className="flex-1 rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </form>

      {error ? <p role="alert" className="text-sm text-error">{error}</p> : null}
      {!items ? (
        <p className="text-sm text-text-muted">Cargando…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-text-muted">No hay productos.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              onSetStock={handleSetStock}
              saving={savingId === p.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
