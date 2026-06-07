import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminResources } from '../../lib/adminApi';

function StatCard({ label, value, to }) {
  const inner = (
    <div className="bg-bg-secondary border border-border rounded-md p-4 h-full">
      <p className="font-mono text-3xl text-text-primary leading-none">{value}</p>
      <p className="text-sm text-text-secondary mt-2">{label}</p>
    </div>
  );
  return to ? (
    <Link to={to} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Inicio · Admin CRUDO';
    let active = true;
    adminResources
      .dashboard()
      .then((d) => active && setData(d))
      .catch((e) => active && setError(e?.detail || 'No se pudo cargar el panel.'));
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return <p role="alert" className="text-sm text-error">{error}</p>;
  }
  if (!data) {
    return <p className="text-sm text-text-muted">Cargando…</p>;
  }

  const pickupsToday = data.pickups_today?.total ?? 0;
  const eventsUpcoming = data.events_upcoming?.length ?? 0;
  const inquiriesNew = data.inquiries_new?.total ?? 0;
  const lowOut =
    (data.stock_alerts?.low?.length ?? 0) + (data.stock_alerts?.out?.length ?? 0);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-text-primary">Hoy en CRUDO</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Pedidos hoy" value={pickupsToday} to="/admin/pedidos" />
        <StatCard label="Eventos próximos" value={eventsUpcoming} to="/admin/eventos" />
        <StatCard label="Consultas nuevas" value={inquiriesNew} />
        <StatCard label="Alertas disponibilidad" value={lowOut} to="/admin/productos" />
      </div>

      {data.pickups_upcoming_new?.length ? (
        <section>
          <h2 className="text-sm uppercase tracking-eyebrow text-text-muted mb-2">
            Pedidos nuevos
          </h2>
          <ul className="space-y-2">
            {data.pickups_upcoming_new.slice(0, 5).map((o) => (
              <li
                key={o.id}
                className="bg-bg-secondary border border-border rounded-md p-3 flex items-center justify-between gap-3"
              >
                <span className="text-sm text-text-primary truncate">
                  {o.customer_name || o.code || `Pedido ${o.id}`}
                </span>
                <span className="font-mono text-xs text-text-muted">{o.status}</span>
              </li>
            ))}
          </ul>
          <Link to="/admin/pedidos" className="inline-block mt-3 text-sm text-accent">
            Ver todos los pedidos →
          </Link>
        </section>
      ) : null}

      {lowOut > 0 ? (
        <section>
          <h2 className="text-sm uppercase tracking-eyebrow text-text-muted mb-2">
            Disponibilidad
          </h2>
          <p className="text-sm text-text-secondary">
            {data.stock_alerts.out?.length || 0} agotados ·{' '}
            {data.stock_alerts.low?.length || 0} con pocas unidades.{' '}
            <Link to="/admin/productos" className="text-accent">
              Revisar →
            </Link>
          </p>
        </section>
      ) : null}
    </div>
  );
}
