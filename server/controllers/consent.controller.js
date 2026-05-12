'use strict';

const consentService = require('../services/consent.service');

async function record(req, res) {
  const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || null;
  const userAgent = req.headers['user-agent'] || null;

  const result = await consentService.record({
    consentId: req.body.consent_id,
    analytics: req.body.analytics,
    marketing: req.body.marketing,
    preferences: req.body.preferences,
    ip,
    userAgent,
  });

  res.status(201).json({
    id: result.id,
    consent_id: req.body.consent_id,
    expires_at: result.expires_at,
  });
}

module.exports = { record };
