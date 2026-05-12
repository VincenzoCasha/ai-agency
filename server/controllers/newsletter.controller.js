'use strict';

const newsletterService = require('../services/newsletter.service');
const notification = require('../services/notification.service');

async function subscribe(req, res) {
  const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || null;
  const result = await newsletterService.subscribe({
    email: req.body.email,
    source: req.body.source || 'web',
    ip,
  });

  if (result.created) {
    await notification.notifyNewNewsletterSubscriber({
      id: result.id,
      email: req.body.email,
      source: req.body.source || 'web',
    });
  }

  res.status(201).json({
    id: result.id,
    status: result.status,
    created: result.created,
    provider: result.provider,
  });
}

module.exports = { subscribe };
