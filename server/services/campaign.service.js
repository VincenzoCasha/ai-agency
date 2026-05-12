'use strict';

const campaignRepo = require('../repositories/campaign.repository');

async function getActiveWithProducts() {
  const campaign = await campaignRepo.findActiveCampaign();
  if (!campaign) return null;
  const products = await campaignRepo.listProducts(campaign.id);
  return { ...campaign, products };
}

async function getActiveBySlugWithProducts(slug) {
  const campaign = await campaignRepo.findActiveBySlug(slug);
  if (!campaign) return null;
  const products = await campaignRepo.listProducts(campaign.id);
  return { ...campaign, products };
}

module.exports = { getActiveWithProducts, getActiveBySlugWithProducts };
