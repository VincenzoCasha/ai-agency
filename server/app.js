'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const healthRoutes = require('./routes/health.routes');
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

// Rate limit on all public API POST endpoints
const publicPostLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
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

// Routes
app.use('/api/v1/health', healthRoutes);

// 404 — must come after all routes
app.use(notFound);

// Error handler — must be last
app.use(errorHandler);

module.exports = app;
