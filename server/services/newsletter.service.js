'use strict';

/**
 * Newsletter service.
 *
 * Diseñado para soportar Brevo o un proveedor equivalente, pero en V1
 * funciona con un adaptador noop si no hay `BREVO_API_KEY`. La fuente de
 * verdad sigue siendo MariaDB; el proveedor externo es secundario.
 */

const newsletterRepo = require('../repositories/newsletter.repository');
const env = require('../config/env');

const provider = createProvider();

function createProvider() {
  if (process.env.BREVO_API_KEY || env.BREVO_API_KEY) {
    // Adaptador real pendiente de implementacion en una fase posterior.
    // Mantenemos misma interfaz para que el contrato no cambie.
    return {
      name: 'brevo-pending',
      async addSubscriber({ email, source }) {
        // Placeholder hasta tener el cliente real; logueamos para auditar.
        if (env.NODE_ENV !== 'test') {
           
          console.log(`[newsletter] (brevo placeholder) addSubscriber email=${email} source=${source}`);
        }
        return { ok: true, providerStatus: 'PENDING_REAL_INTEGRATION' };
      },
    };
  }
  return {
    name: 'noop',
    async addSubscriber({ email, source }) {
      if (env.NODE_ENV === 'development') {
         
        console.log(`[newsletter] (noop) ${email} source=${source}`);
      }
      return { ok: true, providerStatus: 'NOOP' };
    },
  };
}

async function subscribe({ email, source, ip }) {
  const result = await newsletterRepo.upsertActive({ email, source, ip });
  let providerResult = { ok: true, providerStatus: 'SKIPPED' };
  try {
    providerResult = await provider.addSubscriber({ email, source });
  } catch (err) {
    // No bloqueamos al usuario por fallo del proveedor; solo log.
    if (env.NODE_ENV !== 'test') {
       
      console.warn(`[newsletter] provider error: ${err.message}`);
    }
    providerResult = { ok: false, providerStatus: 'PROVIDER_ERROR' };
  }
  return { ...result, provider: provider.name, providerResult };
}

module.exports = { subscribe, _provider: provider };
