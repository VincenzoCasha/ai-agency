'use strict';

/**
 * Dashboard owner — payload compacto pensado para que el responsable
 * (en V1 una sola persona; pronto un segundo camarero) pueda ver de un
 * vistazo lo accionable del dia y de la semana sin bucear en pantallas.
 */

const pickupRepo = require('../repositories/pickup-order.repository');
const eventRepo = require('../repositories/event.repository');
const inquiryRepo = require('../repositories/inquiry.repository');
const productRepo = require('../repositories/product.repository');
const { query } = require('../../db/pool');

function startOfDayUTC(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

async function getDashboard() {
  const [
    pickupsToday,
    pickupsUpcoming,
    eventsUpcoming,
    inquiriesNew,
    productsLow,
    productsOut,
  ] = await Promise.all([
    pickupRepo.listForToday({ limit: 20 }),
    pickupRepo.listUpcomingNew({ limit: 10 }),
    eventRepo.listUpcomingActive({ limit: 5 }),
    inquiryRepo.adminPaginate({ status: 'NEW', size: 10 }),
    productRepo.adminPaginate({ stockStatus: 'LOW', size: 10 }),
    productRepo.adminPaginate({ stockStatus: 'OUT', size: 10 }),
  ]);

  return {
    pickups_today: {
      total: pickupsToday.length,
      by_status: pickupsToday.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {}),
      items: pickupsToday,
    },
    pickups_upcoming_new: pickupsUpcoming,
    events_upcoming: eventsUpcoming,
    inquiries_new: {
      total: inquiriesNew.pagination.total,
      items: inquiriesNew.items.slice(0, 10),
    },
    stock_alerts: {
      low: productsLow.items.map((p) => ({ id: p.id, slug: p.slug, name: p.name })),
      out: productsOut.items.map((p) => ({ id: p.id, slug: p.slug, name: p.name })),
    },
    quick_actions: [
      { code: 'patch_pickup_status',     label: 'Marcar pedido como CONFIRMED/READY/PICKED_UP' },
      { code: 'patch_product_stock',     label: 'Actualizar stock de un queso (IN_STOCK/LOW/OUT)' },
      { code: 'pause_pickups',           label: 'Pausar/reanudar pickups (kill switch)' },
      { code: 'reply_inquiry',           label: 'Marcar consulta como IN_PROGRESS/DONE' },
    ],
  };
}

async function getKpis({ period = '7d' } = {}) {
  const now = new Date();
  const end = now.toISOString().slice(0, 19).replace('T', ' ');
  const days = period === '30d' ? 30 : period === 'today' ? 1 : 7;
  const fromDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const from = startOfDayUTC(fromDate).toISOString().slice(0, 19).replace('T', ' ');

  const [pickupNew, pickupConfirmed, pickupReady, pickupPickedUp, pickupCancelled] = await Promise.all([
    pickupRepo.countByStatusInPeriod({ status: 'NEW', from, to: end }),
    pickupRepo.countByStatusInPeriod({ status: 'CONFIRMED', from, to: end }),
    pickupRepo.countByStatusInPeriod({ status: 'READY', from, to: end }),
    pickupRepo.countByStatusInPeriod({ status: 'PICKED_UP', from, to: end }),
    pickupRepo.countByStatusInPeriod({ status: 'CANCELLED', from, to: end }),
  ]);

  const totalOrders = pickupNew.count + pickupConfirmed.count + pickupReady.count + pickupPickedUp.count;
  const completedRevenue = pickupPickedUp.revenue_cents;
  const avgTicketCents = pickupPickedUp.count
    ? Math.round(completedRevenue / pickupPickedUp.count)
    : 0;

  // Reservas y newsletter en el mismo periodo
  const [reservationRows, newsletterRows, inquiriesNewRows] = await Promise.all([
    query(
      'SELECT COUNT(*) AS n FROM event_reservation WHERE created_at BETWEEN ? AND ?',
      [from, end],
    ),
    query(
      `SELECT COUNT(*) AS n FROM newsletter_subscriber
       WHERE status = 'ACTIVE' AND consent_at BETWEEN ? AND ?`,
      [from, end],
    ),
    query(
      `SELECT COUNT(*) AS n FROM inquiry
       WHERE created_at BETWEEN ? AND ? AND status = 'NEW'`,
      [from, end],
    ),
  ]);

  // Total newsletter active (acumulado)
  const totalNewsletterRows = await query(
    "SELECT COUNT(*) AS n FROM newsletter_subscriber WHERE status = 'ACTIVE'",
  );
  const totalActiveNewsletter = Number(totalNewsletterRows[0]?.n || 0);

  return {
    period,
    from,
    to: end,
    pickup: {
      total_orders: totalOrders,
      by_status: {
        NEW: pickupNew.count,
        CONFIRMED: pickupConfirmed.count,
        READY: pickupReady.count,
        PICKED_UP: pickupPickedUp.count,
        CANCELLED: pickupCancelled.count,
      },
      completed_revenue_cents: completedRevenue,
      avg_ticket_cents: avgTicketCents,
    },
    events: {
      reservations: Number(reservationRows[0]?.n || 0),
    },
    newsletter: {
      new_subscribers_in_period: Number(newsletterRows[0]?.n || 0),
      total_active: totalActiveNewsletter,
    },
    inquiries: {
      new_in_period: Number(inquiriesNewRows[0]?.n || 0),
    },
  };
}

module.exports = { getDashboard, getKpis };
