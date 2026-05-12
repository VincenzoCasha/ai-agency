'use strict';

const campaignService = require('../services/campaign.service');
const { createProblem } = require('../utils/problem');

async function getActive(req, res) {
  const campaign = await campaignService.getActiveWithProducts();
  // Contrato: si no hay campana activa devolvemos 200 con `campaign: null`
  // para que el frontend pueda renderizar fallback sin gestionar 404.
  res.json({ campaign });
}

async function getBySlug(req, res) {
  const campaign = await campaignService.getActiveBySlugWithProducts(req.params.slug);
  if (!campaign) {
    return res.status(404).type('application/problem+json').json(
      createProblem({
        status: 404,
        title: 'Not Found',
        detail: 'Campana no encontrada o inactiva.',
        instance: req.path,
      }),
    );
  }
  res.json(campaign);
}

module.exports = { getActive, getBySlug };
