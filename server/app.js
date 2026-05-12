'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const healthRoutes = require('./routes/health.routes');
const productsRoutes = require('./routes/products.routes');
const categoriesRoutes = require('./routes/categories.routes');
const campaignsRoutes = require('./routes/campaigns.routes');
const eventsRoutes = require('./routes/events.routes');
const inquiriesRoutes = require('./routes/inquiries.routes');
const newsletterRoutes = require('./routes/newsletter.routes');
const consentRoutes = require('./routes/consent.routes');
const siteConfigRoutes = require('./routes/site-config.routes');
const pickupOrdersRoutes = require('./routes/pickup-orders.routes');

// Admin (Fase 5)
const adminAuthRoutes = require('./routes/admin-auth.routes');
const adminDashboardRoutes = require('./routes/admin-dashboard.routes');
const adminProductsRoutes = require('./routes/admin-products.routes');
const adminEventsRoutes = require('./routes/admin-events.routes');
const adminCampaignsRoutes = require('./routes/admin-campaigns.routes');
const adminInquiriesRoutes = require('./routes/admin-inquiries.routes');
const adminPickupOrdersRoutes = require('./routes/admin-pickup-orders.routes');
const adminEventReservationsRoutes = require('./routes/admin-event-reservations.routes');
const adminSiteConfigRoutes = require('./routes/admin-site-config.routes');
const { authenticateAdmin } = require('./middleware/authenticate-admin');

const { notFound } = require('./middleware/not-found');
const { errorHandler } = require('./middleware/error-handler');

const app = express();

// Security headers
app.use(helmet());

// Logging (skip in test to keep output clean)
if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// CORS
app.use(
  cors({
    origin: env.CORS_ALLOWED_ORIGINS,
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// Static uploads (sirve `uploads/` para imagenes de producto bajo /uploads/...)
app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOADS_DIR)));

// Rate limit en POST publicos. Admin tiene su propio limiter en login.
const publicPostLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => env.NODE_ENV === 'test' || req.path.startsWith('/admin/'),
  message: {
    type: 'https://crudo.es/errors/429',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Demasiadas peticiones. Inténtalo de nuevo en unos minutos.',
  },
});
app.use('/api/v1', (req, res, next) => {
  if (req.method === 'POST') return publicPostLimiter(req, res, next);
  next();
});

// Public routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/campaigns', campaignsRoutes);
app.use('/api/v1/events', eventsRoutes);
app.use('/api/v1/inquiries', inquiriesRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1/consent', consentRoutes);
app.use('/api/v1/site', siteConfigRoutes);
app.use('/api/v1/pickup-orders', pickupOrdersRoutes);

// Admin auth (sin JWT obligatorio en login/refresh)
app.use('/api/v1/admin/auth', adminAuthRoutes);

// Admin protected: requiere JWT
app.use('/api/v1/admin', authenticateAdmin);
app.use('/api/v1/admin', adminDashboardRoutes);
app.use('/api/v1/admin/products', adminProductsRoutes);
app.use('/api/v1/admin/events', adminEventsRoutes);
app.use('/api/v1/admin/campaigns', adminCampaignsRoutes);
app.use('/api/v1/admin/inquiries', adminInquiriesRoutes);
app.use('/api/v1/admin/pickup-orders', adminPickupOrdersRoutes);
app.use('/api/v1/admin/event-reservations', adminEventReservationsRoutes);
app.use('/api/v1/admin/site', adminSiteConfigRoutes);

// 404 + error handler.
// `mountFinalHandlers` permite a `server.js` registrar la SPA estatica entre
// las rutas y estos handlers en produccion. En tests/dev se llama de inmediato.
function mountFinalHandlers() {
  app.use(notFound);
  app.use(errorHandler);
}

if (env.NODE_ENV !== 'production') {
  mountFinalHandlers();
}

module.exports = app;
module.exports.mountFinalHandlers = mountFinalHandlers;
