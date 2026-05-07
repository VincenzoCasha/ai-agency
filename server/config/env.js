'use strict';

require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),

  CLIENT_DEV_URL: process.env.CLIENT_DEV_URL || 'http://localhost:5173',
  CORS_ALLOWED_ORIGINS: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
  DB_NAME: process.env.DB_NAME || 'crudo',
  DB_USER: process.env.DB_USER || 'crudo',
  DB_PASSWORD: process.env.DB_PASSWORD || '',

  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || '',

  UPLOADS_DIR: process.env.UPLOADS_DIR || 'uploads',
  MAX_UPLOAD_MB: parseInt(process.env.MAX_UPLOAD_MB || '8', 10),

  OWNER_WHATSAPP: process.env.OWNER_WHATSAPP || '',
  OWNER_EMAIL: process.env.OWNER_EMAIL || '',
};

if (env.NODE_ENV === 'production') {
  const required = ['JWT_SECRET', 'COOKIE_SECRET', 'DB_PASSWORD'];
  const missing = required.filter((k) => !env[k]);
  if (missing.length) {
    throw new Error(`Missing required env vars in production: ${missing.join(', ')}`);
  }
}

module.exports = env;
